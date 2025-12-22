import { useState, useRef, useCallback } from 'react';

interface UseRealtimeVoiceProps {
  onTranscript?: (text: string, isUser: boolean) => void;
}

export function useRealtimeVoice({ onTranscript }: UseRealtimeVoiceProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async (scenario: string) => {
    try {
      setError(null);
      setIsConnecting(true);

      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support voice calls. Please use Chrome, Firefox, Safari, or Edge.');
      }

      if (!window.RTCPeerConnection) {
        throw new Error('Your browser does not support WebRTC. Please update your browser.');
      }
      
      // Get ephemeral token from our API with scenario - with retry logic
      let client_secret: string | undefined;
      let lastError: Error | null = null;
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const tokenResponse = await fetch('/api/voice/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario }),
          });
          
          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(errorData.error || 'Failed to get session token');
          }
          
          const data = await tokenResponse.json();
          client_secret = data.client_secret;
          break; // Success, exit retry loop
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');
          console.warn(`Token fetch attempt ${attempt}/${maxRetries} failed:`, lastError.message);
          
          if (attempt < maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          }
        }
      }
      
      if (!client_secret) {
        throw new Error(lastError?.message || 'Failed to get session token after multiple attempts');
      }
      
      // Create peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up audio element for playback
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;
      
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // Add local audio track (microphone) with noise suppression
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        mediaStreamRef.current = stream; // Store stream reference for cleanup
      } catch (micError) {
        if (micError instanceof Error && micError.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone access and try again.');
        } else if (micError instanceof Error && micError.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else {
          throw new Error('Could not access microphone. Please check your browser settings.');
        }
      }
      pc.addTrack(stream.getTracks()[0]);

      // Set up data channel for messages
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;
      
      dc.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        
        // Handle different event types
        if (data.type === 'response.audio_transcript.done') {
          onTranscript?.(data.transcript, false);
        } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
          onTranscript?.(data.transcript, true);
        }
      });

      // Create and set local offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to OpenAI and get answer
      const sdpResponse = await fetch('https://api.openai.com/v1/realtime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${client_secret}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI');
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      setIsConnected(true);
      setIsRecording(true);
      setIsConnecting(false);
      
      // Note: Session configuration (instructions, VAD, transcription) is now set 
      // in the API route when creating the ephemeral token for better control
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [onTranscript]);

  const disconnect = useCallback(() => {
    // Stop all media stream tracks (microphone)
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }
    setIsConnected(false);
    setIsRecording(false);
    setIsConnecting(false);
  }, []);

  return {
    isConnected,
    isRecording,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}

function getInstructionsForScenario(scenario?: string): string {
  const instructions = {
    'patient-intake': 'You are a helpful medical assistant conducting a patient intake. Ask about their symptoms, medical history, and reason for visit. Be empathetic and professional.',
    'appointment-booking': 'You are an appointment scheduling assistant. Help the patient book an appointment by asking for their preferred date, time, and reason for visit.',
    'symptoms': 'You are a symptom checker assistant. Ask about the patient\'s symptoms, when they started, and their severity. Provide general guidance but remind them to consult a healthcare professional.',
  };
  
  return instructions[scenario as keyof typeof instructions] || 'You are a helpful healthcare assistant.';
}

