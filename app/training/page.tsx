import { CheckCircle, Clock, TrendingUp, Calendar, Target, Zap } from 'lucide-react'
import { TrainingAnalytics } from '../components/TrainingCharts'
import { StravaActivityFeed } from '../components/StravaIntegration'

export default function TrainingPage() {
  const trainingPhases = [
    { name: 'Base Building', progress: 100, status: 'completed' },
    { name: 'Strength Phase', progress: 85, status: 'in-progress' },
    { name: 'Peak Training', progress: 0, status: 'upcoming' },
    { name: 'Expedition Prep', progress: 0, status: 'upcoming' },
  ]

  const weeklyStats = [
    { label: 'Hours Trained', value: '12.5', icon: Clock, change: '+2.3' },
    { label: 'Vertical Gain', value: '2,840m', icon: TrendingUp, change: '+340m' },
    { label: 'Workouts', value: '6', icon: Zap, change: '+1' },
    { label: 'Rest Days', value: '1', icon: Calendar, change: '0' },
  ]

  return (
    <div className="min-h-screen gradient-peak py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Training Dashboard</h1>
        
        {/* Weekly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {weeklyStats.map(({ label, value, icon: Icon, change }) => (
            <div key={label} className="mountain-card p-6 elevation-shadow">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-green-600 font-medium">{change}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
              <div className="text-sm text-slate-600">{label}</div>
            </div>
          ))}
        </div>

        {/* Training Phases */}
        <div className="mountain-card p-8 elevation-shadow mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Training Phases</h2>
          
          <div className="space-y-4">
            {trainingPhases.map(({ name, progress, status }) => (
              <div key={name} className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                  {status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : status === 'in-progress' ? (
                    <Target className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{name}</h3>
                    <span className="text-sm text-slate-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Training Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="mountain-card p-8 elevation-shadow">
            <h3 className="font-semibold text-xl text-slate-900 mb-6">Physical Training</h3>
            <div className="space-y-4">
              {[
                { name: 'Cardiovascular endurance', completed: true },
                { name: 'Strength training', completed: true },
                { name: 'Altitude simulation', completed: false },
                { name: 'Long-distance hiking', completed: true },
              ].map(({ name, completed }) => (
                <div key={name} className="flex items-center space-x-3">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={completed ? 'text-slate-900' : 'text-slate-500'}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mountain-card p-8 elevation-shadow">
            <h3 className="font-semibold text-xl text-slate-900 mb-6">Technical Skills</h3>
            <div className="space-y-4">
              {[
                { name: 'Ice climbing', completed: true },
                { name: 'Crevasse rescue', completed: false },
                { name: 'High-altitude camping', completed: true },
                { name: 'Weather assessment', completed: false },
              ].map(({ name, completed }) => (
                <div key={name} className="flex items-center space-x-3">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={completed ? 'text-slate-900' : 'text-slate-500'}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Training Analytics Section */}
        <div className="mt-12">
          <TrainingAnalytics />
        </div>

        {/* Strava Activity Feed */}
        <div className="mt-12">
          <StravaActivityFeed />
        </div>
      </div>
    </div>
  )
}