import { useState, useRef, useCallback } from 'react';

interface UseRealtimeVoiceProps {
  scenario?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
}

export function useRealtimeVoice({ scenario, onTranscript }: UseRealtimeVoiceProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // Get ephemeral token from our API with scenario
      const tokenResponse = await fetch('/api/voice/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenario }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get session token');
      }
      
      const { client_secret } = await tokenResponse.json();
      
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

      // Add local audio track (microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      
      // Send initial session configuration
      // Note: Prompt is already set in the session creation, 
      // but we can update transcription settings here
      if (dc.readyState === 'open') {
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            input_audio_transcription: { model: 'whisper-1' },
          },
        }));
      } else {
        dc.addEventListener('open', () => {
          dc.send(JSON.stringify({
            type: 'session.update',
            session: {
              input_audio_transcription: { model: 'whisper-1' },
            },
          }));
        });
      }
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    }
  }, [scenario, onTranscript]);

  const disconnect = useCallback(() => {
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
  }, []);

  return {
    isConnected,
    isRecording,
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

