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

    // Get prompt with all versions
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: user.id
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        versions: {
          orderBy: { version: 'desc' },
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
          }
        },
        tests: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      isPublic: prompt.isPublic,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      user: prompt.user,
      versions: prompt.versions.map(version => ({
        id: version.id,
        version: version.version,
        systemPrompt: version.systemPrompt,
        userPrompt: version.userPrompt,
        content: version.content,
        isActive: version.isActive,
        tokensUsed: version.tokensCost,
        createdAt: version.createdAt,
        generationParams: version.generationParams,
        metadata: version.metadata,
        questions: version.questions,
        examples: version.examples,
        testResults: version.testResults
      })),
      tests: prompt.tests,
      feedback: prompt.feedback,
      stats: {
        versionCount: prompt.versions.length,
        testCount: prompt.tests.length,
        feedbackCount: prompt.feedback.length,
        totalTokensUsed: prompt.versions.reduce((sum, v) => sum + v.tokensCost, 0)
      }
    })

  } catch (error) {
    console.error('Get prompt error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
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
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: user.id,
        deletedAt: null
      }
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { title, description, category, isPublic } = body

    // Validate required fields
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    }

    // Update prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || '' }),
        ...(category !== undefined && { category }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
        updatedAt: new Date()
      },
      include: {
        versions: {
          where: { isActive: true },
          take: 1,
          orderBy: { version: 'desc' }
        },
        _count: {
          select: {
            versions: true,
            tests: true,
            feedback: true
          }
        }
      }
    })

    return NextResponse.json({
      id: updatedPrompt.id,
      title: updatedPrompt.title,
      description: updatedPrompt.description,
      category: updatedPrompt.category,
      isPublic: updatedPrompt.isPublic,
      createdAt: updatedPrompt.createdAt,
      updatedAt: updatedPrompt.updatedAt,
      versionCount: updatedPrompt._count.versions,
      testCount: updatedPrompt._count.tests,
      feedbackCount: updatedPrompt._count.feedback,
      latestVersion: updatedPrompt.versions[0] || null
    })

  } catch (error) {
    console.error('Update prompt error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
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
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: user.id,
        deletedAt: null
      }
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Soft delete the prompt
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully'
    })

  } catch (error) {
    console.error('Delete prompt error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}