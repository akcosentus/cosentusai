/**
 * Retell AI Voice Agent Hook
 * 
 * A React hook for integrating Retell AI voice agents into web applications.
 * Handles WebRTC connections, audio streaming, and real-time voice interactions.
 * 
 * Mobile audio optimizations:
 * - Pre-warms AudioContext on connect gesture to avoid cold-start latency
 * - Uses 16000 Hz sample rate on mobile (native WebRTC rate, avoids resampling)
 * - Explicitly calls startAudioPlayback() to unblock mobile audio
 * - Passes lowPowerMode to Orb component to throttle WebGL during calls
 * 
 * @see https://docs.retellai.com/
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

interface UseRetellAgentOptions {
  /** Retell Agent ID from dashboard */
  agentId: string;
  /** Optional callback for status updates */
  onStatusChange?: (status: string) => void;
}

// Pre-warm the AudioContext on first user interaction
// This ensures the audio pipeline is ready before the call connects
let audioContextWarmed = false;
function warmAudioContext() {
  if (audioContextWarmed) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      // Create a silent buffer and play it to "unlock" audio on mobile
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      // Resume if suspended (iOS requires this)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      audioContextWarmed = true;
    }
  } catch (e) {
    // Silently fail — this is just a warmup optimization
  }
}

export const useRetellAgent = ({ agentId, onStatusChange }: UseRetellAgentOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const callActiveRef = useRef(false);

  // Initialize Retell Web Client once on mount
  useEffect(() => {
    if (retellClientRef.current) return; // Already initialized
    
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Event: Call started successfully
    client.on('call_started', () => {
      callActiveRef.current = true;
      setIsConnected(true);
      setIsRecording(false);
      setIsConnecting(false);
      setError(null);
      onStatusChange?.('Connected');
      
      // Critical for mobile: ensure audio playback is unblocked
      // Mobile browsers (especially iOS Safari) require explicit audio activation
      // Use async/await to properly handle the promise
      (async () => {
        try {
          await client.startAudioPlayback();
        } catch (e) {
          console.warn('startAudioPlayback not needed or failed:', e);
        }
      })();
    });

    // Event: Call ended
    client.on('call_ended', () => {
      callActiveRef.current = false;
      setIsConnected(false);
      setIsRecording(false);
      onStatusChange?.('Call ended');
    });

    // Event: Agent starts speaking
    client.on('agent_start_talking', () => {
      setIsRecording(true);
      onStatusChange?.('Agent speaking');
    });

    // Event: Agent stops speaking
    client.on('agent_stop_talking', () => {
      setIsRecording(false);
      onStatusChange?.('Listening');
    });

    // Event: Error occurred
    client.on('error', (error) => {
      console.error('Retell error:', error);
      const errorMessage = error?.message || error?.toString() || 'Connection error';
      setError(errorMessage);
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error');
      
      // Stop call on error
      try {
        client.stopCall();
      } catch (e) {
        console.error('Error stopping call:', e);
      }
    });

    // Event: Real-time updates (transcripts, etc.)
    client.on('update', (update) => {
      // Handle transcript updates here if needed
      // update.transcript contains the conversation
    });

    // Cleanup on unmount
    return () => {
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall();
        } catch (e) {
          console.error('Error during cleanup:', e);
        }
      }
    };
  }, [onStatusChange]);

  /**
   * Connect to Retell agent and start voice call
   */
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

      // Step 1: Pre-warm AudioContext immediately on user gesture
      // This must happen in the same call stack as the user click
      // to satisfy mobile browser autoplay policies
      warmAudioContext();

      // Step 2: Get access token from backend
      const response = await fetch('/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register call');
      }

      const { accessToken } = await response.json();

      // Step 3: Detect mobile for optimized audio settings
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Step 4: Start the call (must be within 30 seconds of token creation)
      // Use 16000 on mobile for better compatibility (avoids resampling artifacts)
      // Use 24000 on desktop for higher quality
      await retellClientRef.current.startCall({
        accessToken,
        sampleRate: isMobile ? 16000 : 24000,
        emitRawAudioSamples: false, // Reduce processing overhead
      });

    } catch (err: any) {
      console.error('Connection error:', err);
      const errorMessage = err.message || 'Failed to connect';
      setError(errorMessage);
      setIsConnected(false);
      setIsRecording(false);
      setIsConnecting(false);
      onStatusChange?.('Error');
    }
  }, [agentId, onStatusChange]);

  /**
   * Disconnect from Retell agent and end voice call
   */
  const disconnect = useCallback(() => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
    callActiveRef.current = false;
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
