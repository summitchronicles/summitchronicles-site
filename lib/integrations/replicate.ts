import Replicate from 'replicate';

// Lazy initialization of Replicate client
let replicateInstance: Replicate | null = null;

function getClient(): Replicate {
  if (!replicateInstance) {
    if (!process.env.REPLICATE_API_TOKEN) {
      console.warn('⚠️ REPLICATE_API_TOKEN is not set. AI features will fail.');
    }
    replicateInstance = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });
  }
  return replicateInstance;
}

// Model configurations
// Llama 3 8B is verified working and sufficient for both Chat and Blog (cost-efficient)
const CHAT_MODEL = 'meta/meta-llama-3-8b-instruct';
const BLOG_MODEL = 'meta/meta-llama-3-8b-instruct'; // Shared model to avoid rate limits

// Verified BGE-Large version hash (1024 dimensions) - More powerful than MPNET
const EMBEDDING_MODEL =
  'nateraw/bge-large-en-v1.5:9cf9f015a9cb9c61d1a2610659cdac4a4ca222f2d3707a68517b18c198a9add1';

// Message format conversion: Simple chat format (safer for Replicate API)
function formatMessagesToLlamaPrompt(
  messages: Array<{ role: string; content: string }>
): string {
  // Simple format that works reliably
  return (
    messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n') + '\nAssistant:'
  );
}

/**
 * Generate chat completion using Replicate
 * @param messages - Array of {role, content} messages (OpenAI format)
 * @param options - Optional parameters (model override, temperature, etc.)
 * @returns Generated text response
 */
export async function generateChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: 'chat' | 'blog';
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  } = {}
): Promise<string> {
  const {
    model = 'chat',
    temperature = 0.7,
    max_tokens = 2048,
    top_p = 0.9,
  } = options;

  // Select model based on use case
  const selectedModel = model === 'blog' ? BLOG_MODEL : CHAT_MODEL;

  const prompt = formatMessagesToLlamaPrompt(messages);

  try {
    const output = await getClient().run(selectedModel as any, {
      input: {
        prompt,
        temperature,
        max_tokens,
        top_p,
      },
    });

    // Replicate returns an array of strings, join them
    if (Array.isArray(output)) {
      return output.join('');
    }

    return String(output);
  } catch (error) {
    console.error('Replicate API error:', error);
    throw new Error(
      `Replicate generation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate single text embedding using Replicate
 * @param text - Text to embed
 * @returns 1024-dimensional embedding vector (BGE-Large)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // BGE-Large expects "texts" as a JSON-stringified array (per official Replicate docs)
    const output = await getClient().run(EMBEDDING_MODEL as any, {
      input: {
        texts: JSON.stringify([text]),
      },
    });

    // Output is array of embeddings, we want the first one
    if (Array.isArray(output) && output.length > 0) {
      return output[0] as number[];
    }

    throw new Error('Unexpected embedding format from Replicate');
  } catch (error) {
    console.error('Replicate embedding error:', error);
    throw new Error(
      `Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Generate multiple embeddings in batch
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // Replicate doesn't have native batch support, so we'll run in parallel
  const embeddings = await Promise.all(
    texts.map((text) => generateEmbedding(text))
  );

  return embeddings;
}

/**
 * Calculate cosine similarity between two vectors
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score (0-1, higher is more similar)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

  if (magnitude === 0) {
    return 0;
  }

  return dotProduct / magnitude;
}

/**
 * Ask a training-related question (alias for generateChatCompletion)
 * Kept for backward compatibility with existing code
 */
export async function askTrainingQuestion(
  question: string,
  context?: string
): Promise<string> {
  const messages = context
    ? [
        { role: 'system', content: 'You are a helpful training coach.' },
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${question}`,
        },
      ]
    : [
        { role: 'system', content: 'You are a helpful training coach.' },
        { role: 'user', content: question },
      ];

  return generateChatCompletion(messages);
}

/**
 * Test connection to Replicate API
 * @returns true if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Simple embedding test
    await generateEmbedding('test');
    return true;
  } catch (error) {
    console.error('Replicate connection test failed:', error);
    return false;
  }
}
