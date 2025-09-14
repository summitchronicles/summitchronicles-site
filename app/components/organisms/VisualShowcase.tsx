'use client';

import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H2, H3, Body, BodyLarge } from '../atoms/Typography';
import { Card, CardContent } from '../molecules/Card';
import { cn } from '@/lib/utils';

interface VisualShowcaseProps {
  className?: string;
}

const VisualShowcase: React.FC<VisualShowcaseProps> = ({ className }) => {
  return (
    <section className={cn(
      'py-24 bg-gradient-to-br from-spa-mist to-white relative overflow-hidden',
      className
    )}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-spa-cloud to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <H2 className="text-spa-charcoal">Expedition Visual Journey</H2>
          <BodyLarge className="max-w-3xl mx-auto text-spa-slate">
            Experience the breathtaking moments, challenging conditions, and triumphant achievements 
            through our premium visual documentation system.
          </BodyLarge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card variant="elevated" padding="lg" className="overflow-hidden hover:shadow-spa-strong transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-alpine-blue/20 via-transparent to-summit-gold/10" />
              <div className="absolute inset-0 bg-spa-charcoal/60 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <Icon name="Mountain" size="xl" className="mx-auto opacity-80" />
                  <H3 className="text-white">Everest Base Camp Approach</H3>
                  <Body className="text-spa-mist max-w-md">
                    High-resolution expedition photography capturing every step of the journey 
                    toward the world's highest peak.
                  </Body>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <H3 className="text-spa-charcoal mb-2">Premium Visual Documentation</H3>
                <Body className="text-spa-slate">
                  Professional-grade photography and videography throughout the expedition
                </Body>
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="ExternalLink" size="sm" />
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card variant="elevated" padding="md" className="overflow-hidden group hover:shadow-spa-medium transition-all duration-300">
              <div className="relative aspect-square overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-summit-gold/20 to-alpine-blue/10" />
                <div className="absolute inset-0 bg-spa-charcoal/50 flex items-center justify-center">
                  <div className="text-center text-white space-y-2">
                    <Icon name="Activity" size="xl" className="mx-auto opacity-80" />
                    <H3 className="text-white text-lg">Training Sessions</H3>
                  </div>
                </div>
              </div>
              <Body className="text-spa-slate text-sm">
                Weekly training documentation with performance metrics and insights
              </Body>
            </Card>

            <Card variant="elevated" padding="md" className="overflow-hidden group hover:shadow-spa-medium transition-all duration-300">
              <div className="relative aspect-square overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-alpine-blue/15 to-spa-cloud" />
                <div className="absolute inset-0 bg-spa-charcoal/50 flex items-center justify-center">
                  <div className="text-center text-white space-y-2">
                    <Icon name="Shield" size="xl" className="mx-auto opacity-80" />
                    <H3 className="text-white text-lg">Gear Testing</H3>
                  </div>
                </div>
              </div>
              <Body className="text-spa-slate text-sm">
                Comprehensive equipment evaluation and field testing documentation
              </Body>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-alpine-blue">2,400+</div>
            <Body className="text-spa-slate">Photos Captured</Body>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-summit-gold">120hrs</div>
            <Body className="text-spa-slate">Video Content</Body>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-green-600">156</div>
            <Body className="text-spa-slate">Training Days</Body>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-spa-charcoal">8K</div>
            <Body className="text-spa-slate">Resolution</Body>
          </div>
        </div>

        <Card variant="premium" padding="lg" className="bg-gradient-to-r from-white to-spa-mist border-2 border-spa-cloud/30">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <H3 className="text-spa-charcoal">Interactive Journey Gallery</H3>
              <Body className="text-spa-slate">
                Explore high-resolution imagery, time-lapse sequences, and behind-the-scenes 
                content from every stage of the expedition preparation. Each image tells a 
                story of dedication, progress, and the relentless pursuit of excellence.
              </Body>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button variant="primary" size="md">
                  <Icon name="Camera" size="sm" />
                  View Full Gallery
                </Button>
                <Button variant="ghost" size="md">
                  <Icon name="Download" size="sm" />
                  Media Kit
                </Button>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-alpine-blue via-summit-gold to-alpine-blue rounded-2xl flex items-center justify-center shadow-spa-medium">
                  <Icon name="Image" size="xl" className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-summit-gold rounded-full flex items-center justify-center shadow-spa-soft">
                  <Icon name="Plus" size="sm" className="text-spa-charcoal" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export { VisualShowcase };
export type { VisualShowcaseProps };