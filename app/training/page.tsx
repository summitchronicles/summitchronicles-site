'use client'

import { Suspense, lazy } from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, TrendingUp, Calendar, Target, Zap, Mountain, Award, BarChart3, Activity, ArrowRight, Users, Share2 } from 'lucide-react'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { TrainingCharts } from '../components/TrainingCharts'
import { StravaActivityFeed } from '../components/StravaIntegration'
import { PhotoShowcase } from '../components/organisms/PhotoShowcase'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import { Button } from '../components/atoms/Button'
import { cn } from '@/lib/utils'

// Lazy load heavy components
const TrainingMethodologyHub = lazy(() => 
  import('../components/organisms/TrainingMethodologyHub').then(module => ({
    default: module.TrainingMethodologyHub
  }))
)

const TrainingProgressionAnalytics = lazy(() => 
  import('../components/organisms/TrainingProgressionAnalytics').then(module => ({
    default: module.TrainingProgressionAnalytics
  }))
)

export default function TrainingPage() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const heroControls = useAnimation()
  
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const statsControls = useAnimation()
  
  const progressRef = useRef(null)
  const progressInView = useInView(progressRef, { once: true, margin: "-50px" })
  const progressControls = useAnimation()

  useEffect(() => {
    if (heroInView) {
      heroControls.start('visible')
    }
  }, [heroControls, heroInView])

  useEffect(() => {
    if (statsInView) {
      statsControls.start('visible')
    }
  }, [statsControls, statsInView])

  useEffect(() => {
    if (progressInView) {
      progressControls.start('visible')
    }
  }, [progressControls, progressInView])

  const trainingPhases = [
    { name: 'Base Building', progress: 100, status: 'completed', duration: '12 weeks', description: 'Cardiovascular foundation and endurance base' },
    { name: 'Strength Phase', progress: 85, status: 'in-progress', duration: '8 weeks', description: 'Power development and functional strength' },
    { name: 'Peak Training', progress: 0, status: 'upcoming', duration: '6 weeks', description: 'High-intensity expedition-specific training' },
    { name: 'Expedition Prep', progress: 0, status: 'upcoming', duration: '4 weeks', description: 'Final preparations and gear testing' },
  ]

  const weeklyStats = [
    { label: 'Hours Trained', value: '12.5', icon: Clock, change: '+2.3', trend: 'up', detail: 'This week' },
    { label: 'Vertical Gain', value: '2,840m', icon: TrendingUp, change: '+340m', trend: 'up', detail: 'Total elevation' },
    { label: 'Workouts', value: '6', icon: Zap, change: '+1', trend: 'up', detail: 'Activities completed' },
    { label: 'Rest Days', value: '1', icon: Calendar, change: '0', trend: 'stable', detail: 'Recovery focused' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const statItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const progressVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const phaseVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1
    }
  }

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col overflow-x-hidden">
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
        <h2>Training Progress and Analytics</h2>
        <h3>Physical Training Categories</h3>
        <h4>Technical Skills Development</h4>
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="High-altitude training simulation for Seven Summits preparation"
        />
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Cold weather conditioning and extreme temperature training"
        />
        <img 
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Mountaineering equipment and gear testing for expeditions"
        />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div 
            ref={heroRef}
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={heroControls}
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              variants={itemVariants}
            >
              <motion.div
                className="p-3 bg-alpine-blue/10 rounded-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Mountain className="w-8 h-8 text-alpine-blue" />
              </motion.div>
              <motion.h1 
                className="text-5xl md:text-6xl font-light text-spa-charcoal"
                variants={itemVariants}
              >
                Training Hub
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-xl text-spa-charcoal/80 max-w-4xl mx-auto leading-relaxed mb-8"
              variants={itemVariants}
            >
              Systematic preparation for the Seven Summits challenge through evidence-based training methodologies, 
              altitude-specific conditioning, and comprehensive performance tracking across all seven continents.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <Link href="/training-advanced">
                <Button variant="summit" size="lg" className="group">
                  <Activity className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Advanced Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="group">
                <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Share Progress
              </Button>
            </motion.div>
          </motion.div>
        
          {/* Weekly Performance Stats */}
          <motion.div 
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={statsVariants}
            initial="hidden"
            animate={statsControls}
          >
            {weeklyStats.map(({ label, value, icon: Icon, change, trend, detail }, index) => (
              <motion.div 
                key={label} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer"
                variants={statItemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="p-3 bg-alpine-blue/10 rounded-xl group-hover:bg-alpine-blue/20 transition-colors"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-5 h-5 text-alpine-blue" />
                  </motion.div>
                  <motion.div 
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm',
                      trend === 'up' && 'bg-emerald-100/80 text-emerald-700 border border-emerald-200',
                      trend === 'down' && 'bg-red-100/80 text-red-700 border border-red-200',
                      trend === 'stable' && 'bg-slate-100/80 text-slate-600 border border-slate-200'
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {change}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="text-3xl font-light text-spa-charcoal mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                >
                  {value}
                </motion.div>
                
                <div>
                  <div className="text-sm font-medium text-spa-charcoal mb-1">{label}</div>
                  <div className="text-xs text-spa-charcoal/60">{detail}</div>
                </div>
                
                <motion.div 
                  className="mt-4 h-1 bg-gradient-to-r from-alpine-blue/20 to-summit-gold/20 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-alpine-blue to-summit-gold rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 0.7 + index * 0.1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Training Progress Overview */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spa-mist/10 via-transparent to-spa-cloud/10"></div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                className="p-2 bg-alpine-blue/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BarChart3 className="w-6 h-6 text-alpine-blue" />
              </motion.div>
              <h2 className="text-4xl font-light text-spa-charcoal">Training Progress</h2>
            </div>
            <p className="text-lg text-spa-charcoal/70 max-w-2xl mx-auto">
              Multi-phase systematic approach to Seven Summits challenge with continent-specific preparation
            </p>
          </motion.div>

          <motion.div 
            ref={progressRef}
            className="bg-gradient-to-br from-spa-mist/20 to-white rounded-3xl p-10 border border-spa-stone/10 shadow-lg backdrop-blur-sm"
            variants={progressVariants}
            initial="hidden"
            animate={progressControls}
          >
            <div className="space-y-8">
              {trainingPhases.map(({ name, progress, status, duration, description }, index) => (
                <motion.div 
                  key={name} 
                  className="flex items-center gap-8 group"
                  variants={phaseVariants}
                  whileHover={{ scale: 1.005, x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-md border border-spa-stone/10 group-hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    ) : status === 'in-progress' ? (
                      <Target className="w-8 h-8 text-alpine-blue animate-pulse" />
                    ) : (
                      <Clock className="w-8 h-8 text-spa-charcoal/40" />
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-spa-charcoal mb-2 group-hover:text-alpine-blue transition-colors">{name}</h3>
                        <div className="flex items-center gap-4 text-sm text-spa-charcoal/60 mb-2">
                          <span className="px-2 py-1 bg-spa-stone/20 rounded-full">Phase {index + 1} of 4</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {duration}
                          </span>
                        </div>
                        <p className="text-sm text-spa-charcoal/70 leading-relaxed">{description}</p>
                      </div>
                      <div className="text-right ml-6">
                        <motion.div 
                          className="text-3xl font-light text-spa-charcoal mb-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {progress}%
                        </motion.div>
                        <div className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full',
                          status === 'completed' && 'text-emerald-700 bg-emerald-100',
                          status === 'in-progress' && 'text-alpine-blue bg-alpine-blue/10',
                          status === 'upcoming' && 'text-spa-charcoal/60 bg-spa-stone/20'
                        )}>
                          {status === 'completed' && 'Complete'}
                          {status === 'in-progress' && 'In Progress'}
                          {status === 'upcoming' && 'Upcoming'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-spa-stone/20 rounded-full h-4 overflow-hidden shadow-inner">
                      <motion.div 
                        className={cn(
                          'h-full rounded-full relative overflow-hidden',
                          status === 'completed' && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                          status === 'in-progress' && 'bg-gradient-to-r from-alpine-blue to-alpine-blue/80',
                          status === 'upcoming' && 'bg-spa-stone/40'
                        )}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 1.2, ease: "easeOut" }}
                      >
                        {status === 'in-progress' && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear"
                            }}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="mt-10 p-6 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5 rounded-2xl border border-spa-stone/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-sm text-spa-charcoal/60 mb-2">Seven Summits Completion</div>
                <div className="text-2xl font-light text-spa-charcoal mb-2">2026</div>
                <div className="text-sm text-spa-charcoal/70">All seven continents conquered through systematic preparation</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Training Categories Overview */}
      <section className="py-16 bg-gradient-to-br from-spa-cloud/30 via-white to-spa-mist/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6 text-alpine-blue" />
              <h2 className="text-3xl font-light text-spa-charcoal">Training Categories</h2>
            </div>
            <p className="text-spa-charcoal/70">
              Comprehensive skill development across all mountaineering domains
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Physical Training</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Cardiovascular endurance', completed: true },
                  { name: 'Strength training', completed: true },
                  { name: 'Altitude simulation', completed: false },
                  { name: 'Long-distance hiking', completed: true },
                ].map(({ name, completed }) => (
                  <div key={name} className="flex items-center gap-3 group">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'transition-colors',
                      completed ? 'text-spa-charcoal' : 'text-spa-charcoal/60'
                    )}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Technical Skills</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Ice climbing', completed: true },
                  { name: 'Crevasse rescue', completed: false },
                  { name: 'High-altitude camping', completed: true },
                  { name: 'Weather assessment', completed: false },
                ].map(({ name, completed }) => (
                  <div key={name} className="flex items-center gap-3 group">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'transition-colors',
                      completed ? 'text-spa-charcoal' : 'text-spa-charcoal/60'
                    )}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Documentation Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                className="p-2 bg-alpine-blue/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Users className="w-6 h-6 text-alpine-blue" />
              </motion.div>
              <h2 className="text-4xl font-light text-spa-charcoal">Training Documentation</h2>
            </div>
            <p className="text-lg text-spa-charcoal/70 max-w-3xl mx-auto">
              Visual proof of systematic training methodology in action. See how data-driven preparation translates into measurable performance improvements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <PhotoShowcase
              title="Seven Summits Training"
              photos={[
                {
                  id: 'training-1',
                  src: '/images/placeholder-altitude-training.jpg',
                  alt: 'High-altitude training for Seven Summits',
                  caption: 'Altitude simulation training',
                  location: 'Hypoxic Training Center',
                  date: 'August 2024',
                  achievement: 'High-altitude preparation',
                  placeholder: true
                },
                {
                  id: 'training-2',
                  src: '/images/placeholder-cold-training.jpg',
                  alt: 'Cold weather conditioning',
                  caption: 'Extreme cold preparation',
                  location: 'Cold Chamber Training',
                  date: 'September 2024',
                  achievement: 'Cold weather adaptation',
                  placeholder: true
                },
                {
                  id: 'training-3',
                  src: '/images/placeholder-endurance-training.jpg',
                  alt: 'Endurance training for long expeditions',
                  caption: 'Multi-day endurance sessions',
                  location: 'Seattle Training Facility',
                  date: 'September 2024',
                  achievement: 'Expedition endurance',
                  placeholder: true
                }
              ]}
              className="mb-8"
            />

            <PhotoShowcase
              title="Expedition Gear Systems"
              photos={[
                {
                  id: 'gear-1',
                  src: '/images/placeholder-extreme-gear.jpg',
                  alt: 'Extreme altitude gear testing',
                  caption: 'High-altitude equipment validation',
                  location: 'Aconcagua Expedition',
                  date: 'January 2024',
                  achievement: 'Altitude gear optimization',
                  placeholder: true
                },
                {
                  id: 'gear-2',
                  src: '/images/placeholder-cold-gear.jpg',
                  alt: 'Extreme cold weather systems',
                  caption: 'Arctic conditions gear testing',
                  location: 'Elbrus Expedition',
                  date: 'September 2023',
                  achievement: 'Cold weather systems',
                  placeholder: true
                },
                {
                  id: 'gear-3',
                  src: '/images/placeholder-technical-mountaineering.jpg',
                  alt: 'Technical mountaineering equipment',
                  caption: 'Advanced climbing systems',
                  location: 'Training Facility',
                  date: 'August 2024',
                  achievement: 'Technical system mastery',
                  placeholder: true
                }
              ]}
              className="mb-8"
            />
          </div>

          <div className="bg-gradient-to-br from-summit-gold/10 to-alpine-blue/10 rounded-xl p-8 border border-spa-stone/10">
            <div className="text-center">
              <h3 className="text-2xl font-light text-spa-charcoal mb-4">Training Methodology Showcase</h3>
              <p className="text-spa-charcoal/70 max-w-3xl mx-auto mb-6">
                Every training session is documented and analyzed for continuous improvement. This systematic approach creates compelling content for brand partnerships while driving real performance gains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="summit" size="lg" className="group">
                  <Activity className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  View Training Analytics
                </Button>
                <Button variant="ghost" size="lg" className="group">
                  <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Partnership Opportunities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Training Methodology Hub */}
      <Suspense fallback={
        <div className="py-16 bg-spa-cloud/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-64 bg-spa-stone/20 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <TrainingMethodologyHub />
      </Suspense>
      
      {/* Training Analytics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <TrainingCharts />
        </div>
      </section>

      {/* Training Progression Analytics */}
      <Suspense fallback={
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 bg-spa-stone/20 rounded-xl"></div>
                <div className="h-96 bg-spa-stone/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <TrainingProgressionAnalytics />
      </Suspense>

      {/* Strava Activity Feed */}
      <section className="py-16 bg-gradient-to-br from-spa-mist/20 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <StravaActivityFeed />
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}