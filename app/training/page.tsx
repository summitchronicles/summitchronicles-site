import { CheckCircle, Clock, TrendingUp, Calendar, Target, Zap, Mountain, Award, BarChart3 } from 'lucide-react'
import { TrainingAnalytics } from '../components/TrainingCharts'
import { StravaActivityFeed } from '../components/StravaIntegration'
import { TrainingMethodologyHub } from '../components/organisms/TrainingMethodologyHub'
import { TrainingProgressionAnalytics } from '../components/organisms/TrainingProgressionAnalytics'
import { DefaultLayout } from '../components/templates/DefaultLayout'
import { cn } from '@/lib/utils'

export default function TrainingPage() {
  const trainingPhases = [
    { name: 'Base Building', progress: 100, status: 'completed' },
    { name: 'Strength Phase', progress: 85, status: 'in-progress' },
    { name: 'Peak Training', progress: 0, status: 'upcoming' },
    { name: 'Expedition Prep', progress: 0, status: 'upcoming' },
  ]

  const weeklyStats = [
    { label: 'Hours Trained', value: '12.5', icon: Clock, change: '+2.3', trend: 'up' },
    { label: 'Vertical Gain', value: '2,840m', icon: TrendingUp, change: '+340m', trend: 'up' },
    { label: 'Workouts', value: '6', icon: Zap, change: '+1', trend: 'up' },
    { label: 'Rest Days', value: '1', icon: Calendar, change: '0', trend: 'stable' },
  ]

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mountain className="w-8 h-8 text-alpine-blue" />
              <h1 className="text-4xl font-light text-spa-charcoal">Training Hub</h1>
            </div>
            <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              Systematic preparation for Mount Everest through evidence-based training methodologies, 
              progressive overload, and comprehensive performance tracking.
            </p>
          </div>
        
          {/* Weekly Performance Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyStats.map(({ label, value, icon: Icon, change, trend }) => (
              <div key={label} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-alpine-blue/10 rounded-lg">
                    <Icon className="w-5 h-5 text-alpine-blue" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    trend === 'up' && 'bg-emerald-100 text-emerald-700',
                    trend === 'down' && 'bg-red-100 text-red-700',
                    trend === 'stable' && 'bg-slate-100 text-slate-600'
                  )}>
                    {change}
                  </div>
                </div>
                <div className="text-2xl font-light text-spa-charcoal mb-1">{value}</div>
                <div className="text-sm text-spa-charcoal/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Progress Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-alpine-blue" />
              <h2 className="text-3xl font-light text-spa-charcoal">Training Progress</h2>
            </div>
            <p className="text-spa-charcoal/70">
              Four-phase systematic approach to Mount Everest preparation
            </p>
          </div>

          <div className="bg-gradient-to-br from-spa-mist/20 to-white rounded-2xl p-8 border border-spa-stone/10">
            <div className="space-y-6">
              {trainingPhases.map(({ name, progress, status }, index) => (
                <div key={name} className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-spa-stone/10">
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : status === 'in-progress' ? (
                      <Target className="w-6 h-6 text-alpine-blue" />
                    ) : (
                      <Clock className="w-6 h-6 text-spa-charcoal/40" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-spa-charcoal">{name}</h3>
                        <div className="text-sm text-spa-charcoal/60">Phase {index + 1} of 4</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-light text-spa-charcoal">{progress}%</div>
                        <div className={cn(
                          'text-xs font-medium',
                          status === 'completed' && 'text-emerald-600',
                          status === 'in-progress' && 'text-alpine-blue',
                          status === 'upcoming' && 'text-spa-charcoal/40'
                        )}>
                          {status === 'completed' && 'Complete'}
                          {status === 'in-progress' && 'In Progress'}
                          {status === 'upcoming' && 'Upcoming'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-spa-stone/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all duration-700 ease-out',
                          status === 'completed' && 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                          status === 'in-progress' && 'bg-gradient-to-r from-alpine-blue to-alpine-blue/80',
                          status === 'upcoming' && 'bg-spa-stone/40'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Training Categories Overview */}
      <section className="py-16 bg-gradient-to-br from-spa-cloud/30 via-white to-spa-mist/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6 text-alpine-blue" />
              <h2 className="text-3xl font-light text-spa-charcoal">Training Categories</h2>
            </div>
            <p className="text-spa-charcoal/70">
              Comprehensive skill development across all mountaineering domains
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Physical Training</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Cardiovascular endurance', completed: true },
                  { name: 'Strength training', completed: true },
                  { name: 'Altitude simulation', completed: false },
                  { name: 'Long-distance hiking', completed: true },
                ].map(({ name, completed }) => (
                  <div key={name} className="flex items-center gap-3 group">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'transition-colors',
                      completed ? 'text-spa-charcoal' : 'text-spa-charcoal/60'
                    )}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-spa-charcoal">Technical Skills</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Ice climbing', completed: true },
                  { name: 'Crevasse rescue', completed: false },
                  { name: 'High-altitude camping', completed: true },
                  { name: 'Weather assessment', completed: false },
                ].map(({ name, completed }) => (
                  <div key={name} className="flex items-center gap-3 group">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-spa-stone/30 flex-shrink-0" />
                    )}
                    <span className={cn(
                      'transition-colors',
                      completed ? 'text-spa-charcoal' : 'text-spa-charcoal/60'
                    )}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Training Methodology Hub */}
      <TrainingMethodologyHub />
      
      {/* Training Analytics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <TrainingAnalytics />
        </div>
      </section>

      {/* Training Progression Analytics */}
      <TrainingProgressionAnalytics />

      {/* Strava Activity Feed */}
      <section className="py-16 bg-gradient-to-br from-spa-mist/20 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <StravaActivityFeed />
        </div>
      </section>
    </DefaultLayout>
  )
}