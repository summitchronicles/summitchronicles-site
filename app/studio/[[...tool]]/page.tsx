/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import Sanity Studio to avoid build issues
const NextStudio = dynamic(
  () => import('next-sanity/studio').then(mod => ({ default: mod.NextStudio })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    )
  }
)

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    }>
      <NextStudio 
        config={(() => {
          const config = require('../../../sanity.config')
          return config.default || config
        })()} 
      />
    </Suspense>
  )
}