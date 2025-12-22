import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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

    // Register a web call with Retell
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Retell API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to register call with Retell', details: errorData },
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
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

