
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import { Send, Gift, User, Bot, Loader2 } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const SYSTEM_PROMPT = `Jesteś Systemem Rekomendacji Prezentów opisanym w dokumentacji projektowej. 
Twoja rola: Analityk. Twoim celem jest znalezienie idealnego prezentu dla Odbiorcy.
Zasada działania:
1. Nie podawaj listy od razu. Najpierw zadaj 2-3 kluczowe pytania (Dla kogo? Jaka okazja? Jaki budżet?).
2. Po uzyskaniu odpowiedzi przeanalizuj je i zaproponuj 3 konkretne prezenty z krótkim uzasadnieniem.
3. Bądź uprzejmy, zwięzły i profesjonalny.`;

const App = () => {
  const [msgs, setMsgs] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: SYSTEM_PROMPT } });
    // Initial greeting
    setLoading(true);
    chatRef.current.sendMessage({ message: "Start" }).then((res: any) => {
      setMsgs([{ role: "model", text: res.text }]);
      setLoading(false);
    });
  }, []);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    setMsgs((p) => [...p, { role: "user", text: userText }]);
    setLoading(true);
    
    try {
      const res = await chatRef.current.sendMessage({ message: userText });
      setMsgs((p) => [...p, { role: "model", text: res.text }]);
    } catch (e) {
      setMsgs((p) => [...p, { role: "model", text: "Przepraszam, wystąpił błąd sieci." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 max-w-md mx-auto border-x shadow-xl">
      <header className="bg-rose-600 text-white p-4 flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/20 rounded-full"><Gift size={24} /></div>
        <div>
          <h1 className="font-bold text-lg leading-tight">System Rekomendacji</h1>
          <p className="text-xs opacity-90">Prototyp MVP (v0.1)</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-300" : "bg-rose-100 text-rose-600"}`}>
              {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl text-sm max-w-[80%] shadow-sm ${m.role === "user" ? "bg-slate-800 text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none"}`}>
              {m.text}
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
            placeholder="Opisz dla kogo szukasz prezentu..."
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
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
