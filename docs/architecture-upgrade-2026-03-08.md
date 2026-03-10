# Architecture Upgrade - 2026-03-08

## Overview

This upgrade converts the repo from a loose collection of routes and helpers into a more explicit modular monolith.

## Intervals-Only Simplification

The training system was later simplified to use `intervals.icu` as the only runtime source for mission-log data.

Removed legacy branches:

- `/api/training/upload`
- `/api/training/upload-excel`
- `/api/training/upload-plan`
- `/api/training/workouts`
- `/api/training/sync`
- `/training/upload`
- `TimelineCalendar`
- `TrainingCalendar`
- `TrainingPlanRepository`
- `training-sync-controller`
- `training-workout-schedule-service`
- XLSX parsing helpers

The primary goals were:

1. Make failures explicit instead of silently falling back.
2. Move high-risk behavior behind shared security and environment boundaries.
3. Introduce reusable feature modules for content and training.
4. Add focused evals before implementation and keep them runnable after the refactor.
5. Remove production-unsafe behavior from public HTTP routes.

## New Structure

### Shared primitives

- `shared/env/server.ts`
  - Central server-side environment parsing.
  - Supplies allowed origins and credential helpers.
- `shared/security/internal-api.ts`
  - Shared internal-route authentication.
  - Accepts `Authorization: Bearer <key>`, `x-internal-api-key`, or `admin_session`.
- `shared/security/upload.ts`
  - Central upload hardening helpers for file size, image validation, slug validation, and filename sanitization.

### Feature modules

- `modules/content/infrastructure/markdown-content-repository.ts`
  - Owns markdown file listing, parsing, draft reads/writes, publish status changes, and path safety.
  - Invalid frontmatter no longer crashes the entire post listing flow.
- `modules/training/domain/training-metrics.ts`
  - Owns normalized training activity shapes, fallback metrics, and the training dashboard calculation logic.
- `modules/training/domain/training-dashboard.ts`
  - Owns the intervals-only training summary shapes, processed mission-log generation, and workout-stat derivation.
- `modules/training/application/get-training-metrics.ts`
  - Owns the training metrics application flow from provider snapshot to API response.
- `modules/training/application/get-training-dashboard.ts`
  - Owns the canonical training-page summary flow.
  - Merges persisted Intervals telemetry, processed mission logs, and workout stats into a single read model.
- `modules/training/application/unified-workout-service.ts`
  - Owns unified workout-history access for AI and training summary consumers.
- `modules/training/infrastructure/intervals-client.ts`
  - Owns Intervals.icu fetch behavior with runtime env resolution.
  - Provider failures now throw instead of being masked inside the adapter.
- `modules/training/application/training-snapshot-service.ts`
  - Owns durable Intervals ingestion, TTL-based refresh, processed mission-log generation, and `live` / `cached` / `degraded` snapshot states.
- `modules/training/infrastructure/training-snapshot-store.ts`
  - Owns persisted training artifacts for both local development and Cloudflare R2.
  - Stores raw snapshots, the latest derived summary, and the latest ingest status separately so production can serve the last known good summary without a live provider fetch.
- `modules/training/application/training-artifact-service.ts`
  - Owns the production-safe training ingest flow.
  - Forces Intervals refreshes only on the ingest path, writes status on every attempt, and preserves the last good summary on auth failures or stale fallbacks.
- `modules/training/infrastructure/training-insights-repository.ts`
  - Now reads processed mission logs from the persisted Intervals snapshot rather than static content files.
- `modules/sync/domain/sync.ts`
  - Owns the sync runtime contract, status shape, execution result shape, and config validation.
- `modules/sync/application/sync-controller.ts`
  - Owns sync command handling for `status`, `start`, `stop`, `sync`, and `configure`.
  - Keeps `/api/sync` as transport only while validating config updates centrally.
- `modules/monitoring/domain/monitoring.ts`
  - Owns monitoring event types, payload normalization, sanitization, and validation.
- `modules/monitoring/application/monitoring-controller.ts`
  - Owns monitoring ingestion policy, health response shaping, content-type enforcement, and origin checks.
