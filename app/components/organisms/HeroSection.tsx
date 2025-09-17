'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { DisplayLarge, BodyLarge } from '../atoms/Typography';
import { StatusBadge } from '../molecules/StatusBadge';
import { InteractiveBackground } from '../background/InteractiveBackground';
// import { cn } from '../../../lib/utils';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className || ''}`}
    >
      {/* Interactive Background */}
      <InteractiveBackground variant="hero" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Expedition Status Badge */}
        <motion.div className="flex justify-center" variants={itemVariants}>
          <StatusBadge
            variant="summit"
            className="text-lg px-6 py-3 shadow-spa-medium"
          >
            <Icon name="Mountain" size="md" />
            Everest 2024 Expedition Training
          </StatusBadge>
        </motion.div>

        {/* Main Headline */}
        <motion.div className="space-y-8" variants={itemVariants}>
          <DisplayLarge className="font-oswald text-spa-charcoal leading-tight max-w-4xl mx-auto tracking-wide">
            Journey to the
            <span className="font-amatic text-transparent bg-clip-text bg-gradient-to-r from-alpine-blue to-summit-gold">
              {' '}
              Summit
            </span>
          </DisplayLarge>

          <BodyLarge className="font-montserrat max-w-3xl mx-auto text-spa-slate leading-relaxed">
            Follow my systematic training, preparation, and expedition journey
            toward mountaineering excellence. Experience the dedication,
            data-driven methodology, and premium preparation behind conquering
            the world's highest peaks.
          </BodyLarge>
        </motion.div>

        {/* Primary CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              variant="summit"
              size="lg"
              asChild
              className="shadow-spa-medium font-montserrat"
            >
              <Link href="/support">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon name="Heart" size="md" />
                </motion.div>
                Support My Journey
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="group font-montserrat"
            >
              <Link href="/about">
                <motion.div
                  animate={{ rotate: 360 }}
                  className="group-hover:pause"
                >
                  <Icon name="Play" size="md" />
                </motion.div>
                Watch My Story
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Training Progress Indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
          variants={itemVariants}
        >
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft border border-spa-cloud/30"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 bg-alpine-blue/10 rounded-full mx-auto mb-4"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Icon name="Activity" size="xl" className="text-alpine-blue" />
            </motion.div>
            <div className="font-oswald text-3xl font-bold text-spa-charcoal mb-2">
              127km
            </div>
            <div className="font-montserrat text-spa-slate">This Week</div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft border border-spa-cloud/30"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 bg-summit-gold/10 rounded-full mx-auto mb-4"
              whileHover={{ rotate: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Icon name="Mountain" size="xl" className="text-summit-gold" />
            </motion.div>
            <div className="font-oswald text-3xl font-bold text-spa-charcoal mb-2">
              2,840m
            </div>
            <div className="font-montserrat text-spa-slate">
              Elevation Gained
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft border border-spa-cloud/30"
            whileHover={{
              scale: 1.02,
              y: -4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon name="Target" size="xl" className="text-green-600" />
            </motion.div>
            <div className="font-oswald text-3xl font-bold text-spa-charcoal mb-2">
              Week 12
            </div>
            <div className="font-montserrat text-spa-slate">of 24 Training</div>
          </motion.div>
        </motion.div>

        {/* Secondary Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 pt-8"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/training"
              className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300 font-montserrat"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Icon name="BarChart3" size="sm" />
              </motion.div>
              <span>Training Data</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/blog"
              className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300 font-montserrat"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Icon name="BookOpen" size="sm" />
              </motion.div>
              <span>Journey Updates</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/expeditions"
              className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300 font-montserrat"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Icon name="Map" size="sm" />
              </motion.div>
              <span>Expedition Plans</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          variants={itemVariants}
        >
          <div className="flex flex-col items-center space-y-2 text-spa-slate font-montserrat">
            <span className="text-sm">Explore Journey</span>
            <motion.div animate={{ y: [0, 5, 0] }}>
              <Icon name="ChevronDown" size="md" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export { HeroSection };
export type { HeroSectionProps };
