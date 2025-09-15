import { Suspense, lazy } from 'react'
import { Mountain, Compass, BookOpen } from 'lucide-react'
import { DefaultLayout } from '../components/templates/DefaultLayout'

// Lazy load heavy components
const ExpeditionTimeline = lazy(() => 
  import('../components/organisms/ExpeditionTimeline').then(module => ({
    default: module.ExpeditionTimeline
  }))
)

const PersonalStoryGallery = lazy(() => 
  import('../components/organisms/PersonalStoryGallery').then(module => ({
    default: module.PersonalStoryGallery
  }))
)

export default function JourneyPage() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-spa-mist via-white to-spa-cloud/30 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Compass className="w-10 h-10 text-alpine-blue" />
              <h1 className="text-5xl font-light text-spa-charcoal">The Journey</h1>
            </div>
            <p className="text-xl text-spa-charcoal/80 max-w-4xl mx-auto leading-relaxed">
              Follow the complete expedition story from initial training through summit success. 
              This is more than climbing—it's a systematic approach to achieving extraordinary goals 
              through preparation, perseverance, and authentic storytelling.
            </p>
          </div>

          {/* Journey Navigation */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm text-center">
              <div className="w-12 h-12 bg-alpine-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-alpine-blue" />
              </div>
              <h3 className="text-lg font-medium text-spa-charcoal mb-2">Personal Story</h3>
              <p className="text-spa-charcoal/70 text-sm">
                The motivation, background, and authentic passion that drives this expedition
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm text-center">
              <div className="w-12 h-12 bg-summit-gold/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Compass className="w-6 h-6 text-summit-gold" />
              </div>
              <h3 className="text-lg font-medium text-spa-charcoal mb-2">Expedition Timeline</h3>
              <p className="text-spa-charcoal/70 text-sm">
                Real-time progress tracking from preparation through summit celebration
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-spa-stone/10 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-spa-charcoal mb-2">Achievement Gallery</h3>
              <p className="text-spa-charcoal/70 text-sm">
                Comprehensive showcase of mountaineering experience and technical competence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expedition Timeline */}
      <Suspense fallback={
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-48 mx-auto"></div>
              <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex gap-6">
                    <div className="w-4 h-4 bg-spa-stone/20 rounded-full flex-shrink-0 mt-2"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-spa-stone/20 rounded w-3/4"></div>
                      <div className="h-3 bg-spa-stone/20 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <ExpeditionTimeline />
      </Suspense>

      {/* Personal Story & Achievement Gallery */}
      <Suspense fallback={
        <div className="py-16 bg-spa-cloud/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-spa-stone/20 rounded w-64 mx-auto"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-spa-stone/20 rounded-xl"></div>
                    <div className="h-4 bg-spa-stone/20 rounded"></div>
                    <div className="h-3 bg-spa-stone/20 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <PersonalStoryGallery />
      </Suspense>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-alpine-blue/5 to-summit-gold/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 shadow-sm">
            <h2 className="text-3xl font-light text-spa-charcoal mb-4">
              Join the Journey
            </h2>
            <p className="text-lg text-spa-charcoal/80 mb-8 max-w-2xl mx-auto">
              This expedition is more than a personal challenge—it's an opportunity to inspire others, 
              support meaningful causes, and demonstrate what's possible through systematic preparation 
              and unwavering commitment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90 transition-colors font-medium">
                Support the Expedition
              </button>
              <button className="px-8 py-4 border-2 border-spa-stone/20 text-spa-charcoal rounded-lg hover:bg-spa-mist/10 transition-colors font-medium">
                Follow Updates
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-spa-stone/10">
              <div className="text-center">
                <div className="text-2xl font-light text-spa-charcoal">234</div>
                <div className="text-sm text-spa-charcoal/60">Community Supporters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-spa-charcoal">$12,400</div>
                <div className="text-sm text-spa-charcoal/60">Funding Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-spa-charcoal">75%</div>
                <div className="text-sm text-spa-charcoal/60">Journey Complete</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}