- `modules/monitoring/infrastructure/in-memory-rate-limiter.ts`
  - Owns in-memory request throttling for browser monitoring ingestion.
- `modules/training/domain/training-plan.ts`
  - Owns shared training-plan types so library code no longer imports from API routes.
- `modules/analytics/domain/comprehensive-analytics.ts`
  - Owns deterministic performance metrics, trend calculations, comparison benchmarks, and sample analytics data.
- `modules/analytics/application/compliance-analytics.ts`
  - Owns compliance analytics orchestration and relative-date sample activity generation.
- `modules/analytics/application/comprehensive-analytics.ts`
  - Owns comprehensive analytics response shaping for both POST calculations and GET sample responses.

## Route Changes

### Content routes

- `/api/posts`
  - Now loads via `MarkdownContentRepository`.
  - Returns valid posts even if one file is malformed.
  - Reports `issuesCount` instead of failing wholesale.
- `/api/drafts`
  - Now internal-only.
  - Uses repository-backed draft listing.
- `/api/drafts/[filename]`
  - Now internal-only.
  - Uses repository-backed read, write, delete, and publish logic.
  - Git automation was removed from HTTP requests.
- `/api/publish`
  - Now internal-only.
  - Marks files as published locally only.
  - Git add/commit/push from a public route was intentionally removed.

### Training routes

- `/api/training/metrics`
  - Now loads provider data through `getTrainingMetricsResponse()`.
  - Calculation logic was extracted into `modules/training/domain/training-metrics.ts`.
  - Returns `success: false` and `degraded: true` when upstream data is unavailable.
  - Stops claiming a healthy Intervals source when the provider fails.
- `/api/training/summary`
  - New canonical training-page read model.
  - Consolidates telemetry status, processed mission logs, and workout stats.
  - No longer includes XLSX plan-upload or workout-calendar state.
  - Now reads only the persisted summary artifact in production instead of fetching Intervals at request time.
- `/api/insights`
  - Now returns processed mission logs from the persisted Intervals-backed dashboard summary.
- `/api/training/ingest`
  - New operational route for forcing an Intervals refresh.
  - Accepts either the shared internal API credential or a dedicated `TRAINING_INGEST_SECRET` header for external schedulers.
  - Intended for cron/admin automation so ingestion does not depend only on user page views.

### Operational and admin routes

- `/api/agents/run`
  - Now internal-only.
  - Replaced shell `exec` string execution with direct `spawn`.
- `/api/agents/status`
  - Now internal-only.
- `/api/debug/env-check`
  - Now internal-only.
  - No longer exposes previews or values of environment variables.
- `/api/sync`
  - Now internal-only for sync control operations.
  - Now delegates command handling to `modules/sync/application/sync-controller.ts`.
  - Configuration updates are now real service mutations instead of placeholder echoes.
  - `lastSync` now reflects actual sync execution time.
- `/api/sanity/upload`
  - Now internal-only and limited to image uploads with size checks.
- `/api/monitoring/errors`
  - Now delegates payload validation and health shaping to the monitoring module.
  - Enforces JSON content type, payload size checks, per-IP rate limiting, and allowed-origin checks.
  - Public health responses are now minimal; memory and rate-limit internals are only exposed to internal callers.
- `/api/analytics/compliance`
  - Now delegates all GET and POST behavior to the analytics module.
  - Stops embedding stale hard-coded 2025 sample dates in the route.
- `/api/analytics/comprehensive`
  - Now delegates metrics, trend, and benchmark generation to the analytics module.
  - Removes random trend variance from API responses so analytics are stable across requests.
- `/api/upload`
  - Now internal-only and file-size limited.
- `/api/upload-image`
  - Now internal-only with slug validation and image-size limits.
- `/api/newsletter/subscribers`
  - Now internal-only for list/add/remove management.

### AI maintenance routes

- `/api/ai/init`
- `/api/ai/ingest`
- `/api/ai/status`

These routes are now internal-only because they expose operational status or mutate the knowledge base.

### AI context routes

- `/api/ai/ask-enhanced`
  - Now reads workout history through `modules/training/application/unified-workout-service.ts` rather than the legacy `lib/training` import path.

## Security Hardening

### Proxy

