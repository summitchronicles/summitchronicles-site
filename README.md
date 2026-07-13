# Summit Chronicles

[Summit Chronicles](https://summitchronicles.com) is Sunith Kumar's publication for expedition updates, observed training progress, and stories from the journey toward the Seven Summits.

## Product Scope

The current site is intentionally focused on three public content streams:

- Expedition plans and field updates
- Training observations and recovery context
- Long-form stories and personal reflections

Community accounts, AI search, and direct Strava or Garmin integrations are not part of the current product.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS
- Sanity for managed editorial content
- Intervals.icu for aggregated activity data
- WHOOP for authorized recovery, sleep, HRV, and strain observations
- Neon PostgreSQL for encrypted WHOOP OAuth credentials
- Cloudflare R2 for optional persisted training artifacts
- Buttondown for newsletter subscriptions
- Vercel for hosting and deployments

## Local Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start the app:

```bash
npm install
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Environment

Create `.env.local` and configure only the services needed for the workflow you are testing.

```env
# Editorial content
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_server_write_token

# Training activity aggregation
INTERVALS_ICU_API_KEY=your_api_key
INTERVALS_ICU_ATHLETE_ID=your_athlete_id

# WHOOP OAuth and Neon token storage
DATABASE_URL=your_neon_connection_string
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=http://localhost:3001/api/auth/whoop/callback
WHOOP_TOKEN_ENCRYPTION_KEY=at_least_32_random_characters

# Protected internal operations
INTERNAL_API_KEY=your_internal_api_key
TRAINING_INGEST_SECRET=your_training_ingest_secret

# Newsletter
BUTTONDOWN_API_KEY=your_buttondown_api_key
```

Production redirect URI:

```text
https://www.summitchronicles.com/api/auth/whoop/callback
```

Optional R2 variables are documented by the schema in `shared/env/server.ts`.

## Core Commands

```bash
npm run dev                 # Start the development server
npm run lint                # Run ESLint
npm run typecheck           # Run TypeScript checks
npm run test:unit           # Run Jest unit tests
npm run test:e2e            # Run Playwright end-to-end tests
npm run build               # Create a production build
npm run db:migrate:whoop    # Apply the Neon WHOOP migration
```

## Main Runtime Paths

- `/` - Current publication overview
- `/expeditions` - Expedition chronology and updates
- `/training` - Intervals.icu activity record with WHOOP recovery context
- `/blog` - Stories and reflections
- `/studio` - Sanity authoring environment
- `/privacy` - Privacy policy and connected-service disclosures

## Training Data Flow

1. Intervals.icu aggregates upstream activities.
2. The ingest pipeline normalizes and optionally persists training artifacts.
3. WHOOP OAuth tokens are encrypted before being stored in Neon.
4. WHOOP recovery observations enrich the training summary at request time.
5. The public training page displays observed data without synthetic readiness or performance claims.

## Deployment

Pushing `main` triggers the connected Vercel production deployment. Pull requests receive preview deployments.

Before publishing a change, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Documentation

- `docs/analysis/PROJECT_COMPARISON_UI_UX_IMPROVEMENT_REPORT_2026-07-07.md` - project and UX assessment
- `docs/architecture-upgrade-2026-03-08.md` - modular architecture notes
- `docs/security-hardening-2026-03-08.md` - API and runtime hardening notes
- `docs/archive/` and `archive/` - historical material that is not current architecture

This repository is private and proprietary to Summit Chronicles.
