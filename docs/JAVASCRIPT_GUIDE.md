# Cosentus AI - JavaScript Integration Guide

**Simple JavaScript integration with 100% design control**

---

## 🚀 Quick Start

### **Step 1: Include the Script**

```html
<script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>
```

### **Step 2: Use It**

That's it! Now you can call Cosentus AI functions from your own code.

---

## 💬 Chat Assistant

**Build your own chat UI - we just provide the AI responses**

### **Complete Example:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Custom Chat</title>
  <style>
    /* YOUR DESIGN - style it however you want */
    #chat-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    #messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; }
    .message { margin: 10px 0; padding: 10px; border-radius: 8px; }
    .user { background: #007bff; color: white; text-align: right; }
    .assistant { background: #f0f0f0; color: #333; }
  </style>
</head>
<body>
  <!-- YOUR HTML - design it however you want -->
  <div id="chat-container">
    <div id="messages"></div>
    <input type="text" id="input" placeholder="Ask me anything..." />
    <button id="send">Send</button>
  </div>

  <!-- Load Cosentus Simple -->
  <script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>

  <script>
    // YOUR CODE - control everything
    const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('send');

    // Add message to your UI
    function addMessage(text, sender) {
      const div = document.createElement('div');
      div.className = `message ${sender}`;
      div.textContent = text;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Send message
    sendBtn.onclick = async () => {
      const message = input.value.trim();
      if (!message) return;

      // Add user message to YOUR UI
      addMessage(message, 'user');
      input.value = '';

      try {
        // Get AI response from Cosentus
        const response = await CosentusSimple.sendChatMessage(message);
        
        // Add AI response to YOUR UI
        addMessage(response, 'assistant');
      } catch (error) {
        addMessage('Error: ' + error.message, 'assistant');
      }
    };

    // Send on Enter key
    input.onkeypress = (e) => {
      if (e.key === 'Enter') sendBtn.click();
    };
  </script>
</body>
</html>
```

### **API Reference:**

```javascript
// Send a message and get AI response
const response = await CosentusSimple.sendChatMessage('What is Cosentus?');
console.log(response); // "Cosentus is a healthcare RCM company..."

// Initialize a new chat session (optional - auto-initialized on first message)
const chatId = await CosentusSimple.initChat();

// End the chat session
await CosentusSimple.endChat();
```

---

## 🎤 Voice Agents

**Build your own voice UI - we just handle the AI conversation**

### **Complete Example:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Talk to Chloe</title>
  <style>
    /* YOUR DESIGN - style it however you want */
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    #call-btn { padding: 20px 40px; font-size: 20px; cursor: pointer; }
    #call-btn.connected { background: red; color: white; }
    #status { margin-top: 20px; font-size: 18px; }
  </style>
</head>
<body>
  <!-- YOUR HTML - design it however you want -->
  <h1>Talk to Chloe</h1>
  <button id="call-btn">Start Call</button>
  <div id="status">Ready</div>

  <!-- Load Cosentus Simple -->
  <script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>

  <script>
    // YOUR CODE - control everything
    const callBtn = document.getElementById('call-btn');
    const status = document.getElementById('status');
    let isConnected = false;

    callBtn.onclick = async () => {
      if (!isConnected) {
        // Start call
        callBtn.disabled = true;
        status.textContent = 'Connecting...';

        await CosentusSimple.startVoiceCall('chloe', {
          onConnected: () => {
            isConnected = true;
            callBtn.disabled = false;
            callBtn.textContent = 'End Call';
            callBtn.classList.add('connected');
            status.textContent = 'Connected - Start talking!';
          },
          onDisconnected: () => {
            isConnected = false;
            callBtn.textContent = 'Start Call';
            callBtn.classList.remove('connected');
            status.textContent = 'Call ended';
          },
          onAgentSpeaking: () => {
            status.textContent = 'Chloe is speaking...';
          },
          onAgentListening: () => {
            status.textContent = 'Listening...';
          },
          onError: (error) => {
            status.textContent = 'Error: ' + error.message;
            callBtn.disabled = false;
          }
        });
      } else {
        // End call
        CosentusSimple.endVoiceCall();
      }
    };
  </script>
</body>
</html>
```

### **API Reference:**

```javascript
// Start a voice call with an agent
await CosentusSimple.startVoiceCall('chloe', {
  onConnected: () => console.log('Call started'),
  onDisconnected: () => console.log('Call ended'),
  onAgentSpeaking: () => console.log('Agent is speaking'),
  onAgentListening: () => console.log('Agent is listening'),
  onError: (error) => console.error('Error:', error)
});

// End the current call
CosentusSimple.endVoiceCall();
```

### **Available Agents:**

```javascript
// Use any of these agent names:
'chloe'     // Cosentus company information expert
'cindy'     // Patient billing support specialist
'chris'     // Insurance claim follow-up specialist
'cara'      // Eligibility & benefits verification
'carly'     // Prior authorization follow-up
'carson'    // Payment reconciliation specialist
'cassidy'   // Pre-service anesthesia cost estimates
'courtney'  // Medical appointment scheduling
```

---

## 🎨 Design Freedom

**You control 100% of the design:**

- ✅ Your HTML structure
- ✅ Your CSS styling
- ✅ Your button design
- ✅ Your layout
- ✅ Your animations
- ✅ Your color scheme
- ✅ Your fonts
- ✅ Your spacing

**We only provide:**
- ✅ AI conversation logic
- ✅ Backend API calls
- ✅ Voice/chat functionality

---

## 📋 Complete API Reference

### **Chat Functions:**

```javascript
// Initialize chat (optional - auto-initialized on first message)
const chatId = await CosentusSimple.initChat();

// Send message and get response
const response = await CosentusSimple.sendChatMessage('Hello');

// End chat session
await CosentusSimple.endChat();
```

### **Voice Functions:**

```javascript
// Start voice call
await CosentusSimple.startVoiceCall(agentName, {
  onConnected: () => {},      // Called when call starts
  onDisconnected: () => {},   // Called when call ends
  onAgentSpeaking: () => {},  // Called when agent speaks
  onAgentListening: () => {}, // Called when agent listens
  onError: (error) => {}      // Called on error
});

// End voice call
CosentusSimple.endVoiceCall();
```

### **Utility Functions:**

```javascript
// Get list of all agents
const agents = CosentusSimple.getAgents();
console.log(agents.chloe.name);        // "Chloe"
console.log(agents.chloe.description); // "Cosentus company information expert"

// Get library version
console.log(CosentusSimple.version); // "1.0.0"
```

---

## 🌐 Framework Examples

### **React:**

```jsx
import { useState } from 'react';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    // Add user message
    setMessages([...messages, { text: input, sender: 'user' }]);
    
    // Get AI response
    const response = await window.CosentusSimple.sendChatMessage(input);
    
    // Add AI message
    setMessages([...messages, 
      { text: input, sender: 'user' },
      { text: response, sender: 'assistant' }
    ]);
    
    setInput('');
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.sender}>{msg.text}</div>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

### **Vue:**

```vue
<template>
  <div>
    <div v-for="msg in messages" :class="msg.sender">{{ msg.text }}</div>
    <input v-model="input" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      input: ''
    };
  },
  methods: {
    async sendMessage() {
      this.messages.push({ text: this.input, sender: 'user' });
      const response = await window.CosentusSimple.sendChatMessage(this.input);
      this.messages.push({ text: response, sender: 'assistant' });
      this.input = '';
    }
  }
};
</script>
```

### **WordPress:**

```php
<!-- Add to your theme -->
<div id="chat-widget">
  <div id="messages"></div>
  <input type="text" id="chat-input" />
  <button id="send-btn">Send</button>
