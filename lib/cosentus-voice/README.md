# Cosentus Voice & Chat Agent Library

A headless, framework-agnostic JavaScript library for integrating Retell AI voice agents and chat assistant into any website.

## Features

- ✅ **Universal** - Works with React, Vue, Angular, WordPress, plain HTML, or any web platform
- ✅ **Headless** - No UI included, you build your own interface
- ✅ **Simple API** - Use agent names, not IDs
- ✅ **Event-driven** - React to connection states, speaking events, errors
- ✅ **Chat Assistant** - Headless chat with your own UI
- ✅ **Lightweight** - ~8KB minified
- ✅ **TypeScript support** - Type definitions included

## Quick Start

### Chat Assistant (Recommended - Start Here)

```html
<!-- Include Cosentus SDK -->
<script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>

<script>
  // 1. Create chat assistant
  const chat = CosentusVoice.createChatAssistant();
  
  // 2. Listen for responses
  chat.on('message', (data) => {
    console.log('AI:', data.content);
    // Add to your UI here
  });
  
  // 3. Send messages
  await chat.sendMessage('What is Cosentus?');
</script>
```

### Voice Agents

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

## 💬 Chat Assistant (Headless)

The chat assistant provides API communication for text-based chat. You build your own UI, the SDK handles all backend logic.

### Basic Usage

```javascript
// Create chat assistant
const chat = CosentusVoice.createChatAssistant();

// Listen for events
chat.on('message', (data) => {
  // data.content = AI response text
  // data.role = 'assistant'
  // data.messageId = unique ID
  displayInYourUI(data.content);
});

chat.on('loading', (data) => {
  showLoadingIndicator(data.isLoading);
});

chat.on('error', (data) => {
  showError(data.error);
});

// Send messages
await chat.sendMessage('What is Cosentus?');

// Reset session
chat.reset();
```

### Available Methods

#### `createChatAssistant()`
Creates a new chat assistant instance.

```javascript
const chat = CosentusVoice.createChatAssistant();
```

#### `initialize()`
Manually initialize a chat session. Called automatically on first `sendMessage()`.

```javascript
const chatId = await chat.initialize();
```

#### `sendMessage(message)`
Send a message and get AI response.

```javascript
const response = await chat.sendMessage('Hello');
// response.content = AI response text
// response.role = 'assistant'
// response.messageId = unique ID
```

#### `reset()`
Reset the chat session (clears chatId).

```javascript
chat.reset();
```

#### `getChatId()`
Get current chat session ID.

```javascript
const chatId = chat.getChatId();
```

#### `getLoadingState()`
Check if currently loading.

```javascript
const isLoading = chat.getLoadingState();
```

### Available Events

| Event | Data | Description |
|-------|------|-------------|
| `initialized` | `{ chatId }` | Chat session initialized |
| `message` | `{ content, role, messageId }` | AI response received |
| `loading` | `{ isLoading }` | Loading state changed |
| `error` | `{ error }` | Error occurred |
| `reset` | - | Session reset |

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat with Cosentus AI</title>
  <style>
    #messages { height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; }
    .user { text-align: right; color: blue; }
    .assistant { text-align: left; color: green; }
  </style>
