import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/database/client'
import { generateWithRetry, getModelForTask, sanitizeInput, createUsageMetrics, parseAIResponse } from '@/lib/ai/utils'
import { buildPrompt } from '@/lib/prompts/templates'
import type { ExampleGenerationRequest, ExampleGenerationResponse } from '@/lib/ai/types'


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
    const tokensRequired = 8
    if (user.tokenBalance < tokensRequired) {
      return NextResponse.json({ 
        error: 'Insufficient tokens',
        required: tokensRequired,
        available: user.tokenBalance
      }, { status: 402 })
    }

    // Parse and validate request body
    const body: ExampleGenerationRequest = await request.json()
    const { userPrompt, useCaseContext, requirements, previousFailures } = body

    // Validate required fields
    if (!userPrompt?.trim()) {
      return NextResponse.json({ error: 'User prompt is required' }, { status: 400 })
    }
    if (!useCaseContext?.trim()) {
      return NextResponse.json({ error: 'Use case context is required' }, { status: 400 })
    }

    // Sanitize inputs
    const variables = {
      userPrompt: sanitizeInput(userPrompt),
      useCaseContext: sanitizeInput(useCaseContext),
      requirements: sanitizeInput(requirements || ''),
      previousFailures: sanitizeInput(previousFailures || '')
    }

    // Build prompt from template
    const promptResult = buildPrompt('EXAMPLE_GENERATION', variables)
    if (!promptResult.success) {
      return NextResponse.json({ error: promptResult.error }, { status: 400 })
    }

    // Generate AI response
    const startTime = Date.now()
    const model = getModelForTask('EXAMPLE_GENERATION')
    
    const { content, tokensUsed } = await generateWithRetry(
      model,
      promptResult.prompt!,
      {
        temperature: 0.9,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 50,
      }
    )

    const responseTime = Date.now() - startTime

    // Parse AI response as JSON (handle markdown code blocks and formatting issues)
    let examples
    try {
      examples = parseAIResponse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content)
      return NextResponse.json({ 
        error: 'AI response format error',
        details: 'The AI returned an invalid response format'
      }, { status: 500 })
    }

    // Validate AI response structure
    if (!Array.isArray(examples)) {
      return NextResponse.json({
        error: 'Invalid AI response structure',
        details: 'Expected array of examples'
      }, { status: 500 })
    }

    // Create usage metrics
    const usageMetrics = createUsageMetrics(
      'example_generation',
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
    const response: ExampleGenerationResponse = {
      success: true,
      data: {
        examples: examples.filter(ex => ex.input && ex.type) // Basic validation
      },
      usage: usageMetrics
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Example generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}