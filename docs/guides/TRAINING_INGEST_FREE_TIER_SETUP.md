# Training Ingest Free-Tier Setup

This setup keeps the training pipeline on a near-zero-cost stack:

- Vercel Hobby serves the app
- `intervals.icu` stays the only training source
- Cloudflare R2 stores durable training artifacts
- Cloudflare Worker Cron triggers ingest every 30 minutes

## Architecture

```text
Cloudflare Cron Worker
  -> POST /api/training/ingest on Vercel
  -> Vercel fetches Intervals.icu
  -> Vercel writes raw snapshot + derived summary + status to R2
  -> /api/training/summary reads persisted artifacts from R2
```

## Why this replaces the old approach

The old training snapshot store wrote JSON to the local filesystem. That is not a
reliable production persistence model on Vercel. The page also depended on
provider fetches at request time, so Intervals auth failures surfaced as stale
or empty public pages.

The new model separates:

- ingestion
- durable storage
- public reads

## Required Vercel env vars

```text
INTERVALS_ICU_API_KEY
INTERVALS_ICU_ATHLETE_ID
INTERNAL_API_KEY
TRAINING_INGEST_SECRET
TRAINING_STORAGE_BACKEND=r2
CLOUDFLARE_R2_ACCOUNT_ID
CLOUDFLARE_R2_ACCESS_KEY_ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY
CLOUDFLARE_R2_BUCKET
CLOUDFLARE_R2_TRAINING_PREFIX=training
```

Notes:

- `TRAINING_INGEST_SECRET` is for the Cloudflare Worker only.
- `INTERNAL_API_KEY` is still used for admin/internal operational routes.
- `TRAINING_STORAGE_BACKEND=r2` forces the app off the local filesystem.

## R2 object layout

```text
training/raw/latest.json
training/raw/archive/YYYY/MM/DD/<timestamp>.json
training/derived/latest-summary.json
training/status/latest.json
```

Rules:

- Never overwrite the derived summary on auth failure or stale cached fallback.
- Always update `training/status/latest.json` on every ingest attempt.

## Cloudflare Worker setup

Worker source is in:

- `cloudflare/training-ingest-worker/src/index.ts`
- `cloudflare/training-ingest-worker/wrangler.jsonc`

Deploy steps:

1. `cd cloudflare/training-ingest-worker`
2. `npx wrangler login`
3. `npx wrangler secret put TRAINING_INGEST_SECRET`
4. `npx wrangler deploy`

The Worker cron is set to every 30 minutes.

## Trigger contract

The Worker sends:

```http
POST /api/training/ingest
x-training-ingest-secret: <TRAINING_INGEST_SECRET>
```

The route also accepts the internal API credential for manual/admin triggers.

## Public route behavior

- `/api/training/summary` reads only the persisted summary artifact
- `/api/training/metrics` reads only the persisted summary artifact
- `/api/training/ingest` is the only route that should talk to Intervals in production

## Failure states

Status is tracked separately from the summary artifact:

- `live`
- `stale`
- `degraded`
- `auth_failed`

This lets the page continue serving the last known good summary while clearly
marking freshness issues.

## Cost profile

Expected at this scale:

- Vercel Hobby: free
- Cloudflare Worker Cron: free tier should be enough
- Cloudflare R2: free tier should be enough

This is the recommended production path if the goal is to stay as close to zero
cost as possible.
