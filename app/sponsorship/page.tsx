'use client';

import { Header } from '../components/organisms/Header';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Globe, Camera, Award, Heart } from 'lucide-react';

export default function SponsorshipPage() {
  const tiers = [
    {
      name: "Base Camp Partner",
      investment: "$5,000 - $15,000",
      benefits: [
        "Logo placement on expedition gear",
        "Social media mentions during training",
        "Monthly progress updates",
        "Expedition photography access"
      ],
      icon: Heart
    },
    {
      name: "Summit Sponsor",
      investment: "$15,000 - $50,000", 
      benefits: [
        "All Base Camp benefits",
        "Dedicated content series",
        "Speaking engagement opportunity",
        "Custom expedition documentation",
        "Priority partnership renewal"
      ],
      icon: Target
    },
    {
      name: "Expedition Partner",
      investment: "$50,000+",
      benefits: [
        "All Summit Sponsor benefits",
        "Co-branded expedition content",
        "Executive expedition briefings",
        "Custom corporate workshops",
        "Year-long partnership program"
      ],
      icon: Award
    }
  ];

  const opportunities = [
    {
      title: "Mount Everest 2025",
      description: "The ultimate test of systematic preparation. 60+ days of content from base camp to summit.",
      timeline: "March - May 2025",
      reach: "Expected 100K+ impressions"
    },
    {
      title: "Training Documentation", 
      description: "12 months of detailed preparation methodology, gear testing, and performance analysis.",
      timeline: "Ongoing",
      reach: "Monthly audience engagement"
    },
    {
      title: "Seven Summits Journey",
      description: "Multi-year expedition series covering all seven continental high points.",
      timeline: "2024 - 2027",
      reach: "Long-term brand association"
    }
  ];

  return (
    <div className="min-h-screen bg-spa-stone-50">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-spa-charcoal">
                Partnership Opportunities
              </h1>
              <p className="text-xl text-spa-slate leading-relaxed max-w-2xl mx-auto">
                Join the systematic journey to the Seven Summits. Partner with a methodical 
                approach to extreme mountaineering that resonates with excellence and preparation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-spa-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              Why Partner With Summit Chronicles
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-alpine-blue rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Systematic Excellence</h3>
                <p className="text-spa-slate leading-relaxed">
                  Associate your brand with methodical preparation, data-driven training, 
                  and professional expedition execution.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-alpine-blue rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Premium Content</h3>
                <p className="text-spa-slate leading-relaxed">
                  High-quality expedition photography, training insights, and behind-the-scenes 
                  documentation across multiple platforms.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-alpine-blue rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Engaged Audience</h3>
                <p className="text-spa-slate leading-relaxed">
                  Connect with adventure enthusiasts, professionals, and individuals 
                  pursuing systematic approaches to challenging goals.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              Partnership Levels
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-lg p-8 border-2 ${
                    index === 1 
                      ? 'border-alpine-blue bg-alpine-blue/5' 
                      : 'border-spa-cloud bg-white'
                  } hover:shadow-spa-medium transition-shadow`}
                >
                  <div className="text-center mb-6">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      index === 1 ? 'bg-alpine-blue' : 'bg-spa-stone-200'
                    }`}>
                      <tier.icon className={`w-6 h-6 ${
                        index === 1 ? 'text-white' : 'text-spa-charcoal'
                      }`} />
                    </div>
                    <h3 className="text-xl font-medium text-spa-charcoal mb-2">
                      {tier.name}
                    </h3>
                    <div className="text-2xl font-light text-alpine-blue">
                      {tier.investment}
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-alpine-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-spa-slate text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section className="py-16 bg-spa-stone-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              Current Opportunities
            </h2>
            
            <div className="space-y-8">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-8 shadow-spa-soft"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-light text-spa-charcoal mb-3">
                        {opportunity.title}
                      </h3>
                      <p className="text-spa-slate leading-relaxed">
                        {opportunity.description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-spa-charcoal">Timeline</div>
                        <div className="text-spa-slate">{opportunity.timeline}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-spa-charcoal">Reach</div>
                        <div className="text-spa-slate">{opportunity.reach}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light text-spa-charcoal mb-8">
                Let's Discuss Partnership
              </h2>
              <p className="text-xl text-spa-slate mb-8 leading-relaxed">
                Custom partnership packages available. Let's explore how your brand 
                can be part of the systematic journey to extraordinary achievements.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:partnerships@summitchronicles.com"
                  className="inline-flex items-center space-x-3 bg-alpine-blue text-white px-8 py-4 rounded-md font-medium hover:bg-blue-800 transition-colors text-lg"
                >
                  <Globe className="w-5 h-5" />
                  <span>Explore Partnership</span>
                </a>
                <p className="text-sm text-spa-slate">
                  Custom proposals • Flexible investment levels • Long-term partnerships available
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}