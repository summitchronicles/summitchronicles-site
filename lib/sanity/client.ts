import { createClient } from '@sanity/client'
import { type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
}

// Create Sanity client
export const sanityClient: SanityClient = createClient(sanityConfig)

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries for different content types
export const queries = {
  // Blog posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title,
      slug
    },
    mainImage,
    body
  }`,
  
  postBySlug: (slug: string) => `*[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{
      name,
      bio,
      image
    },
    categories[]->{
      title,
      slug
    },
    mainImage,
    body,
    seo
  }`,

  // Training content
  allTrainingPosts: `*[_type == "training"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    difficulty,
    duration,
    category,
    mainImage,
    body
  }`,

  trainingBySlug: (slug: string) => `*[_type == "training" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    difficulty,
    duration,
    category,
    equipment[],
    mainImage,
    body,
    relatedPosts[]->
  }`,

  // Expedition updates
  allExpeditionUpdates: `*[_type == "expeditionUpdate"] | order(date desc) {
    _id,
    title,
    date,
    location,
    altitude,
    weather,
    content,
    images[],
    coordinates
  }`,

  // Media gallery
  galleryImages: `*[_type == "gallery"] | order(captureDate desc) {
    _id,
    title,
    description,
    image,
    captureDate,
    location,
    category,
    featured
  }`,

  // Settings and global content
  siteSettings: `*[_type == "siteSettings"][0] {
    title,
    description,
    keywords[],
    socialMedia,
    contact,
    expeditionStatus,
    currentGoals[]
  }`
}

// Helper functions for fetching data
export async function getAllPosts() {
  try {
    return await sanityClient.fetch(queries.allPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await sanityClient.fetch(queries.postBySlug(slug))
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getAllTrainingPosts() {
  try {
    return await sanityClient.fetch(queries.allTrainingPosts)
  } catch (error) {
    console.error('Error fetching training posts:', error)
    return []
  }
}

export async function getTrainingBySlug(slug: string) {
  try {
    return await sanityClient.fetch(queries.trainingBySlug(slug))
  } catch (error) {
    console.error('Error fetching training post:', error)
    return null
  }
}

export async function getAllExpeditionUpdates() {
  try {
    return await sanityClient.fetch(queries.allExpeditionUpdates)
  } catch (error) {
    console.error('Error fetching expedition updates:', error)
    return []
  }
}

export async function getGalleryImages() {
  try {
    return await sanityClient.fetch(queries.galleryImages)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
}

export async function getSiteSettings() {
  try {
    return await sanityClient.fetch(queries.siteSettings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}