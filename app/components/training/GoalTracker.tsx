'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  Check,
  X,
  AlertCircle,
  Activity,
  Mountain,
  Heart,
  Zap,
  Timer
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Goal {
  id: string
  title: string
  description?: string
  target: number
  current: number
  unit: string
  startDate: string
  deadline: string
  category: 'endurance' | 'strength' | 'technical' | 'recovery' | 'nutrition'
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused' | 'overdue'
  milestones?: { value: number; date: string; achieved: boolean }[]
}

interface GoalTrackerProps {
  goals: Goal[]
  onAddGoal: (goal: Omit<Goal, 'id' | 'status' | 'current'>) => void
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void
  onDeleteGoal: (id: string) => void
  className?: string
}

export function GoalTracker({ 
  goals, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal,
  className = ""
}: GoalTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 0,
    unit: '',
    deadline: '',
    category: 'endurance' as Goal['category'],
    priority: 'medium' as Goal['priority']
  })

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'endurance': return Activity
      case 'strength': return Zap
      case 'technical': return Mountain
      case 'recovery': return Heart
      case 'nutrition': return Timer
      default: return Target
    }
  }

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'endurance': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'strength': return 'bg-red-100 text-red-700 border-red-200'
      case 'technical': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'recovery': return 'bg-green-100 text-green-700 border-green-200'
      case 'nutrition': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (goal: Goal) => {
    const progress = (goal.current / goal.target) * 100
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    if (goal.status === 'completed') return 'bg-green-100 text-green-800 border-green-200'
    if (goal.status === 'paused') return 'bg-gray-100 text-gray-800 border-gray-200'
    if (daysLeft < 0) return 'bg-red-100 text-red-800 border-red-200'
    if (progress < 50 && daysLeft < 30) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (progress >= 90) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-blue-500'
      default: return 'border-l-gray-500'
    }
  }

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return

    onAddGoal({
      ...newGoal,
      startDate: new Date().toISOString()
    })

    setNewGoal({
      title: '',
      description: '',
      target: 0,
      unit: '',
      deadline: '',
      category: 'endurance',
      priority: 'medium'
    })
    setShowAddForm(false)
  }

  const updateProgress = (goalId: string, newValue: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    const status = newValue >= goal.target ? 'completed' : 'active'
    onUpdateGoal(goalId, { current: newValue, status })
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Training Goals</h3>
          <p className="text-gray-600 mt-1">Track your progress towards Everest 2027</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </motion.button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmitGoal} className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Create New Goal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Weekly Vertical Gain"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="technical">Technical</option>
                    <option value="recovery">Recovery</option>
                    <option value="nutrition">Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., 3000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., meters, hours, sessions"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline.split('T')[0]}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Additional details about this goal..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Grid */}
      <div className="grid gap-6">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          const CategoryIcon = getCategoryIcon(goal.category)

          return (
            <motion.div
              key={goal.id}
              className={cn(
                "bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 border-l-4",
                getPriorityColor(goal.priority)
              )}
              whileHover={{ y: -2 }}
              layout
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={cn(
                    "p-3 rounded-xl border",
                    getCategoryColor(goal.category)
                  )}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(goal)
                  )}>
                    {goal.status === 'completed' ? 'Completed' :
                     goal.status === 'paused' ? 'Paused' :
                     daysLeft < 0 ? 'Overdue' :
                     progress >= 90 ? 'Almost Done' : 'In Progress'}
                  </div>

                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      goal.status === 'completed' ? 'bg-green-500' :
                      progress >= 75 ? 'bg-blue-500' :
                      progress >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Quick Progress Update */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Update progress:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateProgress(goal.id, Math.max(0, goal.current - (goal.target * 0.1)))}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    disabled={goal.current <= 0}
                  >
                    -10%
                  </button>
                  <input
                    type="number"
                    value={goal.current}
                    onChange={(e) => updateProgress(goal.id, parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    step="0.1"
                  />
                  <button
                    onClick={() => updateProgress(goal.id, Math.min(goal.target, goal.current + (goal.target * 0.1)))}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    disabled={goal.current >= goal.target}
                  >
                    +10%
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {goals.length === 0 && !showAddForm && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-4">Set your first training goal to start tracking your progress</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  )
}