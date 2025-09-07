"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  MapPinIcon,
  CalendarIcon,
  TrophyIcon,
  PhotoIcon,
  PlayIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  FireIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

interface Summit {
  name: string;
  elevation: string;
  continent: string;
  status: "completed" | "in_progress" | "planned";
  completedDate?: string;
  targetDate?: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  flag: string;
  coordinates: { lat: number; lng: number };
  temperature: string;
  climbingTime: string;
  highlights: string[];
  image: string;
  gallery: string[];
}

const sevenSummits: Summit[] = [
  {
    name: "Mount Elbrus",
    elevation: "5,642m",
    continent: "Europe",
    status: "completed",
    completedDate: "July 2022",
    description: "The highest peak in Europe, conquered during summer climbing season.",
    difficulty: 3,
    flag: "🇷🇺",
    coordinates: { lat: 43.3499, lng: 42.4453 },
    temperature: "-30°C to 15°C",
    climbingTime: "5-7 days",
    highlights: ["Dual summit", "Volcanic origin", "European record"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
      "https://images.unsplash.com/photo-1464822759844-d150baec93d5?w=300",
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300"
    ]
  },
  {
    name: "Mount Kilimanjaro",
    elevation: "5,895m",
    continent: "Africa", 
    status: "completed",
    completedDate: "March 2023",
    description: "Africa's rooftop. An incredible journey through five climate zones.",
    difficulty: 2,
    flag: "🇹🇿",
    coordinates: { lat: -3.0674, lng: 37.3556 },
    temperature: "-10°C to 30°C",
    climbingTime: "6-8 days",
    highlights: ["Five climate zones", "Uhuru Peak", "No technical climbing"],
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300"
    ]
  },
  {
    name: "Aconcagua",
    elevation: "6,961m",
    continent: "South America",
    status: "completed", 
    completedDate: "December 2023",
    description: "The Stone Sentinel. My first real test at high altitude.",
    difficulty: 4,
    flag: "🇦🇷",
    coordinates: { lat: -32.6532, lng: -70.0109 },
    temperature: "-40°C to 20°C",
    climbingTime: "12-18 days",
    highlights: ["Highest outside Asia", "Altitude sickness test", "Polish Glacier route"],
    image: "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=300",
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=300",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=300"
    ]
  },
  {
    name: "Mount McKinley",
    elevation: "6,190m",
    continent: "North America",
    status: "planned",
    targetDate: "June 2025",
    description: "Denali - the ultimate cold weather and technical challenge.",
    difficulty: 5,
    flag: "🇺🇸",
    coordinates: { lat: 63.0692, lng: -151.0070 },
    temperature: "-50°C to -10°C",
    climbingTime: "14-21 days",
    highlights: ["Coldest mountain", "Technical climbing", "Weather window crucial"],
    image: "https://images.unsplash.com/photo-1551524164-d526b2c22017?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1551524164-d526b2c22017?w=300",
      "https://images.unsplash.com/photo-1517824388924-41bafc36aea4?w=300"
    ]
  },
  {
    name: "Carstensz Pyramid", 
    elevation: "4,884m",
    continent: "Oceania",
    status: "planned",
    targetDate: "September 2026",
    description: "The technical climb. More rock climbing than mountaineering.",
    difficulty: 5,
    flag: "🇮🇩",
    coordinates: { lat: -4.0833, lng: 137.1833 },
    temperature: "0°C to 20°C",
    climbingTime: "3-5 days",
    highlights: ["Technical rock climb", "Equatorial glaciers", "Logistically complex"],
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300",
      "https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=300"
    ]
  },
  {
    name: "Mount Vinson",
    elevation: "4,892m", 
    continent: "Antarctica",
    status: "planned",
    targetDate: "December 2026",
    description: "The bottom of the world. Logistics and isolation are the main challenges.",
    difficulty: 4,
    flag: "🇦🇶",
    coordinates: { lat: -78.5254, lng: -85.6171 },
    temperature: "-40°C to -20°C",
    climbingTime: "7-10 days",
    highlights: ["24h daylight", "Extreme isolation", "Flying to base camp"],
    image: "https://images.unsplash.com/photo-1551524164-0c2b0c801dfc?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1551524164-0c2b0c801dfc?w=300",
      "https://images.unsplash.com/photo-1578445531803-50a26a02fad6?w=300"
    ]
  },
  {
    name: "Mount Everest",
    elevation: "8,849m",
    continent: "Asia",
    status: "in_progress",
    targetDate: "May 2027",
    description: "The ultimate goal. Everything leads to this moment.",
    difficulty: 5,
    flag: "🇳🇵",
    coordinates: { lat: 27.9881, lng: 86.9250 },
    temperature: "-60°C to 0°C",
    climbingTime: "45-60 days",
    highlights: ["Death zone", "Ultimate challenge", "World's highest"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
      "https://images.unsplash.com/photo-1464822759844-d150baec93d5?w=300",
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300",
      "https://images.unsplash.com/photo-1517824388924-41bafc36aea4?w=300"
    ]
  }
];

