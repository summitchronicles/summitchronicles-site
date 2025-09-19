import {
  Users,
  MessageCircle,
  Heart,
  Award,
  Calendar,
  Send,
  Mountain,
  TrendingUp,
} from 'lucide-react';
import { Header } from '../components/organisms/Header';
import { CommunityFeed } from '../components/organisms/CommunityFeed';
import { QuestionSubmission } from '../components/organisms/QuestionSubmission';
import { CommunityChallenge } from '../components/organisms/CommunityChallenge';
import { SupporterRecognition } from '../components/organisms/SupporterRecognition';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Summit Chronicles',
  description:
    'Join a supportive community of adventurers following the Mount Everest expedition journey. Share achievements, ask questions, and celebrate together.',
  openGraph: {
    title: 'Summit Chronicles Community - Join Fellow Adventurers',
    description:
      'Connect with supporters, share your journey, and be part of expedition celebrations and community challenges.',
  },
};

export default function CommunityPage() {
  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: Users },
    { label: 'Weekly Discussions', value: '156', icon: MessageCircle },
    { label: 'Achievements Shared', value: '89', icon: Award },
    { label: 'Community Challenges', value: '12', icon: TrendingUp },
  ];

  const communityGuidelines = [
    "Celebrate each other's achievements, no matter how small",
    'Ask questions about training, gear, or expedition preparation',
    'Share your own adventure stories and lessons learned',
    'Offer encouragement and support to fellow community members',
    'Respect diverse experience levels and backgrounds',
    'Keep discussions constructive and expedition-focused',
  ];

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
        <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-8 h-8 text-alpine-blue" />
                <h1 className="text-4xl font-light text-spa-charcoal">
                  Community Hub
                </h1>
              </div>
              <p className="text-xl text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
                Connect with fellow adventurers supporting the Mount Everest
                expedition journey. Share achievements, ask questions, and
                celebrate systematic preparation together.
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {communityStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-alpine-blue/10 rounded-xl mx-auto mb-3">
                    <Icon className="w-6 h-6 text-alpine-blue" />
                  </div>
                  <div className="text-2xl font-light text-spa-charcoal mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-spa-charcoal/70">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-3xl font-light text-spa-charcoal">
                  Community Guidelines
                </h2>
              </div>
              <p className="text-spa-charcoal/70">
                Our community thrives on mutual support, authentic sharing, and
                positive encouragement
              </p>
            </div>

            <div className="bg-gradient-to-br from-spa-mist/20 to-white rounded-2xl p-8 border border-spa-stone/10">
              <div className="grid md:grid-cols-2 gap-6">
                {communityGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-spa-charcoal/80 leading-relaxed">
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Question Submission */}
        <QuestionSubmission />

        {/* Community Challenges */}
        <CommunityChallenge />

        {/* Community Feed */}
        <CommunityFeed />

        {/* Supporter Recognition */}
        <SupporterRecognition />

        {/* Join Community CTA */}
        <section className="py-16 bg-gradient-to-br from-spa-charcoal to-alpine-blue text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mountain className="w-8 h-8" />
              <h2 className="text-3xl font-light">
                Ready to Join the Adventure?
              </h2>
            </div>
            <p className="text-white/80 mb-8 leading-relaxed">
              Be part of a community that celebrates systematic preparation,
              authentic storytelling, and the journey toward ambitious goals.
              Your support and encouragement help fuel the expedition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-spa-charcoal rounded-xl font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Start a Discussion
              </button>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Join Next Challenge
              </button>
            </div>

            <div className="mt-8 text-sm text-white/60">
              <p>
                2,847+ community members • Weekly challenges • Milestone
                celebrations
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
