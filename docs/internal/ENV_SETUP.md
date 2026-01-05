# Environment Variables Setup

Quick reference for environment variables used in this project.

## ⚠️ SECURITY WARNING

**NEVER commit `.env.local` to Git!**
**NEVER hardcode API keys or secrets in your code!**

All sensitive credentials should ONLY exist in:
1. `.env.local` (local development - gitignored)
2. Vercel Environment Variables (production)

---

## Required Environment Variables

### Local Development (`.env.local`)

Create a `.env.local` file in the project root:

```bash
# Retell AI Configuration
RETELL_API_KEY=key_your_api_key_here
NEXT_PUBLIC_RETELL_AGENT_ID=agent_your_agent_id_here
```

### Production (Vercel)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Type |
|----------|-------|------|
| `RETELL_API_KEY` | `key_...` | Secret |
| `NEXT_PUBLIC_RETELL_AGENT_ID` | `agent_...` | Plain Text |

---

## Variable Descriptions

### `RETELL_API_KEY`
- **Type**: Server-side only (Secret)
- **Purpose**: Authenticates with Retell AI API
- **Get it from**: [Retell Dashboard](https://beta.retellai.com/) → Settings → API Keys
- **Security**: NEVER expose to browser, kept server-side only

### `NEXT_PUBLIC_RETELL_AGENT_ID`
- **Type**: Client-side accessible
- **Purpose**: Identifies which Retell AI agent to use
- **Get it from**: [Retell Dashboard](https://beta.retellai.com/) → Agents → Your Agent
- **Security**: Safe to expose (public identifier)

---

## Setup Instructions

1. **Get credentials** from [Retell Dashboard](https://beta.retellai.com/)
2. **Create `.env.local`** with the template above
3. **Add values** from your Retell account
4. **Restart dev server** (`npm run dev`)
5. **For production**: Add to Vercel dashboard and redeploy

---

## Verification

To verify your setup:

```bash
# Check if .env.local exists
ls -la .env.local

# Start dev server
npm run dev

# Open http://localhost:3000 and test voice agent
```

If you see "Environment variables not configured" error:
- Check `.env.local` exists
- Verify variable names match exactly
- Restart dev server

---

## Security Best Practices

✅ **DO**:
- Store credentials in `.env.local` (gitignored)
- Use Vercel environment variables for production
- Mark `RETELL_API_KEY` as Secret in Vercel
- Restart server after changing env variables

❌ **DON'T**:
- Commit `.env.local` to Git
- Hardcode credentials in source code
- Share API keys publicly
- Use production keys in development

---

For detailed Retell AI setup, see [RETELL_SETUP.md](./RETELL_SETUP.md).
