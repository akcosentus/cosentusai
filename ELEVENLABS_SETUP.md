# ElevenLabs Agent Integration Setup

## Overview
This project now uses ElevenLabs Conversational AI agents instead of OpenAI Realtime API for superior voice quality.

## Prerequisites
1. **ElevenLabs Account**: Sign up at https://elevenlabs.io/
2. **Create Your Agent**: Build your agent in the ElevenLabs platform
3. **Get Your Credentials**:
   - API Key from ElevenLabs Console
   - Agent ID from your created agent

## Environment Variables

Add these to your `.env.local` file:

```bash
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

### How to Get Your Agent ID:
1. Go to https://elevenlabs.io/agents
2. Click on your agent
3. Copy the Agent ID from the URL or settings

### How to Get Your API Key:
1. Go to https://elevenlabs.io/app/settings/api-keys
2. Create a new API key or copy an existing one

## Vercel Deployment

Add these environment variables in your Vercel project settings:
- `ELEVENLABS_API_KEY` (secret)
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (public)

## Agent Configuration

Configure your agent in the ElevenLabs platform:
- **Voice**: Choose from 5,000+ voices
- **System Prompt**: Define agent behavior (e.g., "You are Chloe, a friendly customer service agent...")
- **Language Model**: Select GPT-4, Claude, or others
- **Knowledge Base**: Add FAQs, documents, etc.
- **Tools**: Connect webhooks or client tools if needed

## How It Works

1. User clicks "Begin Conversation" on Chloe's card
2. Browser requests microphone access
3. App fetches a signed URL from ElevenLabs via our API route
4. WebSocket connection established with ElevenLabs
5. Real-time voice conversation begins
6. Waveform visualization shows when agent is speaking

## Benefits Over OpenAI

✅ **Superior Voice Quality**: 5,000+ professional voices
✅ **Simple Configuration**: All settings in ElevenLabs portal
✅ **No Code Changes**: Update agent behavior without redeploying
✅ **Multiple Languages**: 31 languages supported
✅ **Custom Voices**: Clone voices or create custom ones

## Troubleshooting

### "Failed to get signed URL"
- Check that `ELEVENLABS_API_KEY` is set correctly
- Verify API key has proper permissions

### "Agent ID is required"
- Ensure `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is set
- Check that the Agent ID is correct

### Microphone Not Working
- Allow microphone permissions in browser
- Check browser compatibility (Chrome, Firefox, Safari, Edge)

### No Audio Output
- Check browser audio settings
- Ensure speakers/headphones are connected
- Try refreshing the page

## API Routes

### `/api/elevenlabs/signed-url`
- **Method**: POST
- **Body**: `{ "agentId": "your-agent-id" }`
- **Returns**: `{ "signedUrl": "wss://..." }`
- **Purpose**: Generates secure WebSocket URL for agent connection

## Files Modified

- `src/hooks/useElevenLabsAgent.ts` - New hook for ElevenLabs integration
- `src/app/api/elevenlabs/signed-url/route.ts` - API route for signed URLs
- `src/app/page.tsx` - Updated to use ElevenLabs instead of OpenAI

## Migration from OpenAI

The old OpenAI Realtime API code is still in the repository but no longer used:
- `src/hooks/useRealtimeVoice.ts` (deprecated)
- `src/app/api/voice/token/route.ts` (deprecated)

You can safely remove these files if desired.

## Support

- ElevenLabs Documentation: https://elevenlabs.io/docs
- ElevenLabs Discord: https://discord.gg/elevenlabs
- GitHub Issues: Create an issue in this repository

