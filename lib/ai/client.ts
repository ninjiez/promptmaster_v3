import { GoogleGenAI } from '@google/genai'

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined in environment variables')
}

// Initialize GoogleGenAI client
export const googleAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

// AI Model configuration from environment variables
export const AI_MODELS = {
  PROMPT_GENERATION: process.env.AI_MODEL_PROMPT_GENERATION || 'gemini-2.5-flash',
  QUESTION_GENERATION: process.env.AI_MODEL_QUESTION_GENERATION || 'gemini-2.5-flash',
  EXAMPLE_GENERATION: process.env.AI_MODEL_EXAMPLE_GENERATION || 'gemini-2.5-flash',
  PROMPT_IMPROVEMENT: process.env.AI_MODEL_PROMPT_IMPROVEMENT || 'gemini-2.5-flash',
} as const

export type AIModelType = keyof typeof AI_MODELS