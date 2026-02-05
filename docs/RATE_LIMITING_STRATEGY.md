# Voice Agent Rate Limiting Strategy

## Problem Statement
Voice agent iframes allow anyone to start Retell AI calls, which cost money. We need to prevent abuse while not blocking legitimate users.

## Current Flow
1. User visits iframe → clicks "Begin Conversation"
2. `handleBeginDemo()` → requests mic permission
3. `connect()` → calls `/api/retell/register-call`
4. API creates Retell call (charges Cosentus)
5. Call can last up to 5 minutes (backend limit)

## Attack Vectors
- **Rapid cycling**: Start call → immediately end → repeat
- **No usage**: Start call but never speak (wastes resources)
- **IP flooding**: Same IP starting many calls
- **Session abuse**: Multiple calls in quick succession

## Solution: Multi-Layer Rate Limiting

### Layer 1: Frontend (Client-Side) - Friction Layer
**Purpose**: Add friction, detect obvious abuse patterns, provide user feedback

**Implementation**:
- `localStorage` tracking: Store call attempts with timestamps
- Cooldown periods: Prevent rapid clicking
- Visual feedback: Show remaining attempts, cooldown timer
- Progressive delays: Increase wait time after each attempt

**Limits** (can be bypassed but adds friction):
- 3 calls per 10 minutes (sliding window)
- 10 calls per hour
- 30 second cooldown after each call ends
- 2 minute cooldown after 3 rapid attempts

### Layer 2: Backend (Server-Side) - Real Protection
**Purpose**: Actual enforcement that cannot be bypassed

**Implementation**:
- Sliding window algorithm (more accurate than fixed window)
- Per-IP tracking with Redis or in-memory store
- Per-session tracking (fingerprint-based)
- Progressive penalties for abuse

**Limits**:
- **Normal users**: 5 calls per 15 minutes, 20 calls per hour
- **Suspicious pattern**: Auto-reduce to 2 calls per 15 minutes
- **Abuse detected**: Block for 1 hour, then reset to suspicious limits

**Detection Logic**:
- Rapid start/stop (< 10 seconds) = suspicious
- 3+ rapid cycles = abuse
- No audio input detected = suspicious (if we can track this)
- Multiple agents in < 1 minute = normal (user exploring)

### Layer 3: Behavioral Analysis
**Purpose**: Detect sophisticated abuse patterns

**Track**:
- Call duration distribution
- Time between calls
- Agent switching patterns
- Audio input detection (if available from Retell)

**Actions**:
- Flag suspicious patterns for review
- Auto-escalate penalties
- Log for analysis

## Implementation Plan

### Phase 1: Backend Rate Limiting (Critical)
1. Re-enable and improve rate limiting in `/api/retell/register-call/route.ts`
2. Use sliding window algorithm
3. Track per IP with timestamps
4. Add progressive penalties
5. Return clear error messages

### Phase 2: Frontend Rate Limiting (User Experience)
1. Add client-side tracking in voice agent components
2. Implement cooldown UI
3. Show remaining attempts
4. Prevent rapid clicking

### Phase 3: Enhanced Detection (Future)
1. Track call duration from Retell webhooks
2. Detect rapid start/stop patterns
3. Implement behavioral scoring
4. Add admin dashboard for monitoring

## Recommended Limits

### Conservative (Start Here)
- **Per IP**: 5 calls per 15 minutes, 20 calls per hour
- **Per Session**: 3 calls per 10 minutes
- **Cooldown**: 30 seconds after call ends
- **Rapid cycle detection**: 3 calls < 30 seconds = 5 minute cooldown

### Aggressive (If abuse continues)
- **Per IP**: 3 calls per 15 minutes, 10 calls per hour
- **Per Session**: 2 calls per 10 minutes
- **Cooldown**: 1 minute after call ends
- **Rapid cycle detection**: 2 calls < 30 seconds = 15 minute cooldown

## User Experience Considerations

