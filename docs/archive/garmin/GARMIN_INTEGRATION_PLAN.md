# Garmin Integration Plan

## Overview

Integrate Garmin Connect to automatically sync daily workouts into your training database and make them available to your AI assistant.

---

## Architecture

```
Garmin Watch/Device
      ↓
Garmin Connect App (syncs automatically)
      ↓
[Two Options for Getting Data]
      ↓
Option A: Manual Sync          Option B: Real-time Webhooks
(Daily cron job)               (Instant updates)
      ↓                              ↓
Your API pulls activities      Garmin pushes to your webhook
      ↓                              ↓
      └──────────┬──────────────────┘
                 ↓
         Supabase Database
         (garmin_workouts table)
                 ↓
         Enhanced AI Assistant
         (queries both historical + Garmin data)
```

---

## Current Status

✅ **Already Built:**
- Database table: `garmin_workouts` (created in Phase 1)
- OAuth callback route: `app/api/garmin/callback/route.ts`
- Garmin credentials in `.env.local`:
  - `GARMIN_CLIENT_ID=172794`
  - `GARMIN_CLIENT_SECRET=[redacted]`

⚠️ **What's Missing:**
- Authentication flow (connect your Garmin account)
- Activity sync mechanism
- Webhook receiver (for real-time updates)
- Daily sync job (fallback)

---

## Phase 1: Garmin OAuth Setup

**Goal:** Allow you to connect your Garmin account once

### Steps:

1. **Create Authorization Page** (`app/garmin/connect/page.tsx`)
   - Button: "Connect Garmin Account"
   - Redirects to Garmin OAuth with proper scopes

2. **Handle OAuth Callback** (enhance existing `/api/garmin/callback`)
   - Exchange code for access token
   - Store tokens securely in Supabase
   - Test connection by fetching 1 activity

3. **Test Connection**
   - Click "Connect Garmin"
   - Authorize on Garmin's site
   - Redirected back with success message

**Scopes Needed:**
- `ACTIVITY_READ` - Read activity data
- `ACTIVITY_WRITE` - (optional) Write activities back

---

## Phase 2: Activity Sync

**Goal:** Pull your workouts from Garmin into the database

### Option A: Manual/Scheduled Sync (Simpler)

**Pros:**
- Easier to implement
- No webhook configuration needed
- Works reliably

**Cons:**
- Not real-time (updates daily/hourly)
- Uses API quota

**Implementation:**
```typescript
// app/api/garmin/sync/route.ts
export async function POST() {
  // 1. Get stored access token
  // 2. Fetch activities from Garmin API (last 30 days)
  // 3. Transform to our schema
  // 4. Insert into garmin_workouts table
  // 5. Return summary
}
```

**Cron Job:** (using `node-cron`)
```javascript
// Sync daily at 11 PM
cron.schedule('0 23 * * *', async () => {
  await fetch('/api/garmin/sync', { method: 'POST' });
});
```

### Option B: Real-time Webhooks (Advanced)

**Pros:**
- Instant updates when you finish a workout
- No polling needed

**Cons:**
- Requires public URL (need deployment)
- More complex setup
- Need to register webhook with Garmin

**Implementation:**
```typescript
// app/api/garmin/webhook/route.ts
export async function POST(request) {
  // Garmin sends activity updates here
  // Verify signature
  // Parse activity data
  // Insert into database
}
```

---

## Phase 3: AI Integration

**Goal:** Make Garmin data available to your AI assistant

### Current AI Flow:
```javascript
// app/api/ai/ask-enhanced/route.ts
const trainingData = await getRelevantTrainingData(question);
// Currently: fetches from historical_workouts only
```

### Updated AI Flow:
```javascript
// Fetch from BOTH sources
const historicalWorkouts = await supabase
  .from('historical_workouts')
  .select('*')
  .order('date', { ascending: false })
  .limit(20);

const garminWorkouts = await supabase
  .from('garmin_workouts')
  .select('*')
  .order('date', { ascending: false })
  .limit(20);

// Combine and normalize
const allWorkouts = [
  ...historicalWorkouts.map(normalizeHistorical),
  ...garminWorkouts.map(normalizeGarmin)
].sort((a, b) => b.date.localeCompare(a.date));

// Feed to AI
const insights = await generateAIResponse(question, allWorkouts);
```

