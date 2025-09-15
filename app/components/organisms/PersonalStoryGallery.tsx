'use client'

import React, { useState } from 'react'
import { Award, Camera, MapPin, Calendar, Users, Quote, ExternalLink, Star, Trophy, Mountain, Heart, ChevronLeft, ChevronRight, Play, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: 'summit' | 'training' | 'technical' | 'endurance' | 'leadership'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite'
  elevation?: string
  duration?: string
  photos: GalleryImage[]
  metrics?: {
    label: string
    value: string
  }[]
  story: string
  certifications?: string[]
}

interface GalleryImage {
  url: string
  caption: string
  location?: string
  date?: string
  photographer?: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  content: string
  rating: number
  relationship: 'sponsor' | 'teammate' | 'instructor' | 'client'
  photo?: string
}

interface MediaCoverage {
  id: string
  title: string
  outlet: string
  date: string
  type: 'article' | 'interview' | 'podcast' | 'video'
  url: string
  description: string
  thumbnail?: string
}

interface PersonalStoryGalleryProps {
  className?: string
}

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Mount Rainier Summit',
    description: 'First successful summit of a major glaciated peak, completing the standard Disappointment Cleaver route in challenging weather conditions.',
    date: '2024-03-22',
    location: 'Mount Rainier National Park, WA',
    category: 'summit',
    difficulty: 'intermediate',
    elevation: '4,392m',
    duration: '3 days',
    photos: [
      { url: '/api/placeholder/800/600', caption: 'Summit success at sunrise', location: 'Mount Rainier Summit' },
      { url: '/api/placeholder/800/600', caption: 'Technical ice climbing section', location: 'Disappointment Cleaver' },
      { url: '/api/placeholder/800/600', caption: 'Team celebration at summit', location: 'Mount Rainier Summit' }
    ],
    metrics: [
      { label: 'Elevation Gain', value: '2,800m' },
      { label: 'Summit Time', value: '12 hours' },
      { label: 'Team Size', value: '4 climbers' }
    ],
    story: 'Mount Rainier represented a crucial milestone in my mountaineering journey. The combination of technical ice climbing, high-altitude exposure, and glacier travel provided the perfect training ground for Himalayan objectives. Despite challenging weather conditions with 60mph winds and -18°C temperatures, our team successfully navigated the Disappointment Cleaver route, demonstrating both individual competence and team coordination essential for bigger mountains.',
    certifications: ['Wilderness First Aid', 'Glacier Travel Certification']
  },
  {
    id: '2',
    title: 'Island Peak Expedition',
    description: 'Led international team to successful summit of Island Peak (6,189m) in the Everest region, serving as preparation for Mount Everest.',
    date: '2024-06-15',
    location: 'Khumbu Region, Nepal',
    category: 'summit',
    difficulty: 'advanced',
    elevation: '6,189m',
    duration: '21 days',
    photos: [
      { url: '/api/placeholder/800/600', caption: 'Island Peak summit with Everest backdrop', location: 'Island Peak Summit' },
      { url: '/api/placeholder/800/600', caption: 'Technical headwall climbing', location: 'Island Peak Headwall' },
      { url: '/api/placeholder/800/600', caption: 'Team at Everest Base Camp', location: 'Everest Base Camp' }
    ],
    metrics: [
      { label: 'Max Elevation', value: '6,189m' },
      { label: 'Expedition Days', value: '21 days' },
      { label: 'Success Rate', value: '100%' }
    ],
    story: 'Island Peak provided invaluable experience in the Everest region, combining high-altitude climbing with complex logistics and team management. Leading a diverse international team through technical terrain at extreme altitude tested both climbing skills and leadership capabilities. The expedition included comprehensive acclimatization rotations, technical skills workshops, and cultural immersion in Sherpa communities, creating a holistic preparation experience for Mount Everest.',
    certifications: ['High Altitude Mountaineering', 'International Mountain Leader']
  },
  {
    id: '3',
    title: 'Cascade Range Traverse',
    description: 'Completed solo traverse of major Cascade peaks over 30 days, demonstrating endurance and self-sufficiency in wilderness environments.',
    date: '2024-08-10',
    location: 'Cascade Range, WA',
    category: 'endurance',
    difficulty: 'elite',
    duration: '30 days',
    photos: [
      { url: '/api/placeholder/800/600', caption: 'Solo camp below Mount Baker', location: 'Mount Baker' },
      { url: '/api/placeholder/800/600', caption: 'Glacier crossing with full pack', location: 'Cascade Glaciers' },
      { url: '/api/placeholder/800/600', caption: 'Final summit celebration', location: 'Mount Stuart' }
    ],
    metrics: [
      { label: 'Distance', value: '480 km' },
      { label: 'Elevation Gain', value: '45,000m' },
      { label: 'Peaks Summited', value: '12' }
    ],
    story: 'The Cascade Traverse challenged every aspect of mountaineering competence: route finding, weather assessment, risk management, and physical endurance. Covering 480km over 30 days while summiting 12 major peaks, this solo expedition demonstrated the mental toughness and technical skills necessary for independent operation in extreme environments. The experience refined equipment systems, nutrition strategies, and psychological resilience that directly transfer to Everest conditions.',
    certifications: ['Advanced Wilderness Navigation', 'Solo Expedition Planning']
  }
]

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Expedition Leader',
    company: 'Alpine Ascents International',
    content: 'Outstanding mountaineer with exceptional technical skills and natural leadership abilities. Demonstrated remarkable composure and decision-making under pressure during our Island Peak expedition.',
    rating: 5,
    relationship: 'instructor'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Training Partner',
    content: 'Trained with this athlete for 8 months. Their systematic approach to preparation and unwavering commitment to safety protocols make them an ideal expedition teammate.',
    rating: 5,
    relationship: 'teammate'
  },
  {
    id: '3',
    name: 'Jennifer Walsh',
    role: 'Sponsor Representative',
    company: 'Mountain Gear Co.',
    content: 'Professional, dedicated, and authentic. Represents our brand values perfectly through genuine passion for mountaineering and commitment to environmental stewardship.',
    rating: 5,
    relationship: 'sponsor'
  }
]

