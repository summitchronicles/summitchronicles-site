'use client'

import { useState } from 'react'
import { MessageCircle, Heart, Share, Award, Calendar, Mountain, Clock, MoreHorizontal } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { cn } from '@/lib/utils'

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar?: string
    badge?: 'supporter' | 'long-term' | 'challenger' | 'mentor'
    joinedDate: string
  }
  content: string
  timestamp: string
  type: 'achievement' | 'question' | 'encouragement' | 'milestone' | 'gear_review'
  likes: number
  comments: number
  isLiked?: boolean
  tags?: string[]
  achievement?: {
    title: string
    description: string
    image?: string
  }
}

export function CommunityFeed() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  // Mock community posts data
  const posts: CommunityPost[] = [
    {
      id: '1',
      author: {
        name: 'Sarah M.',
        badge: 'supporter',
        joinedDate: '6 months ago'
      },
      content: 'Just completed my first 20-mile training hike with a 35lb pack! Sunith\'s systematic approach to building endurance has been incredible. The weekly progression really works. Thank you for the inspiration! 🏔️',
      timestamp: '2 hours ago',
      type: 'achievement',
      likes: 23,
      comments: 8,
      tags: ['training', 'endurance', 'milestone'],
      achievement: {
        title: '20-Mile Training Hike',
        description: 'Completed with 35lb pack following systematic training approach'
      }
    },
    {
      id: '2',
      author: {
        name: 'Mike T.',
        badge: 'long-term',
        joinedDate: '1 year ago'
      },
      content: 'Question for the community: What\'s your favorite recovery method after intense training days? I\'ve been following the training methodology but looking for additional recovery techniques. Any recommendations?',
      timestamp: '5 hours ago',
      type: 'question',
      likes: 12,
      comments: 15,
      tags: ['recovery', 'training', 'advice']
    },
    {
      id: '3',
      author: {
        name: 'Elena R.',
        badge: 'challenger',
        joinedDate: '3 months ago'
      },
      content: 'Sending massive encouragement to everyone participating in this week\'s community challenge! Remember, every step counts toward your bigger goals. We\'re all climbing our own mountains together! 💪',
      timestamp: '1 day ago',
      type: 'encouragement',
      likes: 45,
      comments: 12,
      tags: ['encouragement', 'community', 'challenge']
    },
    {
      id: '4',
      author: {
        name: 'David C.',
        badge: 'mentor',
        joinedDate: '2 years ago'
      },
      content: 'Gear Review: Just tested the new altitude training mask mentioned in last week\'s newsletter. Solid build quality and really helps simulate high-altitude conditions. Worth the investment for serious expedition prep.',
      timestamp: '2 days ago',
      type: 'gear_review',
      likes: 18,
      comments: 6,
      tags: ['gear', 'altitude', 'review']
    }
  ]

  const filters = [
    { id: 'all', label: 'All Posts', count: posts.length },
    { id: 'achievement', label: 'Achievements', count: posts.filter(p => p.type === 'achievement').length },
    { id: 'question', label: 'Questions', count: posts.filter(p => p.type === 'question').length },
    { id: 'encouragement', label: 'Encouragement', count: posts.filter(p => p.type === 'encouragement').length }
  ]

  const filteredPosts = selectedFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === selectedFilter)

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'supporter': return 'bg-blue-100 text-blue-700'
      case 'long-term': return 'bg-purple-100 text-purple-700'
      case 'challenger': return 'bg-green-100 text-green-700'
      case 'mentor': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Award
      case 'question': return MessageCircle
      case 'encouragement': return Heart
      case 'milestone': return Mountain
      case 'gear_review': return Mountain
      default: return MessageCircle
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return timestamp // In real app, would format relative time
  }

  return (
    <section className="py-16 bg-gradient-to-br from-spa-cloud/30 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6 text-alpine-blue" />
            <h2 className="text-3xl font-light text-spa-charcoal">Community Feed</h2>
          </div>
          <p className="text-spa-charcoal/70">
            Latest updates, achievements, and discussions from the Summit Chronicles community
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filters.map(({ id, label, count }) => (
            <Button
              key={id}
              variant={selectedFilter === id ? 'summit' : 'ghost'}
              size="sm"
              onClick={() => setSelectedFilter(id)}
              className="flex items-center gap-2"
            >
              {label}
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const PostIcon = getPostIcon(post.type)
            const isLiked = likedPosts.has(post.id)
            
            return (
              <article
                key={post.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm hover:shadow-md transition-all"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-alpine-blue/10 rounded-full flex items-center justify-center">
                      <PostIcon className="w-5 h-5 text-alpine-blue" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-spa-charcoal">{post.author.name}</span>
                        {post.author.badge && (
                          <Badge className={cn('text-xs', getBadgeColor(post.author.badge))}>
                            {post.author.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-spa-charcoal/60">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(post.timestamp)}
                        </div>
                        <span>•</span>
                        <span>Joined {post.author.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Achievement Badge */}
                {post.achievement && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-800">{post.achievement.title}</span>
                    </div>
                    <p className="text-emerald-700 text-sm">{post.achievement.description}</p>
                  </div>
                )}

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-spa-charcoal leading-relaxed">{post.content}</p>
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'flex items-center gap-2 p-2',
                        isLiked && 'text-red-600'
                      )}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                      <span className="text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
                      <Share className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </Button>
                  </div>

                  <div className="text-xs text-spa-charcoal/50">
                    {post.type}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="secondary" size="sm">
            Load More Posts
          </Button>
        </div>
      </div>
    </section>
  )
}