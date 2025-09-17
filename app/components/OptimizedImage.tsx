'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image, { ImageProps } from 'next/image'
import { getOptimizedImageProps, generateResponsiveSizes, IMAGE_CONFIGS, useProgressiveImage } from '../lib/utils/image-optimization'
import { useIntersectionObserver } from '../lib/utils/performance'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  preset?: keyof typeof IMAGE_CONFIGS
  progressive?: boolean
  placeholderSrc?: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: (error: Error) => void
  lazyLoad?: boolean
  preload?: boolean
  responsive?: boolean
  aspectRatio?: number
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  preset = 'thumbnail',
  progressive = true,
  placeholderSrc,
  fallbackSrc,
  onLoad,
  onError,
  lazyLoad = true,
  preload = false,
  responsive = true,
  aspectRatio,
  className = '',
  style = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  
  // Intersection observer for lazy loading
  const isInView = useIntersectionObserver(imageRef, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  // Progressive loading
  const { src: progressiveSrc, loading: progressiveLoading, error: progressiveError } = useProgressiveImage(
    src,
    placeholderSrc
  )

  // Determine which src to use
  const currentSrc = React.useMemo(() => {
    if (imageError && fallbackSrc) {
      return fallbackSrc
    }
    if (progressive) {
      return progressiveSrc || placeholderSrc || src
    }
    return src
  }, [imageError, fallbackSrc, progressive, progressiveSrc, placeholderSrc, src])

  // Get optimized props
  const optimizedProps = React.useMemo(() => {
    const baseProps = getOptimizedImageProps(
      currentSrc,
      alt,
      props.width as number,
      props.height as number,
      preset
    )

    // Override with custom responsive sizes if needed
    if (responsive && aspectRatio && props.width && props.height) {
      baseProps.sizes = generateResponsiveSizes({
        mobile: '100vw',
        tablet: '50vw',
        laptop: '33vw',
        desktop: '25vw'
      })
    }

    return baseProps
  }, [currentSrc, alt, props.width, props.height, preset, responsive, aspectRatio])

  // Handle image load
  const handleImageLoad = React.useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error
  const handleImageError = React.useCallback(() => {
    setImageError(true)
    onError?.(new Error(`Failed to load image: ${src}`))
  }, [src, onError])

  // Preload image if requested
  useEffect(() => {
    if (preload && src) {
      const img = new Image()
      img.src = src
    }
  }, [preload, src])

  // Don't render if lazy loading and not in view
  const shouldRender = !lazyLoad || isInView || preload

  if (!shouldRender) {
    return (
      <div
        ref={imageRef}
        className={`bg-spa-cloud/20 animate-pulse ${className}`}
        style={{
          width: props.width,
          height: props.height,
          aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
          ...style
        }}
      />
    )
  }

  const imageClassName = React.useMemo(() => {
    const baseClasses = [
      'transition-opacity duration-300',
      progressive && !isLoaded ? 'opacity-70' : 'opacity-100',
      className
    ].filter(Boolean)

    return baseClasses.join(' ')
  }, [progressive, isLoaded, className])

  const imageStyle = React.useMemo(() => ({
    aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
    ...style
  }), [aspectRatio, style])

  return (
    <div ref={imageRef} className="relative overflow-hidden">
      {/* Main image */}
      <Image
        {...optimizedProps}
        {...props}
        src={currentSrc}
        alt={alt}
        className={imageClassName}
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Loading state for progressive images */}
      {progressive && progressiveLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-spa-cloud/20">
          <div className="w-8 h-8 border-2 border-alpine-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {(imageError || progressiveError) && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-spa-cloud/20 text-spa-charcoal/60">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Specialized image components
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="hero" priority />
)

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="thumbnail" />
)

export const GalleryImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="gallery" />
)

export const AvatarImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="avatar" className={`rounded-full ${props.className || ''}`} />
)

export const BackgroundImage: React.FC<Omit<OptimizedImageProps, 'preset'>> = (props) => (
  <OptimizedImage {...props} preset="background" className={`object-cover ${props.className || ''}`} />
)

// Image gallery component with optimized loading
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  columns?: number
  spacing?: number
  className?: string
}

export const OptimizedImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  spacing = 4,
  className = ''
}) => {
  const [loadedCount, setLoadedCount] = useState(0)

  const handleImageLoad = React.useCallback(() => {
    setLoadedCount(prev => prev + 1)
  }, [])

  const gridClassName = React.useMemo(() => 
    `grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} gap-${spacing} ${className}`,
    [columns, spacing, className]
  )

  return (
    <div className={gridClassName}>
      {images.map((image, index) => (
        <div key={`gallery-${index}`} className="relative group">
          <GalleryImage
            src={image.src}
            alt={image.alt}
            width={image.width || 400}
            height={image.height || 300}
            className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            onLoad={handleImageLoad}
            lazyLoad={index > 6} // Load first 6 images immediately
          />
          
          {/* Loading indicator */}
          {loadedCount <= index && (
            <div className="absolute inset-0 bg-spa-cloud/20 animate-pulse rounded-lg" />
          )}
        </div>
      ))}
    </div>
  )
}

export default OptimizedImage