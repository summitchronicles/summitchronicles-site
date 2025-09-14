'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Mail } from 'lucide-react'
import { NewsletterModal } from '../components/Modal'

export default function BlogPage() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  const posts = [
    {
      slug: 'training-for-everest',
      title: 'Training for Everest: A Comprehensive Approach',
      excerpt: 'Preparing for the ultimate climbing challenge requires months of dedicated training and preparation.',
      date: 'March 15, 2024',
      readTime: '8 min read'
    },
    {
      slug: 'alpine-climbing-basics',
      title: 'Alpine Climbing Basics: Essential Skills for Success',
      excerpt: 'Learn the essential skills needed for successful alpine climbing adventures.',
      date: 'March 10, 2024',
      readTime: '6 min read'
    },
    {
      slug: 'gear-review-winter-equipment',
      title: 'Gear Review: Essential Winter Equipment',
      excerpt: 'A comprehensive review of essential winter climbing gear and equipment.',
      date: 'March 5, 2024',
      readTime: '5 min read'
    }
  ]

  return (
    <div className="min-h-screen gradient-peak py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Mountain Journal</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stories, insights, and lessons learned on the path to extraordinary peaks.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
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
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
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

          {/* More Stories Coming */}
          <div className="mountain-card p-8 elevation-shadow text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">More Stories Coming</h3>
            <p className="text-slate-600 mb-6">
              Following the incremental rebuild approach, more journal entries and insights will be added regularly.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-slate-700 hover:text-slate-900 transition-all duration-300"
            >
              <span>Back to Home</span>
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
  )
}