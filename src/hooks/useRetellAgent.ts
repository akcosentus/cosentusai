import { useState, useRef, useCallback, useEffect } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

interface UseRetellAgentOptions {
  agentId: string;
  onStatusChange?: (status: string) => void;
}

export const useRetellAgent = ({ agentId, onStatusChange }: UseRetellAgentOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const retellClientRef = useRef<RetellWebClient | null>(null);

  // Initialize Retell client once
  useEffect(() => {
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Set up event listeners
    client.on('call_started', () => {
      console.log('✅ Retell: Call started');
      setIsConnected(true);
      setIsRecording(true);
      setIsConnecting(false);
      setError(null);
      onStatusChange?.('Connected');
    });

    client.on('call_ended', (endData) => {
      console.log('❌ Retell: Call ended', endData);
      console.log('Call end reason:', endData);
      setIsConnected(false);
      setIsRecording(false);
      onStatusChange?.('Disconnected');
    });

    client.on('agent_start_talking', () => {
      console.log('🗣️ Retell: Agent started talking');
      setIsRecording(true);
    });

    client.on('agent_stop_talking', () => {
      console.log('🤐 Retell: Agent stopped talking');
    });

    client.on('error', (error) => {
      console.error('❌ Retell error:', error);
      const errorMessage = error?.message || error?.toString() || 'Connection error';
      setError(errorMessage);
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error: ' + errorMessage);
    });

    client.on('update', (update) => {
      // Handle real-time updates (transcript, etc.)
      console.log('📝 Retell update:', update);
    });

    client.on('metadata', (metadata) => {
      console.log('📊 Retell metadata:', metadata);
    });

    client.on('audio', (audio) => {
      console.log('🔊 Retell audio event:', audio);
    });

    client.on('conversationStarted', () => {
      console.log('💬 Retell: Conversation started');
    });

    client.on('conversationEnded', (data) => {
      console.log('💬 Retell: Conversation ended', data);
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall();
        } catch (e) {
          console.error('Error stopping call on cleanup:', e);
        }
      }
    };
  }, [onStatusChange]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);
      onStatusChange?.('Connecting...');

      if (!retellClientRef.current) {
        throw new Error('Retell client not initialized');
      }

      if (!agentId) {
        throw new Error('Agent ID is not configured');
      }

      console.log('🔄 Registering call with Retell...');
      console.log('Agent ID:', agentId);

      // Get access token from your API
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || 'Failed to register call');
      }

      const { accessToken, callId } = await response.json();
      console.log('✅ Got access token, call ID:', callId);

      console.log('🔄 Starting Retell call...');
      console.log('Access token (first 20 chars):', accessToken.substring(0, 20) + '...');

      // Start the call with Retell
      // Note: Retell SDK will automatically request microphone access
      await retellClientRef.current.startCall({
        accessToken,
        sampleRate: 24000,
        captureDeviceId: undefined, // Let browser choose default mic
      });

      console.log('✅ Retell startCall completed');
      console.log('Waiting for agent to speak...');

    } catch (err: any) {
      console.error('❌ Connection error:', err);
      const errorMessage = err.message || 'Failed to connect';
      setError(errorMessage);
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error: ' + errorMessage);
    }
  }, [agentId, onStatusChange]);

  const disconnect = useCallback(() => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    setIsConnected(false);
    setIsRecording(false);
    setIsConnecting(false);
    onStatusChange?.('Disconnected');
  }, [onStatusChange]);

  return {
    isConnected,
    isRecording,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};

