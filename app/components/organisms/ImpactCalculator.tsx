'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Shield, Zap } from 'lucide-react';

interface ImpactItem {
  category: string;
  description: string;
  cost: number;
  icon: React.ComponentType<any>;
  color: string;
}

const expeditionCosts: ImpactItem[] = [
  {
    category: 'Climbing Permit',
    description: 'Everest climbing permit and documentation',
    cost: 11000,
    icon: Shield,
    color: 'text-red-600',
  },
  {
    category: 'High-Altitude Gear',
    description: 'Specialized mountaineering equipment and safety gear',
    cost: 8500,
    icon: Zap,
    color: 'text-blue-600',
  },
  {
    category: 'Training & Preparation',
    description: 'Systematic training, coaching, and preparation methodology',
    cost: 4200,
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    category: 'Travel & Logistics',
    description:
      'International travel, accommodation, and expedition logistics',
    cost: 6500,
    icon: Calculator,
    color: 'text-purple-600',
  },
];

export const ImpactCalculator: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number>(100);

  const totalExpeditionCost = expeditionCosts.reduce(
    (sum, item) => sum + item.cost,
    0
  );
  const impactPercentage = (donationAmount / totalExpeditionCost) * 100;

  const getImpactDescription = (amount: number) => {
    if (amount >= 500) return 'Major expedition milestone funding';
    if (amount >= 250) return 'Significant preparation phase support';
    if (amount >= 100) return 'Essential gear component funding';
    if (amount >= 50) return 'Important training resource support';
    return 'Meaningful preparation contribution';
  };

  const getSpecificImpacts = (amount: number) => {
    const impacts = [];

    if (amount >= 25) impacts.push('1 day of high-altitude nutrition');
    if (amount >= 50) impacts.push('2 days of specialized training fuel');
    if (amount >= 100) impacts.push('1 week of expedition-grade preparation');
    if (amount >= 250) impacts.push('Major safety equipment contribution');
    if (amount >= 500) impacts.push('Significant gear upgrade funding');
    if (amount >= 1000) impacts.push('Complete preparation phase sponsorship');

    return impacts;
  };

  return (
    <section className="py-24 bg-spa-stone">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="font-sans font-normal text-4xl text-spa-charcoal leading-tight">
            Calculate Your Impact
          </h2>
          <p className="font-sans text-xl leading-relaxed max-w-3xl mx-auto text-spa-slate">
            See exactly how your contribution advances expedition preparation.
            Every dollar has a direct, measurable impact on reaching the summit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Impact Calculator */}
          <div className="bg-white rounded-2xl p-8 shadow-spa-elevated border border-spa-cloud">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-alpine-blue/10 rounded-full">
                  <Calculator className="h-6 w-6 text-alpine-blue" />
                </div>
                <h3 className="font-sans font-medium text-2xl text-spa-charcoal">
                  Donation Impact Calculator
                </h3>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-spa-charcoal">
                  Enter Donation Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-spa-charcoal">
                    $
                  </span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) =>
                      setDonationAmount(Number(e.target.value) || 0)
                    }
                    min="1"
                    className="w-full pl-12 pr-4 py-4 border border-spa-cloud rounded-lg focus:ring-2 focus:ring-alpine-blue focus:border-transparent text-2xl font-bold text-spa-charcoal"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 250].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      donationAmount === amount
                        ? 'bg-alpine-blue text-white'
                        : 'bg-spa-mist text-spa-charcoal hover:bg-spa-cloud'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Impact Summary */}
              <div className="bg-spa-mist rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-spa-slate">
                    Expedition Progress Impact
                  </span>
                  <span className="text-2xl font-bold text-alpine-blue">
                    {impactPercentage.toFixed(3)}%
                  </span>
                </div>

                <div className="w-full bg-white rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-alpine-blue to-summit-gold h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(impactPercentage * 100, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-spa-charcoal font-medium">
                  {getImpactDescription(donationAmount)}
                </p>
              </div>

              {/* Specific Impacts */}
              <div className="space-y-3">
                <h4 className="font-medium text-spa-charcoal">
                  Your ${donationAmount} Enables:
                </h4>
                <ul className="space-y-2">
                  {getSpecificImpacts(donationAmount).map((impact, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-spa-slate">{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Expedition Cost Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-spa-elevated border border-spa-cloud">
            <div className="space-y-6">
              <h3 className="font-sans font-medium text-2xl text-spa-charcoal mb-6">
                Complete Expedition Budget
              </h3>

              {/* Total Cost */}
              <div className="bg-gradient-to-r from-alpine-blue to-summit-gold rounded-lg p-6 text-white text-center">
                <div className="text-sm opacity-90 mb-1">
                  Total Expedition Investment
                </div>
                <div className="text-4xl font-bold">
                  ${totalExpeditionCost.toLocaleString()}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-spa-charcoal text-sm uppercase tracking-wide">
                  Investment Breakdown
                </h4>

                {expeditionCosts.map((item, index) => {
                  const IconComponent = item.icon;
                  const percentage = (item.cost / totalExpeditionCost) * 100;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium text-spa-charcoal">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-spa-charcoal font-bold">
                          ${item.cost.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-full bg-spa-mist rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            item.color.includes('red')
                              ? 'from-red-500 to-red-600'
                              : item.color.includes('blue')
                                ? 'from-blue-500 to-blue-600'
                                : item.color.includes('green')
                                  ? 'from-green-500 to-green-600'
                                  : 'from-purple-500 to-purple-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="text-sm text-spa-slate">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Transparency Note */}
              <div className="bg-spa-mist rounded-lg p-4">
                <h5 className="font-medium text-spa-charcoal mb-2">
                  Complete Financial Transparency
                </h5>
                <p className="text-sm text-spa-slate leading-relaxed">
                  Every expense is documented and shared with the community.
                  Monthly financial reports detail exactly how contributions
                  advance expedition goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
