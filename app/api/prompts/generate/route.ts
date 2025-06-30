import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/database/client'
import { generateWithRetry, getModelForTask, sanitizeInput, createUsageMetrics, parseAIResponse } from '@/lib/ai/utils'
import { buildPrompt } from '@/lib/prompts/templates'
import type { PromptGenerationRequest, PromptGenerationResponse } from '@/lib/ai/types'


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
    if (user.tokenBalance < 10) { // Assume 10 tokens per prompt generation
      return NextResponse.json({ 
        error: 'Insufficient tokens',
        required: 10,
        available: user.tokenBalance
      }, { status: 402 })
    }

    // Parse and validate request body
    const body: PromptGenerationRequest = await request.json()
    const { idea, context, useCase, style, targetAudience } = body

    // Validate required fields
    if (!idea?.trim()) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    // Sanitize inputs and provide meaningful defaults
    const variables = {
      idea: sanitizeInput(idea),
      context: sanitizeInput(context || 'general professional communication'),
      useCase: sanitizeInput(useCase || 'professional content creation'),
      style: sanitizeInput(style || 'professional'),
      targetAudience: sanitizeInput(targetAudience || 'professionals')
    }

    // Build prompt from template
    const promptResult = buildPrompt('PROMPT_GENERATION', variables)
    if (!promptResult.success) {
      return NextResponse.json({ error: promptResult.error }, { status: 400 })
    }

    // Generate AI response
    const startTime = Date.now()
    const model = getModelForTask('PROMPT_GENERATION')
    
    const { content, tokensUsed } = await generateWithRetry(
      model,
      promptResult.prompt!,
      {
        temperature: 0.7,
        maxOutputTokens: 20000,
        topP: 0.8,
        topK: 40,
      }
    )

    const responseTime = Date.now() - startTime

    // Parse AI response as JSON (handle markdown code blocks and formatting issues)
    let aiResponse
    try {
      aiResponse = parseAIResponse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content)
      return NextResponse.json({ 
        error: 'AI response format error',
        details: 'The AI returned an invalid response format'
      }, { status: 500 })
    }

    // Validate AI response structure
    if (!aiResponse.title || !aiResponse.content) {
      return NextResponse.json({
        error: 'Invalid AI response structure',
        details: 'AI response missing required fields'
      }, { status: 500 })
    }

    // Create usage metrics
    const usageMetrics = createUsageMetrics(
      'prompt_generation',
      tokensUsed,
      model,
      responseTime,
      user.id
    )

    // Deduct tokens from user
    const tokensToDeduct = 10
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenBalance: user.tokenBalance - tokensToDeduct }
    })

    // Prepare response
    const response: PromptGenerationResponse = {
      success: true,
      data: {
        title: aiResponse.title,
        description: aiResponse.description || '',
        content: aiResponse.content,
        tags: aiResponse.tags || [],
        suggestions: aiResponse.suggestions || []
      },
      usage: usageMetrics
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Prompt generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}