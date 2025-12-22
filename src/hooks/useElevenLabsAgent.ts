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
  
  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

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

      // Create WebSocket connection
      const ws = new WebSocket(signedUrl);
      websocketRef.current = ws;

      // Set up audio context for playback
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // Create audio element for playback
      const audioElement = new Audio();
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;

      ws.onopen = () => {
        console.log('Connected to ElevenLabs');
        setIsConnected(true);
        setIsRecording(true);
        setIsConnecting(false);
        onStatusChange?.('Connected');

        // Start sending audio from microphone
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            // Convert Float32Array to Int16Array (PCM16)
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            ws.send(pcm16.buffer);
          }
        };
      };

      ws.onmessage = async (event) => {
        // Handle incoming audio from agent
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          const audioData = new Uint8Array(arrayBuffer);
          
          // Play audio
          const blob = new Blob([audioData], { type: 'audio/pcm' });
          const url = URL.createObjectURL(blob);
          if (audioElementRef.current) {
            audioElementRef.current.src = url;
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setIsConnected(false);
        setIsRecording(false);
        setIsConnecting(false);
        onStatusChange?.('Error');
      };

      ws.onclose = () => {
        console.log('Disconnected from ElevenLabs');
        setIsConnected(false);
        setIsRecording(false);
        onStatusChange?.('Disconnected');
      };

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

    // Close WebSocket
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Stop audio element
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current = null;
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

