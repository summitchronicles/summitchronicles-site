import {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
  generateChatCompletion,
} from '../integrations/cohere';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Assuming gray-matter is available, or simplistic parsing

// Knowledge base document interface
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  metadata: {
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    mountain_type?: 'technical' | 'endurance' | 'mixed' | 'expedition';
    skills?: string[];
    equipment?: string[];
    conditions?: string[];
    tags?: string[];
  };
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

// Search result interface
export interface SearchResult {
  document: KnowledgeDocument;
  similarity: number;
  relevanceScore: number;
}

// RAG response interface
export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  context_used: string[];
  confidence: number;
}

// In-memory knowledge base
const knowledgeBase: KnowledgeDocument[] = [];

// Initialize with mountaineering training content AND Blog Posts
export async function initializeKnowledgeBase(): Promise<void> {
  // 1. Load Hardcoded Training Data
  const trainingContent: Omit<
    KnowledgeDocument,
    'id' | 'embedding' | 'created_at' | 'updated_at'
  >[] = [
    {
      title: 'High-Altitude Acclimatization Protocol',
      content: `Proper acclimatization is crucial for high-altitude mountaineering success. The general rule is to gain no more than 300-500m of sleeping elevation per day above 3000m.

Key principles:
1. Climb high, sleep low - ascend during the day but descend to sleep at lower elevation
2. Rest days every 3-4 days of ascent
3. Hydration is critical - drink 3-4 liters per day
4. Recognize symptoms of AMS, HACE, and HAPE
5. Acclimatization medications (Diamox) should be discussed with expedition physician

Timeline for major peaks:
- Everest: 6-8 weeks total, with 3 rotations to higher camps
- Denali: 2-3 weeks with multiple carries to higher camps
- Technical peaks: 1-2 weeks depending on approach and complexity`,
      category: 'Training',
      source: 'Training Manual',
      metadata: {
        difficulty_level: 'intermediate',
        mountain_type: 'expedition',
        skills: ['acclimatization', 'altitude', 'physiology'],
        conditions: ['high-altitude', 'expedition'],
        tags: ['acclimatization', 'altitude-sickness', 'expedition-planning'],
      },
    },
    {
      title: 'Technical Ice Climbing Progression',
      content: `Ice climbing progression should follow a systematic approach from easy water ice to challenging mixed routes.

Grade progression:
- WI2-WI3: Low-angle water ice, basic ice axe and crampon techniques
- WI4: Vertical ice, advanced placement techniques, efficient movement
- WI5: Sustained vertical ice, chandelier ice, complex route finding
- WI6+: Overhanging ice, thin conditions, extreme technical difficulty

Essential techniques:
1. Proper swing technique - relaxed, controlled, from shoulder
2. Crampon placement - front-pointing vs flat-footing
3. Ice tool placement - solid sticks in good ice
4. Body positioning - stay close to ice, use skeleton loading
5. Route reading - identify good ice, avoid hazards

Training progression:
- Start on top-rope at local crags
- Progress to easy multi-pitch routes
- Develop endurance on long routes
- Practice self-rescue and anchor building
- Train in various ice conditions`,
      category: 'Technical Skills',
      source: 'Ice Climbing Guide',
      metadata: {
        difficulty_level: 'intermediate',
        mountain_type: 'technical',
        skills: ['ice-climbing', 'technical-skills', 'equipment'],
        equipment: ['ice-axes', 'crampons', 'ice-screws'],
        conditions: ['ice', 'winter', 'alpine'],
        tags: ['ice-climbing', 'technical-progression', 'safety'],
      },
    },
    {
      title: 'Expedition Fitness Training Protocol',
      content: `Expedition fitness requires a comprehensive approach combining cardiovascular endurance, strength, and mental resilience.

Training phases (6-month preparation):
1. Base building (Months 1-2): Aerobic base, general strength
2. Strength phase (Months 3-4): Weighted carries, specific strength
3. Peak phase (Months 5-6): Sport-specific training, tapering

Cardiovascular training:
- 4-6 sessions per week
- Zone 2 training: 70-80% of volume at conversational pace
- Weekly long session: 4-8 hours hiking with pack
- Interval training: VO2 max and threshold sessions

Strength training:
- 2-3 sessions per week
- Focus on functional movements: squats, deadlifts, step-ups
- Weighted carries: build to 20-30% body weight
- Core stability and injury prevention

Specific training:
- Altitude simulation (if available)
- Technical skill practice
- Mental training and visualization
- Equipment familiarity and testing`,
      category: 'Training',
      source: 'Expedition Training Manual',
      metadata: {
        difficulty_level: 'intermediate',
        mountain_type: 'expedition',
        skills: ['fitness', 'endurance', 'strength'],
        conditions: ['expedition', 'long-duration'],
        tags: ['fitness-training', 'expedition-prep', 'periodization'],
      },
    },
    {
      title: 'Avalanche Risk Assessment and Mitigation',
      content: `Avalanche safety is critical for backcountry and alpine climbing. Understanding snowpack conditions and terrain is essential.

Avalanche triangle:
1. Snowpack: recent snow, wind-loaded slopes, temperature changes
2. Weather: wind, temperature, precipitation patterns
3. Terrain: slope angle (30-45° most dangerous), aspect, elevation

Red flags (immediate danger):
- Recent avalanche activity
- Shooting cracks in snow
- Hollow sounds when walking
- Rapid warming or rain
- Heavy snowfall (>30cm in 24hrs)
- Strong winds loading slopes

Risk mitigation:
- Check avalanche forecasts daily
- Carry proper safety gear: beacon, probe, shovel
- Travel one at a time through exposed terrain
- Choose conservative routes and timing
- Practice rescue scenarios regularly
- Maintain escape routes and safe zones

Decision-making frameworks:
- Use systematic observation and recording
- Apply the 3x3 filter: conditions, terrain, human factors
- Turn back early if conditions deteriorate
- Communicate clearly with team members`,
      category: 'Safety',
      source: 'Avalanche Safety Manual',
      metadata: {
        difficulty_level: 'advanced',
        mountain_type: 'mixed',
        skills: ['avalanche-safety', 'risk-assessment', 'rescue'],
        equipment: ['avalanche-beacon', 'probe', 'shovel'],
        conditions: ['snow', 'winter', 'avalanche-terrain'],
        tags: ['avalanche-safety', 'risk-management', 'backcountry'],
      },
    },
    {
      title: 'High-Altitude Nutrition and Hydration',
      content: `Proper nutrition and hydration at altitude is crucial for performance and safety. Appetite suppression and increased metabolic demands require careful planning.

Caloric needs:
- Sea level: 2000-3000 calories/day
- Moderate altitude (3000-5000m): 3500-4500 calories/day
- High altitude (>5000m): 4500-6000+ calories/day
- Extreme cold adds 300-500 calories/day

Macronutrient breakdown:
- Carbohydrates: 60-65% (easily digestible)
- Fats: 20-25% (high calorie density)
- Proteins: 15-20% (muscle maintenance)

Hydration requirements:
- Minimum 3-4 liters/day at altitude
- Increase with physical activity and cold exposure
- Monitor urine color - should be pale yellow
- Electrolyte replacement important for long efforts

Practical strategies:
- Pre-hydrate before ascent days
- Eat frequently - small, digestible meals
- Favor familiar foods that taste good
- Pack high-calorie, low-bulk foods
- Include comfort foods for morale
- Plan for appetite suppression at extreme altitude`,
      category: 'Nutrition',
      source: 'High-Altitude Medicine',
      metadata: {
        difficulty_level: 'beginner',
        mountain_type: 'expedition',
        skills: ['nutrition', 'hydration', 'physiology'],
        conditions: ['high-altitude', 'expedition', 'cold'],
        tags: ['nutrition', 'hydration', 'altitude-physiology'],
      },
    },
  ];

  // Generate embeddings for all content
  // ... (Hardcoded items processed above) ...

  console.log('Initializing knowledge base with embeddings...');

  // Process Hardcoded Content
  for (const content of trainingContent) {
    try {
      const embedding = await generateEmbedding(content.content);
      const document: KnowledgeDocument = {
        ...content,
        id: generateDocumentId(content.title),
        embedding,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      knowledgeBase.push(document);
    } catch (error) {
      // Ignore dupes or errors
    }
  }

  // 2. Load Blog Posts from File System
  try {
    const blogsDir = path.join(process.cwd(), 'content', 'blog');
    if (fs.existsSync(blogsDir)) {
      const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(blogsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        console.log(`Embedding blog: ${data.title || file}`);
        const embedding = await generateEmbedding(content);

        knowledgeBase.push({
          id: generateDocumentId(data.title || file),
          title: data.title || file.replace('.md', ''),
          content: content,
          category: data.category || 'Blog',
          source: 'Summit Chronicles Blog',
          metadata: {
            tags: data.tags || [],
            difficulty_level: 'beginner', // default
          },
          embedding,
          created_at: data.date || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.error('Failed to load blog posts:', err);
  }

  console.log(
    `Knowledge base initialized with ${knowledgeBase.length} documents`
  );
}

// Generate unique document ID
function generateDocumentId(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Add new document to knowledge base
export async function addDocument(
  document: Omit<
    KnowledgeDocument,
    'id' | 'embedding' | 'created_at' | 'updated_at'
  >
): Promise<string> {
  try {
    const embedding = await generateEmbedding(document.content);
    const newDocument: KnowledgeDocument = {
      ...document,
      id: generateDocumentId(document.title),
      embedding,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    knowledgeBase.push(newDocument);
    return newDocument.id;
  } catch (error) {
    console.error('Failed to add document to knowledge base:', error);
    throw error;
  }
}

// Search knowledge base using semantic similarity
export async function searchKnowledgeBase(
  query: string,
  limit: number = 5,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  if (knowledgeBase.length === 0) {
    await initializeKnowledgeBase();
  }

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarities and score documents
    const results: SearchResult[] = [];

    for (const document of knowledgeBase) {
      if (!document.embedding) continue;

      const similarity = cosineSimilarity(queryEmbedding, document.embedding);

      if (similarity >= threshold) {
        // Hybrid Search Scoring
        // Base score is vector similarity
        let relevanceScore = similarity;

        // Keyword boosting (BMP25-lite)
        const queryKeywords = extractKeywords(query);
        const titleLower = document.title.toLowerCase();
        const contentLower = document.content.toLowerCase();
        const tagsLower = (document.metadata.tags || [])
          .join(' ')
          .toLowerCase();

        let keywordMatches = 0;
        for (const word of queryKeywords) {
          if (titleLower.includes(word)) {
            relevanceScore += 0.15; // Strong boost for title match
            keywordMatches++;
          }
          if (tagsLower.includes(word)) {
            relevanceScore += 0.1; // Medium boost for tag match
            keywordMatches++;
          }
          if (contentLower.includes(word)) {
            relevanceScore += 0.05; // Light boost for content match
            keywordMatches++;
          }
        }

        // Boost if multiple keywords match (phrase matching proxy)
        if (keywordMatches >= 2) relevanceScore += 0.1;

        results.push({
          document,
          similarity,
          relevanceScore: Math.min(relevanceScore, 1.0),
        });
      }
    }

    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
}

// Helper function to extract keywords (simplified)
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        ![
          'what',
          'where',
          'when',
          'how',
          'that',
          'this',
          'with',
          'from',
        ].includes(w)
    );
}

// Generate answer using RAG (Retrieval-Augmented Generation)
export async function generateRAGResponse(
  question: string,
  maxContextLength: number = 3000
): Promise<RAGResponse> {
  try {
    // Search for relevant documents
    const searchResults = await searchKnowledgeBase(question, 5, 0.6);

    if (searchResults.length === 0 || searchResults[0].similarity < 0.45) {
      return {
        answer:
          'Summit Chronicles database is still populating information and blogs, you can reach out directly to Sunith for more specific answers.',
        sources: [],
        context_used: [],
        confidence: 0.1,
      };
    }

    // Build context with smart chunking (sliding window overlap)
    let context = '';
    const contextUsed: string[] = [];
    let currentLength = 0;

    for (const result of searchResults) {
      // Prioritize the most relevant section of the document if it's long
      // For now, we'll take the first 1000 characters as a "smart chunk" since our docs are concise
      // In a production system, we'd use a sliding window over the full content
      const contentChunk =
        result.document.content.length > 1500
          ? result.document.content.substring(0, 1500) + '...'
          : result.document.content;

      const docContext = `SOURCE: ${result.document.title}\n${contentChunk}\n\n`;

      if (currentLength + docContext.length <= maxContextLength) {
        context += docContext;
        contextUsed.push(result.document.title);
        currentLength += docContext.length;
      } else {
        break;
      }
    }

    // Generate response using the context
    const prompt = `Based on the following mountaineering and climbing knowledge, please provide a detailed and practical answer to the question. Focus on safety, proper technique, and evidence-based recommendations.

Context:
${context}

Question: ${question}

Please provide a comprehensive answer that:
1. Directly addresses the question
2. Includes specific techniques or procedures when relevant
3. Emphasizes safety considerations
4. Provides practical next steps or recommendations
5. References the knowledge provided in the context`;

    const answer = await generateChatCompletion([
      {
        role: 'system',
        content:
          'You are an expert mountaineering coach providing detailed, safety-focused advice based on the provided knowledge base.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    // Calculate confidence based on search results quality
    const avgSimilarity =
      searchResults.reduce((sum, result) => sum + result.similarity, 0) /
      searchResults.length;
    const confidence = Math.min(avgSimilarity * 1.2, 1.0); // Boost confidence slightly

    return {
      answer,
      sources: searchResults,
      context_used: contextUsed,
      confidence,
    };
  } catch (error) {
    console.error('Error generating RAG response:', error);
    throw error;
  }
}

// Get knowledge base statistics
export function getKnowledgeBaseStats(): {
  totalDocuments: number;
  categories: { [key: string]: number };
  difficultyLevels: { [key: string]: number };
  lastUpdated: string | null;
} {
  const categories: { [key: string]: number } = {};
  const difficultyLevels: { [key: string]: number } = {};
  let lastUpdated: string | null = null;

  for (const doc of knowledgeBase) {
    // Count categories
    categories[doc.category] = (categories[doc.category] || 0) + 1;

    // Count difficulty levels
    if (doc.metadata.difficulty_level) {
      difficultyLevels[doc.metadata.difficulty_level] =
        (difficultyLevels[doc.metadata.difficulty_level] || 0) + 1;
    }

    // Track most recent update
    if (!lastUpdated || doc.updated_at > lastUpdated) {
      lastUpdated = doc.updated_at;
    }
  }

  return {
    totalDocuments: knowledgeBase.length,
    categories,
    difficultyLevels,
    lastUpdated,
  };
}

// Export knowledge base for inspection (development only)
export function exportKnowledgeBase(): KnowledgeDocument[] {
  return knowledgeBase.map((doc) => ({ ...doc, embedding: undefined })); // Remove embeddings for readability
}
