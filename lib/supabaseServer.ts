// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * We read env vars lazily inside functions so builds don't crash
 * if Vercel hasn't injected them yet. Never use the service role
 * in any client/browser code — only from server routes or scripts.
 */

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY
// IMPORTANT: match your .env.local key name exactly
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

function assertEnv(name: string, val?: string): asserts val is string {
  if (!val) {
    throw new Error(`Missing ${name} in environment. Check your .env.local and Vercel env vars.`)
  }
}

/** Read-only client that respects RLS (safe for server reads) */
export function getSupabaseAnon(): SupabaseClient {
  assertEnv('SUPABASE_URL', url)
  assertEnv('SUPABASE_ANON_KEY', anon)
  return createClient(url, anon, { auth: { persistSession: false } })
}

/** Admin client for server-only writes (uses service role; ignores RLS) */
export function getSupabaseAdmin(): SupabaseClient {
  assertEnv('SUPABASE_URL', url)
  assertEnv('SUPABASE_SERVICE_ROLE_KEY', service)
  return createClient(url, service, { auth: { persistSession: false } })
}

/**
 * Optional quick sanity helper you can call temporarily while debugging:
 *   import { debugSupabaseEnv } from '@/lib/supabaseServer'
 *   debugSupabaseEnv()
 */
export function debugSupabaseEnv() {
  // Do NOT log secrets; only log presence booleans.
  // Remove or comment this out after confirming.
  // eslint-disable-next-line no-console
  console.log('[supabase env]',
    'url:', !!url,
    'anon:', !!anon,
    'service_role_key:', !!service
  )
}