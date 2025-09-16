'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, Mountain } from 'lucide-react'
import { Button } from '../../atoms/Button'

interface CinematicHeroProps {
  backgroundImage: string
  quote: string
  author: string
  stats: Array<{
    label: string
    value: string
    subtext?: string
  }>
  ctaText: string
  ctaLink: string
  className?: string
}

export function CinematicHero({
  backgroundImage,
  quote,
  author,
  stats,
  ctaText,
  ctaLink,
  className = ""
}: CinematicHeroProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Summit adventure background"
          fill
          priority
          quality={95}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
      
      {/* Stats Overlay - Top Right */}
      <motion.div 
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="text-white text-sm space-y-2">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="font-medium">{stat.label}</div>
              <div className="text-summit-gold font-bold text-lg">{stat.value}</div>
              {stat.subtext && (
                <div className="text-xs opacity-80">{stat.subtext}</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <blockquote className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
              "{quote}"
            </blockquote>
            <cite className="block mt-6 text-xl md:text-2xl text-summit-gold font-medium">
              — {author}
            </cite>
          </motion.div>

          {/* Mobile Stats */}
          <motion.div 
            className="grid grid-cols-2 gap-4 max-w-md mx-auto md:hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center">
                <div className="text-summit-gold font-bold text-lg">{stat.value}</div>
                <div className="text-white text-sm font-medium">{stat.label}</div>
                {stat.subtext && (
                  <div className="text-white/70 text-xs">{stat.subtext}</div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <Button variant="summit" size="lg" asChild>
              <Link href={ctaLink} className="inline-flex items-center gap-3">
                <Mountain className="w-5 h-5" />
                {ctaText}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-white/70 flex flex-col items-center gap-2"
          >
            <span className="text-sm font-medium">Discover My Journey</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}