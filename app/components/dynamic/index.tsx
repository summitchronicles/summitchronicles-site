import dynamic from 'next/dynamic'
import React from 'react'

// Loading component for dynamic imports
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alpine-blue"></div>
  </div>
)

// Error component for failed dynamic imports
const ErrorComponent: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-600 mb-4">Failed to load component</div>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-alpine-blue text-white rounded-lg hover:bg-alpine-blue/90"
    >
      Retry
    </button>
  </div>
)

// Dynamic imports for heavy components with code splitting

// AI Components (large bundle due to LLM integration)
export const DynamicSmartSearch = dynamic(
  () => import('../ai/SmartSearch'),
  {
    loading: LoadingSpinner,
    ssr: false // Client-side only for AI features
  }
)

export const DynamicTrainingInsights = dynamic(
  () => import('../ai/TrainingInsights'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Analytics Components (heavy due to chart libraries)
export const DynamicAdvancedAnalytics = dynamic(
  () => import('../analytics/AdvancedAnalytics'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

export const DynamicTrainingCharts = dynamic(
  () => import('../TrainingCharts'),
  {
    loading: LoadingSpinner,
    ssr: true // Keep SSR for SEO
  }
)

// Real-time Components (heavy due to data fetching)
export const DynamicSyncManager = dynamic(
  () => import('../realtime/SyncManager'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Personalization Components
export const DynamicPersonalizedDashboard = dynamic(
  () => import('../personalization/PersonalizedDashboard'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// CMS Components (large due to Sanity integration)
export const DynamicBlogCMS = dynamic(
  () => import('../cms/BlogCMS'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Sanity Studio (very large bundle)
export const DynamicSanityStudio = dynamic(
  () => import('next-sanity/studio'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-4 text-spa-charcoal/60">Loading Sanity Studio...</div>
        </div>
      </div>
    ),
    ssr: false
  }
)

// Chart/Visualization Components
export const DynamicChart = dynamic(
  () => import('../charts/Chart'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Interactive Map (if needed in future)
export const DynamicInteractiveMap = dynamic(
  () => import('../maps/InteractiveMap'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Heavy Form Components
export const DynamicAdvancedForm = dynamic(
  () => import('../forms/AdvancedForm'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Media Components (video players, galleries)
export const DynamicVideoPlayer = dynamic(
  () => import('../media/VideoPlayer'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

export const DynamicImageGallery = dynamic(
  () => import('../media/ImageGallery'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// 3D/WebGL Components (if added in future)
export const Dynamic3DModel = dynamic(
  () => import('../3d/Model3D'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Advanced Editor Components
export const DynamicRichTextEditor = dynamic(
  () => import('../editor/RichTextEditor'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Calendar/Scheduling Components
export const DynamicCalendar = dynamic(
  () => import('../calendar/Calendar'),
  {
    loading: LoadingSpinner,
    ssr: false
  }
)

// Export all dynamic components with performance monitoring
export const DynamicComponents = {
  SmartSearch: DynamicSmartSearch,
  TrainingInsights: DynamicTrainingInsights,
  AdvancedAnalytics: DynamicAdvancedAnalytics,
  TrainingCharts: DynamicTrainingCharts,
  SyncManager: DynamicSyncManager,
  PersonalizedDashboard: DynamicPersonalizedDashboard,
  BlogCMS: DynamicBlogCMS,
  SanityStudio: DynamicSanityStudio,
  Chart: DynamicChart,
  InteractiveMap: DynamicInteractiveMap,
  AdvancedForm: DynamicAdvancedForm,
  VideoPlayer: DynamicVideoPlayer,
  ImageGallery: DynamicImageGallery,
  Model3D: Dynamic3DModel,
  RichTextEditor: DynamicRichTextEditor,
  Calendar: DynamicCalendar
}

// Helper to create optimized dynamic imports
export const createOptimizedDynamic = <T extends any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: {
    ssr?: boolean
    loading?: React.ComponentType
    name?: string
  } = {}
) => {
  return dynamic(importFn, {
    ssr: options.ssr ?? false,
    loading: options.loading ?? LoadingSpinner,
    // Add performance tracking in development
    ...(process.env.NODE_ENV === 'development' && options.name && {
      onLoad: () => console.log(`Dynamic component loaded: ${options.name}`)
    })
  })
}

// Preload critical dynamic components
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload components that might be needed soon
    DynamicTrainingCharts.preload?.()
    DynamicSmartSearch.preload?.()
  }
}