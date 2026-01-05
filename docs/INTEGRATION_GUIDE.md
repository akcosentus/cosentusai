# Cosentus AI Integration Guide

**For Third-Party Web Developers**

This guide will help you integrate Cosentus AI agents (voice + chat) into your website, regardless of your tech stack.

---

## 📦 What You're Integrating

### **Voice Agents** (Real-time voice conversations)
- **Chloe** - Cosentus company information expert
- **Cindy** - Patient billing support specialist
- **Chris** - Insurance claim follow-up specialist
- **Cara** - Eligibility & benefits verification
- **Carly** - Prior authorization follow-up
- **Carson** - Payment reconciliation specialist

### **Chat Agent** (Text-based AI assistant)
- **Homepage AI Chat** - Powered by Retell AI, answers questions about Cosentus using knowledge base

---

## 🚀 Quick Start

### **Step 1: Get the Files**

You'll receive:
1. `cosentus-voice.js` - Voice agent SDK
2. This integration guide
3. API endpoint URLs

### **Step 2: Choose Your Integration**

- **Voice Agents** → Use the JavaScript SDK (see below)
- **Chat Agent** → Call the API endpoint (see below)

---

## 🎤 Voice Agent Integration

### **How It Works**

1. User clicks a button on your website
2. SDK connects to Cosentus voice agent
3. User has a real-time voice conversation
4. User ends the call

**You control:** Button design, placement, colors, text, animations  
**We control:** Voice AI, conversation logic, backend infrastructure

---

### **Installation**

#### **Option A: Host the SDK yourself (Recommended)**

1. Place `cosentus-voice.js` in your project (e.g., `/public/js/`)
2. Add script tags to your HTML:

```html
<!-- Required: Retell SDK -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>

<!-- Cosentus Voice SDK -->
<script src="/js/cosentus-voice.js"></script>
```

#### **Option B: Load from Cosentus CDN**

```html
<!-- Required: Retell SDK -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>

<!-- Cosentus Voice SDK (hosted by Cosentus) -->
<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>
```

---

### **Basic Usage**

#### **HTML**

```html
<!-- Create your button (style it however you want) -->
<button id="talk-to-chloe">Talk to Chloe</button>
<div id="status">Ready</div>
```

#### **JavaScript**

```javascript
// 1. Create agent instance
const chloe = CosentusVoice.createAgent('chloe');

// 2. Get button
const button = document.getElementById('talk-to-chloe');
const status = document.getElementById('status');

// 3. Connect on button click
button.onclick = async () => {
  button.disabled = true;
  status.textContent = 'Connecting...';
  await chloe.connect();
};

// 4. Listen to events
chloe.on('connected', () => {
  status.textContent = 'Connected - Start talking!';
});

chloe.on('speaking', () => {
  status.textContent = 'Chloe is speaking...';
});

chloe.on('listening', () => {
  status.textContent = 'Listening...';
});

chloe.on('disconnected', () => {
  status.textContent = 'Call ended';
  button.disabled = false;
});

chloe.on('error', (error) => {
  status.textContent = 'Error: ' + error;
  button.disabled = false;
});
```

---

### **Available Agents**

Use these names when creating agents:

| Agent Name | Description | Use Case |
|------------|-------------|----------|
| `'chloe'` | Cosentus info expert | Company info, services, pricing, general questions |
| `'cindy'` | Patient billing support | Billing questions, payment help, mock call demos |
| `'chris'` | Insurance claim specialist | Claim follow-ups, denial resolution, carrier calls |
| `'cara'` | Eligibility & benefits verification | Insurance verification, coverage checks, benefits |
| `'carly'` | Prior authorization follow-up | Auth status checks, expedited reviews, approvals |
| `'carson'` | Payment reconciliation | Missing payments, discrepancies, EOB retrieval |

**Example:**
```javascript
const chloe = CosentusVoice.createAgent('chloe');
const cindy = CosentusVoice.createAgent('cindy');
const chris = CosentusVoice.createAgent('chris');
const cara = CosentusVoice.createAgent('cara');
const carly = CosentusVoice.createAgent('carly');
const carson = CosentusVoice.createAgent('carson');
```

---

### **React Example**

