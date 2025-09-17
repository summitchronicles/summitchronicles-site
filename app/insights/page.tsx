'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Mail, Mountain, Target, Heart } from 'lucide-react'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import { H1, H2, H3, Body, BodyLarge } from '../components/atoms/Typography'
import { Button } from '../components/atoms/Button'
import { Card } from '../components/molecules/Card'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { NewsletterModal } from '../components/Modal'

export default function InsightsPage() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  
  const insights = [
    {
      slug: 'week-16-everest-training-intensity',
      title: 'Week 16: Why I Nearly Quit My Everest Training',
      excerpt: 'Three weeks of poor sleep, declining performance, and questioning everything. Here\'s what I learned about overtraining and how data saved my expedition dreams.',
      date: 'December 20, 2024',
      readTime: '8 min read',
      category: 'Training Diary',
      featured: true
    },
    {
      slug: 'my-first-glacier-rescue-course',
      title: 'My First Glacier Rescue Course: What They Don\'t Tell You',
      excerpt: 'Hanging upside down in a crevasse simulator taught me more than any textbook. Here are the real lessons from learning to rescue my future teammates.',
      date: 'December 15, 2024',
      readTime: '6 min read',
      category: 'Skills Development'
    },
    {
      slug: 'gear-that-failed-me-mount-shasta',
      title: 'Gear That Failed Me on Mount Shasta (And What I Learned)',
      excerpt: 'My "waterproof" gloves weren\'t, my backup headlamp died, and my nutrition strategy was terrible. Expensive lessons from a winter ascent.',
      date: 'December 10, 2024',
      readTime: '7 min read',
      category: 'Gear Insights'
    },
    {
      slug: 'training-data-doesnt-lie',
      title: 'Why Training Data Doesn\'t Lie (But I Do)',
      excerpt: 'I told myself I was pushing hard in training. Then I looked at my actual power output and heart rate data. The numbers revealed uncomfortable truths.',
      date: 'December 5, 2024',
      readTime: '5 min read',
      category: 'Training Analysis'
    },
    {
      slug: 'mental-game-altitude-sickness',
      title: 'The Mental Game When Altitude Sickness Hits',
      excerpt: 'At 14,000 feet with a pounding headache and nausea, your mind becomes your worst enemy. Here\'s how I\'ve learned to manage the psychological challenge.',
      date: 'November 30, 2024',
      readTime: '6 min read',
      category: 'Mental Training'
    },
    {
      slug: 'why-i-document-everything',
      title: 'Why I Document Everything (Even My Failures)',
      excerpt: 'Every failed summit attempt, every gear mistake, every training session that went wrong. Here\'s why I share the unglamorous side of mountaineering.',
      date: 'November 25, 2024',
      readTime: '4 min read',
      category: 'Philosophy'
    }
  ]

  const categories = [
    { name: 'All', count: insights.length },
    { name: 'Training Diary', count: 2 },
    { name: 'Gear Insights', count: 1 },
    { name: 'Skills Development', count: 1 },
    { name: 'Mental Training', count: 1 },
    { name: 'Philosophy', count: 1 }
  ]

  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredInsights = selectedCategory === 'All' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory)

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
      {/* Hero Section */}
      <section className="py-20 gradient-peak text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <H1 className="text-4xl md:text-6xl font-bold">My Climbing Insights</H1>
          <BodyLarge className="text-white/90 max-w-2xl mx-auto">
            Real stories from my Seven Summits journey. The victories, failures, and everything 
            I've learned along the way to Mount Everest.
          </BodyLarge>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-alpine-blue text-white shadow-spa-soft'
                  : 'bg-spa-stone/10 text-spa-charcoal hover:bg-spa-stone/20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {selectedCategory === 'All' && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <H2>Latest Story</H2>
              <Body className="text-spa-charcoal/70">My most recent insights from the mountain</Body>
            </div>
            
            <Card variant="premium" padding="lg" className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <StatusBadge variant="warning">Featured</StatusBadge>
                    <span className="text-sm text-spa-charcoal/60">{insights[0].category}</span>
                  </div>
                  <H2 className="text-2xl leading-tight">{insights[0].title}</H2>
                  <Body className="text-spa-charcoal/80 leading-relaxed">
                    {insights[0].excerpt}
                  </Body>
                  <div className="flex items-center space-x-4 text-sm text-spa-charcoal/60">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{insights[0].date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{insights[0].readTime}</span>
                    </div>
                  </div>
                  <Button variant="primary" asChild>
                    <Link href={`/insights/${insights[0].slug}`}>
                      Read My Story <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-alpine-blue to-summit-gold rounded-xl p-8 text-white text-center">
                  <Mountain className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <H3 className="text-white mb-2">Honest Reflections</H3>
                  <Body className="text-white/90 text-sm">
                    No sugar-coating, no hero narratives. Just real experiences 
                    from someone learning to climb big mountains.
                  </Body>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Insights Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredInsights.slice(selectedCategory === 'All' ? 1 : 0).map((insight) => (
            <Link 
              key={insight.slug} 
              href={`/insights/${insight.slug}`}
              className="group"
            >
              <Card variant="elevated" padding="lg" className="h-full group-hover:shadow-spa-medium transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge variant="default">{insight.category}</StatusBadge>
                    <ArrowRight className="w-4 h-4 text-spa-charcoal/40 group-hover:text-alpine-blue group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <H3 className="text-lg leading-tight group-hover:text-alpine-blue transition-colors">
                    {insight.title}
                  </H3>
                  
                  <Body className="text-spa-charcoal/80 text-sm leading-relaxed">
                    {insight.excerpt}
                  </Body>
                  
                  <div className="flex items-center space-x-4 text-xs text-spa-charcoal/60 pt-2 border-t border-spa-stone/20">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{insight.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{insight.readTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Newsletter CTA */}
          <Card variant="elevated" padding="lg" className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-3">
              <H3>Get My Training Updates</H3>
              <Body className="text-spa-charcoal/80">
                Weekly insights from my Everest training, including the struggles, 
                breakthroughs, and data that drives every decision.
              </Body>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowNewsletter(true)}
              className="w-full"
            >
              <Mail className="w-4 h-4" />
              Subscribe to Updates
            </Button>
          </Card>

          {/* Follow Journey CTA */}
          <Card variant="elevated" padding="lg" className="text-center space-y-6">
            <div className="w-16 h-16 bg-summit-gold/10 rounded-2xl flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-summit-gold" />
            </div>
            <div className="space-y-3">
              <H3>Follow My Everest Training</H3>
              <Body className="text-spa-charcoal/80">
                Real-time data from my preparation for the world's highest mountain. 
                Every workout, every metric, every lesson learned.
              </Body>
            </div>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/training">
                <Mountain className="w-4 h-4" />
                See Live Training Data
              </Link>
            </Button>
          </Card>
        </div>

        {/* Personal Note */}
        <div className="mt-16 text-center">
          <Card variant="premium" padding="lg" className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <Heart className="w-8 h-8 text-red-500 mx-auto" />
              <H3>A Personal Note</H3>
              <Body className="text-spa-charcoal/80 text-sm leading-relaxed">
                These stories aren't about being a hero or selling you something. They're about 
                sharing what I've learned so others can learn from my mistakes and maybe avoid 
                some expensive lessons. Every failure here has made me a better climber and a better person.
              </Body>
              <div className="text-sm text-spa-charcoal/60 italic">
                — Sunith Kumar
              </div>
            </div>
          </Card>
        </div>

        {/* Newsletter Modal */}
        <NewsletterModal 
          isOpen={showNewsletter}
          onClose={() => setShowNewsletter(false)}
        />
      </div>
      </main>

      <Footer />
    </div>
  )
}