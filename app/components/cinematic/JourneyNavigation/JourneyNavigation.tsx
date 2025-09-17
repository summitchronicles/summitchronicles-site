'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Mountain,
  TrendingUp,
  BookOpen,
  Users,
  ArrowRight,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  gradient: string;
}

interface JourneyNavigationProps {
  className?: string;
}

export function JourneyNavigation({ className = '' }: JourneyNavigationProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    {
      id: 'journey',
      title: 'The Journey',
      subtitle: 'Seven Summits Timeline',
      description:
        'Explore my complete mountaineering timeline, from first training climbs to the ultimate Everest expedition in 2027.',
      icon: Mountain,
      href: '/journey',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'training',
      title: 'Training Data',
      subtitle: 'Performance Analytics',
      description:
        'Dive deep into the metrics, methodologies, and systematic approach behind every training session and expedition.',
      icon: TrendingUp,
      href: '/training',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'stories',
      title: 'Summit Stories',
      subtitle: 'Expedition Chronicles',
      description:
        'Read detailed accounts from each summit attempt, including challenges faced, lessons learned, and victories achieved.',
      icon: BookOpen,
      href: '/blog',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'community',
      title: 'Join the Journey',
      subtitle: 'Community & Support',
      description:
        'Connect with fellow adventurers, get training insights, and follow along as I prepare for the ultimate summit challenge.',
      icon: Users,
      href: '/support',
      color: 'text-summit-gold',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity }}
      className={`py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-summit-gold rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Continue the Adventure
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Ready to dive deeper? Choose your path and explore the complete
            story behind the Seven Summits challenge through data, stories, and
            community.
          </p>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            className="flex flex-col items-center text-slate-400 mb-8"
          >
            <span className="text-sm font-medium mb-2">Explore Below</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
                className="group"
              >
                <Link href={item.href} className="block">
                  <div
                    className={`relative h-64 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                      isActive ? 'scale-105' : ''
                    }`}
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90`}
                    />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {index + 1} of 4
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-lg font-medium text-white/90 mb-3">
                            {item.subtitle}
                          </p>
                          <p className="text-white/80 leading-relaxed text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/70">
                          Click to explore
                        </div>
                        <div className="flex items-center space-x-2 text-white group-hover:translate-x-2 transition-transform duration-300">
                          <span className="font-medium text-sm">
                            Learn More
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready for Your Own Adventure?
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're training for your first peak or planning your own
              Seven Summits challenge, let's connect and share the journey
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 bg-summit-gold text-spa-charcoal px-8 py-4 rounded-2xl font-medium hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <Users className="w-5 h-5" />
                <span>Connect With Me</span>
              </Link>
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-medium hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                <span>Follow the Journey</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
