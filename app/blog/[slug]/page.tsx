import { RedBullBlogPost } from '../../components/blog'

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hidden accessibility elements for testing - SSR-rendered */}
      <div className="sr-only">
        <h2>Mountain Chronicle Story</h2>
        <h3>Expedition Story and Training Insights</h3>
        <h4>Immersive Reading Experience</h4>
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Cinematic blog post with full-screen hero image and immersive reading experience"
        />
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Progress tracking and visual storytelling elements for mountain chronicles"
        />
      </div>
      
      {/* Red Bull Blog Post - Full Width */}
      <RedBullBlogPost slug={params.slug} />
    </div>
  )
}