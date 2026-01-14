# Garmin Health API - Google Cloud Run Deployment

## Quick Start (Google Cloud Run - FREE & FAST)

### Prerequisites
```bash
# Install gcloud CLI
brew install google-cloud-sdk

# Login
gcloud auth login

# Set project (or create new one)
gcloud config set project YOUR_PROJECT_ID
```

### Deploy to Cloud Run

```bash
cd garmin-workouts

# Build and deploy in one command
gcloud run deploy garmin-health-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GARMIN_USERNAME=your_email,GARMIN_PASSWORD=your_password

# Or use secrets (more secure)
echo -n "your_email" | gcloud secrets create garmin-username --data-file=-
echo -n "your_password" | gcloud secrets create garmin-password --data-file=-

gcloud run deploy garmin-health-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GARMIN_USERNAME=garmin-username:latest,GARMIN_PASSWORD=garmin-password:latest
```

### Get Service URL
```bash
gcloud run services describe garmin-health-api --region us-central1 --format 'value(status.url)'
```

You'll get: `https://garmin-health-api-XXXXX-uc.a.run.app`

### Test
```bash
curl https://garmin-health-api-XXXXX-uc.a.run.app/ping
curl https://garmin-health-api-XXXXX-uc.a.run.app/health
```

### Add to Vercel
Set environment variable:
- `GARMIN_SERVICE_URL` = `https://garmin-health-api-XXXXX-uc.a.run.app`

## Why Cloud Run?
- ✅ **Generous free tier** (2M requests/month)
- ✅ **Fast cold starts** (~1-2 seconds vs Render's ~30s)
- ✅ **Auto-scales to zero** (no cost when idle)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Built-in secrets management**

---

## Alternative: Render.com (Also Free)

See previous instructions in this file for Render deployment.

## Local Testing

```bash
# From garmin-workouts directory
export GARMIN_USERNAME="your_email"
export GARMIN_PASSWORD="your_password"
export PORT=5001
python api/app.py
```

Test locally:
```bash
curl http://localhost:5001/ping
curl http://localhost:5001/health
```
