'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, MapPin, Heart, Clock, Zap, Mountain, Calendar, Award, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StravaActivityProps {
  activity: {
    id: string
    name: string
    type: string
    date: string
    distance: number
    duration: number
    elevation: number
    heartRate?: number
    location: string
  }
}

function ActivityCard({ activity }: StravaActivityProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hiking':
      case 'hike':
        return Mountain
      case 'running':
      case 'run':
        return Activity
      case 'ice climbing':
      case 'climb':
        return Award
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hiking':
      case 'hike':
        return 'text-emerald-600 bg-emerald-100'
      case 'running':
      case 'run':
        return 'text-alpine-blue bg-alpine-blue/10'
      case 'ice climbing':
      case 'climb':
        return 'text-summit-gold bg-summit-gold/10'
      default:
        return 'text-spa-charcoal bg-spa-mist/20'
    }
  }

  const ActivityIcon = getActivityIcon(activity.type)

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('p-2 rounded-lg', getActivityColor(activity.type))}>
              <ActivityIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-spa-charcoal group-hover:text-alpine-blue transition-colors">{activity.name}</h3>
              <div className="flex items-center gap-2 text-sm text-spa-charcoal/60">
                <span>{activity.type}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-80"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-spa-mist/10 rounded-lg">
          <div className="text-xl font-light text-spa-charcoal">{activity.distance}km</div>
          <div className="text-xs text-spa-charcoal/60">Distance</div>
        </div>
        
        <div className="text-center p-3 bg-spa-mist/10 rounded-lg">
          <div className="text-xl font-light text-spa-charcoal">{formatDuration(activity.duration)}</div>
          <div className="text-xs text-spa-charcoal/60">Duration</div>
        </div>
        
        <div className="text-center p-3 bg-spa-mist/10 rounded-lg">
          <div className="text-xl font-light text-spa-charcoal">{activity.elevation}m</div>
          <div className="text-xs text-spa-charcoal/60">Elevation</div>
        </div>
        
        {activity.heartRate ? (
          <div className="text-center p-3 bg-spa-mist/10 rounded-lg">
            <div className="text-xl font-light text-spa-charcoal">{activity.heartRate}</div>
            <div className="text-xs text-spa-charcoal/60">Avg HR</div>
          </div>
        ) : (
          <div className="text-center p-3 bg-spa-mist/10 rounded-lg">
            <div className="text-xl font-light text-spa-charcoal/40">-</div>
            <div className="text-xs text-spa-charcoal/40">No HR data</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-spa-stone/10">
        <div className="flex items-center gap-2 text-sm text-spa-charcoal/70">
          <MapPin className="w-4 h-4" />
          <span>{activity.location}</span>
        </div>
        <button className="flex items-center gap-1 text-sm text-alpine-blue hover:text-alpine-blue/80 transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span>View on Strava</span>
        </button>
      </div>
    </div>
  )
}

