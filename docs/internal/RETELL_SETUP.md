# Retell AI Setup Guide

Complete guide for setting up Retell AI voice agents in this project.

## Overview

This project uses [Retell AI](https://www.retellai.com/) for browser-based voice conversations. Retell handles:
- Voice synthesis (ElevenLabs, OpenAI, etc.)
- Speech recognition
- WebRTC connections
- LLM integration

## Prerequisites

1. **Retell AI Account**: Sign up at [beta.retellai.com](https://beta.retellai.com/)
2. **Node.js 18+**: For running the Next.js application

## Step 1: Get Your Retell Credentials

### A. Get API Key

1. Log in to [Retell Dashboard](https://beta.retellai.com/)
2. Navigate to **Settings** → **API Keys**
3. Copy your API key (starts with `key_...`)

### B. Get Agent ID

1. In Retell Dashboard, go to **Agents**
2. Select or create an agent
3. Copy the **Agent ID** (starts with `agent_...`)

## Step 2: Configure Your Agent

In the Retell Dashboard, configure your agent:

### Required Settings:

1. **Response Engine**:
   - Create or select an LLM configuration
   - Add your prompt/instructions
   - Choose model (GPT-4, Claude, etc.)

2. **Voice**:
   - Select a voice provider (ElevenLabs recommended)
   - Choose a specific voice
   - Adjust speed, temperature, etc.

3. **General Settings**:
   - **Start Speaker**: Choose "Agent" or "User"
   - **Begin Message**: If agent speaks first, add greeting
   - **Language**: Set to `en-US` or your preferred language

4. **Advanced** (Optional):
   - Responsiveness, interruption sensitivity
   - Backchannel, ambient sound
   - End call timeout

### Test Your Agent:

Use the "Test" button in Retell dashboard to verify it works before integrating.

## Step 3: Set Up Environment Variables

### Local Development

Create `.env.local` in project root:

```bash
# Retell AI Configuration
RETELL_API_KEY=key_your_api_key_here
NEXT_PUBLIC_RETELL_AGENT_ID=agent_your_agent_id_here
```

**Important**: 
- `RETELL_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
- `NEXT_PUBLIC_RETELL_AGENT_ID` is client-side accessible (safe to expose)
- `.env.local` is gitignored - never commit it!

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `RETELL_API_KEY`
     **Value**: `key_...` (mark as **Secret**)
   - **Name**: `NEXT_PUBLIC_RETELL_AGENT_ID`
     **Value**: `agent_...`
4. Redeploy your project

## Step 4: Run the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test the voice agent!

## How It Works

### Architecture

```
User Browser
    ↓
Frontend (React)
    ↓ (requests access token)
Backend API (/api/retell/register-call)
    ↓ (authenticates with API key)
Retell AI API
    ↓ (returns access token)
Frontend (React)
    ↓ (establishes WebRTC connection)
Retell AI (Voice Agent)
```

### Security

- **API Key**: Stored server-side only, never exposed to browser
- **Access Token**: Short-lived (30 seconds), generated per call
- **WebRTC**: Encrypted peer-to-peer audio streaming

## Troubleshooting

### "API key not configured"
- Check `.env.local` exists and has correct format
- Restart dev server after changing env variables
- For Vercel: verify environment variables in dashboard

### "Agent ID is required"
- Ensure `NEXT_PUBLIC_RETELL_AGENT_ID` is set
- Check agent ID is correct (starts with `agent_`)

### Call connects but immediately ends
- Verify agent is fully configured in Retell dashboard
- Check agent has a voice selected
- Ensure LLM/prompt is configured
- Test agent in Retell dashboard first

### No audio / Microphone not working
- Use HTTPS (or localhost for development)
- Check browser permissions for microphone
- Try Chrome/Edge (best WebRTC support)
- Disable VPN if having connection issues

### "Failed to register call"
- Verify API key is correct
- Check API key has proper permissions
- Ensure agent ID exists and is accessible

## API Reference

### useRetellAgent Hook

```typescript
const {
  isConnected,    // Boolean: Call is active
  isRecording,    // Boolean: Agent is speaking
  isConnecting,   // Boolean: Connection in progress
  error,          // String | null: Error message
  connect,        // Function: Start call
  disconnect,     // Function: End call
} = useRetellAgent({
  agentId: 'agent_xxx',
  onStatusChange: (status) => console.log(status),
});
```

### API Route

**Endpoint**: `POST /api/retell/register-call`

**Request**:
```json
{
  "agentId": "agent_xxx"
}
```

**Response**:
```json
{
  "accessToken": "eyJ...",
  "callId": "call_xxx"
}
```

## Additional Resources

- [Retell AI Documentation](https://docs.retellai.com/)
- [Retell AI Dashboard](https://beta.retellai.com/)
- [Retell AI Pricing](https://www.retellai.com/pricing)

## Cost Estimate

Retell AI pricing (as of 2024):
- ~$0.10-0.15 per minute of conversation
- Includes LLM costs, voice synthesis, and infrastructure
- Check [Retell Pricing](https://www.retellai.com/pricing) for latest rates

---

**Need Help?** Check the [Retell AI Documentation](https://docs.retellai.com/) or contact support.
