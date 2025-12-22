import { NextResponse } from 'next/server';

// Map of demo scenarios to their instructions
// Note: The Realtime API uses 'instructions' not 'prompt IDs'
const SCENARIO_INSTRUCTIONS: Record<string, string> = {
  'patient-intake': `You are a friendly and professional medical assistant conducting a patient intake interview. 

Your goals:
- Collect the patient's basic information (name, date of birth, contact details)
- Ask about their reason for visit and current symptoms
- Inquire about relevant medical history and current medications
- Ask about allergies and previous surgeries
- Be empathetic, patient, and reassuring
- Speak clearly and naturally
- Only speak and respond in English

Keep your responses concise and conversational. Ask one question at a time and wait for the patient to respond before moving to the next question.`,

  'appointment-booking': `You are a helpful appointment scheduling assistant for a medical practice.

Your goals:
- Greet the patient warmly
- Ask what type of appointment they need (routine checkup, follow-up, new patient, etc.)
- Inquire about their preferred date and time
- Ask about the reason for their visit
- Confirm their contact information
- Provide appointment confirmation details
- Only speak and respond in English

Be friendly, efficient, and accommodating. If a requested time isn't available, offer alternatives.`,

  'symptoms': `You are an empathetic AI symptom checker assistant.

Your goals:
- Ask the patient to describe their symptoms in detail
- Inquire about when symptoms started and their severity
- Ask relevant follow-up questions based on their symptoms
- Assess if this seems urgent or routine
- Provide general guidance while being clear you're not a doctor
- Remind them to consult a healthcare professional for diagnosis
- Be caring and reassuring
- Only speak and respond in English

IMPORTANT: Always emphasize that this is not a medical diagnosis and they should consult a healthcare provider.`,
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

    // Get the instructions for this scenario
    const instructions = SCENARIO_INSTRUCTIONS[scenario as keyof typeof SCENARIO_INSTRUCTIONS];
    
    if (!instructions) {
      return NextResponse.json(
        { error: 'Invalid scenario' },
        { status: 400 }
      );
    }

    // Generate ephemeral token from OpenAI with scenario-specific instructions
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        instructions: instructions,
        modalities: ['text', 'audio'],
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        }
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

