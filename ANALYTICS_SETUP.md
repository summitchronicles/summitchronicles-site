# 📊 Analytics Setup Guide

Summit Chronicles now has **dual analytics tracking** for comprehensive insights:

## 🎯 **Current Setup**

### 1. **Custom Analytics** ✅ (Already Active)
- **Purpose**: Detailed user behavior, AI interactions, and performance metrics
- **Features**: 
  - Session tracking with fingerprinting
  - Page view analytics with scroll depth
  - AI interaction tracking (question categorization, response time)
  - Custom event tracking
  - Offline sync capability
  - Privacy compliance (opt-out functionality)
- **Data Storage**: Custom `/api/analytics/track` endpoint
- **Dashboard**: Available at `/analytics` page

### 2. **Google Analytics 4** ✅ (Ready to Activate)
- **Purpose**: Industry-standard analytics, goal tracking, audience insights
- **Integration**: Complete - needs only environment variable
- **Events Tracked**:
  - `newsletter_signup` - Newsletter subscriptions
  - `ai_interaction` - Ask Sunith queries with categorization
  - `sponsorship_inquiry` - Business inquiries
  - `training_engagement` - Training page interactions
  - `blog_post_view` - Content engagement

## 🔧 **Activation Steps**

### To Enable Google Analytics:
1. **Get GA4 Measurement ID**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create property for `summitchronicles.com`
   - Copy Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add Environment Variable**:
   ```bash
   # Add to Vercel environment variables
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Deploy**:
   - Redeploy application
   - Analytics will start tracking immediately

## 📈 **Key Metrics Being Tracked**

### **Custom Analytics** (Always Active):
- **Session Data**: User fingerprinting, location, referrer, UTM parameters
- **Page Analytics**: Time on page, scroll depth, interactions
- **AI Interactions**: Question categories, response times, helpfulness ratings
- **Performance**: API response times, error rates

### **Google Analytics** (When Activated):
- **Standard GA4 Events**: Page views, sessions, user demographics
- **Custom Events**:
  - AI query categorization (altitude_training, gear_advice, etc.)
  - Newsletter conversion tracking
  - Sponsorship inquiry pipeline
  - Training content engagement
  - Blog post performance

## 🎛️ **Analytics Dashboard**

**Internal Dashboard**: Visit `/analytics` for real-time custom analytics
- User sessions and geography
- AI interaction patterns
- Performance metrics
- Error monitoring

**Google Analytics**: Standard GA4 dashboard with custom events
- Audience insights
- Conversion tracking
- Goal completion
- Traffic sources

## 🔒 **Privacy Compliance**

- **Consent Management**: Users can opt-out via localStorage
- **Data Minimization**: Only necessary data collected
- **Anonymization**: IP addresses and personal data handled appropriately
- **Transparency**: Clear privacy policy integration

## 📊 **Event Categories**

### AI Interaction Categories:
- `altitude_training` - High altitude and acclimatization
- `gear_advice` - Equipment and gear recommendations
- `training_advice` - Fitness and workout guidance
- `mental_preparation` - Fear management and mindset
- `expedition_costs` - Budget and financial planning
- `route_planning` - Climbing routes and strategy
- `timing_weather` - Seasonal planning and conditions
- `general_mountaineering` - Other mountaineering topics

### Business Events:
- Newsletter signups (conversion tracking)
- Sponsorship inquiries (lead generation)
- Training page engagement (content performance)
- Blog content performance (editorial analytics)

---

## 🚀 **Next Steps**

1. **Set GA4 Measurement ID** in environment variables
2. **Configure Goals** in Google Analytics dashboard
3. **Set Up Alerts** for key metrics (newsletter signups, AI usage spikes)
4. **Monitor Performance** via both analytics systems

Both analytics systems work independently - custom analytics provides deep technical insights while GA4 offers industry-standard marketing analytics.