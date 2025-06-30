// Prompt templates for AI-powered operations
export interface PromptTemplate {
  id: string
  name: string
  description: string
  template: string
  requiredVariables: string[]
  optionalVariables: string[]
  category: 'generation' | 'analysis' | 'improvement' | 'utility'
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  PROMPT_GENERATION: {
    id: 'prompt_generation',
    name: 'AI Prompt Generator',
    description: 'Transforms user ideas into high-quality, effective prompts',
    template: `You are PromptGOD, an expert AI prompt engineer. Your task is to transform a user's idea into a high-quality, effective prompt for AI models.

## User Input:
**Idea:** {idea}
**Context:** {context}
**Use Case:** {useCase}
**Style:** {style}
**Target Audience:** {targetAudience}

## Your Task:
Generate a comprehensive prompt that:
1. Is clear and specific
2. Provides necessary context
3. Includes examples when helpful
4. Specifies the desired output format
5. Considers the target audience and use case

## Output Format:
You MUST respond with a valid JSON object. The response should be ONLY the JSON object, without any markdown formatting, code blocks, or additional text.

**CRITICAL: Ensure proper JSON formatting:**
- Use double quotes for all strings
- No trailing commas
- No line breaks within string values (use \n for line breaks if needed)
- Escape special characters properly

**Expected JSON Structure:**
{
  "title": "A descriptive title for the prompt (max 60 characters)",
  "description": "A brief description of what this prompt does (max 200 characters)",
  "content": "The actual prompt content (well-structured and detailed)",
  "tags": ["tag1", "tag2", "tag3"],
  "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
}

## Guidelines:
- Make the prompt actionable and specific
- Include relevant constraints and requirements
- Consider edge cases and potential ambiguities
- Use clear, professional language
- Optimize for the specified style and audience

Generate the JSON response now:`,
    requiredVariables: ['idea', 'context', 'useCase', 'style', 'targetAudience'],
    optionalVariables: [],
    category: 'generation',
  },

  QUESTION_GENERATION: {
    id: 'question_generation',
    name: 'Optimization Questions Generator',
    description: 'Generates questions to improve prompt quality',
    template: `You are a prompt optimization specialist. Analyze the provided prompt and generate 3-5 strategic questions that will help improve its effectiveness.

Current Prompt: {currentPrompt}
Context: {contextAnswers}
Recent Results: {recentResults}

Focus on:
- Identifying ambiguities
- Finding missing constraints
- Suggesting improvements
- Addressing potential failure modes

**CRITICAL: Return ONLY a valid JSON array. No markdown, no code blocks, no additional text.**

**Expected JSON Structure:**
[
  {
    "id": "q1",
    "priority": "High",
    "question": "Your question here",
    "why_this_matters": "Explanation of why this question is important",
    "category": "Clarity"
  },
  {
    "id": "q2",
    "priority": "Medium",
    "question": "Another question",
    "why_this_matters": "Why this matters",
    "category": "Constraints"
  }
]

**Valid values:**
- priority: "High", "Medium", or "Low"
- category: "Clarity", "Constraints", "Output Format", "Edge Cases", "Context", "Requirements"

Generate the JSON array now:`,
    requiredVariables: ['currentPrompt'],
    optionalVariables: ['contextAnswers', 'recentResults'],
    category: 'analysis',
  },

