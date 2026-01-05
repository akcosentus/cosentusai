# Contributing to Cosentus AI Integration

## 🎯 For Third-Party Developers

This repository contains the backend infrastructure and SDK for Cosentus AI agents. As a third-party developer integrating these agents into your website, you typically **don't need to modify this codebase**.

### What You Need:

1. **Read the documentation:**
   - [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md) - Complete integration guide
   - [`lib/cosentus-voice/README.md`](lib/cosentus-voice/README.md) - SDK documentation

2. **Use the hosted resources:**
   - SDK: `https://cosentusai.vercel.app/cosentus-voice.js`
   - Voice API: `https://cosentusai.vercel.app/api/retell/register-call`
   - Chat API: `https://cosentusai.vercel.app/api/assist-chat`

3. **Build your UI:**
   - You control all design and styling
   - Cosentus handles the AI backend

### Questions or Issues?

- **Integration help:** Review the documentation first
- **Technical issues:** Open a GitHub issue with:
  - Browser console errors
  - Network tab screenshots
  - Steps to reproduce
- **Agent behavior:** Contact Cosentus directly (agent responses are managed by Cosentus)

---

## 🔧 For Cosentus Internal Team

### Making Changes to the SDK

1. Edit `lib/cosentus-voice/cosentus-voice.js`
2. Run `./update-sdk.sh` to sync to `public/`
3. Commit and push to deploy

### Making Changes to APIs

1. Edit files in `src/app/api/`
2. Test locally with `npm run dev`
3. Commit and push to deploy

### Adding a New Agent

1. Add to `src/config/agents.ts`
2. Add to `lib/cosentus-voice/cosentus-voice.js` (AGENTS object)
3. Run `./update-sdk.sh`
4. Update documentation
5. Notify third-party developers

### Updating Documentation

Documentation for third-party developers is in:
- `docs/INTEGRATION_GUIDE.md`
- `lib/cosentus-voice/README.md`

Update these when making breaking changes or adding features.

---

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add new agent 'sarah'`
- `fix: Resolve microphone permission issue`
- `docs: Update integration guide with React example`
- `refactor: Simplify SDK error handling`
- `chore: Update dependencies`

---

## 🚀 Deployment

This project auto-deploys to Vercel on push to `main`:
- **Demo Site:** https://cosentusai.vercel.app
- **SDK:** https://cosentusai.vercel.app/cosentus-voice.js
- **APIs:** https://cosentusai.vercel.app/api/*

Changes are live within 2-3 minutes of pushing.

---

## 🔒 Security

- Never commit `.env.local` or API keys
- Rate limiting is enabled on all public endpoints
- Report security issues privately to Cosentus

---

## 📞 Support

For questions or support:
- **Internal:** Contact the Cosentus development team
- **External:** support@cosentus.com