### Legitimate Use Cases to Protect:
1. **Exploring agents**: User wants to try different agents (8 available)
   - Solution: Allow switching agents without penalty
   - Track: Same agent vs different agents

2. **Connection issues**: User disconnects and reconnects
   - Solution: Don't penalize reconnection within 2 minutes
   - Track: Call duration before disconnect

3. **Multiple users same network**: Office, coffee shop, etc.
   - Solution: Per-IP limits should be generous enough
   - Consider: Session fingerprinting to differentiate users

4. **Accidental clicks**: User starts call by mistake
   - Solution: Allow immediate disconnect without penalty
   - Track: Calls < 5 seconds don't count toward rapid cycle

### Error Messages (User-Friendly)
- "You've started several conversations recently. Please wait [X] minutes before starting another."
- "To prevent abuse, we limit demo calls. Your limit resets in [X] minutes."
- "Too many rapid attempts. Please wait [X] minutes."

## Technical Implementation

### Backend: Sliding Window Rate Limiter
```typescript
// Track calls per IP with sliding window
interface RateLimitEntry {
  timestamps: number[]; // Unix timestamps
  suspiciousCount: number; // Rapid cycles
  lastCallEnd: number | null;
}

// Sliding window: Remove timestamps older than window
const cleanTimestamps = (entry: RateLimitEntry, windowMs: number) => {
  const now = Date.now();
  return entry.timestamps.filter(ts => now - ts < windowMs);
};

// Check limits
const checkRateLimit = (ip: string) => {
  const entry = rateLimitStore[ip] || { timestamps: [], suspiciousCount: 0, lastCallEnd: null };
  const now = Date.now();
  
  // Clean old timestamps
  entry.timestamps = cleanTimestamps(entry, 15 * 60 * 1000); // 15 min window
  
  // Check limits
  if (entry.timestamps.length >= 5) {
    return { allowed: false, reason: 'rate_limit_15min' };
  }
  
  // Check rapid cycles
  if (entry.lastCallEnd && (now - entry.lastCallEnd) < 30000) {
    entry.suspiciousCount++;
    if (entry.suspiciousCount >= 3) {
      return { allowed: false, reason: 'rapid_cycle_abuse', cooldown: 300000 }; // 5 min
    }
  }
  
  return { allowed: true };
};
```

### Frontend: Client-Side Tracking
```typescript
// Store in localStorage
const CLIENT_RATE_LIMIT_KEY = 'cosentus_voice_calls';
const CLIENT_COOLDOWN_KEY = 'cosentus_voice_cooldown';

const checkClientRateLimit = () => {
  const stored = localStorage.getItem(CLIENT_RATE_LIMIT_KEY);
  const calls = stored ? JSON.parse(stored) : [];
  const now = Date.now();
  
  // Remove old entries (10 min window)
  const recent = calls.filter((ts: number) => now - ts < 10 * 60 * 1000);
  
  if (recent.length >= 3) {
    return { allowed: false, waitTime: 600000 - (now - recent[0]) };
  }
  
  // Check cooldown
  const cooldown = localStorage.getItem(CLIENT_COOLDOWN_KEY);
  if (cooldown && (now - parseInt(cooldown)) < 30000) {
    return { allowed: false, waitTime: 30000 - (now - parseInt(cooldown)) };
  }
  
  return { allowed: true };
};
```

## Monitoring & Alerts

### Metrics to Track:
- Total calls per hour/day
- Rate limit hits per hour
- Suspicious pattern detections
- Average call duration
- Rapid cycle occurrences

### Alerts:
- Spike in rate limit hits (> 50/hour)
- Single IP hitting limits repeatedly
- Unusual call patterns

## Next Steps

1. **Implement backend rate limiting** (Phase 1) - Critical
2. **Add frontend friction** (Phase 2) - User experience
3. **Monitor and adjust limits** based on real usage
4. **Add behavioral analysis** (Phase 3) - Advanced protection
