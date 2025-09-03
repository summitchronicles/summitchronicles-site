# Summit Chronicles

[![CI/CD Pipeline](https://github.com/summitchronicles/summitchronicles-site/actions/workflows/ci.yml/badge.svg)](https://github.com/summitchronicles/summitchronicles-site/actions/workflows/ci.yml)

🌐 **Production**: [summitchronicles.com](https://summitchronicles.com)  
🌐 **Staging**: [staging.summit-chronicles.vercel.app](https://staging.summit-chronicles.vercel.app)

A modern Next.js application documenting the Seven Summits journey, featuring real-time Strava integration, AI-powered search, and comprehensive expedition tracking.

## 🏔️ Project Overview

Summit Chronicles is a full-stack mountaineering blog that combines:
- **Personal expedition stories** and training logs
- **Real-time Strava activity tracking** with automatic sync
- **AI-powered site search** using RAG (Retrieval Augmented Generation)
- **Newsletter subscription** with Buttondown integration
- **Modern, responsive design** with mountain-themed branding

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **Next.js 14** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **SWR** for client-side data fetching
- **Zod** for runtime validation

**Backend & APIs:**
- **Supabase** (PostgreSQL with vector extensions)
- **Strava API** for fitness data integration
- **Cohere AI** for embeddings and text generation
- **Next.js API Routes** for server-side logic

**Infrastructure:**
- **Vercel** for hosting and deployment
- **GitHub Actions** for CI/CD
- **Sentry** for error monitoring and performance tracking

### Project Structure

```
summit-chronicles/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── strava/             # Strava integration endpoints
│   │   │   ├── callback/       # OAuth callback handler
│   │   │   ├── recent/         # Recent activities sync
│   │   │   └── stats/          # Aggregated statistics
│   │   ├── ask/                # AI-powered search endpoint
│   │   └── db/                 # Database operations
│   ├── components/             # React components
│   ├── training/               # Training activity pages
│   ├── expeditions/            # Expedition documentation
│   ├── gear/                   # Gear reviews and guides
│   └── ask/                    # AI search interface
├── lib/                        # Utility libraries
│   ├── strava.ts              # Strava API integration
│   ├── embeddings.ts          # AI/vector operations
│   ├── supabaseServer.ts      # Server-side DB client
│   └── supabaseBrowser.ts     # Client-side DB client
├── data/                       # Static data files
├── scripts/                    # Automation scripts
└── e2e/                       # End-to-end tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Strava Developer account
- Cohere API account
- Vercel account (for deployment)

### Environment Setup

Create `.env.local` with the following variables:

```env
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Strava API
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_ACCESS_TOKEN=your_initial_access_token
STRAVA_REFRESH_TOKEN=your_initial_refresh_token

# AI Services
COHERE_API_KEY=your_cohere_api_key

# Newsletter (Optional)
NEXT_PUBLIC_BUTTONDOWN_USERNAME=your_buttondown_username

# Monitoring
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Logging (Optional)
LOG_WEBHOOK_URL=your_logging_webhook_url

# Deployment
NEXT_PUBLIC_VERCEL_URL=your_vercel_deployment_url
```

### Installation

```bash
# Clone the repository
git clone https://github.com/summitchronicles/summitchronicles-site.git
cd summit-chronicles

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Database Setup

The project uses Supabase with the following key tables:

```sql
-- Strava activities storage
CREATE TABLE strava_activities (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  distance DOUBLE PRECISION DEFAULT 0,
  moving_time INTEGER DEFAULT 0,
  total_elevation_gain INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  average_speed DOUBLE PRECISION
);

-- OAuth token management
CREATE TABLE strava_tokens (
  id INTEGER PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Content chunks for AI search (with pgvector extension)
CREATE TABLE chunks (
  doc_id TEXT,
  idx INTEGER,
  content TEXT,
  embedding VECTOR(1024),
  source TEXT,
  url TEXT,
  access TEXT DEFAULT 'public'
);
```

## 🔌 Integrations

### Strava API Integration

The Strava integration (`lib/strava.ts`) handles:

- **OAuth 2.0 flow** with automatic token refresh
- **Activity synchronization** with incremental updates
- **Data persistence** in Supabase database
- **Statistics aggregation** for runs, hikes, and rides

**Key endpoints:**
- `GET /api/strava/recent` - Syncs and returns recent activities
- `GET /api/strava/stats` - Aggregated statistics across all activities
- `GET /api/strava/callback` - OAuth callback handler

### AI-Powered Search

The search system (`app/api/ask/`) implements RAG with:

- **Content chunking** and vector embedding storage
- **Semantic search** using pgvector cosine similarity
- **Context-aware responses** via Cohere AI
- **Source attribution** with automatic linking

### Newsletter Integration

Newsletter functionality uses Buttondown:

- **Email collection** with built-in validation
- **Popup confirmation** workflow
- **Environment-based configuration**
- **Responsive form components**

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run e2e              # Run Playwright end-to-end tests
npm run test:e2e         # Run E2E tests with HTML report

# Linting & Quality
npm run lint             # Run ESLint

# Data Operations
npm run index:rag        # Index content for search
npm run ingest:local     # Ingest data locally
npm run ingest:md:local  # Ingest markdown content (local)
npm run ingest:md:prod   # Ingest markdown content (production)

# Deployment
npm run release          # Deploy to production
npm run release:preflight # Pre-deployment checks
```

### Testing Strategy

**Unit Tests:**
- Jest with React Testing Library
- Component testing and utility function validation

**End-to-End Tests:**
- Playwright for browser automation
- Critical user journey testing
- Cross-browser compatibility

**CI/CD Pipeline:**
- Automated testing on PR and push to main
- Staging deployment for pull requests  
- Production deployment on main branch merge

## 🚢 Deployment

### Vercel Configuration

The project is configured for Vercel deployment with:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "crons": [
    {
      "path": "/api/strava/stats",
      "schedule": "0 4 * * *"
    }
  ]
}
```

**Scheduled Tasks:**
- Daily Strava statistics refresh at 4 AM UTC

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) provides:

1. **Build and Test Phase:**
   - Dependency installation and caching
   - ESLint code quality checks
   - Unit test execution
   - Next.js application build
   - Playwright end-to-end testing

2. **Staging Deployment:**
   - Automatic deployment on pull requests
   - Environment: `https://staging.summit-chronicles.vercel.app`

3. **Production Deployment:**
   - Deployment on main branch updates
   - Sentry release tracking
   - Environment: `https://summitchronicles.com`

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_PROJECT_ID` - Project identifier
- `VERCEL_ORG_ID` - Organization identifier
- `SENTRY_AUTH_TOKEN` - Sentry release tracking

### Environment Configuration

**Staging:**
- Vercel preview deployments
- Reduced monitoring and logging
- Test data and configurations

**Production:**
- Custom domain with SSL
- Full Sentry error tracking
- Production API keys and tokens
- Optimized build and caching

## 📊 Monitoring & Analytics

### Sentry Integration

Error monitoring and performance tracking:
- **Real-time error tracking** with source maps
- **Performance monitoring** for Core Web Vitals
- **Release tracking** integrated with CI/CD
- **Custom error boundaries** for graceful failures

### Logging

Optional webhook-based logging system:
- **API request tracking** with anonymous fingerprinting
- **Search query analytics** with retrieval scoring
- **Performance metrics** and timing data

## 🔒 Security

### Environment Variables
- Service role keys restricted to server-side usage
- Client-side variables properly prefixed with `NEXT_PUBLIC_`
- Sensitive tokens stored in Vercel environment variables

### API Security
- Rate limiting on sensitive endpoints
- Input validation with Zod schemas
- CORS configuration for external API calls
- Anonymous user fingerprinting (no PII storage)

### Database Security
- Row Level Security (RLS) enabled on Supabase
- Service role usage restricted to server-side operations
- Prepared statements for SQL injection prevention

## 🎨 Design System

### Brand Colors
```css
:root {
  --color-alpine-blue: #1e3a8a;    /* Primary brand color */
  --color-summit-gold: #fbbf24;    /* Accent/highlight color */
  --color-charcoal: #1f2937;       /* Text and footer */
  --color-light-gray: #f9fafb;     /* Background */
  --color-snow-white: #ffffff;     /* Pure white accents */
}
```

### Component Library
- **Consistent button styles** with hover animations
- **Card components** with subtle shadows and transforms
- **Responsive typography** with Inter font family
- **Custom CSS properties** for maintainable theming

## 🤝 Contributing

### Development Workflow

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/your-username/summitchronicles-site.git
   ```

2. **Create Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development:**
   - Write code following existing patterns
   - Add tests for new functionality
   - Update documentation as needed

4. **Quality Checks:**
   ```bash
   npm run lint          # Check code quality
   npm run test          # Run unit tests
   npm run e2e           # Run end-to-end tests
   ```

5. **Pull Request:**
   - Create PR against main branch
   - Staging deployment will be created automatically
   - Wait for CI/CD pipeline to pass

### Code Style Guidelines

- **TypeScript strict mode** enabled
- **ESLint configuration** with Next.js recommended rules
- **Consistent naming conventions** for files and variables
- **Component-first architecture** with proper separation of concerns

## 📝 License

This project is private and proprietary to Summit Chronicles.

## 📞 Support

For questions, issues, or contributions:
- **GitHub Issues**: [Project Issues](https://github.com/summitchronicles/summitchronicles-site/issues)
- **Documentation**: This README and inline code comments
- **CI/CD Status**: Check GitHub Actions tab for build status

---

**Next Expedition**: Everest (Target: 2027) 🏔️