const SAMPLE_MEDIA: MediaCoverage[] = [
  {
    id: '1',
    title: 'Local Climber Sets Sights on Everest',
    outlet: 'Seattle Times',
    date: '2024-08-15',
    type: 'article',
    url: '#',
    description: 'In-depth profile covering training methodology and expedition preparation for Mount Everest attempt.',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'High Altitude Training Techniques',
    outlet: 'Climbing Magazine',
    date: '2024-07-22',
    type: 'interview',
    url: '#',
    description: 'Technical interview discussing innovative training approaches for high-altitude mountaineering.',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Mental Preparation for Extreme Expeditions',
    outlet: 'Adventure Podcast Network',
    date: '2024-06-30',
    type: 'podcast',
    url: '#',
    description: '45-minute conversation about psychological preparation and risk management in mountaineering.',
    thumbnail: '/api/placeholder/300/200'
  }
]

const CATEGORY_CONFIG = {
  summit: { label: 'Summits', color: 'bg-red-100 text-red-700', icon: Mountain },
  training: { label: 'Training', color: 'bg-blue-100 text-blue-700', icon: Trophy },
  technical: { label: 'Technical', color: 'bg-purple-100 text-purple-700', icon: Award },
  endurance: { label: 'Endurance', color: 'bg-orange-100 text-orange-700', icon: Heart },
  leadership: { label: 'Leadership', color: 'bg-green-100 text-green-700', icon: Users }
}

