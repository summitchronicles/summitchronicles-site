// Ollama client for local LLM and embeddings
interface OllamaResponse {
  model: string
  response: string
  done: boolean
}

interface OllamaEmbeddingResponse {
  embedding: number[]
}

class OllamaClient {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl
  }

  // Check if Ollama is running
  async isRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
    }
  }

  // Generate embeddings using nomic-embed-text
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'nomic-embed-text',
          prompt: text
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama embedding failed: ${response.statusText}`)
      }

      const data: OllamaEmbeddingResponse = await response.json()
      return data.embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  // Generate response using Llama
  async generateResponse(prompt: string, context: string[] = []): Promise<string> {
    try {
      const contextString = context.length > 0 
        ? `Context information:\n${context.join('\n\n')}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:` 
        : prompt

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.1:8b',
          prompt: contextString,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama generation failed: ${response.statusText}`)
      }

      const data: OllamaResponse = await response.json()
      return data.response.trim()
    } catch (error) {
      console.error('Error generating response:', error)
      throw error
    }
  }

  // Stream response for better UX
  async *streamResponse(prompt: string, context: string[] = []): AsyncGenerator<string> {
    const contextString = context.length > 0 
      ? `Context information:\n${context.join('\n\n')}\n\nQuestion: ${prompt}\n\nAnswer based on the context above:` 
      : prompt

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        prompt: contextString,
        stream: true
      })
    })

    if (!response.body) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          const data: OllamaResponse = JSON.parse(line)
          if (data.response) {
            yield data.response
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}

export const ollama = new OllamaClient()

// Fallback to OpenAI for embeddings if Ollama unavailable
export async function generateEmbedding(text: string): Promise<number[]> {
  // Try Ollama first
  if (await ollama.isRunning()) {
    return ollama.generateEmbedding(text)
  }

  // Fallback to OpenAI if available
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text
      })
    })

    const data = await response.json()
    return data.data[0].embedding
  }

  throw new Error('No embedding service available. Please start Ollama or add OpenAI API key.')
}