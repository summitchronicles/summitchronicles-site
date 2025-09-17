// Sanity document types for Summit Chronicles

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  crop?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  bio?: string;
  image?: SanityImage;
}

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  description?: string;
}

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  author: Author;
  categories: Category[];
  mainImage?: SanityImage;
  body: any[]; // Portable text
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: SanityImage;
  };
  featured?: boolean;
  readTime?: number;
}

export interface TrainingPost {
  _id: string;
  _type: 'training';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in minutes
  category: 'cardio' | 'strength' | 'technical' | 'mental' | 'nutrition';
  equipment?: string[];
  mainImage?: SanityImage;
  body: any[]; // Portable text
  relatedPosts?: TrainingPost[];
  videoUrl?: string;
  downloadableResources?: {
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'audio' | 'document';
  }[];
}

export interface ExpeditionUpdate {
  _id: string;
  _type: 'expeditionUpdate';
  title: string;
  date: string;
  location: string;
  altitude?: number;
  weather?: {
    temperature: number;
    conditions: string;
    windSpeed?: number;
    visibility?: string;
  };
  content: any[]; // Portable text
  images?: SanityImage[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  milestone?: boolean;
  category:
    | 'training'
    | 'travel'
    | 'base-camp'
    | 'acclimatization'
    | 'summit-push'
    | 'descent';
}

export interface GalleryImage {
  _id: string;
  _type: 'gallery';
  title: string;
  description?: string;
  image: SanityImage;
  captureDate: string;
  location?: string;
  category: 'training' | 'expedition' | 'preparation' | 'lifestyle' | 'gear';
  featured?: boolean;
  tags?: string[];
  photographer?: string;
  equipment?: {
    camera?: string;
    lens?: string;
    settings?: string;
  };
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  title: string;
  description: string;
  keywords: string[];
  socialMedia: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  expeditionStatus: {
    phase: 'preparation' | 'training' | 'travel' | 'expedition' | 'completed';
    startDate?: string;
    expectedSummitDate?: string;
    currentLocation?: string;
    lastUpdate?: string;
  };
  currentGoals: {
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline?: string;
    completed: boolean;
  }[];
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

export interface Sponsor {
  _id: string;
  _type: 'sponsor';
  name: string;
  logo: SanityImage;
  website?: string;
  tier: 'title' | 'major' | 'supporting' | 'gear';
  description?: string;
  contribution?: {
    amount?: number;
    type: 'financial' | 'gear' | 'service' | 'media';
    details?: string;
  };
  active: boolean;
  startDate: string;
  endDate?: string;
}

export interface NewsletterSubscriber {
  _id: string;
  _type: 'subscriber';
  email: string;
  firstName?: string;
  lastName?: string;
  subscribeDate: string;
  interests?: string[];
  active: boolean;
  source?: string;
}

// Union type for all document types
export type SanityDocument =
  | Post
  | TrainingPost
  | ExpeditionUpdate
  | GalleryImage
  | SiteSettings
  | Author
  | Category
  | Sponsor
  | NewsletterSubscriber;

// Utility types
export type DocumentType = SanityDocument['_type'];

// Content preview types (for when content is not fully loaded)
export interface ContentPreview {
  _id: string;
  _type: DocumentType;
  title: string;
  slug?: {
    current: string;
  };
  publishedAt?: string;
  mainImage?: SanityImage;
  excerpt?: string;
}