const statusColors = {
  completed: "text-green-400",
  in_progress: "text-summitGold",
  planned: "text-blue-400"
};

const statusBackgrounds = {
  completed: "from-green-400/20 to-green-600/20 border-green-400/30",
  in_progress: "from-summitGold/20 to-yellow-400/20 border-summitGold/30", 
  planned: "from-blue-400/20 to-purple-400/20 border-blue-400/30"
};

export default function EnhancedSevenSummitsTracker() {
  const [selectedSummit, setSelectedSummit] = useState<Summit | null>(null);
  const [hoveredSummit, setHoveredSummit] = useState<string | null>(null);
  const [activeStats, setActiveStats] = useState({
    completed: 0,
    totalElevation: 0,
    countries: 0
  });

  const completedCount = sevenSummits.filter(s => s.status === "completed").length;
  const progressPercentage = (completedCount / 7) * 100;

  // Animate stats on load
  useEffect(() => {
    const completed = sevenSummits.filter(s => s.status === "completed").length;
    const totalElevation = sevenSummits
      .filter(s => s.status === "completed")
      .reduce((sum, s) => sum + parseInt(s.elevation.replace(/[^\d]/g, "")), 0);
    const countries = new Set(sevenSummits.filter(s => s.status === "completed").map(s => s.continent)).size;

    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setActiveStats({
          completed: Math.floor(progress * completed),
          totalElevation: Math.floor(progress * totalElevation),
          countries: Math.floor(progress * countries)
        });

        if (step >= steps) {
          clearInterval(timer);
          setActiveStats({ completed, totalElevation, countries });
        }
      }, interval);
    };

    const timeout = setTimeout(animateStats, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-summitGold/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-sm text-white/90 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <TrophyIcon className="w-5 h-5 text-summitGold" />
            </motion.div>
            <span className="font-semibold">Seven Summits Challenge</span>
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-green-400 font-medium">ACTIVE</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Conquering the{" "}
            <motion.span
              className="bg-gradient-to-r from-summitGold via-yellow-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "200% 50%" }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
              style={{ backgroundSize: "300% 300%" }}
            >
              Seven Summits
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl text-white/70 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            The ultimate mountaineering challenge: reaching the highest peak on each continent. 
            From tropical glaciers to arctic storms, each summit tells a different story.
          </motion.p>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            {[
              { 
                label: "Summits Complete", 
                value: `${activeStats.completed}/7`, 
                color: "text-green-400",
                icon: TrophyIcon,
                suffix: ""
              },
              { 
                label: "Total Elevation", 
                value: `${Math.floor(activeStats.totalElevation / 1000)}`, 
                color: "text-blue-400",
                icon: MapPinIcon,
                suffix: "K meters"
              },
              { 
                label: "Continents", 
                value: `${activeStats.countries}`, 
                color: "text-purple-400",
                icon: GlobeAltIcon,
                suffix: "/7"
              },
              { 
                label: "Progress", 
                value: `${Math.round(progressPercentage)}`, 
                color: "text-summitGold",
                icon: BoltIcon,
                suffix: "%"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                  <motion.div 
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ${stat.color} mb-4`}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.8 }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}<span className="text-sm">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-summitGold/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </motion.div>
            ))}
          </div>

          {/* Animated Progress Ring */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 80}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                whileInView={{ 
                  strokeDashoffset: 2 * Math.PI * 80 * (1 - progressPercentage / 100)
                }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-summitGold mb-2">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-white/60">Complete</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Summit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sevenSummits.map((summit, index) => (
            <motion.div
              key={summit.name}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -15, rotateY: 5, scale: 1.05 }}
              onHoverStart={() => setHoveredSummit(summit.name)}
              onHoverEnd={() => setHoveredSummit(null)}
              onClick={() => setSelectedSummit(summit)}
              className="group relative cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${statusBackgrounds[summit.status]} backdrop-blur-sm border transition-all duration-500 group-hover:border-white/40`}>
                
                {/* Mountain Image Background */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <motion.img 
                    src={summit.image} 
                    alt={summit.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {summit.status === "completed" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: index * 0.1 }}
                        >
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        </motion.div>
                      )}
                      {summit.status === "in_progress" && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <ClockIcon className="w-6 h-6 text-summitGold" />
                        </motion.div>
                      )}
                      {summit.status === "planned" && (
                        <CalendarIcon className="w-6 h-6 text-blue-400" />
                      )}
                      <span className={`text-sm font-bold uppercase tracking-wider ${statusColors[summit.status]}`}>
                        {summit.status === "in_progress" ? "Training" : summit.status}
                      </span>
                    </div>
                    <motion.span 
                      className="text-3xl"
                      animate={{ scale: hoveredSummit === summit.name ? 1.3 : 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {summit.flag}
                    </motion.span>
                  </div>

                  {/* Summit Info */}
                  <h3 className="text-2xl font-bold text-white mb-2">{summit.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{summit.continent}</p>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPinIcon className="w-4 h-4 text-summitGold" />
                      <span className="text-sm font-medium">{summit.elevation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <FireIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{summit.temperature}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <ClockIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{summit.climbingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <PhotoIcon className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{summit.gallery.length} photos</span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-white/70">Difficulty:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 + index * 0.05 }}
                          className={`w-3 h-3 rounded-full ${
                            i < summit.difficulty ? "bg-red-400" : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-6 leading-relaxed line-clamp-3">
                    {summit.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {summit.highlights.slice(0, 2).map((highlight, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                          {highlight}
                        </span>
                      ))}
                      {summit.highlights.length > 2 && (
                        <span className="px-2 py-1 bg-summitGold/20 rounded-full text-xs text-summitGold">
                          +{summit.highlights.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-sm mb-6">
                    {summit.completedDate && (
                      <motion.span 
                        className="flex items-center gap-2 text-green-400 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Conquered {summit.completedDate}
                      </motion.span>
                    )}
                    {summit.targetDate && summit.status !== "completed" && (
                      <span className={`flex items-center gap-2 font-medium ${statusColors[summit.status]}`}>
                        <CalendarIcon className="w-4 h-4" />
                        Target: {summit.targetDate}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-summitGold/20 to-blue-400/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-300 group-hover:from-summitGold/30 group-hover:to-blue-400/30"
                  >
                    <PlayIcon className="w-4 h-4" />
                    View Details
                    <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-summitGold/5 via-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: 1,
                    background: `conic-gradient(from 0deg, transparent, ${
                      summit.status === 'completed' ? 'rgba(34,197,94,0.3)' :
                      summit.status === 'in_progress' ? 'rgba(245,158,11,0.3)' :
                      'rgba(59,130,246,0.3)'
                    }, transparent)`
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 0.3 }
                  }}
                  style={{ padding: "1px" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-6">
                Follow the Complete Journey
              </h3>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get exclusive expedition updates, training insights, gear reviews, and behind-the-scenes 
                content from each summit attempt. Join thousands following the Seven Summits challenge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-summitGold to-yellow-400 text-black font-bold rounded-2xl hover:shadow-2xl hover:shadow-summitGold/25 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5" />
                    Subscribe to Updates
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <PhotoIcon className="w-5 h-5" />
                    View Full Gallery
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summit Detail Modal */}
      <AnimatePresence>
        {selectedSummit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedSummit(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-6 mb-6">
                <img 
                  src={selectedSummit.image} 
                  alt={selectedSummit.name}
                  className="w-32 h-32 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedSummit.name}</h3>
                  <p className="text-white/60 mb-4">{selectedSummit.continent} • {selectedSummit.elevation}</p>
                  <div className="flex gap-2 mb-4">
                    {selectedSummit.highlights.map((highlight, i) => (
                      <span key={i} className="px-3 py-1 bg-summitGold/20 rounded-full text-sm text-summitGold">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-4xl">{selectedSummit.flag}</span>
              </div>
              
              <p className="text-white/80 leading-relaxed mb-6">{selectedSummit.description}</p>
              
              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedSummit.gallery.map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt={`${selectedSummit.name} ${i + 1}`}
                    className="w-full h-24 object-cover rounded-xl cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}