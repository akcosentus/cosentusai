# 📦 Cosentus Voice Agent - Delivery Package

## What to Give Your Third-Party Website Builder

### 📁 Files to Deliver

```
📦 Cosentus Voice Integration Package
├── cosentus-voice.js              ← The library (required)
├── cosentus-voice.d.ts            ← TypeScript definitions (optional)
├── THIRD_PARTY_GUIDE.md           ← Integration instructions (required)
├── example.html                    ← Working demo (helpful)
└── README.md                       ← Full API docs (reference)
```

---

## 🎯 Delivery Options

### **Option 1: Self-Hosted (Recommended)**

**What you do:**
1. Host `cosentus-voice.js` on your domain/CDN
2. Give them the URL: `https://yourdomain.com/cosentus-voice.js`
3. Send them `THIRD_PARTY_GUIDE.md`

**What they do:**
```html
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="https://yourdomain.com/cosentus-voice.js"></script>
```

**Benefits:**
- ✅ You can update agent IDs anytime
- ✅ They never need to change code
- ✅ Version control
- ✅ Analytics (see who's using it)

---

### **Option 2: File Delivery**

**What you do:**
1. Send them all 5 files above
2. They host `cosentus-voice.js` themselves

**What they do:**
```html
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="/js/cosentus-voice.js"></script>
```

**Drawbacks:**
- ⚠️ If you change agent IDs, they need new file
- ⚠️ No version control
- ⚠️ Can't track usage

---

## 📧 Email Template for Third-Party

```
Subject: Cosentus Voice Agent Integration Package

Hi [Developer Name],

Attached is everything you need to integrate our voice agents into the website.

## Quick Summary
- Add 2 script tags to your HTML
- Create your own buttons/UI (you have full design control)
- Use simple JavaScript to connect: `CosentusVoice.createAgent('chloe')`

## What's Included
1. cosentus-voice.js - The library
2. THIRD_PARTY_GUIDE.md - Step-by-step integration (START HERE)
3. example.html - Working demo you can test locally
4. README.md - Full API documentation

## Available Agents
- 'chloe' - Customer service
- 'cindy' - Payment specialist

## Integration Time
~5-10 minutes for basic setup

## Platform Support
✅ Framer, Webflow, WordPress, React, Vue, plain HTML - anything

## Requirements
- HTTPS (for microphone access)
- Modern browser

## Next Steps
1. Open THIRD_PARTY_GUIDE.md
2. Follow the Quick Start (3 steps)
3. Test with example.html

Let me know if you have any questions!

Best,
[Your Name]
```

---

## 🚀 Hosting Instructions (For You)

### Quick: Use Your Existing Next.js App

**Step 1:** Copy library to public folder
```bash
cp lib/cosentus-voice/cosentus-voice.js public/cosentus-voice.js
```

**Step 2:** Deploy (you're already on Vercel)
```bash
git add public/cosentus-voice.js
git commit -m "Add voice library to public"
git push
```

**Step 3:** Library is now available at:
```
https://yourdomain.com/cosentus-voice.js
```

**Step 4:** Give third-party this URL

---

## 🔒 Backend Setup (Already Done)

Your backend API is already configured:
- ✅ `/api/retell/register-call` - Generates tokens
- ✅ API keys are server-side only
- ✅ CORS is handled
- ✅ Error handling in place

**Third-party needs:**
- Nothing! They just call `CosentusVoice.createAgent()` and it works.

---

## 📊 What Third-Party Can/Cannot Do

### ✅ What They CAN Do (Full Control)
- Design all UI/styling
- Choose when to connect/disconnect
- Add custom animations
- Build their own status displays
- Use any framework (React, Vue, etc.)
- Host on any platform (Framer, Webflow, etc.)

### ❌ What They CANNOT Do (You Control)
- See or change agent IDs
- Access your API keys
- Modify agent behavior
- Change voice settings
- Access Retell dashboard

---

## 🔄 Maintenance Scenarios

### Scenario 1: Add New Agent

**You:**
1. Update `cosentus-voice.js`:
```javascript
const AGENTS = {
  chloe: 'agent_1105555b1ff51f2bb88da4e8be',
  cindy: 'agent_65a721eac689079c9ce91d7a9b',
  david: 'agent_NEW_ID'  // ← Add this
};
```
2. Redeploy (if self-hosted)

**Third-party:**
```javascript
const david = CosentusVoice.createAgent('david');
```

**Communication:** Email them the new agent name.

---

### Scenario 2: Agent ID Changes

**You:**
1. Update `cosentus-voice.js`:
```javascript
const AGENTS = {
  chloe: 'agent_NEW_ID',  // ← Changed
  cindy: 'agent_65a721eac689079c9ce91d7a9b'
};
```
2. Redeploy

**Third-party:** No changes needed! Still uses `'chloe'`.

**Communication:** None needed (if self-hosted).

---

### Scenario 3: API Endpoint Changes

**You:**
Update library or tell them to configure:

**Third-party:**
```javascript
CosentusVoice.configure({
  apiEndpoint: 'https://new-api.com/voice/token'
});
```

**Communication:** Email them the new endpoint.

---

## 🧪 Testing Before Delivery

### Step 1: Test the Library
```bash
cd lib/cosentus-voice
open example.html
```

### Step 2: Test in Framer (if applicable)
1. Create test Framer project
2. Follow THIRD_PARTY_GUIDE.md
3. Verify it works

### Step 3: Test API Endpoint
```bash
curl -X POST https://yourdomain.com/api/retell/register-call \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent_1105555b1ff51f2bb88da4e8be"}'
```

Should return: `{"accessToken":"...","callId":"..."}`

---

## 📋 Delivery Checklist

Before sending to third-party:

- [ ] Library tested and working
- [ ] example.html opens and connects successfully
- [ ] API endpoint is accessible from external domains
- [ ] CORS is configured correctly
- [ ] Agent IDs are correct in library
- [ ] THIRD_PARTY_GUIDE.md is updated with correct URLs
- [ ] Library is hosted (if self-hosting)
- [ ] You've tested on HTTPS (not just localhost)

---

## 🎯 Summary

**What third-party gets:**
- 1 JavaScript library
- 1 integration guide
- 1 working example
- Full design control

**What they need to do:**
- Add 2 script tags
- Create their UI
- Write 3 lines of JavaScript

**What you maintain:**
- Agent IDs
- API keys
- Backend logic
- Library updates

**Result:**
- ✅ Clean separation of concerns
- ✅ Easy for them to integrate
- ✅ Easy for you to maintain
- ✅ Secure (no exposed keys)
- ✅ Scalable (works on any platform)

---

## 📞 Support Plan

When third-party has questions:

**Common Issues:**
1. "RetellWebClient not defined" → Check script order
2. "Failed to register call" → Check API endpoint
3. "Microphone not working" → Ensure HTTPS

**Your responsibility:**
- Backend issues
- Agent configuration
- Library bugs

**Their responsibility:**
- UI/design
- Button wiring
- Platform-specific issues (Framer, Webflow, etc.)

---

Ready to deliver! 🚀
