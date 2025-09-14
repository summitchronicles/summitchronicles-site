"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

interface CalendarDay {
  date: number;
  activity?: string;
  type: 'cardio' | 'strength' | 'technical' | 'rest' | 'endurance';
  intensity: 'low' | 'moderate' | 'high';
  duration?: string;
  isToday?: boolean;
  isCompleted?: boolean;
}

interface TrainingCalendarProps {
  month?: number;
  year?: number;
}

export default function TrainingCalendar({ month = new Date().getMonth(), year = new Date().getFullYear() }: TrainingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate training schedule for the month
  const generateMonthSchedule = (): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
    
    const schedule: CalendarDay[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      schedule.push({ date: 0, type: 'rest', intensity: 'low' });
    }
    
    // Training pattern: 6 days on, 1 day off
    const trainingPattern = [
      { activity: "Loaded Cardio + Core", type: 'cardio' as const, intensity: 'moderate' as const, duration: "90min" },
      { activity: "Strength Training", type: 'strength' as const, intensity: 'high' as const, duration: "75min" },
      { activity: "Active Recovery", type: 'rest' as const, intensity: 'low' as const, duration: "45min" },
      { activity: "Altitude Simulation", type: 'cardio' as const, intensity: 'high' as const, duration: "60min" },
      { activity: "Technical Skills", type: 'technical' as const, intensity: 'moderate' as const, duration: "120min" },
      { activity: "Long Endurance", type: 'endurance' as const, intensity: 'moderate' as const, duration: "3-5hr" },
      { activity: "Complete Rest", type: 'rest' as const, intensity: 'low' as const, duration: "0min" }
    ];
    
    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const patternIndex = (day - 1) % 7;
      const pattern = trainingPattern[patternIndex];
      
      schedule.push({
        date: day,
        activity: pattern.activity,
        type: pattern.type,
        intensity: pattern.intensity,
        duration: pattern.duration,
        isToday: isCurrentMonth && day === today.getDate(),
        isCompleted: completedDays.has(day)
      });
    }
    
    return schedule;
  };

  const getTypeColor = (type: CalendarDay['type']) => {
    switch (type) {
      case 'cardio': return 'bg-orange-500';
      case 'strength': return 'bg-red-500';
      case 'technical': return 'bg-purple-500';
      case 'endurance': return 'bg-blue-500';
      case 'rest': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getIntensityBorder = (intensity: CalendarDay['intensity']) => {
    switch (intensity) {
      case 'low': return 'border-green-400/50';
      case 'moderate': return 'border-yellow-400/50';
      case 'high': return 'border-red-400/50';
    }
  };

  const toggleCompleted = (date: number) => {
    const newCompleted = new Set(completedDays);
    if (newCompleted.has(date)) {
      newCompleted.delete(date);
    } else {
      newCompleted.add(date);
    }
    setCompletedDays(newCompleted);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const exportCalendar = () => {
    // In a real implementation, this would generate a PDF or ICS file
    alert('Calendar export functionality coming soon! For now, take a screenshot or print this page.');
  };

  const schedule = generateMonthSchedule();

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="w-6 h-6 text-summitGold" />
          <h3 className="text-xl font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={exportCalendar}
            className="ml-2 px-3 py-2 bg-summitGold/20 text-summitGold rounded-lg hover:bg-summitGold/30 transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-white/60 text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {schedule.map((day, index) => (
          <motion.div
            key={index}
            whileHover={day.date > 0 ? { scale: 1.05 } : undefined}
            className={`
              aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer
              ${day.date === 0 ? 'invisible' : ''}
              ${day.isToday ? 'ring-2 ring-summitGold' : ''}
              ${day.isCompleted ? 'bg-green-500/20 border-green-400' : 'bg-white/5 hover:bg-white/10'}
              ${day.date > 0 ? getIntensityBorder(day.intensity) : ''}
            `}
            onClick={() => day.date > 0 && toggleCompleted(day.date)}
          >
            {day.date > 0 && (
              <div className="h-full p-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{day.date}</span>
                  {day.isCompleted && (
                    <CheckCircleIcon className="w-3 h-3 text-green-400" />
                  )}
                </div>
                
                <div className={`w-full h-1 rounded-full ${getTypeColor(day.type)} mb-1`}></div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-white/80 text-xs font-medium leading-tight">
                    {day.activity}
                  </p>
                  {day.duration && (
                    <p className="text-white/50 text-xs mt-1">
                      {day.duration}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-sm">Training Types:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { type: 'cardio', label: 'Cardio', color: 'bg-orange-500' },
            { type: 'strength', label: 'Strength', color: 'bg-red-500' },
            { type: 'technical', label: 'Technical', color: 'bg-purple-500' },
            { type: 'endurance', label: 'Endurance', color: 'bg-blue-500' },
            { type: 'rest', label: 'Recovery', color: 'bg-green-500' }
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <span className="text-white/60">{item.label}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-white/10">
          <p className="text-white/50 text-xs">
            Click on any day to mark it as completed. Border color indicates intensity level.
          </p>
        </div>
      </div>
    </div>
  );
}