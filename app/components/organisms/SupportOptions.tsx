'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Coffee,
  Mountain,
  Zap,
  ExternalLink,
  Users,
} from 'lucide-react';
import { H3, Body } from '../atoms/Typography';
import { Button } from '../atoms/Button';

interface SupportTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  impact: string;
  icon: any;
  popular?: boolean;
}

interface SupportOptionsProps {
  variant?: 'subtle' | 'featured' | 'inline';
  className?: string;
}

export function SupportOptions({
  variant = 'featured',
  className = '',
}: SupportOptionsProps) {
  const supportTiers: SupportTier[] = [
    {
      id: 'coffee',
      name: 'Trail Coffee',
      amount: 5,
      currency: '$',
      description: 'Fuel for early morning training sessions',
      impact: 'Supports daily training nutrition',
      icon: Coffee,
    },
    {
      id: 'gear',
      name: 'Gear Support',
      amount: 25,
      currency: '$',
      description: 'Contribute to essential climbing equipment',
      impact: 'Helps fund safety equipment',
      icon: Mountain,
      popular: true,
    },
    {
      id: 'training',
      name: 'Training Day',
      amount: 100,
      currency: '$',
      description: 'Support a full day of specialized training',
      impact: 'Enables high-altitude simulation training',
      icon: Zap,
    },
  ];

  const handlePatreonClick = () => {
    // Replace with your actual Patreon URL
    window.open('https://www.patreon.com/summitchronicles', '_blank');
  };

  if (variant === 'subtle') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Body className="text-sm text-spa-charcoal/60 mb-3">
          Every step of this journey is made possible by supporters like you
        </Body>
        <div className="flex justify-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePatreonClick}
            className="text-xs flex items-center space-x-1 hover:bg-alpine-blue/10"
          >
            <Heart className="w-3 h-3 text-summit-gold" />
            <span>Support on Patreon</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        className={`inline-flex items-center space-x-2 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Body className="text-sm text-spa-charcoal/70">
          Support this journey:
        </Body>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePatreonClick}
          className="text-xs flex items-center space-x-1"
        >
          <Heart className="w-3 h-3 text-summit-gold" />
          <span>Patreon</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </motion.div>
    );
  }

  return (
    <section
      className={`py-16 bg-gradient-to-br from-spa-mist/10 to-white ${className}`}
    >
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
            Join the community backing this Seven Summits challenge through
            Patreon. Your ongoing support makes every training session, every
            piece of safety equipment, and every step toward the summit
            possible.
          </Body>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {supportTiers.map((tier, index) => {
            const IconComponent = tier.icon;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`h-full space-y-4 cursor-pointer transition-all duration-300 hover:shadow-lg relative bg-white border border-spa-cloud shadow-spa-medium hover:shadow-spa-elevated rounded-lg p-8 ${
                    tier.popular ? 'border-2 border-summit-gold/30' : ''
                  }`}
                  onClick={handlePatreonClick}
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
                      <H3 className="text-xl mb-1">
                        {tier.currency}
                        {tier.amount}
                        <span className="text-sm text-spa-charcoal/60">
                          /month
                        </span>
                      </H3>
                      <div className="text-sm font-medium text-spa-charcoal/80 mb-2">
                        {tier.name}
                      </div>
                      <Body className="text-sm text-spa-charcoal/60 mb-3">
                        {tier.description}
                      </Body>
                      <div className="text-xs text-spa-charcoal/50 italic">
                        {tier.impact}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-spa-stone/20">
                    <div className="flex items-center justify-center space-x-2 text-xs text-spa-charcoal/50">
                      <Users className="w-3 h-3" />
                      <span>Monthly Support</span>
                      <div className="w-1 h-1 bg-spa-charcoal/30 rounded-full" />
                      <ExternalLink className="w-3 h-3" />
                      <span>Patreon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePatreonClick}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Join on Patreon</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <div className="text-xs text-spa-charcoal/50">
              Secure monthly support • Cancel anytime • Exclusive updates
            </div>
          </div>

          <div className="pt-6 border-t border-spa-stone/20">
            <Body className="text-xs text-spa-charcoal/60 max-w-2xl mx-auto">
              Patreon provides a reliable way to support long-term expedition
              preparation. Your monthly contribution directly funds training
              programs, safety equipment, and expedition logistics. Join the
              community and be part of every summit attempt.
            </Body>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
