"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  ArrowRightIcon, 
  PlayIcon,
  ChevronDownIcon,
  MapPinIcon,
  TrophyIcon,
  CalendarIcon,
  PhotoIcon,
  FilmIcon
} from "@heroicons/react/24/outline";

interface ExpeditionPreview {
  id: string;
  title: string;
  image: string;
  status: 'completed' | 'upcoming';
  elevation: string;
}

export default function EnhancedModernHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const mountainY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const mountainOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeExpedition, setActiveExpedition] = useState<ExpeditionPreview | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  
  const [showAnimation, setShowAnimation] = useState(false);

  const expeditionPreviews: ExpeditionPreview[] = [
    { id: '1', title: 'Mount Everest', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', status: 'upcoming', elevation: '8,849m' },
    { id: '2', title: 'Kilimanjaro', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300', status: 'completed', elevation: '5,895m' },
    { id: '3', title: 'Aconcagua', image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=300', status: 'completed', elevation: '6,962m' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Animate counters with smooth entrance effect
  useEffect(() => {
    // Start animation after component mounts
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-black"
    >
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%),
            radial-gradient(400px circle at ${mousePosition.x * 0.8}px ${mousePosition.y * 0.8}px, rgba(245, 158, 11, 0.1), transparent 40%)
          `
        }}
      />

      {/* Mountain Silhouettes with Parallax */}
      <motion.div
        style={{ y: mountainY, opacity: mountainOpacity }}
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none"
      >
        {/* Back mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            <defs>
              <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#111827', stopOpacity: 0.9 }} />
              </linearGradient>
              <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#374151', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#1f2937', stopOpacity: 0.7 }} />
              </linearGradient>
            </defs>
            
            {/* Far mountains */}
            <motion.path
              d="M0,400 L0,200 L200,150 L400,120 L600,180 L800,140 L1000,160 L1200,130 L1200,400 Z"
              fill="url(#mountain2)"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            {/* Near mountains */}
            <motion.path
              d="M0,400 L0,280 L150,200 L350,180 L550,240 L750,200 L950,220 L1200,180 L1200,400 Z"
              fill="url(#mountain1)"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0" 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating Expedition Previews */}
      <AnimatePresence>
        {expeditionPreviews.map((expedition, index) => (
          <motion.div
            key={expedition.id}
            className={`absolute w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${
              expedition.status === 'completed' ? 'border-green-400' : 'border-blue-400'
            }`}
            style={{
              top: `${20 + index * 15}%`,
              right: `${10 + index * 8}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: Math.sin(Date.now() / 1000 + index) * 10 
            }}
            transition={{ duration: 1, delay: 2 + index * 0.2 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            onClick={() => setActiveExpedition(expedition)}
          >
            <img 
              src={expedition.image} 
              alt={expedition.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-1 left-1 right-1">
              <div className="text-xs text-white font-medium truncate">{expedition.title}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Enhanced Badge with Live Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 text-sm text-white/80 mb-8"
        >
          <TrophyIcon className="w-4 h-4 text-summitGold" />
          <span>Professional Mountaineer</span>
          <div className="w-px h-4 bg-white/20" />
          <span>Seven Summits Challenger</span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-green-400 font-medium">ACTIVE</span>
        </motion.div>

        {/* Achievement Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-4 bg-summitGold/10 backdrop-blur-sm border border-summitGold/30 rounded-2xl px-6 py-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-summitGold" />
            <span className="text-summitGold font-bold text-lg">4/7 SUMMITS CONQUERED</span>
          </div>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-white/80 font-medium">2013-2024</span>
          <div className="w-px h-6 bg-summitGold/30" />
          <span className="text-glacierBlue font-medium">NEXT: VINSON MASSIF 2025</span>
        </motion.div>

        {/* Dynamic Heading with Typewriter Effect */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
        >
          <span className="block">Sunith Kumar</span>
          <motion.span
            className="block bg-gradient-to-r from-summitGold via-yellow-400 via-blue-400 to-summitGold bg-clip-text text-transparent"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "200% 50%" }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Conquering the Seven Summits
          </motion.span>
        </motion.h1>

        {/* Enhanced Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-12"
        >
          From the peaks of <span className="text-summitGold font-semibold">Kilimanjaro</span> to the summit of{" "}
          <span className="text-blue-400 font-semibold">Everest</span>. Follow my journey through{" "}
          <span className="text-white font-medium">real expeditions</span>,{" "}
          <span className="text-green-400 font-medium">proven training methods</span>, and{" "}
          <span className="text-purple-400 font-medium">gear that saves lives</span> at extreme altitude.
        </motion.p>

        {/* Enhanced Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
        >
          {[
            { 
              icon: TrophyIcon, 
              label: "Summits Conquered", 
              value: "4/7", 
              color: "text-summitGold",
              description: "Major Peaks"
            },
            { 
              icon: CalendarIcon, 
              label: "Training Days", 
              value: "365+", 
              color: "text-green-400",
              description: "This Year"
            },
            { 
              icon: MapPinIcon, 
              label: "Total Elevation", 
              value: "29k ft", 
              color: "text-blue-400",
              description: "Climbed"
            },
            { 
              icon: PhotoIcon, 
              label: "Next Target", 
              value: "2027", 
              color: "text-purple-400",
              description: "Everest"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -10, rotateY: 5 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500">
                <div className="flex items-center justify-center mb-4">
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ${stat.color}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-white/80 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-white/50">{stat.description}</div>
              </div>
              
              {/* Advanced Hover Effects */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-summitGold/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              <motion.div 
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  background: "linear-gradient(45deg, rgba(245,158,11,0.1), rgba(59,130,246,0.1), rgba(147,51,234,0.1))",
                  backgroundSize: "200% 200%",
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)"
            }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative px-10 py-5 bg-gradient-to-r from-summitGold to-yellow-400 text-black font-bold rounded-2xl overflow-hidden shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-3">
              <TrophyIcon className="w-6 h-6" />
              Follow My Journey
              <motion.div
                animate={{ 
                  x: isHovered ? 8 : 0,
                  rotate: isHovered ? 15 : 0
                }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
              >
                <ArrowRightIcon className="w-6 h-6" />
              </motion.div>
            </span>
            
            {/* Animated background particles */}
            <motion.div
              className="absolute inset-0"
              animate={isHovered ? {
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(245, 158, 11, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVideo(true)}
            className="group relative px-10 py-5 border-2 border-white/20 text-white font-bold rounded-2xl backdrop-blur-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <motion.div
                whileHover={{ 
                  scale: 1.3,
                  rotate: [0, -15, 15, 0] 
                }}
                transition={{ duration: 0.6 }}
              >
                <FilmIcon className="w-6 h-6" />
              </motion.div>
              Watch Story
            </span>
            
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              whileHover={{
                background: "conic-gradient(from 0deg, transparent, rgba(245,158,11,0.3), transparent, rgba(59,130,246,0.3), transparent)",
                rotate: 360
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ padding: "2px" }}
            />
          </motion.button>
        </motion.div>

        {/* Expedition Quick Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center text-white/60"
        >
          <p className="text-sm mb-2">Recent expedition highlights</p>
          <div className="flex justify-center gap-2">
            {['🏔️', '📸', '🎥', '📍'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ rotate: [0, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                className="text-lg"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center text-white/40 cursor-pointer group"
        >
          <span className="text-sm mb-3 group-hover:text-summitGold transition-colors">Explore Journey</span>
          <motion.div
            className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2 group-hover:border-summitGold transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full group-hover:bg-summitGold"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-summitGold/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </section>
  );
}