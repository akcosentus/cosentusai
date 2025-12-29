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

const RATE_LIMIT_WINDOW = 5 * 60 * 1000;   // 5 minutes
const MAX_REQUESTS_PER_IP = 3;             // 3 calls per IP per window
const rateLimitStore: { [ip: string]: number[] } = {};

export async function POST(request: Request) {
  // Get IP address:
  const ipRaw = request.headers.get('x-forwarded-for');
  const ip = ipRaw?.split(',')[0].trim() || "127.0.0.1";
  const now = Date.now();

  // Cleanup old timestamps for this IP
  const timestamps = (rateLimitStore[ip] || []).filter(ts => now - ts < RATE_LIMIT_WINDOW);

  // Check if max attempts reached
  if (timestamps.length >= MAX_REQUESTS_PER_IP) {
    console.warn(`[RATE LIMIT BLOCK] ${ip} hit limit (${MAX_REQUESTS_PER_IP} in ${RATE_LIMIT_WINDOW / 60000}min) - ${new Date().toISOString()}`);
    return NextResponse.json(
      { error: "Too many demo attempts from your device. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }
  timestamps.push(now);
  rateLimitStore[ip] = timestamps;

  // Log calls for tracking
  const userAgent = request.headers.get("user-agent") || "unknown";
  console.log(`[COSENTUS VOICE DEMO] New agent session: IP=${ip}, UA=${userAgent}, Time=${new Date().toISOString()}`);

  try {
    const { agentId } = await request.json();
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
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
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json({
      accessToken: data.access_token,
      callId: data.call_id,
    });
  } catch (error) {
    console.error('Error registering Retell call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

