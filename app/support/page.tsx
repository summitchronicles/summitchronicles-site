'use client';

import { motion } from 'framer-motion';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { SupportOptions } from '../components/organisms/SupportOptions';
import { H1, H2, Body, BodyLarge } from '../components/atoms/Typography';
import { Heart, Mountain, Users, Target } from 'lucide-react';

export default function SupportPage() {
  const impactStats = [
    {
      icon: Users,
      value: '127',
      label: 'Supporters',
      description: 'Community members backing this journey',
    },
    {
      icon: Mountain,
      value: '₹2,15,000',
      label: 'Raised',
      description: 'Progress toward expedition funding',
    },
    {
      icon: Target,
      value: '63%',
      label: 'Complete',
      description: 'Of total expedition preparation funded',
    },
    {
      icon: Heart,
      value: '89',
      label: 'Days Left',
      description: 'Until Mount Everest departure',
    },
  ];

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
        <section className="py-20 gradient-peak text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="M20 20l10-10v20l-10-10zm-10 0l10 10v-20l-10 10z"/%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <H1 className="text-4xl md:text-6xl font-bold mb-6">
                Support the Journey
              </H1>
              <BodyLarge className="text-white/90 max-w-2xl mx-auto">
                Every summit reached is made possible by a community that
                believes in the climb. Your support directly funds safety
                equipment, training, and expedition preparation.
              </BodyLarge>
            </motion.div>

            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Body className="text-white/80 italic text-lg">
                "The mountain doesn't care about your plan - but your
                preparation does. Every contribution helps ensure safe
                preparation and a safe return home."
              </Body>
              <div className="text-white/60 text-sm mt-2">- Sunith Kumar</div>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="mx-auto w-16 h-16 bg-gradient-to-br from-alpine-blue/10 to-summit-gold/10 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconComponent className="w-8 h-8 text-alpine-blue" />
                    </motion.div>
                    <div>
                      <div className="text-3xl font-bold text-alpine-blue mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-spa-charcoal/80 mb-2">
                        {stat.label}
                      </div>
                      <Body className="text-xs text-spa-charcoal/60">
                        {stat.description}
                      </Body>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support Options */}
        <SupportOptions variant="featured" />

        {/* Why Support Matters */}
        <section className="py-16 bg-gradient-to-br from-spa-mist/20 to-alpine-blue/5">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <H2>Why Your Support Matters</H2>

              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-alpine-blue">
                    Safety First
                  </div>
                  <Body className="text-sm text-spa-charcoal/70">
                    Every rupee goes toward proper safety equipment, emergency
                    gear, and professional guide services. No shortcuts when it
                    comes to coming home safely.
                  </Body>
                </div>

                <div className="space-y-3">
                  <div className="text-lg font-semibold text-summit-gold">
                    Community Impact
                  </div>
                  <Body className="text-sm text-spa-charcoal/70">
                    Your support becomes part of an inspiring story that
                    motivates others to pursue their own challenges. Together,
                    we're building a community of adventurers.
                  </Body>
                </div>

                <div className="space-y-3">
                  <div className="text-lg font-semibold text-spa-charcoal">
                    Transparency
                  </div>
                  <Body className="text-sm text-spa-charcoal/70">
                    Every contribution is tracked and accounted for. Regular
                    updates show exactly how your support enables training,
                    equipment, and expedition preparation.
                  </Body>
                </div>
              </div>

              <motion.div
                className="pt-8 border-t border-spa-stone/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Body className="text-sm text-spa-charcoal/60 max-w-2xl mx-auto italic">
                  "This journey represents more than personal achievement - it's
                  about showing what's possible when preparation meets
                  opportunity, backed by a community that believes in the
                  climb."
                </Body>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Updates & Communication */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <H2 className="mb-4">Stay Connected</H2>
              <Body className="text-spa-charcoal/70 max-w-2xl mx-auto">
                All supporters receive regular updates on training progress,
                preparation milestones, and expedition planning. You'll be part
                of every step of this journey.
              </Body>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-spa-mist/20 to-alpine-blue/10 rounded-2xl p-8 border border-spa-stone/20"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Body className="text-spa-charcoal/80 italic">
                "Every supporter becomes part of the team. Your encouragement
                and belief in this journey is just as important as the financial
                support. Together, we're reaching new heights."
              </Body>
              <div className="text-spa-charcoal/60 text-sm mt-3">
                Thank you for being part of this adventure.
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
