# Environment Variables Setup

## ⚠️ SECURITY WARNING

**NEVER commit `.env.local` to Git!**
**NEVER hardcode API keys or secrets in your code!**

All sensitive credentials should ONLY exist in:
1. `.env.local` (local development - gitignored)
2. Vercel Environment Variables (production)

---

## Retell AI Configuration

### Required Environment Variables

Create a `.env.local` file in the project root (this file is gitignored):

```bash
# Retell AI API Key (KEEP SECRET!)
RETELL_API_KEY=your_api_key_here

# Retell Agent ID (safe to expose client-side)
NEXT_PUBLIC_RETELL_AGENT_ID=your_agent_id_here
```

### For Vercel Deployment

Add these environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `RETELL_API_KEY` (mark as **Secret**)
   - `NEXT_PUBLIC_RETELL_AGENT_ID`
3. Redeploy after adding variables

### Security Notes

- ✅ `RETELL_API_KEY` - Server-side only (no `NEXT_PUBLIC_` prefix) - NEVER exposed to browser
- ✅ `NEXT_PUBLIC_RETELL_AGENT_ID` - Client-side accessible (safe to expose)
- ✅ `.env.local` is in `.gitignore` - never committed to Git
- ✅ No fallback values in code - forces proper environment setup

---

# Previous Configuration (Deprecated)

## ElevenLabs & OpenAI (No longer used)

These services have been replaced by Retell AI.

**All old API keys have been removed from this documentation for security.**

If you need to reference old configuration:
- Store credentials in `.env.local` only (never in code or docs)
- See `RETELL_SETUP.md` for current implementation

