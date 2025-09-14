"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { GlassCard, MountainButton, StatusIndicator } from "@/app/components/ui";
import { 
  MapPinIcon, 
  FireIcon, 
  ArrowRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

interface HeroFallbackProps {
  className?: string;
}

export default function HeroFallback({ className = "" }: HeroFallbackProps) {
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "relative min-h-screen overflow-hidden flex items-center justify-center",
        className
      )}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.05) 0%, transparent 40%),
          linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #374151 70%, #4b5563 100%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <svg viewBox="0 0 1200 300" className="w-full h-full">
            <polygon
              points="0,300 200,100 400,180 600,80 800,160 1000,120 1200,200 1200,300"
              fill="url(#mountainGradient)"
            />
            <polygon
              points="0,300 150,140 350,200 550,110 750,190 950,150 1200,220 1200,300"
              fill="url(#mountainGradient2)"
            />
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(30, 58, 138, 0.1)" />
              </linearGradient>
              <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                <stop offset="100%" stopColor="rgba(88, 28, 135, 0.05)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div variants={itemVariants} className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            {/* Expedition Badge */}
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card"
            >
              <SparklesIcon className="w-4 h-4 text-summitGold" />
              <span className="text-sm font-medium text-snowWhite">
                Live Expedition Tracking
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-snowWhite leading-tight"
            >
              Summit{" "}
              <span className="text-gradient-alpine">Chronicles</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl"
            >
              Journey through the Seven Summits with real-time tracking, 
              AI-powered insights, and immersive expedition documentation.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <MountainButton
              variant="gradient"
              size="lg"
              glowOnHover
              icon={<ArrowRightIcon className="w-5 h-5" />}
              iconPosition="right"
              className="min-w-48"
            >
              Begin Expedition
            </MountainButton>

            <MountainButton
              variant="ghost"
              size="lg"
              icon={<MapPinIcon className="w-5 h-5" />}
              className="min-w-48 text-snowWhite border-white/30 hover:bg-white/10"
            >
              Explore Routes
            </MountainButton>
          </motion.div>
        </motion.div>

        {/* Right Content - Status Dashboard */}
        <motion.div variants={itemVariants} className="space-y-6">
          <GlassCard 
            hover3D 
            glowEffect
            accentColor="rgba(59, 130, 246, 0.5)"
            className="p-8"
          >
            <div className="space-y-6">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-snowWhite">
                  Expedition Command
                </h3>
                <StatusIndicator
                  status="active"
                  text="Live"
                  size="sm"
                />
              </div>

              {/* Current Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-glacierBlue" />
                    <span className="text-sm text-gray-300">Current</span>
                  </div>
                  <div className="text-lg font-semibold text-snowWhite">
                    Base Camp
                  </div>
                  <div className="text-sm text-gray-400">
                    1,200m elevation
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FireIcon className="w-4 h-4 text-summitGold" />
                    <span className="text-sm text-gray-300">Next Target</span>
                  </div>
                  <div className="text-lg font-semibold text-snowWhite">
                    Camp I
                  </div>
                  <div className="text-sm text-gray-400">
                    2 weeks ETA
                  </div>
                </div>
              </div>

              {/* Training Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    Training Progress
                  </span>
                  <span className="text-sm text-summitGold font-semibold">
                    68%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-glacierBlue to-summitGold"
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
              </div>

              {/* Weather Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🌤️</div>
                  <div>
                    <div className="text-sm font-medium text-snowWhite">
                      Clear Conditions
                    </div>
                    <div className="text-xs text-gray-400">
                      -5°C, 15km/h winds
                    </div>
                  </div>
                </div>
                <StatusIndicator
                  status="success"
                  text="Safe"
                  size="sm"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-gray-400"
        >
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}