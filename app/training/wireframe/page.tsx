'use client';

import React from 'react';
import { WeeklyProtocolLog } from '@/app/components/training/WeeklyProtocolLog';

export default function WireframePage() {
  // Mock Data mimicking the "Weekly Pulse" structure
  const mockActivities = [
    // Week 1 (Active/Current)
    {
      activityId: 1,
      activityName: 'Mobility & Band Work',
      startTimeLocal: new Date().toISOString(),
      distance: 0,
      duration: 2700,
      elevationGain: 0,
      activityType: { typeKey: 'fitness_equipment' },
      description:
        'Focus: Ankle dorsiflexion. Felt stiff initially but loosened up after 10 mins.',
    },
    {
      activityId: 2,
      activityName: 'Upper Body Circuit',
      startTimeLocal: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      distance: 0,
      duration: 3600,
      elevationGain: 0,
      activityType: { typeKey: 'strength_training' },
      description: 'Maintained intensity. Shoulder press 3x12. No knee pain.',
    },
    {
      activityId: 3,
      activityName: 'Rehab - Core Stabilization',
      startTimeLocal: new Date(Date.now() - 2 * 86400000).toISOString(),
      distance: 0,
      duration: 1800,
      elevationGain: 0,
      activityType: { typeKey: 'pilates' },
      description: 'Planks and dead bugs. Keep the engine running.',
    },

    // Week 2 (Past)
    {
      activityId: 4,
      activityName: 'Full Rest / Travel',
      startTimeLocal: new Date(Date.now() - 7 * 86400000).toISOString(),
      distance: 0,
      duration: 0,
      elevationGain: 0,
      activityType: { typeKey: 'uncategorized' },
      description: 'Long flight. Swelling managed with compression socks.',
    },
    {
      activityId: 5,
      activityName: 'Hotel Room Mobility',
      startTimeLocal: new Date(Date.now() - 8 * 86400000).toISOString(),
      distance: 0,
      duration: 1200,
      elevationGain: 0,
      activityType: { typeKey: 'yoga' },
      description: 'Quick session to combat travel stiffness.',
    },

    // Week 3 (Past)
    {
      activityId: 6,
      activityName: 'Strength - Push',
      startTimeLocal: new Date(Date.now() - 14 * 86400000).toISOString(),
      distance: 0,
      duration: 4000,
      elevationGain: 0,
      activityType: { typeKey: 'strength_training' },
      description: 'Solid session. New PR on seated overhead press.',
    },
    {
      activityId: 7,
      activityName: 'Active Recovery',
      startTimeLocal: new Date(Date.now() - 15 * 86400000).toISOString(),
      distance: 0,
      duration: 3000,
      elevationGain: 0,
      activityType: { typeKey: 'walking' }, // Simulation
      description: 'Crutch-assisted walking laps. 20 mins. Heart rate low.',
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-oswald text-white mb-2">
            WIREFRAME VIEW
          </h1>
          <p className="font-mono text-zinc-500 text-sm">
            Weekly Protocol Log Component
          </p>
        </div>

        <WeeklyProtocolLog activities={mockActivities} />
      </div>
    </div>
  );
}