  EXAMPLE_GENERATION: {
    id: 'example_generation',
    name: 'Example Creator',
    description: 'Creates test examples for prompt validation',
    template: `You are an expert at creating test cases for prompts. Generate 5-7 diverse examples to test and validate the given prompt.

Target Prompt: {userPrompt}
Use Case: {useCaseContext}
Requirements: {requirements}
Known Failures: {previousFailures}

Create examples covering:
- Ideal cases (perfect scenarios)
- Common cases (typical usage)
- Edge cases (boundary conditions)
- Complex cases (multi-step requirements)
- Error cases (potential failures)

**CRITICAL: Return ONLY a valid JSON array. No markdown, no code blocks, no additional text.**

**Expected JSON Structure:**
[
  {
    "id": 1,
    "type": "ideal",
    "input": "Example input text",
    "expected_output": "Expected response",
    "why_valuable": "Why this example is useful",
    "tests_for": "What this example validates"
  },
  {
    "id": 2,
    "type": "edge",
    "input": "Another example",
    "expected_output": "Expected output",
    "why_valuable": "Value explanation",
    "tests_for": "What it tests"
  }
]

**Valid type values:** "ideal", "common", "edge", "complex", "error"

Generate the JSON array now:`,
    requiredVariables: ['userPrompt', 'useCaseContext'],
    optionalVariables: ['requirements', 'previousFailures'],
    category: 'generation',
  },

  PROMPT_IMPROVEMENT: {
    id: 'prompt_improvement',
    name: 'Prompt Improver',
    description: 'Analyzes feedback and generates improved prompt versions',
    template: `You are a prompt refinement specialist. Analyze the user feedback and generate an improved version of the prompt.

Current Prompt: {currentPrompt}
Previous Result: {previousResult}
Current Result: {currentResult}
User Evaluation: {betterOrWorse}
User Feedback: {userFeedback}
Debug Info: {debugInfo}

Based on the feedback, create an improved version that:
1. Addresses the specific issues mentioned
2. Maintains the prompt's core purpose
3. Adds clarity where needed
4. Improves structure and instructions

**CRITICAL: Return ONLY a valid JSON object. No markdown, no code blocks, no additional text.**

**Expected JSON Structure:**
{
  "improved_prompt": "The improved version of the prompt",
  "changes_made": [
    "First specific change made",
    "Second specific change made"
  ],
  "reasoning": "Why these changes will improve the prompt"
}

**Important:**
- The "improved_prompt" field should contain the complete improved prompt
- The "changes_made" array should list specific modifications
- The "reasoning" should explain the rationale behind the changes

Generate the JSON response now:`,
    requiredVariables: ['currentPrompt', 'previousResult', 'currentResult', 'betterOrWorse', 'userFeedback'],
    optionalVariables: ['debugInfo'],
    category: 'improvement',
  },
}

// Helper function to get all templates by category
export function getTemplatesByCategory(category: PromptTemplate['category']): PromptTemplate[] {
  return Object.values(PROMPT_TEMPLATES).filter(template => template.category === category)
}

// Helper function to get template by ID
export function getTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES[id]
}

// Helper function to validate required variables
export function validateTemplateVariables(templateId: string, variables: Record<string, string>): {
  isValid: boolean
  missingVariables: string[]
} {
  const template = getTemplate(templateId)
  if (!template) {
    return { isValid: false, missingVariables: ['Invalid template ID'] }
  }

  const missingVariables = template.requiredVariables.filter(
    variable => !variables[variable] || variables[variable].trim() === ''
  )

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
  }
}

// Helper function to substitute variables in template
export function substituteVariables(template: string, variables: Record<string, string>): string {
  let result = template
  
  // Replace all {variableName} patterns with actual values
  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(pattern, value || '')
  })
  
  return result
}

// Helper function to build complete prompt from template
export function buildPrompt(templateId: string, variables: Record<string, string>): {
  success: boolean
  prompt?: string
  error?: string
} {
  const template = getTemplate(templateId)
  if (!template) {
    return { success: false, error: 'Template not found' }
  }

  const validation = validateTemplateVariables(templateId, variables)
  if (!validation.isValid) {
    return { 
      success: false, 
      error: `Missing required variables: ${validation.missingVariables.join(', ')}` 
    }
  }

  const prompt = substituteVariables(template.template, variables)
  return { success: true, prompt }
}

// Get all available template IDs
export function getTemplateIds(): string[] {
  return Object.keys(PROMPT_TEMPLATES)
}