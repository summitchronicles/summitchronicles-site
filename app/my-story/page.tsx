'use client';

import Link from 'next/link';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Button } from '../components/atoms/Button';
import {
  H1,
  H2,
  H3,
  Body,
  BodyLarge,
  SeriaText,
} from '../components/atoms/Typography';
import { Card, CardContent, CardHeader } from '../components/molecules/Card';
import { StatusBadge } from '../components/molecules/StatusBadge';
import {
  Mountain,
  MapPin,
  Calendar,
  Target,
  Users,
  TrendingUp,
  Heart,
  Award,
  BookOpen,
  Briefcase,
} from 'lucide-react';

export default function MyStoryPage() {
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
        <section className="py-20 gradient-peak text-white">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <H1 className="text-4xl md:text-6xl font-bold">My Story</H1>
            <BodyLarge className="text-white/90 max-w-2xl mx-auto">
              From software engineer to mountaineer - the journey that led me to
              pursue the Seven Summits and share the adventure with the world.
            </BodyLarge>
          </div>
        </section>

        {/* Personal Background */}
        <section className="py-16 space-y-12">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <H2>Who I Am</H2>
                <SeriaText>
                  I'm Sunith Kumar, a software engineer from Mountain View,
                  California, who discovered that the mountains I could see from
                  my office window held adventures I never imagined. What
                  started as weekend hiking to escape the tech world has evolved
                  into a systematic pursuit of the Seven Summits - the highest
                  peaks on each continent.
                </SeriaText>
                <SeriaText>
                  My approach to mountaineering mirrors my engineering
                  background: methodical preparation, data-driven training, and
                  systematic skill development. But beyond the technical
                  aspects, climbing has taught me that the most profound
                  challenges aren't about reaching summits - they're about
                  discovering what you're capable of when everything is stripped
                  away.
                </SeriaText>
              </div>
              <div className="space-y-4">
                <Card variant="elevated" padding="lg" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-6 h-6 text-alpine-blue" />
                    <H3>Professional Background</H3>
                  </div>
                  <Body className="text-sm">
                    Software Engineer with 8+ years in tech, specializing in
                    scalable systems and data analytics. Currently working in
                    Mountain View, California.
                  </Body>
                </Card>

                <Card variant="elevated" padding="lg" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mountain className="w-6 h-6 text-summit-gold" />
                    <H3>Mountaineering Journey</H3>
                  </div>
                  <Body className="text-sm">
                    Started with local California peaks in 2022. Currently
                    training for Mount Everest while documenting the complete
                    Seven Summits journey.
                  </Body>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why I Started */}
        <section className="py-16 bg-spa-mist/30 space-y-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12">
              <H2>Why I Started Climbing</H2>
              <Body className="max-w-2xl mx-auto">
                The path from keyboard to crampons wasn't planned - it was
                discovered.
              </Body>
            </div>

            <div className="space-y-8">
              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-alpine-blue" />
                  <H3>The Awakening</H3>
                </div>
                <SeriaText>
                  In 2022, I found myself working 70-hour weeks, excellent at
                  solving complex problems for others but feeling disconnected
                  from any meaningful challenge for myself. A friend invited me
                  on what I thought would be a simple day hike to Mount Whitney.
                  Fourteen hours later, standing at 14,505 feet, I realized I
                  had found something I didn't know I was looking for.
                </SeriaText>
              </Card>

              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <H3>The Decision</H3>
                </div>
                <SeriaText>
                  The moment I learned about the Seven Summits, I knew this was
                  my path. Not because I needed to prove anything to anyone
                  else, but because I needed to prove something to myself. Could
                  someone who spent their days in front of screens train their
                  body and mind to handle the most extreme environments on
                  Earth?
                </SeriaText>
              </Card>

              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-summit-gold" />
                  <H3>The Community</H3>
                </div>
                <SeriaText>
                  What surprised me most wasn't the physical challenge - it was
                  the community. Mountaineers share knowledge freely, celebrate
                  each other's successes, and support each other through
                  failures. This platform exists to extend that spirit, sharing
                  real training data, honest expedition reports, and practical
                  insights that might help others pursue their own impossible
                  dreams.
                </SeriaText>
              </Card>
            </div>
          </div>
        </section>

        {/* Mountain Timeline */}
        <section className="py-16 space-y-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12">
              <H2>My Climbing Timeline</H2>
              <Body className="max-w-2xl mx-auto">
                Each mountain has taught me something different. Here's the
                progression from beginner to Everest candidate.
              </Body>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-sm text-spa-charcoal/60">
                    September 2022
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-summit-gold rounded-full mt-2"></div>
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex-1 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <H3>Mount Whitney - The Beginning</H3>
                    <StatusBadge variant="success">4,421m</StatusBadge>
                  </div>
                  <Body className="text-sm">
                    My first real mountain. Learned that physical fitness alone
                    isn't enough - altitude affects everyone differently.
                    Started studying high-altitude physiology and proper
                    acclimatization techniques.
                  </Body>
                </Card>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-sm text-spa-charcoal/60">
                    November 2023
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-summit-gold rounded-full mt-2"></div>
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex-1 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <H3>Mount Rainier - Technical Skills</H3>
                    <StatusBadge variant="success">4,392m</StatusBadge>
                  </div>
                  <Body className="text-sm">
                    First glacier experience. Learned rope team travel, crevasse
                    rescue, and ice axe self-arrest. Realized that
                    mountaineering is as much about safety systems and team
                    dynamics as individual strength.
                  </Body>
                </Card>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-sm text-spa-charcoal/60">
                    January 2024
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-summit-gold rounded-full mt-2"></div>
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex-1 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <H3>Mount Shasta - Winter Conditions</H3>
                    <StatusBadge variant="success">4,317m</StatusBadge>
                  </div>
                  <Body className="text-sm">
                    Winter ascent in challenging conditions. Learned gear
                    management in extreme cold, navigation in whiteout
                    conditions, and the importance of having multiple
                    contingency plans. This climb convinced me I was ready for
                    bigger challenges.
                  </Body>
                </Card>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-sm text-spa-charcoal/60">
                    Spring 2025
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-alpine-blue rounded-full mt-2"></div>
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex-1 space-y-3 border-2 border-summit-gold/30"
                >
                  <div className="flex items-center justify-between">
                    <H3>Mount Everest - The Ultimate Test</H3>
                    <StatusBadge variant="warning">8,849m</StatusBadge>
                  </div>
                  <Body className="text-sm">
                    Currently in intensive training. This isn't just about
                    personal achievement - it's about proving that systematic
                    preparation, data-driven training, and community support can
                    help anyone pursue extraordinary goals.
                  </Body>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* My Philosophy */}
        <section className="py-16 bg-gradient-to-r from-alpine-blue to-summit-gold text-white space-y-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12">
              <H2 className="text-white">My Climbing Philosophy</H2>
              <Body className="text-white/90 max-w-2xl mx-auto">
                The principles that guide my approach to mountaineering and
                life.
              </Body>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card
                variant="elevated"
                padding="lg"
                className="space-y-4 bg-white/10 backdrop-blur-sm border-white/20"
              >
                <H3 className="text-white">Data-Driven Preparation</H3>
                <Body className="text-white/90 text-sm">
                  Every training session is tracked, every gear choice is
                  tested, every route is studied. My engineering background
                  taught me that preparation eliminates luck from the equation.
                </Body>
              </Card>

              <Card
                variant="elevated"
                padding="lg"
                className="space-y-4 bg-white/10 backdrop-blur-sm border-white/20"
              >
                <H3 className="text-white">Safety First, Always</H3>
                <Body className="text-white/90 text-sm">
                  No summit is worth not coming home. I climb conservatively,
                  with multiple backup plans, and I'm not afraid to turn around
                  when conditions aren't right.
                </Body>
              </Card>

              <Card
                variant="elevated"
                padding="lg"
                className="space-y-4 bg-white/10 backdrop-blur-sm border-white/20"
              >
                <H3 className="text-white">Share the Journey</H3>
                <Body className="text-white/90 text-sm">
                  Knowledge shared is knowledge multiplied. Every failure
                  teaches something, every success can inspire someone else to
                  start their own journey.
                </Body>
              </Card>

              <Card
                variant="elevated"
                padding="lg"
                className="space-y-4 bg-white/10 backdrop-blur-sm border-white/20"
              >
                <H3 className="text-white">Respect the Mountain</H3>
                <Body className="text-white/90 text-sm">
                  Mountains don't care about your schedule, your ego, or your
                  goals. They demand respect, patience, and humility - qualities
                  that improve every aspect of life.
                </Body>
              </Card>
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section className="py-16 space-y-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center space-y-4 mb-12">
              <H2>What's Next</H2>
              <Body className="max-w-2xl mx-auto">
                The Everest expedition is just the beginning of a larger
                mission.
              </Body>
            </div>

            <div className="space-y-6">
              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mountain className="w-6 h-6 text-alpine-blue" />
                  <H3>Immediate Goal: Mount Everest (Spring 2025)</H3>
                </div>
                <Body className="text-sm">
                  Currently 89 days into intensive training. Every workout,
                  every piece of gear, every training decision is documented and
                  shared. This expedition will be the most thoroughly documented
                  amateur Everest attempt ever.
                </Body>
              </Card>

              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-summit-gold" />
                  <H3>
                    Long-term Vision: Complete Seven Summits Documentation
                  </H3>
                </div>
                <Body className="text-sm">
                  After Everest: Denali, Aconcagua, Kilimanjaro, and Vinson.
                  Each expedition will include detailed training protocols, gear
                  testing, and real-time data sharing to help others plan their
                  own expeditions.
                </Body>
              </Card>

              <Card variant="premium" padding="lg" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <H3>Community Impact: Democratizing Expedition Knowledge</H3>
                </div>
                <Body className="text-sm">
                  Traditional expedition knowledge has been gatekept by
                  expensive guides and exclusive clubs. I'm building a platform
                  that makes high-quality mountaineering education accessible to
                  anyone with the determination to pursue it.
                </Body>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-spa-mist/30 space-y-8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-4 mb-8">
              <H2>Join My Journey</H2>
              <BodyLarge className="max-w-2xl mx-auto">
                Follow along as I train for Everest, learn from my mistakes,
                celebrate the victories, and maybe find inspiration for your own
                impossible dream.
              </BodyLarge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button variant="primary" size="lg" className="w-full" asChild>
                <Link href="/the-journey">
                  <Mountain className="w-5 h-5" />
                  Follow Everest Prep
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="w-full" asChild>
                <Link href="/insights">
                  <BookOpen className="w-5 h-5" />
                  Read My Stories
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="w-full" asChild>
                <Link href="/connect">
                  <Users className="w-5 h-5" />
                  Connect With Me
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
