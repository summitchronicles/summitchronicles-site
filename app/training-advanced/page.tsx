'use client'

import { Header } from '../components/organisms/Header'
import { Footer } from '../components/organisms/Footer'
import { AdvancedTrainingDashboard } from '../components/training/AdvancedTrainingDashboard'

export default function AdvancedTrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
      >
        Skip to main content
      </a>
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AdvancedTrainingDashboard />
        </div>
      </main>

      <Footer />
    </div>
  )
}