# Garmin API Integration - Implementation Status

## ✅ Completed

### 1. Database Schema
- **File**: `supabase/migrations/create_garmin_oauth_tables.sql`
- **Tables Created**:
  - `garmin_oauth_tokens` - Stores OAuth access/refresh tokens
  - `garmin_workout_syncs` - Tracks workout sync history
- **Status**: SQL ready to run in Supabase

### 2. OAuth Helper Library
- **File**: `lib/integrations/garmin-oauth.ts`
- **Functions**:
  - `getGarminAuthUrl()` - Generate authorization URL
  - `exchangeCodeForToken()` - Exchange code for access token
  - `refreshGarminToken()` - Refresh expired tokens
  - `storeGarminTokens()` - Save tokens to database
  - `getGarminTokens()` - Retrieve valid tokens
  - `isGarminConnected()` - Check connection status
- **Status**: Implementation exists, needs Garmin credentials

---

## 🚧 Next Steps (In Order)

### Step 1: Register Garmin Developer Application
**Time**: 15-30 minutes

1. Go to: https://developer.garmin.com/
2. Sign up for developer account
3. Create new application:
   - Name: "Summit Chronicles Training Sync"
   - Type: Web Application
   - Callback URL: `https://summitchronicles.com/api/garmin/oauth/callback`
   - Scopes: `ACTIVITY_READ`, `WORKOUT_READ`, `WORKOUT_WRITE`, `SCHEDULE_WRITE`

4. Save credentials to `.env.local`:
```env
GARMIN_CONSUMER_KEY=your_consumer_key_here
GARMIN_CONSUMER_SECRET=your_consumer_secret_here
```

**IMPORTANT**: Garmin uses OAuth 1.0a (not 2.0). The existing code needs to be updated to use proper OAuth 1.0a signing.

### Step 2: Install OAuth 1.0a Library
```bash
npm install oauth-1.0a crypto-js
npm install --save-dev @types/oauth-1.0a
```

### Step 3: Update OAuth Implementation
The file `lib/integrations/garmin-oauth.ts` needs to be updated to use OAuth 1.0a instead of OAuth 2.0.

**Reference library**: https://github.com/ddo/oauth-1.0a

### Step 4: Create OAuth API Endpoints

**Files to create**:

1. `app/api/garmin/oauth/authorize/route.ts`
```typescript
// Redirect user to Garmin login
export async function GET(request: NextRequest) {
  const authUrl = getGarminAuthUrl(
    'https://summitchronicles.com/api/garmin/oauth/callback'
  );
  return NextResponse.redirect(authUrl);
}
```

2. `app/api/garmin/oauth/callback/route.ts`
```typescript
// Handle OAuth callback from Garmin
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('oauth_verifier');

  if (!code) {
    return NextResponse.redirect('/training?error=auth_failed');
  }

  try {
    const tokens = await exchangeCodeForToken(code, request.url);
    await storeGarminTokens('sunith', tokens);
    return NextResponse.redirect('/training?garmin=connected');
  } catch (error) {
    return NextResponse.redirect('/training?error=token_exchange_failed');
  }
}
```

### Step 5: Create Workout Transformer

**File**: `lib/garmin/workout-transformer.ts`

This file transforms your Excel workout data into Garmin's workout format.

**Key function**:
```typescript
export function transformToGarminWorkout(
  parsedWorkout: ParsedWorkout,
  date: string
): GarminWorkout {
  // Convert ParsedWorkout to Garmin API format
  // See GARMIN_API_INTEGRATION_PLAN.md for full format
}
```

### Step 6: Create Garmin Workout API Client

**File**: `lib/integrations/garmin-workout-api.ts`

```typescript
export async function createGarminWorkout(
  workoutData: GarminWorkout,
  accessToken: string
): Promise<{ workoutId: number }> {
  const response = await fetch(
    'https://apis.garmin.com/workout-service/workout',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workoutData)
    }
  );

  return await response.json();
}

export async function scheduleWorkout(
  workoutId: number,
  date: string,
  accessToken: string
): Promise<void> {
  await fetch(
    `https://apis.garmin.com/workout-service/schedule/${workoutId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })
    }
  );
}
```

### Step 7: Create Sync Endpoint

**File**: `app/api/garmin/sync-workouts/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Get active training plan
    // 2. Get valid Garmin access token
    // 3. For each workout:
    //    - Transform to Garmin format
    //    - Create workout
    //    - Schedule to calendar
    //    - Track in garmin_workout_syncs table
    // 4. Return sync results
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
```

### Step 8: Add UI Components

**Update**: `app/training/upload/page.tsx`

Add a "Connect Garmin" button:
```tsx
<a
  href="/api/garmin/oauth/authorize"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
