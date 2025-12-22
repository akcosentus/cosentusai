# Environment Variables Setup

## Local Development

Create a `.env.local` file in the root of your project with:

```bash
ELEVENLABS_API_KEY=sk_1f4f09ecd7b2e7e715bb57ac142b95f469cde2f98a636459
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_3701kd42k7zjeatbhwc31kbwpn78
```

## Vercel Deployment

Add these environment variables in your Vercel project:

1. Go to: https://vercel.com/your-project/settings/environment-variables

2. Add:
   - **Name**: `ELEVENLABS_API_KEY`
   - **Value**: `sk_1f4f09ecd7b2e7e715bb57ac142b95f469cde2f98a636459`
   - **Environment**: Production, Preview, Development
   - ✅ Mark as "Secret"

3. Add:
   - **Name**: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`
   - **Value**: `agent_3701kd42k7zjeatbhwc31kbwpn78`
   - **Environment**: Production, Preview, Development

4. Redeploy your project

## Testing Locally

After adding `.env.local`:

```bash
npm run dev
```

Then visit http://localhost:3000 and click on Chloe's card to test!

## Security Note

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to git (it's already in .gitignore)
- The API key is sensitive - keep it secure
- `NEXT_PUBLIC_` variables are exposed to the browser (that's okay for the Agent ID)

