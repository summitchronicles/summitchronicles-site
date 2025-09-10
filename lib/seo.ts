export const defaultSEO = {
  title: 'Summit Chronicles — Mountains. Mindset. Momentum.',
  description: 'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance. Join the journey to conquer the world\'s highest peaks.',
  keywords: 'mountaineering, seven summits, everest training, climbing gear, expedition planning, high altitude training, mountaineering AI, climbing coach',
  openGraph: {
    type: 'website',
    url: 'https://summitchronicles.com',
    title: 'Summit Chronicles — Seven Summits Journey',
    description: 'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance.',
    images: [
      {
        url: 'https://summitchronicles.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Summit Chronicles - Seven Summits Journey',
      }
    ],
    site_name: 'Summit Chronicles',
  },
  twitter: {
    cardType: 'summary_large_image',
    handle: '@summitchronicles',
    site: '@summitchronicles',
    creator: '@summitchronicles',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    }
  }
}

export const getPageSEO = (page: {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  noIndex?: boolean
}) => ({
  title: page.title ? `${page.title} | Summit Chronicles` : defaultSEO.title,
  description: page.description || defaultSEO.description,
  keywords: page.keywords || defaultSEO.keywords,
  openGraph: {
    ...defaultSEO.openGraph,
    title: page.title || defaultSEO.openGraph.title,
    description: page.description || defaultSEO.openGraph.description,
    url: page.url ? `https://summitchronicles.com${page.url}` : defaultSEO.openGraph.url,
    images: page.image ? [
      {
        url: `https://summitchronicles.com${page.image}`,
        width: 1200,
        height: 630,
        alt: page.title || 'Summit Chronicles',
      }
    ] : defaultSEO.openGraph.images,
  },
  twitter: defaultSEO.twitter,
  robots: page.noIndex ? { index: false, follow: false } : defaultSEO.robots,
})

// Structured Data helpers
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Summit Chronicles',
  url: 'https://summitchronicles.com',
  logo: 'https://summitchronicles.com/logo.png',
  description: 'Professional mountaineering training and Seven Summits expedition planning',
  sameAs: [
    'https://instagram.com/summitchronicles',
    'https://twitter.com/summitchronicles',
    'https://youtube.com/summitchronicles'
  ]
})

export const getArticleSchema = (article: {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  image?: string
  url: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  publisher: getOrganizationSchema(),
  image: article.image ? `https://summitchronicles.com${article.image}` : undefined,
  url: `https://summitchronicles.com${article.url}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://summitchronicles.com${article.url}`,
  },
})

export const getBreadcrumbSchema = (breadcrumbs: Array<{ name: string, url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://summitchronicles.com${item.url}`,
  })),
})

export const getFAQSchema = (faqs: Array<{ question: string, answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})

export const getPersonSchema = (person: {
  name: string;
  description: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  sameAs?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  description: person.description,
  image: person.image ? `https://summitchronicles.com${person.image}` : undefined,
  jobTitle: person.jobTitle,
  worksFor: person.worksFor ? {
    '@type': 'Organization',
    name: person.worksFor,
  } : undefined,
  sameAs: person.sameAs,
})
