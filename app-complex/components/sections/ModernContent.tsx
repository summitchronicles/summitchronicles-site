'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BookOpenIcon,
  MapIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const contentSections = [
  {
    icon: MapIcon,
    title: 'Expedition Chronicles',
    subtitle: 'Kilimanjaro 2023',
    description:
      'My first of the Seven Summits - a journey of discovery, challenge, and triumph at 19,341 feet above sea level.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Latest',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cog6ToothIcon,
    title: 'Gear & Equipment',
    subtitle: 'La Sportiva Boots',
    description:
      'Field-tested on Elbrus slopes. Comprehensive review of performance, durability, and comfort in extreme conditions.',
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Review',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BookOpenIcon,
    title: 'Mountain Wisdom',
    subtitle: 'Aconcagua Reflections',
    description:
      "Lessons learned from the high camps of South America's highest peak. Mental preparation and altitude strategies.",
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Insights',
    color: 'from-purple-500 to-violet-500',
  },
];

export default function ModernContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <SparklesIcon className="w-4 h-4 text-summitGold" />
            Stories & Insights
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Beyond the <span className="text-summitGold">Summit</span>
          </h2>

          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Dive deep into expedition stories, gear reviews, and hard-won wisdom
            from the world&rsquo;s highest peaks.
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {contentSections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={item}
              whileHover={{ scale: 1.03, y: -10 }}
              className="group relative"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Tag */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${section.color} text-white`}
                  >
                    {section.tag}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`absolute bottom-4 left-4 p-3 rounded-2xl bg-gradient-to-br ${section.color}/20 backdrop-blur-sm border border-white/20`}
                  >
                    <section.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-summitGold transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-sm text-summitGold font-medium">
                      {section.subtitle}
                    </p>
                  </div>

                  <p className="text-white/70 leading-relaxed mb-6">
                    {section.description}
                  </p>

                  {/* Read More Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 group/button"
                  >
                    <span className="text-sm font-medium">Read More</span>
                    <motion.div className="group-hover/button:translate-x-1 transition-transform duration-300">
                      <ArrowRightIcon className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                />
              </div>

              {/* External Glow Effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* AI Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-alpineBlue/20 via-glacierBlue/20 to-summitGold/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden group"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-alpineBlue to-glacierBlue rounded-2xl mb-6"
                >
                  <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ask the <span className="text-summitGold">Mountain</span>
                </h3>

                <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Get instant answers about expeditions, training techniques,
                  gear recommendations, and mountaineering wisdom powered by AI.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-summitGold transition-colors duration-300 group/cta"
                >
                  <span className="flex items-center gap-2">
                    Start Conversation
                    <motion.div className="group-hover/cta:translate-x-1 transition-transform duration-300">
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.div>
                  </span>
                </motion.button>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-alpineBlue/10 to-summitGold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </motion.div>

            {/* External Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-alpineBlue/20 to-summitGold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
