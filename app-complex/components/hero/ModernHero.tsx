'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  PlayIcon,
  ChevronDownIcon,
  MapPinIcon,
  TrophyIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function ModernHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 58, 138, 0.15), transparent 40%)`,
      }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-8"
        >
          <TrophyIcon className="w-4 h-4 text-summitGold" />
          Active Climber & Seven Summits Pursuer
          <motion.div
            className="w-2 h-2 bg-successGreen rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Achievement Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-summitGold/20 via-yellow-400/20 to-summitGold/20 backdrop-blur-sm border border-summitGold/30 rounded-full px-6 py-3 mb-6"
        >
          <span className="text-2xl">🏔️</span>
          <span className="text-lg md:text-xl font-bold text-summitGold">
            4/7 SUMMITS CONQUERED
          </span>
          <span className="text-white/60 text-sm md:text-base">|</span>
          <span className="text-white/80 text-sm md:text-base">2013-2024</span>
          <span className="text-white/60 text-sm md:text-base">|</span>
          <span className="text-glacierBlue font-semibold text-sm md:text-base">
            NEXT: VINSON MASSIF 2025
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
        >
          <span className="block">I&apos;m Sunith Kumar,</span>
          <motion.span
            className="block bg-gradient-to-r from-summitGold via-yellow-400 to-summitGold bg-clip-text text-transparent"
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            and I&apos;m climbing
          </motion.span>
          <span className="block text-white">the Seven Summits</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Follow my journey to the world&apos;s highest peaks. Real insights
          from{' '}
          <span className="text-white font-medium">actual expeditions</span>,{' '}
          <span className="text-summitGold font-medium">training wisdom</span>,
          and{' '}
          <span className="text-glacierBlue font-medium">gear that works</span>{' '}
          at altitude.
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {[
            {
              icon: MapPinIcon,
              label: 'Next Target',
              value: 'Everest 2027',
              color: 'text-alpineBlue',
            },
            {
              icon: CalendarIcon,
              label: 'Training Days',
              value: '365+ Active',
              color: 'text-successGreen',
            },
            {
              icon: TrophyIcon,
              label: 'Progress',
              value: '4 of 7',
              color: 'text-summitGold',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-alpineBlue/20 to-summitGold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Persona-Specific CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* For Marketing Manager Mike - Sponsorship */}
          <motion.a
            href="/sponsorship"
            whileHover={{
              scale: 1.05,
              boxShadow:
                '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-summitGold text-black font-semibold rounded-2xl overflow-hidden shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              🎯 Partner With Me
              <ArrowRightIcon className="w-5 h-5" />
            </span>
          </motion.a>

          {/* For Aspiring Adventurer Alex - Inspiration */}
          <motion.a
            href="/start-your-journey"
            whileHover={{
              scale: 1.05,
              boxShadow:
                '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl overflow-hidden shadow-lg hover:bg-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              🚀 Start Your Adventure
              <ArrowRightIcon className="w-5 h-5" />
            </span>
          </motion.a>

          {/* For CEO Sarah - Professional */}
          <motion.a
            href="/speaking"
            whileHover={{
              scale: 1.05,
              boxShadow:
                '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-transparent border-2 border-glacierBlue text-glacierBlue font-semibold rounded-2xl overflow-hidden shadow-lg hover:bg-glacierBlue hover:text-black"
          >
            <span className="relative z-10 flex items-center gap-2">
              🎤 Book Speaking
              <ArrowRightIcon className="w-5 h-5" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-summitGold to-yellow-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {/* Animated particles */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-summitGold/20 to-yellow-400/20 rounded-full blur-xl"
              animate={
                isHovered
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transform: 'translate(-50%, -50%)' }}
            />
          </motion.a>

          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <motion.div
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                }}
                transition={{ duration: 0.4 }}
              >
                <PlayIcon className="w-5 h-5" />
              </motion.div>
              My Story
            </span>
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/5 rounded-2xl"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{
                scale: 1,
                opacity: [0, 0.5, 0],
              }}
              transition={{ duration: 0.6 }}
            />
            {/* Border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{
                background: 'linear-gradient(45deg, transparent, transparent)',
              }}
              whileHover={{
                background:
                  'linear-gradient(45deg, rgba(245, 158, 11, 0.3), rgba(59, 130, 246, 0.3), rgba(245, 158, 11, 0.3))',
                backgroundSize: '200% 200%',
                backgroundPosition: ['0% 50%', '100% 50%'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ padding: '1px' }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/50"
        >
          <span className="text-sm mb-2">Discover</span>
          <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-2 h-2 bg-summitGold rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-1 h-1 bg-glacierBlue rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </section>
  );
}
