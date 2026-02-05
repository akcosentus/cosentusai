/**
 * Client-Side Rate Limiting Hook
 * 
 * Provides friction layer to prevent abuse before hitting backend.
 * Uses localStorage to track call attempts (can be cleared but adds friction).
 * 
 * This is NOT security - backend rate limiting is the real protection.
 * This improves UX by showing warnings before backend blocks.
 */

import { useState, useEffect, useCallback } from 'react';

interface RateLimitState {
  allowed: boolean;
  waitTime?: number; // seconds
  remainingAttempts?: number;
  message?: string;
}

const CLIENT_RATE_LIMIT_KEY = 'cosentus_voice_calls';
const CLIENT_COOLDOWN_KEY = 'cosentus_voice_cooldown';
const CLIENT_LAST_CALL_KEY = 'cosentus_voice_last_call';

// Client-side limits - UNLIMITED for legitimate use, only catch obvious abuse
// This is just a friction layer, backend is the real protection
const CLIENT_COOLDOWN_MS = 2000; // 2 second cooldown after each call (minimal friction)
const CLIENT_RAPID_COOLDOWN_MS = 30 * 1000; // 30 second cooldown only for very rapid attempts (< 2 seconds)

export function useRateLimit() {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({ allowed: true });

  /**
   * Check client-side rate limits
   */
  const checkRateLimit = useCallback((): RateLimitState => {
    if (typeof window === 'undefined') {
      return { allowed: true };
    }

    const now = Date.now();

    // Check cooldown from last call
    const lastCallCooldown = localStorage.getItem(CLIENT_COOLDOWN_KEY);
    if (lastCallCooldown) {
      const cooldownEnd = parseInt(lastCallCooldown);
      if (now < cooldownEnd) {
        const waitTime = Math.ceil((cooldownEnd - now) / 1000);
        return {
          allowed: false,
          waitTime,
          message: `Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before starting another conversation.`,
        };
      }
    }

    // NO CALL COUNT LIMITS - Unlimited for legitimate use
    // Only check for very rapid attempts (< 2 seconds) which indicates automation

    // Check for very rapid attempts (calls < 2 seconds apart - only catch obvious automation)
    const lastCall = localStorage.getItem(CLIENT_LAST_CALL_KEY);
    if (lastCall) {
      const lastCallTime = parseInt(lastCall);
      const timeSinceLastCall = now - lastCallTime;
      
      if (timeSinceLastCall < 2000) {
        // Very rapid attempt (< 2 seconds) - likely automation, apply short cooldown
        const cooldownEnd = now + CLIENT_RAPID_COOLDOWN_MS;
        localStorage.setItem(CLIENT_COOLDOWN_KEY, cooldownEnd.toString());
        const waitTime = Math.ceil(CLIENT_RAPID_COOLDOWN_MS / 1000);
        return {
          allowed: false,
          waitTime,
          message: 'Please wait a moment before starting another conversation.',
        };
      }
    }

    // All checks passed - unlimited for legitimate use
    return {
      allowed: true,
    };
  }, []);

  /**
   * Record a call attempt
   */
  const recordCall = useCallback(() => {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    
    // Add to call history
    const stored = localStorage.getItem(CLIENT_RATE_LIMIT_KEY);
    const calls: number[] = stored ? JSON.parse(stored) : [];
    calls.push(now);
    
    // Keep only last 10 calls (cleanup)
    const recentCalls = calls.slice(-10);
    localStorage.setItem(CLIENT_RATE_LIMIT_KEY, JSON.stringify(recentCalls));
    
    // Set cooldown
    const cooldownEnd = now + CLIENT_COOLDOWN_MS;
    localStorage.setItem(CLIENT_COOLDOWN_KEY, cooldownEnd.toString());
    
    // Record last call time
    localStorage.setItem(CLIENT_LAST_CALL_KEY, now.toString());
    
    // Update state
    setRateLimitState(checkRateLimit());
  }, [checkRateLimit]);

  /**
   * Clear rate limit data (for testing or user request)
   */
  const clearRateLimit = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CLIENT_RATE_LIMIT_KEY);
    localStorage.removeItem(CLIENT_COOLDOWN_KEY);
    localStorage.removeItem(CLIENT_LAST_CALL_KEY);
    setRateLimitState({ allowed: true });
  }, []);

  // Check on mount and periodically
  useEffect(() => {
    setRateLimitState(checkRateLimit());
    
    // Recheck every 5 seconds to update wait times
    const interval = setInterval(() => {
      setRateLimitState(checkRateLimit());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [checkRateLimit]);

  return {
    rateLimitState,
    checkRateLimit,
    recordCall,
    clearRateLimit,
  };
}
