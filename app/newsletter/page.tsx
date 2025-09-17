import {
  Mail,
  Users,
  Calendar,
  Gift,
  CheckCircle,
  Mountain,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { NewsletterSubscriptionForm } from '../components/organisms/NewsletterSubscriptionForm';
import { NewsletterArchive } from '../components/organisms/NewsletterArchive';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Newsletter | Summit Chronicles',
  description:
    'Join thousands of adventurers following the Mount Everest expedition journey. Get weekly training updates, behind-the-scenes insights, and exclusive content.',
  openGraph: {
    title: 'Summit Chronicles Newsletter - Join the Journey',
    description:
      'Weekly expedition updates, training insights, and behind-the-scenes stories from the Mount Everest preparation journey.',
  },
};

export default function NewsletterPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Training Progress Updates',
      description:
        'Weekly insights into systematic training methodology, performance metrics, and preparation milestones achieved.',
    },
    {
      icon: Mountain,
      title: 'Behind-the-Scenes Stories',
      description:
        'Authentic expedition preparation stories, challenges overcome, and lessons learned on the journey to Everest.',
    },
    {
      icon: Heart,
      title: 'Community Connection',
      description:
        'Join a supportive community of adventurers, receive encouragement, and share in celebration of achievements.',
    },
    {
      icon: Gift,
      title: 'Exclusive Content',
      description:
        'Subscriber-only training guides, gear recommendations, and early access to expedition planning insights.',
    },
  ];

  const testimonials = [
    {
      quote:
        "The weekly updates keep me motivated in my own training. Sunith's systematic approach is incredibly inspiring.",
      author: 'Sarah M.',
      role: 'Trail Runner & Mountaineer',
    },
    {
      quote:
        "I love the authentic storytelling and detailed training insights. It's like having a personal expedition mentor.",
      author: 'Mike T.',
      role: 'Adventure Enthusiast',
    },
    {
      quote:
        "The community aspect is amazing. We're all supporting each other's adventures and celebrating together.",
      author: 'Elena R.',
      role: 'Rock Climber',
    },
  ];

  const stats = [
    { label: 'Active Subscribers', value: '2,847', icon: Users },
    { label: 'Weekly Updates', value: '52+', icon: Calendar },
    { label: 'Training Insights', value: '150+', icon: TrendingUp },
    { label: 'Community Stories', value: '89', icon: Heart },
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
        <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-alpine-blue" />
              <h1 className="text-4xl lg:text-5xl font-light text-spa-charcoal">
                Join the Journey
              </h1>
            </div>

            <p className="text-xl text-spa-charcoal/80 mb-8 leading-relaxed">
              Get weekly updates on the Mount Everest expedition preparation,
              training insights, and behind-the-scenes stories delivered to your
              inbox.
            </p>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm mb-12">
              <NewsletterSubscriptionForm variant="hero" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-alpine-blue/10 rounded-xl mb-3">
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

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-spa-charcoal mb-4">
                What You'll Receive
              </h2>
              <p className="text-spa-charcoal/70 text-lg">
                Every newsletter edition is carefully crafted with valuable
                insights and authentic storytelling
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-gradient-to-br from-spa-mist/20 to-white rounded-xl p-6 border border-spa-stone/10"
                >
                  <div className="w-12 h-12 bg-alpine-blue/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-alpine-blue" />
                  </div>
                  <h3 className="text-lg font-medium text-spa-charcoal mb-3">
                    {title}
                  </h3>
                  <p className="text-spa-charcoal/70 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Preview Section */}
        <section className="py-16 bg-gradient-to-br from-spa-cloud/30 to-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-spa-charcoal mb-4">
                Newsletter Content Preview
              </h2>
              <p className="text-spa-charcoal/70">
                Here's what you can expect in your weekly Summit Chronicles
                update
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-spa-charcoal mb-2">
                      Training Highlights
                    </h3>
                    <p className="text-spa-charcoal/70 text-sm">
                      Weekly training metrics, progression analytics, and
                      methodology insights from systematic Everest preparation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-spa-charcoal mb-2">
                      Personal Reflections
                    </h3>
                    <p className="text-spa-charcoal/70 text-sm">
                      Authentic stories about challenges, victories, and
                      learning experiences from the preparation journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-spa-charcoal mb-2">
                      Community Spotlight
                    </h3>
                    <p className="text-spa-charcoal/70 text-sm">
                      Celebrating subscriber achievements, answering community
                      questions, and sharing supporter stories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-spa-charcoal mb-2">
                      Upcoming Milestones
                    </h3>
                    <p className="text-spa-charcoal/70 text-sm">
                      Preview of upcoming training phases, expedition
                      preparations, and opportunities for community
                      participation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-spa-charcoal mb-4">
                Community Voices
              </h2>
              <p className="text-spa-charcoal/70">
                What our subscribers say about joining the Summit Chronicles
                journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map(({ quote, author, role }, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-spa-mist/20 to-white rounded-xl p-6 border border-spa-stone/10"
                >
                  <p className="text-spa-charcoal/80 italic mb-4 leading-relaxed">
                    "{quote}"
                  </p>
                  <div className="text-sm">
                    <div className="font-medium text-spa-charcoal">
                      {author}
                    </div>
                    <div className="text-spa-charcoal/60">{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Archive */}
        <NewsletterArchive />

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-br from-spa-charcoal to-alpine-blue text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-light mb-4">
              Ready to Join the Adventure?
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Be part of a community that celebrates systematic preparation,
              authentic storytelling, and the journey toward ambitious goals.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <NewsletterSubscriptionForm variant="cta" />
            </div>

            <div className="mt-8 text-sm text-white/60">
              <p>
                Join 2,847+ adventurers • Weekly updates • Unsubscribe anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
