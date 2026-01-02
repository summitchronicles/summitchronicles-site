'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Footprints,
  Dumbbell,
  Mountain,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface RecoveryStep {
  id: string;
  label: string;
  subLabel: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  icon: React.ElementType;
}

const steps: RecoveryStep[] = [
  {
    id: 'walk',
    label: 'Walk Again',
    subLabel: 'Rehabilitate Talus',
    status: 'in-progress',
    icon: Footprints
  },
  {
    id: 'fitness',
    label: 'Full Fitness',
    subLabel: 'Rebuild Strength',
    status: 'upcoming',
    icon: Dumbbell
  },
  {
    id: 'everest',
    label: 'Everest 2028',
    subLabel: 'The Return',
    status: 'upcoming',
    icon: Mountain
  }
];

export const RecoveryProgress = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 border border-gray-100 shadow-spa-soft mb-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-light text-spa-charcoal">The Path Back</h3>
          <p className="text-sm text-spa-slate mt-1">Recovery & Training Roadmap</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-alpine-blue-50 px-3 py-1 rounded-full border border-alpine-blue-100">
          <div className="w-2 h-2 bg-summit-gold-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-alpine-blue-700">CURRENT FOCUS: REHABILITATION</span>
        </div>
      </div>

      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-100 rounded-full hidden md:block"></div>

        {/* Active Progress Bar (33% for Step 1 in progress) */}
        <div className="absolute top-8 left-0 w-1/6 h-1 bg-summit-gold-400 rounded-full hidden md:block"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in-progress';
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-row md:flex-col items-center md:text-center space-x-4 md:space-x-0 relative group">
                {/* Mobile Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-[-2rem] w-0.5 bg-gray-100 md:hidden"></div>
                )}

                <div className={`
                  w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-white
                  ${isCompleted ? 'border-green-500 text-green-600' : ''}
                  ${isInProgress ? 'border-summit-gold-400 text-summit-gold-600 shadow-lg scale-110' : ''}
                  ${step.status === 'upcoming' ? 'border-gray-100 text-gray-300' : ''}
                `}>
                  <Icon className={`w-5 h-5 md:w-7 md:h-7 ${isInProgress ? 'animate-pulse' : ''}`} />
                </div>

                <div className="flex-1 md:mt-4">
                  <h4 className={`text-lg font-medium transition-colors ${
                    step.status === 'upcoming' ? 'text-gray-400' : 'text-spa-charcoal'
                  }`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-spa-slate">{step.subLabel}</p>
                </div>

                <div className="md:hidden ml-auto">
                   {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                   {isInProgress && <div className="w-3 h-3 bg-summit-gold-500 rounded-full animate-pulse mx-1"></div>}
                   {step.status === 'upcoming' && <Circle className="w-4 h-4 text-gray-200" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
