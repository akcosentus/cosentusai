# Cosentus AI - Voice Agent Demo & Integration Kit

A Next.js application showcasing Retell AI voice agents and AI chat for healthcare automation. Includes a headless JavaScript SDK for easy third-party integration.

## Features

- 🎤 **Real-time Voice Conversations** - Browser-based voice AI powered by Retell AI
- 💬 **AI Chat Assistant** - Powered by n8n workflow with custom AI logic
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **WebRTC Integration** - Low-latency voice streaming
- 🔒 **Secure** - API keys protected server-side, rate limiting enabled
- 📦 **Headless SDK** - Framework-agnostic voice agent library for third-party developers

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Voice AI**: Retell AI (WebRTC + Voice Agents)
- **Chat AI**: n8n workflow (flexible AI backend)
- **Deployment**: Vercel
- **SDK**: Vanilla JavaScript (works with any framework)

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
# Retell AI Configuration (for voice agents)
RETELL_API_KEY=key_your_api_key_here

# n8n Webhook Secret (for AI chat)
N8N_WEBHOOK_SECRET=cosentus-internal-2024
```

Get your Retell API key from your [Retell AI Dashboard](https://beta.retellai.com/).

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
│   │   │   ├── retell/
│   │   │   │   └── register-call/    # Secure voice token generation
│   │   │   └── assist-chat/          # AI chat proxy (n8n webhook)
│   │   ├── page.tsx                  # Main homepage with demos
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── hooks/
│   │   └── useRetellAgent.ts         # Retell AI voice hook
│   ├── config/
│   │   └── agents.ts                 # Centralized agent IDs
│   └── components/
│       └── animate-ui/               # UI components
├── lib/
│   └── cosentus-voice/               # Headless SDK for third-party devs
│       ├── cosentus-voice.js         # Main SDK file
│       └── README.md                 # SDK documentation
├── public/                           # Static assets
├── N8N_SETUP.md                      # n8n integration guide
└── .env.local                        # Environment variables (gitignored)
```

## Usage

### For Internal Development (Next.js)

The voice agent functionality is encapsulated in the `useRetellAgent` hook:

```typescript
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

const { isConnected, isRecording, error, connect, disconnect } = useRetellAgent({
  agentId: AGENTS.chloe, // or AGENTS.cindy, AGENTS.chris
  onStatusChange: (status) => console.log(status),
});

// Start conversation
await connect();

// End conversation
disconnect();
```

### For Third-Party Developers (Headless SDK)

See `lib/cosentus-voice/README.md` for complete SDK documentation.

Quick example:
```javascript
// Include the SDK
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="/lib/cosentus-voice/cosentus-voice.js"></script>

// Create and use agent
const chloe = CosentusVoice.createAgent('chloe');
await chloe.connect();
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RETELL_API_KEY` | Your Retell AI API key (server-side) | Yes |
| `N8N_WEBHOOK_SECRET` | Secret for authenticating n8n webhook requests | Yes |

⚠️ **Security**: Never commit `.env.local` to version control. API keys are kept server-side only.

**Note:** Agent IDs are centralized in `src/config/agents.ts` - no need for environment variables!

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `RETELL_API_KEY` (mark as Secret)
   - `N8N_WEBHOOK_SECRET` (mark as Secret)
4. Deploy!

**Important:** Make sure your n8n workflow is set up and active before deploying. See `N8N_SETUP.md` for details.

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js 16+.

## Configuration

### Available Voice Agents

This demo includes three pre-configured voice agents:

- **Chloe** (`agent_9d9f880dbde25925f75e5b2739`) - Cosentus info expert
- **Cindy** (`agent_4510e7416ee31ca808b8546ed7`) - Patient billing support
- **Chris** (`agent_9571fe9261e3944f33777a1406`) - Insurance claim follow-up

Agent IDs are managed in `src/config/agents.ts`. To add or update agents, edit this file.

### n8n Workflow Setup

The AI chat feature uses an n8n workflow. See `N8N_SETUP.md` for complete setup instructions.

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

### Internal Documentation
- `N8N_SETUP.md` - n8n webhook integration guide
- `lib/cosentus-voice/README.md` - Headless SDK documentation for third-party developers

### External Resources
- [Retell AI Docs](https://docs.retellai.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [n8n Docs](https://docs.n8n.io/)

## License

This project is proprietary software owned by Cosentus.

## Support

For issues or questions:
- Check [Retell AI Documentation](https://docs.retellai.com/)
- Contact Cosentus support

---

Built with ❤️ by Cosentus
