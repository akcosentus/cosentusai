import { NextResponse } from 'next/server';

// Map of demo scenarios to their OpenAI Realtime Prompt IDs
// These prompts are created in the OpenAI portal under "Audio" section
const SCENARIO_PROMPTS: Record<string, string> = {
  'patient-intake': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84',
  'appointment-booking': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84', // TODO: Create separate prompt
  'symptoms': 'pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84', // TODO: Create separate prompt
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
    const promptId = SCENARIO_PROMPTS[scenario as keyof typeof SCENARIO_PROMPTS];
    
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
        prompt: promptId
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: error,
        scenario: scenario
      });
      return NextResponse.json(
        { 
          error: 'Failed to create session', 
          details: error,
          status: response.status
        },
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
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

