/**
 * Retell AI - Create Web Call API Route
 * 
 * This endpoint securely creates a web call with Retell AI and returns
 * an access token for the frontend to establish a WebRTC connection.
 * 
 * Security: API key is kept server-side and never exposed to the client.
 * 
 * @see https://docs.retellai.com/api-references/create-web-call
 */

import { NextResponse } from 'next/server';

/**
 * Smart Rate Limiting for Voice Agent Calls
 * 
 * Prevents abuse while allowing legitimate use cases:
 * - User exploring different agents (8 available)
 * - Reconnection after connection issues
 * - Multiple users from same network
 * 
 * Detection:
 * - Rapid start/stop cycles (< 30 seconds)
 * - Too many calls in short time window
 * - Progressive penalties for abuse
 */

interface RateLimitEntry {
  timestamps: number[]; // Call start timestamps
  rapidCycles: number[]; // Timestamps of rapid cycles (calls < 30s apart)
  lastCallTime: number | null;
  suspiciousCount: number; // Count of suspicious patterns
  blockedUntil: number | null; // Timestamp when block expires
}

const rateLimitStore: { [ip: string]: RateLimitEntry } = {};

// Rate limit configuration
// Unlimited for legitimate use - only detect and block automated attacks
// Attacks are characterized by: very rapid cycles (< 5 seconds), many in quick succession
const RAPID_CYCLE_THRESHOLD = 5000; // 5 seconds between calls = rapid cycle (catches only aggressive automation)
const RAPID_CYCLE_LIMIT = 15; // 15 rapid cycles in a row = attack (very high threshold)
const RAPID_CYCLE_COOLDOWN = 5 * 60 * 1000; // 5 minute cooldown after attack detected
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minute block for severe attacks

/**
 * Clean old timestamps using sliding window
 */
const cleanTimestamps = (entry: RateLimitEntry, windowMs: number): number[] => {
  const now = Date.now();
  return entry.timestamps.filter(ts => now - ts < windowMs);
};

/**
 * Check if IP is currently blocked
 */
const isBlocked = (entry: RateLimitEntry): { blocked: boolean; until?: number } => {
  const now = Date.now();
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { blocked: true, until: entry.blockedUntil };
  }
  // Reset block if expired
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blockedUntil = null;
    entry.suspiciousCount = Math.max(0, entry.suspiciousCount - 1); // Reduce suspicion over time
  }
  return { blocked: false };
};

/**
 * Check rate limits and detect abuse patterns
 */
