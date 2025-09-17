'use client';

import { Award, Star, Heart, Calendar, Users, Crown, Gift } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';

interface Supporter {
  id: string;
  name: string;
  joinedDate: string;
  level: 'supporter' | 'champion' | 'ambassador' | 'legend';
  contributions: string[];
  monthlyHighlight?: string;
  avatar?: string;
  location?: string;
  favoriteActivity?: string;
}

export function SupporterRecognition() {
  const supporters: Supporter[] = [
    {
      id: '1',
      name: 'Sarah Martinez',
      joinedDate: '2023-06-15',
      level: 'champion',
      location: 'Colorado, USA',
      favoriteActivity: 'Trail Running',
      contributions: [
        'Completed 3 community challenges',
        'Shared training insights with 50+ comments',
        'Encouraged 15+ community members',
        'Newsletter subscriber for 8+ months',
      ],
      monthlyHighlight:
        'Inspired 5 new members to start their own expedition training after sharing her systematic approach success story.',
    },
    {
      id: '2',
      name: 'David Chen',
      joinedDate: '2023-03-22',
      level: 'ambassador',
      location: 'Vancouver, Canada',
      favoriteActivity: 'Mountaineering',
      contributions: [
        'Answered 100+ community questions',
        'Mentored new expedition planners',
        'Completed 5 community challenges',
        'Shared detailed gear reviews',
      ],
      monthlyHighlight:
        'Created comprehensive gear guide that helped 20+ community members make informed equipment decisions.',
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      joinedDate: '2023-08-10',
      level: 'supporter',
      location: 'Madrid, Spain',
      favoriteActivity: 'Rock Climbing',
      contributions: [
        'Active in weekly discussions',
        'Shared personal climbing achievements',
        'Participated in 2 challenges',
        'Consistent newsletter engagement',
      ],
      monthlyHighlight:
        'Completed her first multi-pitch climb using systematic training principles from the community.',
    },
  ];

  const getLevelBadge = (level: string) => {
    const levels = {
      supporter: { color: 'bg-blue-100 text-blue-700', icon: Heart },
      champion: { color: 'bg-purple-100 text-purple-700', icon: Star },
      ambassador: { color: 'bg-amber-100 text-amber-700', icon: Crown },
      legend: { color: 'bg-red-100 text-red-700', icon: Award },
    };
    return levels[level as keyof typeof levels] || levels.supporter;
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${months} months`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-light text-spa-charcoal">
              Community Champions
            </h2>
          </div>
          <p className="text-spa-charcoal/70 max-w-2xl mx-auto">
            Celebrating supporters who contribute to our community's growth,
            share valuable insights, and inspire fellow adventurers on their
            journeys.
          </p>
        </div>

        {/* Recognition Levels */}
        <div className="bg-gradient-to-br from-spa-mist/20 to-white rounded-2xl p-8 border border-spa-stone/10 mb-12">
          <h3 className="text-xl font-medium text-spa-charcoal text-center mb-8">
            Recognition Levels
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                level: 'supporter',
                label: 'Supporter',
                description: 'Active community participation',
              },
              {
                level: 'champion',
                label: 'Champion',
                description: 'Consistent engagement & challenges',
              },
              {
                level: 'ambassador',
                label: 'Ambassador',
                description: 'Mentoring & community leadership',
              },
              {
                level: 'legend',
                label: 'Legend',
                description: 'Exceptional long-term contribution',
              },
            ].map(({ level, label, description }) => {
              const badge = getLevelBadge(level);
              const Icon = badge.icon;

              return (
                <div key={level} className="text-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3',
                      badge.color
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-spa-charcoal mb-1">
                    {label}
                  </h4>
                  <p className="text-spa-charcoal/60 text-sm">{description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Supporters */}
        <div className="space-y-8">
          {supporters.map((supporter) => {
            const badge = getLevelBadge(supporter.level);
            const Icon = badge.icon;

            return (
              <div
                key={supporter.id}
                className="bg-gradient-to-br from-spa-cloud/30 to-white rounded-xl p-6 border border-spa-stone/10 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Supporter Info */}
                  <div className="lg:w-1/3">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-alpine-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-alpine-blue" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-spa-charcoal">
                            {supporter.name}
                          </h3>
                          <Badge className={badge.color}>
                            {supporter.level}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-spa-charcoal/60">
                          {supporter.location && (
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{supporter.location}</span>
                            </div>
                          )}

                          {supporter.favoriteActivity && (
                            <div className="flex items-center gap-1">
                              <span>🏔️</span>
                              <span>{supporter.favoriteActivity}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Member for {formatJoinDate(supporter.joinedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contributions & Highlight */}
                  <div className="lg:w-2/3 space-y-6">
                    {/* Monthly Highlight */}
                    {supporter.monthlyHighlight && (
                      <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            February Highlight
                          </span>
                        </div>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          {supporter.monthlyHighlight}
                        </p>
                      </div>
                    )}

                    {/* Contributions */}
                    <div>
                      <h4 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-alpine-blue" />
                        Community Contributions
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {supporter.contributions.map((contribution, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-alpine-blue rounded-full mt-2 flex-shrink-0" />
                            <span className="text-spa-charcoal/80">
                              {contribution}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recognition CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-alpine-blue/10 to-spa-cloud/30 rounded-2xl p-8 border border-spa-stone/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-6 h-6 text-alpine-blue" />
              <h3 className="text-xl font-medium text-spa-charcoal">
                Want to Be Recognized?
              </h3>
            </div>
            <p className="text-spa-charcoal/70 mb-6 max-w-2xl mx-auto">
              Active community participation, helping fellow adventurers, and
              sharing your journey can lead to recognition in our monthly
              highlights and special supporter features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="summit" asChild>
                <a href="/community">Join Discussions</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/community#challenges">Join a Challenge</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
