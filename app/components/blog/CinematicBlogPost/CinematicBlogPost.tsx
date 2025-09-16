'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Eye, 
  Share2, 
  BookOpen, 
  User, 
  MapPin, 
  Mountain,
  TrendingUp,
  Award,
  ChevronUp
} from 'lucide-react'
import type { Post } from '../../../lib/sanity/types'

interface BlogPostData {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  content: string
  views?: string
  location?: string
}

interface CinematicBlogPostProps {
  post?: Post
  slug: string
  className?: string
}

export function CinematicBlogPost({ post, slug, className = "" }: CinematicBlogPostProps) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const [readingProgress, setReadingProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Sample blog post data
  const samplePost: BlogPostData = {
    title: 'The Mental Game: Preparing Mind and Body for Everest 2027',
    excerpt: 'Every summit begins in the mind. Discover the psychological preparation behind the world\'s ultimate mountaineering challenge, where mental fortitude matters as much as physical strength.',
    author: 'Sunith Kumar',
    date: 'December 15, 2024',
    readTime: '12 min read',
    category: 'Mental Preparation',
    image: '/stories/everest-prep.jpg',
    views: '2.1K',
    location: 'Training Grounds, California',
    content: `
      <p>The statistics are sobering: only 29% of climbers who attempt Mount Everest actually reach the summit. Of those who turn back or fail, the majority cite mental challenges rather than physical limitations. This realization fundamentally changed how I approach my preparation for the 2027 expedition.</p>

      <h2>The Psychology of Extreme Altitude</h2>
      <p>At 8,849 meters above sea level, Everest exists in what mountaineers call the "Death Zone" — altitudes where the human body literally begins to die. But before your body fails, your mind is tested in ways most people never experience.</p>
      
      <blockquote>"The mountain doesn't care about your plan — but your preparation does. Mental preparation isn't just helpful; it's the difference between life and death."</blockquote>

      <p>During my preparation, I've discovered that mental training requires the same systematic approach I apply to physical conditioning. It's not enough to simply "think positive" — you need structured psychological preparation.</p>

      <h2>Visualization and Mental Rehearsal</h2>
      <p>Every day, I spend 30 minutes visualizing the Everest climb in intricate detail. I mentally rehearse everything from the technical challenges of the Khumbu Icefall to the psychological pressure of the final summit push.</p>

      <p>This isn't daydreaming — it's systematic mental training. Sports psychology research shows that mental rehearsal activates the same neural pathways as physical practice. When I'm actually on the mountain facing these challenges, my brain will recognize the situations and respond with practiced calm.</p>

      <h2>Stress Inoculation Training</h2>
      <p>One of the most valuable aspects of my training has been deliberately exposing myself to controlled stress and discomfort. This includes:</p>
      
      <ul>
        <li>Cold exposure training in near-freezing conditions</li>
        <li>Altitude simulation in hypoxic chambers</li>
        <li>Extended periods of physical discomfort during long training sessions</li>
        <li>Decision-making exercises under fatigue and pressure</li>
      </ul>

      <p>The goal isn't to eliminate fear or discomfort — it's to maintain clear thinking and good judgment when these feelings arise.</p>

      <h2>The Power of Process Focus</h2>
      <p>Perhaps the most important mental skill I've developed is process focus. Instead of fixating on the summit (outcome), I've learned to concentrate on the immediate task at hand (process).</p>
      
      <p>On Everest, this means focusing on the next breath, the next step, the next anchor point — not the 8,000 meters still to climb. This approach prevents the overwhelming feeling that can lead to panic or poor decisions.</p>

      <h2>Data-Driven Mental Training</h2>
      <p>Just as I track physical metrics like heart rate and VO2 max, I've begun quantifying my mental training. I use apps to monitor meditation consistency, stress response patterns, and decision-making speed under pressure.</p>

      <p>This data reveals patterns I wouldn't notice otherwise. For example, my stress response improves significantly after just 10 minutes of morning meditation, but shows diminishing returns beyond 20 minutes. This allows me to optimize my mental training time.</p>

      <h2>The Summit Mindset</h2>
      <p>Ultimately, preparing for Everest has taught me that the summit isn't just a physical destination — it's a mental state. It's the culmination of thousands of small decisions, consistent preparation, and the ability to perform under pressure.</p>

      <p>Whether you're climbing the world's highest peak or pursuing any challenging goal, the principles remain the same: systematic preparation, process focus, and the mental resilience to continue when everything tells you to stop.</p>

      <p>The mountain will test everything I've learned. In 487 days, I'll find out if my preparation was enough.</p>
    `
  }

  const displayPost = post ? {
    title: post.title,
    excerpt: post.excerpt || '',
    author: post.author?.name || 'Sunith Kumar',
    date: new Date(post.publishedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    readTime: `${post.readTime || 12} min read`,
    category: post.categories?.[0]?.title || 'Story',
    image: post.mainImage ? '/stories/everest-prep.jpg' : '/stories/everest-prep.jpg',
    views: '2.1K',
    location: 'Training Grounds, California',
    content: samplePost.content // TODO: Convert portable text to HTML
  } : samplePost

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental preparation':
      case 'mental':
        return TrendingUp
      case 'expedition':
      case 'adventure':
        return Mountain
      case 'training':
        return Award
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental preparation':
      case 'mental':
        return 'bg-purple-100 text-purple-800'
      case 'expedition':
      case 'adventure':
        return 'bg-blue-100 text-blue-800'
      case 'training':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  // Reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setReadingProgress(progress)
      setShowScrollTop(scrolled > 1000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const CategoryIcon = getCategoryIcon(displayPost.category)

  return (
    <article ref={containerRef} className={`min-h-screen ${className}`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-100">
        <div 
          className="h-full bg-summit-gold transition-all duration-300"
          style={{ width: `${readingProgress * 100}%` }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-end overflow-hidden"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={displayPost.image}
            alt={displayPost.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-8 left-8 z-20">
          <Link 
            href="/blog"
            className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/60 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Stories</span>
          </Link>
        </div>

        {/* Article Stats */}
        <div className="absolute top-8 right-8 flex space-x-3 z-20">
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            <Eye className="w-4 h-4" />
            <span>{displayPost.views}</span>
          </div>
          <button className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm hover:bg-black/60 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full p-8 md:p-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(displayPost.category)}`}>
              <CategoryIcon className="w-4 h-4 mr-2" />
              {displayPost.category}
            </div>

            <h1 className="text-4xl md:text-6xl font-light text-white leading-tight">
              {displayPost.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-3xl">
              {displayPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 pt-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{displayPost.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{displayPost.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{displayPost.readTime}</span>
              </div>
              {displayPost.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{displayPost.location}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Article Content */}
      <section className="relative bg-white">
        <div className="max-w-4xl mx-auto px-8 md:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="prose prose-lg md:prose-xl prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: displayPost.content }}
          />

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{displayPost.author}</h3>
                <p className="text-slate-600 leading-relaxed">
                  Mountaineer and systematic athlete pursuing the Seven Summits challenge. 
                  Currently preparing for Mount Everest in Spring 2027 through data-driven 
                  training and methodical preparation approaches.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Enjoyed this story?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get exclusive expedition updates and training insights delivered 
              directly to your inbox every week.
            </p>
            <Link 
              href="/newsletter"
              className="inline-flex items-center gap-3 bg-summit-gold text-spa-charcoal px-6 py-3 rounded-xl font-medium hover:bg-yellow-500 transition-colors duration-300"
            >
              <BookOpen className="w-5 h-5" />
              <span>Subscribe to Weekly Updates</span>
            </Link>
          </motion.div>

          {/* Back to Blog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">More Mountain Chronicles</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors duration-300 z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </article>
  )
}