const checkRateLimit = (ip: string): { allowed: boolean; reason?: string; waitTime?: number; cooldown?: number } => {
  const now = Date.now();
  let entry = rateLimitStore[ip];
  
  // Initialize entry if doesn't exist
  if (!entry) {
    entry = {
      timestamps: [],
      rapidCycles: [],
      lastCallTime: null,
      suspiciousCount: 0,
      blockedUntil: null,
    };
    rateLimitStore[ip] = entry;
  }

  // Check if currently blocked
  const blockCheck = isBlocked(entry);
  if (blockCheck.blocked) {
    const waitTime = blockCheck.until! - now;
    return {
      allowed: false,
      reason: 'blocked',
      waitTime: Math.ceil(waitTime / 1000), // Return in seconds
    };
  }

  // Clean old timestamps (sliding window) - only for tracking, not limiting
  entry.timestamps = cleanTimestamps(entry, 60 * 60 * 1000); // 1 hour window for tracking
  entry.rapidCycles = entry.rapidCycles.filter(ts => now - ts < 5 * 60 * 1000); // 5 minute window for rapid cycles

  // NO CALL COUNT LIMITS - Unlimited for legitimate use
  // Only detect automated attacks via rapid cycle patterns

  // Detect rapid cycles (calls started < 5 seconds apart - only catches aggressive automation)
  if (entry.lastCallTime && (now - entry.lastCallTime) < RAPID_CYCLE_THRESHOLD) {
    entry.rapidCycles.push(now);
    entry.suspiciousCount++;
    
    // Only block if we see MANY rapid cycles in a row (15+) - this is clearly an automated attack
    if (entry.rapidCycles.length >= RAPID_CYCLE_LIMIT) {
      // Automated attack detected - block for 30 minutes
      entry.blockedUntil = now + BLOCK_DURATION;
      entry.suspiciousCount = 10; // High suspicion
      console.warn(`[ATTACK DETECTED] IP ${ip} blocked for ${BLOCK_DURATION / 60000} minutes due to automated attack pattern (${entry.rapidCycles.length} rapid cycles)`);
      return {
        allowed: false,
        reason: 'automated_attack',
        waitTime: Math.ceil(BLOCK_DURATION / 1000),
      };
    }
    
    // Log suspicious activity but don't block yet (allows legitimate quick switching)
    if (entry.rapidCycles.length >= 10) {
      console.warn(`[SUSPICIOUS] IP ${ip} showing rapid cycle pattern (${entry.rapidCycles.length} cycles) - monitoring`);
    }
  } else {
    // Reset rapid cycle count if there's a natural pause (legitimate use)
    if (entry.lastCallTime && (now - entry.lastCallTime) >= RAPID_CYCLE_THRESHOLD * 2) {
      // Natural pause detected - reset suspicion
      entry.rapidCycles = [];
      entry.suspiciousCount = Math.max(0, entry.suspiciousCount - 1);
    }
  }

  // All checks passed - allow the call
  entry.timestamps.push(now);
  entry.lastCallTime = now;
  
  // Reduce suspicion over time (if no rapid cycles for a while)
  if (entry.rapidCycles.length === 0 && entry.suspiciousCount > 0) {
    entry.suspiciousCount = Math.max(0, entry.suspiciousCount - 0.5);
  }

  return { allowed: true };
};

export async function POST(request: Request) {
  // Get IP address for rate limiting and logging
  const ipRaw = request.headers.get('x-forwarded-for');
  const ip = ipRaw?.split(',')[0].trim() || "127.0.0.1";

  // Check rate limits
  const rateLimitCheck = checkRateLimit(ip);
  if (!rateLimitCheck.allowed) {
    const userAgent = request.headers.get("user-agent") || "unknown";
    console.warn(`[RATE LIMIT BLOCK] IP=${ip}, Reason=${rateLimitCheck.reason}, WaitTime=${rateLimitCheck.waitTime}s, Time=${new Date().toISOString()}`);
    
    // User-friendly error messages (only for detected attacks)
    let errorMessage = "Automated activity detected. Please wait before trying again.";
    if (rateLimitCheck.reason === 'automated_attack') {
      const minutes = Math.ceil(rateLimitCheck.waitTime! / 60);
      errorMessage = `Automated attack pattern detected. Access temporarily restricted for ${minutes} minute${minutes > 1 ? 's' : ''}.`;
    } else if (rateLimitCheck.reason === 'blocked') {
      const minutes = Math.ceil(rateLimitCheck.waitTime! / 60);
      errorMessage = `Access temporarily restricted. Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        waitTime: rateLimitCheck.waitTime,
        reason: rateLimitCheck.reason,
      },
      { 
        status: 429,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Retry-After': rateLimitCheck.waitTime?.toString() || '300',
        } 
      }
    );
  }

  // Log calls for tracking
  const userAgent = request.headers.get("user-agent") || "unknown";
  console.log(`[COSENTUS VOICE DEMO] New agent session: IP=${ip}, UA=${userAgent}, Time=${new Date().toISOString()}`);

  try {
    const { agentId } = await request.json();
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    // Create web call with Retell AI
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        metadata: { source: 'website', timestamp: new Date().toISOString() },
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Retell API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create demo session. Please try again later.' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    const data = await response.json();
    return NextResponse.json(
      {
        accessToken: data.access_token,
        callId: data.call_id,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error registering Retell call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

