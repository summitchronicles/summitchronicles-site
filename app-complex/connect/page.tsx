'use client';

import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PresentationChartLineIcon,
  CameraIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  UserGroupIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

export default function ConnectPage() {
  const collaborationTypes = [
    {
      icon: PresentationChartLineIcon,
      title: 'Speaking Engagements',
      description:
        'Keynotes and presentations on mountaineering, goal-setting, perseverance, and overcoming challenges.',
      topics: [
        'Seven Summits Journey',
        'Goal Achievement',
        'Risk Management',
        'Team Leadership',
      ],
    },
    {
      icon: UserGroupIcon,
      title: 'Brand Partnerships',
      description:
        'Authentic partnerships with outdoor gear, fitness, and lifestyle brands that align with my values.',
      topics: [
        'Gear Testing',
        'Product Reviews',
        'Brand Ambassadorship',
        'Content Creation',
      ],
    },
    {
      icon: CameraIcon,
      title: 'Media & Press',
      description:
        'Interviews, documentaries, and media opportunities to share authentic mountaineering stories.',
      topics: [
        'Expedition Documentaries',
        'Podcast Interviews',
        'Press Inquiries',
        'Photo Essays',
      ],
    },
    {
      icon: UserGroupIcon,
      title: 'Mentoring & Coaching',
      description:
        'Working with aspiring mountaineers and adventurers to plan and execute their own big goals.',
      topics: [
        'Expedition Planning',
        'Training Guidance',
        'Mental Preparation',
        'Route Selection',
      ],
    },
  ];

  const mediaKit = [
    {
      icon: DocumentTextIcon,
      title: 'Media Kit',
      description:
        'Professional photos, bio, expedition statistics, and speaking topics.',
    },
    {
      icon: CameraIcon,
      title: 'High-Res Photos',
      description:
        'Professional expedition photography for media and editorial use.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Press Resources',
      description:
        'Fact sheets, expedition timelines, and interview talking points.',
    },
  ];

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
            <UserGroupIcon className="w-4 h-4 text-summitGold" />
            Let&apos;s Work Together
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Connect &{' '}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Collaborate
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
            Interested in working together? I&apos;m always open to meaningful
            partnerships, speaking opportunities, and collaborations that align
            with my mountaineering journey.
          </p>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 inline-block"
          >
            <div className="flex items-center gap-4">
              <EnvelopeIcon className="w-6 h-6 text-summitGold" />
              <div className="text-left">
                <p className="text-sm text-white/60 mb-1">Get in touch</p>
                <a
                  href="mailto:hello@summitchronicles.com"
                  className="text-white font-medium hover:text-summitGold transition-colors"
                >
                  hello@summitchronicles.com
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Collaboration Types */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              How We Can{' '}
              <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
                Work Together
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              I&apos;m selective about partnerships and collaborations, focusing
              on authentic connections that provide real value to my audience
              and align with my values.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collaborationTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-summitGold/20 to-yellow-400/20">
                    <type.icon className="w-6 h-6 text-summitGold" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{type.title}</h3>
                </div>

                <p className="text-white/70 leading-relaxed mb-6">
                  {type.description}
                </p>

                <div>
                  <h4 className="text-sm font-semibold text-summitGold mb-3 uppercase tracking-wide">
                    Areas of Focus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {type.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Why Partner With Me?
            </h2>
            <p className="text-white/70">
              Authentic reach and engagement in the mountaineering and outdoor
              adventure community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                value: '10K+',
                label: 'Monthly Readers',
                description: 'Engaged mountaineering enthusiasts',
              },
              {
                value: '3/7',
                label: 'Summits Completed',
                description: 'Proven expedition experience',
              },
              {
                value: '5+',
                label: 'Years Climbing',
                description: 'Deep mountaineering knowledge',
              },
              {
                value: '100%',
                label: 'Authenticity',
                description: 'Only promote what I actually use',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-summitGold mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-white/60">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Media Resources
            </h2>
            <p className="text-white/70">
              Everything you need for press coverage, interviews, and content
              creation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaKit.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-summitGold/20 to-yellow-400/20 inline-block mb-6">
                  <resource.icon className="w-8 h-8 text-summitGold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {resource.title}
                </h3>
                <p className="text-white/70 mb-6">{resource.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border border-summitGold/30 text-summitGold rounded-xl hover:bg-summitGold/10 transition-colors"
                >
                  Request Access
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Start a Conversation
            </h2>
            <p className="text-white/70">
              Tell me about your project, event, or collaboration idea
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                  placeholder="Your company or organization"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Collaboration Type
                </label>
                <select
                  id="type"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-summitGold/50"
                >
                  <option value="">Select collaboration type</option>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="brand">Brand Partnership</option>
                  <option value="media">Media/Press</option>
                  <option value="mentoring">Mentoring/Coaching</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 resize-none"
                  placeholder="Tell me about your project, event, or collaboration idea. Include any relevant details like timeline, budget range, and specific requirements."
                />
              </div>

              <div className="text-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-white/60">
              I typically respond within 2-3 business days. For urgent
              inquiries, please email directly at{' '}
              <a
                href="mailto:hello@summitchronicles.com"
                className="text-summitGold hover:underline"
              >
                hello@summitchronicles.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
