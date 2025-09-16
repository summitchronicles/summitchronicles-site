import axios from 'axios'

// Ollama API configuration
export const ollamaConfig = {
  baseUrl: 'http://localhost:11434',
  languageModel: 'llama3.1:8b',
  embeddingModel: 'nomic-embed-text:latest'
}

// Chat completion interface
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: {
    role: string
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_duration?: number
  eval_duration?: number
}

// Embedding interface
export interface EmbeddingResponse {
  embedding: number[]
}

// Generate chat completion
export async function generateChatCompletion(
  messages: ChatMessage[], 
  model: string = ollamaConfig.languageModel,
  options?: {
    temperature?: number
    top_p?: number
    max_tokens?: number
  }
): Promise<string> {
  try {
    const response = await axios.post(`${ollamaConfig.baseUrl}/api/chat`, {
      model,
      messages,
      stream: false,
      options: {
        temperature: options?.temperature || 0.7,
        top_p: options?.top_p || 0.9,
        num_predict: options?.max_tokens || 2048
      }
    })

    return response.data.message.content
  } catch (error) {
    console.error('Error generating chat completion:', error)
    throw new Error('Failed to generate chat completion')
  }
}

// Generate embeddings
export async function generateEmbedding(
  text: string,
  model: string = ollamaConfig.embeddingModel
): Promise<number[]> {
  try {
    const response = await axios.post(`${ollamaConfig.baseUrl}/api/embeddings`, {
      model,
      prompt: text
    })

    return response.data.embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

// Generate embeddings for multiple texts
export async function generateEmbeddings(
  texts: string[],
  model: string = ollamaConfig.embeddingModel
): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text, model))
    )
    return embeddings
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw new Error('Failed to generate embeddings')
  }
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]
    normA += vectorA[i] * vectorA[i]
    normB += vectorB[i] * vectorB[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Test Ollama connection
export async function testOllamaConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${ollamaConfig.baseUrl}/api/tags`)
    return response.status === 200
  } catch (error) {
    console.error('Ollama connection test failed:', error)
    return false
  }
}

// Get available models
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await axios.get(`${ollamaConfig.baseUrl}/api/tags`)
    return response.data.models.map((model: any) => model.name)
  } catch (error) {
    console.error('Error fetching available models:', error)
    return []
  }
}

// Training-specific AI assistant
export async function askTrainingQuestion(
  question: string,
  context?: string
): Promise<string> {
  const systemPrompt = `You are an expert mountaineering and alpine climbing coach with extensive experience in high-altitude training, expedition preparation, and technical climbing skills. 

Your expertise includes:
- High-altitude physiology and acclimatization
- Technical climbing techniques (rock, ice, mixed)
- Expedition planning and logistics
- Training periodization for mountaineering
- Risk assessment and safety protocols
- Equipment selection and gear optimization
- Weather interpretation for climbing
- Nutrition and hydration strategies
- Mental preparation and mindset training

Provide detailed, practical, and safety-focused advice. Always emphasize proper training progression and risk management. Use specific examples when helpful.

${context ? `Additional context: ${context}` : ''}`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question }
  ]

  return generateChatCompletion(messages)
}

// Generate training insights
export async function generateTrainingInsights(
  activities: any[],
  goals: string[]
): Promise<string> {
  const activitySummary = activities.map(activity => 
    `${activity.type}: ${activity.distance}m, ${activity.total_elevation_gain}m elevation, ${activity.moving_time}s duration`
  ).join('\n')

  const prompt = `Based on these recent training activities and goals, provide personalized training insights and recommendations:

Recent Activities:
${activitySummary}

Training Goals:
${goals.join(', ')}

Please analyze the training pattern and provide:
1. Progress assessment
2. Areas for improvement
3. Specific recommendations for the next training cycle
4. Risk factors to monitor`

  return askTrainingQuestion(prompt)
}

// Analyze weather for climbing conditions
export async function analyzeClimbingConditions(
  weatherData: any,
  mountain: string
): Promise<string> {
  const prompt = `Analyze these weather conditions for climbing ${mountain}:

Current Conditions:
- Temperature: ${weatherData.current.temperature}°C
- Wind Speed: ${weatherData.current.wind_speed} m/s
- Visibility: ${weatherData.current.visibility} km
- Weather: ${weatherData.current.weather.description}

Provide:
1. Climbing condition assessment (excellent/good/fair/poor/dangerous)
2. Key risks and considerations
3. Recommended timing for ascent/descent
4. Safety recommendations
5. Alternative plans if conditions deteriorate`

  return askTrainingQuestion(prompt)
}