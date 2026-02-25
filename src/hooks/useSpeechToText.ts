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
      setIsSupported(false);
      return;
    }

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
      // Handle specific errors gracefully
      switch (event.error) {
        case 'not-allowed':
          // User-friendly message - don't expose technical details
          setError('Voice input is unavailable at the moment. Please type your message instead.');
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
          setError('Voice input is unavailable at the moment. Please type your message instead.');
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
    if (!recognitionRef.current) {
      setError('Voice input is unavailable at the moment. Please type your message instead.');
      return;
    }
    if (isListening) {
      return;
    }
    
    try {
      setError(null);
      
      // First, explicitly request microphone permission using getUserMedia
      // This triggers the browser's permission prompt (same as voice agents do)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the test stream immediately (we just needed to check/get permission)
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Now start speech recognition (permission should be granted)
      recognitionRef.current.start();
    } catch (err: any) {
      // Handle permission denial or other errors with user-friendly message
      setError('Voice input is unavailable at the moment. Please type your message instead.');
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
