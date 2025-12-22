import { useState, useRef, useCallback } from 'react';

interface UseElevenLabsAgentOptions {
  agentId: string;
  onStatusChange?: (status: string) => void;
}

export const useElevenLabsAgent = ({ agentId, onStatusChange }: UseElevenLabsAgentOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const conversationRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);
      onStatusChange?.('Connecting...');

      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support voice calls. Please use Chrome, Firefox, Safari, or Edge.');
      }

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      mediaStreamRef.current = stream;

      // Get signed URL from our API
      const response = await fetch('/api/elevenlabs/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signedUrl } = await response.json();

      // Import ElevenLabs SDK dynamically (client-side only)
      const { Conversation } = await import('@elevenlabs/elevenlabs-js');

      // Create conversation
      const conversation = await Conversation.startSession({
        signedUrl,
        onConnect: () => {
          console.log('Connected to ElevenLabs');
          setIsConnected(true);
          setIsRecording(true);
          setIsConnecting(false);
          onStatusChange?.('Connected');
        },
        onDisconnect: () => {
          console.log('Disconnected from ElevenLabs');
          setIsConnected(false);
          setIsRecording(false);
          onStatusChange?.('Disconnected');
        },
        onError: (error: any) => {
          console.error('ElevenLabs error:', error);
          setError(error.message || 'Connection error');
          setIsConnected(false);
          setIsRecording(false);
          setIsConnecting(false);
        },
        onMessage: (message: any) => {
          console.log('Agent message:', message);
          // Handle agent messages if needed
        },
      });

      conversationRef.current = conversation;

      // Set up audio
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Connect microphone to conversation
      const source = audioContext.createMediaStreamSource(stream);
      await conversation.setInputAudio(source);

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
    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // End conversation
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
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

