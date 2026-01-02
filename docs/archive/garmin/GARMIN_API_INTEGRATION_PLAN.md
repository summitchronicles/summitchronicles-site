# Garmin Connect API Integration Plan
## Complete Technical Implementation Guide (No Code)

---

## 📋 Executive Summary

**Goal**: Automatically upload training workouts from your Excel files to Garmin Connect, so they sync to your Garmin devices.

**Current Status**:
- ✅ Website calendar works perfectly with Excel uploads
- ❌ Workouts don't sync to Garmin Connect (manual entry required)

**Solution**: Build a custom Garmin Connect API integration to create structured workouts programmatically.

---

## 🎯 What This Will Enable

1. **Upload once, sync everywhere**: Upload Excel → Website calendar updates + Garmin devices get workouts
2. **Full automation**: No more manual Garmin Connect workout creation
3. **Multi-modal support**: Running, cycling, strength, hiking, mobility workouts
4. **Device sync**: Workouts automatically appear on Garmin watches
5. **Structured workouts**: Steps, intervals, target zones, rest periods

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  User uploads   │
│   Excel file    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Supabase Storage              │
│   - Stores Excel file           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Parse Training Plan           │
│   - Extract workouts by day     │
│   - Group by modality           │
│   - Parse exercises & zones     │
└────────┬────────────────────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐
│ Update Website   │    │ Create Garmin        │
│ Calendar         │    │ Workouts via API     │
│ (Already works)  │    │ (TO BE BUILT)        │
└──────────────────┘    └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Garmin Connect       │
                        │ (User's account)     │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Garmin Devices       │
                        │ (Watches sync)       │
                        └──────────────────────┘
```

---

## 🔐 Phase 1: OAuth 2.0 Authentication Setup

### Overview
Garmin requires OAuth 2.0 for write operations (creating workouts). This is a secure way to access user accounts.

### Steps

#### 1.1 Register Application with Garmin
**Location**: https://developer.garmin.com/

**What to do**:
1. Sign up for Garmin Developer account
2. Create a new application:
   - **App Name**: Summit Chronicles Training Sync
   - **App Type**: Web Application
   - **Description**: Automatic workout sync for mountaineering training
   - **Callback URL**: `https://summitchronicles.com/api/garmin/oauth/callback`
   - **Scopes Needed**:
     - `ACTIVITY_READ` - Read activities
     - `WORKOUT_READ` - Read workouts
     - `WORKOUT_WRITE` - Create/update workouts (CRITICAL)
     - `SCHEDULE_WRITE` - Schedule workouts to calendar

3. **Save these credentials** (you'll receive):
   - Consumer Key (Client ID)
   - Consumer Secret (Client Secret)

**Storage**: Add to `.env.local`:
```env
GARMIN_CONSUMER_KEY=your_consumer_key
GARMIN_CONSUMER_SECRET=your_consumer_secret
```

#### 1.2 Implement OAuth Flow

**Files to Create**:

**`app/api/garmin/oauth/authorize/route.ts`**
- Redirects user to Garmin login
- User grants permissions
- Garmin redirects back with auth code

**`app/api/garmin/oauth/callback/route.ts`**
- Receives auth code from Garmin
- Exchanges code for access token
- Stores token in Supabase (encrypted)

**`lib/integrations/garmin-oauth.ts`**
- Token management
- Refresh expired tokens
- Token storage/retrieval

**Database Table Needed** (`garmin_oauth_tokens`):
```sql
CREATE TABLE garmin_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- 'sunith' for now
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Functions**:
- `getGarminAuthUrl()` - Generate authorization URL
- `exchangeCodeForToken(code)` - Get access token
- `refreshAccessToken(refreshToken)` - Renew expired token
- `getValidAccessToken(userId)` - Get token, refresh if needed

---

## 📝 Phase 2: Workout Data Transformation

### Overview
Convert parsed Excel workouts into Garmin Connect workout format.

### Garmin Workout Structure

Garmin workouts consist of:
1. **Workout metadata**: Name, sport type, description
2. **Steps**: Sequential workout segments
3. **Step types**:
   - Warmup
   - Active (intervals, steady state)
   - Rest/Recovery
   - Cooldown
   - Repeat (for interval blocks)

### Workout Sport Types (Garmin)

```javascript
const GARMIN_SPORT_TYPES = {
  'run': 'running',
  'bike': 'cycling',
  'cycling': 'cycling',
  'hike': 'hiking',
  'hiking': 'hiking',
  'strength': 'strength_training',
  'core': 'strength_training',
  'mobility': 'flexibility_training',
  'yoga': 'yoga',
  'cardio': 'cardio',
  'treadmill': 'treadmill_running'
};
```

### Step Duration Types

```javascript
const DURATION_TYPES = {
  TIME: 'time',              // Minutes/seconds
  DISTANCE: 'distance',      // Meters/kilometers
  LAP_BUTTON: 'lap_button',  // Press lap to continue
  HEART_RATE: 'heart_rate',  // Until HR zone reached
  CALORIES: 'calories'       // Calorie-based
};
```

### Target Types

```javascript
const TARGET_TYPES = {
  HEART_RATE_ZONE: 'heart_rate',  // Z1-Z5
  PACE_ZONE: 'pace',              // Min/km
  POWER_ZONE: 'power',            // Watts or % FTP
  CADENCE: 'cadence',             // Steps/min
  NO_TARGET: 'no_target'          // Open target
};
```

### Example Transformation

**Excel Input**:
```
Session: Easy Run-Walk + Mobility
- Run: Warm-up Walk (10 min)
- Run: Run Intervals - 6 sets x 3 min run + 2 min walk (30 min)
- Run: Cool-down Walk (5 min)
```

**Garmin API Format**:
```json
{
  "workoutName": "Easy Run-Walk + Mobility",
  "sportType": {
    "sportTypeId": 1,  // Running
    "sportTypeKey": "running"
  },
  "workoutSegments": [
    {
      "segmentOrder": 1,
      "sportType": { "sportTypeId": 1, "sportTypeKey": "running" },
      "workoutSteps": [
        {
          "stepOrder": 1,
          "stepType": {
            "stepTypeId": 1,
            "stepTypeKey": "warmup"
          },
          "endCondition": {
            "conditionTypeKey": "time",
            "conditionTypeId": 2
          },
          "endConditionValue": 600,  // 10 minutes in seconds
          "targetType": {
            "workoutTargetTypeId": 1,
            "workoutTargetTypeKey": "no_target"
          }
        },
        {
          "stepOrder": 2,
          "stepType": {
            "stepTypeId": 6,
            "stepTypeKey": "repeat"
          },
          "numberOfIterations": 6,
          "workoutSteps": [
            {
              "stepOrder": 1,
              "childStepId": 1,
              "stepType": {
                "stepTypeId": 3,
                "stepTypeKey": "interval"
              },
              "endCondition": {
                "conditionTypeKey": "time"
              },
              "endConditionValue": 180,  // 3 minutes
              "targetType": {
                "workoutTargetTypeId": 4,
                "workoutTargetTypeKey": "heart_rate_zone"
              },
              "targetValueOne": 2,  // Zone 2
              "targetValueTwo": 2
            },
            {
              "stepOrder": 2,
              "childStepId": 2,
              "stepType": {
                "stepTypeId": 4,
                "stepTypeKey": "recovery"
              },
              "endCondition": {
                "conditionTypeKey": "time"
              },
              "endConditionValue": 120,  // 2 minutes
              "targetType": {
                "workoutTargetTypeId": 4,
                "workoutTargetTypeKey": "heart_rate_zone"
              },
              "targetValueOne": 1,  // Zone 1
              "targetValueTwo": 1
            }
          ]
        },
        {
          "stepOrder": 3,
          "stepType": {
            "stepTypeId": 2,
            "stepTypeKey": "cooldown"
          },
          "endCondition": {
            "conditionTypeKey": "time"
          },
          "endConditionValue": 300,  // 5 minutes
          "targetType": {
            "workoutTargetTypeId": 1,
            "workoutTargetTypeKey": "no_target"
          }
        }
      ]
    }
  ]
}
```

### Files to Create

**`lib/garmin/workout-transformer.ts`**
- Transform parsed workout to Garmin format
- Handle different modalities
- Create step sequences
- Set targets and zones

**Key Functions**:
```typescript
// Main transformation
transformToGarminWorkout(parsedWorkout: ParsedWorkout): GarminWorkout

// Helper functions
createWorkoutStep(exercise, stepOrder): GarminWorkoutStep
determineStepType(exercise): StepType
parseHeartRateZone(targetHR): number
createRepeatBlock(exercises, reps): RepeatStep
getDurationInSeconds(duration): number
```

---

## 🚀 Phase 3: Garmin API Integration

### Overview
Create and schedule workouts using Garmin Connect API.

### API Endpoints

#### 3.1 Create Workout
**Garmin API**: `POST /workout-service/workout`

**Request**:
```typescript
{
  method: 'POST',
  url: 'https://apis.garmin.com/workout-service/workout',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: garminWorkoutJson
}
```

**Response**:
```json
{
  "workoutId": 1234567890,
  "workoutName": "Easy Run-Walk + Mobility",
  "ownerId": 999999,
  "created": "2025-10-13T10:30:00.000Z"
}
```

#### 3.2 Schedule Workout to Calendar
**Garmin API**: `POST /workout-service/schedule/{workoutId}`

**Request**:
```typescript
{
  method: 'POST',
  url: `https://apis.garmin.com/workout-service/schedule/${workoutId}`,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: {
    "date": "2025-10-13"  // YYYY-MM-DD format
  }
}
```

#### 3.3 List Workouts
**Garmin API**: `GET /workout-service/workouts`

**Use case**: Check if workout already exists before creating.

#### 3.4 Delete Workout
**Garmin API**: `DELETE /workout-service/workout/{workoutId}`

**Use case**: Remove old/outdated workouts.

### Files to Create

**`lib/integrations/garmin-workout-api.ts`**
```typescript
// Core API functions
async function createGarminWorkout(
  workoutData: GarminWorkout,
  accessToken: string
): Promise<{ workoutId: number }>

async function scheduleGarminWorkout(
  workoutId: number,
  date: string,
  accessToken: string
): Promise<void>

async function deleteGarminWorkout(
  workoutId: number,
  accessToken: string
): Promise<void>

async function listGarminWorkouts(
  accessToken: string,
  limit?: number
): Promise<GarminWorkout[]>
```

**`app/api/garmin/sync-workouts/route.ts`**
- Endpoint to trigger workout sync
- Process all workouts from active training plan
- Create + schedule in Garmin
- Return sync status

---

## 🔄 Phase 4: End-to-End Workflow

### Complete Flow

```
1. User uploads Excel file
   ↓
2. Excel stored in Supabase Storage
   ↓
3. Parser extracts workouts
   ↓
4. Website calendar updates (already works)
   ↓
5. Trigger Garmin sync (NEW)
   ↓
6. For each workout in plan:
   a. Check if already exists in Garmin
   b. Transform to Garmin format
   c. Create workout via API
   d. Schedule to calendar date
   ↓
7. Sync status returned to user
   ↓
8. Garmin device syncs and shows workouts
```

### Updated Upload API

**`app/api/training/upload-plan/route.ts`** (add to existing):

```typescript
// After uploading to Supabase...

// Trigger Garmin sync
if (setAsActive) {
  try {
    const syncResponse = await fetch('/api/garmin/sync-workouts', {
      method: 'POST',
      body: JSON.stringify({
        planId: insertedPlan.id,
        autoSchedule: true
      })
    });

    const syncResult = await syncResponse.json();

    response.garminSync = {
      success: syncResult.success,
      workoutsCreated: syncResult.workoutsCreated,
      workoutsScheduled: syncResult.workoutsScheduled
    };
  } catch (error) {
    // Log error but don't fail upload
    console.error('Garmin sync failed:', error);
  }
}
```

---

## 📊 Phase 5: Advanced Features

### 5.1 Strength Training Support

Garmin strength workouts have a different structure:

```json
{
  "workoutName": "Lower Body + Core",
  "sportType": { "sportTypeKey": "strength_training" },
  "workoutSegments": [
    {
      "workoutSteps": [
        {
          "stepType": { "stepTypeKey": "exercise" },
          "exerciseName": "Squat",
          "category": "STRENGTH",
          "sets": 4,
          "repsPerSet": 10,
          "weight": {
            "value": 80,
            "unit": "kg"
          },
          "restAfter": 90  // seconds
        }
      ]
    }
  ]
}
```

**Implementation**: Parse Sets/Reps/Load from Excel columns.

### 5.2 Multi-Session Days

For days with multiple workouts (e.g., Morning run + Evening strength):

```typescript
function groupWorkoutsByTime(dayWorkouts: ParsedWorkout[]): {
  morning: ParsedWorkout[],
  afternoon: ParsedWorkout[],
  evening: ParsedWorkout[]
}

// Create separate Garmin workouts
// Schedule at different times same day
```

### 5.3 Workout Notes & Descriptions

Add context to Garmin workouts:

```json
{
  "workoutName": "Easy Run-Walk",
  "description": "Base training week 1. Focus on nasal breathing and conversational pace. Target HR: 125-140 bpm. Cadence: 162-166 spm.",
  "notes": "If back feels sore, reduce to walk only."
}
```

### 5.4 Progress Tracking

Store sync history:

**Database Table** (`garmin_workout_syncs`):
```sql
CREATE TABLE garmin_workout_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id UUID REFERENCES training_plans(id),
  date DATE NOT NULL,
  workout_name TEXT,
  garmin_workout_id BIGINT,
  sync_status TEXT,  -- 'created', 'scheduled', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.5 Automatic Re-sync

Weekly cron job to sync next week's workouts:

```typescript
// Vercel Cron Job
// vercel.json
{
  "crons": [{
    "path": "/api/garmin/sync-weekly",
    "schedule": "0 18 * * 0"  // Sunday 6 PM
  }]
}
```

---

## 🧪 Phase 6: Testing Strategy

### 6.1 Local Testing

1. **OAuth Flow**:
   - Test authorization URL generation
   - Test token exchange
   - Test token refresh

2. **Workout Transformation**:
   - Unit tests for each modality
   - Test interval/repeat blocks
   - Test zone parsing
   - Test strength workouts

3. **API Calls**:
   - Mock Garmin API responses
   - Test error handling
   - Test rate limiting

### 6.2 Integration Testing

**Test Workouts** (start simple):

1. **Simple workout**: 30-minute steady run, no zones
2. **Interval workout**: Warmup + 5x3min intervals + cooldown
3. **Strength workout**: 3 exercises, sets/reps
4. **Multi-modal day**: Run + Strength
5. **Full week**: Complete training plan

### 6.3 Production Testing

1. Create test Garmin account
2. Sync single workout
3. Verify on device
4. Sync full week
5. Test with real account

---

## 🔒 Phase 7: Security & Privacy

### 7.1 Token Security

- **Encryption**: Encrypt tokens in database
- **Scoping**: Request only needed permissions
- **Rotation**: Auto-refresh before expiry
- **Revocation**: Allow user to disconnect

### 7.2 User Consent

**Add UI elements**:
- "Connect to Garmin" button
- Permission explanation
- Disconnect option
- Sync history display

### 7.3 Error Handling

```typescript
try {
  await createGarminWorkout(workout, token);
} catch (error) {
  if (error.status === 401) {
    // Token expired, refresh
    await refreshGarminToken(userId);
    // Retry
  } else if (error.status === 429) {
    // Rate limit, queue for retry
    await queueForRetry(workout);
  } else {
    // Log error, notify user
    logError(error);
  }
}
```

---

## 📈 Phase 8: Monitoring & Maintenance

### 8.1 Logging

Track:
- OAuth success/failure
- Workouts created
- Workouts scheduled
- Sync errors
- API rate limits

### 8.2 Notifications

Alert when:
- Token expires soon
- Sync fails
- Rate limit reached
- New Garmin API version

### 8.3 Analytics

Dashboard showing:
- Workouts synced this week
- Sync success rate
- Most common errors
- Device sync status

---

## ⏱️ Implementation Timeline

### Week 1: OAuth Setup
- Register Garmin app
- Implement OAuth flow
- Test token management
- Create database tables

### Week 2: Workout Transformation
- Build transformer for running workouts
- Add strength workout support
- Test with sample workouts
- Handle edge cases

### Week 3: API Integration
- Implement create workout
- Implement schedule workout
- Add error handling
- Integration testing

### Week 4: End-to-End Flow
- Connect upload to sync
- Multi-workout days
- Progress tracking
- User interface updates

### Week 5: Testing & Polish
- Full integration testing
- Fix bugs
- Documentation
- Deploy to production

---

## 💰 Cost Considerations

- **Garmin API**: Free for personal use
- **Supabase Storage**: ~$0.021/GB (negligible for Excel files)
- **Supabase Database**: Free tier sufficient
- **Vercel**: Free tier works, no extra cost

**Total additional cost**: ~$0/month

---

## 📚 Resources & Documentation

### Official Documentation
- [Garmin Developer Portal](https://developer.garmin.com/)
- [Garmin Connect API](https://developer.garmin.com/gc-developer-program/overview/)
- [OAuth 2.0 Spec](https://oauth.net/2/)
- [Garmin Workout Structure](https://developer.garmin.com/gc-developer-program/workout-api/)

### Libraries to Use
- `oauth` (npm) - OAuth 1.0a/2.0 helper
- `@supabase/supabase-js` - Already using
- `zod` - Schema validation
- `@vercel/cron` - Scheduled jobs

### Similar Projects (Reference)
- `python-garminconnect` - Python library for Garmin
- `garth` - Modern Python Garmin client
- Your existing `garmin-workouts` repo

---

## 🎯 Success Metrics

After implementation, you should have:

✅ **One-click workout sync**: Upload Excel → Garmin devices get workouts
✅ **Zero manual entry**: No more typing workouts in Garmin Connect
✅ **Full automation**: Weekly plans sync automatically
✅ **Multi-modal support**: Running, strength, cycling, hiking all work
✅ **Reliable sync**: 95%+ success rate
✅ **Fast**: Sync complete in <30 seconds

---

## 🚨 Potential Challenges & Solutions

### Challenge 1: Garmin API Rate Limits
**Solution**:
- Implement exponential backoff
- Queue workouts for retry
- Batch requests when possible

### Challenge 2: Complex Workout Structures
**Solution**:
- Start with simple workouts
- Gradually add complexity
- Provide manual override option

### Challenge 3: Token Expiration
**Solution**:
- Auto-refresh tokens
- Alert user when re-auth needed
- Store refresh tokens securely

### Challenge 4: API Changes
**Solution**:
- Version API calls
- Subscribe to Garmin developer updates
- Maintain backward compatibility

---

## 🎓 Learning Path

If implementing yourself:

1. **OAuth 2.0 basics** (1-2 hours)
   - Read OAuth spec
   - Try example flow

2. **Garmin API docs** (2-3 hours)
   - Read workout API docs
   - Study example payloads
   - Test in Garmin sandbox

3. **Build transformer** (1 day)
   - Start with simple workouts
   - Add complexity gradually
   - Write tests

4. **API integration** (2 days)
   - Implement create workout
   - Test with Garmin
   - Handle errors

5. **End-to-end testing** (1 day)
   - Full workflow test
   - Edge cases
   - Production deploy

**Total time**: ~1 week focused work

---

## 🏁 Next Immediate Steps

1. **Run Supabase migration** (already created)
2. **Register Garmin Developer App** → Get credentials
3. **Test OAuth flow** → Connect your account
4. **Create first workout** → Simple 30-min run
5. **Verify on device** → Check Garmin watch
6. **Scale up** → Full week sync

---

## 📞 Support & Questions

When you're ready to implement:

1. Start with Phase 1 (OAuth)
2. Test each phase thoroughly
3. Use Garmin sandbox for testing
4. Reference this plan for each step

**Key principle**: Start simple, iterate, add complexity gradually.

---

**End of Plan**

This plan provides everything needed to build the Garmin integration without writing a single line of code first. Use it as a reference when implementing each phase.
