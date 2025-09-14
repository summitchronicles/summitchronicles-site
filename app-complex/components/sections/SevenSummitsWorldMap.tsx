"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";
import {
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

interface Summit {
  id: number;
  name: string;
  continent: string;
  elevation: string;
  country: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  completedDate?: string;
  coordinates: {
    x: number; // Percentage from left
    y: number; // Percentage from top
  };
  description: string;
  difficulty: 'Moderate' | 'Challenging' | 'Extreme';
  bestSeason: string;
}

const sevenSummits: Summit[] = [
  {
    id: 1,
    name: "Mount Denali",
    continent: "North America",
    elevation: "6,190m",
    country: "Alaska, USA",
    status: "completed",
    completedDate: "June 2023",
    coordinates: { x: 15, y: 35 },
    description: "The highest peak in North America, known for extreme weather and technical climbing challenges.",
    difficulty: "Extreme",
    bestSeason: "May - July"
  },
  {
    id: 2,
    name: "Mount Aconcagua", 
    continent: "South America",
    elevation: "6,961m",
    country: "Argentina",
    status: "completed",
    completedDate: "February 2023",
    coordinates: { x: 30, y: 70 },
    description: "The highest peak in South America and the highest mountain outside of Asia.",
    difficulty: "Challenging",
    bestSeason: "Dec - March"
  },
  {
    id: 3,
    name: "Mount Elbrus",
    continent: "Europe", 
    elevation: "5,642m",
    country: "Russia",
    status: "completed",
    completedDate: "July 2022",
    coordinates: { x: 57, y: 30 },
    description: "The highest peak in Europe, located in the Caucasus Mountains.",
    difficulty: "Moderate",
    bestSeason: "June - September"
  },
  {
    id: 4,
    name: "Mount Kilimanjaro",
    continent: "Africa",
    elevation: "5,895m", 
    country: "Tanzania",
    status: "in-progress",
    coordinates: { x: 60, y: 60 },
    description: "Africa's highest peak and the world's tallest free-standing mountain.",
    difficulty: "Moderate",
    bestSeason: "June - October"
  },
  {
    id: 5,
    name: "Mount Everest",
    continent: "Asia",
    elevation: "8,849m",
    country: "Nepal/Tibet",
    status: "planned",
    coordinates: { x: 75, y: 45 },
    description: "The world's highest mountain, the ultimate challenge for any mountaineer.",
    difficulty: "Extreme", 
    bestSeason: "April - May"
  },
  {
    id: 6,
    name: "Mount Vinson",
    continent: "Antarctica",
    elevation: "4,892m",
    country: "Antarctica",
    status: "future",
    coordinates: { x: 50, y: 95 },
    description: "The highest peak in Antarctica, extremely remote and technically challenging.",
    difficulty: "Extreme",
    bestSeason: "Nov - January"
  },
  {
    id: 7,
    name: "Puncak Jaya",
    continent: "Oceania",
    elevation: "4,884m",
    country: "Indonesia",
    status: "future",
    coordinates: { x: 85, y: 65 },
    description: "The highest peak in Oceania and one of the most technically difficult summits.",
    difficulty: "Extreme",
    bestSeason: "March - October"
  }
];

const getStatusColor = (status: Summit['status']) => {
  switch (status) {
    case 'completed': return 'text-successGreen bg-successGreen/10 border-successGreen/20';
    case 'in-progress': return 'text-summitGold bg-summitGold/10 border-summitGold/20';
    case 'planned': return 'text-alpineBlue bg-alpineBlue/10 border-alpineBlue/20';
    case 'future': return 'text-stoneGray bg-stoneGray/10 border-stoneGray/20';
    default: return 'text-stoneGray bg-stoneGray/10 border-stoneGray/20';
  }
};

const getStatusIcon = (status: Summit['status']) => {
  switch (status) {
    case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
    case 'in-progress': return <ClockIcon className="w-4 h-4" />;
    case 'planned': return <TrophyIcon className="w-4 h-4" />;
    case 'future': return <MapPinIcon className="w-4 h-4" />;
    default: return <MapPinIcon className="w-4 h-4" />;
  }
};

const getDifficultyColor = (difficulty: Summit['difficulty']) => {
  switch (difficulty) {
    case 'Moderate': return 'text-successGreen';
    case 'Challenging': return 'text-summitGold';
    case 'Extreme': return 'text-dangerRed';
    default: return 'text-stoneGray';
  }
};

export default function SevenSummitsWorldMap() {
  const [selectedSummit, setSelectedSummit] = useState<Summit | null>(null);
  const [hoveredSummit, setHoveredSummit] = useState<Summit | null>(null);

  const completedCount = sevenSummits.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedCount / 7) * 100;

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <TrophyIcon className="w-4 h-4" />
            World Map Journey
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Seven Summits{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              World Map
            </span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
            Follow my progress across all seven continents. Each peak represents months of training, 
            planning, and the ultimate test of endurance and determination.
          </p>

          {/* Progress Overview */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-summitGold">{completedCount}/7</div>
              <div className="text-sm text-white/60">Summits Completed</div>
            </div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-summitGold to-yellow-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-alpineBlue">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-white/60">Complete</div>
            </div>
          </div>
        </motion.div>

        {/* Interactive World Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
          {/* World Map SVG Background */}
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden">
            {/* Simplified world map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="white" strokeWidth="0.1"/>
                  </pattern>
                </defs>
                <rect width="100" height="60" fill="url(#grid)" />
              </svg>
            </div>

            {/* Summit Markers */}
            {sevenSummits.map((summit, index) => (
              <motion.div
                key={summit.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: `${summit.coordinates.x}%`, 
                  top: `${summit.coordinates.y}%` 
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                whileHover={{ scale: 1.2, y: -5 }}
                onHoverStart={() => setHoveredSummit(summit)}
                onHoverEnd={() => setHoveredSummit(null)}
                onClick={() => setSelectedSummit(summit)}
              >
                {/* Summit Pin */}
                <div className={clsx(
                  "relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  getStatusColor(summit.status),
                  selectedSummit?.id === summit.id && "ring-4 ring-white/30"
                )}>
                  {getStatusIcon(summit.status)}
                  
                  {/* Animated Ring for Completed Summits */}
                  {summit.status === 'completed' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-successGreen/50"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    />
                  )}
                  
                  {/* Pulsing for In-Progress */}
                  {summit.status === 'in-progress' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-summitGold/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Summit Label */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <motion.div
                    className={clsx(
                      "px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg font-medium transition-all duration-300",
                      (hoveredSummit?.id === summit.id || selectedSummit?.id === summit.id) ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredSummit?.id === summit.id || selectedSummit?.id === summit.id ? 1 : 0,
                      scale: hoveredSummit?.id === summit.id || selectedSummit?.id === summit.id ? 1 : 0.95
                    }}
                  >
                    {summit.name}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45" />
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Connection Lines for Completed Summits */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {sevenSummits
                .filter(s => s.status === 'completed')
                .map((summit, index, completed) => {
                  if (index === completed.length - 1) return null;
                  const nextSummit = completed[index + 1];
                  return (
                    <motion.line
                      key={`${summit.id}-${nextSummit.id}`}
                      x1={`${summit.coordinates.x}%`}
                      y1={`${summit.coordinates.y}%`}
                      x2={`${nextSummit.coordinates.x}%`}
                      y2={`${nextSummit.coordinates.y}%`}
                      stroke="url(#summitGradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="opacity-40"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: index * 0.5 + 1 }}
                    />
                  );
                })}
              <defs>
                <linearGradient id="summitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Summit Details Panel */}
        {selectedSummit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedSummit.name}</h3>
                <p className="text-white/60">{selectedSummit.continent} • {selectedSummit.country}</p>
              </div>
              <button
                onClick={() => setSelectedSummit(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-white/80 mb-2">Elevation</h4>
                <p className="text-xl font-bold text-summitGold">{selectedSummit.elevation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white/80 mb-2">Difficulty</h4>
                <p className={clsx("text-xl font-bold", getDifficultyColor(selectedSummit.difficulty))}>
                  {selectedSummit.difficulty}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white/80 mb-2">Best Season</h4>
                <p className="text-xl font-bold text-glacierBlue">{selectedSummit.bestSeason}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/80 mb-3">Status</h4>
              <div className={clsx(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium",
                getStatusColor(selectedSummit.status)
              )}>
                {getStatusIcon(selectedSummit.status)}
                <span className="capitalize">{selectedSummit.status.replace('-', ' ')}</span>
                {selectedSummit.completedDate && (
                  <span className="ml-2 text-xs opacity-80">• {selectedSummit.completedDate}</span>
                )}
              </div>
            </div>

            <p className="text-white/70 leading-relaxed">{selectedSummit.description}</p>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { status: 'completed', label: 'Completed', count: sevenSummits.filter(s => s.status === 'completed').length },
            { status: 'in-progress', label: 'In Progress', count: sevenSummits.filter(s => s.status === 'in-progress').length },
            { status: 'planned', label: 'Planned', count: sevenSummits.filter(s => s.status === 'planned').length },
            { status: 'future', label: 'Future', count: sevenSummits.filter(s => s.status === 'future').length },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <div className={clsx(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                getStatusColor(item.status as Summit['status'])
              )}>
                {getStatusIcon(item.status as Summit['status'])}
              </div>
              <div>
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-white/60 text-sm">{item.count} summit{item.count !== 1 ? 's' : ''}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}