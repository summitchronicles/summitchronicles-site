import { sanityClient } from '../sanity/client';
import { addDocument, KnowledgeDocument } from './training-knowledge-base';

// Sanity content queries
const queries = {
  allTrainingEntries: `*[_type == "trainingEntry"] {
    _id,
    title,
    description,
    type,
    duration,
    intensity,
    metrics,
    location,
    tags,
    date,
    _createdAt,
    _updatedAt
  }`,

  allBlogPosts: `*[_type == "blogPost" && category->slug.current == "training"] {
    _id,
    title,
    content,
    excerpt,
    category->{title, slug},
    tags,
    publishedAt,
    _createdAt,
    _updatedAt
  }`,

  allExpeditionUpdates: `*[_type == "expeditionUpdate"] {
    _id,
    title,
    content,
    location,
    conditions,
    lessons,
    date,
    _createdAt,
    _updatedAt
  }`,

  allPersonalStories: `*[_type == "personalStory"] {
    _id,
    title,
    content,
    mountainLocation,
    difficulty,
    tags,
    date,
    _createdAt,
    _updatedAt
  }`,
};

interface ContentIngestionResult {
  success: boolean;
  documentsProcessed: number;
  documentsAdded: number;
  errors: string[];
  categories: { [key: string]: number };
}

// Main content ingestion function
export async function ingestContentToKnowledgeBase(): Promise<ContentIngestionResult> {
  const result: ContentIngestionResult = {
    success: true,
    documentsProcessed: 0,
    documentsAdded: 0,
    errors: [],
    categories: {},
  };

  try {
    // Fetch all content types from Sanity
    const [trainingEntries, blogPosts, expeditionUpdates, personalStories] =
      await Promise.all([
        sanityClient.fetch(queries.allTrainingEntries),
        sanityClient.fetch(queries.allBlogPosts),
        sanityClient.fetch(queries.allExpeditionUpdates),
        sanityClient.fetch(queries.allPersonalStories),
      ]);

    // Process training entries
    for (const entry of trainingEntries) {
      try {
        const document = transformTrainingEntry(entry);
        await addDocument(document);
        result.documentsAdded++;
        result.categories[document.category] =
          (result.categories[document.category] || 0) + 1;
      } catch (error) {
        result.errors.push(`Training entry ${entry._id}: ${error}`);
        result.success = false;
      }
      result.documentsProcessed++;
    }

    // Process blog posts
    for (const post of blogPosts) {
      try {
        const document = transformBlogPost(post);
        await addDocument(document);
        result.documentsAdded++;
        result.categories[document.category] =
          (result.categories[document.category] || 0) + 1;
      } catch (error) {
        result.errors.push(`Blog post ${post._id}: ${error}`);
        result.success = false;
      }
      result.documentsProcessed++;
    }

    // Process expedition updates
    for (const update of expeditionUpdates) {
      try {
        const document = transformExpeditionUpdate(update);
        await addDocument(document);
        result.documentsAdded++;
        result.categories[document.category] =
          (result.categories[document.category] || 0) + 1;
      } catch (error) {
        result.errors.push(`Expedition update ${update._id}: ${error}`);
        result.success = false;
      }
      result.documentsProcessed++;
    }

    // Process personal stories
    for (const story of personalStories) {
      try {
        const document = transformPersonalStory(story);
        await addDocument(document);
        result.documentsAdded++;
        result.categories[document.category] =
          (result.categories[document.category] || 0) + 1;
      } catch (error) {
        result.errors.push(`Personal story ${story._id}: ${error}`);
        result.success = false;
      }
      result.documentsProcessed++;
    }

    console.log(
      `Content ingestion completed: ${result.documentsAdded}/${result.documentsProcessed} documents added`
    );
    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Content ingestion failed: ${error}`);
    return result;
  }
}

// Transform training entry to knowledge document
function transformTrainingEntry(
  entry: any
): Omit<KnowledgeDocument, 'id' | 'embedding' | 'created_at' | 'updated_at'> {
  const content = [
    entry.description || '',
    entry.metrics
      ? `Metrics: Distance ${entry.metrics.distance || 'N/A'}, Elevation ${entry.metrics.elevationGain || 'N/A'}, Duration ${entry.duration || 'N/A'}min`
      : '',
    entry.location
      ? `Location: ${entry.location.name}, Weather: ${entry.location.weather}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    title: entry.title,
    content:
      content || `${entry.type} training session completed on ${entry.date}`,
    category: 'Training Log',
    source: 'Training Entry',
    metadata: {
      difficulty_level: mapIntensityToDifficulty(entry.intensity),
      mountain_type: mapTrainingTypeToMountainType(entry.type),
      skills: entry.tags || [],
      tags: entry.tags || [],
      equipment: extractEquipmentFromTags(entry.tags || []),
      conditions: entry.location?.weather ? [entry.location.weather] : [],
    },
  };
}

