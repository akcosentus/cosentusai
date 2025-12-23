# Cosentus Voice Agent Library

A headless, framework-agnostic JavaScript library for integrating Retell AI voice agents into any website.

## Features

- ✅ **Universal** - Works with React, Vue, Angular, WordPress, plain HTML, or any web platform
- ✅ **Headless** - No UI included, you build your own interface
- ✅ **Simple API** - Use agent names, not IDs
- ✅ **Event-driven** - React to connection states, speaking events, errors
- ✅ **Lightweight** - ~5KB minified
- ✅ **TypeScript support** - Type definitions included

## Quick Start

### 1. Include Required Scripts

```html
<!-- Retell SDK (required) -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>

<!-- Cosentus Voice Library -->
<script src="/lib/cosentus-voice/cosentus-voice.js"></script>
```

### 2. Create an Agent

```javascript
// Create agent instance by name
const chloe = CosentusVoice.createAgent('chloe');
```

### 3. Connect to Agent

```javascript
// Connect to start voice call
await chloe.connect();
```

### 4. Listen to Events

```javascript
// Listen to agent events
chloe.on('speaking', () => {
  console.log('Chloe is speaking...');
});

chloe.on('listening', () => {
  console.log('Listening...');
});

chloe.on('error', (error) => {
  console.error('Error:', error);
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Talk to Chloe</title>
</head>
<body>
  <h1>Customer Service</h1>
  
  <button id="talk-btn">Talk to Chloe</button>
  <button id="end-btn" disabled>End Call</button>
  
  <div id="status">Ready</div>

  <!-- Required Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
  <script src="/lib/cosentus-voice/cosentus-voice.js"></script>

  <script>
    // Create agent
    const chloe = CosentusVoice.createAgent('chloe');
    
    // Get elements
    const talkBtn = document.getElementById('talk-btn');
    const endBtn = document.getElementById('end-btn');
    const status = document.getElementById('status');
    
    // Connect button
    talkBtn.onclick = async () => {
      talkBtn.disabled = true;
      await chloe.connect();
    };
    
    // Disconnect button
    endBtn.onclick = () => {
      chloe.disconnect();
    };
    
    // Event listeners
    chloe.on('connected', () => {
      status.textContent = 'Connected';
      talkBtn.disabled = true;
      endBtn.disabled = false;
    });
    
    chloe.on('speaking', () => {
      status.textContent = 'Chloe is speaking...';
    });
    
    chloe.on('listening', () => {
      status.textContent = 'Listening...';
    });
    
    chloe.on('disconnected', () => {
      status.textContent = 'Disconnected';
      talkBtn.disabled = false;
      endBtn.disabled = true;
    });
    
    chloe.on('error', (error) => {
      status.textContent = 'Error: ' + error;
      talkBtn.disabled = false;
      endBtn.disabled = true;
    });
  </script>
</body>
</html>
```

## API Reference

### `CosentusVoice.createAgent(agentName)`

Creates a new voice agent instance.

**Parameters:**
- `agentName` (string) - Agent name: `'chloe'` or `'cindy'`

**Returns:** `VoiceAgent` instance

**Example:**
```javascript
const chloe = CosentusVoice.createAgent('chloe');
const cindy = CosentusVoice.createAgent('cindy');
```

---

### `agent.connect()`

Connect to the agent and start voice call.

**Returns:** `Promise<void>`

**Example:**
```javascript
await chloe.connect();
```

---

### `agent.disconnect()`

Disconnect from the agent and end voice call.

**Example:**
```javascript
chloe.disconnect();
```

---

### `agent.on(event, callback)`

Register an event listener.

**Parameters:**
- `event` (string) - Event name
- `callback` (function) - Callback function

**Available Events:**
- `'connected'` - Call started successfully
- `'disconnected'` - Call ended
- `'speaking'` - Agent started speaking
- `'listening'` - Agent stopped speaking (listening to user)
- `'connecting'` - Connection in progress
- `'error'` - Error occurred (receives error message)
- `'statusChange'` - Any status change (receives status string)
- `'update'` - Real-time updates from Retell (transcripts, etc.)

**Example:**
```javascript
chloe.on('speaking', () => {
  console.log('Agent is speaking');
});

chloe.on('error', (errorMessage) => {
  console.error('Error:', errorMessage);
});
```

---

### `agent.off(event, callback)`

Remove an event listener.

**Example:**
```javascript
function handleSpeaking() {
  console.log('Speaking');
}

chloe.on('speaking', handleSpeaking);
chloe.off('speaking', handleSpeaking);
```

---

### `agent.getState()`

Get current agent state.

**Returns:** Object with current state

**Example:**
```javascript
const state = chloe.getState();
console.log(state.isConnected); // true/false
console.log(state.isRecording); // true/false
console.log(state.error);       // null or error message
```

---

### `CosentusVoice.configure(options)`

Configure the library.

**Parameters:**
- `options.apiEndpoint` (string) - Custom API endpoint for token generation

**Example:**
```javascript
CosentusVoice.configure({
  apiEndpoint: 'https://api.mysite.com/voice/token'
});
```

---

## Available Agents

| Name | Description |
|------|-------------|
| `chloe` | Customer service agent |
| `cindy` | Payment & balance specialist |

## React Integration

```jsx
import { useEffect, useRef, useState } from 'react';

function VoiceDemo() {
  const agentRef = useRef(null);
  const [status, setStatus] = useState('Ready');
  
  useEffect(() => {
    // Create agent
    agentRef.current = window.CosentusVoice.createAgent('chloe');
    
    // Set up listeners
    agentRef.current.on('statusChange', setStatus);
    
    return () => {
      // Cleanup
      if (agentRef.current) {
        agentRef.current.disconnect();
      }
    };
  }, []);
  
  const handleConnect = async () => {
    await agentRef.current.connect();
  };
  
  return (
    <div>
      <button onClick={handleConnect}>Talk to Chloe</button>
      <p>{status}</p>
    </div>
  );
}
```

## WordPress Integration

```php
<!-- In your WordPress theme -->
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/cosentus-voice.js"></script>

<button id="talk-to-chloe">Talk to Chloe</button>

<script>
  jQuery(document).ready(function($) {
    const chloe = CosentusVoice.createAgent('chloe');
    
    $('#talk-to-chloe').on('click', async function() {
      await chloe.connect();
    });
  });
</script>
```

## Error Handling

```javascript
const chloe = CosentusVoice.createAgent('chloe');

chloe.on('error', (error) => {
  // Handle specific errors
  if (error.includes('microphone')) {
    alert('Please allow microphone access');
  } else if (error.includes('token')) {
    alert('Session expired, please refresh');
  } else {
    alert('Connection error: ' + error);
  }
});

// Try-catch for connect()
try {
  await chloe.connect();
} catch (error) {
  console.error('Failed to connect:', error);
}
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ⚠️ Requires HTTPS (except localhost)
- ⚠️ Requires microphone permissions

## Troubleshooting

### "RetellWebClient is not defined"
Make sure to include the Retell SDK before cosentus-voice.js:
```html
<script src="https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js"></script>
<script src="/lib/cosentus-voice/cosentus-voice.js"></script>
```

### "Failed to register call"
Check that your API endpoint is correct and the RETELL_API_KEY environment variable is set.

### "Unknown agent"
Make sure you're using a valid agent name: `'chloe'` or `'cindy'`

## Support

For issues or questions, contact: support@cosentus.com

## License

Proprietary - Cosentus AI © 2024

