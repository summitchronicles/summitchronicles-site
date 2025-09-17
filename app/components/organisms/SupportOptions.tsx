'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Coffee, Mountain, Zap, CreditCard, Smartphone } from 'lucide-react'
import { H3, Body } from '../atoms/Typography'
import { Button } from '../atoms/Button'
import { Card } from '../molecules/Card'

interface SupportTier {
  id: string
  name: string
  amount: number
  currency: string
  description: string
  impact: string
  icon: any
  popular?: boolean
}

interface SupportOptionsProps {
  variant?: 'subtle' | 'featured' | 'inline'
  className?: string
}

export function SupportOptions({ variant = 'featured', className = '' }: SupportOptionsProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const supportTiers: SupportTier[] = [
    {
      id: 'coffee',
      name: 'Trail Coffee',
      amount: 250,
      currency: '₹',
      description: 'Fuel for early morning training sessions',
      impact: 'Supports daily training nutrition',
      icon: Coffee
    },
    {
      id: 'gear',
      name: 'Gear Support',
      amount: 1000,
      currency: '₹',
      description: 'Contribute to essential climbing equipment',
      impact: 'Helps fund safety equipment',
      icon: Mountain,
      popular: true
    },
    {
      id: 'training',
      name: 'Training Day',
      amount: 2500,
      currency: '₹',
      description: 'Support a full day of specialized training',
      impact: 'Enables high-altitude simulation training',
      icon: Zap
    }
  ]

  const handleSupportClick = async (amount: number) => {
    setLoading(true)
    setSelectedAmount(amount)

    try {
      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add this to your .env.local
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Summit Chronicles',
        description: `Support Sunith's Seven Summits Journey`,
        image: '/logo.png', // Add your logo
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          purpose: 'expedition_support',
          amount_tier: amount.toString()
        },
        theme: {
          color: '#2563eb' // Alpine blue color
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setSelectedAmount(null)
          }
        },
        handler: (response: any) => {
          // Handle successful payment
          console.log('Payment successful:', response)
          setLoading(false)
          setSelectedAmount(null)
          
          // Show thank you message or redirect
          alert('Thank you for supporting the journey! 🏔️')
        }
      }

      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      document.head.appendChild(script)

    } catch (error) {
      console.error('Payment initialization failed:', error)
      setLoading(false)
      setSelectedAmount(null)
    }
  }

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount)
    if (amount && amount >= 100) {
      handleSupportClick(amount)
    }
  }

  if (variant === 'subtle') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Body className="text-sm text-spa-charcoal/60 mb-3">
          Every step of this journey is made possible by supporters like you
        </Body>
        <div className="flex justify-center space-x-3">
          {supportTiers.slice(0, 2).map((tier) => {
            const IconComponent = tier.icon
            return (
              <Button
                key={tier.id}
                variant="ghost"
                size="sm"
                onClick={() => handleSupportClick(tier.amount)}
                disabled={loading}
                className="text-xs flex items-center space-x-1 hover:bg-alpine-blue/10"
              >
                <IconComponent className="w-3 h-3" />
                <span>{tier.currency}{tier.amount}</span>
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <motion.div 
        className={`inline-flex items-center space-x-2 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Body className="text-sm text-spa-charcoal/70">Support this journey:</Body>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSupportClick(1000)}
          disabled={loading}
          className="text-xs flex items-center space-x-1"
        >
          <Heart className="w-3 h-3 text-summit-gold" />
          <span>₹1000</span>
        </Button>
      </motion.div>
    )
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-spa-mist/10 to-white ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <H3>Support the Journey</H3>
          <Body className="max-w-2xl mx-auto text-spa-charcoal/70">
            Your support makes every training session, every piece of safety equipment, 
            and every step toward the summit possible. Join the community backing this journey.
          </Body>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {supportTiers.map((tier, index) => {
            const IconComponent = tier.icon
            const isSelected = selectedAmount === tier.amount
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  variant="elevated" 
                  padding="lg" 
                  className={`h-full space-y-4 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                    tier.popular ? 'border-2 border-summit-gold/30' : ''
                  } ${isSelected ? 'ring-2 ring-alpine-blue' : ''}`}
                  onClick={() => handleSupportClick(tier.amount)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-summit-gold text-white text-xs px-3 py-1 rounded-full font-medium">
                        Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-3">
                    <motion.div 
                      className="mx-auto w-12 h-12 bg-gradient-to-br from-alpine-blue/10 to-summit-gold/10 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconComponent className="w-6 h-6 text-alpine-blue" />
                    </motion.div>
                    
                    <div>
                      <H3 className="text-xl mb-1">{tier.currency}{tier.amount}</H3>
                      <div className="text-sm font-medium text-spa-charcoal/80 mb-2">{tier.name}</div>
                      <Body className="text-sm text-spa-charcoal/60 mb-3">{tier.description}</Body>
                      <div className="text-xs text-spa-charcoal/50 italic">{tier.impact}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-spa-stone/20">
                    <div className="flex items-center justify-center space-x-2 text-xs text-spa-charcoal/50">
                      <Smartphone className="w-3 h-3" />
                      <span>UPI</span>
                      <div className="w-1 h-1 bg-spa-charcoal/30 rounded-full" />
                      <CreditCard className="w-3 h-3" />
                      <span>Cards</span>
                    </div>
                  </div>

                  {loading && isSelected && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="animate-spin w-6 h-6 border-2 border-alpine-blue border-t-transparent rounded-full" />
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto space-y-3">
            <Body className="text-sm text-spa-charcoal/70">Or choose your own amount:</Body>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="₹ Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="100"
                className="flex-1 px-4 py-2 border border-spa-stone/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alpine-blue/30"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleCustomAmount}
                disabled={!customAmount || parseInt(customAmount) < 100 || loading}
              >
                Support
              </Button>
            </div>
            <div className="text-xs text-spa-charcoal/50">Minimum amount: ₹100</div>
          </div>

          <div className="pt-6 border-t border-spa-stone/20">
            <Body className="text-xs text-spa-charcoal/60 max-w-2xl mx-auto">
              Secure payments powered by Razorpay. Your support directly funds expedition preparation, 
              safety equipment, and training programs. Every contribution brings us one step closer to the summit.
            </Body>
          </div>
        </motion.div>
      </div>
    </section>
  )
}