'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Mountain } from 'lucide-react';

interface LiveStatusProps {
  className?: string;
}

export function LiveStatus({ className = '' }: LiveStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('');
  const [heartRate, setHeartRate] = useState(0);
  const [todaysProgress, setTodaysProgress] = useState(0);

  const everestDate = new Date('2028-03-15');
  const daysLeft = Math.ceil((everestDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();

    // Simulate realistic training status based on time of day
    if (hour >= 5 && hour < 7) {
      setStatus('Morning run in progress');
      setHeartRate(142 + Math.floor(Math.random() * 20));
      setTodaysProgress(25);
    } else if (hour >= 7 && hour < 9) {
      setStatus('Strength training session');
      setHeartRate(128 + Math.floor(Math.random() * 15));
      setTodaysProgress(60);
    } else if (hour >= 17 && hour < 19) {
      setStatus('Evening climbing session');
      setHeartRate(156 + Math.floor(Math.random() * 25));
      setTodaysProgress(85);
    } else if (hour >= 22 || hour < 5) {
      setStatus('Recovery mode');
      setHeartRate(58 + Math.floor(Math.random() * 8));
      setTodaysProgress(100);
    } else {
      setStatus('Analyzing training data');
      setHeartRate(72 + Math.floor(Math.random() * 10));
      setTodaysProgress(Math.min(90, Math.floor((hour - 5) * 10)));
    }
  }, [currentTime]);

  return (
    <div className={`bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono tracking-widest uppercase text-white/60">Live</span>
        </div>
        <div className="text-xs font-mono text-white/40">
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-4">
        <div className="text-sm font-medium text-white/90">
          {status}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          className="bg-white/5 rounded-xl p-3"
          animate={{ scale: heartRate > 140 ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: heartRate > 140 ? Infinity : 0 }}
        >
          <div className="flex items-center space-x-1.5 mb-1">
            <Heart className="w-3 h-3 text-red-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">HR</span>
          </div>
          <div className="text-lg font-bold text-red-400">
            {heartRate} <span className="text-[10px] font-normal text-white/40">bpm</span>
          </div>
        </motion.div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center space-x-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-summit-gold" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">Progress</span>
          </div>
          <div className="text-lg font-bold text-summit-gold">
            {todaysProgress}<span className="text-[10px] font-normal text-white/40">%</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="border-t border-white/5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Mountain className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Everest</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white">{daysLeft}</span>
            <span className="text-[10px] text-white/40 ml-1">days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
