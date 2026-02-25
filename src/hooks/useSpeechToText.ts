'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check browser support and initialize recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported in this browser');
      setIsSupported(false);
      return;
    }

    console.log('Speech recognition supported, initializing...');
    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false; // Stop after user pauses
    recognition.interimResults = true; // Get real-time results as user speaks
    recognition.lang = 'en-US'; // Default to English, can be made configurable later

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript(''); // Clear previous transcript when starting new session
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update with final + interim results
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors gracefully
      switch (event.error) {
        case 'not-allowed':
          const isInIframe = window.self !== window.top;
          if (isInIframe) {
            setError('Microphone access denied. The website needs to add allow="microphone" to the iframe tag, and you need to grant microphone permission in your browser settings.');
          } else {
            setError('Microphone permission denied. Click the lock icon in your browser\'s address bar and allow microphone access, then try again.');
          }
          break;
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        case 'aborted':
          // User stopped manually, not an error
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping already-stopped recognition
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    console.log('startListening called, recognitionRef.current:', !!recognitionRef.current, 'isListening:', isListening);
    if (!recognitionRef.current) {
      console.error('Recognition not initialized');
      setError('Speech recognition not available. Please refresh the page.');
      return;
    }
    if (isListening) {
      console.log('Already listening, ignoring start request');
      return;
    }
    
    try {
      setError(null);
      
      // First, explicitly request microphone permission using getUserMedia
      // This triggers the browser's permission prompt (same as voice agents do)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the test stream immediately (we just needed to check/get permission)
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone permission granted');
      } else {
        console.warn('getUserMedia not available, proceeding with recognition.start()');
      }
      
      // Now start speech recognition (permission should be granted)
      console.log('Starting speech recognition...');
      recognitionRef.current.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      
      // Handle permission denial
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        const isInIframe = window.self !== window.top;
        if (isInIframe) {
          setError('Microphone access denied. The website needs to add allow="microphone" to the iframe tag, and you need to grant microphone permission in your browser settings.');
        } else {
          setError('Microphone permission denied. Click the lock icon in your browser\'s address bar and allow microphone access, then try again.');
        }
      } else {
        setError('Failed to start microphone. Please try again.');
      }
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  }, [isListening]);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error
  };
}
