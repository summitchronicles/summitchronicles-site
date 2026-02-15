const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

/**
 * Generate chat completion using Ollama's OpenAI-compatible endpoint.
 * Same signature as replicate's generateChatCompletion for easy swapping.
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
    temperature = 0.7,
    max_tokens = 2048,
    top_p = 0.9,
  } = options;

  const url = `${OLLAMA_BASE_URL}/v1/chat/completions`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        temperature,
        max_tokens,
        top_p,
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${text}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error: any) {
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error(
        'Ollama is not running. Start it with: ollama serve'
      );
    }
    throw new Error(
      `Ollama generation failed: ${error.message}`
    );
  }
}

/**
 * Check if Ollama is available and responding.
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