>
  Connect Garmin Account
</a>
```

**Update**: `app/api/training/upload-plan/route.ts`

After uploading plan, trigger Garmin sync:
```typescript
if (garminConnected) {
  await fetch('/api/garmin/sync-workouts', {
    method: 'POST',
    body: JSON.stringify({ planId: insertedPlan.id })
  });
}
```

---

## 📊 Implementation Estimate

| Phase | Time | Complexity |
|-------|------|------------|
| Garmin Developer Setup | 30 min | Easy |
| OAuth 1.0a Update | 2 hours | Medium |
| Workout Transformer | 4 hours | Hard |
| Garmin API Client | 2 hours | Medium |
| Sync Endpoint | 3 hours | Medium |
| UI Integration | 1 hour | Easy |
| Testing | 4 hours | Medium |
| **Total** | **~16 hours** | **Medium-Hard** |

---

## 🎯 Quick Start (Recommended Path)

### Option A: Full Implementation (~16 hours)
1. Complete all 8 steps above
2. Test with real Garmin account
3. Deploy to production

### Option B: Phased Approach (~4 hours first phase)
1. Complete Steps 1-2 (Garmin setup + OAuth library)
2. Create OAuth endpoints (Steps 3-4)
3. Test authentication flow
4. **Stop here** - You now have Garmin connected, can add workout creation later

### Option C: Use Existing Tools
1. Keep using website calendar (already works)
2. Manually create workouts in Garmin Connect
3. Wait for Garmin to improve their API or use community tools

---

## 📚 Key Resources

### Documentation
- [Garmin Connect API Docs](https://developer.garmin.com/gc-developer-program/overview/)
- [OAuth 1.0a Spec](https://oauth.net/core/1.0a/)
- [oauth-1.0a npm package](https://www.npmjs.com/package/oauth-1.0a)

### Similar Projects
- `python-garminconnect` - Python implementation
- `garth` - Modern Python Garmin client
- Your existing `lib/integrations/garmin-api.ts` - Activity reading (already works)

### Community
- Garmin Developer Forum
- Reddit: r/Garmin, r/running

---

## ⚠️ Important Notes

### OAuth 1.0a vs OAuth 2.0
Garmin uses OAuth 1.0a (older protocol). The current code in `garmin-oauth.ts` assumes OAuth 2.0 and needs updating.

**Key Differences**:
- OAuth 1.0a requires request signing (HMAC-SHA1)
- Three-legged flow: request token → authorize → access token
- No refresh tokens (access tokens don't expire)
- More complex but more secure

### Workout Format Complexity
Garmin's workout format is complex:
- Different structures for running vs strength vs cycling
- Nested repeat blocks for intervals
- Multiple target types (HR zones, pace, power, etc.)
- Maximum 50 steps per workout

Start with simple workouts (warmup → main → cooldown) before adding complexity.

### Rate Limiting
Garmin has rate limits (not publicly documented). Implement:
- Exponential backoff
- Request queuing
- Error handling for 429 responses

### Testing Strategy
1. **Sandbox**: Test with Garmin's sandbox (if available)
2. **Simple First**: Start with basic 30-min steady run
3. **Incremental**: Add intervals, then strength, then multi-modal
4. **Real Device**: Verify workouts appear on Garmin watch

---

## 🚀 What's Working Now

✅ Website calendar with Excel uploads
✅ Supabase storage for training plans
✅ Database schema for OAuth tokens
✅ OAuth helper functions (need OAuth 1.0a update)
✅ Garmin activity reading (for realtime metrics)

❌ OAuth connection flow (needs implementation)
❌ Workout transformation (needs implementation)
❌ Workout creation API (needs implementation)
❌ Automatic sync (needs implementation)

---

## 💡 Recommendation

Given the complexity and time required, I recommend:

**For now**:
- Use the website calendar (works perfectly)
- Manually create key workouts in Garmin Connect
- Focus on training!

**Later** (when you have 16+ hours):
- Implement full Garmin sync
- Automate everything
- Enjoy one-click workout uploads

The value of automated Garmin sync is high, but the implementation effort is also significant. The current system already solves your main problem (no more git commits for weekly updates). Adding Garmin sync is a nice-to-have enhancement.

**Next immediate action**:
Run the database migration for OAuth tables, then decide if you want to continue with Garmin implementation or focus on training with the current system.
