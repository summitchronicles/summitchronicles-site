"use client";

import { GlassCard } from "@/app/components/ui";
import { TrophyIcon } from "@heroicons/react/24/outline";

export default function GoalSettingSimple() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-summitGold to-warningOrange rounded-xl">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Smart Goal Setting</h2>
            <p className="text-gray-400">AI-powered goal tracking with success predictions</p>
          </div>
        </div>
      </div>

      {/* Sample Goal Card */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Summit Mount Rainier
        </h3>
        <p className="text-gray-300 mb-4">
          Complete a successful summit attempt of Mount Rainier via Disappointment Cleaver route
        </p>
        
        <div className="bg-summitGold/10 rounded-lg p-3 border-l-4 border-summitGold">
          <h5 className="text-sm font-medium text-summitGold mb-2">
            AI Success Prediction:
          </h5>
          <p className="text-xs text-gray-300">
            Based on your current training, you have a 78% probability of successfully completing this goal.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Goal Setting Test
        </h3>
        <p className="text-gray-400">
          This is a simplified version to test if the component renders properly.
        </p>
      </GlassCard>
    </div>
  );
}