`proxy.ts` was hardened to:

- centralize allowed origins from env
- remove client IP leakage from response headers
- stop logging all request headers in production
- add `Cross-Origin-Opener-Policy`
- add `Cross-Origin-Resource-Policy`
- add `Origin-Agent-Cluster`
- add `X-Permitted-Cross-Domain-Policies`
- only allow `unsafe-eval` in development CSP
- protect admin and studio routes using the shared internal auth gate

### Production behavior changes

- Publishing content through HTTP no longer performs `git add`, `git commit`, or `git push`.
- Sensitive maintenance and upload routes now require an internal API credential in production.
- Internal status endpoints no longer reveal partial secret values.
- Training summary and metrics reads no longer depend on live Intervals requests in production.

## Free-Tier Training Ingest Architecture

To keep the stack near zero cost without Vercel Pro cron:

- Vercel Hobby serves the site and ingest route
- Cloudflare R2 stores training artifacts durably
- Cloudflare Worker Cron triggers `/api/training/ingest` every 30 minutes
- `/api/training/summary` and `/api/training/metrics` read the last persisted derived summary

Reference setup:

- `docs/guides/TRAINING_INGEST_FREE_TIER_SETUP.md`
- `cloudflare/training-ingest-worker/`

## Content Fixes

- Repaired malformed frontmatter in:
  - `content/blog/2026-02-14-everest-s-changing-climate-navigating-unpredictable-weather-patterns.md`
- Added missing public routes to eliminate client-side 404 prefetch noise:
  - `/connect`
  - `/privacy`
  - `/terms`
- Updated footer link from `/contact` to `/connect`.

## Frontend and Asset Fixes

- Removed missing OG image references and pointed metadata to an existing asset.
- Removed missing `site.webmanifest` and `apple-touch-icon` references from the legacy document file.
- Replaced the missing `/images/noise.png` dependency in `CinematicRecovery` with a CSS gradient overlay.
- Replaced Google-font build-time dependency with local fallback font variables so the build succeeds in restricted environments.
- Cleared the remaining React hook lint warnings in analytics, editors, personalization, monitoring, caching, and performance utilities.
- Updated `scripts/process-posts.js` to ignore dot-directories and only process post folders with an `index.md`.

## Test and Eval Changes

### New evals

- `tests/unit/internal-api-auth.test.ts`
- `tests/unit/content-repository.test.ts`
- `tests/unit/training-snapshot-service.test.ts`
- `tests/unit/training-dashboard.test.ts`
- `tests/unit/sync-controller.test.ts`
- `tests/unit/monitoring-controller.test.ts`
- `tests/unit/analytics-controller.test.ts`

### Browser smoke

- `tests/e2e/training-summary.spec.ts`
  - Verifies the training page waits for `/api/training/summary` and renders the consolidated summary cards.

### New script

- `npm run eval:core`

### Test harness upgrades

- Added Jest `@/` alias resolution.
- Added Jest module ignores for:
  - `.next`
  - `bmad-method`
  - `playwright-report`
  - `test-results`
- Narrowed `tsconfig.json` include/exclude patterns so stale top-level `e2e/` files no longer poison typecheck.
- Fixed the representative Playwright navigation test to scope locators to the header nav.

## Validation Commands

Run these after architectural changes:

```bash
npm run eval:core
npm run test:unit
npm run typecheck
npm run lint
npm run build
npx playwright test tests/e2e/basic-navigation.spec.ts --project=chromium
npx playwright test tests/e2e/training-summary.spec.ts --project=chromium
```

## Known Remaining Follow-ups

These are not blocking the new architecture, but they are still worth doing:

1. Finish modularizing the remaining oversized AI routes so `app/api/ai/*` is fully transport-only.
2. Add reconciliation and operator diagnostics on top of the new Intervals snapshot store so the system can explain stale data, missed ingests, and provider health without debugging the page itself.
3. Clean up legacy `scripts/` and `archive/` dependencies once operationally unused.
4. Remove stray Finder metadata files and any remaining non-source residue from the legacy `pages/` tree.
5. Decide on the `sanity` major upgrade path and any remaining dependency audit work beyond the framework upgrade.
