# n8n Chat Integration Setup

## Overview

The AI chat feature now uses an n8n workflow instead of directly calling OpenAI. This gives you full control over the AI logic, vector search, and response formatting.

---

## Architecture

```
User → Next.js API (/api/assist-chat) → n8n Webhook → AI Agent → Response
```

**Benefits:**
- ✅ Visual workflow control in n8n
- ✅ Easy to modify AI behavior without code changes
- ✅ Provider agnostic (OpenAI, Anthropic, local models, etc.)
- ✅ Can add custom logic (logging, routing, filtering)
- ✅ Third-party devs don't need to change anything

---

## Security Features

### 1. **Rate Limiting**
- **10 messages per 5 minutes** per IP address
- Prevents abuse and controls costs
- Same pattern as voice agent rate limiting

### 2. **Secret Header Authentication**
- API sends `X-Cosentus-Secret` header to n8n
- n8n can verify requests come from your API (not public)
- Secret is stored in environment variable

### 3. **Server-Side Proxy**
- n8n webhook URL is never exposed to frontend
- All requests go through your Next.js API first
- CORS headers allow third-party integration

---

## Environment Variables

Add these to your `.env.local` file:

```bash
# n8n Webhook Secret (for securing the chat webhook)
N8N_WEBHOOK_SECRET=cosentus-internal-2024
```

**Important:** Also add this to your Vercel environment variables!

---

## n8n Workflow Setup

Your n8n webhook should:

### **1. Accept POST requests at:**
```
https://cosentus.app.n8n.cloud/webhook/chat
```

### **2. Verify the secret header (optional but recommended):**
```javascript
// In n8n, add a "Function" node to check the header:
if ($('Webhook').item.json.headers['x-cosentus-secret'] !== 'cosentus-internal-2024') {
  throw new Error('Unauthorized');
}
```

### **3. Expect this request body:**
```json
{
  "question": "What is Cosentus?",
  "thread_id": "thread_abc123" (or null for new conversation),
  "metadata": {
    "ip": "192.168.1.1",
    "timestamp": "2024-01-05T12:00:00.000Z"
  }
}
```

### **4. Return this response format:**
```json
{
  "answer": "Cosentus is a medical RCM firm...",
  "thread_id": "thread_abc123" (optional, for conversation continuity)
}
```

**Alternative response field names also work:**
- `response` instead of `answer`
- If `thread_id` is not returned, the original one is preserved

---

## Sample n8n Workflow Structure

```
1. Webhook Trigger
   ↓
2. Function (Verify Secret) [Optional]
   ↓
3. OpenAI / Anthropic / Custom AI Node
   - Use vector store for RAG
   - Process the question
   ↓
4. Function (Format Response)
   - Remove citations if needed
   - Clean up text
   ↓
5. Respond to Webhook
   - Return JSON with answer and thread_id
```

---

## Testing

### **Test from your frontend:**
Just use the chat normally - it will automatically use n8n.

### **Test the API directly:**
```bash
curl -X POST https://your-vercel-app.vercel.app/api/assist-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What is Cosentus?"}]
  }'
```

### **Test n8n webhook directly (for debugging):**
```bash
curl -X POST https://cosentus.app.n8n.cloud/webhook/chat \
  -H "Content-Type: application/json" \
  -H "X-Cosentus-Secret: cosentus-internal-2024" \
  -d '{
    "question": "What is Cosentus?",
    "thread_id": null,
    "metadata": {"ip": "127.0.0.1", "timestamp": "2024-01-05T12:00:00.000Z"}
  }'
```

---

## For Third-Party Developers

**Nothing changes!** They still call the same endpoint:

```javascript
fetch('https://your-vercel-app.vercel.app/api/assist-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is Cosentus?' }]
  })
});
```

They don't need to know about n8n - it's completely hidden behind your API.

---

## Monitoring & Logs

### **In Vercel:**
- Check `/api/assist-chat` logs for rate limiting and errors
- Look for `[COSENTUS CHAT]` log entries

### **In n8n:**
- Check workflow executions
- Monitor success/failure rates
- View AI responses before they're sent back

---

## Troubleshooting

### **"Failed to get response from AI"**
- Check n8n workflow is active
- Verify webhook URL is correct
- Check n8n logs for errors

### **"Too many questions from your device"**
- Rate limit hit (10 messages per 5 minutes)
- Wait a few minutes and try again

### **Empty or malformed responses**
- Check n8n is returning `answer` or `response` field
- Verify JSON format matches expected structure

---

## Updating the AI Logic

To change how the AI responds:

1. Open your n8n workflow
2. Modify the AI node settings
3. Save the workflow
4. **No code deployment needed!** Changes are live immediately

This is the main advantage of using n8n vs. hardcoded OpenAI calls.

---

## Security Best Practices

1. ✅ **Keep `N8N_WEBHOOK_SECRET` secret** - Don't commit to git
2. ✅ **Use n8n's built-in authentication** - Verify the secret header
3. ✅ **Monitor usage** - Check logs for suspicious activity
4. ✅ **Rate limiting is active** - Prevents abuse automatically
5. ✅ **Webhook URL is hidden** - Never exposed to frontend/public

---

## Questions?

Contact: support@cosentus.com

