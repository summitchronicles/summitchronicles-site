'use client'

import { usePathname } from 'next/navigation'

interface StructuredDataProps {
  type?: 'Organization' | 'Person' | 'Article' | 'Event' | 'BreadcrumbList'
  data?: Record<string, any>
}

export function StructuredData({ type = 'Organization', data }: StructuredDataProps) {
  const pathname = usePathname()
  
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://summitchronicles.com'
  }

  const baseUrl = getBaseUrl()
  
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Summit Chronicles",
          "description": "Follow Sunith Kumar's journey to Mount Everest through systematic training, preparation, and authentic storytelling.",
          "url": baseUrl,
          "logo": `${baseUrl}/images/logo.png`,
          "foundingDate": "2024",
          "founder": {
            "@type": "Person",
            "name": "Sunith Kumar",
            "jobTitle": "Mountaineer & Entrepreneur",
            "description": "Aspiring Mount Everest climber documenting the complete journey from training to summit."
          },
          "sameAs": [
            "https://www.instagram.com/summitchronicles",
            "https://www.youtube.com/@summitchronicles",
            "https://twitter.com/summitchronicles"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "General",
            "email": "hello@summitchronicles.com"
          },
          "areaServed": "Worldwide",
          "knowsAbout": [
            "Mountain climbing",
            "Expedition training",
            "High-altitude mountaineering",
            "Mount Everest preparation",
            "Adventure sports"
          ]
        }

      case 'Person':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Sunith Kumar",
          "jobTitle": "Mountaineer & Entrepreneur",
          "description": "Aspiring Mount Everest climber documenting the complete journey from training to summit.",
          "url": `${baseUrl}/about`,
          "image": `${baseUrl}/images/sunith-profile.jpg`,
          "birthPlace": "India",
          "nationality": "Indian",
          "knowsAbout": [
            "Mountain climbing",
            "Expedition training",
            "High-altitude mountaineering",
            "Entrepreneurship",
            "Adventure photography"
          ],
          "memberOf": {
            "@type": "Organization",
            "name": "Summit Chronicles"
          },
          "sameAs": [
            "https://www.linkedin.com/in/sunithkumar",
            "https://www.instagram.com/sunithkumar"
          ]
        }

      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data?.title || "Mount Everest Training Chronicles",
          "description": data?.description || "Comprehensive training and preparation for Mount Everest expedition.",
          "author": {
            "@type": "Person",
            "name": "Sunith Kumar"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Summit Chronicles",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/logo.png`
            }
          },
          "datePublished": data?.publishedDate || "2024-01-01",
          "dateModified": data?.modifiedDate || new Date().toISOString(),
          "url": `${baseUrl}${pathname}`,
          "image": data?.image || `${baseUrl}/images/everest-hero.jpg`,
          "articleSection": data?.category || "Training",
          "keywords": data?.keywords || ["Mount Everest", "Training", "Mountaineering", "Expedition"]
        }

      case 'Event':
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": data?.name || "Mount Everest Expedition 2024",
          "description": data?.description || "Follow the complete journey to Mount Everest summit.",
          "startDate": data?.startDate || "2024-03-01",
          "endDate": data?.endDate || "2024-05-31",
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": "Mount Everest",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Nepal"
            }
          },
          "organizer": {
            "@type": "Person",
            "name": "Sunith Kumar"
          },
          "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/support`,
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }

      case 'BreadcrumbList':
        const pathSegments = (pathname || '').split('/').filter(Boolean)
        const breadcrumbs = [
          { name: 'Home', url: baseUrl }
        ]
        
        let currentPath = ''
        pathSegments.forEach((segment, index) => {
          currentPath += `/${segment}`
          breadcrumbs.push({
            name: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
            url: `${baseUrl}${currentPath}`
          })
        })

        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        }

      default:
        return {}
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData || Object.keys(structuredData).length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// Pre-configured components for common use cases
export function OrganizationStructuredData() {
  return <StructuredData type="Organization" />
}

export function PersonStructuredData() {
  return <StructuredData type="Person" />
}

export function BreadcrumbStructuredData() {
  return <StructuredData type="BreadcrumbList" />
}

interface ArticleStructuredDataProps {
  title: string
  description: string
  publishedDate?: string
  modifiedDate?: string
  image?: string
  category?: string
  keywords?: string[]
}

export function ArticleStructuredData(props: ArticleStructuredDataProps) {
  return <StructuredData type="Article" data={props} />
}

interface EventStructuredDataProps {
  name: string
  description: string
  startDate: string
  endDate: string
}

export function EventStructuredData(props: EventStructuredDataProps) {
  return <StructuredData type="Event" data={props} />
}