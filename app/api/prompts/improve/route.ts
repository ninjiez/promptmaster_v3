import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/database/client'
import { generateWithRetry, getModelForTask, sanitizeInput, createUsageMetrics, parseAIResponse } from '@/lib/ai/utils'
import { buildPrompt } from '@/lib/prompts/templates'
import type { PromptImprovementRequest, PromptImprovementResponse } from '@/lib/ai/types'


export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authConfig)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough tokens
    const tokensRequired = 12
    if (user.tokenBalance < tokensRequired) {
      return NextResponse.json({ 
        error: 'Insufficient tokens',
        required: tokensRequired,
        available: user.tokenBalance
      }, { status: 402 })
    }

    // Parse and validate request body
    const body: PromptImprovementRequest = await request.json()
    const { 
      currentPrompt, 
      previousResult, 
      currentResult, 
      betterOrWorse, 
      userFeedback, 
      debugInfo 
    } = body

    // Validate required fields
    if (!currentPrompt?.trim()) {
      return NextResponse.json({ error: 'Current prompt is required' }, { status: 400 })
    }
    if (!previousResult?.trim()) {
      return NextResponse.json({ error: 'Previous result is required' }, { status: 400 })
    }
    if (!currentResult?.trim()) {
      return NextResponse.json({ error: 'Current result is required' }, { status: 400 })
    }
    if (!betterOrWorse?.trim()) {
      return NextResponse.json({ error: 'Better or worse evaluation is required' }, { status: 400 })
    }
    if (!userFeedback?.trim()) {
      return NextResponse.json({ error: 'User feedback is required' }, { status: 400 })
    }

    // Sanitize inputs
    const variables = {
      currentPrompt: sanitizeInput(currentPrompt),
      previousResult: sanitizeInput(previousResult),
      currentResult: sanitizeInput(currentResult),
      betterOrWorse: sanitizeInput(betterOrWorse),
      userFeedback: sanitizeInput(userFeedback),
      debugInfo: sanitizeInput(debugInfo || '')
    }

    // Build prompt from template
    const promptResult = buildPrompt('PROMPT_IMPROVEMENT', variables)
    if (!promptResult.success) {
      return NextResponse.json({ error: promptResult.error }, { status: 400 })
    }

    // Generate AI response
    const startTime = Date.now()
    const model = getModelForTask('PROMPT_IMPROVEMENT')
    
    const { content, tokensUsed } = await generateWithRetry(
      model,
      promptResult.prompt!,
      {
        temperature: 0.6,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40,
      }
    )

    const responseTime = Date.now() - startTime

    // Parse AI response as JSON (handle markdown code blocks and formatting issues)
    let improvementResult
    try {
      improvementResult = parseAIResponse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content)
      return NextResponse.json({ 
        error: 'AI response format error',
        details: 'The AI returned an invalid response format'
      }, { status: 500 })
    }

    // Validate AI response structure
    if (!improvementResult.improved_prompt) {
      return NextResponse.json({
        error: 'Invalid AI response structure',
        details: 'Missing improved prompt in response'
      }, { status: 500 })
    }

    // Create usage metrics
    const usageMetrics = createUsageMetrics(
      'prompt_improvement',
      tokensUsed,
      model,
      responseTime,
      user.id
    )

    // Deduct tokens from user
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenBalance: user.tokenBalance - tokensRequired }
    })

    // Prepare response
    const response: PromptImprovementResponse = {
      success: true,
      data: {
        improvedPrompt: improvementResult.improved_prompt,
        changesMade: improvementResult.changes_made || [],
        reasoning: improvementResult.reasoning || ''
      },
      usage: usageMetrics
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Prompt improvement error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}