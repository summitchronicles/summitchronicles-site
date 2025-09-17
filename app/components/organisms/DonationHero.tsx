import React from 'react';
import { Button } from '../atoms/Button';
import { Heart, Mountain, Target } from 'lucide-react';

export const DonationHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-spa-stone via-spa-mist to-spa-cloud py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(30, 58, 138, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-alpine-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-summit-gold/10 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12">
        {/* Status Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-summit-gold/10 text-amber-800 border border-summit-gold/20 text-lg px-6 py-3 font-medium shadow-spa-medium">
            <Heart className="h-5 w-5 text-current mr-3" />
            Community-Supported Adventure Preparation
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <h1 className="font-sans font-light text-5xl md:text-6xl tracking-tight text-spa-charcoal leading-tight max-w-4xl mx-auto">
            Support the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-alpine-blue to-summit-gold">
              {' '}
              Journey
            </span>
          </h1>

          <p className="font-sans text-xl max-w-3xl mx-auto text-spa-slate leading-relaxed">
            Join a community of supporters funding systematic mountaineering
            preparation. Every contribution directly advances expedition goals
            while providing transparent insights into professional adventure
            preparation methodology.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-alpine-blue/10 rounded-full mx-auto mb-4">
              <Mountain className="h-8 w-8 text-alpine-blue" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">
              $12,840
            </div>
            <div className="text-spa-slate">Expedition Cost Target</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-summit-gold/10 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-summit-gold" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">127</div>
            <div className="text-spa-slate">Community Supporters</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-spa-soft hover:shadow-spa-medium transition-all duration-300 border border-spa-cloud/30">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-spa-charcoal mb-2">34%</div>
            <div className="text-spa-slate">Funding Progress</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            className="bg-summit-gold text-spa-charcoal hover:bg-yellow-500 shadow-spa-medium hover:shadow-spa-elevated transform hover:-translate-y-1 transition-all duration-300"
          >
            <Heart className="h-5 w-5 mr-2" />
            Support the Journey
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-spa-slate hover:text-alpine-blue"
          >
            View Impact Calculator
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-4 pt-8 text-sm text-spa-slate">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>100% Transparent Funding</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Secure Payment Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Direct Expedition Impact</span>
          </div>
        </div>
      </div>
    </section>
  );
};
