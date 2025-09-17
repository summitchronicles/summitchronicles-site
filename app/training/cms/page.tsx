'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';
import { sanityClient, queries } from '../../../lib/sanity/client';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Mountain,
  Activity,
  Target,
} from 'lucide-react';

interface TrainingEntry {
  _id: string;
  title: string;
  date: string;
  type: string;
  duration: number;
  intensity: string;
  description: string;
  metrics: {
    distance?: number;
    elevationGain?: number;
    heartRateAvg?: number;
    heartRateMax?: number;
    calories?: number;
    weight?: number;
  };
  location: {
    name?: string;
    weather?: string;
    temperature?: number;
  };
  photos: any[];
  tags: string[];
  stravaId?: string;
}

const typeIcons: Record<string, string> = {
  cardio: '🏃',
  strength: '💪',
  technical: '🧗',
  altitude: '⛰️',
  hiking: '🥾',
  climbing: '🧗‍♂️',
  recovery: '🧘',
  cross: '🏋️',
};

const intensityColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  moderate: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  maximum: 'bg-red-100 text-red-700',
};

export default function CMSTrainingPage() {
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainingEntries = async () => {
      try {
        const data = await sanityClient.fetch(queries.allTrainingEntries);
        setEntries(data || []);
      } catch (err) {
        setError('Failed to fetch training entries');
        console.error('Error fetching training entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingEntries();
  }, []);

  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.duration / 60,
    0
  );
  const totalElevation = entries.reduce(
    (sum, entry) => sum + (entry.metrics?.elevationGain || 0),
    0
  );
  const totalDistance = entries.reduce(
    (sum, entry) => sum + (entry.metrics?.distance || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-spa-stone flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-spa-stone/20 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-spa-stone flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12 text-center">
            <h1 className="text-3xl font-light text-spa-charcoal mb-4">
              Training Dashboard
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Make sure Sanity is configured and training entries are
                available.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-light text-spa-charcoal mb-4">
                Training Dashboard
              </h1>
              <p className="text-xl text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
                Real-time training data powered by Sanity CMS with comprehensive
                metrics and analytics.
              </p>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center border border-spa-stone/10">
                <Activity className="w-8 h-8 text-alpine-blue mx-auto mb-3" />
                <div className="text-2xl font-light text-spa-charcoal mb-1">
                  {entries.length}
                </div>
                <div className="text-sm text-spa-charcoal/70">
                  Training Sessions
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center border border-spa-stone/10">
                <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-light text-spa-charcoal mb-1">
                  {totalHours.toFixed(1)}h
                </div>
                <div className="text-sm text-spa-charcoal/70">Total Hours</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center border border-spa-stone/10">
                <Mountain className="w-8 h-8 text-summit-gold mx-auto mb-3" />
                <div className="text-2xl font-light text-spa-charcoal mb-1">
                  {totalElevation.toLocaleString()}ft
                </div>
                <div className="text-sm text-spa-charcoal/70">
                  Elevation Gain
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center border border-spa-stone/10">
                <Target className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <div className="text-2xl font-light text-spa-charcoal mb-1">
                  {totalDistance.toFixed(1)}mi
                </div>
                <div className="text-sm text-spa-charcoal/70">
                  Total Distance
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Training Entries */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-light text-spa-charcoal mb-4">
                  No Training Entries Yet
                </h2>
                <p className="text-spa-charcoal/70 mb-6">
                  Create your first training entry in the Sanity Studio to see
                  it appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry, index) => (
                  <motion.article
                    key={entry._id}
                    className="bg-white rounded-xl border border-spa-stone/10 p-6 shadow-sm hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {typeIcons[entry.type] || '🏔️'}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-spa-charcoal">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-spa-charcoal/60 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{entry.duration} min</span>
                            </div>
                            {entry.location?.name && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{entry.location.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${intensityColors[entry.intensity] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {entry.intensity}
                      </div>
                    </div>

                    {entry.description && (
                      <p className="text-spa-charcoal/80 mb-4 leading-relaxed">
                        {entry.description}
                      </p>
                    )}

                    {/* Metrics */}
                    {entry.metrics && Object.keys(entry.metrics).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-spa-cloud/20 rounded-lg">
                        {entry.metrics.distance && (
                          <div className="text-center">
                            <div className="text-lg font-light text-spa-charcoal">
                              {entry.metrics.distance}mi
                            </div>
                            <div className="text-xs text-spa-charcoal/60">
                              Distance
                            </div>
                          </div>
                        )}
                        {entry.metrics.elevationGain && (
                          <div className="text-center">
                            <div className="text-lg font-light text-spa-charcoal">
                              {entry.metrics.elevationGain}ft
                            </div>
                            <div className="text-xs text-spa-charcoal/60">
                              Elevation
                            </div>
                          </div>
                        )}
                        {entry.metrics.heartRateAvg && (
                          <div className="text-center">
                            <div className="text-lg font-light text-spa-charcoal">
                              {entry.metrics.heartRateAvg} bpm
                            </div>
                            <div className="text-xs text-spa-charcoal/60">
                              Avg HR
                            </div>
                          </div>
                        )}
                        {entry.metrics.calories && (
                          <div className="text-center">
                            <div className="text-lg font-light text-spa-charcoal">
                              {entry.metrics.calories}
                            </div>
                            <div className="text-xs text-spa-charcoal/60">
                              Calories
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-alpine-blue/10 text-alpine-blue rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {entry.stravaId && (
                      <div className="mt-4 pt-4 border-t border-spa-stone/10">
                        <div className="flex items-center gap-2 text-sm text-spa-charcoal/60">
                          <TrendingUp className="w-4 h-4" />
                          <span>Synced with Strava</span>
                        </div>
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