export function StravaActivityFeed() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('syncing')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setSyncStatus('syncing')
      const response = await fetch('/api/strava/activities')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch activities')
      }
      
      setActivities(data.activities || [])
      setSyncStatus('synced')
      console.log(`📊 Loaded ${data.activities?.length || 0} activities from ${data.source || 'unknown'}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities')
      setSyncStatus('error')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fallback data if no activities loaded
  const fallbackActivities = [
    {
      id: '1',
      name: 'Morning Hill Climb Training',
      type: 'Hiking',
      date: '2 days ago',
      distance: 12.5,
      duration: 14400, // 4 hours
      elevation: 1250,
      heartRate: 142,
      location: 'Rocky Mountain National Park'
    },
    {
      id: '2', 
      name: 'Altitude Endurance Run',
      type: 'Running',
      date: '4 days ago',
      distance: 8.2,
      duration: 3600, // 1 hour
      elevation: 450,
      heartRate: 156,
      location: 'Boulder, CO'
    },
    {
      id: '3',
      name: 'Technical Ice Climbing Session',
      type: 'Ice Climbing',
      date: '1 week ago',
      distance: 2.1,
      duration: 7200, // 2 hours
      elevation: 800,
      location: 'Ouray Ice Park'
    }
  ]

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-spa-charcoal mb-2">Recent Training Activities</h2>
          <p className="text-spa-charcoal/70">Real-time data synchronized from Strava</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(
              'w-2 h-2 rounded-full',
              syncStatus === 'synced' && 'bg-emerald-500',
              syncStatus === 'syncing' && 'bg-alpine-blue animate-pulse',
              syncStatus === 'error' && 'bg-red-500'
            )}></div>
            <span className="text-spa-charcoal/70">
              {syncStatus === 'synced' && 'Synced with Strava'}
              {syncStatus === 'syncing' && 'Syncing...'}
              {syncStatus === 'error' && 'Sync failed'}
            </span>
          </div>
          <button 
            onClick={fetchActivities}
            className="px-4 py-2 text-sm bg-alpine-blue/10 text-alpine-blue rounded-lg hover:bg-alpine-blue/20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 animate-pulse">
              <div className="h-6 w-3/4 bg-spa-stone/20 rounded mb-4"></div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-center p-3 bg-spa-mist/10 rounded-lg">
                    <div className="h-6 w-full bg-spa-stone/20 rounded mb-1"></div>
                    <div className="h-3 w-full bg-spa-stone/20 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-4 w-1/2 bg-spa-stone/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-2">Sync Error</h3>
          <div className="text-spa-charcoal/70 mb-4">{error}</div>
          <button 
            onClick={fetchActivities}
            className="px-6 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors"
          >
            Retry Sync
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(activities.length > 0 ? activities : fallbackActivities).map((activity, index) => {
            const activityData = {
              id: activity.id?.toString() || index.toString(),
              name: activity.name || 'Training Session',
              type: activity.type || 'Workout',
              date: activity.date || activity.start_date ? 
                new Date(activity.date || activity.start_date).toLocaleDateString() : 
                'Recent',
              distance: activity.distance ? 
                (activity.distance / 1000).toFixed(1) : 
                activity.distance?.toString() || '0',
              duration: activity.duration || activity.moving_time || 0,
              elevation: activity.elevation || activity.total_elevation_gain || 0,
              heartRate: activity.heartRate || activity.average_heartrate,
              location: activity.location || 
                (activity.location_city && activity.location_state ? 
                  `${activity.location_city}, ${activity.location_state}` : 
                  'Training Location')
            }
            
            return <ActivityCard key={activityData.id} activity={activityData} />
          })}
        </div>
      )}

      {/* Performance Insights */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-summit-gold/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-summit-gold" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-spa-charcoal">Weekly Performance Insights</h3>
            <p className="text-spa-charcoal/70 text-sm">Data-driven analysis of training progression</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-spa-charcoal mb-1">+15%</div>
            <div className="text-sm text-spa-charcoal/70">Elevation gain vs last week</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-spa-charcoal mb-1">148 bpm</div>
            <div className="text-sm text-spa-charcoal/70">Average heart rate</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-alpine-blue/5 to-alpine-blue/10 rounded-xl">
            <div className="w-12 h-12 bg-alpine-blue rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-light text-spa-charcoal mb-1">6h 45m</div>
            <div className="text-sm text-spa-charcoal/70">Training time this week</div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-spa-mist/20 to-spa-cloud/20 rounded-xl border border-spa-stone/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-summit-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-summit-gold" />
            </div>
            <div>
              <h4 className="font-medium text-spa-charcoal mb-2">AI Training Insight</h4>
              <p className="text-sm text-spa-charcoal/80 leading-relaxed">
                Your elevation gains are impressive this week! Consider adding more recovery time 
                between high-intensity sessions to optimize performance gains and maintain systematic progression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}