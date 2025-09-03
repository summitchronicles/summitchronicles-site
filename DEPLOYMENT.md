# Summit Chronicles Deployment Guide

## 🚀 Quick Deployment Workflow

### Prerequisites
- ✅ GitHub connected: `https://github.com/summitchronicles/summitchronicles-site.git`
- ✅ Vercel configured: Project ID `prj_Qorj8Mu2PGJ0uWO9pXwxU4R5MVca`
- ✅ Local development working: `npm run dev` at localhost:3000

### 1. Pre-Deployment Checklist
```bash
# Test locally
npm run dev                    # Verify localhost:3000 works
npm run lint                   # Fix any linting errors
npm run build                  # Ensure clean build
npm run test                   # Run unit tests
npm run e2e                    # Run E2E tests (optional)

# Use Playwright MCP to check console errors
# "Use playwright mcp to open localhost:3000 and check console errors"
```

### 2. Commit and Push Changes
```bash
git status                     # Review changes
git add .                      # Stage all changes
git commit -m "descriptive message with changes"
git push origin main           # Push to GitHub
```

### 3. Deploy to Production
```bash
npm run release               # Automated deployment to Vercel
```

**Alternative deployment methods:**
```bash
vercel deploy --prod          # Direct Vercel deployment
vercel deploy                 # Preview deployment
```

## 🔄 Automated Deployment Pipeline

### Current Setup
- **GitHub:** Auto-synced with local changes
- **Vercel:** Connected to GitHub repo for auto-deployments
- **Domain:** https://summitchronicles.com
- **Preview:** Auto-generated URLs for each commit

### Workflow Integration
1. **Local Development** → Test with Playwright MCP
2. **Git Push** → Triggers Vercel build
3. **Vercel Build** → Runs tests and deploys
4. **Live Site** → Available at summitchronicles.com

## 🧪 Quality Gates

### Before Every Deployment
- [ ] Local development server runs without errors
- [ ] Console errors checked with Playwright MCP
- [ ] Strava API integration working
- [ ] No ESLint errors (`npm run lint`)
- [ ] Clean build (`npm run build`)
- [ ] All tests passing (`npm run test`)

### Post-Deployment Verification
```bash
# Use Playwright MCP to check production
# "Use playwright mcp to open summitchronicles.com and check console errors"
```

## 📝 Deployment Commands Reference

```bash
# Development
npm run dev                   # Start local server
npm run build                 # Production build
npm run start                 # Production server locally

# Testing
npm run lint                  # Code linting
npm run test                  # Unit tests
npm run test:e2e             # E2E tests with report

# Deployment
npm run release              # Full deployment pipeline
npm run release:preflight    # Pre-deployment checks only

# Vercel Direct
vercel deploy --prod         # Production deployment
vercel deploy               # Preview deployment
vercel logs                 # View deployment logs
```

## 🔧 Environment Configuration

### Required Environment Variables
- `STRAVA_CLIENT_ID`: Strava app client ID
- `STRAVA_CLIENT_SECRET`: Strava app secret
- `STRAVA_ACCESS_TOKEN`: Initial access token
- `STRAVA_REFRESH_TOKEN`: Refresh token
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service key

### Vercel Environment Setup
Environment variables are configured in Vercel dashboard and automatically available during builds.

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**: Check `npm run build` locally first
2. **Linting Errors**: Run `npm run lint` and fix issues
3. **API Errors**: Verify environment variables in Vercel
4. **Strava Integration**: Check token refresh in Supabase

### Recovery Steps
```bash
# Rollback deployment
vercel rollback [deployment-url]

# Check deployment logs
vercel logs [deployment-url]

# Force rebuild
vercel deploy --prod --force
```

## ✅ Success Indicators

### Deployment Complete When:
- ✅ Vercel build succeeds
- ✅ Site accessible at summitchronicles.com
- ✅ No console errors (check with Playwright MCP)
- ✅ Strava data loading correctly
- ✅ All navigation working

**Your deployment is live at: https://summitchronicles.com** 🏔️