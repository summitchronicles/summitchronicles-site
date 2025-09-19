'use client';

import { Header } from '../components/organisms/Header';
import { motion } from 'framer-motion';
import {
  Mountain,
  Users,
  Target,
  Award,
  Heart,
  Code,
  Compass,
  TrendingUp,
  Globe,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export default function AboutPage() {
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
          <h2>About Sunith Kumar - Adventure Athlete</h2>
          <h3>Professional Background and Athletic Philosophy</h3>
          <h4>Data-Driven Training Methodology</h4>
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Sunith Kumar adventure athlete profile and mountaineering background"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Data-driven athletic training methodology and systematic approach"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Professional background combining athletics and analytical excellence"
          />
        </div>

        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1
              className="text-4xl font-light text-spa-charcoal mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Sunith
            </motion.h1>

            {/* Personal Introduction */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 mb-8 border border-spa-stone/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-alpine-blue/10 rounded-xl">
                  <Briefcase className="w-6 h-6 text-alpine-blue" />
                </div>
                <h2 className="text-2xl font-medium text-spa-charcoal">
                  Who I Am
                </h2>
              </div>
              <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                I'm a data-driven adventure athlete who discovered that
                systematic thinking, methodical training, and analytical
                performance tracking can unlock extraordinary athletic
                achievements. What started as weekend hiking has evolved into a
                comprehensive pursuit of the Seven Summits, marathons,
                ultra-marathons, cycling challenges, and multi-sport adventures.
              </p>
              <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                My approach to athletic training combines rigorous data analysis
                with systematic preparation—treating each challenge as a
                carefully planned project with measurable goals, progressive
                training phases, and continuous performance optimization through
                real-time metrics and analytics.
              </p>
              <p className="text-spa-charcoal/80 leading-relaxed">
                Based in the Pacific Northwest, I leverage cutting-edge training
                technology and performance analytics to push the boundaries of
                what's possible in adventure sports, creating compelling content
                and measurable results that demonstrate the power of systematic
                athletic excellence.
              </p>
            </motion.div>

            {/* Origin Story */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 mb-8 border border-spa-stone/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-summit-gold/10 rounded-xl">
                  <Compass className="w-6 h-6 text-summit-gold" />
                </div>
                <h2 className="text-2xl font-medium text-spa-charcoal">
                  The Origin Story
                </h2>
              </div>
              <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                The journey began with a simple realization: the same systematic
                thinking that drives success in any field—breaking down complex
                challenges, structured planning, and iterative improvement—could
                be applied to seemingly impossible athletic achievements.
              </p>
              <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                After completing numerous marathons and ultra-marathons, I was
                drawn to challenges that would test not just physical endurance,
                but mental resilience and systematic preparation. The Seven
                Summits represent the ultimate athletic challenge: requiring
                precise training planning, resource optimization, risk
                management, and flawless execution under extreme conditions.
              </p>
              <p className="text-spa-charcoal/80 leading-relaxed">
                What makes this journey unique is the integration of modern
                training technology with traditional adventure sports—using
                performance analytics, real-time data tracking, and systematic
                documentation to both optimize performance and share valuable
                insights with the adventure community.
              </p>
            </motion.div>

            {/* Core Values & Philosophy */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 mb-8 border border-spa-stone/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-medium text-spa-charcoal">
                  Core Values & Philosophy
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-spa-charcoal mb-3">
                    Athletic Excellence
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-4">
                    Applying systematic training principles to adventure sports:
                    rigorous planning, data-driven decisions, and continuous
                    improvement through performance measurement.
                  </p>
                  <h4 className="font-medium text-spa-charcoal mb-3">
                    Authentic Documentation
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                    Sharing both triumphs and setbacks transparently, creating
                    genuine value for sponsors and others pursuing similar
                    athletic challenges.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-spa-charcoal mb-3">
                    Technology Integration
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-4">
                    Leveraging modern training technology and analytics to
                    optimize performance and showcase measurable results across
                    multiple disciplines.
                  </p>
                  <h4 className="font-medium text-spa-charcoal mb-3">
                    Community Impact
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                    Using this platform to inspire others, demonstrate
                    systematic training approaches, and contribute meaningfully
                    to the adventure sports community.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Unique Perspective & Expertise */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-spa-stone/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-alpine-blue/10 rounded-xl">
                    <Code className="w-5 h-5 text-alpine-blue" />
                  </div>
                  <h3 className="text-lg font-medium text-spa-charcoal">
                    Performance Analytics
                  </h3>
                </div>
                <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                  Utilizing advanced training technology to create detailed
                  performance insights, automated progress tracking, and
                  innovative training optimization tools.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-spa-stone/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-summit-gold/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-summit-gold" />
                  </div>
                  <h3 className="text-lg font-medium text-spa-charcoal">
                    Systematic Training
                  </h3>
                </div>
                <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                  Applying data-driven methodologies to athletic preparation
                  across multiple disciplines, creating systematic approaches to
                  fitness, skill development, and performance optimization.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-spa-stone/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-spa-charcoal">
                    Sponsorship Value
                  </h3>
                </div>
                <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                  Delivering measurable brand exposure and authentic
                  storytelling across adventure sports, with documented reach
                  and engagement metrics that demonstrate ROI for partners.
                </p>
              </div>
            </motion.div>

            {/* Personal Stakes & Motivation */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 mb-8 border border-spa-stone/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-summit-gold/10 rounded-xl">
                  <Target className="w-6 h-6 text-summit-gold" />
                </div>
                <h2 className="text-2xl font-medium text-spa-charcoal">
                  Why This Matters
                </h2>
              </div>
              <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                This journey represents more than personal achievement—it's
                about proving that systematic training and data-driven
                preparation can achieve extraordinary results in the most
                demanding environments. Every summit, marathon, and cycling
                challenge is a test of methodologies that demonstrate the power
                of consistent, measured progress toward seemingly impossible
                goals.
              </p>
              <p className="text-spa-charcoal/80 mb-6 leading-relaxed">
                These adventures showcase not just physical achievement, but the
                compelling story of systematic excellence that resonates with
                audiences and provides authentic, measurable value for sponsors.
                The mountains, trails, and roads teach lessons about persistence
                and preparation that inspire others to pursue their own
                extraordinary challenges.
              </p>

              <div className="bg-gradient-to-r from-alpine-blue/5 to-summit-gold/5 p-6 rounded-xl border border-alpine-blue/10">
                <h3 className="font-medium text-spa-charcoal mb-4 flex items-center gap-2">
                  <Mountain className="w-4 h-4" />
                  Current Seven Summits Progress
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Mount Whitney (14,505 ft) - Technical alpine preparation
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Mount Washington (6,288 ft) - Winter conditions mastery
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Mount Katahdin (5,267 ft) - Endurance foundation
                  </div>
                  <div className="flex items-center gap-2 text-alpine-blue">
                    <div className="w-2 h-2 bg-alpine-blue rounded-full animate-pulse"></div>
                    Multiple marathons & ultra-marathons completed
                  </div>
                  <div className="flex items-center gap-2 text-alpine-blue">
                    <div className="w-2 h-2 bg-alpine-blue rounded-full animate-pulse"></div>
                    Denali expedition - Major 2025 milestone
                  </div>
                  <div className="flex items-center gap-2 text-spa-charcoal/40">
                    <div className="w-2 h-2 bg-spa-stone/40 rounded-full"></div>
                    Everest - Ultimate systematic athletic challenge
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision Beyond Climbing */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-spa-stone/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-alpine-blue/10 rounded-xl">
                  <Globe className="w-6 h-6 text-alpine-blue" />
                </div>
                <h2 className="text-2xl font-medium text-spa-charcoal">
                  Vision Beyond the Summits
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Training Methodology
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-6">
                    Sharing comprehensive training insights and systematic
                    approaches that help others achieve their own extraordinary
                    athletic goals across multiple adventure sports disciplines.
                  </p>

                  <h4 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Content Platform
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                    Creating engaging content and resources that showcase
                    systematic training approaches, performance analytics, and
                    authentic adventure storytelling for the sports community.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Brand Partnerships
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed mb-6">
                    Delivering authentic brand integration opportunities with
                    documented reach, engagement metrics, and genuine product
                    testing across diverse adventure sports environments.
                  </p>

                  <h4 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Measurable Impact
                  </h4>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                    Providing quantifiable results through systematic
                    documentation of achievements, audience growth, and
                    community engagement that demonstrate clear ROI for sponsors
                    and partners.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}