```jsx
import { useEffect, useRef, useState } from 'react';

function VoiceAgentButton() {
  const agentRef = useRef(null);
  const [status, setStatus] = useState('Ready');
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Create agent
    agentRef.current = window.CosentusVoice.createAgent('chloe');
    
    // Set up event listeners
    agentRef.current.on('connected', () => {
      setIsConnected(true);
      setStatus('Connected');
    });
    
    agentRef.current.on('disconnected', () => {
      setIsConnected(false);
      setStatus('Ready');
    });
    
    agentRef.current.on('speaking', () => setStatus('Chloe is speaking...'));
    agentRef.current.on('listening', () => setStatus('Listening...'));
    agentRef.current.on('error', (err) => setStatus('Error: ' + err));
    
    return () => {
      if (agentRef.current) {
        agentRef.current.disconnect();
      }
    };
  }, []);
  
  const handleConnect = async () => {
    await agentRef.current.connect();
  };
  
  const handleDisconnect = () => {
    agentRef.current.disconnect();
  };
  
  return (
    <div>
      <button onClick={isConnected ? handleDisconnect : handleConnect}>
        {isConnected ? 'End Call' : 'Talk to Chloe'}
      </button>
      <p>{status}</p>
    </div>
  );
}
```

---

### **WordPress Example**

```php
<!-- Add to your WordPress theme -->
<button id="talk-to-chloe" class="btn btn-primary">Talk to Chloe</button>
<div id="status">Ready</div>

<!-- Add scripts to footer -->
<?php
function cosentus_voice_scripts() {
  ?>
  <script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/cosentus-voice.js"></script>
  <script>
    jQuery(document).ready(function($) {
      const chloe = CosentusVoice.createAgent('chloe');
      
      $('#talk-to-chloe').on('click', async function() {
        await chloe.connect();
      });
      
      chloe.on('connected', () => $('#status').text('Connected'));
      chloe.on('disconnected', () => $('#status').text('Ready'));
    });
  </script>
  <?php
}
add_action('wp_footer', 'cosentus_voice_scripts');
?>
```

---

### **Framer Example**

1. Add a **Code Component** or **Embed** block
2. Paste this code:

```html
<div>
  <button id="talk-to-chloe" style="padding: 12px 24px; background: #01B2D6; color: white; border: none; border-radius: 8px; cursor: pointer;">
    Talk to Chloe
  </button>
  <div id="status" style="margin-top: 10px;">Ready</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>

<script>
  const chloe = CosentusVoice.createAgent('chloe');
  
  document.getElementById('talk-to-chloe').onclick = async () => {
    await chloe.connect();
  };
  
  chloe.on('connected', () => {
    document.getElementById('status').textContent = 'Connected';
  });
  
  chloe.on('disconnected', () => {
    document.getElementById('status').textContent = 'Ready';
  });
</script>
```

---

### **SDK API Reference**

#### **`CosentusVoice.createAgent(agentName)`**
Creates a new voice agent instance.

**Parameters:**
- `agentName` (string): `'chloe'`, `'cindy'`, or `'chris'`

**Returns:** Agent instance

---

#### **`agent.connect()`**
Starts the voice call.

**Returns:** Promise

---

#### **`agent.disconnect()`**
Ends the voice call.

---

#### **`agent.on(event, callback)`**
Registers an event listener.

**Events:**
- `'connected'` - Call started
- `'disconnected'` - Call ended
- `'speaking'` - Agent is speaking
- `'listening'` - Agent is listening to user
- `'error'` - Error occurred (receives error message)

---

## 💬 Chat Agent Integration

### **How It Works**

1. User types a question in your chat UI
2. Your code sends a request to Cosentus API to initialize a chat session
3. API returns an access token for Retell AI's chat agent
4. Your code connects to Retell AI and handles the conversation
5. You display messages in your UI

**You control:** Chat UI design, input field, message bubbles, animations  
**We control:** AI logic (via Retell AI), knowledge base, response generation

**Note:** The chat agent uses Retell AI (agent ID: `agent_90d094ac45b9da3833c3fc835b`)

---

### **API Endpoint**

```
POST https://cosentusai.vercel.app/api/assist-chat
```

---

### **Request Format**

```javascript
fetch('https://cosentusai.vercel.app/api/assist-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What is Cosentus?' }
    ],
    thread_id: null  // Optional: for conversation continuity
  })
})
```

---

### **Response Format**

**Success (200):**
```json
{
  "response": "Cosentus is a medical RCM firm that...",
  "thread_id": "thread_abc123"
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message here"
}
```

---

### **Basic Example**

