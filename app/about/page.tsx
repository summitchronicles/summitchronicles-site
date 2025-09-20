'use client';

import { Header } from '../components/organisms/Header';
import { motion } from 'framer-motion';
import {
  Mountain,
  Target,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Camera,
  Compass,
} from 'lucide-react';

export default function AboutPage() {
  const achievements = [
    {
      year: '2023',
      mountain: 'Mount Kilimanjaro',
      elevation: '19,341 ft',
      location: 'Tanzania',
      significance: 'First Seven Summits achievement. Proof that systematic preparation works.',
    },
    {
      year: '2024',
      mountain: 'Mount Whitney',
      elevation: '14,505 ft',
      location: 'California',
      significance: 'Redemption climb. Technical alpine preparation and mental resilience testing.',
    },
    {
      year: '2024',
      mountain: 'Mount Washington',
      elevation: '6,288 ft',
      location: 'New Hampshire',
      significance: 'Winter conditions mastery. Sub-zero training for extreme environments.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section - Full screen with portrait */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="/stories/kilimanjaro.jpg"
            alt="Sunith Kumar - Mountaineer and Expedition Photographer"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="relative">
              <img
                src="/stories/data-training.jpg"
                alt="Sunith Kumar Portrait"
                className="w-full max-w-md rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white text-black px-4 py-2 text-sm font-medium">
                EXPEDITION PHOTOGRAPHER
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-4">
                SUNITH KUMAR
              </h1>
              <div className="flex items-center space-x-8 text-sm tracking-widest uppercase opacity-80 mb-8">
                <span>Mountaineer</span>
                <span>•</span>
                <span>Engineer</span>
                <span>•</span>
                <span>Storyteller</span>
              </div>
            </div>
            
            <div className="space-y-6 text-lg font-light leading-relaxed">
              <p>
                <strong className="text-white">The systematic approach to impossible goals.</strong> 
                What started as a failure on Mount Whitney became a methodical journey toward 
                the Seven Summits, driven by engineering principles and data-driven preparation.
              </p>
              <p>
                Based in the Pacific Northwest, I combine technical expertise with adventure 
                sports, documenting the intersection of systematic thinking and extreme mountaineering.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700">
              <div>
                <div className="text-2xl font-light">4/7</div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Summits</div>
              </div>
              <div>
                <div className="text-2xl font-light">541</div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Days to Everest</div>
              </div>
              <div>
                <div className="text-2xl font-light">7</div>
                <div className="text-xs uppercase tracking-wide text-gray-400">Years Climbing</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Story - Origin */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              THE STORY
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-light tracking-wide">From Failure to System</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong>14,000 feet. Mount Whitney. 2021.</strong> Gasping for air, watching my 
                climbing partner disappear into the clouds. That failure became the foundation 
                for everything that followed.
              </p>
              <p className="text-gray-300 leading-relaxed">
                I approached mountaineering the same way I approach engineering problems: 
                systematic analysis, iterative improvement, and measured progress toward 
                seemingly impossible goals.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>The Seven Summits became my laboratory</strong> for testing whether 
                methodical preparation could achieve extraordinary results in the world's 
                most unforgiving environments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="/stories/everest-prep.jpg"
                alt="Mount Whitney failure and learning"
                className="w-full rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              EXPEDITION RECORD
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="space-y-12">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.mountain}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-4 gap-6 items-center border-b border-gray-800 pb-8"
              >
                <div className="text-center md:text-left">
                  <div className="text-3xl font-light">{achievement.year}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Year</div>
                </div>
                
                <div>
                  <h3 className="text-xl font-light tracking-wide mb-2">{achievement.mountain}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{achievement.elevation}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{achievement.location}</span>
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {achievement.significance}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Approach */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              METHODOLOGY
            </h2>
            <div className="h-px w-24 bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-light tracking-wide">Systematic Preparation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every expedition follows detailed preparation protocols. Data-driven training, 
                equipment testing, and risk assessment replace guesswork with measured progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-light tracking-wide">Visual Documentation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Capturing both the triumph and struggle of extreme mountaineering. Every expedition 
                becomes a story that inspires others to pursue their own impossible goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-light tracking-wide">Community Impact</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Sharing methodologies, failures, and insights that help other adventure athletes 
                achieve their goals through systematic training and preparation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-3xl md:text-4xl font-light tracking-wide">
              Follow the Journey to Everest
            </h3>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              541 days of systematic preparation documented through field reports, 
              training insights, and expedition photography.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/expeditions"
                className="inline-flex items-center space-x-2 border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors"
              >
                <Mountain className="w-5 h-5" />
                <span>View Expeditions</span>
              </a>
              <a
                href="/support"
                className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 font-medium tracking-wide hover:bg-gray-200 transition-colors"
              >
                <span>Support the Mission</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

