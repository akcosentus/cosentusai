/**
 * Cosentus AI - Simple Integration Library
 * 
 * Lightweight library for integrating Cosentus AI agents with full design control.
 * No SDK complexity - just simple functions you can call from your own UI.
 * 
 * Usage:
 *   <script src="https://cosentusai.vercel.app/cosentus-simple.js"></script>
 *   <script>
 *     CosentusSimple.startVoiceCall('chloe', {
 *       onConnected: () => console.log('Connected!'),
 *       onDisconnected: () => console.log('Call ended')
 *     });
 *   </script>
 */

(function(window) {
  'use strict';

  // API Configuration
  const API_BASE = 'https://cosentusai.vercel.app';
  const RETELL_SDK_URL = 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/dist/web/index.js';

  // Agent IDs
  const AGENT_IDS = {
    chloe: 'agent_4c8f86fa8ce3f4f2f7b6c5b0e1',
    cindy: 'agent_b8f3c2d4e5f6a7b8c9d0e1f2a3',
    chris: 'agent_a1b2c3d4e5f6g7h8i9j0k1l2m3',
    cara: 'agent_d4e5f6a7b8c9d0e1f2a3b4c5d6',
    carly: 'agent_e5f6a7b8c9d0e1f2a3b4c5d6e7',
    carson: 'agent_f6a7b8c9d0e1f2a3b4c5d6e7f8',
    cassidy: 'agent_ff8707dccf16f96ecec4c448d3',
    courtney: 'agent_1b7fe9e057f84254f4fcca9256'
  };

  // State
  let retellClient = null;
  let retellLoaded = false;
  let currentChatId = null;

  // Load Retell SDK dynamically
  function loadRetellSDK() {
    return new Promise((resolve, reject) => {
      if (retellLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = RETELL_SDK_URL;
      script.onload = () => {
        retellLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Retell SDK'));
      document.head.appendChild(script);
    });
  }

  // Initialize Retell client
  async function initRetellClient(callbacks = {}) {
    if (!retellClient) {
      await loadRetellSDK();
      retellClient = new window.RetellWebClient();

      // Set up event listeners
      retellClient.on('call_started', () => {
        if (callbacks.onConnected) callbacks.onConnected();
      });

      retellClient.on('call_ended', () => {
        if (callbacks.onDisconnected) callbacks.onDisconnected();
      });

      retellClient.on('agent_start_talking', () => {
        if (callbacks.onAgentSpeaking) callbacks.onAgentSpeaking();
      });

      retellClient.on('agent_stop_talking', () => {
        if (callbacks.onAgentListening) callbacks.onAgentListening();
      });

      retellClient.on('error', (error) => {
        if (callbacks.onError) callbacks.onError(error);
      });
    }
  }

  /**
   * Start a voice call with an agent
   * 
   * @param {string} agentName - Agent name ('chloe', 'cindy', 'chris', 'cara', 'carly', 'carson', 'cassidy', 'courtney')
   * @param {object} callbacks - Event callbacks
   * @param {function} callbacks.onConnected - Called when call starts
   * @param {function} callbacks.onDisconnected - Called when call ends
   * @param {function} callbacks.onAgentSpeaking - Called when agent starts speaking
   * @param {function} callbacks.onAgentListening - Called when agent is listening
   * @param {function} callbacks.onError - Called on error
   * @returns {Promise<void>}
   * 
   * @example
   * CosentusSimple.startVoiceCall('chloe', {
   *   onConnected: () => console.log('Connected!'),
   *   onDisconnected: () => console.log('Call ended'),
   *   onAgentSpeaking: () => console.log('Agent is speaking'),
   *   onAgentListening: () => console.log('Agent is listening'),
   *   onError: (error) => console.error('Error:', error)
   * });
   */
  async function startVoiceCall(agentName, callbacks = {}) {
    try {
      const agentId = AGENT_IDS[agentName];
      if (!agentId) {
        throw new Error(`Unknown agent: ${agentName}. Available agents: ${Object.keys(AGENT_IDS).join(', ')}`);
      }

      // Initialize Retell client
      await initRetellClient(callbacks);

      // Get call token from API
      const response = await fetch(`${API_BASE}/api/retell/register-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });

      if (!response.ok) {
        throw new Error(`Failed to register call: ${response.statusText}`);
      }

      const data = await response.json();

      // Start the call
      await retellClient.startCall({
        accessToken: data.accessToken,
        sampleRate: data.sampleRate || 24000,
        emitRawAudioSamples: false
      });

    } catch (error) {
      console.error('Error starting voice call:', error);
      if (callbacks.onError) callbacks.onError(error);
      throw error;
    }
  }

  /**
   * End the current voice call
   * 
   * @example
   * CosentusSimple.endVoiceCall();
   */
  function endVoiceCall() {
    if (retellClient) {
      retellClient.stopCall();
    }
  }

  /**
   * Initialize a chat session
   * 
   * @returns {Promise<string>} Chat ID
   * 
   * @example
   * const chatId = await CosentusSimple.initChat();
   */
  async function initChat() {
    try {
      const response = await fetch(`${API_BASE}/api/assist-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize chat: ${response.statusText}`);
      }

      const data = await response.json();
      currentChatId = data.chatId;
      return data.chatId;

    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  }

  /**
   * Send a message to the chat assistant
   * 
   * @param {string} message - User message
   * @param {string} chatId - Optional chat ID (uses current session if not provided)
   * @returns {Promise<string>} AI response
   * 
   * @example
   * const response = await CosentusSimple.sendChatMessage('What is Cosentus?');
   * console.log(response);
   */
  async function sendChatMessage(message, chatId = null) {
    try {
      // Initialize chat if needed
      if (!chatId && !currentChatId) {
        await initChat();
      }

      const id = chatId || currentChatId;

      const response = await fetch(`${API_BASE}/api/chat/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: id, message })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * End the current chat session
   * 
   * @param {string} chatId - Optional chat ID (uses current session if not provided)
   * @returns {Promise<void>}
   * 
   * @example
   * await CosentusSimple.endChat();
   */
  async function endChat(chatId = null) {
    try {
      const id = chatId || currentChatId;
      if (!id) return;

      await fetch(`${API_BASE}/api/chat/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: id })
      });

      if (id === currentChatId) {
        currentChatId = null;
      }

    } catch (error) {
      console.error('Error ending chat:', error);
      throw error;
    }
  }

  /**
   * Get list of available agents
   * 
   * @returns {object} Agent information
   * 
   * @example
   * const agents = CosentusSimple.getAgents();
   * console.log(agents.chloe.name); // "Chloe"
   */
  function getAgents() {
    return {
      chloe: {
        id: AGENT_IDS.chloe,
        name: 'Chloe',
        description: 'Cosentus company information expert'
      },
      cindy: {
        id: AGENT_IDS.cindy,
        name: 'Cindy',
        description: 'Patient billing support specialist'
      },
      chris: {
        id: AGENT_IDS.chris,
        name: 'Chris',
        description: 'Insurance claim follow-up specialist'
      },
      cara: {
        id: AGENT_IDS.cara,
        name: 'Cara',
        description: 'Eligibility & benefits verification'
      },
      carly: {
        id: AGENT_IDS.carly,
        name: 'Carly',
        description: 'Prior authorization follow-up'
      },
      carson: {
        id: AGENT_IDS.carson,
        name: 'Carson',
        description: 'Payment reconciliation specialist'
      },
      cassidy: {
        id: AGENT_IDS.cassidy,
        name: 'Cassidy',
        description: 'Pre-service anesthesia cost estimates'
      },
      courtney: {
        id: AGENT_IDS.courtney,
        name: 'Courtney',
        description: 'Medical appointment scheduling'
      }
    };
  }

  // Export public API
  window.CosentusSimple = {
    // Voice functions
    startVoiceCall,
    endVoiceCall,
    
    // Chat functions
    initChat,
    sendChatMessage,
    endChat,
    
    // Utility functions
    getAgents,
    
    // Version
    version: '1.0.0'
  };

})(window);
