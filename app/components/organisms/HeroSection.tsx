'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { DisplayLarge, BodyLarge } from '../atoms/Typography';
import { StatusBadge } from '../molecules/StatusBadge';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn(
      'relative min-h-screen flex items-center justify-center overflow-hidden',
      'bg-gradient-to-br from-spa-stone via-spa-mist to-spa-cloud',
      className
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric patterns */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-alpine-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-summit-gold/10 rounded-full blur-2xl" />
        
        {/* Swiss spa grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(30, 58, 138, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12">
        {/* Expedition Status Badge */}
        <div className="flex justify-center animate-fade-in">
          <StatusBadge variant="summit" className="text-lg px-6 py-3 shadow-spa-medium">
            <Icon name="Mountain" size="md" />
            Everest 2024 Expedition Training
          </StatusBadge>
        </div>

        {/* Main Headline */}
        <div className="space-y-8 animate-fade-in-up">
          <DisplayLarge className="text-spa-charcoal leading-tight max-w-4xl mx-auto">
            Journey to the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-alpine-blue to-summit-gold">
              {' '}Summit
            </span>
          </DisplayLarge>
          
          <BodyLarge className="max-w-3xl mx-auto text-spa-slate leading-relaxed">
            Follow my systematic training, preparation, and expedition journey toward 
            mountaineering excellence. Experience the dedication, data-driven methodology, 
            and premium preparation behind conquering the world's highest peaks.
          </BodyLarge>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up-delay">
          <Button variant="summit" size="lg" asChild className="shadow-spa-medium hover:shadow-spa-strong transform hover:-translate-y-1 transition-all duration-300">
            <Link href="/support">
              <Icon name="Heart" size="md" />
              Support My Journey
            </Link>
          </Button>
          
          <Button variant="ghost" size="lg" asChild className="group">
            <Link href="/about">
              <Icon name="Play" size="md" className="group-hover:scale-110 transition-transform duration-300" />
              Watch My Story
            </Link>
          </Button>
        </div>

        {/* Training Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-fade-in-up-delay-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-alpine-blue/10 rounded-full mx-auto mb-4">
              <Icon name="Activity" size="xl" className="text-alpine-blue" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">127km</div>
            <div className="text-spa-slate">This Week</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-summit-gold/10 rounded-full mx-auto mb-4">
              <Icon name="Mountain" size="xl" className="text-summit-gold" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">2,840m</div>
            <div className="text-spa-slate">Elevation Gained</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Icon name="Target" size="xl" className="text-green-600" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">Week 12</div>
            <div className="text-spa-slate">of 24 Training</div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex flex-wrap justify-center gap-4 pt-8 animate-fade-in-up-delay-3">
          <Link 
            href="/training" 
            className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300"
          >
            <Icon name="BarChart3" size="sm" className="group-hover:scale-110 transition-transform duration-300" />
            <span>Training Data</span>
          </Link>
          
          <Link 
            href="/blog" 
            className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300"
          >
            <Icon name="BookOpen" size="sm" className="group-hover:scale-110 transition-transform duration-300" />
            <span>Journey Updates</span>
          </Link>
          
          <Link 
            href="/expeditions" 
            className="group flex items-center space-x-2 px-4 py-2 text-spa-slate hover:text-alpine-blue transition-colors duration-300"
          >
            <Icon name="Map" size="sm" className="group-hover:scale-110 transition-transform duration-300" />
            <span>Expedition Plans</span>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-spa-slate">
            <span className="text-sm">Explore Journey</span>
            <Icon name="ChevronDown" size="md" />
          </div>
        </div>
      </div>

      {/* Subtle animations and effects */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up 1s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 1s ease-out forwards;
          animation-delay: 0.9s;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 1s ease-out forwards;
          animation-delay: 1.2s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export { HeroSection };
export type { HeroSectionProps };