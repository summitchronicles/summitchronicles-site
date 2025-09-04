# Analytics Setup Instructions

## 1. Database Schema Setup

To set up the analytics database schema in your Supabase project:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to your project: `nvoljnojiondyjhxwkqq`
3. Go to SQL Editor
4. Copy and execute the contents of `analytics_schema.sql`

## 2. Required RPC Functions

The analytics system needs these Supabase RPC functions. Add them to your SQL Editor:

```sql
-- Function to get visitor statistics
CREATE OR REPLACE FUNCTION get_visitor_stats(time_interval text DEFAULT '24 hours')
RETURNS TABLE (
  total_visitors bigint,
  total_sessions bigint,
  avg_session_duration numeric,
  bounce_rate numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT fingerprint)::bigint as total_visitors,
    COUNT(*)::bigint as total_sessions,
    AVG(session_duration)::numeric as avg_session_duration,
    AVG(CASE WHEN is_bounce THEN 1 ELSE 0 END)::numeric as bounce_rate
  FROM analytics_sessions 
  WHERE created_at >= NOW() - INTERVAL time_interval;
END;
$$ LANGUAGE plpgsql;

-- Function to get AI statistics
CREATE OR REPLACE FUNCTION get_ai_stats(time_interval text DEFAULT '24 hours')
RETURNS TABLE (
  total_queries bigint,
  avg_response_time numeric,
  success_rate numeric,
  avg_user_rating numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_queries,
    AVG(response_time)::numeric as avg_response_time,
    AVG(CASE WHEN error_occurred THEN 0 ELSE 1 END)::numeric as success_rate,
    AVG(user_rating)::numeric as avg_user_rating
  FROM analytics_ai_interactions 
  WHERE created_at >= NOW() - INTERVAL time_interval;
END;
$$ LANGUAGE plpgsql;

-- Function to get content statistics
CREATE OR REPLACE FUNCTION get_content_stats(time_interval text DEFAULT '24 hours')
RETURNS TABLE (
  total_page_views bigint,
  unique_pages bigint,
  avg_time_on_page numeric,
  top_page text
) AS $$
BEGIN
  RETURN QUERY
  WITH page_stats AS (
    SELECT 
      page_url,
      COUNT(*) as views,
      AVG(time_on_page) as avg_time
    FROM analytics_page_views 
    WHERE created_at >= NOW() - INTERVAL time_interval
    GROUP BY page_url
  )
  SELECT 
    SUM(views)::bigint as total_page_views,
    COUNT(*)::bigint as unique_pages,
    AVG(avg_time)::numeric as avg_time_on_page,
    (SELECT page_url FROM page_stats ORDER BY views DESC LIMIT 1) as top_page
  FROM page_stats;
END;
$$ LANGUAGE plpgsql;
```

## 3. Test the Setup

1. Visit your site: http://localhost:3001
2. Navigate through a few pages to generate analytics data
3. Ask a few questions on the `/ask` page
4. Check the analytics dashboard: http://localhost:3001/analytics
5. View training data: http://localhost:3001/training-analytics

## 4. Production Deployment

When you're ready to deploy:

1. Make sure the analytics schema is set up in your production Supabase
2. Deploy your site with the new analytics features
3. The system will automatically start collecting anonymous visitor data

## 5. Features Available

### Analytics Dashboard (`/analytics`)
- **Overview**: Key metrics and trends
- **Visitors**: Geographic data, device breakdown, traffic sources  
- **AI Usage**: Popular topics, response times, user satisfaction
- **Content**: Page performance, engagement metrics
- **Real-time**: Active users, live activity feed

### Training Data Dashboard (`/training-analytics`)
- **Running**: Monthly distance, time correlation, pace improvements
- **Hiking**: Elevation gain, distance progress, session tracking
- **Strength**: Weight lifted, session count, progression charts
- **Overview**: Training distribution and future projections

Both dashboards include:
- Interactive charts with real data visualization
- Monthly trend analysis  
- Performance metrics
- Future goal projections
- Responsive design for all devices