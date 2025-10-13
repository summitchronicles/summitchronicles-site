# Training Plan Upload System

## Overview

You can now upload training plan Excel files directly through your website without needing to commit to git or redeploy to Vercel!

## Setup Steps

### 1. Run the Database Migration

The SQL migration has been copied to your clipboard. Follow these steps:

1. The Supabase SQL Editor should have opened automatically
2. If not, go to: https://supabase.com/dashboard/project/nvoljnojiondyjhxwkqq/sql/new
3. Paste the SQL that was copied to your clipboard
4. Click "Run" to execute the migration

This will create:
- `training_plans` table to store metadata
- `workout-files` storage bucket for Excel files
- Necessary indexes and security policies

### 2. Upload Your Training Plan

#### Via Website (Recommended)
1. Go to: http://localhost:3000/training/upload (or https://summitchronicles.com/training/upload after deployment)
2. Drag and drop your Excel file or click "Browse Files"
3. Click "Upload Training Plan"
4. The calendar will automatically update!

#### Via API (Alternative)
```bash
curl -X POST http://localhost:3000/api/training/upload-plan \
  -F "training_plan=@/path/to/your/Week_XX_plan.xlsx" \
  -F "set_as_active=true"
```

### 3. View Your Calendar

Go to: http://localhost:3000/training/realtime

The calendar will now load from:
1. **First**: Active training plan in Supabase (uploaded via website)
2. **Fallback**: Local Excel file in `garmin-workouts/Scheduled-workouts/`
3. **Last resort**: CSV file

## Excel File Format

Your Excel file should have these columns:

| Column | Description |
|--------|-------------|
| Date | Workout date (YYYY-MM-DD or Excel date) |
| Day | Day of week |
| Block | Training block/phase |
| Session Title | Name of the session |
| Modality | Type: Run, Strength, Bike, Hike, Mobility, etc. |
| Exercise | Specific exercise details |
| Sets | Number of sets (optional) |
| Reps | Repetitions (optional) |
| Tempo | Tempo notation (optional) |
| RPE | Rate of perceived exertion (optional) |
| Duration (min) | Duration in minutes (optional) |
| Target HR (bpm) | Target heart rate or zone (optional) |
| Pace/Speed | Pace information (optional) |
| Incline/% | Incline percentage (optional) |
| Load/Weight | Weight/load (optional) |
| Cadence | Cadence in spm/rpm (optional) |
| Notes | Additional notes (optional) |

## How It Works

1. **Upload**: Excel file is uploaded to Supabase Storage bucket `workout-files`
2. **Parse**: Server parses the Excel file and extracts workout data
3. **Store**: Metadata is stored in the `training_plans` table
4. **Activate**: The new plan is marked as active (previous plans are deactivated)
5. **Display**: Calendar API reads from the active plan and displays workouts

## Benefits

✅ **No git commits needed** - Upload directly through the website
✅ **No redeployment required** - Changes are instant
✅ **Multiple plans** - Store historical plans and switch between them
✅ **Automatic parsing** - Intelligently groups and categorizes workouts
✅ **Works on production** - Same interface works on summitchronicles.com

## API Endpoints

### Upload Training Plan
- **POST** `/api/training/upload-plan`
- Form data: `training_plan` (file), `set_as_active` (boolean)

### Get All Training Plans
- **GET** `/api/training/upload-plan`
- Returns list of all uploaded plans

### Delete Training Plan
- **DELETE** `/api/training/upload-plan?id={plan_id}`
- Removes plan from storage and database

### Get Active Workouts (Calendar Data)
- **GET** `/api/training/workouts`
- Returns current week's workout schedule

## Deployment

When you deploy to Vercel:

1. Push these changes to git:
   ```bash
   git add .
   git commit -m "Add training plan upload system"
   git push
   ```

2. Deploy to Vercel (automatic if you have auto-deploy enabled)

3. The upload page will be available at: https://summitchronicles.com/training/upload

4. You can then upload new weekly plans directly from the website!

## Testing Locally

1. Make sure the database migration was run in Supabase
2. Start your dev server: `npm run dev`
3. Go to: http://localhost:3000/training/upload
4. Upload your `Week_13-19_Oct_2025_plan.xlsx` file
5. Check the calendar: http://localhost:3000/training/realtime

## Regarding Garmin Connect Upload

The Garmin upload to Garmin Connect still requires the manual approach or the Python tool for power-based cycling workouts only. The new upload system is for your **website calendar** only.

To also update Garmin Connect, you would need to:
1. Manually create workouts in Garmin Connect web interface, OR
2. Use the Python tool for cycling workouts with the specific format it expects

## Future Enhancements

Potential improvements:
- Multiple week view
- Week switcher in the calendar
- Training plan history/archive view
- Automated Garmin Connect sync (requires OAuth 2.0 setup)
- Plan comparison features
- Analytics and progress tracking
