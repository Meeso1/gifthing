import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function getUserProfile(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'user-profile.txt');
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading user profile:', error);
    return '';
  }
}

function buildSystemPrompt(userProfile: string): string {
  let prompt = `You are a Gift Recommendation System as described in the project documentation.
Your role: Analyst. Your goal is to find the perfect gift for the recipient.`;

  if (userProfile) {
    prompt += `\n\nYou have access to the following information about the user:\n\n${userProfile}\n\n`;
    prompt += `IMPORTANT: The user information above is already known. DO NOT ask about details that are already provided (such as interests, budget range, preferences, etc.). `;
  }

  prompt += `\nHow you work:
1. Don't provide a list immediately. First ask 2-3 key questions about information NOT already provided (such as: For whom is the gift? What occasion? Any specific requirements?).
2. After receiving answers, analyze them along with the user profile and suggest 3 specific gifts with brief justification.
3. Be polite, concise, and professional.
4. Use the user's known preferences and interests to make personalized recommendations.`;

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userProfile = await getUserProfile();
    const systemPrompt = buildSystemPrompt(userProfile);

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const message = completion.choices[0]?.message?.content || 'Sorry, I cannot respond right now.';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}

