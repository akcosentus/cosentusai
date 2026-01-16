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
- **Cassidy** - Pre-service anesthesia cost estimates
- **Courtney** - Medical appointment scheduling

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

## 💬 Chat Assistant Integration (Headless SDK)

The chat assistant is integrated via the same `cosentus-voice.js` SDK. It provides the backend communication logic, and you build the UI.

### **How It Works**

1. **Initialize:** Create a `ChatAssistant` instance using `CosentusVoice.createChatAssistant()`.
2. **Listen to Events:** Subscribe to `message`, `loading`, and `error` events to update your UI.
3. **Send Messages:** Call `chatAssistant.sendMessage(userMessage)` to send user input.
4. **Receive Responses:** The `message` event will fire with the AI's response.
5. **End Session:** Call `chatAssistant.reset()` when the conversation is complete.

**You control:** Chat UI design, input field, message bubbles, animations, loading indicators, error display.  
**We control:** AI logic, knowledge base, response generation, API calls.

---

### **SDK Installation**

Same as voice agents - include the SDK in your HTML:

```html
<!-- Cosentus SDK (includes chat + voice) -->
<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>
```

---

### **IMPORTANT: Configure API Endpoints**

**If you're integrating from an external domain** (not `cosentusai.vercel.app`), you MUST configure the SDK to point to the Cosentus API:

```javascript
// Configure BEFORE creating chat assistant
CosentusVoice.configure({
  chatInitEndpoint: 'https://cosentusai.vercel.app/api/assist-chat',
  chatSendEndpoint: 'https://cosentusai.vercel.app/api/chat/send-message'
});
```

**Why?** By default, the SDK uses relative paths (e.g., `/api/assist-chat`), which would try to call your own domain. This configuration tells it to use the Cosentus API instead.

**Note:** If you're testing locally or on a different domain, this configuration is **required**.

---

### **Handling Async SDK Loading**

Since the SDK loads asynchronously, you may need to wait for it to be available:

```javascript
// Check if SDK is loaded
if (window.CosentusVoice) {
  // SDK is ready, configure and use it
  CosentusVoice.configure({ /* ... */ });
} else {
  // Wait for SDK to load
  const checkInterval = setInterval(() => {
    if (window.CosentusVoice) {
      clearInterval(checkInterval);
      CosentusVoice.configure({ /* ... */ });
      // Initialize your chat
    }
  }, 100);
  
  // Timeout after 10 seconds
  setTimeout(() => clearInterval(checkInterval), 10000);
}
```

**Or use the `async` attribute and wait for the `load` event:**

```html
<script src="https://cosentusai.vercel.app/cosentus-voice.js" async onload="initChat()"></script>
<script>
  function initChat() {
    CosentusVoice.configure({ /* ... */ });
    const chat = CosentusVoice.createChatAssistant();
    // ... rest of your code
  }
</script>
```

---

### **SDK Usage**

```javascript
// 1. Configure SDK (REQUIRED for external domains)
CosentusVoice.configure({
  chatInitEndpoint: 'https://cosentusai.vercel.app/api/assist-chat',
  chatSendEndpoint: 'https://cosentusai.vercel.app/api/chat/send-message'
});

// 2. Create chat assistant instance
const chat = CosentusVoice.createChatAssistant();

// 2. Listen for events to update your UI
chat.on('message', (data) => {
  console.log('AI Response:', data.content);
  // Update your chat UI with data.content
  // data.role = 'assistant'
  // data.messageId = unique ID
});

chat.on('loading', (data) => {
  console.log('Loading:', data.isLoading);
  // Show/hide loading indicator in your UI
});

chat.on('error', (data) => {
  console.error('Chat Error:', data.error);
  // Display error message in your UI
});

chat.on('initialized', (data) => {
  console.log('Chat session created:', data.chatId);
});

chat.on('reset', () => {
  console.log('Chat session reset');
});

// 3. Send a message
async function sendUserMessage(message) {
  if (!message.trim()) return;
  console.log('User Message:', message);
  // Update your chat UI with user message
  await chat.sendMessage(message);
}

// 4. Reset the session (optional)
// chat.reset();
```

---

### **Available Methods**

| Method | Description |
|--------|-------------|
| `createChatAssistant()` | Create a new chat assistant instance |
| `sendMessage(message)` | Send a message and get AI response |
| `reset()` | Reset the chat session |
| `getChatId()` | Get current chat session ID |
| `getLoadingState()` | Check if currently loading |

---

### **Available Events**

| Event | Data | Description |
|-------|------|-------------|
| `initialized` | `{ chatId }` | Chat session initialized |
| `message` | `{ content, role, messageId }` | AI response received |
| `loading` | `{ isLoading }` | Loading state changed |
| `error` | `{ error }` | Error occurred |
| `reset` | - | Session reset |

---

### **Basic HTML Example**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat with Cosentus AI</title>
  <style>
    #messages {
      height: 400px;
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
    }
    .user-msg { text-align: right; color: blue; margin: 5px 0; }
    .ai-msg { text-align: left; color: green; margin: 5px 0; }
    .loading { color: gray; font-style: italic; }
  </style>
