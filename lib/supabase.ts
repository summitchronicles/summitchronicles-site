import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our knowledge base
export interface KnowledgeEntry {
  id: string
  content: string
  category: 'expedition' | 'training' | 'gear' | 'mental' | 'nutrition' | 'recovery'
  source: string
  embedding: number[]
  metadata: {
    summit?: string
    difficulty?: string
    tags?: string[]
  }
  created_at: string
}

// Vector similarity search function
export async function searchSimilarContent(
  queryEmbedding: number[],
  matchThreshold: number = 0.7,
  matchCount: number = 5
): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabase.rpc('match_knowledge', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount
  })

  if (error) {
    console.error('Error searching similar content:', error)
    return []
  }

  return data || []
}

// Insert new knowledge entry
export async function insertKnowledge(
  content: string,
  category: KnowledgeEntry['category'],
  source: string,
  embedding: number[],
  metadata: KnowledgeEntry['metadata'] = {}
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('knowledge_base')
    .insert({
      content,
      category,
      source,
      embedding,
      metadata
    })

  if (error) {
    console.error('Error inserting knowledge:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}