export const PersonalStoryGallery: React.FC<PersonalStoryGalleryProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<'story' | 'achievements' | 'testimonials' | 'media'>('story')
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredAchievements = filterCategory === 'all' 
    ? SAMPLE_ACHIEVEMENTS 
    : SAMPLE_ACHIEVEMENTS.filter(achievement => achievement.category === filterCategory)

  const nextImage = () => {
    if (selectedAchievement) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedAchievement.photos.length
      )
    }
  }

  const prevImage = () => {
    if (selectedAchievement) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedAchievement.photos.length - 1 : prev - 1
      )
    }
  }

  const sections = [
    { id: 'story', label: 'Personal Story', icon: Quote },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'media', label: 'Media Coverage', icon: Camera }
  ] as const

  return (
    <section className={cn(
      'py-16 bg-gradient-to-br from-white via-spa-mist/10 to-spa-cloud/20',
      className
    )}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-summit-gold" />
            <h2 className="text-4xl font-light text-spa-charcoal">Personal Story & Achievements</h2>
          </div>
          <p className="text-lg text-spa-charcoal/80 max-w-3xl mx-auto leading-relaxed">
            A comprehensive showcase of mountaineering experience, technical competence, and community recognition 
            that demonstrates readiness for Mount Everest expedition.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all',
                activeSection === id
                  ? 'bg-alpine-blue text-white shadow-md'
                  : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Personal Story Section */}
        {activeSection === 'story' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-alpine-blue/20 to-summit-gold/20 flex items-center justify-center">
                    <Mountain className="w-16 h-16 text-alpine-blue" />
                  </div>
                  <h3 className="text-2xl font-light text-spa-charcoal mb-4">
                    The Journey to Mount Everest
                  </h3>
                </div>
                
                <div className="space-y-6 text-spa-charcoal/80 leading-relaxed">
                  <p>
                    My mountaineering journey began not with grand aspirations of Everest, but with a simple desire to explore the mountains surrounding Seattle. What started as weekend hiking quickly evolved into a deeper passion for high-altitude environments and technical climbing challenges.
                  </p>
                  
                  <p>
                    The transformation from casual hiker to serious mountaineer required systematic skill development, physical conditioning, and mental preparation. Each peak taught valuable lessons: Mount Baker introduced glacier travel, Mount Rainier demonstrated the importance of weather assessment, and the Cascade Range traverse proved the value of self-sufficiency and endurance.
                  </p>
                  
                  <blockquote className="border-l-4 border-alpine-blue pl-6 italic text-xl text-alpine-blue my-8">
                    "Mountains have a way of teaching humility, patience, and respect for natural forces. Each summit is less about conquest and more about understanding."
                  </blockquote>
                  
                  <p>
                    International experience in Nepal's Khumbu region provided crucial exposure to Himalayan conditions, high-altitude physiology, and expedition logistics. Leading diverse teams through technical terrain at extreme altitude developed leadership skills essential for major expeditions.
                  </p>
                  
                  <p>
                    The Mount Everest expedition represents the culmination of years of systematic preparation, not just physical and technical, but also mental and spiritual. It's an opportunity to test every aspect of mountaineering competence while contributing to scientific research and inspiring others to pursue their own extraordinary goals.
                  </p>
                  
                  <div className="bg-gradient-to-br from-spa-mist/20 to-spa-cloud/20 rounded-xl p-6 mt-8">
                    <h4 className="text-lg font-medium text-spa-charcoal mb-4">Core Values & Motivation</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-spa-charcoal mb-2">Safety First</h5>
                        <p className="text-sm text-spa-charcoal/70">
                          Every decision prioritizes team safety and responsible risk management in mountain environments.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-spa-charcoal mb-2">Environmental Stewardship</h5>
                        <p className="text-sm text-spa-charcoal/70">
                          Committed to Leave No Trace principles and supporting conservation efforts in mountain regions.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-spa-charcoal mb-2">Community Impact</h5>
                        <p className="text-sm text-spa-charcoal/70">
                          Using expeditions as platforms for education, inspiration, and supporting local communities.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-spa-charcoal mb-2">Continuous Learning</h5>
                        <p className="text-sm text-spa-charcoal/70">
                          Every expedition provides opportunities for skill development and sharing knowledge with others.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeSection === 'achievements' && (
          <div>
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setFilterCategory('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filterCategory === 'all'
                    ? 'bg-alpine-blue text-white'
                    : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
                )}
              >
                All Categories
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                    filterCategory === category
                      ? 'bg-alpine-blue text-white'
                      : 'bg-white/80 text-spa-charcoal/80 hover:bg-white border border-spa-stone/20'
                  )}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const categoryConfig = CATEGORY_CONFIG[achievement.category]
                
                return (
                  <div 
                    key={achievement.id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl border border-spa-stone/10 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    {/* Achievement Image */}
                    <div className="aspect-video bg-gradient-to-br from-spa-mist to-spa-cloud relative overflow-hidden">
                      <img 
                        src={achievement.photos[0]?.url} 
                        alt={achievement.photos[0]?.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          categoryConfig.color
                        )}>
                          {categoryConfig.label}
                        </div>
                      </div>
                    </div>
                    
                    {/* Achievement Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-medium text-spa-charcoal">{achievement.title}</h3>
                        <div className="text-sm text-spa-charcoal/60">
                          {new Date(achievement.date).getFullYear()}
                        </div>
                      </div>
                      
                      <p className="text-spa-charcoal/70 text-sm mb-4 line-clamp-3">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-spa-charcoal/60 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {achievement.location}
                        </div>
                        {achievement.elevation && (
                          <div className="flex items-center gap-1">
                            <Mountain className="w-3 h-3" />
                            {achievement.elevation}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-alpine-blue">
                          View Details →
                        </div>
                        <div className="flex gap-1">
                          {achievement.photos.slice(0, 3).map((_, idx) => (
                            <div key={idx} className="w-2 h-2 bg-spa-stone/30 rounded-full" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {SAMPLE_TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-summit-gold fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-spa-charcoal/80 mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="border-t border-spa-stone/10 pt-4">
                    <div className="font-medium text-spa-charcoal">{testimonial.name}</div>
                    <div className="text-sm text-spa-charcoal/60">
                      {testimonial.role}
                      {testimonial.company && ` • ${testimonial.company}`}
                    </div>
                    <div className="text-xs text-spa-charcoal/50 mt-1 capitalize">
                      {testimonial.relationship}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Coverage Section */}
        {activeSection === 'media' && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {SAMPLE_MEDIA.map((media) => (
                <div key={media.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-16 bg-spa-mist/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {media.type === 'video' ? <Play className="w-6 h-6 text-alpine-blue" /> :
                       media.type === 'podcast' ? <Camera className="w-6 h-6 text-alpine-blue" /> :
                       <ExternalLink className="w-6 h-6 text-alpine-blue" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-spa-charcoal">{media.title}</h3>
                        <div className="text-sm text-spa-charcoal/60">
                          {new Date(media.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-alpine-blue font-medium mb-2">
                        {media.outlet} • {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                      </div>
                      
                      <p className="text-spa-charcoal/70 mb-4">
                        {media.description}
                      </p>
                      
                      <a 
                        href={media.url}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievement Detail Modal */}
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Image Gallery */}
              <div className="relative aspect-video bg-gradient-to-br from-spa-mist to-spa-cloud">
                <img 
                  src={selectedAchievement.photos[currentImageIndex]?.url}
                  alt={selectedAchievement.photos[currentImageIndex]?.caption}
                  className="w-full h-full object-cover"
                />
                
                {selectedAchievement.photos.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  ×
                </button>
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="font-medium text-spa-charcoal text-sm">
                    {selectedAchievement.photos[currentImageIndex]?.caption}
                  </div>
                  <div className="text-xs text-spa-charcoal/60">
                    {currentImageIndex + 1} of {selectedAchievement.photos.length}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-light text-spa-charcoal mb-2">
                      {selectedAchievement.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-spa-charcoal/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedAchievement.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedAchievement.location}
                      </div>
                      {selectedAchievement.elevation && (
                        <div className="flex items-center gap-1">
                          <Mountain className="w-4 h-4" />
                          {selectedAchievement.elevation}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    CATEGORY_CONFIG[selectedAchievement.category].color
                  )}>
                    {CATEGORY_CONFIG[selectedAchievement.category].label}
                  </div>
                </div>
                
                <p className="text-spa-charcoal/80 leading-relaxed mb-6">
                  {selectedAchievement.story}
                </p>
                
                {selectedAchievement.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {selectedAchievement.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center p-4 bg-spa-mist/10 rounded-lg">
                        <div className="text-2xl font-light text-spa-charcoal">{metric.value}</div>
                        <div className="text-sm text-spa-charcoal/60">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedAchievement.certifications && (
                  <div className="mb-6">
                    <h4 className="font-medium text-spa-charcoal mb-3">Certifications Earned</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAchievement.certifications.map((cert, idx) => (
                        <div key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 pt-6 border-t border-spa-stone/10">
                  <button className="flex items-center gap-2 px-6 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="px-6 py-2 border border-spa-stone/20 text-spa-charcoal rounded-lg hover:bg-spa-mist/10 transition-colors">
                    Share Achievement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}