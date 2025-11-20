'use client'

import React, { useState, useEffect, useRef } from "react";
import { Send, Gift, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<string>("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user profile and initialize chat
    const initChat = async () => {
      setLoading(true);
      try {
        // First, load the user profile
        const profileResponse = await fetch("/api/user-profile");
        const profileData = await profileResponse.json();
        setUserProfile(profileData.profile);

        // Then initialize the chat
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "Start" }],
          }),
        });

        if (!response.ok) {
          throw new Error("Chat initialization failed");
        }

        const data = await response.json();
        setMsgs([{ role: "assistant", content: data.message }]);
      } catch (e) {
        setMsgs([{ role: "assistant", content: "Sorry, a connection error occurred during initialization." }]);
      }
      setLoading(false);
    };

    initChat();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    
    const newUserMsg: Message = { role: "user", content: userText };
    const updatedMsgs = [...msgs, newUserMsg];
    setMsgs(updatedMsgs);
    setLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setMsgs((p) => [...p, { role: "assistant", content: data.message }]);
    } catch (e) {
      setMsgs((p) => [...p, { role: "assistant", content: "Sorry, a network error occurred." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 max-w-md mx-auto border-x shadow-xl">
      <header className="bg-rose-600 text-white p-4 flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-full"><Gift size={24} /></div>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-tight">Gift Recommendations</h1>
          <p className="text-xs opacity-90">MVP Prototype (v0.1)</p>
        </div>
        {userProfile && (
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
            Profile Loaded ✓
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-300" : "bg-rose-100 text-rose-600"}`}>
              {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm max-w-[80%] shadow-sm ${m.role === "user" ? "bg-slate-800 text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-2 ml-4 list-disc" {...props} />,
                      ol: ({node, ...props}) => <ol className="mb-2 ml-4 list-decimal" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                      code: ({node, ...props}) => <code className="bg-slate-100 px-1 rounded text-xs" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-center p-2"><Loader2 className="animate-spin text-rose-500" /></div>}
        <div ref={endRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input 
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && send()}
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe who you're looking for a gift for..."
            className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all"
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()}
            className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white p-3 rounded-full transition-colors shadow-md">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

