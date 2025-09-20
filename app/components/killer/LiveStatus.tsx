'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, TrendingUp, Mountain } from 'lucide-react';

interface LiveStatusProps {
  className?: string;
}

export function LiveStatus({ className = '' }: LiveStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('');
  const [heartRate, setHeartRate] = useState(0);
  const [todaysProgress, setTodaysProgress] = useState(0);

  const everestDate = new Date('2027-03-15');
  const daysLeft = Math.ceil((everestDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    
    // Simulate realistic training status based on time of day
    if (hour >= 5 && hour < 7) {
      setStatus('🏃‍♂️ Morning run in progress');
      setHeartRate(142 + Math.floor(Math.random() * 20));
      setTodaysProgress(25);
    } else if (hour >= 7 && hour < 9) {
      setStatus('💪 Strength training session');
      setHeartRate(128 + Math.floor(Math.random() * 15));
      setTodaysProgress(60);
    } else if (hour >= 17 && hour < 19) {
      setStatus('🧗‍♂️ Evening climbing session');
      setHeartRate(156 + Math.floor(Math.random() * 25));
      setTodaysProgress(85);
    } else if (hour >= 22 || hour < 5) {
      setStatus('😴 Recovery time');
      setHeartRate(58 + Math.floor(Math.random() * 8));
      setTodaysProgress(100);
    } else {
      setStatus('📊 Analyzing today\'s data');
      setHeartRate(72 + Math.floor(Math.random() * 10));
      setTodaysProgress(Math.min(90, Math.floor((hour - 5) * 10)));
    }
  }, [currentTime]);

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-spa-stone/20 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-spa-charcoal">Live Status</h3>
        </div>
        <div className="text-sm text-spa-charcoal/60">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short' 
          })}
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-6">
        <div className="text-lg font-medium text-spa-charcoal mb-2">
          {status}
        </div>
        <div className="text-sm text-spa-charcoal/70">
          Right now, somewhere in the Pacific Northwest
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="bg-spa-mist/20 rounded-xl p-4"
          animate={{ scale: heartRate > 140 ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: heartRate > 140 ? Infinity : 0 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-spa-charcoal">Heart Rate</span>
          </div>
          <div className="text-2xl font-bold text-red-500">
            {heartRate} <span className="text-sm font-normal">bpm</span>
          </div>
        </motion.div>

        <div className="bg-spa-mist/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-spa-charcoal">Today's Progress</span>
          </div>
          <div className="text-2xl font-bold text-blue-500">
            {todaysProgress}<span className="text-sm font-normal">%</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="border-t border-spa-stone/20 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mountain className="w-4 h-4 text-alpine-blue" />
            <span className="text-sm font-medium text-spa-charcoal">Everest Countdown</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-alpine-blue">
              {daysLeft}
            </div>
            <div className="text-xs text-spa-charcoal/60">days remaining</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 pt-4 border-t border-spa-stone/20">
        <div className="text-center">
          <div className="text-sm text-spa-charcoal/70 mb-3">
            Every training session brings us closer to the summit
          </div>
          <motion.a 
            href="/support"
            className="inline-flex items-center space-x-2 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-4 h-4" />
            <span>Support the Journey</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}