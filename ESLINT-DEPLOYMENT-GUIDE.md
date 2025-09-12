# ESLint Deployment Process Guide

## Overview
This guide documents the ESLint configuration and troubleshooting process to ensure successful deployments for the Summit Chronicles project.

## Current ESLint Configuration

The project uses a custom `.eslintrc.json` configuration located in the root directory:

```json
{
  "extends": [
    "next/core-web-vitals"
  ],
  "rules": {
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off"
  }
}
```

## Common ESLint Issues and Solutions

### 1. Unescaped Entities Error
**Error**: `react/no-unescaped-entities`
**Description**: React complains about apostrophes and quotes in JSX content
**Solution**: Disabled in ESLint config to allow natural text content

### 2. Hero Icons Import Errors
**Error**: `'TrendingUpIcon' is not exported from '@heroicons/react/24/outline'`
**Common Icons That Need Correction**:
- `TrendingUpIcon` → `ArrowTrendingUpIcon`
- `TrendingDownIcon` → `ArrowTrendingDownIcon`
- `RefreshIcon` → `ArrowPathIcon`
- `BackpackIcon` → `BriefcaseIcon` (BackpackIcon doesn't exist)

### 3. React Hook Dependencies
**Error**: `react-hooks/exhaustive-deps`
**Description**: Missing dependencies in useEffect arrays
**Status**: These show as warnings and don't prevent deployment

### 4. Next.js Route Export Issues
**Error**: Route export field not valid
**Solution**: Only export GET/POST handlers from API routes, not configuration objects

## Deployment Checklist

Before deploying, run these commands:

1. **Build Check**:
   ```bash
   npm run build
   ```
   - Should complete with "✓ Compiled successfully"
   - Warnings are acceptable, errors will block deployment

2. **Environment Variables Check**:
   - Ensure Supabase variables are set in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Icon Import Verification**:
   ```bash
   # Check for problematic icon imports
   grep -r "TrendingUpIcon\|RefreshIcon\|BackpackIcon" --include="*.tsx" --include="*.ts" .
   ```

## Troubleshooting Process

### If Build Fails:

1. **Check Hero Icons Imports**:
   - Look for incorrect icon names in error messages
   - Replace with correct names from @heroicons/react/24/outline

2. **Check TypeScript Errors**:
   - Fix null safety issues (use optional chaining `?.`)
   - Remove invalid exports from API routes

3. **Check ESLint Rules**:
   - Add problematic rules to `.eslintrc.json` if they're not critical
   - Focus on fixing actual errors, not warnings

### Quick Fixes for Common Issues:

```bash
# Fix all TrendingUpIcon imports
sed -i '' 's/TrendingUpIcon/ArrowTrendingUpIcon/g' components/**/*.tsx

# Fix all RefreshIcon imports  
sed -i '' 's/RefreshIcon/ArrowPathIcon/g' components/**/*.tsx

# Fix all BackpackIcon imports
sed -i '' 's/BackpackIcon/BriefcaseIcon/g' components/**/*.tsx
```

## Emergency Deployment

If you need to deploy quickly and ESLint is blocking:

1. **Temporarily disable strict ESLint checking** by adding to `next.config.js`:
   ```javascript
   module.exports = {
     eslint: {
       ignoreDuringBuilds: true,
     },
   }
   ```

2. **Deploy and then fix issues** in follow-up commits

3. **Re-enable ESLint** after fixes are complete

## Monitoring

After deployment:
- Check build logs in Vercel dashboard
- Verify critical pages load correctly:
  - `/training/upload`
  - `/admin`
  - `/ask-sunith`

## Notes

- ESLint warnings don't block deployment, only errors do
- Hero Icons v2.2.0 naming conventions changed from previous versions
- The `react/no-unescaped-entities` rule is disabled to allow natural text content
- Use this guide for all future deployments to maintain consistency

## Last Updated
Generated on deployment troubleshooting session: Hero Icons fixes and ESLint configuration updates.