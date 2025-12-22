# OpenAI Voice Agent Configuration

This file documents how AI voice agent behavior is configured for each demo scenario.

## Important: Instructions vs Prompt IDs

**Current Implementation:** We use **direct instructions** in the session configuration, not Prompt IDs.

The OpenAI Realtime API (`/v1/realtime/sessions`) accepts an `instructions` parameter directly in the session creation request. This is simpler and more reliable than using Prompt IDs.

## How to Update Agent Behavior:

### Option 1: Update Instructions in Code (Current Method)
1. Open: `src/app/api/voice/token/route.ts`
2. Find the `SCENARIO_INSTRUCTIONS` object
3. Edit the instructions for your scenario
4. Deploy the updated code

### Option 2: Use OpenAI Prompt IDs (Alternative)
If you prefer to manage prompts in the OpenAI portal:
1. Create prompts at https://platform.openai.com/prompts
2. Modify the API route to use prompt IDs instead of instructions
3. Note: This may require additional configuration

## Current Scenarios:

### Patient Intake
- **Scenario ID:** `patient-intake`
- **Description:** Conducts patient intake interviews
- **Behavior:** 
  - Collects patient information (name, DOB, contact)
  - Asks about reason for visit and symptoms
  - Inquires about medical history and medications
  - Asks about allergies and previous surgeries
  - Empathetic and professional tone

### Appointment Booking
- **Scenario ID:** `appointment-booking`
- **Description:** Schedules medical appointments
- **Behavior:**
  - Greets patient warmly
  - Asks about appointment type needed
  - Inquires about preferred date/time
  - Asks about reason for visit
  - Confirms contact information
  - Provides appointment confirmation

### Symptom Checker
- **Scenario ID:** `symptoms`
- **Description:** Preliminary symptom assessment
- **Behavior:**
  - Asks patient to describe symptoms
  - Inquires about symptom onset and severity
  - Asks relevant follow-up questions
  - Assesses urgency level
  - Provides general guidance
  - Emphasizes need to consult healthcare professional

---

## For Third-Party Developers:

The AI behavior for each demo is controlled by instructions in `src/app/api/voice/token/route.ts`.

**To add a new demo:**
1. Add new scenario to `SCENARIO_INSTRUCTIONS` object
2. Write detailed instructions for the AI agent
3. Add UI for the new demo in `src/app/page.tsx`
4. Set button's onClick to: `handleStartVoiceDemo('your-scenario-id')`

**To modify existing demos:**
- Edit the instructions in the `SCENARIO_INSTRUCTIONS` object
- Redeploy the application

**Session Configuration:**
All sessions are configured with:
- Model: `gpt-4o-realtime-preview-2024-12-17`
- Voice: `alloy`
- Modalities: `['text', 'audio']`
- Transcription: Whisper-1
- VAD: Server-side with 0.5 threshold
- English-only responses enforced in instructions
