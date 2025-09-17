'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import { Button } from '../components/atoms/Button'
import { H1, H2, H3, Body, BodyLarge, SeriaText } from '../components/atoms/Typography'
import { Card, CardContent, CardHeader } from '../components/molecules/Card'
import { StatusBadge } from '../components/molecules/StatusBadge'
import { Mountain, MapPin, Calendar, Target, Users, TrendingUp, Heart, Award, Clock, Thermometer, Wind, Eye, DollarSign, Plane, Shield, Backpack } from 'lucide-react'

export default function TheJourneyPage() {
  const sevenSummits = [
    {
      name: "Mount Everest",
      location: "Nepal/Tibet",
      elevation: "8,849m",
      status: "training",
      date: "Spring 2025",
      progress: 75,
      description: "The ultimate challenge. Currently in intensive training phase.",
      challenges: ["Extreme altitude", "Death zone exposure", "Weather windows"],
      preparation: "6-month intensive training program with high-altitude simulation",
      nextMilestone: "Final gear selection and acclimatization plan",
      featured: true
    },
    {
      name: "Denali",
      location: "Alaska, USA", 
      elevation: "6,190m",
      status: "planned",
      date: "Summer 2025",
      progress: 0,
      description: "The coldest and most technically demanding of the Seven Summits.",
      challenges: ["Extreme cold", "Technical climbing", "Weather exposure"],
      preparation: "Post-Everest conditioning and cold weather training",
      nextMilestone: "Permits and logistics planning"
    },
    {
      name: "Aconcagua",
      location: "Argentina",
      elevation: "6,962m", 
      status: "planned",
      date: "Summer 2026",
      progress: 0,
      description: "The highest peak outside of Asia, known for extreme weather.",
      challenges: ["High altitude", "Extreme winds", "Acclimatization"],
      preparation: "High-altitude endurance focus",
      nextMilestone: "Route and season planning"
    },
    {
      name: "Mount Kilimanjaro",
      location: "Tanzania",
      elevation: "5,895m",
      status: "planned", 
      date: "Fall 2026",
      progress: 0,
      description: "Africa's highest peak and the world's largest free-standing mountain.",
      challenges: ["Rapid elevation gain", "Multiple climate zones", "Altitude sickness"],
      preparation: "Endurance base building",
      nextMilestone: "Route selection and timing"
    },
    {
      name: "Mount Vinson",
      location: "Antarctica",
      elevation: "4,892m",
      status: "planned",
      date: "Winter 2026/2027",
      progress: 0,
      description: "The most remote and expensive of the Seven Summits.",
      challenges: ["Extreme isolation", "Logistics complexity", "Polar conditions"],
      preparation: "Cold weather and polar expedition training",
      nextMilestone: "Expedition logistics and permits"
    },
    {
      name: "Carstensz Pyramid",
      location: "Indonesia", 
      elevation: "4,884m",
      status: "planned",
      date: "Spring 2027",
      progress: 0,
      description: "The most technical of the Seven Summits, requiring rock climbing skills.",
      challenges: ["Technical rock climbing", "Tropical conditions", "Access permits"],
      preparation: "Technical rock climbing skill development", 
      nextMilestone: "Climbing skills assessment and training"
    }
  ]

  const completedSummits = [
    {
      name: "Mount Whitney",
      location: "California, USA",
      elevation: "4,421m",
      date: "September 2022",
      description: "My first serious high-altitude experience. Learned the importance of proper acclimatization.",
      lessons: ["Altitude affects everyone differently", "Proper hydration is critical", "Start training early"],
      gear: ["Basic mountaineering gear", "Day pack setup", "Layer system testing"]
    },
    {
      name: "Mount Rainier", 
      location: "Washington, USA",
      elevation: "4,392m",
      date: "November 2023",
      description: "First glacier experience with technical rope team skills and crevasse rescue training.",
      lessons: ["Teamwork is essential", "Technical skills save lives", "Weather changes everything"],
      gear: ["Glacier travel equipment", "Crevasse rescue gear", "Cold weather systems"]
    },
    {
      name: "Mount Shasta",
      location: "California, USA", 
      elevation: "4,317m",
      date: "January 2024",
      description: "Winter ascent in challenging conditions. Built confidence for bigger objectives.",
      lessons: ["Winter conditions multiply difficulty", "Navigation skills are critical", "Always have backup plans"],
      gear: ["Winter climbing equipment", "Emergency shelter", "Advanced navigation tools"]
    }
  ]

  const trainingMilestones = [
    { week: 1, focus: "Base fitness assessment", completed: true },
    { week: 4, focus: "Aerobic base building", completed: true },
    { week: 8, focus: "Strength phase initiation", completed: true },
    { week: 12, focus: "High-altitude simulation", completed: true },
    { week: 16, focus: "Technical skills refresh", completed: false },
    { week: 20, focus: "Peak conditioning phase", completed: false },
    { week: 24, focus: "Expedition preparation", completed: false }
  ]

  const expeditionCosts = [
    {
      category: "Gear & Equipment",
      amount: "₹8,50,000",
      percentage: 25,
      icon: Backpack,
      description: "Technical mountaineering gear, safety equipment, clothing systems",
      items: ["Mountaineering boots", "Technical clothing", "Safety equipment", "Climbing gear"]
    },
    {
      category: "Travel & Logistics", 
      amount: "₹12,75,000",
      percentage: 37,
      icon: Plane,
      description: "International flights, permits, transportation, accommodation",
      items: ["Flight to Kathmandu/Lhasa", "Everest permit", "Local transportation", "Base camp logistics"]
    },
    {
      category: "Guide Services",
      amount: "₹8,50,000", 
      percentage: 25,
      icon: Mountain,
      description: "Professional mountain guides, Sherpa support, expedition services",
      items: ["Expedition guide fees", "Sherpa support", "Oxygen and mask", "Weather forecasting"]
    },
    {
      category: "Training & Preparation",
      amount: "₹2,55,000",
      percentage: 8,
      icon: TrendingUp,
      description: "Specialized training, courses, practice expeditions",
      items: ["High-altitude training", "Technical courses", "Practice climbs", "Fitness assessment"]
    },
    {
      category: "Insurance & Safety",
      amount: "₹1,70,000",
      percentage: 5,
      icon: Shield,
      description: "Comprehensive expedition insurance, emergency evacuation",
      items: ["Travel insurance", "Helicopter evacuation", "Medical coverage", "Equipment insurance"]
    }
  ]

  const totalExpeditionCost = "₹34,00,000"

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-peak text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="M20 20l10-10v20l-10-10zm-10 0l10 10v-20l-10 10z"/%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <H1 className="text-4xl md:text-6xl font-bold">The Journey</H1>
            <BodyLarge className="text-white/90 max-w-2xl mx-auto mt-4">
              Follow my systematic progression through the Seven Summits - the highest peaks on each continent. 
              Real training data, honest challenges, and the path to Mount Everest.
            </BodyLarge>
          </motion.div>
          
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-summit-gold">3</div>
                <div className="text-sm">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-summit-gold">1</div>
                <div className="text-sm">In Training</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-summit-gold">3</div>
                <div className="text-sm">Planned</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Focus: Everest Training */}
      <section className="py-16 bg-gradient-to-br from-spa-mist/30 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3">
              <Mountain className="w-8 h-8 text-alpine-blue" />
              <H2>Current Focus: Mount Everest Training</H2>
            </div>
            <Body className="max-w-3xl mx-auto text-spa-charcoal/80">
              89 days until departure. Every workout, every decision, every piece of gear is optimized for success on the world's highest mountain.
            </Body>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card variant="premium" padding="lg" className="h-full space-y-6">
                <div className="flex items-center justify-between">
                  <H3>Training Progress</H3>
                  <StatusBadge variant="warning">Week 16 of 24</StatusBadge>
                </div>
                
                <div className="space-y-4">
                  {trainingMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${milestone.completed ? 'text-spa-charcoal' : 'text-spa-charcoal/60'}`}>
                          Week {milestone.week}: {milestone.focus}
                        </div>
                      </div>
                      {milestone.completed && <Award className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-spa-stone/20">
                  <Button variant="primary" className="w-full" asChild>
                    <Link href="/training">
                      <TrendingUp className="w-4 h-4" />
                      View Live Training Data
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card variant="premium" padding="lg" className="h-full space-y-6">
                <H3>Current Stats (This Week)</H3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-alpine-blue">127km</div>
                    <div className="text-sm text-spa-charcoal/70">Distance Covered</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-summit-gold">2,840m</div>
                    <div className="text-sm text-spa-charcoal/70">Elevation Gained</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">18.5h</div>
                    <div className="text-sm text-spa-charcoal/70">Training Duration</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-red-600">145bpm</div>
                    <div className="text-sm text-spa-charcoal/70">Avg Heart Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fitness Progress</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-alpine-blue rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '78%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>

                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/support">
                    <Heart className="w-4 h-4" />
                    Support My Training
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expedition Cost Transparency */}
      <section className="py-16 bg-gradient-to-br from-white to-spa-mist/20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3">
              <DollarSign className="w-8 h-8 text-alpine-blue" />
              <H2>Expedition Investment Breakdown</H2>
            </div>
            <Body className="max-w-3xl mx-auto text-spa-charcoal/80">
              Transparency matters. Here's exactly what it takes to safely attempt Mount Everest - 
              each investment ensures proper preparation and risk mitigation.
            </Body>
            
            <motion.div
              className="bg-gradient-to-r from-alpine-blue/10 to-summit-gold/10 rounded-2xl p-6 border border-alpine-blue/20 max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-alpine-blue mb-1">{totalExpeditionCost}</div>
                <div className="text-sm text-spa-charcoal/70">Total Expedition Investment</div>
                <div className="text-xs text-spa-charcoal/60 mt-2">~$40,000 USD</div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {expeditionCosts.map((cost, index) => {
              const IconComponent = cost.icon
              return (
                <motion.div
                  key={cost.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card variant="elevated" padding="lg" className="h-full space-y-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-alpine-blue/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-alpine-blue" />
                        </div>
                        <H3 className="text-lg">{cost.category}</H3>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-alpine-blue">{cost.amount}</div>
                        <div className="text-xs text-spa-charcoal/60">{cost.percentage}%</div>
                      </div>
                    </div>
                    
                    <Body className="text-sm text-spa-charcoal/70">{cost.description}</Body>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-spa-charcoal/70">Includes:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {cost.items.map((item, i) => (
                          <div key={i} className="text-xs text-spa-charcoal/60 flex items-center space-x-2">
                            <div className="w-1 h-1 bg-alpine-blue/60 rounded-full" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-alpine-blue to-summit-gold rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cost.percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            className="bg-gradient-to-r from-spa-mist/30 to-alpine-blue/5 rounded-2xl p-8 border border-spa-stone/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <H3>Why These Investments Matter</H3>
                <Body className="text-spa-charcoal/70 max-w-2xl mx-auto">
                  Every rupee goes toward safety, preparation, and increasing the chances of success. 
                  This isn't just about reaching the summit - it's about coming home safely.
                </Body>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-spa-charcoal/70">Safety Success Rate</div>
                  <div className="text-xs text-spa-charcoal/60">With proper preparation</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-alpine-blue">8,849m</div>
                  <div className="text-sm text-spa-charcoal/70">Altitude Challenge</div>
                  <div className="text-xs text-spa-charcoal/60">Death zone climbing</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-summit-gold">2 months</div>
                  <div className="text-sm text-spa-charcoal/70">Expedition Duration</div>
                  <div className="text-xs text-spa-charcoal/60">Including acclimatization</div>
                </div>
              </div>

              <div className="pt-4">
                <Body className="text-sm text-spa-charcoal/60 italic">
                  "The mountain doesn't care about your plan - but your preparation does. Every investment in safety and training 
                  is an investment in coming home." - Sunith Kumar
                </Body>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seven Summits Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <H2>Seven Summits Progression</H2>
            <Body className="max-w-3xl mx-auto text-spa-charcoal/80">
              Each mountain teaches different lessons. Here's my systematic approach to conquering the highest peaks on each continent.
            </Body>
          </motion.div>

          {/* Completed Summits */}
          <div className="mb-16">
            <motion.div
              className="flex items-center space-x-3 mb-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Award className="w-6 h-6 text-green-600" />
              <H3>Completed Summits</H3>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {completedSummits.map((summit, index) => (
                <motion.div
                  key={summit.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card variant="elevated" padding="lg" className="h-full space-y-4 border-l-4 border-l-green-500">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <H3 className="text-lg">{summit.name}</H3>
                        <StatusBadge variant="success">✓</StatusBadge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-spa-charcoal/60">
                        <MapPin className="w-4 h-4" />
                        <span>{summit.location} • {summit.elevation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-spa-charcoal/60">
                        <Calendar className="w-4 h-4" />
                        <span>{summit.date}</span>
                      </div>
                    </div>
                    
                    <Body className="text-sm">{summit.description}</Body>
                    
                    <div className="space-y-3 pt-2 border-t border-spa-stone/20">
                      <div>
                        <div className="text-xs font-medium text-spa-charcoal/70 mb-1">Key Lessons:</div>
                        <div className="space-y-1">
                          {summit.lessons.map((lesson, i) => (
                            <div key={i} className="text-xs text-spa-charcoal/60">• {lesson}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Planned Summits */}
          <div>
            <motion.div
              className="flex items-center space-x-3 mb-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Target className="w-6 h-6 text-alpine-blue" />
              <H3>Planned Expeditions</H3>
            </motion.div>
            
            <div className="space-y-6">
              {sevenSummits.map((summit, index) => (
                <motion.div
                  key={summit.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    variant={summit.featured ? "premium" : "elevated"} 
                    padding="lg" 
                    className={`space-y-6 ${summit.featured ? 'border-2 border-summit-gold/30' : ''}`}
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <H3 className="text-xl">{summit.name}</H3>
                          <StatusBadge variant={summit.status === 'training' ? 'warning' : 'default'}>
                            {summit.status === 'training' ? 'Training' : 'Planned'}
                          </StatusBadge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-spa-charcoal/60" />
                            <span>{summit.location} • {summit.elevation}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-spa-charcoal/60" />
                            <span>{summit.date}</span>
                          </div>
                        </div>

                        {summit.progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Preparation Progress</span>
                              <span className="text-sm font-medium">{summit.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-spa-stone/20 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-summit-gold rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${summit.progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <Body className="text-sm">{summit.description}</Body>
                        
                        <div>
                          <div className="text-sm font-medium text-spa-charcoal/70 mb-2">Key Challenges:</div>
                          <div className="space-y-1">
                            {summit.challenges.map((challenge, i) => (
                              <div key={i} className="text-xs text-spa-charcoal/60 flex items-center space-x-2">
                                <div className="w-1 h-1 bg-spa-charcoal/40 rounded-full" />
                                <span>{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-spa-charcoal/70 mb-2">Preparation Focus:</div>
                          <Body className="text-xs text-spa-charcoal/60">{summit.preparation}</Body>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-spa-charcoal/70 mb-2">Next Milestone:</div>
                          <Body className="text-xs text-spa-charcoal/60">{summit.nextMilestone}</Body>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-alpine-blue to-summit-gold text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <H2 className="text-white">Be Part of This Journey</H2>
            <BodyLarge className="max-w-2xl mx-auto text-white/90">
              Follow my real-time training, share in the challenges and victories, 
              and help make this Seven Summits journey possible.
            </BodyLarge>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button variant="secondary" size="lg" className="w-full" asChild>
              <Link href="/training">
                <TrendingUp className="w-5 h-5" />
                Live Training Data
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full text-white border-white hover:bg-white hover:text-alpine-blue" asChild>
              <Link href="/insights">
                <Mountain className="w-5 h-5" />
                Read My Stories
              </Link>
            </Button>
            <Button variant="summit" size="lg" className="w-full" asChild>
              <Link href="/support">
                <Heart className="w-5 h-5" />
                Support Journey
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}