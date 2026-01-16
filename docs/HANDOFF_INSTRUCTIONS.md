# 📦 How to Hand Off to Third-Party Developers

## 🎯 What to Send Them

### **Via Email/Slack:**

Send these 2 files as attachments:
1. ✅ `INTEGRATION_GUIDE.md` - Complete integration guide
2. ✅ `lib/cosentus-voice/README.md` - Detailed SDK documentation

### **In the Email, Include:**

```
🔗 SDK URL: https://cosentusai.vercel.app/cosentus-voice.js
🔗 Voice API: https://cosentusai.vercel.app/api/retell/register-call
🔗 Chat API: https://cosentusai.vercel.app/api/assist-chat (auto-handled by SDK)
🔗 Demo Site: https://cosentusai.vercel.app

Available Voice Agents:
- chloe (company info)
- cindy (patient billing)  
- chris (insurance claims)
- cara (eligibility verification)
- carly (prior authorization)
- carson (payment reconciliation)
- cassidy (pre-service anesthesia cost estimates)
- courtney (medical appointment scheduling)

Chat Assistant:
- Headless SDK (CosentusVoice.createChatAssistant())
- Developers build their own UI, SDK handles API calls
```

**That's it!** No git access, no codebase, just docs + URLs.

---

## 🔄 When You Make Changes

### **SDK Updates (Voice Agents):**

1. Edit `lib/cosentus-voice/cosentus-voice.js`
2. Run: `./update-sdk.sh`
3. Commit and push to git
4. Vercel auto-deploys
5. ✅ **Their code automatically uses the new version**

### **Agent ID Changes:**

1. Update `src/config/agents.ts`
2. Update `lib/cosentus-voice/cosentus-voice.js` (AGENTS object)
3. Run: `./update-sdk.sh`
4. Commit and push
5. ✅ **Their code keeps working** (they use names, not IDs)

### **New Agent:**

1. Add to both config files
2. Run: `./update-sdk.sh`
3. Commit and push
4. 📧 Email them: "New agent 'name' available, here's what it does"

### **Chat API Changes:**

1. Update `src/app/api/assist-chat/route.ts`
2. Commit and push
3. ✅ **No action needed on their end** (same endpoint URL)

### **Breaking Changes:**

If you change API structure:
1. Update your code
2. Update `INTEGRATION_GUIDE.md`
3. 📧 Email them the new docs
4. Give them a heads-up before deploying

---

## 🚀 Your Workflow

### **Normal Updates (Non-Breaking):**
```bash
# 1. Make your changes
vim lib/cosentus-voice/cosentus-voice.js

# 2. Update public SDK
./update-sdk.sh

# 3. Deploy
git add -A
git commit -m "Update SDK: [what you changed]"
git push

# 4. Vercel auto-deploys (2-3 minutes)
# ✅ Done! Their code automatically uses the new version
```

### **Breaking Changes (Rare):**
```bash
# 1. Make changes
# 2. Update docs
# 3. Email them BEFORE pushing
# 4. Give them time to update their code
# 5. Then deploy
```

---

## 📧 Sample Email Template

```
Subject: Cosentus AI Integration Package

Hi [Team],

Attached are the integration docs for the Cosentus AI agents. Here's what you need:

📦 RESOURCES:
• SDK (Voice + Chat): https://cosentusai.vercel.app/cosentus-voice.js
• Voice API: https://cosentusai.vercel.app/api/retell/register-call  
• Chat API: https://cosentusai.vercel.app/api/assist-chat (auto-handled by SDK)
• Live Demo: https://cosentusai.vercel.app

🎤 VOICE AGENTS:
• chloe - Company info expert
• cindy - Patient billing support
• chris - Insurance claim follow-up
• cara - Eligibility & benefits verification
• carly - Prior authorization follow-up
• carson - Payment reconciliation
• cassidy - Pre-service anesthesia cost estimates
• courtney - Medical appointment scheduling

💬 CHAT ASSISTANT:
• Headless SDK - You build the UI, SDK handles API calls
• Usage: CosentusVoice.createChatAssistant()

📚 DOCUMENTATION:
See attached INTEGRATION_GUIDE.md for step-by-step instructions with code examples for React, WordPress, Framer, and vanilla JS.

🔄 UPDATES:
The SDK is hosted on our end and automatically updates. If we make changes, your integration will benefit without any code changes on your side.

Let me know if you have questions!

Best,
[Your Name]
```

---

## ✅ Checklist Before Sending

- [x] Replace `YOUR_VERCEL_URL` in all docs with actual URL (https://cosentusai.vercel.app)
- [ ] Test all 8 voice agents on your demo site
- [ ] Test the chat agent on your demo site
- [ ] Verify SDK loads from `https://cosentusai.vercel.app/cosentus-voice.js`
- [ ] Verify both API endpoints work
- [ ] Check that `INTEGRATION_GUIDE.md` has correct URLs
- [ ] Attach both documentation files to email
- [ ] Include all URLs in email body

---

## 🎯 What They Get vs. What They Don't

### **✅ They Get:**
- SDK file (hosted by you)
- API endpoint URLs
- Documentation
- Code examples
- Your demo site URL for reference

### **❌ They Don't Get:**
- Your git repository
- Your Next.js codebase
- Your demo page source code
- Your environment variables
- Your backend logic

---

## 🔒 Security Notes

- ✅ API keys stay on your server (never exposed)
- ✅ Rate limiting prevents abuse
- ✅ CORS enabled for their domains
- ✅ They can't see your backend code
- ✅ They can't modify your agents

---

## 💡 Pro Tips

1. **Keep a changelog** - Document SDK updates in git commits
2. **Version your SDK** - Consider adding version number to filename later (e.g., `cosentus-voice-v1.2.js`)
3. **Monitor usage** - Check Vercel logs to see API usage
4. **Stay responsive** - Answer their integration questions quickly
5. **Test before pushing** - Always test SDK changes on your demo site first

---

## 📞 Support

If they have issues:
1. Ask for browser console errors
2. Ask for network tab screenshots
3. Check Vercel logs for API errors
4. Test the agent on your demo site
5. If it works for you but not them, it's their integration

---

**You're all set! 🚀**

Remember: They load the SDK from your URL, so you control updates. No need to send them new files every time you make changes.

