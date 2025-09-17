'use client'

import { motion } from 'framer-motion'
import { Heart, Mountain, TrendingUp, Shield } from 'lucide-react'
import { H3, Body } from '../atoms/Typography'
import { Card } from '../molecules/Card'

interface Sponsor {
  id: string
  name: string
  logo?: string
  description: string
  category: 'gear' | 'training' | 'nutrition' | 'safety' | 'community'
  contribution: string
  website?: string
  featured?: boolean
}

interface SponsorRecognitionProps {
  variant?: 'subtle' | 'featured'
  className?: string
}

export function SponsorRecognition({ variant = 'subtle', className = '' }: SponsorRecognitionProps) {
  // Sample sponsors - can be populated from CMS/API
  const sponsors: Sponsor[] = [
    {
      id: 'community-supporters',
      name: 'Community Supporters',
      description: 'Individual contributors making this journey possible',
      category: 'community',
      contribution: '127 supporters contributing to expedition fund',
      featured: true
    },
    {
      id: 'local-gym',
      name: 'Fitness Partners',
      description: 'Training facility support and specialized coaching',
      category: 'training', 
      contribution: 'High-altitude simulation training access'
    },
    {
      id: 'gear-sponsor',
      name: 'Equipment Partners',
      description: 'Technical mountaineering gear and safety equipment',
      category: 'gear',
      contribution: 'Specialized high-altitude climbing equipment'
    }
  ]

  const getCategoryIcon = (category: Sponsor['category']) => {
    switch (category) {
      case 'community': return Heart
      case 'training': return TrendingUp
      case 'gear': return Mountain
      case 'safety': return Shield
      default: return Mountain
    }
  }

  const getCategoryColor = (category: Sponsor['category']) => {
    switch (category) {
      case 'community': return 'text-summit-gold'
      case 'training': return 'text-alpine-blue'
      case 'gear': return 'text-spa-charcoal'
      case 'safety': return 'text-green-600'
      default: return 'text-alpine-blue'
    }
  }

  if (variant === 'subtle') {
    return (
      <motion.div 
        className={`py-8 ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-6">
          <Body className="text-sm text-spa-charcoal/60 italic">
            "Every summit reached is a testament to the community that believes in the climb"
          </Body>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 opacity-70">
          {sponsors.slice(0, 3).map((sponsor, index) => {
            const IconComponent = getCategoryIcon(sponsor.category)
            return (
              <motion.div
                key={sponsor.id}
                className="flex items-center space-x-2 text-xs text-spa-charcoal/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <IconComponent className="w-3 h-3" />
                <span>Supported by {sponsor.name}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-spa-mist/20 to-white ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <H3>Journey Partners</H3>
          <Body className="max-w-2xl mx-auto text-spa-charcoal/70">
            Every expedition is powered by those who believe in the journey. 
            These partners make safety, preparation, and success possible.
          </Body>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {sponsors.map((sponsor, index) => {
            const IconComponent = getCategoryIcon(sponsor.category)
            const iconColor = getCategoryColor(sponsor.category)
            
            return (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  variant={sponsor.featured ? "premium" : "elevated"} 
                  padding="lg" 
                  className={`h-full space-y-4 hover:shadow-lg transition-all duration-300 group ${
                    sponsor.featured ? 'border-2 border-summit-gold/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className={`p-2 bg-gradient-to-br from-spa-mist/30 to-alpine-blue/10 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <IconComponent className={`w-5 h-5 ${iconColor}`} />
                      </motion.div>
                      <div>
                        <H3 className="text-lg">{sponsor.name}</H3>
                        {sponsor.featured && (
                          <div className="text-xs text-summit-gold font-medium">Featured Partner</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Body className="text-sm text-spa-charcoal/70">{sponsor.description}</Body>
                  
                  <div className="space-y-2 pt-2 border-t border-spa-stone/20">
                    <div className="text-xs font-medium text-spa-charcoal/70">Contributing:</div>
                    <div className="text-xs text-spa-charcoal/60">{sponsor.contribution}</div>
                  </div>

                  {sponsor.featured && (
                    <motion.div
                      className="pt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center p-3 bg-gradient-to-r from-summit-gold/10 to-alpine-blue/10 rounded-lg border border-summit-gold/20">
                        <div className="text-sm text-spa-charcoal/70">
                          Powered by community support
                        </div>
                        <motion.div 
                          className="text-xs text-spa-charcoal/60 mt-1"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Thank you to every contributor
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="text-center mt-12 space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Body className="text-sm text-spa-charcoal/60 italic max-w-2xl mx-auto">
            "The summit is never reached alone. Every step is supported by those who believe 
            in the journey, the preparation, and the safe return home."
          </Body>
          
          <div className="pt-4">
            <Body className="text-xs text-spa-charcoal/50">
              Interested in partnership opportunities? 
              <span className="text-alpine-blue ml-1">Contact us to learn more</span>
            </Body>
          </div>
        </motion.div>
      </div>
    </section>
  )
}