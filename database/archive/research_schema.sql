-- Summit Chronicles Research Schema

CREATE TABLE IF NOT EXISTS research_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    relevance_score FLOAT, -- 0 to 1
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_research_topics_status ON research_topics(status);
CREATE INDEX IF NOT EXISTS idx_research_topics_created ON research_topics(created_at DESC);
