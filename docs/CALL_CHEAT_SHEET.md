# 📞 Developer Call Cheat Sheet

**Quick reference for tomorrow's call**

---

## 🎯 The Pitch (30 seconds)

> "I've built the backend for 9 AI agents - 8 voice agents and 1 chat agent. Everything's hosted, secure, and production-ready. You just need to integrate them into the new website using the SDK and API I'm providing. You control all the design, I handle all the AI."

---

## 📦 What They're Getting

### **Voice Agents:**
- **Chloe** - Cosentus info expert (company, services, pricing)
- **Cindy** - Patient billing support (can do mock calls)
- **Chris** - Insurance claim follow-up
- **Cara** - Eligibility & benefits verification
- **Carly** - Prior authorization follow-up
- **Carson** - Payment reconciliation
- **Cassidy** - Pre-service anesthesia cost estimates
- **Courtney** - Medical appointment scheduling

### **Chat Agent:**
- **Homepage AI Chat** - Text-based Q&A assistant (Retell AI, headless SDK)

---

## 🔧 How Simple It Is

### **We offer 3 integration methods:**

#### **🔵 iframe (Easiest - 1 line):**
```html
<!-- Voice Agent -->
<iframe src="https://cosentusai.vercel.app/embed/voice/chloe" width="400" height="600" frameborder="0" allow="microphone"></iframe>

<!-- Chat Agent -->
<iframe src="https://cosentusai.vercel.app/embed/chat" width="100%" height="600" frameborder="0"></iframe>
```

#### **🟢 Simple JavaScript (No SDK):**
```javascript
// Voice: Direct API call + Retell SDK
const response = await fetch('https://cosentusai.vercel.app/api/retell/register-call', {
  method: 'POST',
  body: JSON.stringify({ agentId: 'agent_4c8f86fa8ce3f4f2f7b6c5b0e1' })
});

// Chat: Direct API calls
const initResp = await fetch('https://cosentusai.vercel.app/api/assist-chat', { method: 'POST' });
const msgResp = await fetch('https://cosentusai.vercel.app/api/chat/send-message', {
  method: 'POST',
  body: JSON.stringify({ chatId, message: 'Hello' })
});
```

#### **🟡 Full SDK (Most Powerful):**
```javascript
// Voice Agent
const chloe = CosentusVoice.createAgent('chloe');
await chloe.connect();

// Chat Agent
const chat = CosentusVoice.createChatAssistant();
chat.on('message', (data) => console.log(data.content));
await chat.sendMessage('What is Cosentus?');
```

---

## 📁 What You're Sending Them

1. ✅ `cosentus-voice.js` - Voice agent SDK
2. ✅ `INTEGRATION_GUIDE.md` - Complete integration guide (voice + chat)
3. ✅ `lib/cosentus-voice/README.md` - Detailed SDK documentation
4. ✅ API endpoint URLs:
   - Voice: `https://cosentusai.vercel.app/api/retell/register-call`
   - Chat: `https://cosentusai.vercel.app/api/assist-chat`
5. ✅ Demo site URL: `https://cosentusai.vercel.app`

---

## 💡 Key Selling Points

- ✅ **Framework-agnostic** - Works with Framer, React, WordPress, anything
- ✅ **You control design** - They build the UI, you handle AI
- ✅ **Agent names, not IDs** - Use 'chloe', 'cindy', 'chris', 'cara', 'carly', 'carson', 'cassidy', 'courtney' (future-proof)
- ✅ **Secure** - Rate limiting, hidden API keys
- ✅ **Production-ready** - Deployed on Vercel, tested, documented
- ✅ **30-minute integration** - Per agent, with copy-paste examples

---

## 🤔 Anticipated Questions

### **"What tech stack does this work with?"**
> "Any. It's vanilla JavaScript. Works with Framer, Webflow, WordPress, React, Vue, plain HTML."

### **"How long will integration take?"**
> "About 30 minutes per agent. The docs have copy-paste examples for every major framework."

### **"What if we need to change something?"**
> "Design changes? You handle it. AI behavior changes? I handle it on my end, your code doesn't break."

### **"What if something breaks?"**
> "Everything's hosted on Vercel with 99.9% uptime. If there's an issue, error messages will show what's wrong. Plus I'm available for support."

### **"Can we see a demo?"**
> "Yes! The demo site is live at https://cosentusai.vercel.app. You can see all the agents in action. But remember, that's just my demo UI - you'll build your own that matches the new website design."

### **"What about security?"**
> "Built-in rate limiting prevents abuse. API keys are server-side only. All traffic is logged for monitoring."

### **"Do we need access to your backend?"**
> "Nope. You just call the API endpoints. Everything else is handled on my end."

---

## 🎨 What They Control vs. What You Control

### **They Control:**
- Button design, colors, sizes, fonts
- Chat UI design, message bubbles, animations
- Where agents appear on the website
- Text labels and copy

### **You Control:**
- AI agent behavior and responses
- Backend infrastructure and APIs
- Agent IDs and configuration
- Security and rate limiting

---

## 🚀 After the Call

Send them:
1. The 4 files listed above
2. Your Vercel URL: https://cosentusai.vercel.app
3. Offer to answer questions via email/Slack

---

## 📊 Demo Flow (If They Ask)

1. Show them your demo site
2. Click "Talk to Chloe" → Have a quick conversation
3. Show the chat widget → Ask a question
4. Pull up the code → Show how simple the integration is
5. Show the documentation → Highlight copy-paste examples

---

## 🎯 Closing

> "So you've got everything you need - the SDK, the API endpoints, and detailed documentation with examples for every major framework. Integration should be straightforward. I'm available if you hit any snags. Any questions?"

---

## 📝 Notes Section (Fill in before call)

**Your Vercel URL:** `https://cosentusai.vercel.app`

**Demo site username/password (if needed):** `_______________________________`

**Your contact for support:** `_______________________________`

**Timeline/deadline:** `_______________________________`

**Their tech stack (if known):** `_______________________________`

---

**You've got this! 🚀**

