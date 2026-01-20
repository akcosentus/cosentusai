# Cosentus AI - Custom UI Integration

**For developers who want full design control.**

---

## 🚀 Quick Start

```html
<!-- 1. Include the script -->
<script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>

<!-- 2. Use it -->
<script>
  // Chat Agent (simplest - no token needed)
  const response = await CosentusSimple.sendChatMessage('How do I reduce denials?');
  console.log(response);
  
  // Voice Agent (requires getting token first - see below)
  // Step 1: Get token from our API
  const res = await fetch('https://cosentusai.vercel.app/api/retell/register-call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId: 'agent_d6497c4fabcc7bebdf9e4b0b20' })
  });
  const { access_token } = await res.json();
  
  // Step 2: Start the call with the token
  CosentusSimple.startVoiceCall('cindy', access_token);
</script>
```

---

## 🎤 Voice Agents

### Available Agents:
- `cindy` - Patient billing & payments
- `chris` - Insurance claim follow-ups
- `cassidy` - Anesthesia cost estimates
- `courtney` - Appointment scheduling
- `chloe` - General customer service
- `cara` - Insurance eligibility verification
- `carly` - Prior authorization tracking
- `carson` - Payment reconciliation

### Start a Voice Call:

**2 Steps Required:**

```javascript
// Step 1: Get access token from our API
const tokenResponse = await fetch('https://cosentusai.vercel.app/api/retell/register-call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ agentId: 'agent_d6497c4fabcc7bebdf9e4b0b20' })
});
const { access_token } = await tokenResponse.json();

// Step 2: Start the call with the token
CosentusSimple.startVoiceCall('cindy', access_token);
```

**Why the token?** Security. The token authorizes the voice call and expires after use.

**Agent IDs:**
```javascript
const AGENT_IDS = {
  cindy: 'agent_d6497c4fabcc7bebdf9e4b0b20',
  chris: 'agent_9b0e467a9c8c0e0e5fd4730c3f',
  cassidy: 'agent_ff8707dccf16f96ecec4c448d3',
  courtney: 'agent_1b7fe9e057f84254f4fcca9256',
  chloe: 'agent_9ff0b64e0e9a9b1e9c8c0e0e5f',
  cara: 'agent_8e9c0e0e5fd4730c3f9b0e467a',
  carly: 'agent_7d8c0e0e5fd4730c3f9b0e467a',
  carson: 'agent_6c7d8c0e0e5fd4730c3f9b0e46'
};
```

---

## 💬 Chat Agent

### Send a Message:

```javascript
const response = await CosentusSimple.sendChatMessage(message, chatId);
```

**First Message (creates new chat):**
```javascript
const response = await CosentusSimple.sendChatMessage('How do I reduce denials?');
console.log(response.content);  // AI response text
console.log(response.chatId);   // Save this for follow-ups
```

**Follow-up Messages:**
```javascript
const response = await CosentusSimple.sendChatMessage(
  'Tell me more',
  'previous-chat-id-here'
);
```

---

## 📋 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Custom Cosentus UI</title>
</head>
<body>
  <!-- Your custom UI here -->
  <button id="call-cindy">Call Cindy</button>
  <input id="chat-input" placeholder="Ask a question">
  <button id="send-chat">Send</button>
  <div id="chat-output"></div>

  <script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>
  <script>
    let currentChatId = null;

    // Voice call
    document.getElementById('call-cindy').onclick = async () => {
      const res = await fetch('https://cosentusai.vercel.app/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'agent_d6497c4fabcc7bebdf9e4b0b20' })
      });
      const { access_token } = await res.json();
      CosentusSimple.startVoiceCall('cindy', access_token);
    };

    // Chat
    document.getElementById('send-chat').onclick = async () => {
      const message = document.getElementById('chat-input').value;
      const response = await CosentusSimple.sendChatMessage(message, currentChatId);
      
      currentChatId = response.chatId;
      document.getElementById('chat-output').innerText = response.content;
    };
  </script>
</body>
</html>
```

---

## 🔧 API Endpoints

If you want even more control, call the APIs directly:

### Register Voice Call:
```javascript
POST https://cosentusai.vercel.app/api/retell/register-call
Body: { "agentId": "agent_d6497c4fabcc7bebdf9e4b0b20" }
Returns: { "access_token": "..." }
```

### Initialize Chat:
```javascript
POST https://cosentusai.vercel.app/api/assist-chat
Body: {}
Returns: { "chat_id": "..." }
```

### Send Chat Message:
```javascript
POST https://cosentusai.vercel.app/api/chat/send-message
Body: { "chatId": "...", "message": "..." }
Returns: { "content": "AI response here" }
```

---

## ⚠️ Requirements

- **HTTPS required** for voice (microphone access)
- **Modern browser** (Chrome, Firefox, Safari, Edge)
- **CORS enabled** (already configured on our end)

---

## 🆘 Support

Email: support@cosentus.com  
Demo: https://cosentusai.vercel.app
