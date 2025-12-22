# OpenAI Realtime Voice Agent Prompts

This file documents the OpenAI Realtime API prompt IDs used for each demo scenario.

## How Prompts Work

The OpenAI Realtime API supports **Prompt IDs** created in the OpenAI Developer Portal. These prompts contain:
- System instructions
- Voice settings
- Turn detection configuration
- Model configuration
- And more...

## Creating a New Prompt

1. **Go to OpenAI Portal:**
   - Visit https://platform.openai.com/
   - Click on "Create" → "Audio"
   
2. **Configure Your Prompt:**
   - **System Instructions:** Write the AI agent's behavior and personality
   - **Voice:** Choose voice (alloy, echo, fable, onyx, nova, shimmer)
   - **Automatic Turn Detection:** Configure VAD settings
   - **Model:** Select `gpt-4o-realtime-preview-2024-12-17`
   - **Functions:** Add any custom functions if needed
   
3. **Save and Copy Prompt ID:**
   - After saving, copy the Prompt ID (starts with `pmpt_`)
   - Example: `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84`

## Current Prompts

### Patient Intake
- **Scenario ID:** `patient-intake`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84`
- **Description:** Conducts patient intake interviews, collects medical history
- **To Update:** Edit this prompt in the OpenAI portal, changes apply immediately

### Appointment Booking
- **Scenario ID:** `appointment-booking`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84` ⚠️ **TODO: Create separate prompt**
- **Description:** Helps schedule medical appointments
- **To Update:** Create a new prompt in OpenAI portal and update the ID in code

### Symptom Checker
- **Scenario ID:** `symptoms`
- **Prompt ID:** `pmpt_6949a6e05e848194b94f5199ec8ab199028e147de8b31c84` ⚠️ **TODO: Create separate prompt**
- **Description:** Preliminary symptom assessment with empathetic guidance
- **To Update:** Create a new prompt in OpenAI portal and update the ID in code

---

## How to Add a New Demo

### Step 1: Create Prompt in OpenAI Portal
1. Go to https://platform.openai.com/ → Create → Audio
2. Write your system instructions
3. Configure voice and turn detection
4. Save and copy the Prompt ID

### Step 2: Update Code
1. Open: `src/app/api/voice/token/route.ts`
2. Add to `SCENARIO_PROMPTS` object:
   ```typescript
   'your-demo-name': 'pmpt_YOUR_PROMPT_ID_HERE',
   ```

### Step 3: Add UI
1. Open: `src/app/page.tsx`
2. Add a new demo card in the "Voice Demo Section"
3. Set button's onClick to: `handleStartVoiceDemo('your-demo-name')`

---

## For Third-Party Developers

### Managing AI Behavior
The client (Cosentus) can update AI behavior in two ways:

**Option 1: Edit Existing Prompts (Recommended)**
- Go to OpenAI portal and edit the prompt
- Changes take effect immediately
- No code deployment needed

**Option 2: Create New Prompts**
- Create new prompt in OpenAI portal
- Provide the new Prompt ID to developers
- Developers update `SCENARIO_PROMPTS` in code
- Deploy updated code

### Technical Details
- **API Endpoint:** `/v1/realtime/sessions`
- **Authentication:** Bearer token (OpenAI API key)
- **Prompt Parameter:** Pass prompt ID directly in session creation
- **Model:** `gpt-4o-realtime-preview-2024-12-17`

### Code Location
Prompt IDs are configured in: `src/app/api/voice/token/route.ts`

```typescript
const SCENARIO_PROMPTS: Record<string, string> = {
  'patient-intake': 'pmpt_xxx...',
  'appointment-booking': 'pmpt_yyy...',
  'symptoms': 'pmpt_zzz...',
};
```

---

## Benefits of Using Prompts

✅ **No Code Changes:** Update AI behavior without redeploying  
✅ **Centralized Management:** All settings in one place (OpenAI portal)  
✅ **Version Control:** OpenAI tracks prompt versions  
✅ **Easy Testing:** Test different prompts without code changes  
✅ **Consistent Configuration:** Voice, VAD, and instructions stay together
