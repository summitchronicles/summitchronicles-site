'use client';

import { Header } from '../components/organisms/Header';
import { motion } from 'framer-motion';
import { Calendar, Users, Presentation, CheckCircle, MapPin, Clock } from 'lucide-react';

export default function SpeakingPage() {
  const topics = [
    {
      title: "Systematic Approach to Impossible Goals",
      description: "How engineering principles apply to extreme mountaineering and personal achievement.",
      duration: "45-60 minutes",
      audience: "Corporate, Universities, Leadership conferences"
    },
    {
      title: "Failure as Foundation",
      description: "Transforming setbacks into systematic preparation for extraordinary results.",
      duration: "30-45 minutes", 
      audience: "Entrepreneurship, Personal development, Teams"
    },
    {
      title: "Data-Driven Adventure",
      description: "Using technology and metrics to prepare for the world's most challenging environments.",
      duration: "30-60 minutes",
      audience: "Tech companies, Data teams, Adventure enthusiasts"
    }
  ];

  const testimonials = [
    {
      quote: "Sunith's systematic approach to mountaineering provided incredible insights for our product development process.",
      author: "Sarah Chen",
      title: "VP Engineering, TechCorp"
    },
    {
      quote: "A compelling story of how methodical preparation can achieve extraordinary results.",
      author: "Dr. Michael Rodriguez", 
      title: "University of Washington"
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
                Speaking Engagements
              </h1>
              <p className="text-xl text-spa-slate leading-relaxed max-w-2xl mx-auto">
                Bringing lessons from extreme mountaineering to inspire systematic approaches 
                to impossible goals in business and personal achievement.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Speaking Topics */}
        <section className="py-16 bg-spa-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              Speaking Topics
            </h2>
            
            <div className="space-y-8">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-8 shadow-spa-soft hover:shadow-spa-medium transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-light text-spa-charcoal mb-4">
                        {topic.title}
                      </h3>
                      <p className="text-spa-slate leading-relaxed mb-4">
                        {topic.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-spa-slate">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{topic.audience}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center space-x-2 text-alpine-blue">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{topic.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              What's Included
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Custom Presentation</h4>
                    <p className="text-spa-slate text-sm">Tailored content specific to your audience and objectives</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Visual Storytelling</h4>
                    <p className="text-spa-slate text-sm">High-impact expedition photography and data visualizations</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Interactive Q&A</h4>
                    <p className="text-spa-slate text-sm">Engaging audience discussion and practical applications</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Pre-Event Consultation</h4>
                    <p className="text-spa-slate text-sm">Discussion to align presentation with your event goals</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Follow-up Resources</h4>
                    <p className="text-spa-slate text-sm">Downloadable frameworks and expedition insights</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-alpine-blue mt-1" />
                  <div>
                    <h4 className="font-medium text-spa-charcoal">Virtual or In-Person</h4>
                    <p className="text-spa-slate text-sm">Flexible delivery options to meet your needs</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-spa-stone-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-light text-spa-charcoal mb-12 text-center">
              What Audiences Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-6 shadow-spa-soft"
                >
                  <p className="text-spa-slate italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-medium text-spa-charcoal">{testimonial.author}</div>
                    <div className="text-sm text-spa-slate">{testimonial.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light text-spa-charcoal mb-8">
                Book a Speaking Engagement
              </h2>
              <p className="text-xl text-spa-slate mb-8 leading-relaxed">
                Available for corporate events, conferences, universities, and team workshops.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:speaking@summitchronicles.com"
                  className="inline-flex items-center space-x-3 bg-alpine-blue text-white px-8 py-4 rounded-md font-medium hover:bg-blue-800 transition-colors text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Request Speaking Info</span>
                </a>
                <p className="text-sm text-spa-slate">
                  Response within 24 hours • Custom proposals available
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}