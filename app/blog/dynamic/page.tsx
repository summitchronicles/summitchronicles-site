'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Mail, RefreshCw } from 'lucide-react'
import { NewsletterModal } from '../../components/Modal'
import { Header } from '../../components/organisms/Header'
import { Footer } from '../../components/organisms/Footer'
import { getAllPosts } from '@/lib/sanity/client'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author?: {
    name: string
    image?: any
  }
  categories?: Array<{
    title: string
    slug: { current: string }
  }>
  mainImage?: any
}

export default function DynamicBlogPage() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const sanityPosts = await getAllPosts()
      
      if (sanityPosts && sanityPosts.length > 0) {
        setPosts(sanityPosts)
      } else {
        // Fallback to static content if no Sanity posts
        setPosts([
          {
            _id: '1',
            title: 'Training for Everest: A Comprehensive Approach',
            slug: { current: 'training-for-everest' },
            excerpt: 'Preparing for the ultimate climbing challenge requires months of dedicated training and preparation.',
            publishedAt: '2024-03-15T00:00:00Z',
            author: { name: 'Summit Chronicles Team' }
          },
          {
            _id: '2',
            title: 'Alpine Climbing Basics: Essential Skills for Success',
            slug: { current: 'alpine-climbing-basics' },
            excerpt: 'Learn the essential skills needed for successful alpine climbing adventures.',
            publishedAt: '2024-03-10T00:00:00Z',
            author: { name: 'Summit Chronicles Team' }
          },
          {
            _id: '3',
            title: 'Gear Review: Essential Winter Equipment',
            slug: { current: 'gear-review-winter-equipment' },
            excerpt: 'A comprehensive review of essential winter climbing gear and equipment.',
            publishedAt: '2024-03-05T00:00:00Z',
            author: { name: 'Summit Chronicles Team' }
          }
        ])
      }
    } catch (err) {
      console.error('Error loading posts:', err)
      setError('Failed to load blog posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (excerpt: string) => {
    const words = excerpt.split(' ').length
    const readTime = Math.ceil(words / 200) // Assume 200 words per minute
    return `${readTime} min read`
  }

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        <div className="min-h-screen gradient-peak py-8">
          <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-slate-900">Mountain Journal</h1>
              <button
                onClick={loadPosts}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                title="Refresh posts"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Stories, insights, and lessons learned on the path to extraordinary peaks.
              {posts.length > 3 && ' Now featuring dynamic content from our CMS.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadPosts}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mountain-card p-8 h-full elevation-shadow animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-6"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-4 bg-slate-200 rounded w-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {posts.map((post) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post.slug.current}`}
                  className="group"
                >
                  <article className="mountain-card p-8 h-full elevation-shadow">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{calculateReadTime(post.excerpt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {post.author && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500">By {post.author.name}</p>
                      </div>
                    )}

                    {post.categories && post.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category.slug.current}
                            className="px-2 py-1 bg-alpine-blue/10 text-alpine-blue text-xs rounded-full"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Newsletter CTA */}
            <div className="mountain-card p-8 elevation-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Never Miss an Update</h3>
              <p className="text-slate-600 mb-6">
                Get exclusive training insights, expedition updates, and gear reviews delivered weekly.
              </p>
              <button 
                onClick={() => setShowNewsletter(true)}
                className="btn-summit px-6 py-3"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe Now</span>
              </button>
            </div>

            {/* CMS Integration Status */}
            <div className="mountain-card p-8 elevation-shadow text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {posts.length > 3 ? 'Dynamic Content Loaded' : 'CMS Integration Ready'}
              </h3>
              <p className="text-slate-600 mb-6">
                {posts.length > 3 
                  ? `Showing ${posts.length} posts from Sanity CMS with real-time updates.`
                  : 'Content management system is configured and ready for dynamic blog posts.'
                }
              </p>
              <Link 
                href="/blog"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-slate-700 hover:text-slate-900 transition-all duration-300"
              >
                <span>View Static Blog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Newsletter Modal */}
          <NewsletterModal 
            isOpen={showNewsletter}
            onClose={() => setShowNewsletter(false)}
          />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}