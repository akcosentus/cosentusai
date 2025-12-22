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
      console.log('Call started');
      setIsConnected(true);
      setIsRecording(true);
      setIsConnecting(false);
      onStatusChange?.('Connected');
    });

    client.on('call_ended', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsRecording(false);
      onStatusChange?.('Disconnected');
    });

    client.on('agent_start_talking', () => {
      console.log('Agent started talking');
      setIsRecording(true);
    });

    client.on('agent_stop_talking', () => {
      console.log('Agent stopped talking');
    });

    client.on('error', (error) => {
      console.error('Retell error:', error);
      setError(error.message || 'Connection error');
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error');
    });

    client.on('update', (update) => {
      // Handle real-time updates (transcript, etc.)
      console.log('Update:', update);
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
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

      // Get access token from your API
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to register call');
      }

      const { accessToken } = await response.json();

      // Start the call
      await retellClientRef.current.startCall({
        accessToken,
        sampleRate: 24000, // or 16000
        enableUpdate: true, // Enable real-time transcripts
      });

    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect');
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error');
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

