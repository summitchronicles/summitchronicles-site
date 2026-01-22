import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Model configurations for Option 3 (Dynamic)
const CHAT_MODEL = 'meta/meta-llama-3.1-8b-instruct'; // Fast, cheap for queries
const BLOG_MODEL = 'meta/meta-llama-3.1-70b-instruct'; // High quality for content
const EMBEDDING_MODEL = 'nateraw/bge-large-en-v1.5'; // 1024-dim embeddings

// Message format conversion: OpenAI-style → Llama prompt format
function formatMessagesToLlamaPrompt(
  messages: Array<{ role: string; content: string }>
): string {
  let prompt = '<|begin_of_text|>';

  for (const msg of messages) {
    prompt += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
  }

  // Add assistant header to trigger response
  prompt += '<|start_header_id|>assistant<|end_header_id|>\n\n';

  return prompt;
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
    const output = await replicate.run(selectedModel as any, {
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
 * @returns 1024-dimensional embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const output = await replicate.run(EMBEDDING_MODEL as any, {
      input: {
        text_input: text,
      },
    });

    // Replicate embeddings return array of numbers
    if (Array.isArray(output)) {
      return output as number[];
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
 * @returns Array of 1024-dimensional embedding vectors
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
