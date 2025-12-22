# OpenAI Prompt Configuration

This file documents the OpenAI prompt IDs used for each demo scenario.

## How to Add a New Demo:

1. **Create the prompt in OpenAI portal:**
   - Go to https://platform.openai.com/prompts
   - Click "Create Prompt"
   - Write your instructions for the AI agent
   - Save and copy the Prompt ID (starts with `pmpt_`)

2. **Update the code:**
   - Open: `src/app/api/voice/token/route.ts`
   - Add your new scenario to the `PROMPT_IDS` object:
     ```typescript
     'your-demo-name': 'pmpt_YOUR_PROMPT_ID_HERE',
     ```

3. **Add UI for the demo:**
   - Open: `src/app/page.tsx`
   - Add a new demo card in the "Voice Demo Section"
   - Set the button's onClick to: `handleStartVoiceDemo('your-demo-name')`

## Current Prompts:

### Patient Intake
- **Scenario ID:** `patient-intake`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84`
- **Version:** latest (auto-updates)
- **Description:** Conducts patient intake, asks about symptoms, medical history

### Appointment Booking
- **Scenario ID:** `appointment-booking`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84` ⚠️ **TODO: Create new prompt**
- **Version:** latest
- **Description:** Helps schedule appointments, asks for date/time preferences

### Symptom Checker
- **Scenario ID:** `symptoms`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84` ⚠️ **TODO: Create new prompt**
- **Version:** latest
- **Description:** Assesses patient symptoms, provides general guidance

---

## For Third-Party Developers:

The AI behavior for each demo is controlled by OpenAI prompts. The client (Cosentus) can:
- Update any prompt in the OpenAI portal
- Changes take effect immediately (no code deployment needed)
- Each demo uses a separate prompt for independent control

**Prompt IDs are configured in:** `src/app/api/voice/token/route.ts`

**To add a new demo:**
1. Client creates prompt in OpenAI portal
2. Client provides you with the Prompt ID
3. Add it to the `PROMPT_IDS` object
4. Create UI for the new demo

