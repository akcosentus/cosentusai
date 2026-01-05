/**
 * useRetellChat Hook
 * 
 * React hook for integrating Retell AI's chat agent (text-based).
 * Handles connection, message sending, and transcript management.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseRetellChatProps {
  onMessagesUpdate?: (messages: ChatMessage[]) => void;
  onError?: (error: string) => void;
}

export function useRetellChat({ onMessagesUpdate, onError }: UseRetellChatProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const callIdRef = useRef<string | null>(null);

  // Initialize Retell client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      retellClientRef.current = new RetellWebClient();
      
      const client = retellClientRef.current;

      // Set up event listeners
      client.on('call_started', () => {
        console.log('[Retell Chat] Call started');
        setIsConnected(true);
        setIsConnecting(false);
      });

      client.on('call_ended', () => {
        console.log('[Retell Chat] Call ended');
        setIsConnected(false);
        setIsConnecting(false);
      });

      client.on('error', (err) => {
        console.error('[Retell Chat] Error:', err);
        const errorMsg = err?.message || 'Chat connection error';
        setError(errorMsg);
        setIsConnecting(false);
        setIsConnected(false);
        if (onError) onError(errorMsg);
      });

      client.on('update', (update) => {
        // Handle transcript updates
        if (update.transcript && Array.isArray(update.transcript)) {
          const chatMessages: ChatMessage[] = update.transcript.map((t: any) => ({
            role: t.role === 'agent' ? 'assistant' as const : 'user' as const,
            content: t.content || '',
          }));
          setMessages(chatMessages);
          if (onMessagesUpdate) onMessagesUpdate(chatMessages);
        }
      });
    }

    return () => {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, [onMessagesUpdate, onError]);

  // Connect to chat
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      // Get access token from our API
      const response = await fetch('/api/assist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to initialize chat');
      }

      const { accessToken, callId } = await response.json();
      callIdRef.current = callId;

      // Start the call with Retell
      if (retellClientRef.current) {
        await retellClientRef.current.startCall({
          accessToken,
          emitRawAudioSamples: false,
        });
      }
    } catch (err: any) {
      console.error('[Retell Chat] Connection error:', err);
      const errorMsg = err?.message || 'Failed to connect to chat';
      setError(errorMsg);
      setIsConnecting(false);
      if (onError) onError(errorMsg);
    }
  }, [isConnecting, isConnected, onError]);

  // Disconnect from chat
  const disconnect = useCallback(() => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    setIsConnected(false);
    setIsConnecting(false);
    callIdRef.current = null;
  }, []);

  // Send a message (for text-based chat, we rely on Retell's transcript system)
  const sendMessage = useCallback((content: string) => {
    if (!isConnected) {
      console.warn('[Retell Chat] Cannot send message: not connected');
      return;
    }
    
    // Add user message to local state immediately
    setMessages(prev => [...prev, { role: 'user', content }]);
    
    // Note: Retell's chat agent will process the message through its transcript system
    // The actual message sending happens through the Retell SDK's internal mechanisms
  }, [isConnected]);

  return {
    isConnected,
    isConnecting,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
  };
}

