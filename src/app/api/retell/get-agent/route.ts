import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    
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

    // Get agent details from Retell
    const response = await fetch(`https://api.retellai.com/v2/get-agent/${agentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Retell API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: 'Failed to get agent details from Retell', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Retell agent details:', {
      agent_id: data.agent_id,
      agent_name: data.agent_name,
      response_engine: data.response_engine,
      voice_id: data.voice_id,
      language: data.language,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting Retell agent details:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