</head>
<body>
  <h1>Cosentus AI Chat</h1>
  <div id="messages"></div>
  <input type="text" id="input" placeholder="Type a message..." style="width: 70%;">
  <button id="send">Send</button>
  <button id="reset">Reset</button>

  <!-- Include Cosentus SDK -->
  <script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>

<script>
    // Configure SDK to use Cosentus API
    CosentusVoice.configure({
      chatInitEndpoint: 'https://cosentusai.vercel.app/api/assist-chat',
      chatSendEndpoint: 'https://cosentusai.vercel.app/api/chat/send-message'
    });
    
    const chat = CosentusVoice.createChatAssistant();
  const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('input');
    let loadingDiv = null;
    
    // Display message in UI
    function addMessage(content, role) {
      const div = document.createElement('div');
      div.className = role === 'user' ? 'user-msg' : 'ai-msg';
      div.textContent = content;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    // Show/hide loading indicator
    function setLoading(isLoading) {
      if (isLoading) {
        loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.textContent = 'AI is thinking...';
        messagesDiv.appendChild(loadingDiv);
      } else if (loadingDiv) {
        loadingDiv.remove();
        loadingDiv = null;
      }
    }
    
    // Listen for AI responses
    chat.on('message', (data) => {
      addMessage(data.content, 'assistant');
    });
    
    chat.on('loading', (data) => {
      setLoading(data.isLoading);
    });
    
    chat.on('error', (data) => {
      alert('Error: ' + data.error);
    });
    
    // Send message
    document.getElementById('send').onclick = async () => {
      const message = input.value.trim();
      if (!message) return;
      
      addMessage(message, 'user');
      input.value = '';
      
      try {
        await chat.sendMessage(message);
      } catch (error) {
        console.error('Failed to send:', error);
      }
    };
    
    // Reset chat
    document.getElementById('reset').onclick = () => {
      chat.reset();
      messagesDiv.innerHTML = '';
    };
    
    // Enter to send
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('send').click();
      }
    });
</script>
</body>
</html>
```

---

### **React Example**

```jsx
import { useState, useEffect } from 'react';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState(null);
  
  useEffect(() => {
    // Wait for SDK to load (if using async script tag)
    const initChat = () => {
      if (!window.CosentusVoice) return;
      
      // Configure SDK to use Cosentus API
      window.CosentusVoice.configure({
        chatInitEndpoint: 'https://cosentusai.vercel.app/api/assist-chat',
        chatSendEndpoint: 'https://cosentusai.vercel.app/api/chat/send-message'
      });
      
      // Initialize chat assistant
      const chatInstance = window.CosentusVoice.createChatAssistant();
    
    // Listen for events
    chatInstance.on('message', (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    });
    
    chatInstance.on('loading', (data) => {
      setLoading(data.isLoading);
    });
    
    chatInstance.on('error', (data) => {
      alert('Error: ' + data.error);
    });
    
      setChat(chatInstance);
    };
    
    // Check if SDK is already loaded
    if (window.CosentusVoice) {
      initChat();
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.CosentusVoice) {
          initChat();
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Cleanup
      return () => clearInterval(checkInterval);
    }
  }, []);
  
  const sendMessage = async () => {
    if (!input.trim() || !chat) return;
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const messageToSend = input;
    setInput('');
    
    // Send to AI
    try {
      await chat.sendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send:', error);
    }
  };
  
  const resetChat = () => {
    if (chat) {
      chat.reset();
      setMessages([]);
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
        {loading && <div className="loading">AI is thinking...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Ask a question..."
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading || !chat}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      <button onClick={resetChat} disabled={!chat}>
        Reset
      </button>
    </div>
  );
}

export default ChatWidget;
```

**TypeScript Support:**

Add this to your type definitions file (e.g., `global.d.ts`):

```typescript
declare global {
  interface Window {
    CosentusVoice?: {
      createChatAssistant: () => any;
      createAgent: (name: string) => any;
      configure: (options: {
        chatInitEndpoint?: string;
        chatSendEndpoint?: string;
        apiEndpoint?: string;
      }) => void;
    };
  }
}

export {};
```

---

### **WordPress Example**

```php
<!-- Add to your WordPress theme or page template -->
<div id="cosentus-chat">
  <div id="chat-messages"></div>
  <input type="text" id="chat-input" placeholder="Ask a question...">
  <button id="chat-send">Send</button>
</div>

<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>
<script>
jQuery(document).ready(function($) {
  // Configure SDK to use Cosentus API
  CosentusVoice.configure({
    chatInitEndpoint: 'https://cosentusai.vercel.app/api/assist-chat',
    chatSendEndpoint: 'https://cosentusai.vercel.app/api/chat/send-message'
  });
  
  const chat = CosentusVoice.createChatAssistant();
  const messagesDiv = $('#chat-messages');
  const input = $('#chat-input');
  
  chat.on('message', function(data) {
    messagesDiv.append('<div class="ai-msg">' + data.content + '</div>');
  });
  
  chat.on('error', function(data) {
    alert('Error: ' + data.error);
  });
  
  $('#chat-send').on('click', async function() {
    const message = input.val().trim();
    if (!message) return;
    
    messagesDiv.append('<div class="user-msg">' + message + '</div>');
    input.val('');
    
    await chat.sendMessage(message);
  });
});
</script>
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

