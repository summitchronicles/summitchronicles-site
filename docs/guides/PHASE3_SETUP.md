# Phase 3: Personal API Integration Setup

This document guides you through setting up your personal Strava and newsletter integrations.

## 🏔️ Overview

Your Summit Chronicles site now has the infrastructure to display YOUR personal training data and collect newsletter subscribers. This is your personal portfolio showcasing your Everest training journey.

## 🚀 Quick Start

1. **Copy environment variables:**
   ```bash
   cp .env.example .env.local
   ```

2. **Set up Strava integration** (see detailed steps below)

3. **Set up Newsletter integration** (see detailed steps below)

4. **Go to `/admin` to connect your accounts**

## 📊 Strava Integration Setup

### Step 1: Create Strava API Application
1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click "Create App"
3. Fill in your application details:
   - **Application Name**: Summit Chronicles
   - **Category**: Other
   - **Club**: Leave blank
   - **Website**: Your domain (or localhost:3000 for development)
   - **Application Description**: Personal Everest training portfolio
   - **Authorization Callback Domain**: Your domain (or localhost for dev)

### Step 2: Configure Environment Variables
Add to your `.env.local` file:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRAVA_CLIENT_ID=your_actual_client_id
STRAVA_CLIENT_SECRET=your_actual_client_secret
```

### Step 3: Connect Your Account
1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Click "Connect Strava"
4. Authorize your personal Strava account
5. Your training data will now display on the site

## 📧 Newsletter Integration (Buttondown)

### Step 1: Create Buttondown Account
1. Sign up at [Buttondown](https://buttondown.email)
2. Choose the free plan (up to 1,000 subscribers)
3. Set up your newsletter details

### Step 2: Get API Key
1. Go to Buttondown Settings → API
2. Copy your API key

### Step 3: Configure Environment
Add to your `.env.local` file:
```env
BUTTONDOWN_API_KEY=your_actual_api_key
```

### Step 4: Test Newsletter Signup
1. Restart your dev server
2. Click "Follow My Journey" on the homepage
3. Test subscribing with your email
4. Check your Buttondown dashboard for the new subscriber

## 🎯 What Visitors See

### Training Data Display
- YOUR real Strava activities (hikes, runs, climbs)
- YOUR elevation gains and distances
- YOUR heart rate data and performance metrics
- YOUR training progress over time

### Newsletter Signup
- Visitors can subscribe to follow YOUR journey
- They receive YOUR training updates and insights
- They get YOUR gear reviews and expedition updates

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env.local` to git
- Use different credentials for production
- Rotate API keys periodically

### Strava Tokens
- Access tokens expire and need refresh
- Consider implementing token storage in a database
- Current implementation logs tokens (remove in production)

## 🚀 Deployment Considerations

### Environment Variables in Production
Set these in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway/Render: Dashboard → Environment

### Callback URLs
Update your Strava app settings with production URLs:
- **Website**: https://yourdomain.com
- **Authorization Callback Domain**: yourdomain.com

## 🔧 Troubleshooting

### Strava Connection Issues
- Check client ID/secret are correct
- Verify callback URL matches exactly
- Ensure HTTPS in production

### Newsletter Not Working
- Verify Buttondown API key
- Check network tab for error responses
- Confirm email validation is working

### Admin Page Access
- Admin page is at `/admin` (bookmark it)
- No authentication currently (add in production)
- Consider password protection for production

## 📈 Next Steps

After Phase 3 setup:
1. **Real Data**: Your actual Strava activities display
2. **Growing Audience**: Newsletter subscribers follow your journey  
3. **Professional Portfolio**: Showcases your systematic training approach
4. **Future Features**: Dark mode, advanced analytics, mobile app

## 🎨 Design Philosophy Maintained

All integrations follow the Swiss spa aesthetic:
- Clean, minimal interfaces
- Premium feel and interactions
- Mountain-inspired gradients and shadows
- Professional data presentation

Your personal brand as a serious Everest aspirant is enhanced through this professional presentation of real training data and expert insights.