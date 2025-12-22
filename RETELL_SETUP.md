# Retell AI Setup Guide

This guide explains how to set up Retell AI for browser-based voice conversations.

## What is Retell AI?

Retell AI is a platform for building AI voice agents that work in browsers (no phone numbers needed!). It supports:
- ✅ Direct browser WebRTC connections
- ✅ ElevenLabs voices (high quality)
- ✅ Custom agent configuration via dashboard
- ✅ Real-time transcripts and conversation updates

---

## Step 1: Get Your Retell API Key

1. Go to [Retell AI Dashboard](https://beta.retellai.com/)
2. Log in to your account
3. Navigate to **Settings** → **API Keys**
4. Copy your API key (starts with `key_...`)

---

## Step 2: Get Your Agent ID

1. In the Retell AI Dashboard, go to **Agents**
2. Select the agent you want to use (e.g., "Chloe")
3. Copy the **Agent ID** (starts with `agent_...`)
   - You can find this in the agent's settings or in the URL

---

## Step 3: Configure Environment Variables

### For Local Development (`.env.local`)

Create or update `.env.local` in the project root:

```bash
# Retell AI Configuration
RETELL_API_KEY=key_YOUR_RETELL_API_KEY_HERE
NEXT_PUBLIC_RETELL_AGENT_ID=agent_YOUR_RETELL_AGENT_ID_HERE
```

**Important:**
- `RETELL_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
- `NEXT_PUBLIC_RETELL_AGENT_ID` is client-side accessible

---

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

| Name | Value | Type |
|------|-------|------|
| `RETELL_API_KEY` | `key_...` | Secret |
| `NEXT_PUBLIC_RETELL_AGENT_ID` | `agent_...` | Plain Text |

4. **Redeploy** your project after adding variables

---

## Step 4: Configure Your Agent in Retell Dashboard

In the Retell AI dashboard, configure your agent:

1. **Voice Settings:**
   - Choose an ElevenLabs voice
   - Adjust speaking rate, pitch, etc.

2. **Prompt/Instructions:**
   - Set the agent's personality and behavior
   - Define what it can and cannot do

3. **Language Model:**
   - Choose GPT-4 or other available models

4. **Advanced Settings:**
   - Enable/disable features like interruption handling
   - Set response latency preferences

---

## How It Works

### Browser Flow:

1. User clicks "Begin Conversation"
2. Frontend calls `/api/retell/register-call` with agent ID
3. Backend authenticates with Retell API and gets an access token
4. Frontend uses `retell-client-js-sdk` to start WebRTC connection
5. User speaks → Retell processes → Agent responds with voice

### No Phone Numbers Required!

Unlike traditional voice AI, Retell's web SDK connects directly from the browser using WebRTC. No Twilio, no phone numbers, no complexity.

---

## Testing Locally

1. Set up your `.env.local` file with credentials
2. Run `npm run dev`
3. Navigate to the AI Demos section
4. Click on "Chloe" card
5. Click "Begin Conversation"
6. Allow microphone access when prompted
7. Start talking!

---

## Troubleshooting

### "Failed to register call"
- Check that `RETELL_API_KEY` is set correctly in `.env.local` or Vercel
- Verify the API key is valid in Retell dashboard

### "Agent ID is required"
- Ensure `NEXT_PUBLIC_RETELL_AGENT_ID` is set
- Check that the agent ID exists in your Retell dashboard

### Microphone not working
- Make sure you're using HTTPS (or localhost)
- Check browser permissions for microphone access
- Try a different browser (Chrome/Edge recommended)

### No audio from agent
- Check your speaker/headphone volume
- Verify the agent has a voice selected in Retell dashboard
- Check browser console for errors

---

## API Reference

### `useRetellAgent` Hook

```typescript
const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
  agentId: 'agent_xxx',
  onStatusChange: (status) => console.log(status),
});
```

**Returns:**
- `isConnected`: Boolean - Whether call is active
- `isRecording`: Boolean - Whether agent is speaking
- `isConnecting`: Boolean - Whether connection is in progress
- `error`: String | null - Error message if any
- `connect()`: Function - Start the call
- `disconnect()`: Function - End the call

---

## Additional Resources

- [Retell AI Documentation](https://docs.retellai.com/)
- [Retell AI Dashboard](https://beta.retellai.com/)
- [Web SDK GitHub](https://github.com/RetellAI/retell-client-js-sdk)

---

## Cost Estimate

Retell AI pricing (as of 2024):
- ~$0.10-0.15 per minute of conversation
- Includes LLM costs, voice synthesis, and infrastructure
- Check [Retell Pricing](https://www.retellai.com/pricing) for latest rates

