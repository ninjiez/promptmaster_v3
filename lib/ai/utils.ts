import { googleAI, AI_MODELS, AIModelType } from './client'
import { AIGenerationConfig, AIUsageMetrics } from './types'

// Default generation configuration
export const DEFAULT_GENERATION_CONFIG: AIGenerationConfig = {
  temperature: 0.7,
  maxOutputTokens: 20000,
  topP: 0.8,
  topK: 40,
}

// Token cost estimation (approximate costs per 1000 tokens)
export const TOKEN_COSTS = {
  'gemini-2.5-flash': 0.0007,    // $0.0007 per 1000 tokens
  'gemini-2.0-flash-exp': 0.0015, // $0.0015 per 1000 tokens
  'gemini-1.5-pro': 0.0035,      // $0.0035 per 1000 tokens
  'gemini-1.5-flash': 0.0007,    // $0.0007 per 1000 tokens
} as const

// Get AI model for specific task type
export function getModelForTask(taskType: AIModelType): string {
  return AI_MODELS[taskType]
}

// Generate content with retry logic
export async function generateWithRetry(
  modelName: string,
  prompt: string,
  config: AIGenerationConfig = DEFAULT_GENERATION_CONFIG,
  maxRetries: number = 3
): Promise<{ content: string; tokensUsed: number }> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await googleAI.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          topP: config.topP,
          topK: config.topK,
        }
      })
      
      if (!result.text) {
        throw new Error('Empty response from AI model')
      }

      // Estimate tokens used (rough approximation)
      const tokensUsed = estimateTokens(prompt + result.text)

      return {
        content: result.text,
        tokensUsed,
      }
    } catch (error) {
      lastError = error as Error
      console.error(`AI generation attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  
  throw new Error(`AI generation failed after ${maxRetries} attempts: ${lastError?.message}`)
}

// Estimate token count (rough approximation: ~4 characters per token)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Calculate cost based on tokens used
export function calculateCost(tokensUsed: number, modelName: string): number {
  const costPerThousand = TOKEN_COSTS[modelName as keyof typeof TOKEN_COSTS] || 0.002
  return (tokensUsed / 1000) * costPerThousand
}

// Validate AI request input
export function validateInput(input: string, maxLength: number = 10000): void {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string')
  }
  
  if (input.length > maxLength) {
    throw new Error(`Input too long. Maximum ${maxLength} characters allowed`)
  }
  
  if (input.trim().length === 0) {
    throw new Error('Input cannot be empty or whitespace only')
  }
}

// Create usage metrics
export function createUsageMetrics(
  operation: string,
  tokensUsed: number,
  model: string,
  responseTime: number,
  userId: string
): AIUsageMetrics {
  return {
    tokensUsed,
    model,
    responseTime,
    operation,
    userId,
    cost: calculateCost(tokensUsed, model),
  }
}

// Sanitize user input for AI prompts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 10000) // Hard limit
}

// Parse potentially malformed JSON from AI responses
export function parseAIResponse(content: string): any {
  // Extract JSON from markdown code blocks if present
  let jsonContent = content.trim()
  
  // Check if response is wrapped in markdown code blocks
  const jsonBlockMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (jsonBlockMatch) {
    jsonContent = jsonBlockMatch[1].trim()
  }
  
  // Clean up common JSON formatting issues
  // Fix line breaks within strings
  jsonContent = jsonContent.replace(/"\s*\n\s*,/g, '",')
  
  // Fix trailing commas before closing braces/brackets
  jsonContent = jsonContent.replace(/,\s*(\]|\})/g, '$1')
  
  // First attempt: try to parse the cleaned JSON
  try {
    return JSON.parse(jsonContent)
  } catch (parseError) {
    // Second attempt: extract JSON object manually
    const jsonStart = content.indexOf('{')
    const jsonEnd = content.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      let extractedJson = content.substring(jsonStart, jsonEnd + 1)
      
      // Clean up the content
      extractedJson = extractedJson.replace(/"\s*\n\s*,/g, '",')
      extractedJson = extractedJson.replace(/,\s*(\]|\})/g, '$1')
      
      return JSON.parse(extractedJson)
    }
    
    throw new Error('Could not find valid JSON structure in AI response')
  }
}