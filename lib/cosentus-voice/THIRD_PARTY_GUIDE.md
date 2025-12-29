# Cosentus Voice Agent - Third-Party Integration Guide

## 🎯 Quick Start (5 Minutes)

### Step 1: Add Scripts to Your Website

Add these two script tags to your HTML (in `<head>` or before `</body>`):

```html
<!-- Retell SDK (required) -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>

<!-- Cosentus Voice Library -->
<script src="https://yourdomain.com/cosentus-voice.js"></script>
```

### Step 2: Create Your UI

Design your button/interface however you want. **You have complete design control.**

```html
<button id="talk-button">Talk to Chloe</button>
<div id="status">Ready</div>
```

### Step 3: Wire It Up

Add this JavaScript to connect your UI to the voice agent:

```javascript
// Create agent instance
const chloe = CosentusVoice.createAgent('chloe');

// Connect on button click
document.getElementById('talk-button').onclick = async () => {
  await chloe.connect();
};

// Update status (optional)
chloe.on('speaking', () => {
  document.getElementById('status').textContent = 'Chloe is speaking...';
});

chloe.on('listening', () => {
  document.getElementById('status').textContent = 'Listening...';
});

chloe.on('disconnected', () => {
  document.getElementById('status').textContent = 'Disconnected';
});
```

### ✅ Done!

---

## 🎨 Platform-Specific Guides

### Framer

**1. Add Scripts (Project Settings → Custom Code → Head):**
```html
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="https://yourdomain.com/cosentus-voice.js"></script>
```

**2. Design Your Button in Framer:**
- Create button visually
- Give it a name: `"voice-button"`

**3. Add Wiring (Project Settings → Custom Code → End of Body):**
```html
<script>
  const chloe = CosentusVoice.createAgent('chloe');
  
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('[data-framer-name="voice-button"]');
    btn.onclick = async () => await chloe.connect();
  });
</script>
```

---

### Webflow

**1. Add Scripts (Project Settings → Custom Code → Head Code):**
```html
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="https://yourdomain.com/cosentus-voice.js"></script>
```

**2. Design Your Button in Webflow:**
- Add button element
- Give it ID: `voice-button`

**3. Add Wiring (Project Settings → Custom Code → Footer Code):**
```html
<script>
  const chloe = CosentusVoice.createAgent('chloe');
  
  document.getElementById('voice-button').onclick = async () => {
    await chloe.connect();
  };
</script>
```

---

### WordPress

**1. Add Scripts (Theme Functions or Header):**
```php
function add_cosentus_voice() {
  ?>
  <script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
  <script src="https://yourdomain.com/cosentus-voice.js"></script>
  <?php
}
add_action('wp_head', 'add_cosentus_voice');
```

**2. Add Button to Your Page:**
```html
<button id="voice-button">Talk to Chloe</button>
```

**3. Add JavaScript:**
```javascript
jQuery(document).ready(function($) {
  const chloe = CosentusVoice.createAgent('chloe');
  
  $('#voice-button').on('click', async function() {
    await chloe.connect();
  });
});
```

---

### React

```jsx
import { useEffect, useRef, useState } from 'react';

function VoiceButton() {
  const agentRef = useRef(null);
  const [status, setStatus] = useState('Ready');
  
  useEffect(() => {
    // Create agent
    agentRef.current = window.CosentusVoice.createAgent('chloe');
    
    // Listen to events
    agentRef.current.on('speaking', () => setStatus('Speaking...'));
    agentRef.current.on('listening', () => setStatus('Listening...'));
    agentRef.current.on('disconnected', () => setStatus('Disconnected'));
    
    // Cleanup
    return () => {
      if (agentRef.current) {
        agentRef.current.disconnect();
      }
    };
  }, []);
  
  const handleClick = async () => {
    await agentRef.current.connect();
  };
  
  return (
    <div>
      <button onClick={handleClick}>Talk to Chloe</button>
      <p>{status}</p>
    </div>
  );
}
```

---

## 📚 Available Agents

| Agent Name | Description |
|-----------|-------------|
| `'chloe'` | Customer service agent - handles general inquiries |
| `'cindy'` | Payment specialist - handles billing and payments |

**Usage:**
```javascript
const chloe = CosentusVoice.createAgent('chloe');
const cindy = CosentusVoice.createAgent('cindy');
```

---

## 🎛️ API Reference

### `CosentusVoice.createAgent(name)`
Creates a new voice agent instance.

```javascript
const agent = CosentusVoice.createAgent('chloe');
```

### `agent.connect()`
Start the voice call.

```javascript
await agent.connect();
```

### `agent.disconnect()`
End the voice call.

```javascript
agent.disconnect();
```

### `agent.on(event, callback)`
Listen to agent events.

**Events:**
- `'connected'` - Call started
- `'disconnected'` - Call ended
- `'speaking'` - Agent is speaking
- `'listening'` - Agent is listening (user can speak)
- `'connecting'` - Connection in progress
- `'error'` - Error occurred (receives error message)

```javascript
agent.on('speaking', () => {
  console.log('Agent is speaking');
});

agent.on('error', (errorMessage) => {
  console.error('Error:', errorMessage);
});
```

### `agent.getState()`
Get current agent state.

```javascript
const state = agent.getState();
console.log(state.isConnected);  // true/false
console.log(state.isRecording);  // true/false (agent speaking)
console.log(state.error);        // null or error message
```

---

## 🔧 Advanced Configuration

### Custom API Endpoint

If you're hosting the backend on a different domain:

```javascript
CosentusVoice.configure({
  apiEndpoint: 'https://api.yoursite.com/voice/token'
});
```

---

## ⚠️ Requirements

- ✅ **HTTPS required** (except localhost)
- ✅ **Microphone permissions** (browser will prompt user)
- ✅ **Modern browser** (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)

---

## 🐛 Troubleshooting

### "RetellWebClient is not defined"
Make sure the Retell SDK script is loaded **before** cosentus-voice.js:
```html
<!-- This must come first -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<!-- Then this -->
<script src="https://yourdomain.com/cosentus-voice.js"></script>
```

### "Failed to register call"
- Check that the API endpoint is correct
- Verify the backend is running and accessible
- Check browser console for detailed error messages

### Microphone not working
- Ensure your site is on HTTPS (required for microphone access)
- Check that user granted microphone permissions
- Try in an incognito window to rule out permission cache issues

---

## 📞 Support

For questions or issues, contact: **support@cosentus.com**

---

## 📄 License

Proprietary - Cosentus AI © 2024
