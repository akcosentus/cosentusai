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

export async function POST(request: Request) {
  try {
    const { agentId } = await request.json();
    
    // Validate environment configuration
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    // Validate request
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
        metadata: {
          source: 'website',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Retell API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to register call with Retell', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return access token to client
    // Note: Token expires in 30 seconds, client must call startCall() quickly
    return NextResponse.json({
      accessToken: data.access_token,
      callId: data.call_id,
    });
    
  } catch (error) {
    console.error('Error registering Retell call:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

