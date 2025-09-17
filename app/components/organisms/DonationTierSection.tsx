'use client';

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Check, Heart, Coffee, Mountain, Crown, Gift } from 'lucide-react';

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  impact: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const donationTiers: DonationTier[] = [
  {
    id: 'supporter',
    name: 'Base Camp Supporter',
    amount: 25,
    description: 'Join the community and support basic expedition preparation',
    impact: [
      'One day of high-altitude training fuel',
      'Contribution to safety equipment fund',
      'Access to training methodology insights',
    ],
    icon: Coffee,
    color: 'from-spa-slate to-spa-charcoal',
  },
  {
    id: 'advocate',
    name: 'Training Advocate',
    amount: 50,
    description: 'Advance systematic training with meaningful contribution',
    impact: [
      'Two days of specialized nutrition',
      'Portion of technical gear upgrade',
      'Weekly training report access',
      'Community recognition',
    ],
    icon: Heart,
    color: 'from-alpine-blue to-blue-700',
    popular: true,
  },
  {
    id: 'champion',
    name: 'Expedition Champion',
    amount: 100,
    description: 'Champion the preparation process with significant impact',
    impact: [
      'One week of expedition-grade nutrition',
      'Major gear component funding',
      'Detailed preparation methodology access',
      'Personal progress updates',
      'Supporter spotlight feature',
    ],
    icon: Mountain,
    color: 'from-summit-gold to-amber-600',
  },
  {
    id: 'guardian',
    name: 'Journey Guardian',
    amount: 250,
    description: 'Guard the expedition goals with substantial support',
    impact: [
      'Two weeks of high-altitude preparation',
      'Significant safety equipment contribution',
      'Exclusive training session documentation',
      'Direct communication access',
      'Premium supporter benefits',
      'Special acknowledgment in expedition documentation',
    ],
    icon: Crown,
    color: 'from-green-600 to-emerald-700',
  },
  {
    id: 'benefactor',
    name: 'Summit Benefactor',
    amount: 500,
    description: 'Become a cornerstone supporter of expedition success',
    impact: [
      'One month of comprehensive preparation funding',
      'Major expedition milestone sponsorship',
      'Exclusive behind-the-scenes content access',
      'Personal expedition preparation consultation',
      'Permanent supporter recognition',
      'Custom expedition gear acknowledgment',
      'Post-expedition celebration invitation',
    ],
    icon: Gift,
    color: 'from-purple-600 to-indigo-700',
  },
];

export const DonationTierSection: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('advocate');
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>(
    'one-time'
  );

  return (
    <section className="py-24 bg-gradient-to-br from-spa-mist to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="font-sans font-normal text-4xl text-spa-charcoal leading-tight">
            Choose Your Impact Level
          </h2>
          <p className="font-sans text-xl leading-relaxed max-w-3xl mx-auto text-spa-slate">
            Every contribution directly advances expedition preparation with
            transparent impact documentation. Select a tier that matches your
            comfort level and desired involvement in the journey.
          </p>

          {/* Donation Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-spa-soft border border-spa-cloud">
              <button
                onClick={() => setDonationType('one-time')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  donationType === 'one-time'
                    ? 'bg-alpine-blue text-white shadow-spa-soft'
                    : 'text-spa-slate hover:text-alpine-blue'
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setDonationType('recurring')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  donationType === 'recurring'
                    ? 'bg-alpine-blue text-white shadow-spa-soft'
                    : 'text-spa-slate hover:text-alpine-blue'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Donation Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {donationTiers.map((tier) => {
            const IconComponent = tier.icon;
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative cursor-pointer rounded-2xl p-8 transition-all duration-300 ${
                  tier.popular
                    ? 'bg-white border-2 border-alpine-blue shadow-spa-elevated scale-105'
                    : 'bg-white border border-spa-cloud shadow-spa-medium hover:shadow-spa-elevated'
                } ${
                  isSelected ? 'ring-2 ring-alpine-blue ring-opacity-50' : ''
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-alpine-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier Header */}
                <div className="text-center space-y-4 mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${tier.color}`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  <div>
                    <h3 className="font-sans font-medium text-xl text-spa-charcoal">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center space-x-1 mt-2">
                      <span className="text-3xl font-bold text-spa-charcoal">
                        ${tier.amount}
                      </span>
                      {donationType === 'recurring' && (
                        <span className="text-spa-slate">/month</span>
                      )}
                    </div>
                  </div>

                  <p className="text-spa-slate text-sm leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Impact List */}
                <div className="space-y-3 mb-8">
                  <h4 className="font-medium text-spa-charcoal text-sm uppercase tracking-wide">
                    Direct Impact
                  </h4>
                  <ul className="space-y-2">
                    {tier.impact.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-spa-slate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle donation process
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Tier'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Custom Amount Option */}
        <div className="bg-white rounded-2xl p-8 shadow-spa-medium border border-spa-cloud">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="font-sans font-medium text-2xl text-spa-charcoal">
                Custom Amount
              </h3>
              <p className="text-spa-slate leading-relaxed">
                Choose your own contribution amount that feels right for your
                support level. Every dollar directly advances expedition
                preparation with complete transparency.
              </p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Tax Receipt Provided
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-spa-slate">
                    Secure Processing
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-spa-charcoal">$</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="1"
                  className="flex-1 px-4 py-3 border border-spa-cloud rounded-lg focus:ring-2 focus:ring-alpine-blue focus:border-transparent text-lg"
                />
              </div>

              <Button
                size="lg"
                className="w-full bg-summit-gold text-spa-charcoal hover:bg-yellow-500"
              >
                <Heart className="h-5 w-5 mr-2" />
                Support with Custom Amount
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
