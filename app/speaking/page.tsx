"use client";

import { motion } from "framer-motion";
import { 
  MicrophoneIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  CheckIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function SpeakingPage() {
  const topics = [
    {
      title: "From Recovery to Summit",
      subtitle: "Resilience & Overcoming Adversity",
      description: "How tuberculosis recovery led to Seven Summits - a story of transformation, purpose, and never giving up.",
      audience: "Corporate teams, healthcare, wellness events",
      duration: "45-60 minutes",
      icon: "🏥➡️🏔️"
    },
    {
      title: "Goal Setting at 20,000 Feet", 
      subtitle: "Strategic Planning & Execution",
      description: "Lessons from mountaineering: breaking big goals into manageable camps, risk assessment, and staying focused under pressure.",
      audience: "Leadership conferences, business teams",
      duration: "30-45 minutes", 
      icon: "🎯"
    },
    {
      title: "Team Dynamics on the Mountain",
      subtitle: "Trust, Communication & Leadership",
      description: "What expedition teams teach us about collaboration, trust-building, and making life-or-death decisions together.",
      audience: "Team building events, management training",
      duration: "60-90 minutes (workshop format)",
      icon: "👥"
    },
    {
      title: "The Psychology of Risk",
      subtitle: "Calculated Risks vs Reckless Chances", 
      description: "How mountaineers assess and manage risk - applicable to business decisions, career moves, and life choices.",
      audience: "Entrepreneurs, investors, decision-makers",
      duration: "45 minutes",
      icon: "⚖️"
    },
    {
      title: "Finding Your Mountain",
      subtitle: "Purpose & Personal Mission",
      description: "Everyone has their own 'Seven Summits' - discovering what drives you and building the persistence to achieve it.",
      audience: "Students, career changers, motivation events", 
      duration: "30-60 minutes",
      icon: "🔍"
    }
  ];

  const testimonials = [
    {
      quote: "Sunith's journey from medical recovery to mountaineering excellence offers profound lessons in resilience that every leader needs to hear.",
      author: "Coming Soon",
      title: "Previous Event Testimonials",
      company: "Will be added after first speaking engagements"
    }
  ];

  const formats = [
    {
      name: "Keynote Speaking",
      description: "Main stage presentations for conferences and large events",
      duration: "30-60 minutes",
      capacity: "100-5000 attendees",
      includes: ["Professional AV setup", "Q&A session", "Meet & greet", "Social media content"]
    },
    {
      name: "Workshop Facilitation", 
      description: "Interactive sessions with hands-on activities and team exercises",
      duration: "2-4 hours",
      capacity: "20-100 participants", 
      includes: ["Workbook materials", "Group exercises", "Individual coaching", "Action plans"]
    },
    {
      name: "Panel Discussions",
      description: "Expert panel member for adventure, wellness, or business topics",
      duration: "45-90 minutes",
      capacity: "Any size",
      includes: ["Preparation call", "Thought leadership", "Audience interaction", "Follow-up content"]
    },
    {
      name: "Virtual Presentations",
      description: "Online speaking for remote teams and global audiences", 
      duration: "30-45 minutes",
      capacity: "Unlimited",
      includes: ["Professional setup", "Interactive elements", "Recording available", "Follow-up resources"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-glacierBlue/20 backdrop-blur-sm border border-glacierBlue/30 rounded-full px-4 py-2 mb-6"
          >
            <MicrophoneIcon className="w-5 h-5 text-glacierBlue" />
            <span className="text-glacierBlue font-semibold">KEYNOTE SPEAKER AVAILABLE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Inspiring Teams Through 
            <span className="block bg-gradient-to-r from-glacierBlue to-blue-400 bg-clip-text text-transparent">
              Mountain Lessons
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            From hospital bed to world&apos;s highest peaks. Lessons in resilience, goal-setting, 
            and team dynamics that transform how organizations approach challenges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#book-now"
              className="bg-glacierBlue text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Book Speaking Engagement
            </a>
            <a
              href="#topics"
              className="bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
            >
              View Speaking Topics
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Book Sunith */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why Book Sunith Kumar?
            </h2>
            <p className="text-xl text-white/70">
              Authentic experiences, proven resilience, practical business applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrophyIcon,
                title: "Proven Track Record",
                description: "4/7 summits completed with documented journey from TB recovery. Real struggles, real victories, real lessons."
              },
              {
                icon: BuildingOfficeIcon,
                title: "Business Applications", 
                description: "Mountain lessons directly applicable to corporate challenges: risk management, team dynamics, strategic planning."
              },
              {
                icon: UserGroupIcon,
                title: "Engaging Delivery",
                description: "High-quality visuals from actual expeditions, interactive elements, and actionable takeaways for every audience."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-glacierBlue/20 rounded-2xl mb-6">
                  <feature.icon className="w-8 h-8 text-glacierBlue" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section id="topics" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Speaking Topics
            </h2>
            <p className="text-xl text-white/70">
              Choose from these proven presentations or request a custom topic
            </p>
          </motion.div>

          <div className="space-y-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl flex-shrink-0">{topic.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{topic.title}</h3>
                    <p className="text-glacierBlue font-semibold mb-4">{topic.subtitle}</p>
                    <p className="text-white/80 mb-6 leading-relaxed">{topic.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full">
                        👥 {topic.audience}
                      </span>
                      <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full">
                        ⏰ {topic.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Formats */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Speaking Formats
            </h2>
            <p className="text-xl text-white/70">
              Flexible options to fit your event needs and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formats.map((format, index) => (
              <motion.div
                key={format.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{format.name}</h3>
                <p className="text-white/70 mb-6">{format.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Duration:</span>
                    <span className="text-white">{format.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacity:</span>
                    <span className="text-white">{format.capacity}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-glacierBlue font-semibold text-sm mb-3">Includes:</p>
                  {format.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-glacierBlue flex-shrink-0" />
                      <span className="text-white/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Speaking Engagement */}
      <section id="book-now" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MicrophoneIcon className="w-16 h-16 text-glacierBlue mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Book Speaking Engagement
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Ready to inspire your team with lessons from the world&apos;s highest peaks? 
              Let&apos;s discuss how mountain wisdom can transform your organization.
            </p>
            
            <div className="bg-gradient-to-r from-glacierBlue/20 to-blue-400/20 backdrop-blur-sm border border-glacierBlue/30 rounded-3xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Speaking Inquiry</h3>
              <p className="text-white/80 mb-6">
                Available for corporate events, conferences, workshops, and educational institutions worldwide.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-left">
                  <p className="text-glacierBlue font-semibold mb-2">Event Types:</p>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Corporate conferences</li>
                    <li>• Leadership retreats</li> 
                    <li>• Team building events</li>
                    <li>• Educational institutions</li>
                  </ul>
                </div>
                <div className="text-left">
                  <p className="text-glacierBlue font-semibold mb-2">Availability:</p>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Virtual presentations</li>
                    <li>• Travel within India</li>
                    <li>• International (planned)</li>
                    <li>• Custom workshop design</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@summitchronicles.com?subject=Speaking Engagement Inquiry"
                className="bg-glacierBlue text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
              >
                📧 Book Speaking Engagement
              </a>
              
              <a
                href="/connect"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
              >
                All Contact Options
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Speaker fee varies by event type, duration, and location. 
                Contact for detailed proposal and availability.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}