'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Helper to generate dynamic path command
// P0: Start (2014) - Fixed Low
// P1: Peak (2024 Denali) - Fixed High
// P2: Injury (2025) - Fixed Low (Dip)
// P3: Current (Dynamic based on VO2)
// P4: Goal (2027) - Fixed Peak
const generatePath = (currentVo2: number) => {
  // normalize VO2 (30-65 range) to Y-axis (350-50 range)
  // Higher VO2 = Lower Y (higher on graph)
  const constrainedVo2 = Math.min(Math.max(currentVo2, 35), 65);
  const normalizedY = 350 - ((constrainedVo2 - 35) / (65 - 35)) * 300;

  // X-Coords roughly mapped to: 2014(0), 2024(400), Nov2025(600), Now/2026(750), 2027(1000)

  return `M0,350 C150,350 250,100 400,120 C500,140 580,320 600,320 C650,320 700,${normalizedY} 1000,20`;
};

export const AscentVisualization = ({
  vo2Max,
}: {
  vo2Max?: number | string;
}) => {
  const currentVo2 = Number(vo2Max) || 45; // Default fallback
  const pathDefinition = generatePath(currentVo2);

  const [markerPos, setMarkerPos] = React.useState({ x: 600, y: 360 }); // Initial: Start at Injury
  const [daysSinceInjury, setDaysSinceInjury] = React.useState(0);
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    // 1. Calculate Day Count
    const injuryDate = new Date('2025-11-10T00:00:00'); // Fixed Injury Date
    const everestDate = new Date('2027-05-01T00:00:00'); // Target
    const today = new Date();

    // Ensure we don't go back in time for the 'current' marker logic (clamp to injury start minimum)
    const safeCurrentDate = today < injuryDate ? injuryDate : today;

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor(
      (safeCurrentDate.getTime() - injuryDate.getTime()) / msPerDay
    );
    setDaysSinceInjury(Math.max(0, daysDiff));

    // 2. Calculate X Position on Graph
    // Map time range (Nov 2025 -> May 2027) to SVG X coords (600 -> 980)
    const totalDuration = everestDate.getTime() - injuryDate.getTime();
    const elapsedDuration = safeCurrentDate.getTime() - injuryDate.getTime();
    let progress = elapsedDuration / totalDuration;
    progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1

    const startX = 600; // X cood for Injury
    const endX = 980; // X coord for Everest
    const targetX = startX + progress * (endX - startX);

    // 3. Find Exact Y using SVG Path
    // We binary search the path length to find the point with x === targetX
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      let start = 0;
      let end = len;
      let accuratePoint = { x: startX, y: 360 }; // Default

      // Binary search for precision
      for (let i = 0; i < 24; i++) {
        const mid = (start + end) / 2;
        const pt = path.getPointAtLength(mid);
        if (pt.x < targetX) {
          start = mid;
        } else {
          end = mid;
        }
        accuratePoint = pt;
      }
      setMarkerPos({ x: accuratePoint.x, y: accuratePoint.y });
    }
  }, []);

  // Timeline Config
  const startYear = 2014;
  const endYear = 2027;
  const totalYears = endYear - startYear;

  // Calculate relative position of "Now" (Jan 2026)
  // 2014 -> 2026 is 12 years. Total span is 13 years.
  // 12 / 13 = ~92% (Wait, that puts us too close to the end)
  // Let's adjust the narrative window to focus on the COMEBACK,
  // but keep 2014 as the "Ghost" origin.
  // Visual mapping: 0% = 2014, 100% = 2027 (Everest).

  // Actually, for better visual balance:
  // Let's make the graph focus on the current Campaign (The 7 Summits Project).
  // But the strategy said "Bedridden to Everest".
  // Let's stick to the wireframe curve logic.

  // Points for the SVG Path (0-1000 width, 0-400 height)
  // P0: 2014 (Bedridden) - Low
  // P1: 2024 (Denali) - High
  // P2: Nov 2025 (Injury) - Crash Low
  // P3: Jan 2026 (Now) - Recovery Start
  // P4: 2027 (Everest) - Peak High

  // First Peak (Denali 2024?): around x=400
  // Crash (Injury 2025): x=600, y=320 (dip)
  // Recovery (Now): x=650, y=300 (rising)
  // Peak (Everest 2027): x=1000, y=20 (high)

  return (
    <div className="w-full relative py-12 border-l border-b border-white/10 bg-[#0a0a0a]">
      {/* Container Constraints - Responsive Aspect Ratio */}
      {/* Mobile: Taller (16/10) to see details. Desktop: Panoramic (2.5/1) */}
      <div className="relative w-full aspect-[16/10] md:aspect-[2.5/1] overflow-hidden">
        {/* Background Grid Lines (Subtle) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
        </div>

        {/* The Graph */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 1000 400"
          // Removed preserveAspectRatio="none" to prevent distortion
        >
          {/* Defs for Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#333" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#333" stopOpacity="1" />
              <stop offset="70%" stopColor="#C5A059" stopOpacity="1" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base Path (Future/Grey) */}
          <path
            ref={pathRef} // Reference for calculations
            d={pathDefinition}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Active Path (Past to Present) - Animated */}
          <motion.path
            d={pathDefinition}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.68 }} // Can we make this dynamic too? Yes, but visual aesthetic 68% looks good for 'Now'.
            // Actually, pathLength 0.68 roughly corresponds to the X=665 point.
            // If we want the line to stop EXACTLY at the cursor, we'd need to calc pathLength percentage.
            // For now, let's keep the animation 'feeling' right (it draws past the injury dip).
            transition={{ duration: 2, ease: 'easeInOut' }}
            viewport={{ once: true }}
          />

          {/* SVG Labels (Fixed Coordinates) */}
          {/* Bedridden (2014) - P0: 0,350 */}
          <text
            x="30"
            y="380"
            className="text-xs md:text-sm font-mono fill-gray-400 font-bold"
          >
            BEDRIDDEN (2014)
          </text>

          {/* Denali (2025) - Peak around x=400, y=120 */}
          <text
            x="380"
            y="100"
            className="text-xs md:text-sm font-mono fill-gray-400 font-bold"
            textAnchor="middle"
          >
            DENALI (2025)
          </text>

          {/* Injury (Nov 2025) - Bottom of dip x=600, y=320 */}
          <text
            x="600"
            y="360"
            className="text-xs md:text-sm font-mono fill-red-400 font-bold"
            textAnchor="middle"
          >
            INJURY (NOV 2025)
          </text>

          {/* Everest (2027) - End x=1000, y=20 */}
          {/* Moved x to 900 to ensure full visibility on mobile screens */}
          <text
            x="900"
            y="40"
            className="text-xl md:text-2xl font-oswald fill-white"
            textAnchor="end"
          >
            EVEREST (2027)
          </text>
          <text
            x="900"
            y="60"
            className="text-[10px] md:text-xs font-mono fill-summit-gold tracking-widest"
            textAnchor="end"
          >
            TARGET: VO2 60+
          </text>

          {/* Current Position Marker (Dynamic) */}
          <motion.g
            animate={{ opacity: 1 }} // ensure visible
            initial={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            {/* Vertical Laser Line */}
            <line
              x1={markerPos.x}
              y1={0}
              x2={markerPos.x}
              y2={400}
              stroke="#C5A059"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="opacity-50"
            />
            {/* Pulse Dot */}
            <circle
              cx={markerPos.x}
              cy={markerPos.y}
              r="6"
              fill="#C5A059"
              filter="url(#glow)"
            >
              <animate
                attributeName="r"
                values="6;8;6"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* "You Are Here" Label Tag */}
            <foreignObject
              x={markerPos.x + 10}
              y={markerPos.y - 30}
              width="150"
              height="50"
            >
              <div className="bg-black/80 border border-summit-gold/30 px-2 py-1 text-[10px] font-mono text-summit-gold inline-block backdrop-blur-sm">
                DAY {daysSinceInjury} OF RECOVERY
                <br />
                <span className="text-white">YOU ARE HERE</span>
              </div>
            </foreignObject>
          </motion.g>
        </svg>
      </div>

      {/* Narrative Context */}
      <div className="mt-8 px-6 max-w-4xl">
        <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed">
          The path isn't linear. In 2025, I fell.{' '}
          <span className="text-white">Hard.</span> But the dip is just
          potential energy for the next rise. We are currently navigating the
          valley, building the foundation for the final ascent.
        </p>
      </div>
    </div>
  );
};
