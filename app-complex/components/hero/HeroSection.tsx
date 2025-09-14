"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import ExpeditionStatus from "./ExpeditionStatus";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Server-side fallback without animations
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-alpineBlue to-glacierBlue overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Stories from the World&rsquo;s{" "}
            <span className="text-gradient-summit">Peaks</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Follow the Seven Summits journey - from base camp to summit, every step documented with precision and passion.
          </p>
          <ExpeditionStatus />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`relative h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Mountain Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759844-d150baec3011?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        {/* Gradient Overlay for Better Text Readability */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Atmospheric Effects */}
      <div className="absolute inset-0 z-5">
        {/* Mountain Ridge Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Subtle Cloud Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent mix-blend-overlay"></div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        style={{ y: textY }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Hero Title */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stories from the World&rsquo;s{" "}
          <motion.span 
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="bg-gradient-to-r from-summitGold via-yellow-300 to-summitGold bg-clip-text text-transparent font-extrabold">
              Peaks
            </span>
            {/* Decorative underline */}
            <motion.div 
              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-summitGold to-yellow-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
          </motion.span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Follow the Seven Summits journey - from base camp to summit, every step documented with{" "}
          <span className="text-glacierBlue font-semibold">precision</span> and{" "}
          <span className="text-summitGold font-semibold">passion</span>.
        </motion.p>

        {/* Expedition Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <ExpeditionStatus />
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.button
            className="px-8 py-4 bg-alpineBlue text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-alpineBlue/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Current Expedition
          </motion.button>
          <motion.button
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Training Journey
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        <motion.div
          className="flex flex-col items-center text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm font-medium mb-2">Discover More</span>
          <ChevronDownIcon className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-summitGold rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 left-32 w-1 h-1 bg-glacierBlue rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-32 right-40 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-50"></div>
    </section>
  );
}