```html
<div id="chat-container">
  <div id="messages"></div>
  <input type="text" id="user-input" placeholder="Ask a question...">
  <button id="send-btn">Send</button>
</div>

<script>
  const messagesDiv = document.getElementById('messages');
  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  let threadId = null;
  
  sendBtn.onclick = async () => {
    const question = input.value.trim();
    if (!question) return;
    
    // Display user message
    messagesDiv.innerHTML += `<div class="user-msg">${question}</div>`;
    input.value = '';
    
    // Call API
    try {
      const response = await fetch('https://cosentusai.vercel.app/api/assist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: question }],
          thread_id: threadId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Display AI response
        messagesDiv.innerHTML += `<div class="ai-msg">${data.response}</div>`;
        threadId = data.thread_id;  // Save for conversation continuity
      } else {
        messagesDiv.innerHTML += `<div class="error-msg">Error: ${data.error}</div>`;
      }
    } catch (error) {
      messagesDiv.innerHTML += `<div class="error-msg">Connection error</div>`;
    }
  };
</script>
```

---

### **React Example**

```jsx
import { useState } from 'react';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('https://cosentusai.vercel.app/api/assist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage],
          thread_id: threadId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        setThreadId(data.thread_id);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'user-msg' : 'ai-msg'}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Ask a question..."
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
```

---

## 🔒 Security & Rate Limiting

### **Built-in Protection**

Both voice and chat APIs have rate limiting:

- **Voice Agents:** 3 calls per 5 minutes per IP
- **Chat Agent:** 10 messages per 5 minutes per IP

If a user hits the limit, they'll see a friendly error message asking them to wait.

### **Error Handling**

Always handle errors gracefully:

```javascript
try {
  await chloe.connect();
} catch (error) {
  alert('Unable to connect. Please try again later.');
}
```

---

## 🌐 Browser Compatibility

### **Voice Agents**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ⚠️ Requires HTTPS (except localhost)
- ⚠️ Requires microphone permissions

### **Chat Agent**
- ✅ All modern browsers
- ✅ Works on HTTP and HTTPS

---

## 🐛 Troubleshooting

### **Voice Agent Issues**

#### **"RetellWebClient is not defined"**
- Make sure you included the Retell SDK script **before** the Cosentus SDK
- Check browser console for script loading errors

#### **"Failed to register call"**
- Check that the API endpoint URL is correct
- Verify you're not hitting rate limits
- Check browser console for network errors

#### **Microphone not working**
- Ensure the site is served over HTTPS (required for microphone access)
- Check browser permissions
- Try Chrome/Edge for best WebRTC support

#### **Call connects but immediately ends**
- This is usually an agent configuration issue on Cosentus' end
- Contact Cosentus support

---

### **Chat Agent Issues**

#### **500 Error**
- The Retell AI chat agent might be unavailable
- Contact Cosentus support

#### **429 Error (Rate Limited)**
- User has sent too many messages
- Wait a few minutes and try again

#### **CORS Error**
- Make sure you're calling the correct API endpoint
- CORS is enabled on Cosentus' end, so this shouldn't happen

---

## 📞 Support

### **For Integration Help:**
- Check the detailed SDK documentation: `lib/cosentus-voice/README.md`
- Review code examples in this guide

### **For Technical Issues:**
- Contact: support@cosentus.com
- Provide: Browser console errors, network tab screenshots

### **For Agent Behavior/Content:**
- Contact Cosentus directly
- Agent responses are managed on Cosentus' end

---

## 📋 Checklist Before Launch

- [ ] Voice SDK scripts included in correct order
- [ ] Agent names used correctly (`'chloe'`, `'cindy'`, `'chris'`)
- [ ] Error handling implemented for both voice and chat
- [ ] Tested on HTTPS (required for voice agents)
- [ ] Microphone permissions prompt tested
- [ ] Chat UI displays errors gracefully
- [ ] Rate limiting behavior tested
- [ ] Tested on target browsers (Chrome, Safari, Firefox)
- [ ] Mobile responsive design tested
- [ ] Accessibility considerations (keyboard navigation, screen readers)

---

## 🎨 Design Tips

### **Voice Agent Buttons**
- Make them prominent and easy to find
- Use clear labels: "Talk to Chloe" not just "Chat"
- Show connection status (connecting, connected, listening, speaking)
- Disable button during connection to prevent double-clicks
- Consider adding a microphone icon

### **Chat Widget**
- Auto-scroll to latest message
- Show loading indicator while waiting for response
- Distinguish user vs AI messages visually
- Consider a "typing" indicator
- Make it mobile-friendly

---

## 🚀 Next Steps

1. **Test the demo site** provided by Cosentus to see agents in action
2. **Review the code examples** in this guide
3. **Start with one agent** (e.g., Chloe) to get familiar with the integration
4. **Build your UI** around the SDK/API
5. **Test thoroughly** before launch
6. **Contact Cosentus** with any questions

---

**Built by Cosentus AI © 2024**

For questions or support: support@cosentus.com