</head>
<body>
  <div id="messages"></div>
  <input type="text" id="input" placeholder="Type a message...">
  <button id="send">Send</button>
  <button id="reset">Reset</button>

  <script src="https://cosentusai.vercel.app/cosentus-voice.js"></script>
  <script>
    const chat = CosentusVoice.createChatAssistant();
    const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('input');
    
    // Display message in UI
    function addMessage(content, role) {
      const div = document.createElement('div');
      div.className = role;
      div.textContent = content;
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    // Listen for AI responses
    chat.on('message', (data) => {
      addMessage(data.content, 'assistant');
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

## 🎤 Available Voice Agents

| Name     | Description                                  |
|----------|----------------------------------------------|
| `chloe`  | Medical billing & RCM info assistant         |
| `cindy`  | Patient billing support (Q&A + mock call)    |
| `chris`  | Insurance claim follow-up specialist         |
| `cara`   | Eligibility & benefits verification          |
| `carly`  | Prior authorization follow-up                |
| `carson` | Payment reconciliation specialist            |

---

### `chloe` – Medical Billing & RCM Assistant

Chloe is a friendly, knowledgeable AI representative for Cosentus. She answers any question about Cosentus, medical billing, revenue cycle management, AI capabilities, company background, pricing, and customer support—drawing from a comprehensive company knowledge base.

**Key capabilities:**
- Answers any and all questions about Cosentus: company, RCM/billing services, AI tech, value, pricing, process, team, company mission, and more
- Supports practices across all medical specialties
- Explains the benefits of Cosentus’s automation and revenue cycle solutions
- Can handle up to 20 conversations at once, multilingual (see below)
- Provides concise, conversational, accurate responses
- Never gives medical advice, PHI, or technical/implementation details

**For dev teams:**
- Chloe is reliable for all company, services, and AI questions—no strict question list; show her in UX as a “Cosentus info expert.”
- If unsure, Chloe will gently steer users to real Cosentus staff for details: “That’s a great question—but I don’t have that information right now. Please contact the Cosentus team.”
- Instructs users to dial 911 for emergencies; never gives medical advice.

### `cindy` – Patient Billing Support Specialist (Q&A + Mock Call)

Cindy is an empathetic AI assistant who helps medical practice patients with billing questions and outstanding balances. On the demo site, Cindy supports **two modes**:

**1. Q&A Mode (Default):**
- Answers questions about her job, Cosentus' patient billing support, and types of billing questions handled (see below)
- Explains how she verifies patient identity, what she can/can’t look up
- Covers the 4 most common patient billing questions:
  1. Was this billed to primary or secondary insurance?
  2. Do you have my updated insurance on file?
  3. Why do I owe this amount?
  4. I already paid / this isn't my bill

**2. Mock Call Demo Mode:**
- If the visitor asks for a “mock call” (or to pretend to be a patient), Cindy will roleplay a real support call:
  1. Greets and verifies name/DOB
  2. Asks for provider/facility (date of service if needed)
  3. Responds to one of the 4 billing questions in a natural way
  4. Closes politely
- **Encourage users:** “To see Cindy in action, type ‘Can we do a mock call?’ and roleplay a billing question!”

**Key capabilities:**
- Patient billing Q&A, secure ID verification, supports 20 calls, answers in 10+ languages
- Transfers to live billing specialist if needed
- Never gives medical advice or discusses PHI

**Demo safety:**
- If unsure/off-topic: “That’s a great question – but I’m just a demo version right now. Please reach out to the Cosentus team for specifics.”
- If user mentions a medical emergency, instructs them to call 911

### `chris` – Insurance Claim Follow-Up Specialist

Handles outbound calls to insurance companies on behalf of medical practices to check claim statuses, resolve denials, and gather information needed for billing.

**Key capabilities:**
- Calls any insurance carrier to check claim status
- Handles claim scenarios (not on file, denied, paid, eligibility issues, prior auth problems)
- Can manage 20 calls at once
- Speaks English, Spanish, French, German, Hindi, Russian, Portuguese, Japanese, Italian, and Dutch
- Navigates complex phone menus (IVRs) and talks naturally with real reps
- Documents and shares next steps

**What to ask Chris:**
- "What do you do?"
- "How do you follow up on denied claims?"
- "Show me a sample insurance call."
- "Which languages do you speak?"
- "How many calls can you do at once?"

**Demo safety:**
- Doesn't give medical advice, PHI, or ops details
- If unsure, Chris replies: "That's a great question – but I'm just a demo version. For more specifics, reach out to Cosentus."

### `cara` – Eligibility & Benefits Verification

Cara specializes in calling insurance companies to verify patient coverage before services are rendered. She checks eligibility, benefits, deductibles, and in-network status.

**Key capabilities:**
- Insurance eligibility verification
- Benefits and coverage details
- Deductible and out-of-pocket tracking
- In-network vs out-of-network status
- Secondary insurance coordination
- Handles hundreds of verification calls per day

**What to ask Cara:**
- "What do you do?"
- "Can you show me how you verify insurance?"
- "Walk me through an eligibility check"
- "How do you handle secondary insurance?"

**Demo safety:**
- Doesn't access real patient data
- If unsure, Cara replies: "That's a great question – but I'm just a demo version. For more specifics, reach out to Cosentus."

### `carly` – Prior Authorization Follow-Up

Carly tracks down prior authorization approvals with insurance companies. She checks if authorizations are approved, denied, or pending, and can expedite urgent cases.

**Key capabilities:**
- Prior authorization status checks
- Approval tracking and documentation
- Expedited review requests for urgent cases
- Denial reason capture and appeals support
- Auth number and validity date tracking
- Handles dozens of auth calls per day

**What to ask Carly:**
- "What do you do?"
- "Can you check on a prior auth?"
- "Show me how you handle an urgent case"
- "How do you expedite authorizations?"

**Demo safety:**
- Doesn't access real auth data
- If unsure, Carly replies: "That's a great question – but I'm just a demo version. For more specifics, reach out to Cosentus."

### `carson` – Payment Reconciliation Specialist

Carson is your financial detective, tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, and incorrect amounts.

**Key capabilities:**
- Missing payment investigation
- Payment discrepancy resolution
- Check trace and reissue requests
- Duplicate EOB retrieval
- Overpayment refund processing
- EFT payment tracking
- Handles hundreds of reconciliation calls per day

**What to ask Carson:**
- "What do you do?"
- "Can you track down a missing payment?"
- "Show me how you resolve a discrepancy"
- "How do you handle overpayments?"

**Demo safety:**
- Doesn't access real financial data
- If unsure, Carson replies: "That's a great question – but I'm just a demo version. For more specifics, reach out to Cosentus."

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

