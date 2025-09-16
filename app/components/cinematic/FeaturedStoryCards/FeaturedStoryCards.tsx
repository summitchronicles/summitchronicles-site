'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, MapPin, Mountain, Eye, BookOpen, Award } from 'lucide-react'

interface StoryCard {
  id: string
  title: string
  subtitle: string
  excerpt: string
  location: string
  date: string
  readTime: string
  category: string
  image: string
  slug: string
  featured?: boolean
  stats?: {
    views: string
    likes: string
  }
}

interface FeaturedStoryCardsProps {
  className?: string
}

export function FeaturedStoryCards({ className = "" }: FeaturedStoryCardsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const stories: StoryCard[] = [
    {
      id: 'everest-prep',
      title: 'The Mental Game',
      subtitle: 'Preparing Mind and Body for Everest 2027',
      excerpt: 'Every summit begins in the mind. Discover the psychological preparation behind the world\'s ultimate mountaineering challenge, where mental fortitude matters as much as physical strength.',
      location: 'Training Grounds, California',
      date: 'December 2024',
      readTime: '12 min read',
      category: 'Training',
      image: '/stories/everest-prep.jpg',
      slug: 'everest-mental-preparation-2027',
      featured: true,
      stats: {
        views: '2.1K',
        likes: '156'
      }
    },
    {
      id: 'kilimanjaro',
      title: 'Conquering Kilimanjaro',
      subtitle: 'Lessons from Africa\'s Rooftop',
      excerpt: 'Standing at 5,895 meters above sea level, Kilimanjaro taught me that every step toward a summit is a decision to continue when everything says stop.',
      location: 'Tanzania, Africa',
      date: 'March 2024',
      readTime: '8 min read',
      category: 'Achievement',
      image: '/stories/kilimanjaro.jpg',
      slug: 'kilimanjaro-lessons-from-africas-rooftop',
      stats: {
        views: '3.2K',
        likes: '287'
      }
    },
    {
      id: 'data-driven-training',
      title: 'Analytics in Action',
      subtitle: 'How Data Transforms Athletic Performance',
      excerpt: 'From heart rate variability to altitude acclimatization metrics, discover how systematic data analysis revolutionizes mountaineering preparation and performance optimization.',
      location: 'Various Training Locations',
      date: 'November 2024',
      readTime: '15 min read',
      category: 'Technology',
      image: '/stories/data-training.jpg',
      slug: 'data-driven-mountaineering-performance',
      stats: {
        views: '1.8K',
        likes: '124'
      }
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'training':
        return 'bg-blue-100 text-blue-800'
      case 'achievement':
        return 'bg-summit-gold text-spa-charcoal'
      case 'technology':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Stories from the Summit
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Each expedition holds lessons beyond the summit. Dive deep into the experiences, 
            challenges, and insights that shape the journey toward the Seven Summits.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Featured Story - Large Card */}
          <motion.div
            variants={cardVariants}
            className="lg:row-span-2"
            onMouseEnter={() => setHoveredCard(stories[0].id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Link href={`/blog/${stories[0].slug}`} className="group block">
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={stories[0].image}
                    alt={stories[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Featured Badge */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center space-x-2 bg-summit-gold text-spa-charcoal px-3 py-1 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    <span>Featured Story</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="absolute top-6 right-6 flex space-x-4">
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{stories[0].stats?.views}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="space-y-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(stories[0].category)}`}>
                      {stories[0].category}
                    </div>
                    
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-summit-gold transition-colors duration-300">
                        {stories[0].title}
                      </h3>
                      <p className="text-xl text-summit-gold font-medium mb-4">
                        {stories[0].subtitle}
                      </p>
                      <p className="text-slate-200 text-lg leading-relaxed mb-6">
                        {stories[0].excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{stories[0].location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{stories[0].date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{stories[0].readTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-summit-gold group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-medium">Read Story</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Regular Story Cards */}
          <div className="space-y-8">
            {stories.slice(1).map((story, index) => (
              <motion.div
                key={story.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredCard(story.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link href={`/blog/${story.slug}`} className="group block">
                  <div className="flex gap-6 bg-slate-50 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200">
                    {/* Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="128px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(story.category)}`}>
                          {story.category}
                        </div>
                        {story.stats && (
                          <div className="flex items-center space-x-1 text-slate-400 text-sm">
                            <Eye className="w-4 h-4" />
                            <span>{story.stats.views}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-alpine-blue transition-colors duration-300">
                          {story.title}
                        </h3>
                        <p className="text-lg text-summit-gold font-medium mb-3">
                          {story.subtitle}
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {story.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{story.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{story.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-alpine-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                          <span className="font-medium text-xs">Read More</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Follow my complete journey through detailed expedition reports, training insights, 
            and the lessons learned from every summit attempt.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore All Stories</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Newsletter Subscription Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Never Miss a Summit Story</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Get exclusive expedition updates, training insights, and behind-the-scenes content 
            delivered directly to your inbox every week.
          </p>
          <Link 
            href="/newsletter"
            className="inline-flex items-center gap-2 bg-summit-gold text-spa-charcoal px-6 py-3 rounded-xl font-medium hover:bg-yellow-500 transition-colors duration-300"
          >
            <span>Subscribe to Weekly Updates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}