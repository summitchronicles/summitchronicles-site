// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anon = process.env.SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE

// Create clients lazily inside functions so builds don't crash on missing envs
export function getSupabaseAnon() {
  if (!url || !anon) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env')
  }
  return createClient(url, anon, { auth: { persistSession: false } })
}

export function getSupabaseAdmin() {
  if (!url || !service) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in env')
  }
  return createClient(url, service, { auth: { persistSession: false } })
}