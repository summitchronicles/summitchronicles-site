'use client'

import { useState, useEffect } from 'react'
import { Header } from '../../components/organisms/Header'
import { Footer } from '../../components/organisms/Footer'
import { sanityClient, queries } from '../../../lib/sanity/client'
import { motion } from 'framer-motion'
import { Calendar, User, Eye, Edit3 } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  author: {
    name: string
    avatar?: any
  }
  categories: Array<{
    title: string
    slug: { current: string }
    color: string
  }>
  featuredImage?: any
  tags: string[]
  isFeatured: boolean
}

export default function CMSBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await sanityClient.fetch(queries.allPosts)
        setPosts(data || [])
      } catch (err) {
        setError('Failed to fetch blog posts')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-spa-stone flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-spa-stone/20 rounded-xl"></div>
                    <div className="h-4 bg-spa-stone/20 rounded"></div>
                    <div className="h-3 bg-spa-stone/20 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-spa-stone flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12 text-center">
            <h1 className="text-3xl font-light text-spa-charcoal mb-4">Content Management System</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Make sure Sanity is configured and the project is set up correctly.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-light text-spa-charcoal mb-4">
                Dynamic Blog System
              </h1>
              <p className="text-xl text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
                Content powered by Sanity CMS with real-time updates and structured data.
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
                  <Edit3 className="w-4 h-4 text-alpine-blue" />
                  <span className="text-sm font-medium">{posts.length} Posts</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">Live Data</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-light text-spa-charcoal mb-4">No Blog Posts Yet</h2>
                <p className="text-spa-charcoal/70 mb-6">
                  Create your first blog post in the Sanity Studio to see it appear here.
                </p>
                <Link 
                  href="/studio" 
                  className="inline-flex items-center gap-2 bg-alpine-blue text-white px-6 py-3 rounded-lg hover:bg-alpine-blue/90 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Open Sanity Studio
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    className="bg-white rounded-xl border border-spa-stone/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    {post.featuredImage && (
                      <div className="h-48 bg-spa-stone/10 flex items-center justify-center">
                        <span className="text-spa-charcoal/40">Featured Image</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {post.isFeatured && (
                        <div className="inline-flex items-center gap-1 bg-summit-gold/10 text-summit-gold px-2 py-1 rounded-full text-xs font-medium mb-3">
                          ⭐ Featured
                        </div>
                      )}
                      
                      <h2 className="text-xl font-medium text-spa-charcoal mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-spa-charcoal/60 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{post.author?.name || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category) => (
                            <span
                              key={category.slug.current}
                              className="px-2 py-1 bg-spa-stone/20 text-spa-charcoal/70 rounded text-xs"
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-alpine-blue/10 text-alpine-blue rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="inline-flex items-center gap-2 text-alpine-blue hover:text-alpine-blue/80 text-sm font-medium"
                      >
                        Read More
                        <Eye className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CMS Info Section */}
        <section className="py-16 bg-spa-cloud/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-light text-spa-charcoal mb-6">
                Powered by Sanity CMS
              </h2>
              <p className="text-spa-charcoal/80 leading-relaxed mb-8">
                This page demonstrates dynamic content rendering using Sanity as a headless CMS. 
                Content is fetched in real-time and automatically updates when changes are made in the studio.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-alpine-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Edit3 className="w-6 h-6 text-alpine-blue" />
                  </div>
                  <h3 className="font-medium text-spa-charcoal mb-2">Real-time Editing</h3>
                  <p className="text-sm text-spa-charcoal/70">Content updates automatically</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-spa-charcoal mb-2">Live Preview</h3>
                  <p className="text-sm text-spa-charcoal/70">See changes instantly</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-summit-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-summit-gold" />
                  </div>
                  <h3 className="font-medium text-spa-charcoal mb-2">Structured Data</h3>
                  <p className="text-sm text-spa-charcoal/70">Rich content management</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}