import { getTemplate, validateTemplateVariables } from './templates'
import type { 
  IdeaToPromptRequest,
  QuestionGenerationRequest,
  ExampleGenerationRequest,
  FeedbackAnalysisRequest,
  TemplateVariables,
  GeneratedQuestion,
  GeneratedExample
} from './types'

/**
 * Replaces template variables with actual values
 */
export function replaceTemplateVariables(template: string, variables: TemplateVariables): string {
  let result = template

  // Replace all variables in the format {VARIABLE_NAME}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(regex, value || '')
  })

  // Clean up any remaining unreplaced variables
  result = result.replace(/\{[^}]+\}/g, '')

  return result.trim()
}

/**
 * Generates a prompt from an idea using the idea-to-prompt template
 */
export function generateIdeaToPrompt(request: IdeaToPromptRequest): string {
  const template = getTemplate('IDEA_TO_PROMPT')
  if (!template) {
    throw new Error('Idea to prompt template not found')
  }

  const variables: TemplateVariables = {
    USER_DESCRIPTION: request.userIdea,
    USE_CASE: request.useCase || 'General purpose assistant',
    MODEL: request.targetModel || 'Any compatible LLM',
    CONSTRAINTS: request.constraints || 'None specified',
  }

  const validation = validateTemplateVariables('IDEA_TO_PROMPT', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Generates optimization questions for a prompt
 */
export function generateOptimizationQuestions(request: QuestionGenerationRequest): string {
  const template = getTemplate('QUESTION_GENERATION')
  if (!template) {
    throw new Error('Question generation template not found')
  }

  const variables: TemplateVariables = {
    CURRENT_PROMPT: request.currentPrompt,
    CONTEXT_ANSWERS: request.contextAnswers || 'No additional context provided',
    RECENT_RESULTS: request.recentResults || 'No recent test results available',
  }

  const validation = validateTemplateVariables('QUESTION_GENERATION', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Generates test examples for a prompt
 */
export function generateExamples(request: ExampleGenerationRequest): string {
  const template = getTemplate('EXAMPLE_GENERATION')
  if (!template) {
    throw new Error('Example generation template not found')
  }

  const variables: TemplateVariables = {
    USER_PROMPT: request.userPrompt,
    USE_CASE_CONTEXT: request.useCaseContext,
    REQUIREMENTS: request.requirements || 'No specific requirements provided',
    PREVIOUS_FAILURES: request.previousFailures || 'No known failures',
  }

  const validation = validateTemplateVariables('EXAMPLE_GENERATION', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Analyzes feedback and generates an improved prompt
 */
export function generateFeedbackAnalysis(request: FeedbackAnalysisRequest): string {
  const template = getTemplate('FEEDBACK_ANALYSIS')
  if (!template) {
    throw new Error('Feedback analysis template not found')
  }

  const variables: TemplateVariables = {
    CURRENT_PROMPT: request.currentPrompt,
    PREVIOUS_RESULT: request.previousResult,
    CURRENT_RESULT: request.currentResult,
    BETTER_OR_WORSE: request.betterOrWorse,
    USER_FEEDBACK: request.userFeedback,
    DEBUG_INFO: request.debugInfo || 'No debug information available',
  }

  const validation = validateTemplateVariables('FEEDBACK_ANALYSIS', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Generates a test prompt for execution
 */
export function generateTestPrompt(promptToTest: string, testInput: string): string {
  const template = getTemplate('TEST_PROMPT')
  if (!template) {
    throw new Error('Test prompt template not found')
  }

  const variables: TemplateVariables = {
    PROMPT_TO_TEST: promptToTest,
    TEST_INPUT: testInput,
  }

  const validation = validateTemplateVariables('TEST_PROMPT', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Analyzes a prompt for quality and improvement opportunities
 */
export function generatePromptAnalysis(promptToAnalyze: string, useCase?: string): string {
  const template = getTemplate('PROMPT_ANALYSIS')
  if (!template) {
    throw new Error('Prompt analysis template not found')
  }

  const variables: TemplateVariables = {
    USER_PROMPT: promptToAnalyze,
    USE_CASE: useCase || 'General purpose',
  }

  const validation = validateTemplateVariables('PROMPT_ANALYSIS', variables)
  if (!validation.isValid) {
    throw new Error(`Missing required variables: ${validation.missingVariables.join(', ')}`)
  }

  return replaceTemplateVariables(template.template, variables)
}

/**
 * Utility function to parse JSON responses safely
 */
export function parseJsonResponse<T>(response: string): T {
  try {
    // Try to extract JSON from response if it's wrapped in text
    const jsonMatch = response.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
    const jsonString = jsonMatch ? jsonMatch[0] : response
    return JSON.parse(jsonString)
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`)
  }
}

/**
 * Validates generated questions format
 */
export function validateQuestionsFormat(questions: any[]): questions is GeneratedQuestion[] {
  return questions.every(q => 
    typeof q.id === 'string' &&
    typeof q.priority === 'string' &&
    typeof q.question === 'string' &&
    typeof q.why_this_matters === 'string' &&
    typeof q.category === 'string'
  )
}

/**
 * Validates generated examples format
 */
export function validateExamplesFormat(examples: any[]): examples is GeneratedExample[] {
  return examples.every(e => 
    typeof e.id === 'number' &&
    typeof e.type === 'string' &&
    typeof e.input === 'string' &&
    typeof e.why_valuable === 'string' &&
    typeof e.tests_for === 'string'
  )
}