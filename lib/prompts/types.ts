// Prompt generation interfaces
export interface IdeaToPromptRequest {
  userIdea: string
  useCase?: string
  targetModel?: string
  constraints?: string
}

export interface QuestionGenerationRequest {
  currentPrompt: string
  contextAnswers?: string
  recentResults?: string
}

export interface ExampleGenerationRequest {
  userPrompt: string
  useCaseContext: string
  requirements?: string
  previousFailures?: string
}

export interface FeedbackAnalysisRequest {
  currentPrompt: string
  previousResult: string
  currentResult: string
  userFeedback: string
  betterOrWorse: 'better' | 'worse'
  debugInfo?: string
}

// Response interfaces
export interface GeneratedQuestion {
  id: string
  priority: 'High' | 'Medium' | 'Low'
  question: string
  why_this_matters: string
  category: string
}

export interface GeneratedExample {
  id: number
  type: string
  input: string
  expected_output?: string
  reasoning_process?: string
  why_valuable: string
  tests_for: string
}

// Template replacement interface
export interface TemplateVariables {
  [key: string]: string | undefined
}

// Prompt template metadata
export interface PromptTemplate {
  id: string
  name: string
  description: string
  template: string
  requiredVariables: string[]
  optionalVariables: string[]
  category: 'generation' | 'analysis' | 'improvement' | 'utility'
}