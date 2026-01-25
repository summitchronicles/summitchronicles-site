-- Summit Chronicles Blog Content Management System
-- Database Schema for Supabase

-- Enable RLS (Row Level Security)
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog Posts Table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    featured BOOLEAN DEFAULT false,
    
    -- SEO fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image VARCHAR(500),
    
    -- Content metadata
    author VARCHAR(100) DEFAULT 'Summit Chronicles',
    read_time INTEGER, -- in minutes
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    
    -- Engagement metrics
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Post Tags Table (many-to-many relationship)
CREATE TABLE blog_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280', -- hex color for tag display
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for post-tag relationships
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Blog Post Images/Media Table
CREATE TABLE blog_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text TEXT,
    caption TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Categories Table (for better management)
CREATE TABLE blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#D97706', -- hex color for category
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Post Comments (for future use)
CREATE TABLE blog_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- for nested comments
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (for future authentication)
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Training', 'training', 'Physical preparation and fitness for mountaineering', '#10B981', 1),
('Expeditions', 'expeditions', 'Stories and lessons from Seven Summits adventures', '#3B82F6', 2),
('Gear', 'gear', 'Equipment reviews and recommendations', '#F59E0B', 3),
('Mental', 'mental', 'Psychology and mental preparation for climbing', '#8B5CF6', 4),
('Nutrition', 'nutrition', 'Fueling strategies for high altitude performance', '#EF4444', 5),
('Recovery', 'recovery', 'Rest and recovery techniques for climbers', '#06B6D4', 6);

-- Insert some default tags
INSERT INTO blog_tags (name, slug, color) VALUES
('Altitude', 'altitude', '#3B82F6'),
('Seven Summits', 'seven-summits', '#D97706'),
('Preparation', 'preparation', '#10B981'),
('Lessons', 'lessons', '#8B5CF6'),
('Physiology', 'physiology', '#EF4444'),
('Mental Training', 'mental-training', '#F59E0B'),
('Gear Review', 'gear-review', '#06B6D4'),
('Kilimanjaro', 'kilimanjaro', '#84CC16'),
('Ultralight', 'ultralight', '#F97316'),
('Safety', 'safety', '#DC2626');

-- Create a view for published posts with all related data
CREATE OR REPLACE VIEW published_blog_posts AS
SELECT 
    bp.*,
    bc.color as category_color,
    ARRAY_AGG(DISTINCT bt.name) as tags,
    ARRAY_AGG(DISTINCT bt.slug) as tag_slugs,
    bm.file_path as featured_image
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category = bc.name
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
LEFT JOIN blog_media bm ON bp.id = bm.post_id AND bm.is_featured = true
WHERE bp.status = 'published' AND bp.published_at <= NOW()
GROUP BY bp.id, bc.color, bm.file_path
ORDER BY bp.published_at DESC;