# Cosentus AI - Voice Agent Demo

A Next.js application showcasing Retell AI voice agents for healthcare automation.

## Features

- 🎤 **Real-time Voice Conversations** - Browser-based voice AI powered by Retell AI
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **WebRTC Integration** - Low-latency voice streaming
- 🔒 **Secure** - API keys protected server-side

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Voice AI**: Retell AI (WebRTC + Voice Agents)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Retell AI account ([sign up here](https://beta.retellai.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/akcosentus/cosentusai.git
cd cosentusai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
# Retell AI Configuration
RETELL_API_KEY=key_your_api_key_here
NEXT_PUBLIC_RETELL_AGENT_ID=agent_your_agent_id_here
```

Get these values from your [Retell AI Dashboard](https://beta.retellai.com/).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cosentusai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── retell/
│   │   │       └── register-call/    # Secure token generation
│   │   ├── page.tsx                  # Main homepage
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── hooks/
│   │   └── useRetellAgent.ts         # Retell AI voice hook
│   └── components/
│       └── animate-ui/               # UI components
├── public/                           # Static assets
└── .env.local                        # Environment variables (gitignored)
```

## Usage

### For Developers

The voice agent functionality is encapsulated in the `useRetellAgent` hook:

```typescript
import { useRetellAgent } from '@/hooks/useRetellAgent';

const { isConnected, isRecording, error, connect, disconnect } = useRetellAgent({
  agentId: 'your-agent-id',
  onStatusChange: (status) => console.log(status),
});

// Start conversation
await connect();

// End conversation
disconnect();
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RETELL_API_KEY` | Your Retell AI API key (server-side) | Yes |
| `NEXT_PUBLIC_RETELL_AGENT_ID` | Your Retell AI agent ID (client-side) | Yes |

⚠️ **Security**: Never commit `.env.local` to version control. API keys are kept server-side only.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `RETELL_API_KEY` (mark as Secret)
   - `NEXT_PUBLIC_RETELL_AGENT_ID`
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js 16+.

## Configuration

### Retell AI Agent Setup

1. Go to [Retell AI Dashboard](https://beta.retellai.com/)
2. Create or select an agent
3. Configure:
   - **Voice**: Choose from ElevenLabs, OpenAI, etc.
   - **LLM**: Set up your response engine with prompts
   - **Start Speaker**: Agent or User
   - **Begin Message**: Opening greeting (if agent speaks first)
4. Copy the Agent ID to your `.env.local`

## Troubleshooting

### Call Connects but Immediately Ends

- Check agent configuration in Retell dashboard
- Ensure agent has a voice selected
- Verify LLM/prompt is configured
- Check browser console for errors

### Microphone Not Working

- Ensure HTTPS (or localhost for development)
- Check browser permissions
- Try Chrome/Edge (best WebRTC support)

### "API key not configured" Error

- Verify `.env.local` exists and has correct values
- Restart dev server after changing env variables
- For Vercel: Check environment variables in dashboard

## Documentation

- [Retell AI Docs](https://docs.retellai.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## License

This project is proprietary software owned by Cosentus.

## Support

For issues or questions:
- Check [Retell AI Documentation](https://docs.retellai.com/)
- Contact Cosentus support

---

Built with ❤️ by Cosentus
