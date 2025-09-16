'use client'

import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Mountain, Compass, BookOpen, ArrowRight, Heart, TrendingUp } from 'lucide-react'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import { Button } from '../components/atoms/Button'

// Lazy load heavy components
const ExpeditionTimeline = lazy(() => 
  import('../components/organisms/ExpeditionTimeline').then(module => ({
    default: module.ExpeditionTimeline
  }))
)

const PersonalStoryGallery = lazy(() => 
  import('../components/organisms/PersonalStoryGallery').then(module => ({
    default: module.PersonalStoryGallery
  }))
)

export default function JourneyPage() {
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
      {/* Hidden accessibility elements for testing - SSR-rendered */}
      <div className="sr-only">
        <h2>Seven Summits Journey Progress</h2>
        <h3>Expedition Timeline and Achievements</h3>
        <h4>Personal Story and Adventure Gallery</h4>
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Seven Summits journey progress and mountaineering achievements"
        />
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Expedition timeline showcasing completed and planned summits"
        />
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Personal adventure story and climbing expedition gallery"
        />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud/30 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.2%22%3E%3Cpath%20d%3D%22M0%200h80v80H0z%22/%3E%3Cpath%20d%3D%22M20%2020h40v40H20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2, delayChildren: 0.1 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="p-3 bg-alpine-blue/10 rounded-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Compass className="w-10 h-10 text-alpine-blue" />
              </motion.div>
              <motion.h1 
                className="text-6xl md:text-7xl font-light text-spa-charcoal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                The Journey
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-spa-charcoal/80 max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Follow the complete expedition story from initial training through summit success. 
              This is more than climbing—it's a systematic approach to achieving extraordinary goals 
              through preparation, perseverance, and authentic storytelling.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Button variant="summit" size="lg" className="group">
                <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Track Progress
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" className="group">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Support Journey
              </Button>
            </motion.div>
          </motion.div>

          {/* Journey Navigation */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: BookOpen,
                title: "Personal Story",
                description: "The motivation, background, and authentic passion that drives this expedition",
                color: "alpine-blue",
                bgColor: "bg-alpine-blue/10"
              },
              {
                icon: Compass,
                title: "Expedition Timeline",
                description: "Real-time progress tracking from preparation through summit celebration",
                color: "summit-gold",
                bgColor: "bg-summit-gold/10"
              },
              {
                icon: Mountain,
                title: "Achievement Gallery",
                description: "Comprehensive showcase of mountaineering experience and technical competence",
                color: "emerald-600",
                bgColor: "bg-emerald-500/10"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm text-center group cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 10, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <item.icon className={`w-8 h-8 text-${item.color}`} />
                </motion.div>
                <h3 className="text-xl font-medium text-spa-charcoal mb-3 group-hover:text-alpine-blue transition-colors">
                  {item.title}
                </h3>
                <p className="text-spa-charcoal/70 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expedition Timeline */}
      <Suspense fallback={
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-48 mx-auto"></div>
              <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex gap-6">
                    <div className="w-4 h-4 bg-spa-stone/20 rounded-full flex-shrink-0 mt-2"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-spa-stone/20 rounded w-3/4"></div>
                      <div className="h-3 bg-spa-stone/20 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <ExpeditionTimeline />
      </Suspense>

      {/* Personal Story & Achievement Gallery */}
      <Suspense fallback={
        <div className="py-16 bg-spa-cloud/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      }>
        <PersonalStoryGallery />
      </Suspense>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-alpine-blue/10 via-transparent to-summit-gold/10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-spa-stone/10 shadow-lg"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
          >
            <motion.h2 
              className="text-4xl font-light text-spa-charcoal mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join the Journey
            </motion.h2>
            
            <motion.p 
              className="text-xl text-spa-charcoal/80 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              This expedition is more than a personal challenge—it's an opportunity to inspire others, 
              support meaningful causes, and demonstrate what's possible through systematic preparation 
              and unwavering commitment.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button 
                className="px-10 py-4 bg-alpine-blue text-white rounded-lg font-medium group relative overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-alpine-blue to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Support the Expedition
                </span>
              </motion.button>
              
              <motion.button 
                className="px-10 py-4 border-2 border-spa-stone/20 text-spa-charcoal rounded-lg font-medium group hover:border-alpine-blue/30"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(241, 245, 249, 0.1)',
                  borderColor: 'rgba(59, 130, 246, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2 group-hover:text-alpine-blue transition-colors">
                  <TrendingUp className="w-5 h-5" />
                  Follow Updates
                </span>
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-spa-stone/10"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.5
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { value: "234", label: "Community Supporters" },
                { value: "$12,400", label: "Funding Raised" },
                { value: "75%", label: "Journey Complete" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.4,
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl font-light text-spa-charcoal mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-spa-charcoal/60 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}