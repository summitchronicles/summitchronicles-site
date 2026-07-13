'use client';

import { Header } from '../components/organisms/Header';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, FileText, Mail } from 'lucide-react';

export default function MediaKitPage() {
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
                Media Kit
              </h1>
              <p className="text-xl text-spa-slate leading-relaxed max-w-2xl mx-auto">
                High-resolution assets, biographical information, and expedition
                photography for media coverage and partnership opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Info */}
        <section className="py-12 bg-spa-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-medium text-spa-charcoal mb-2">
                  Next Expedition
                </h3>
                <p className="text-spa-slate">Mount Everest - 2028 Objective</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-spa-charcoal mb-2">
                  Current Status
                </h3>
                <p className="text-spa-slate">4 of 7 Summits Complete</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-spa-charcoal mb-2">
                  Focus
                </h3>
                <p className="text-spa-slate">Seven Summits Documentation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Downloadable Assets */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              Press Assets
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="border border-spa-cloud rounded-lg p-6 hover:shadow-spa-medium transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <ImageIcon className="w-6 h-6 text-alpine-blue" />
                  <h3 className="text-xl font-medium text-spa-charcoal">
                    High-Res Photos
                  </h3>
                </div>
                <p className="text-spa-slate mb-4">
                  Professional expedition photography and portraits in various
                  formats.
                </p>
                <a
                  href="mailto:media@summitchronicles.com?subject=Summit%20Chronicles%20Photo%20Pack%20Request"
                  className="inline-flex items-center space-x-2 text-alpine-blue hover:text-blue-800 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Request Photo Pack</span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="border border-spa-cloud rounded-lg p-6 hover:shadow-spa-medium transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-alpine-blue" />
                  <h3 className="text-xl font-medium text-spa-charcoal">
                    Biography & Facts
                  </h3>
                </div>
                <p className="text-spa-slate mb-4">
                  Detailed biographical information, achievements, and key
                  statistics.
                </p>
                <a
                  href="mailto:media@summitchronicles.com?subject=Summit%20Chronicles%20Bio%20Sheet%20Request"
                  className="inline-flex items-center space-x-2 text-alpine-blue hover:text-blue-800 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Request Bio Sheet</span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bio Summary */}
        <section className="py-16 bg-spa-stone-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-8 text-center">
              Biography Summary
            </h2>
            <div className="prose prose-lg max-w-none text-spa-slate">
              <p>
                <strong>Sunith Kumar</strong> is a systematic mountaineer and
                expedition photographer pursuing the Seven Summits through
                data-driven preparation and methodical training. He combines
                engineering principles with expedition documentation to examine
                the intersection of systematic thinking and mountaineering.
              </p>
              <p>
                His Seven Summits record includes Kilimanjaro, Elbrus,
                Aconcagua, and Denali. The current chapter is rehabilitation and
                a measured rebuild toward Mount Everest as a 2028 objective.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-light text-spa-charcoal mb-8">
              Media Contact
            </h2>
            <div className="inline-flex items-center space-x-3 text-alpine-blue hover:text-blue-800 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="text-lg">media@summitchronicles.com</span>
            </div>
            <p className="mt-4 text-spa-slate">
              Available for interviews, speaking engagements, and partnership
              discussions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
