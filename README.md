# Gift Recommendation System

A client-side proof-of-concept application for gift recommendations using AI, built with Next.js and OpenRouter.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the root directory and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

You can get your API key from [OpenRouter](https://openrouter.ai/keys).

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Interactive chat interface for gift recommendations
- **User Profile Integration**: Automatically loads user preferences and information from external data sources
- AI-powered suggestions based on recipient details, occasion, and budget
- Smart context awareness: AI only asks about information not already in the user profile
- Markdown rendering for rich, formatted responses
- Modern, responsive UI with Tailwind CSS
- Client-side rendering for fast, interactive experience

## User Profile

The system simulates external data sources by loading user information from `data/user-profile.txt`. This file contains:
- User demographics and interests
- Shopping history and preferences
- Budget ranges
- Gift style preferences

The AI assistant uses this information to:
1. Avoid asking redundant questions (e.g., won't ask about interests if already known)
2. Make personalized recommendations based on user preferences
3. Focus questions on missing context (like occasion, recipient, etc.)

You can customize the user profile by editing `data/user-profile.txt` to test different scenarios.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenRouter** - AI API (using OpenAI SDK)
- **Lucide React** - Icons

