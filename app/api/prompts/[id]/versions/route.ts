import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/database/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const promptId = params.id

    // Check if prompt exists and belongs to user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: user.id,
        deletedAt: null
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Get all versions for this prompt
    const versions = await prisma.promptVersion.findMany({
      where: { promptId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        examples: {
          where: { isApproved: true },
          orderBy: { order: 'asc' }
        },
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { version: 'desc' }
    })

    return NextResponse.json({
      promptId,
      versions: versions.map(version => ({
        id: version.id,
        version: version.version,
        systemPrompt: version.systemPrompt,
        userPrompt: version.userPrompt,
        content: version.content,
        isActive: version.isActive,
        tokensUsed: version.tokensUsed,
        createdAt: version.createdAt,
        generationParams: version.generationParams,
        metadata: version.metadata,
        questions: version.questions,
        examples: version.examples,
        testResults: version.testResults.map(result => ({
          id: result.id,
          input: result.input,
          expectedOutput: result.expectedOutput,
          actualOutput: result.actualOutput,
          score: result.score,
          feedback: result.feedback,
          createdAt: result.createdAt
        }))
      }))
    })

  } catch (error) {
    console.error('Get prompt versions error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const promptId = params.id

    // Check if prompt exists and belongs to user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: user.id,
        deletedAt: null
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { 
      systemPrompt, 
      userPrompt, 
      content, 
      tokensUsed, 
      generationParams, 
      metadata,
      parentVersionId 
    } = body

    // Validate required fields
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Get the next version number
    const latestVersion = await prisma.promptVersion.findFirst({
      where: { promptId },
      orderBy: { version: 'desc' }
    })

    const nextVersion = (latestVersion?.version || 0) + 1

    // Create new version in a transaction
    const newVersion = await prisma.$transaction(async (tx) => {
      // Set all current versions as inactive
      await tx.promptVersion.updateMany({
        where: { promptId, isActive: true },
        data: { isActive: false }
      })

      // Create the new version
      const version = await tx.promptVersion.create({
        data: {
          promptId,
          version: nextVersion,
          systemPrompt: systemPrompt || '',
          userPrompt: userPrompt || content,
          content: content.trim(),
          isActive: true,
          tokensUsed: tokensUsed || 0,
          generationParams: generationParams || {},
          metadata: metadata || {},
          parentVersionId: parentVersionId || latestVersion?.id
        },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          },
          examples: {
            where: { isApproved: true },
            orderBy: { order: 'asc' }
          }
        }
      })

      // Update prompt's total token usage and timestamp
      await tx.prompt.update({
        where: { id: promptId },
        data: {
          tokensUsed: { increment: tokensUsed || 0 },
          updatedAt: new Date()
        }
      })

      return version
    })

    return NextResponse.json({
      id: newVersion.id,
      version: newVersion.version,
      systemPrompt: newVersion.systemPrompt,
      userPrompt: newVersion.userPrompt,
      content: newVersion.content,
      isActive: newVersion.isActive,
      tokensUsed: newVersion.tokensUsed,
      createdAt: newVersion.createdAt,
      generationParams: newVersion.generationParams,
      metadata: newVersion.metadata,
      questions: newVersion.questions,
      examples: newVersion.examples
    })

  } catch (error) {
    console.error('Create prompt version error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}