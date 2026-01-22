import { CohereClient } from 'cohere-ai';

// Cohere API configuration
export const cohereConfig = {
  apiKey: process.env.COHERE_API_KEY || '',
  chatModel: 'command-r', // Efficient, strong RAG model
  embeddingModel: 'embed-english-v3.0',
};

// Initialize Client
const cohere = new CohereClient({
  token: cohereConfig.apiKey,
});

// Chat completion interface (Matches Ollama interface for easy swap)
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  model: string = cohereConfig.chatModel,
  options?: {
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  if (!cohereConfig.apiKey) {
    throw new Error('COHERE_API_KEY is not configured');
  }

  try {
    // Convert 'system' role to current message preamble if possible,
    // or just prepend to user message for simplicity as Cohere handles chat history differently.
    // Cohere Chat API expects `message` (latest) and `chatHistory`.

    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role:
        msg.role === 'user'
          ? 'USER'
          : msg.role === 'assistant'
            ? 'CHATBOT'
            : 'SYSTEM',
      message: msg.content,
    })) as any[];

    const lastMessage = messages[messages.length - 1];

    // Extract system prompt if present in history or convert it
    const systemMessage = messages.find((m) => m.role === 'system');
    const preamble = systemMessage ? systemMessage.content : undefined;

    // Filter out system from chatHistory if passed as preamble
    const validHistory = chatHistory.filter((h) => h.role !== 'SYSTEM');

    const response = await cohere.chat({
      model: model,
      message: lastMessage.content,
      chatHistory: validHistory.length > 0 ? validHistory : undefined,
      preamble: preamble,
      temperature: options?.temperature || 0.7,
      maxTokens: options?.max_tokens,
    });

    return response.text;
  } catch (error) {
    console.error('Error generating chat completion with Cohere:', error);
    throw new Error('Failed to generate chat completion');
  }
}

// Generate embedding (Single)
export async function generateEmbedding(
  text: string,
  model: string = cohereConfig.embeddingModel
): Promise<number[]> {
  if (!cohereConfig.apiKey) {
    throw new Error('COHERE_API_KEY is not configured');
  }

  try {
    const response = await cohere.embed({
      texts: [text],
      model: model,
      inputType: 'search_document', // Optimized for storage/retrieval
    });

    if (Array.isArray(response.embeddings) && response.embeddings.length > 0) {
      // Embeddings can be float[][] or object based on version, handling float[][]
      return response.embeddings[0] as number[];
    }
    throw new Error('No embeddings returned');
  } catch (error) {
    console.error('Error generating embedding with Cohere:', error);
    throw new Error('Failed to generate embedding');
  }
}

// Generate embeddings (Batch)
export async function generateEmbeddings(
  texts: string[],
  model: string = cohereConfig.embeddingModel
): Promise<number[][]> {
  if (!cohereConfig.apiKey) {
    throw new Error('COHERE_API_KEY is not configured');
  }

  try {
    const response = await cohere.embed({
      texts: texts,
      model: model,
      inputType: 'search_document',
    });

    return response.embeddings as number[][];
  } catch (error) {
    console.error('Error generating embeddings with Cohere:', error);
    throw new Error('Failed to generate embeddings');
  }
}

// Re-ranking (Cohere Speciality) - Bonus!
export async function rerankDocuments(
  query: string,
  documents: { text: string; [key: string]: any }[],
  topN: number = 5
) {
  if (!cohereConfig.apiKey) return documents.slice(0, topN); // Fallback

  try {
    const response = await cohere.rerank({
      query: query,
      documents: documents.map((d) => d.text),
      topN: topN,
      model: 'rerank-english-v3.0',
    });

    // Map back to original documents
    return response.results.map((result) => ({
      document: documents[result.index],
      relevanceScore: result.relevanceScore,
    }));
  } catch (error) {
    console.error('Cohere Rerank failed:', error);
    return documents
      .slice(0, topN)
      .map((d) => ({ document: d, relevanceScore: 0 }));
  }
}

// Calculate cosine similarity (Helper, same as before)
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    // Cohere v3 embeddings are 1024 d, ensure matching
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Training-specific AI assistant (Helper wrapper)
export async function askTrainingQuestion(
  question: string,
  context?: string
): Promise<string> {
  const systemPrompt = `You are an expert mountaineering and alpine climbing coach with extensive experience in high-altitude training, expedition preparation, and technical climbing skills.

  Provide detailed, practical, and safety-focused advice. Always emphasize proper training progression and risk management.
  ${context ? `Additional context: ${context}` : ''}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ];

  return generateChatCompletion(messages);
}

// Generate training insights
export async function generateTrainingInsights(
  activities: any[],
  goals: string[]
): Promise<string> {
  const activitySummary = activities
    .map(
      (activity) =>
        `${activity.type}: ${activity.distance}m, ${activity.total_elevation_gain}m elevation, ${activity.moving_time}s duration`
    )
    .join('\n');

  const prompt = `Based on these recent training activities and goals, provide personalized training insights and recommendations:

Recent Activities:
${activitySummary}

Training Goals:
${goals.join(', ')}

Please analyze the training pattern and provide:
1. Progress assessment
2. Areas for improvement
3. Specific recommendations for the next training cycle
4. Risk factors to monitor`;

  return askTrainingQuestion(prompt);
}

// Test Cohere connection
export async function testConnection(): Promise<boolean> {
  try {
    // Run a cheap embedding to test validity
    await generateEmbedding('test');
    return true;
  } catch (error) {
    console.error('Cohere connection test failed:', error);
    return false;
  }
}
