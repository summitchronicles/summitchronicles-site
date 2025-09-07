"use client";

import { motion } from "framer-motion";
import SevenSummitsTracker from "../components/sections/SevenSummitsTracker";
import SevenSummitsWorldMap from "../components/sections/SevenSummitsWorldMap";
import ExpeditionTimeline from "../components/sections/ExpeditionTimeline";
import {
  MapPinIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function TheJourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-8"
          >
            <TrophyIcon className="w-4 h-4 text-summitGold" />
            Seven Summits Progress
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            The{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Seven Summits
            </span>{" "}
            Journey
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
            Follow my progress as I work toward climbing the highest peak on each continent. 
            Real expeditions, authentic stories, and lessons learned at altitude.
          </p>

          {/* Current Status */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-summitGold mb-1">3</div>
                <div className="text-sm text-white/60">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">1</div>
                <div className="text-sm text-white/60">In Progress</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/60 mb-1">3</div>
                <div className="text-sm text-white/60">Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">2027</div>
                <div className="text-sm text-white/60">Everest Target</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Seven Summits Tracker */}
      <SevenSummitsTracker />

      {/* Interactive World Map */}
      <SevenSummitsWorldMap />

      {/* Enhanced Timeline */}
      <ExpeditionTimeline />

      {/* Old Timeline - Remove this section */}
      <section className="py-20" style={{display: "none"}}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              The Journey{" "}
              <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
                Timeline
              </span>
            </h2>
            <p className="text-xl text-white/70">
              Every peak tells a story. Here's the chronological journey through my Seven Summits challenge.
            </p>
          </motion.div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {[
              {
                date: "July 2022",
                peak: "Mount Elbrus",
                continent: "Europe",
                status: "completed",
                story: "My first major summit. The weather window was perfect, but I learned hard lessons about proper acclimatization and the importance of starting early. The descent in whiteout conditions taught me respect for mountain weather.",
                elevation: "5,642m",
                difficulty: "Moderate",
                lessons: ["Weather can change instantly", "Proper layering is crucial", "Mental preparation matters as much as physical"]
              },
              {
                date: "March 2023", 
                peak: "Mount Kilimanjaro",
                continent: "Africa",
                status: "completed", 
                story: "The Machame route via Barranco Wall. This climb taught me about altitude sickness management and the importance of 'pole pole' (slowly slowly). The sunrise at Uhuru Peak was life-changing.",
                elevation: "5,895m",
                difficulty: "Moderate",
                lessons: ["Altitude affects everyone differently", "Mental toughness on summit day", "Proper hydration is critical"]
              },
              {
                date: "December 2023",
                peak: "Aconcagua", 
                continent: "South America",
                status: "completed",
                story: "The Stone Sentinel pushed me to my limits. High winds, brutal cold, and my first real experience with high altitude. I had to turn back once due to weather, but returned stronger and made the summit on my second attempt.",
                elevation: "6,961m", 
                difficulty: "Technical",
                lessons: ["Know when to turn back", "High altitude changes everything", "Proper gear can save your life"]
              },
              {
                date: "June 2025",
                peak: "Mount McKinley (Denali)",
                continent: "North America", 
                status: "planned",
                story: "My next major challenge. Denali's extreme cold and technical climbing sections will test everything I've learned so far. Currently in intensive cold weather training and crevasse rescue practice.",
                elevation: "6,190m",
                difficulty: "Very Technical", 
                lessons: ["Currently preparing..."]
              },
              {
                date: "September 2026",
                peak: "Carstensz Pyramid", 
                continent: "Oceania",
                status: "planned",
                story: "The technical climb that's more rock climbing than mountaineering. Already working with climbing coaches to improve my technical rock skills for this unique challenge.",
                elevation: "4,884m",
                difficulty: "Extremely Technical",
                lessons: ["Future expedition..."]
              },
              {
                date: "December 2026", 
                peak: "Mount Vinson",
                continent: "Antarctica",
                status: "planned",
                story: "Antarctica - the bottom of the world. The logistics alone are staggering. Currently researching expedition companies and building the budget for this remote adventure.",
                elevation: "4,892m",
                difficulty: "Logistically Complex",
                lessons: ["Planning phase..."]
              },
              {
                date: "May 2027",
                peak: "Mount Everest", 
                continent: "Asia",
                status: "in_progress",
                story: "The ultimate goal. Everything I've learned, every training session, every summit leads to this moment. Currently in the multi-year preparation phase with altitude training, technical skill development, and expedition planning.",
                elevation: "8,849m",
                difficulty: "Extreme",
                lessons: ["The journey of a lifetime begins with preparation..."]
              }
            ].map((expedition, index) => (
              <motion.div
                key={expedition.peak}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${
                  expedition.status === 'completed' ? 'border-successGreen/30' : 
                  expedition.status === 'in_progress' ? 'border-summitGold/30' : 'border-white/10'
                }`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          expedition.status === 'completed' ? 'bg-successGreen' :
                          expedition.status === 'in_progress' ? 'bg-summitGold' : 'bg-white/40'
                        }`} />
                        <span className="text-sm text-white/60 uppercase tracking-wide">
                          {expedition.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{expedition.peak}</h3>
                      <p className="text-white/60 mb-4">{expedition.continent}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-summitGold" />
                          <span className="text-white/80">{expedition.elevation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrophyIcon className="w-4 h-4 text-summitGold" />
                          <span className="text-white/80">{expedition.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <p className="text-white/80 leading-relaxed mb-6">
                        {expedition.story}
                      </p>
                      
                      {expedition.lessons.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-summitGold mb-2 uppercase tracking-wide">
                            Key Lessons
                          </h4>
                          <ul className="space-y-1">
                            {expedition.lessons.map((lesson, i) => (
                              <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-summitGold rounded-full mt-2 flex-shrink-0" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to Follow the Journey?
              </h3>
              <p className="text-lg text-white/70 mb-8">
                Get behind-the-scenes access to my training, expedition planning, 
                gear testing, and the real challenges of pursuing the Seven Summits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Subscribe to Updates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                >
                  View Training Data
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}