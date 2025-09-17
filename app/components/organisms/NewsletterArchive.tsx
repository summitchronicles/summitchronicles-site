'use client';

import { useState } from 'react';
import {
  Calendar,
  Eye,
  Clock,
  TrendingUp,
  Mountain,
  Users,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { cn } from '@/lib/utils';

interface NewsletterEdition {
  id: string;
  title: string;
  date: string;
  summary: string;
  topics: string[];
  readTime: string;
  openRate?: string;
  featured?: boolean;
  buttondownUrl?: string;
}

export function NewsletterArchive() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock newsletter data - in real implementation, this would come from Buttondown API
  const newsletters: NewsletterEdition[] = [
    {
      id: '2024-01',
      title: 'Week 1: Training Foundation & Base Building Begins',
      date: '2024-01-08',
      summary:
        'Starting the systematic 12-month Everest preparation with base building phase, establishing training routines, and setting measurable goals.',
      topics: ['Base Building', 'Training Methodology', 'Goal Setting'],
      readTime: '5 min',
      openRate: '89%',
      featured: true,
      buttondownUrl:
        'https://buttondown.email/summitchronicles/archive/week-1-training-foundation',
    },
    {
      id: '2024-02',
      title: 'Week 2: Cardiovascular Progress & Mindset Development',
      date: '2024-01-15',
      summary:
        'Deep dive into aerobic capacity building, mental preparation techniques, and community support systems for long-term expedition success.',
      topics: ['Cardiovascular Training', 'Mental Preparation', 'Community'],
      readTime: '6 min',
      openRate: '92%',
      buttondownUrl:
        'https://buttondown.email/summitchronicles/archive/week-2-cardiovascular-progress',
    },
    {
      id: '2024-03',
      title: 'Week 3: Strength Training Integration & Gear Selection',
      date: '2024-01-22',
      summary:
        'Introducing strength training protocols, gear selection methodology, and balancing different training modalities for optimal preparation.',
      topics: ['Strength Training', 'Gear Selection', 'Training Balance'],
      readTime: '7 min',
      openRate: '85%',
      buttondownUrl:
        'https://buttondown.email/summitchronicles/archive/week-3-strength-training',
    },
    {
      id: '2024-04',
      title: 'Week 4: First Month Reflection & Adjustment',
      date: '2024-01-29',
      summary:
        'Analyzing first month progress, adjusting training protocols based on data, and celebrating early milestones with community support.',
      topics: [
        'Progress Analysis',
        'Protocol Adjustment',
        'Milestone Celebration',
      ],
      readTime: '5 min',
      openRate: '88%',
      buttondownUrl:
        'https://buttondown.email/summitchronicles/archive/week-4-first-month-reflection',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Updates', count: newsletters.length },
    { id: 'training', label: 'Training', count: 3 },
    { id: 'gear', label: 'Gear & Equipment', count: 1 },
    { id: 'mental', label: 'Mental Preparation', count: 2 },
    { id: 'community', label: 'Community', count: 4 },
  ];

  const filteredNewsletters =
    selectedCategory === 'all'
      ? newsletters
      : newsletters.filter((newsletter) =>
          newsletter.topics.some(
            (topic) =>
              topic.toLowerCase().includes(selectedCategory.toLowerCase()) ||
              (selectedCategory === 'mental' &&
                topic.toLowerCase().includes('mental')) ||
              (selectedCategory === 'gear' &&
                topic.toLowerCase().includes('gear')) ||
              (selectedCategory === 'community' &&
                topic.toLowerCase().includes('community'))
          )
        );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-spa-mist/20 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-alpine-blue" />
            <h2 className="text-3xl font-light text-spa-charcoal">
              Newsletter Archive
            </h2>
          </div>
          <p className="text-spa-charcoal/70 mb-8">
            Browse past expedition updates, training insights, and community
            stories
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(({ id, label, count }) => (
              <Button
                key={id}
                variant={selectedCategory === id ? 'summit' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(id)}
                className="flex items-center gap-2"
              >
                {label}
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Newsletter Grid */}
        <div className="grid gap-8">
          {filteredNewsletters.map((newsletter) => (
            <article
              key={newsletter.id}
              className={cn(
                'bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm hover:shadow-md transition-all',
                newsletter.featured && 'ring-2 ring-alpine-blue/20'
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-spa-charcoal mb-2">
                        {newsletter.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-spa-charcoal/60 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(newsletter.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {newsletter.readTime} read
                        </div>
                        {newsletter.openRate && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {newsletter.openRate} open rate
                          </div>
                        )}
                      </div>
                    </div>

                    {newsletter.featured && (
                      <Badge
                        variant="summit"
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-spa-charcoal/80 leading-relaxed mb-4">
                    {newsletter.summary}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {newsletter.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-48 space-y-3">
                  {newsletter.buttondownUrl ? (
                    <Button
                      variant="summit"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      asChild
                    >
                      <a
                        href={newsletter.buttondownUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read Full Edition
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}

                  <div className="text-center">
                    <div className="text-sm text-spa-charcoal/60">
                      Subscribe to get future updates
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredNewsletters.length === 0 && (
          <div className="text-center py-12">
            <Mountain className="w-12 h-12 text-spa-charcoal/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-spa-charcoal mb-2">
              No newsletters found
            </h3>
            <p className="text-spa-charcoal/60">
              Try selecting a different category or check back soon for new
              content.
            </p>
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-alpine-blue/10 to-spa-cloud/30 rounded-2xl p-8 border border-spa-stone/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-6 h-6 text-alpine-blue" />
              <h3 className="text-xl font-medium text-spa-charcoal">
                Don't Miss Future Updates
              </h3>
            </div>
            <p className="text-spa-charcoal/70 mb-6">
              Join 2,847+ adventurers following the Mount Everest expedition
              journey
            </p>
            <Button variant="summit" size="lg" asChild>
              <a href="#newsletter-signup">Subscribe to Newsletter</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