</div>

<script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>
<script>
jQuery(document).ready(function($) {
  $('#send-btn').on('click', async function() {
    const message = $('#chat-input').val();
    $('#messages').append('<div class="user">' + message + '</div>');
    
    const response = await CosentusSimple.sendChatMessage(message);
    $('#messages').append('<div class="assistant">' + response + '</div>');
    
    $('#chat-input').val('');
  });
});
</script>
```

---

## ⚠️ Important Notes

1. **HTTPS Required** - Voice calls require HTTPS for microphone access
2. **Browser Compatibility** - Works on all modern browsers (Chrome, Firefox, Safari, Edge)
3. **Mobile Support** - Fully responsive and works on mobile devices
4. **No Dependencies** - Just include one script tag and you're ready

---

## 🆘 Need Help?

Contact the Cosentus team:
- **Email:** support@cosentus.com
- **Demo Site:** https://cosentusai.vercel.app

---

## 📦 What You Get

**You control:**
- ✅ 100% of the UI design
- ✅ 100% of the HTML/CSS
- ✅ 100% of the user experience
- ✅ When/how to show the chat/voice
- ✅ All styling and branding

**We provide:**
- ✅ AI conversation logic
- ✅ Backend infrastructure
- ✅ Voice/chat functionality
- ✅ Simple JavaScript API

**You're NOT responsible for:**
- ❌ AI training
- ❌ Backend servers
- ❌ Voice processing
- ❌ API maintenance
