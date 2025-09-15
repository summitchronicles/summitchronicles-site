'use client'

import { useState } from 'react'
import { Send, HelpCircle, MessageCircle, Tag, Loader2 } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Badge } from '../atoms/Badge'
import { cn } from '@/lib/utils'

interface QuestionCategory {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export function QuestionSubmission() {
  const [question, setQuestion] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const categories: QuestionCategory[] = [
    {
      id: 'training',
      label: 'Training & Preparation',
      description: 'Training methodologies, workout plans, and progression questions',
      icon: HelpCircle,
      color: 'blue'
    },
    {
      id: 'gear',
      label: 'Gear & Equipment',
      description: 'Equipment recommendations, gear reviews, and purchasing advice',
      icon: Tag,
      color: 'green'
    },
    {
      id: 'expedition',
      label: 'Expedition Planning',
      description: 'Route planning, logistics, permits, and expedition strategies',
      icon: MessageCircle,
      color: 'purple'
    },
    {
      id: 'mental',
      label: 'Mental Preparation',
      description: 'Mindset, motivation, fear management, and psychological aspects',
      icon: HelpCircle,
      color: 'amber'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !selectedCategory) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitted(true)
      setQuestion('')
      setSelectedCategory('')
      setEmail('')
    } catch (error) {
      console.error('Failed to submit question:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      amber: 'bg-amber-100 text-amber-700 border-amber-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-emerald-600" />
            </div>
            
            <h3 className="text-xl font-medium text-spa-charcoal mb-3">
              Question Submitted Successfully!
            </h3>
            
            <p className="text-spa-charcoal/70 mb-6 leading-relaxed">
              Thank you for your question! It will be reviewed and potentially featured in upcoming 
              newsletter Q&A sections or community discussions. You'll be notified if your question 
              is selected for a detailed response.
            </p>
            
            <Button 
              variant="secondary" 
              onClick={() => setIsSubmitted(false)}
              className="mr-3"
            >
              Ask Another Question
            </Button>
            
            <Button variant="ghost" asChild>
              <a href="/community">View Community</a>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-alpine-blue" />
            <h2 className="text-3xl font-light text-spa-charcoal">Ask a Question</h2>
          </div>
          <p className="text-spa-charcoal/70 max-w-2xl mx-auto">
            Have questions about training, gear, expedition planning, or mental preparation? 
            Submit your questions for potential feature in newsletters or community Q&A sessions.
          </p>
        </div>

        {/* Question Form */}
        <div className="bg-gradient-to-br from-spa-mist/20 to-white rounded-2xl p-8 border border-spa-stone/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-spa-charcoal mb-4">
                Question Category
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {categories.map(({ id, label, description, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCategory(id)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm',
                      selectedCategory === id
                        ? getCategoryColor(color)
                        : 'bg-white border-spa-stone/20 hover:border-spa-stone/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        selectedCategory === id
                          ? 'bg-white/70'
                          : 'bg-spa-stone/10'
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{label}</div>
                        <div className={cn(
                          'text-xs leading-relaxed',
                          selectedCategory === id ? 'opacity-80' : 'text-spa-charcoal/60'
                        )}>
                          {description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-spa-charcoal mb-3">
                Your Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Share your question about training, gear, expedition planning, or any aspect of mountaineering preparation..."
                rows={4}
                className="w-full px-4 py-3 border border-spa-stone/30 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-alpine-blue/20 focus:border-alpine-blue/30 resize-none"
                required
              />
              <div className="mt-2 text-xs text-spa-charcoal/60">
                Be specific and detailed to help provide the most useful response
              </div>
            </div>

            {/* Optional Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-spa-charcoal mb-3">
                Email (Optional)
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white/50 backdrop-blur-sm"
              />
              <div className="mt-2 text-xs text-spa-charcoal/60">
                Provide your email to be notified if your question is featured
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">Questions reviewed weekly</Badge>
                <Badge variant="secondary" className="text-xs">Featured in newsletters</Badge>
              </div>
              
              <Button
                type="submit"
                disabled={!question.trim() || !selectedCategory || isSubmitting}
                variant="summit"
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Question'}
              </Button>
            </div>
          </form>
        </div>

        {/* FAQ Preview */}
        <div className="mt-12">
          <h3 className="text-xl font-medium text-spa-charcoal mb-6 text-center">
            Recently Featured Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 rounded-xl p-6 border border-spa-stone/10">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-blue-100 text-blue-700 text-xs">Training</Badge>
                <span className="text-xs text-spa-charcoal/60">Featured in Week 4 Newsletter</span>
              </div>
              <h4 className="font-medium text-spa-charcoal mb-2">
                "How do you balance cardio and strength training during base building?"
              </h4>
              <p className="text-sm text-spa-charcoal/70">
                Sarah M. asked about systematic progression through training phases...
              </p>
            </div>
            
            <div className="bg-white/50 rounded-xl p-6 border border-spa-stone/10">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-green-100 text-green-700 text-xs">Gear</Badge>
                <span className="text-xs text-spa-charcoal/60">Featured in Week 3 Newsletter</span>
              </div>
              <h4 className="font-medium text-spa-charcoal mb-2">
                "What's the most important gear investment for high-altitude training?"
              </h4>
              <p className="text-sm text-spa-charcoal/70">
                David C. inquired about essential equipment for expedition preparation...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}