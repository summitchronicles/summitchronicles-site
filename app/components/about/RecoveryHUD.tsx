'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Wind, Battery } from 'lucide-react';

export const RecoveryHUD = () => {
  return (
    <div className="relative">
      {/* Glass Container */}
      <div className="bg-glass-panel backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        {/* Scanning Line Animation */}
        <motion.div
           animate={{ top: ['0%', '100%'] }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-summit-gold-400/50 to-transparent pointer-events-none z-10"
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-20">
            <div>
                <h3 className="text-sm font-medium text-summit-gold-400 tracking-[0.2em] uppercase mb-1">System Status</h3>
                <h2 className="text-3xl font-light text-white tracking-wide">RECOVERY PROTOCOL</h2>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-1 border border-summit-gold-500/30 rounded-full bg-summit-gold-900/10">
                <span className="text-xs font-mono text-summit-gold-400 animate-pulse">● LIVE METRICS</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-20">
             {/* Stat 1: Mobility */}
             <div className="bg-black/40 rounded-xl p-5 border border-white/5 relative group hover:border-summit-gold/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                     <Activity className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                     <span className="text-xs text-gray-500 font-mono">MOBILITY</span>
                 </div>
                 <div className="text-3xl font-light text-white mb-2">45%</div>
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                     <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '45%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-summit-gold-500"
                     />
                 </div>
             </div>

             {/* Stat 2: Heart Rate */}
             <div className="bg-black/40 rounded-xl p-5 border border-white/5 relative group hover:border-summit-gold/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                     <Heart className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                     <span className="text-xs text-gray-500 font-mono">RHR TREND</span>
                 </div>
                 <div className="text-3xl font-light text-white mb-2">48 <span className="text-sm text-gray-500">bpm</span></div>
                 <div className="flex space-x-1 items-end h-3">
                    {[40, 60, 45, 70, 50, 60, 55].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="w-1 bg-gray-700 rounded-sm"
                        />
                    ))}
                 </div>
             </div>

             {/* Stat 3: VO2 Max (Projected) */}
             <div className="bg-black/40 rounded-xl p-5 border border-white/5 relative group hover:border-summit-gold/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <Wind className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                     <span className="text-xs text-gray-500 font-mono">VO2 MAX</span>
                 </div>
                 <div className="text-3xl font-light text-white mb-2">58</div>
                 <p className="text-xs text-green-400">+2.4 vs Last Month</p>
             </div>

             {/* Stat 4: Date Target */}
             <div className="bg-black/40 rounded-xl p-5 border border-white/5 relative group hover:border-summit-gold/30 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                     <Battery className="w-5 h-5 text-gray-400 group-hover:text-summit-gold transition-colors" />
                     <span className="text-xs text-gray-500 font-mono">TARGET</span>
                 </div>
                 <div className="text-3xl font-light text-white mb-2">2028</div>
                 <p className="text-xs text-gray-400">Mar 1st Window</p>
             </div>
        </div>
      </div>
    </div>
  );
};
