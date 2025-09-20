# AIDevOps Pipeline Documentation

## Production Deployment Process

### Custom Domain Configuration
- **Project Name**: `summit-chronicles-starter`
- **Custom Domain**: `https://www.summitchronicles.com`
- **Vercel Organization**: `summit-chronicles-projects`

### Deployment Commands

#### Method 1: GitHub Actions (Recommended)
```bash
# Trigger production deployment via GitHub Actions
gh workflow run "Deploy to Production"

# Monitor deployment status
gh run list --workflow="Deploy to Production" --limit=1
gh run watch <RUN_ID>
```

#### Method 2: Direct Vercel CLI (Backup)
```bash
# Deploy to production with custom domain
npx vercel --prod

# The deployment automatically goes to www.summitchronicles.com
```

### Project Structure
- **Repository**: `summitchronicles/summitchronicles-site`
- **Working Directory**: `/Users/sunithkumar/Documents/summit-chronicles-starter`
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS

### Deployment URLs
- **Custom Domain**: https://www.summitchronicles.com
- **Vercel Generated**: https://summit-chronicles-starter-summit-chronicles-projects.vercel.app

### Workflow Files
- **Production Deployment**: `.github/workflows/deploy-prod.yml`
- **CI/CD Pipeline**: `.github/workflows/ci-cd.yml`
- **Continuous Integration**: `.github/workflows/ci.yml`

### Environment Variables Required
- `VERCEL_TOKEN`: Set in GitHub Secrets for automated deployments

### Post-Deployment Verification
```bash
# Check project status
npx vercel project ls

# Verify custom domain
curl -I https://www.summitchronicles.com

# Check deployment logs
gh run view --log --job=<JOB_ID>
```

### Common Issues
1. **Custom Domain Not Updating**: The deployment automatically updates www.summitchronicles.com
2. **GitHub Actions Timing Out**: Use `gh run watch <RUN_ID>` to monitor
3. **Vercel CLI Issues**: Always use the established GitHub Actions workflow first

### Project Configuration Issues
⚠️ **CRITICAL**: GitHub Actions deploys to wrong project (`summitchronicles-site` instead of `summit-chronicles-starter`)

**Root Cause**: The workflow searches for existing projects and links to the first match it finds.

**Solution**: Always use direct CLI deployment to ensure correct project targeting:
```bash
# Verify correct project link
cat .vercel/project.json

# Deploy to production (uses local .vercel/project.json config)
npx vercel --prod --yes
```

### Important Notes
- The custom domain `www.summitchronicles.com` is configured in `summit-chronicles-starter` project
- GitHub Actions workflow has linking issues - use CLI deployment instead
- Local `.vercel/project.json` ensures correct project targeting
- Custom domain automatically updates with production deployments

### Current Status
- **Working Project**: `summit-chronicles-starter` (has www.summitchronicles.com)
- **Wrong Project**: `summitchronicles-site` (GitHub Actions deploys here by mistake)
- **Solution**: Use `npx vercel --prod --yes` for reliable deployments

Last Updated: September 20, 2025