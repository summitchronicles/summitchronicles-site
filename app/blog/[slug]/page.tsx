import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'

const blogPosts = {
  'training-for-everest': {
    title: 'Training for Everest: A Comprehensive Approach',
    content: `
      Preparing for Mount Everest requires a systematic approach that builds both physical and mental resilience. After months of research and consultation with experienced climbers, I've developed a training program that addresses every aspect of high-altitude mountaineering.

      ## Physical Preparation

      The foundation of Everest training lies in building exceptional cardiovascular endurance. I've structured my weekly training around:

      - **Long-distance hiking**: 4-6 hour sessions with increasing elevation gain
      - **Interval training**: High-intensity workouts to simulate oxygen debt
      - **Strength training**: Focus on functional movements and core stability
      - **Altitude simulation**: Using hypoxic tents and chambers when possible

      ## Mental Training

      Physical preparation is only half the battle. Mental resilience becomes critical when facing extreme conditions at altitude. My approach includes:

      - Visualization techniques for challenging scenarios
      - Meditation and breathing exercises
      - Cold exposure training for psychological adaptation
      - Risk assessment and decision-making practice

      ## Technical Skills Development

      Everest demands technical proficiency in multiple areas:

      - Ice climbing on steep terrain
      - Crevasse rescue techniques
      - High-altitude camping and equipment management
      - Weather pattern recognition and route planning

      The journey continues with each training session building toward the ultimate goal.
    `,
    date: 'March 15, 2024',
    readTime: '8 min read',
    author: 'Sunith Kumar'
  },
  'alpine-climbing-basics': {
    title: 'Alpine Climbing Basics: Essential Skills for Success',
    content: `
      Alpine climbing represents one of mountaineering's purest forms, combining technical skill with endurance and judgment. Whether you're planning your first alpine route or looking to refine your techniques, understanding the fundamentals is crucial.

      ## Route Planning and Assessment

      Successful alpine climbing begins long before you touch rock or ice:

      - Study topographic maps and route descriptions thoroughly
      - Check weather patterns and seasonal conditions
      - Assess your skill level honestly against route demands
      - Plan escape routes and bail-out options

      ## Essential Equipment

      Alpine climbing demands a careful balance between having necessary gear and keeping weight manageable:

      - Lightweight mountaineering boots with crampon compatibility
      - Ice axe and possibly ice tools for technical sections
      - Helmet for rockfall and ice protection
      - Harness and climbing hardware appropriate for the route

      ## Movement Techniques

      Efficient movement in alpine terrain requires:

      - Self-arrest techniques with ice axe
      - Front-pointing and flat-footing on snow and ice
      - Mixed climbing on rock and ice combinations
      - Proper rope management on exposed terrain

      ## Risk Management

      Alpine environments present objective hazards that require constant awareness:

      - Rockfall assessment and timing
      - Avalanche risk evaluation
      - Weather pattern recognition
      - Partner communication and decision-making

      Every alpine route teaches valuable lessons that contribute to mountaineering growth.
    `,
    date: 'March 10, 2024',
    readTime: '6 min read',
    author: 'Sunith Kumar'
  },
  'gear-review-winter-equipment': {
    title: 'Gear Review: Essential Winter Equipment',
    content: `
      Winter mountaineering demands reliable equipment that performs in extreme conditions. After extensive testing in various environments, here's my comprehensive review of essential winter gear.

      ## Insulation Systems

      Layering becomes critical in winter conditions:

      **Base Layer**: Merino wool provides excellent moisture management and odor resistance. I've found 150-200gsm weight ideal for active mountaineering.

      **Insulation Layer**: Down vs. synthetic remains a key decision. Down offers superior warmth-to-weight but fails when wet. Synthetic insulation performs better in damp conditions.

      **Shell Layer**: Hardshell jackets with full zips allow ventilation during active climbing. Look for reinforced high-wear areas.

      ## Footwear Systems

      Winter boots must balance warmth, dryness, and crampon compatibility:

      - Double boots excel in extreme cold
      - Single boots work for moderate conditions and technical climbing
      - Boot selection significantly impacts foot health and climbing performance

      ## Protection and Safety

      Winter conditions amplify standard mountaineering risks:

      - Avalanche safety equipment becomes essential
      - Navigation tools must function in cold temperatures
      - Emergency bivouac gear provides critical safety margins

      ## Testing and Selection

      I test all gear extensively before committing to expeditions:

      - Home freezer tests for basic cold weather performance
      - Local winter climbing for real-world evaluation
      - Gradual system integration to identify compatibility issues

      Reliable gear builds confidence, but skills and judgment remain paramount.
    `,
    date: 'March 5, 2024',
    readTime: '5 min read',
    author: 'Sunith Kumar'
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-slate-600 hover:text-slate-900">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-peak py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Navigation */}
        <Link 
          href="/blog"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <article className="mountain-card overflow-hidden elevation-shadow">
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-slate-600 mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post.readTime}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-slate max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }
                if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
                  const items = paragraph.split('\n- ').filter(item => item.trim())
                  return (
                    <ul key={index} className="space-y-2 mb-6">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-slate-700 leading-relaxed">
                          {item.replace(/^- /, '')}
                        </li>
                      ))}
                    </ul>
                  )
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={index} className="font-semibold text-slate-900 mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  )
                }
                return (
                  <p key={index} className="text-slate-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog"
            className="btn-summit px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>More Posts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}