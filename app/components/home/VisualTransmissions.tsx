'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Hash, Radio } from 'lucide-react';
import { useInstagramFeed } from '@/lib/hooks/useInstagramFeed';
import { cn } from '@/lib/utils';
import { Button } from '../atoms/Button';

export const VisualTransmissions = () => {
  const { posts, loading } = useInstagramFeed();

  if (loading) return null; // Or a skeleton loader if preferred

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-summit-gold-900 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-summit-gold-900 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 border-t border-dashed border-white/5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header - Centered */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-summit-gold-400 mb-4"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase">
              Satellite Downlink
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white tracking-wide mb-6"
          >
            VISUAL <span className="text-summit-gold-400">TRANSMISSIONS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              className="group border border-summit-gold/30 hover:border-summit-gold text-summit-gold hover:bg-summit-gold/10 font-mono text-xs tracking-widest uppercase"
              asChild
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <ExternalLink className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="group block relative"
            >
              {/* Image Container with Glitch/Signal Effect */}
              <div className="relative aspect-square overflow-hidden bg-black/50 border border-white/10 group-hover:border-summit-gold/50 transition-colors duration-500">
                <Image
                  src={post.media_url}
                  alt={post.caption || 'Instagram visual'}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                />

                {/* Signal Noise Overlay - Clears on Hover */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* Scan Line Animation */}
                <div className="absolute inset-0 w-full h-[2px] bg-summit-gold-400/30 blur-sm animate-scan-fast pointer-events-none group-hover:opacity-0" />

                {/* Corner Markers */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30 group-hover:border-summit-gold transition-colors" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30 group-hover:border-summit-gold transition-colors" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30 group-hover:border-summit-gold transition-colors" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30 group-hover:border-summit-gold transition-colors" />
              </div>

              {/* Transmission Log Caption */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-summit-gold-400/70 font-mono uppercase tracking-wider">
                  <span>LOG_ID_{post.id}</span>
                  <span className="w-1 h-1 bg-current rounded-full" />
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-summit-gold-500 mr-2">{'>'}</span>
                  {post.caption}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
