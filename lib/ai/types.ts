// AI Request/Response Types
export interface AIGenerationConfig {
  temperature?: number
  maxOutputTokens?: number
  topP?: number
  topK?: number
}

export interface PromptGenerationRequest {
  idea: string
  context?: string
  useCase?: string
  style?: 'formal' | 'casual' | 'technical' | 'creative'
  targetAudience?: string
}

export interface PromptGenerationResponse {
  success: boolean
  data: {
    id?: string // Prompt ID when saved to database
    title: string
    description: string
    content: string
    tags: string[]
    suggestions: string[]
  }
  usage: AIUsageMetrics
}

export interface QuestionGenerationRequest {
  promptId: string
  currentPrompt: string
  improvementGoals?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface QuestionGenerationResponse {
  questions: Array<{
    id: string
    question: string
    category: 'clarity' | 'specificity' | 'context' | 'examples' | 'constraints'
    importance: 'high' | 'medium' | 'low'
    expectedAnswerType: 'text' | 'selection' | 'number' | 'boolean'
    options?: string[]
  }>
  estimatedTokens: number
}

export interface ExampleGenerationRequest {
  promptId: string
  prompt: string
  exampleType: 'input_output' | 'use_case' | 'variation'
  count: number
  domain?: string
}

export interface ExampleGenerationResponse {
  examples: Array<{
    id: string
    title: string
    input: string
    expectedOutput: string
    explanation?: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }>
  estimatedTokens: number
}

export interface PromptImprovementRequest {
  promptId: string
  currentPrompt: string
  feedback: Array<{
    questionId: string
    answer: string
  }>
  userGoals?: string[]
  previousVersions?: string[]
}

export interface PromptImprovementResponse {
  improvedPrompt: string
  changelog: Array<{
    change: string
    reason: string
    impact: 'high' | 'medium' | 'low'
  }>
  version: number
  improvements: {
    clarity: number
    specificity: number
    effectiveness: number
  }
  estimatedTokens: number
}

export interface AIUsageMetrics {
  tokensUsed: number
  model: string
  responseTime: number
  operation: string
  userId: string
  cost?: number
}