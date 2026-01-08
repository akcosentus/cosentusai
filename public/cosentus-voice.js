/**
 * Cosentus Voice Agent Library
 * 
 * A headless, framework-agnostic library for integrating Retell AI voice and chat agents.
 * Works with React, Vue, Angular, WordPress, plain HTML, or any web platform.
 * 
 * @version 1.1.0
 * @author Cosentus AI
 */

(function(global) {
  'use strict';

  // Agent configuration (name → ID mapping)
  const AGENTS = {
    chloe: 'agent_9d9f880dbde25925f75e5b2739',
    cindy: 'agent_4510e7416ee31ca808b8546ed7',
    chris: 'agent_9571fe9261e3944f33777a1406',
    cara: 'agent_f7e96fe43ce9bb611481839af8',
    carly: 'agent_a8f606995d3160a92be6874661',
    carson: 'agent_443ead51c8a35f874d0ca1a8c1'
  };

  // Default API endpoints
  let apiEndpoint = '/api/retell/register-call';
  let chatInitEndpoint = '/api/assist-chat';
  let chatSendEndpoint = '/api/chat/send-message';

  /**
   * ChatAssistant Class
   * Headless chat assistant - handles API communication only, no UI
   * Third-party developers build their own UI and use this for backend logic
   */
  class ChatAssistant {
    constructor() {
      this.chatId = null;
      this.isLoading = false;
      this.eventListeners = {};
    }

    /**
     * Initialize a new chat session
     * @returns {Promise<string>} Chat ID
     */
    async initialize() {
      if (this.chatId) {
        return this.chatId;
      }

      try {
        const response = await fetch(chatInitEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [] })
        });

        if (!response.ok) {
          throw new Error('Failed to initialize chat session');
        }

        const data = await response.json();
        this.chatId = data.chatId;
        this._emit('initialized', { chatId: this.chatId });
        
        return this.chatId;
      } catch (error) {
        this._emit('error', { error: error.message });
        throw error;
      }
    }

    /**
     * Send a message and get response
     * @param {string} message - User message
     * @returns {Promise<Object>} Response object with content, role, messageId
     */
    async sendMessage(message) {
      if (!message || !message.trim()) {
        throw new Error('Message cannot be empty');
      }

      // Initialize session if needed
      if (!this.chatId) {
        await this.initialize();
      }

      this.isLoading = true;
      this._emit('loading', { isLoading: true });

      try {
        const response = await fetch(chatSendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chatId: this.chatId, 
            message: message.trim() 
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        this._emit('message', { 
          content: data.content,
          role: data.role,
          messageId: data.messageId
        });

        return data;
      } catch (error) {
        this._emit('error', { error: error.message });
        throw error;
      } finally {
        this.isLoading = false;
        this._emit('loading', { isLoading: false });
      }
    }

    /**
     * Reset the chat session
     */
    reset() {
      this.chatId = null;
      this.isLoading = false;
      this._emit('reset');
    }

    /**
     * Get current chat ID
     * @returns {string|null} Current chat ID or null
     */
    getChatId() {
      return this.chatId;
    }

    /**
     * Check if currently loading
     * @returns {boolean} Loading state
     */
    getLoadingState() {
      return this.isLoading;
    }

    /**
     * Add event listener
     * Events: 'initialized', 'message', 'loading', 'error', 'reset'
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
      if (!this.eventListeners[event]) {
        this.eventListeners[event] = [];
      }
      this.eventListeners[event].push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
      if (!this.eventListeners[event]) return;
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }

    /**
     * Emit event
     * @private
     */
    _emit(event, data) {
      if (!this.eventListeners[event]) return;
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * VoiceAgent Class
   * Handles connection to a single Retell AI agent
   */
  class VoiceAgent {
    constructor(agentId, agentName) {
      this.agentId = agentId;
      this.agentName = agentName;
      this.client = null;
      this.eventListeners = {};
      
      // State
      this.isConnected = false;
      this.isRecording = false;
      this.isConnecting = false;
      this.error = null;
      
      // Initialize Retell client
      this._initializeClient();
    }

    /**
     * Initialize Retell Web Client and set up event listeners
     * @private
     */
    _initializeClient() {
      // Check if RetellWebClient is available
      if (typeof RetellWebClient === 'undefined') {
        console.error('RetellWebClient not found. Make sure to include retell-client-js-sdk before cosentus-voice.js');
        return;
      }

      this.client = new RetellWebClient();

      // Event: Call started successfully
      this.client.on('call_started', () => {
        this.isConnected = true;
        this.isConnecting = false;
        this.isRecording = false;
        this.error = null;
        this._trigger('connected');
        this._trigger('statusChange', 'Connected');
      });

      // Event: Call ended
      this.client.on('call_ended', () => {
        this.isConnected = false;
        this.isRecording = false;
        this.isConnecting = false;
        this._trigger('disconnected');
        this._trigger('statusChange', 'Disconnected');
      });

      // Event: Agent starts speaking
      this.client.on('agent_start_talking', () => {
        this.isRecording = true;
        this._trigger('speaking');
        this._trigger('statusChange', `${this.agentName} is speaking...`);
      });

      // Event: Agent stops speaking
      this.client.on('agent_stop_talking', () => {
        this.isRecording = false;
        this._trigger('listening');
        this._trigger('statusChange', 'Listening...');
      });

      // Event: Error occurred
      this.client.on('error', (error) => {
        console.error('Retell error:', error);
        const errorMessage = error?.message || error?.toString() || 'Connection error';
        this.error = errorMessage;
        this.isConnected = false;
        this.isRecording = false;
        this.isConnecting = false;
        this._trigger('error', errorMessage);
        this._trigger('statusChange', 'Error');
      });

      // Event: Real-time updates (transcripts, etc.)
      this.client.on('update', (update) => {
        this._trigger('update', update);
      });
    }

    /**
     * Connect to the Retell agent and start voice call
     * @returns {Promise<void>}
     */
    async connect() {
      try {
        this.error = null;
        this.isConnecting = true;
        this._trigger('connecting');
        this._trigger('statusChange', 'Connecting...');

        if (!this.client) {
          throw new Error('Retell client not initialized');
        }

        // Step 1: Get access token from backend
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: this.agentId })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to register call' }));
          throw new Error(errorData.error || 'Failed to register call');
        }

        const { accessToken } = await response.json();

        // Step 2: Start the call (must be within 30 seconds of token creation)
        await this.client.startCall({
          accessToken,
          sampleRate: 24000, // Recommended: 24000 or 16000
        });

      } catch (err) {
        console.error('Connection error:', err);
        const errorMessage = err.message || 'Failed to connect';
        this.error = errorMessage;
        this.isConnected = false;
        this.isRecording = false;
        this.isConnecting = false;
        this._trigger('error', errorMessage);
        this._trigger('statusChange', 'Error');
        throw err;
      }
    }

    /**
     * Disconnect from the Retell agent and end voice call
     */
    disconnect() {
      if (this.client) {
        this.client.stopCall();
      }
      this.isConnected = false;
      this.isRecording = false;
      this.isConnecting = false;
      this._trigger('disconnected');
      this._trigger('statusChange', 'Disconnected');
    }

    /**
     * Register an event listener
     * @param {string} event - Event name (connected, disconnected, speaking, listening, error, connecting, statusChange, update)
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
      if (!this.eventListeners[event]) {
        this.eventListeners[event] = [];
      }
      this.eventListeners[event].push(callback);
    }

    /**
     * Remove an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
      if (!this.eventListeners[event]) return;
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }

    /**
     * Trigger an event
     * @private
     */
    _trigger(event, data) {
      if (this.eventListeners[event]) {
        this.eventListeners[event].forEach(callback => {
          try {
            callback(data);
          } catch (err) {
            console.error(`Error in ${event} event handler:`, err);
          }
        });
      }
    }

    /**
     * Get current state
     * @returns {Object} Current state object
     */
    getState() {
      return {
        isConnected: this.isConnected,
        isRecording: this.isRecording,
        isConnecting: this.isConnecting,
        error: this.error,
        agentId: this.agentId,
        agentName: this.agentName
      };
    }
  }

  /**
   * CosentusVoice - Main API
   */
  const CosentusVoice = {
    /**
     * Available agents (name → ID mapping)
     */
    agents: AGENTS,

    /**
     * Create a chat assistant instance (headless - no UI)
     * Third-party developers build their own UI and use this for API communication
     * @returns {ChatAssistant} Chat assistant instance
     */
    createChatAssistant: function() {
      return new ChatAssistant();
    },

    /**
     * Create a new voice agent instance
     * @param {string} agentName - Agent name (e.g., 'chloe', 'cindy')
     * @returns {VoiceAgent} Voice agent instance
     */
    createAgent: function(agentName) {
      // Look up agent ID from name
      const agentId = AGENTS[agentName];
      
      if (!agentId) {
        const availableAgents = Object.keys(AGENTS).join(', ');
        throw new Error(
          `Unknown agent: "${agentName}". Available agents: ${availableAgents}`
        );
      }

      return new VoiceAgent(agentId, agentName);
    },

    /**
     * Configure the library
     * @param {Object} options - Configuration options
     * @param {string} options.apiEndpoint - Custom API endpoint for voice token generation
     * @param {string} options.chatInitEndpoint - Custom API endpoint for chat initialization
     * @param {string} options.chatSendEndpoint - Custom API endpoint for sending chat messages
     */
    configure: function(options) {
      if (options.apiEndpoint) {
        apiEndpoint = options.apiEndpoint;
      }
      if (options.chatInitEndpoint) {
        chatInitEndpoint = options.chatInitEndpoint;
      }
      if (options.chatSendEndpoint) {
        chatSendEndpoint = options.chatSendEndpoint;
      }
    },

    /**
     * Get library version
     * @returns {string} Version number
     */
    version: '1.1.0'
  };

  // Export for different module systems
  
  // Browser global
  if (typeof window !== 'undefined') {
    window.CosentusVoice = CosentusVoice;
  }

  // CommonJS (Node.js)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosentusVoice;
  }

  // AMD (RequireJS)
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return CosentusVoice;
    });
  }

  // ES6 Module (if supported)
  if (typeof global !== 'undefined') {
    global.CosentusVoice = CosentusVoice;
  }

})(typeof window !== 'undefined' ? window : this);

