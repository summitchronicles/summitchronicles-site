# Strava Integration Setup Guide

## Current Issue
The Strava OAuth integration is failing with "Authorization Error - invalid application". This means the Strava app credentials need to be configured.

## Steps to Fix

### 1. Create/Configure Strava App
1. Go to https://www.strava.com/settings/api
2. Create a new application or edit existing one
3. Set the following settings:
   - **Application Name**: Summit Chronicles
   - **Website**: https://summitchronicles.com
   - **Authorization Callback Domain**: summitchronicles.com

### 2. Get Credentials
After creating the app, you'll see:
- **Client ID** (public)
- **Client Secret** (private - keep secure!)

### 3. Set Environment Variables
Add these to Vercel environment variables:

```
STRAVA_CLIENT_ID=your_actual_client_id
STRAVA_CLIENT_SECRET=your_actual_client_secret  
STRAVA_REDIRECT_URI=https://summitchronicles.com/api/strava/callback
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_actual_client_id
```

### 4. Important Notes
- The `NEXT_PUBLIC_STRAVA_CLIENT_ID` must match `STRAVA_CLIENT_ID`
- The redirect URI must be EXACTLY: `https://summitchronicles.com/api/strava/callback`
- The callback domain in Strava settings must be: `summitchronicles.com`

### 5. Test the Connection
1. Update environment variables in Vercel
2. Try the OAuth flow again at https://summitchronicles.com/admin/strava
3. Check server logs for debug information

## Current Debug Info
The callback route now logs configuration details (without exposing secrets) to help diagnose the issue.