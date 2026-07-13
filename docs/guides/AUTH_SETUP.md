# Authoring Access

Summit Chronicles uses one authoring workflow: the embedded Sanity Studio at `/studio`.

## Required Configuration

Set these variables locally and in Vercel:

```env
INTERNAL_API_KEY=your_private_access_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_server_write_token
```

`INTERNAL_API_KEY` protects the Studio route at the Summit Chronicles layer. Sanity authentication and project permissions still control access to documents inside Studio.

## Sign In

1. Open `/studio`.
2. The site redirects unauthenticated requests to `/auth/login`.
3. Enter `INTERNAL_API_KEY`.
4. Complete Sanity authentication if the current browser does not already have a Sanity session.

The Summit Chronicles session is stored in an HTTP-only, secure cookie for eight hours.

## Content Types

The Studio desk prioritizes:

- Stories and thoughts
- Expedition updates
- Training updates

Reference documents such as authors, categories, expeditions, gear, and media remain available below the primary publishing types.

## Legacy URLs

Old `/admin`, `/dashboard`, `/blog/create`, and `/edit/*` authoring URLs redirect to `/studio`. `/blog/cms` and `/blog/dynamic` redirect to the public `/blog` page.

## Security Notes

- Never expose `INTERNAL_API_KEY` or `SANITY_API_TOKEN` through `NEXT_PUBLIC_*` variables.
- Rotate the internal key if it is shared outside the authoring team.
- Limit Sanity project membership to authorized editors.
- Use `/api/auth/session` only through the login form; the cookie is HTTP-only and cannot be read by client JavaScript.
