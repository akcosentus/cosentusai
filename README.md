# Cosentus AI - Voice & Chat Agent Integration Kit

Production-ready AI voice agents and chat assistant for healthcare automation. Includes a headless JavaScript SDK for seamless third-party integration.

**Live Demo:** https://cosentusai.vercel.app

---

## 🚀 For Third-Party Developers

**Integrating Cosentus AI agents into your website?**

👉 **Start here:** [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md)

### Quick Links

- 📚 [Integration Guide](docs/INTEGRATION_GUIDE.md) - Complete guide with code examples
- 🎤 [Voice SDK Docs](lib/cosentus-voice/README.md) - Detailed SDK documentation
- 📦 **SDK:** https://cosentusai.vercel.app/cosentus-voice.js

### API Endpoints

- **Voice Agents:** `https://cosentusai.vercel.app/api/retell/register-call`
- **Chat Assistant:** `https://cosentusai.vercel.app/api/assist-chat` (auto-handled by SDK)

### Available Agents

**Voice Agents:**
| Agent | Description |
|-------|-------------|
| `chloe` | Cosentus company information expert |
| `cindy` | Patient billing support specialist |
| `chris` | Insurance claim follow-up specialist |
| `cara` | Eligibility & benefits verification |
| `carly` | Prior authorization follow-up |
| `carson` | Payment reconciliation specialist |
| `cassidy` | Pre-service anesthesia cost estimates |
| `courtney` | Medical appointment scheduling |

**Chat Assistant:**
- Headless SDK - Build your own UI, SDK handles API calls
- Usage: `CosentusVoice.createChatAssistant()`

---

## 📁 Repository Structure

```
cosentusai/
├── docs/                          # Third-party developer documentation
│   ├── INTEGRATION_GUIDE.md       # 👈 START HERE
│   └── internal/                  # Internal documentation
├── lib/cosentus-voice/            # Voice agent SDK
│   ├── cosentus-voice.js          # SDK source
│   └── README.md                  # SDK documentation
├── public/
│   └── cosentus-voice.js          # Hosted SDK (CDN)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assist-chat/       # Chat API endpoint
│   │   │   └── retell/            # Voice API endpoint
│   │   └── page.tsx               # Demo homepage
│   ├── config/
│   │   └── agents.ts              # Agent ID configuration
│   └── hooks/
│       └── useRetellAgent.ts      # React voice hook
└── update-sdk.sh                  # SDK sync script
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, Tailwind CSS
- **Voice AI:** Retell AI (WebRTC)
- **Chat AI:** Retell AI chat agent
- **Deployment:** Vercel
- **SDK:** Vanilla JavaScript (framework-agnostic)

---

## 🚀 Quick Start (Internal Development)

### Prerequisites

- Node.js 18+
- Retell AI account ([sign up](https://beta.retellai.com/))
- Retell AI account (for chat and voice features)

### Installation

```bash
# Clone repository
git clone https://github.com/akcosentus/cosentusai.git
cd cosentusai

# Install dependencies
npm install

# Create .env.local
echo "RETELL_API_KEY=your_key_here" >> .env.local
# Run development server
npm run dev
```

Open http://localhost:3000

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RETELL_API_KEY` | Retell AI API key | Yes |

⚠️ Never commit `.env.local` to version control.

---

## 💻 Usage

### Internal Development (React)

```typescript
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

const { isConnected, connect, disconnect } = useRetellAgent({
  agentId: AGENTS.chloe,
  onStatusChange: (status) => console.log(status),
});

// Start conversation
await connect();

// End conversation
disconnect();
```

### Third-Party Integration (SDK)

```javascript
// Include SDK
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>

// Use agent
const chloe = CosentusVoice.createAgent('chloe');
await chloe.connect();
```

See [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md) for complete examples.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `RETELL_API_KEY`
4. Deploy

**Note:** Ensure all Retell AI agents are configured and active.

---

## 🔧 Configuration

### Agent IDs

Centralized in `src/config/agents.ts`:

```typescript
export const AGENTS = {
  chloe: 'agent_9d9f880dbde25925f75e5b2739',
  cindy: 'agent_4510e7416ee31ca808b8546ed7',
  chris: 'agent_9571fe9261e3944f33777a1406',
  cara: 'agent_f7e96fe43ce9bb611481839af8',
  carly: 'agent_a8f606995d3160a92be6874661',
  carson: 'agent_443ead51c8a35f874d0ca1a8c1',
};
```

To add/update agents, edit this file and run `./update-sdk.sh`.

### Retell AI Chat Agent

The chat agent is configured in Retell AI with agent ID `agent_90d094ac45b9da3833c3fc835b`. It's automatically integrated via the `/api/assist-chat` endpoint.

---

## 🐛 Troubleshooting

### Voice Agent Issues

- **Call ends immediately:** Check agent config in Retell dashboard
- **No microphone:** Ensure HTTPS (required for WebRTC)
- **Connection fails:** Verify `RETELL_API_KEY` in environment variables

### Chat Agent Issues

- **500 errors:** Check Retell AI agent is active
- **429 errors:** Rate limit hit (10 requests per 5 minutes)

---

## 📚 Documentation

- [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md) - Third-party integration guide
- [`lib/cosentus-voice/README.md`](lib/cosentus-voice/README.md) - SDK documentation
- [Retell AI Docs](https://docs.retellai.com/)
- [Next.js Docs](https://nextjs.org/docs)

---

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

---

## 📄 License

Proprietary software © Cosentus

---

## 📞 Support

- **Integration help:** Open a [GitHub issue](https://github.com/akcosentus/cosentusai/issues)
- **Technical support:** support@cosentus.com

---

Built with ❤️ by Cosentus
