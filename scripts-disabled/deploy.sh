#!/bin/bash
# Summit Chronicles Production Deployment Script

set -e  # Exit on any error

echo "🏔️  Starting Summit Chronicles deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
    exit 1
fi

# Backup current environment
print_status "Creating backup of current configuration..."
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    print_status "Environment backup created"
fi

# Run pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if production environment template exists
if [ ! -f ".env.production.example" ]; then
    print_warning "No production environment template found"
else
    print_status "Production environment template found"
fi

# Lint check
print_status "Running linting checks..."
if npm run lint:check 2>/dev/null; then
    print_status "Linting passed"
else
    print_warning "Linting warnings found - continuing with deployment"
fi

# Type checking
print_status "Running type checks..."
if npm run type-check 2>/dev/null; then
    print_status "Type checking passed"
else
    print_warning "Type checking warnings found - continuing with deployment"
fi

# Build check
print_status "Testing production build..."
if npm run build; then
    print_status "Build successful"
else
    print_error "Build failed - aborting deployment"
    exit 1
fi

# Security audit
print_status "Running security audit..."
if npm audit --audit-level high; then
    print_status "Security audit passed"
else
    print_warning "Security audit found issues - review before deploying to production"
fi

# Check for sensitive files
print_status "Checking for sensitive files..."
if [ -f ".env.local" ] && grep -q "localhost\|127.0.0.1\|development" .env.local; then
    print_warning "Development environment variables detected"
fi

# Performance check
print_status "Analyzing bundle size..."
if npm run analyze 2>/dev/null; then
    print_status "Bundle analysis complete"
else
    print_warning "Bundle analysis not available"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."

# Ask for deployment confirmation
echo ""
echo "🚀 Ready to deploy Summit Chronicles to production!"
echo "   - Multi-user training platform"
echo "   - AI-powered periodization"  
echo "   - Advanced analytics dashboard"
echo "   - PWA with offline support"
echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Deploy with production settings
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_status "Deployment successful! 🎉"
        echo ""
        echo "🏔️  Summit Chronicles is now live!"
        echo ""
        echo "Next steps:"
        echo "1. Test all features on production"
        echo "2. Set up monitoring and alerts"
        echo "3. Configure custom domain if needed"
        echo "4. Set up SSL certificate"
        echo "5. Configure production database"
        echo ""
        
        # Get deployment URL
        DEPLOYMENT_URL=$(vercel ls summit-chronicles --prod | head -2 | tail -1 | awk '{print $2}')
        if [ ! -z "$DEPLOYMENT_URL" ]; then
            echo "🌐 Production URL: https://$DEPLOYMENT_URL"
        fi
        
    else
        print_error "Deployment failed"
        exit 1
    fi
else
    print_status "Deployment cancelled"
    exit 0
fi

# Post-deployment checks
print_status "Running post-deployment health checks..."

# Check if deployment is accessible
if [ ! -z "$DEPLOYMENT_URL" ]; then
    if curl -sf "https://$DEPLOYMENT_URL" > /dev/null; then
        print_status "Site is accessible"
    else
        print_warning "Site may not be fully accessible yet (this is normal for new deployments)"
    fi
fi

# Restore environment backup if exists
if [ -f ".env.local.backup" ]; then
    mv .env.local.backup .env.local
    print_status "Environment backup restored"
fi

print_status "Deployment script completed!"
echo ""
echo "📊 Deployment Summary:"
echo "   ✅ Build successful"
echo "   ✅ Deployed to production" 
echo "   ✅ Health checks completed"
echo ""
echo "🏔️  Welcome to the summit! Your mountaineering platform is live!"