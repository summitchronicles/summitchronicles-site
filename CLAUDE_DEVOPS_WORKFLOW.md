# Claude Code DevOps Workflow

## Mandatory Workflow for Every Code Change

### 1. Pre-Change Validation
```bash
# Always run before making changes
npm run pre-change-check
```

### 2. Local Testing Pipeline
```bash
# Test locally first
npm run test:local
npm run lint
npm run typecheck
npm run build
```

### 3. Add Evaluations
```bash
# Create evaluation tests for improvements
npm run test:evals
```

### 4. Package Audit
```bash
# Check for unnecessary packages
npm run audit:packages
```

### 5. Production Deployment
- **Platform**: Vercel
- **Domain**: summitchronicles.com
- **Deploy Command**: `vercel --prod`
- **Monitor**: GitHub Actions CI/CD Pipeline

### 6. Production Testing
```bash
# Test in production using Playwright
npm run test:production
```

## Error Documentation System

All errors and solutions are tracked in:
- `docs/errors/ERROR_LOG.md` - Historical error log
- `docs/errors/solutions/` - Solution documentation per error type

## Current Known Issues

### Critical Issues to Never Repeat:
1. **React Hook Violations**: Never place hooks after conditional returns
2. **JSX in .ts files**: Always use .tsx for JSX or React.createElement
3. **ESLint Errors**: Always fix errors, not just warnings
4. **Playwright Syntax**: Validate test syntax before committing
5. **Module Assignment**: Never use 'module' as variable name in Node.js

### Package Removal Candidates:
- Check during every workflow run

## Deployment Status
- **Production URL**: https://summitchronicles.com
- **Staging URL**: https://summit-chronicles-starter-[hash]-summit-chronicles-projects.vercel.app
- **CI/CD**: GitHub Actions
- **Monitoring**: Playwright automated testing

## Success Criteria
✅ All tests pass locally
✅ GitHub Actions CI/CD passes  
✅ Production deployment succeeds
✅ Production tests pass
✅ No regression in functionality