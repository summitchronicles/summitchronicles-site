# Training Ingest Worker

This Cloudflare Worker stays intentionally small. It does not fetch Intervals
or build mission logs itself. It only calls the private Vercel ingest route on a
30-minute cron.

## Why this exists

- Vercel Hobby cron is limited to once per day.
- The training page should not fetch live Intervals data on every public page
  view.
- Cloudflare Worker Cron plus R2 keeps the ingest pipeline close to free.

## Required secrets

Set this Worker secret:

```bash
npx wrangler secret put TRAINING_INGEST_SECRET
```

Set this Vercel env:

```bash
TRAINING_INGEST_SECRET=...
```

The values must match.

## Required vars

`wrangler.jsonc` already includes:

- `TRAINING_INGEST_URL=https://summitchronicles.com/api/training/ingest`

Override it if the production host changes.

## Deploy

```bash
npx wrangler deploy
```

## Manual trigger

```bash
curl -X POST https://<worker-name>.<account>.workers.dev/trigger
```

## Health

```bash
curl https://<worker-name>.<account>.workers.dev/health
```
