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
  const callActiveRef = useRef(false);

  // Initialize Retell client once
  useEffect(() => {
    // Only initialize if not already initialized
    if (retellClientRef.current) {
      console.log('⚠️ Retell client already initialized');
      return;
    }
    
    console.log('🔧 Initializing Retell Web Client...');
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Set up event listeners BEFORE starting call (as per Retell docs)
    client.on('call_started', () => {
      console.log('✅ Retell: Call started');
      callActiveRef.current = true;
      setIsConnected(true);
      setIsRecording(false); // Not recording until agent/user speaks
      setIsConnecting(false);
      setError(null);
      onStatusChange?.('Connected - Waiting for agent...');
    });

    client.on('call_ended', async () => {
      console.log('❌ Retell: Call ended');
      callActiveRef.current = false;
      
      // Try to get call details to understand why it ended
      const lastCallId = sessionStorage.getItem('lastRetellCallId');
      if (lastCallId) {
        try {
          const response = await fetch(`/api/retell/get-call?callId=${lastCallId}`);
          if (response.ok) {
            const callData = await response.json();
            console.log('📊 Call details:', {
              status: callData.call_status,
              disconnection_reason: callData.disconnection_reason,
              duration_ms: callData.duration_ms,
            });
          }
        } catch (e) {
          console.error('Could not fetch call details:', e);
        }
      }
      
      setIsConnected(false);
      setIsRecording(false);
      onStatusChange?.('Call ended');
    });

    client.on('agent_start_talking', () => {
      console.log('🗣️ Retell: Agent started talking');
      setIsRecording(true);
      onStatusChange?.('Agent speaking...');
    });

    client.on('agent_stop_talking', () => {
      console.log('🤐 Retell: Agent stopped talking');
      setIsRecording(false);
      onStatusChange?.('Listening...');
    });

    client.on('error', (error) => {
      console.error('❌ Retell error:', error);
      const errorMessage = error?.message || error?.toString() || 'Connection error';
      setError(errorMessage);
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error: ' + errorMessage);
      
      // Stop call on error as per Retell docs
      try {
        client.stopCall();
      } catch (e) {
        console.error('Error stopping call after error:', e);
      }
    });

    client.on('update', (update) => {
      // Handle real-time updates (transcript, etc.)
      console.log('📝 Retell update:', update);
      
      // Keep call alive by acknowledging updates
      if (callActiveRef.current && update) {
        console.log('📡 Received update, call is active');
      }
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
      
      // Store call ID for later debugging
      sessionStorage.setItem('lastRetellCallId', callId);

      console.log('🔄 Starting Retell call...');
      console.log('Access token (first 20 chars):', accessToken.substring(0, 20) + '...');
      console.log('⏰ Note: Access token expires in 30 seconds from creation');

      // Start the call with Retell (must be within 30 seconds of token creation)
      // SDK will automatically request microphone access and handle audio
      // Note: Removed playbackDeviceId as it's not supported in all browsers
      await retellClientRef.current.startCall({
        accessToken,
        sampleRate: 24000, // 24000 or 16000
      });

      console.log('✅ Retell startCall completed');
      console.log('🎤 Call is now active - waiting for agent to speak...');
      console.log('💡 Agent should speak first (configured to start conversation)');
      
      // Monitor call status
      setTimeout(() => {
        if (!callActiveRef.current) {
          console.error('❌ Call ended within 2 seconds - this suggests:');
          console.error('   1. Network/firewall blocking WebRTC');
          console.error('   2. Agent configuration changed');
          console.error('   3. Retell service issue');
          console.error('   Try: Check Retell dashboard for call logs');
        } else {
          console.log('✅ Call still active after 2 seconds');
        }
      }, 2000);

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

