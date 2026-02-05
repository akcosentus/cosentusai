# Rate Limiting Implementation Summary

## ✅ What's Been Implemented

### Backend Rate Limiting (`/api/retell/register-call/route.ts`)

**Smart sliding window rate limiter with abuse detection:**

1. **Per-IP Limits:**
   - 5 calls per 15 minutes (sliding window)
   - 20 calls per hour
   - Progressive penalties for abuse

2. **Rapid Cycle Detection:**
   - Detects calls started < 30 seconds apart
   - 2 rapid cycles = 5 minute cooldown
   - 3+ rapid cycles = 1 hour block

3. **Abuse Prevention:**
   - Tracks suspicious patterns
   - Auto-escalates penalties
   - Blocks severe abuse for 1 hour

4. **User-Friendly Error Messages:**
   - Clear explanations
   - Wait time in minutes
   - Different messages for different violation types

### Frontend Rate Limiting (`useRateLimit` hook)

**Client-side friction layer (can be bypassed but adds UX):**

1. **Per-Session Limits:**
   - 3 calls per 10 minutes
   - 30 second cooldown after each call
   - 2 minute cooldown after rapid attempts

2. **Visual Feedback:**
   - Shows remaining attempts
   - Displays wait times
   - Prevents rapid clicking

3. **Integration:**
   - Checks before making API call
   - Records attempts in localStorage
   - Updates state every 5 seconds

### Component Integration

**Updated `/src/app/embed/voice/all/page.tsx`:**

1. Added `useRateLimit` hook
2. Checks client-side limits before starting call
3. Records call attempts
4. Handles backend rate limit errors gracefully
5. Shows user-friendly error messages

## 🔒 Security Model

### Multi-Layer Protection

1. **Frontend (Friction Layer)**
   - Purpose: Add friction, improve UX
   - Can be bypassed: Yes (localStorage can be cleared)
   - Effectiveness: Prevents casual abuse, shows warnings

2. **Backend (Real Protection)**
   - Purpose: Actual enforcement
   - Can be bypassed: No (server-side)
   - Effectiveness: Blocks all abuse attempts

### Legitimate Use Cases Protected

✅ **User exploring agents** - Switching between 8 agents is allowed  
✅ **Reconnection after issues** - Not penalized if call was active  
✅ **Multiple users same network** - Per-IP limits are generous  
✅ **Accidental clicks** - Immediate disconnect doesn't count as rapid cycle

## 📊 Current Limits

### Backend (Server-Side)
- **Normal users**: 5 calls / 15 min, 20 calls / hour
- **Rapid cycles**: 2 cycles = 5 min cooldown, 3+ = 1 hour block
- **Detection**: Calls < 30 seconds apart

### Frontend (Client-Side)
- **Normal users**: 3 calls / 10 minutes
- **Cooldown**: 30 seconds after each call
- **Rapid attempts**: 2 minute cooldown

## 🚀 Next Steps

### Immediate
- ✅ Backend rate limiting implemented
- ✅ Frontend rate limiting implemented
- ✅ Error handling integrated
- ⏳ Test with real usage patterns

### Future Enhancements
- [ ] Track call duration from Retell webhooks
- [ ] Detect calls with no audio input
- [ ] Add admin dashboard for monitoring
- [ ] Implement behavioral scoring
- [ ] Add rate limit status endpoint for UI

## 📝 Files Modified

1. `/src/app/api/retell/register-call/route.ts` - Backend rate limiting
2. `/src/hooks/useRateLimit.ts` - Frontend rate limiting hook (NEW)
3. `/src/app/embed/voice/all/page.tsx` - Integration

## 🧪 Testing Recommendations

1. **Normal usage**: Start 3-4 calls, should work fine
2. **Rapid cycling**: Start call, end immediately, repeat 3x - should trigger cooldown
3. **Hourly limit**: Make 20 calls in an hour - should hit limit
4. **Multiple agents**: Switch between agents - should be allowed
5. **Error messages**: Verify user-friendly messages appear

## ⚠️ Important Notes

- **Backend is the real protection** - Frontend can be bypassed
- **Limits are conservative** - Can be adjusted based on real usage
- **Logging is enabled** - Monitor for abuse patterns
- **Error messages are user-friendly** - Won't confuse legitimate users

## 🔧 Configuration

All limits are configurable in `/src/app/api/retell/register-call/route.ts`:

```typescript
const RATE_LIMIT_15MIN = 5; // Max 5 calls per 15 minutes
const RATE_LIMIT_1HOUR = 20; // Max 20 calls per hour
const RAPID_CYCLE_THRESHOLD = 30000; // 30 seconds
const RAPID_CYCLE_LIMIT = 3; // 3 rapid cycles = abuse
const RAPID_CYCLE_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour
```

Adjust these values based on real-world usage patterns and abuse detection.
