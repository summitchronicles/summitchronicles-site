'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, MapPin, Heart, Clock, Zap } from 'lucide-react'

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
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="mountain-card p-6 elevation-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{activity.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Activity className="w-4 h-4" />
            <span>{activity.type}</span>
            <span>•</span>
            <span>{activity.date}</span>
          </div>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">{activity.distance}km</div>
          <div className="text-xs text-slate-600">Distance</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">{formatDuration(activity.duration)}</div>
          <div className="text-xs text-slate-600">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900">{activity.elevation}m</div>
          <div className="text-xs text-slate-600">Elevation</div>
        </div>
        
        {activity.heartRate && (
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{activity.heartRate}</div>
            <div className="text-xs text-slate-600">Avg HR</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>Peak performance</span>
        </div>
      </div>
    </div>
  )
}

export function StravaActivityFeed() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/strava/activities')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch activities')
      }
      
      setActivities(data.activities || [])
      console.log(`📊 Loaded ${data.activities?.length || 0} activities from ${data.source || 'unknown'}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Recent Activities</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Synced with Strava</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mountain-card p-6 elevation-shadow animate-pulse">
              <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-center">
                    <div className="h-6 w-full bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mountain-card p-8 elevation-shadow text-center">
          <div className="text-red-600 mb-2">⚠️ {error}</div>
          <button 
            onClick={fetchActivities}
            className="btn-summit px-4 py-2"
          >
            Retry
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
      <div className="mountain-card p-8 elevation-shadow">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">This Week's Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">+15%</div>
            <div className="text-sm text-slate-600">Elevation gain vs last week</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">148</div>
            <div className="text-sm text-slate-600">Average heart rate</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">6h 45m</div>
            <div className="text-sm text-slate-600">Training time this week</div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Training Recommendation</h4>
              <p className="text-sm text-slate-600">
                Your elevation gains are impressive this week! Consider adding more recovery time 
                between high-intensity sessions to optimize performance gains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}