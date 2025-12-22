import { NextResponse } from 'next/server';

// Map of demo scenarios to their OpenAI prompt IDs
const PROMPT_IDS: Record<string, string> = {
  'patient-intake': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84',
  'appointment-booking': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84', // TODO: Replace with actual prompt ID
  'symptoms': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84', // TODO: Replace with actual prompt ID
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Get the scenario from request body
    const body = await request.json();
    const { scenario } = body;

    // Get the prompt ID for this scenario
    const promptId = PROMPT_IDS[scenario as keyof typeof PROMPT_IDS];
    
    if (!promptId) {
      return NextResponse.json(
        { error: 'Invalid scenario' },
        { status: 400 }
      );
    }

    // Generate ephemeral token from OpenAI with scenario-specific prompt
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        prompt: {
          id: promptId,
          version: 'latest'
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to create session', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      client_secret: data.client_secret.value,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

