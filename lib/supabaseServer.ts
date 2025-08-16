// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE

if (!url || !anon) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env')
}

// Read-only client that respects Row Level Security (safe for server reads)
export const supabaseAnon = createClient(url, anon, {
  auth: { persistSession: false }
})

// Admin client for writes/ingestion (ignores RLS). Keep on server only.
export const supabaseAdmin = service
  ? createClient(url, service, { auth: { persistSession: false } })
  : null