import type { PromptTemplate } from './types'

// Placeholder prompts - these will be replaced with the advanced prompts from PRD later
export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  IDEA_TO_PROMPT: {
    id: 'idea_to_prompt',
    name: 'Idea to Prompt Generator',
    description: 'Converts abstract ideas into structured prompts',
    template: `You are a prompt engineering expert. Convert the following idea into a well-structured prompt.

Idea: {USER_DESCRIPTION}
Use Case: {USE_CASE}
Target Model: {MODEL}
Constraints: {CONSTRAINTS}

Create a clear, actionable prompt that achieves the user's goal. Structure your response with:
1. A clear role definition
2. Specific task instructions  
3. Output format requirements
4. Any necessary constraints

Generate only the final prompt, ready for use.`,
    requiredVariables: ['USER_DESCRIPTION'],
    optionalVariables: ['USE_CASE', 'MODEL', 'CONSTRAINTS'],
    category: 'generation',
  },

  QUESTION_GENERATION: {
    id: 'question_generation',
    name: 'Optimization Questions Generator',
    description: 'Generates questions to improve prompt quality',
    template: `You are a prompt optimization specialist. Analyze the provided prompt and generate 3-5 strategic questions that will help improve its effectiveness.

Current Prompt: {CURRENT_PROMPT}
Context: {CONTEXT_ANSWERS}
Recent Results: {RECENT_RESULTS}

Focus on:
- Identifying ambiguities
- Finding missing constraints
- Suggesting improvements
- Addressing potential failure modes

Return your response as a JSON array of question objects:
[
  {
    "id": "q1",
    "priority": "High|Medium|Low",
    "question": "Your question here",
    "why_this_matters": "Explanation of why this question is important",
    "category": "Clarity|Constraints|Output Format|Edge Cases|etc"
  }
]`,
    requiredVariables: ['CURRENT_PROMPT'],
    optionalVariables: ['CONTEXT_ANSWERS', 'RECENT_RESULTS'],
    category: 'analysis',
  },

  EXAMPLE_GENERATION: {
    id: 'example_generation',
    name: 'Example Creator',
    description: 'Creates test examples for prompt validation',
    template: `You are an expert at creating test cases for prompts. Generate 5-7 diverse examples to test and validate the given prompt.

Target Prompt: {USER_PROMPT}
Use Case: {USE_CASE_CONTEXT}
Requirements: {REQUIREMENTS}
Known Failures: {PREVIOUS_FAILURES}

Create examples covering:
- Ideal cases (perfect scenarios)
- Common cases (typical usage)
- Edge cases (boundary conditions)
- Complex cases (multi-step requirements)
- Error cases (potential failures)

Return as JSON array:
[
  {
    "id": 1,
    "type": "ideal|common|edge|complex|error",
    "input": "Example input text",
    "expected_output": "Expected response",
    "why_valuable": "Why this example is useful",
    "tests_for": "What this example validates"
  }
]`,
    requiredVariables: ['USER_PROMPT', 'USE_CASE_CONTEXT'],
    optionalVariables: ['REQUIREMENTS', 'PREVIOUS_FAILURES'],
    category: 'generation',
  },

  FEEDBACK_ANALYSIS: {
    id: 'feedback_analysis',
    name: 'Feedback Analyzer and Prompt Improver',
    description: 'Analyzes feedback and generates improved prompt versions',
    template: `You are a prompt refinement specialist. Analyze the user feedback and generate an improved version of the prompt.

Current Prompt: {CURRENT_PROMPT}
Previous Result: {PREVIOUS_RESULT}
Current Result: {CURRENT_RESULT}
User Evaluation: {BETTER_OR_WORSE}
User Feedback: {USER_FEEDBACK}
Debug Info: {DEBUG_INFO}

Based on the feedback, create an improved version that:
1. Addresses the specific issues mentioned
2. Maintains the prompt's core purpose
3. Adds clarity where needed
4. Improves structure and instructions

Return only the improved prompt without explanations.`,
    requiredVariables: ['CURRENT_PROMPT', 'PREVIOUS_RESULT', 'CURRENT_RESULT', 'BETTER_OR_WORSE', 'USER_FEEDBACK'],
    optionalVariables: ['DEBUG_INFO'],
    category: 'improvement',
  },

  PROMPT_ANALYSIS: {
    id: 'prompt_analysis',
    name: 'Prompt Quality Analyzer',
    description: 'Analyzes prompt quality and identifies improvement areas',
    template: `You are a prompt quality analyst. Evaluate the provided prompt and identify areas for improvement.

Prompt to Analyze: {USER_PROMPT}
Intended Use: {USE_CASE}

Analyze the prompt for:
1. Clarity and specificity
2. Completeness of instructions
3. Potential ambiguities
4. Missing constraints
5. Output format clarity

Return analysis as JSON:
{
  "strengths": ["List of what works well"],
  "improvement_areas": [
    {
      "area": "clarity|completeness|structure|specificity|flexibility|efficiency",
      "issue": "Specific problem identified",
      "suggestion": "How to improve this area"
    }
  ],
  "overall_score": "1-10 rating",
  "priority_fixes": ["Most important issues to address"]
}`,
    requiredVariables: ['USER_PROMPT'],
    optionalVariables: ['USE_CASE'],
    category: 'analysis',
  },

  TEST_PROMPT: {
    id: 'test_prompt',
    name: 'Prompt Tester',
    description: 'Tests a prompt with given input and evaluates output',
    template: `{PROMPT_TO_TEST}

Input: {TEST_INPUT}`,
    requiredVariables: ['PROMPT_TO_TEST', 'TEST_INPUT'],
    optionalVariables: [],
    category: 'utility',
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