---

## Phase 4: Data Unification

**Goal:** Merge Garmin + Excel data for complete picture

### Database View (SQL):
```sql
CREATE VIEW unified_workouts AS
SELECT
  date,
  exercise_type,
  actual_duration AS duration_minutes,
  distance,
  heart_rate_avg,
  intensity,
  'historical' AS source
FROM historical_workouts

UNION ALL

SELECT
  date,
  activity_type AS exercise_type,
  duration / 60 AS duration_minutes, -- Garmin stores in seconds
  distance / 1000 AS distance, -- Garmin stores in meters
  avg_heart_rate AS heart_rate_avg,
  CASE
    WHEN training_stress_score > 150 THEN 8
    WHEN training_stress_score > 100 THEN 6
    WHEN training_stress_score > 50 THEN 4
    ELSE 2
  END AS intensity, -- Calculate from TSS
  'garmin' AS source
FROM garmin_workouts

ORDER BY date DESC;
```

**AI Query:**
```javascript
const { data: workouts } = await supabase
  .from('unified_workouts')
  .select('*')
  .gte('date', thirtyDaysAgo);
```

---

## Recommended Approach

**Start with Option A (Scheduled Sync):**

1. ✅ **Week 1: OAuth Setup**
   - Connect Garmin account
   - Test fetching 1 activity

2. ✅ **Week 2: Scheduled Sync**
   - Daily sync at 11 PM
   - Fetch last 30 days of activities
   - Store in `garmin_workouts`

3. ✅ **Week 3: AI Integration**
   - Update AI to query both tables
   - Create unified view
   - Test with questions like "What did I do yesterday?"

4. ⏳ **Week 4: Dashboard**
   - Display combined data in training dashboard
   - Charts showing trends
   - Compare planned vs actual

5. ⏳ **Future: Webhooks** (optional)
   - Set up after deployment
   - Real-time updates

---

## Example AI Queries (After Integration)

**You ask:** "How's my training this week?"

**AI response:**
```
Based on your data from both Garmin and manual logs:

This Week (Oct 5-11):
- Monday: Rest day
- Tuesday: 60min cardio run (Garmin: 8.2km, avg HR 145)
- Wednesday: Strength session (Manual: 90min, RPE 7)
- Thursday: 2hr hike (Garmin: 12.3km, 450m elevation, avg HR 128)
- Friday: Active recovery walk (Garmin: 30min, 2.1km)

Analysis:
✅ Good mix of cardio and strength
✅ Heart rate zones look appropriate
⚠️  Consider adding one more endurance session for Everest prep
```

---

## Data Flow Diagram

```
[Garmin Watch] → [Garmin Connect] → [Your API]
                                          ↓
                                  [Supabase Database]
                                    ↓              ↓
                          garmin_workouts    historical_workouts
                                    ↓              ↓
                                [unified_workouts view]
                                          ↓
                                    [AI Assistant]
                                          ↓
                            [Training Dashboard / Chat]
```

---

## Next Immediate Steps

**Ready to start?**

1. **Test Existing Garmin Setup:**
   ```bash
   # Check if callback route works
   curl http://localhost:3000/api/garmin/callback
   ```

2. **Create Connect Button:**
   - Simple page to authorize Garmin
   - One-time setup

3. **Build Sync Function:**
   - Fetch activities from Garmin API
   - Transform and store

**Estimated Time:**
- OAuth Setup: 1-2 hours
- Sync Function: 2-3 hours
- AI Integration: 1 hour
- **Total: ~5 hours** for complete integration

---

## Questions to Consider

1. **How often to sync?**
   - Once daily? (simple)
   - Multiple times per day? (more data)
   - Real-time webhooks? (complex)

2. **How far back to sync?**
   - Last 30 days? (quick)
   - Last 6 months? (comprehensive)
   - All time? (slow initial sync)

3. **Conflict resolution?**
   - What if same workout exists in both Excel and Garmin?
   - Use Garmin as source of truth?
   - Keep both with different `source` tags?

---

**Want me to start with Phase 1 (OAuth setup)?**
