'use client';

import React from 'react';
import { NewsletterSubscriptionForm } from '../organisms/NewsletterSubscriptionForm';
import { Coffee, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '../atoms/Button';

export function JoinTheMission() {
  return (
    <div className="bg-gradient-to-br from-summit-gold-900/20 to-black border border-summit-gold-500/20 rounded-2xl p-8 relative overflow-hidden group">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-summit-gold-500/5 blur-[80px] rounded-full" />

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Newsletter */}
        <div>
          <h3 className="text-2xl font-light text-white mb-2">
            JOIN THE <span className="text-summit-gold-400">MISSION</span>
          </h3>
          <p className="text-gray-400 mb-6 font-light leading-relaxed">
            Get weekly dispatches from the training lab. No spam, just raw data
            and mountain stories.
          </p>
          <NewsletterSubscriptionForm variant="inline" className="max-w-md" />
        </div>

        {/* Right: Support & Social */}
        <div className="flex flex-col gap-6 md:border-l border-white/10 md:pl-12">
          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest">
              Support the Climb
            </h4>
            <a
              href="https://ko-fi.com/summitchronicles"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-between group hover:border-summit-gold-400/50 hover:bg-summit-gold-400/5"
              >
                <div className="flex items-center gap-3">
                  <Coffee className="w-4 h-4 text-summit-gold-400" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Fuel the Journey
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-summit-gold-400" />
              </Button>
            </a>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-mono text-gray-500 uppercase tracking-widest">
              Follow Live
            </h4>
            <a
              href="https://instagram.com/summitchronicles"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between text-gray-400 hover:text-white hover:bg-white/5 px-4"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4" />
                  <span>@summitchronicles</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
