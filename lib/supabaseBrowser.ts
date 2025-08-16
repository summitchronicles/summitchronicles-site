// lib/supabaseBrowser.ts
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Not fatal for server-only usage; this file is for browser calls later.
  // If you import this without the vars set, it will throw for safety.
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)