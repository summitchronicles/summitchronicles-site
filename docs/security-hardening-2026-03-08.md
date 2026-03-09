# Security Hardening - 2026-03-08

## Internal Route Authentication

Sensitive routes now use a shared internal access gate.

Accepted credentials:

1. `Authorization: Bearer <INTERNAL_API_KEY>`
2. `x-internal-api-key: <INTERNAL_API_KEY>`
3. `admin_session=<INTERNAL_API_KEY>` cookie

Development behavior:

- If `INTERNAL_API_KEY` is not configured and `NODE_ENV !== "production"`, internal routes stay accessible for local development.

Production behavior:

- Sensitive routes require a valid internal credential.

## Routes Treated as Internal

- `/api/agents/run`
- `/api/agents/status`
- `/api/ai/init`
- `/api/ai/ingest`
- `/api/ai/status`
- `/api/debug/env-check`
- `/api/drafts`
- `/api/drafts/[filename]`
- `/api/edit/[slug]`
- `/api/newsletter/subscribers`
- `/api/publish`
- `/api/sanity/upload`
- `/api/sync`
- `/api/training/ingest`
- `/api/upload`
- `/api/upload-image`

## Training Read Model Hardening

`/api/training/summary` is intentionally public because the training page depends on it, but it now:

- exposes a consolidated intervals-only read model instead of raw provider payloads
- reports telemetry as `live`, `cached`, or `degraded`
- serves processed weekly mission logs from a persisted Intervals snapshot instead of seeded content files
- keeps public consumers away from direct provider payloads and force-refresh operations

## Removed Unsafe HTTP Behavior

The following behavior was removed from HTTP routes:

- `git add`
- `git commit`
- `git push`

Reason:

- These operations should be performed through a controlled developer or CI workflow, not a public or semi-public route.

## Upload Hardening

Upload routes now enforce one or more of:

- maximum file size
- image-only validation
- filename sanitization
- slug validation

The legacy XLSX training upload surface was removed entirely in the intervals-only simplification.

## Monitoring Hardening

`/api/monitoring/errors` now:

- accepts only JSON payloads
- rejects oversized monitoring payloads
- rate-limits browser ingestion per IP
- checks request origins against the configured allowed origins
- exposes only a minimal public health payload
- returns memory and rate-limit diagnostics only to internal callers

## Image Hardening

`next.config.mjs` now:

- removes the wildcard `*.supabase.co` image allowlist entry
- keeps only the explicit Supabase host in use
- disables `dangerouslyAllowSVG`
- forces remote image responses to download as attachments

## Dependency Refresh

This pass also:

- refreshed `caniuse-lite`
- refreshed `baseline-browser-mapping`
- applied the safe `npm audit fix` updates
- moved the app to `next@16.1.6`
- moved the React stack to the current React 19 line
- migrated middleware behavior to `proxy.ts` for the current Next runtime model

Remaining dependency risk after the safe updates:

- `sanity` remediation requires a major-version upgrade
- the remaining `next` advisories require moving beyond the current major line

## Middleware Hardening

`proxy.ts` now:

- avoids reflecting the client IP back to the browser
- limits request logging in production to a minimal event record
- applies stricter cross-origin response headers
- derives allowed CORS origins from env-aware config
- removes `unsafe-eval` from CSP in production

## Operational Guidance

### Recommended production env

Set:

- `INTERNAL_API_KEY`
- `ALLOWED_ORIGINS`

Recommended `ALLOWED_ORIGINS` format:

```text
https://summitchronicles.com,https://admin.summitchronicles.com
```

### Calling internal routes

Example:

```bash
curl -H "Authorization: Bearer $INTERNAL_API_KEY" \
  https://summitchronicles.com/api/debug/env-check
```

## Residual Risk

This hardening pass removed the highest-risk XLSX training ingestion branch and added a durable Intervals snapshot store. The main remaining training risk is operational and architectural: the system still needs richer reconciliation, freshness diagnostics, and admin-visible ingest health so stale or partial telemetry is obvious without inspecting raw files.