// Transform blog post to knowledge document
function transformBlogPost(
  post: any
): Omit<KnowledgeDocument, 'id' | 'embedding' | 'created_at' | 'updated_at'> {
  return {
    title: post.title,
    content: post.content || post.excerpt || '',
    category: 'Training Content',
    source: 'Blog Post',
    metadata: {
      difficulty_level: extractDifficultyFromContent(post.content),
      mountain_type: extractMountainTypeFromTags(post.tags || []),
      skills: post.tags || [],
      tags: post.tags || [],
    },
  };
}

// Transform expedition update to knowledge document
function transformExpeditionUpdate(
  update: any
): Omit<KnowledgeDocument, 'id' | 'embedding' | 'created_at' | 'updated_at'> {
  const content = [
    update.content || '',
    update.conditions ? `Conditions: ${update.conditions}` : '',
    update.lessons ? `Lessons learned: ${update.lessons}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    title: update.title,
    content: content,
    category: 'Expedition Experience',
    source: 'Expedition Update',
    metadata: {
      difficulty_level: 'advanced' as const,
      mountain_type: 'expedition' as const,
      skills: ['expedition-planning', 'high-altitude'],
      conditions: update.conditions ? [update.conditions] : [],
      tags: ['expedition', 'field-report'],
    },
  };
}

// Transform personal story to knowledge document
function transformPersonalStory(
  story: any
): Omit<KnowledgeDocument, 'id' | 'embedding' | 'created_at' | 'updated_at'> {
  return {
    title: story.title,
    content: story.content || '',
    category: 'Experience & Lessons',
    source: 'Personal Story',
    metadata: {
      difficulty_level: story.difficulty || ('intermediate' as const),
      mountain_type: extractMountainTypeFromLocation(story.mountainLocation),
      skills: story.tags || [],
      tags: story.tags || [],
    },
  };
}

// Helper functions for mapping content to knowledge base metadata
function mapIntensityToDifficulty(
  intensity: string
): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  switch (intensity?.toLowerCase()) {
    case 'low':
      return 'beginner';
    case 'moderate':
      return 'intermediate';
    case 'high':
      return 'advanced';
    case 'maximum':
      return 'expert';
    default:
      return 'intermediate';
  }
}

function mapTrainingTypeToMountainType(
  type: string
): 'technical' | 'endurance' | 'mixed' | 'expedition' {
  switch (type?.toLowerCase()) {
    case 'climbing':
    case 'technical':
      return 'technical';
    case 'cardio':
    case 'hiking':
      return 'endurance';
    case 'strength':
      return 'mixed';
    case 'recovery':
      return 'mixed';
    default:
      return 'endurance';
  }
}

function extractEquipmentFromTags(tags: string[]): string[] {
  const equipmentKeywords = [
    'ice-axes',
    'crampons',
    'harness',
    'helmet',
    'rope',
    'carabiners',
    'ice-screws',
    'pitons',
    'nuts',
    'cams',
    'belay-device',
    'avalanche-beacon',
  ];
  return tags.filter((tag) =>
    equipmentKeywords.some((keyword) => tag.toLowerCase().includes(keyword))
  );
}

function extractDifficultyFromContent(
  content: string
): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (!content) return 'intermediate';

  const text = content.toLowerCase();
  if (
    text.includes('beginner') ||
    text.includes('basic') ||
    text.includes('introduction')
  )
    return 'beginner';
  if (
    text.includes('expert') ||
    text.includes('professional') ||
    text.includes('extreme')
  )
    return 'expert';
  if (
    text.includes('advanced') ||
    text.includes('technical') ||
    text.includes('complex')
  )
    return 'advanced';
  return 'intermediate';
}

function extractMountainTypeFromTags(
  tags: string[]
): 'technical' | 'endurance' | 'mixed' | 'expedition' {
  const technicalTags = ['technical', 'climbing', 'ice', 'rock', 'mixed'];
  const expeditionTags = ['expedition', 'high-altitude', 'everest', 'denali'];

  if (
    tags.some((tag) =>
      expeditionTags.some((keyword) => tag.toLowerCase().includes(keyword))
    )
  ) {
    return 'expedition';
  }
  if (
    tags.some((tag) =>
      technicalTags.some((keyword) => tag.toLowerCase().includes(keyword))
    )
  ) {
    return 'technical';
  }
  return 'endurance';
}

function extractMountainTypeFromLocation(
  location: string
): 'technical' | 'endurance' | 'mixed' | 'expedition' {
  if (!location) return 'mixed';

  const loc = location.toLowerCase();
  if (loc.includes('everest') || loc.includes('denali') || loc.includes('8000'))
    return 'expedition';
  if (loc.includes('technical') || loc.includes('ice') || loc.includes('rock'))
    return 'technical';
  return 'mixed';
}

// Scheduled content ingestion (to be called by sync service)
export async function scheduleContentIngestion(): Promise<void> {
  try {
    console.log('Starting scheduled content ingestion...');
    const result = await ingestContentToKnowledgeBase();

    if (result.success) {
      console.log(
        `Content ingestion successful: ${result.documentsAdded} documents added`
      );
    } else {
      console.error(`Content ingestion completed with errors:`, result.errors);
    }
  } catch (error) {
    console.error('Scheduled content ingestion failed:', error);
  }
}
