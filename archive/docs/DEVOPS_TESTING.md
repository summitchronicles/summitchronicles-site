# DevOps Testing Process for Summit Chronicles

## Overview
This document outlines the systematic testing process that must be followed before declaring any feature or change ready for user review.

## Pre-Deployment Testing Checklist

### 1. Clear Build Cache
```bash
rm -rf .next
```

### 2. Start Development Server
```bash
npm run dev
```
- Verify server starts without errors
- Note the port (usually 3001 if 3000 is in use)
- Check for any startup warnings

### 3. Test Core Pages
Test all main pages for HTTP 200 status:
```bash
curl -s -o /dev/null -w "Homepage: %{http_code}\n" http://localhost:3001
curl -s -o /dev/null -w "About: %{http_code}\n" http://localhost:3001/about  
curl -s -o /dev/null -w "Blog: %{http_code}\n" http://localhost:3001/blog
curl -s -o /dev/null -w "Training: %{http_code}\n" http://localhost:3001/training
```

Expected results: All should return 200

### 4. Test API Endpoints
Verify all API routes are functional:
```bash
# Health check
curl -s -o /dev/null -w "Health API: %{http_code}\n" http://localhost:3001/api/health

# Newsletter subscription
curl -s -o /dev/null -w "Newsletter API: %{http_code}\n" \
  -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  http://localhost:3001/api/newsletter/subscribe

# Strava activities
curl -s -o /dev/null -w "Strava Activities API: %{http_code}\n" \
  http://localhost:3001/api/strava/activities
```

Expected results: All should return 200

### 5. Production Build Test
```bash
npm run build
```
- Verify build completes without errors
- Check for any type errors or warnings
- Ensure all pages are properly generated

### 6. Monitor Dev Server Logs
Check the dev server console for:
- Compilation errors
- Runtime errors
- Module resolution issues
- Performance warnings

## Error Resolution

### Common Issues:

1. **Module Resolution Errors** (`Cannot find module './xxx.js'`)
   - Solution: Clear .next cache and restart server

2. **500 Errors on Pages**
   - Check for missing imports
   - Verify component syntax
   - Review server logs for stack traces

3. **API Endpoint Failures**
   - Verify environment variables in .env.local
   - Check API route implementations
   - Test with proper request formats

## Success Criteria

Before declaring a feature ready:
- [ ] All pages return HTTP 200
- [ ] All API endpoints return expected responses  
- [ ] Production build completes successfully
- [ ] No console errors in dev server
- [ ] All integrations (Strava, Newsletter) functional

## Failure Protocol

If ANY test fails:
1. Do not declare feature ready
2. Document the specific failure
3. Fix the issue
4. Re-run complete testing process
5. Only declare ready after ALL tests pass

## Testing Timeline

This complete testing process should take approximately 3-5 minutes and must be completed before any feature announcement to the user.