-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create knowledge_base table for storing mountaineering knowledge
create table public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  category text not null check (category in ('expedition', 'training', 'gear', 'mental', 'nutrition', 'recovery')),
  source text not null,
  embedding vector(768), -- nomic-embed-text produces 768-dimensional vectors
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index knowledge_base_embedding_idx on public.knowledge_base using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create index knowledge_base_category_idx on public.knowledge_base (category);
create index knowledge_base_created_at_idx on public.knowledge_base (created_at desc);

-- Create a function to search for similar content using cosine similarity
create or replace function match_knowledge(
  query_embedding vector(768),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  category text,
  source text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.category,
    knowledge_base.source,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by knowledge_base.embedding <=> query_embedding
  limit match_count;
$$;

-- Enable Row Level Security
alter table public.knowledge_base enable row level security;

-- Create policy to allow public read access
create policy "Public read access" on public.knowledge_base
for select using (true);

-- Create policy to allow authenticated insert (for adding knowledge)
create policy "Authenticated insert" on public.knowledge_base
for insert with check (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_knowledge_base_updated_at
  before update on public.knowledge_base
  for each row execute procedure public.handle_updated_at();

-- Insert some sample knowledge entries for testing
-- Note: These will need actual embeddings when we add real content
insert into public.knowledge_base (content, category, source, metadata) values
(
  'Altitude acclimatization is crucial for success on high peaks. The key is gradual ascent - sleep low, climb high during the day. Watch for symptoms of altitude sickness: headaches, nausea, fatigue. Diamox can help but it''s not magic. Listen to your body - summit attempts can wait, but cerebral edema cannot.',
  'expedition',
  'Seven Summits Experience',
  '{"summit": "general", "difficulty": "intermediate", "tags": ["altitude", "acclimatization", "safety"]}'
),
(
  'Essential gear for high-altitude mountaineering: Quality boots (properly broken in), layering system with base layers, insulating layers and shell, reliable headlamp plus backup, emergency shelter. Don''t go cheap on life-critical equipment. Test everything multiple times before expeditions.',
  'gear',
  'Equipment Lessons from Elbrus',
  '{"summit": "Elbrus", "difficulty": "beginner", "tags": ["gear", "equipment", "safety"]}'
),
(
  'Fear is data, not weakness. It kept me alive on dangerous sections of Kilimanjaro and Aconcagua. Three techniques I use: 1) Visualize both success and failure scenarios, 2) Focus on the next immediate step rather than the summit, 3) Remember that every step up from my 40kg hospital bed start is a victory.',
  'mental',
  'Mental Training Philosophy',
  '{"difficulty": "advanced", "tags": ["fear", "mental", "psychology", "motivation"]}'
);