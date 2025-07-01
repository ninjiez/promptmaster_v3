import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/database/client'

export async function GET(request: NextRequest) {
  console.log('🔍 API /prompts - GET request received')
  try {
    // Check authentication
    const session = await getServerSession(authConfig)
    console.log('🔍 API /prompts - Session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      timestamp: new Date().toISOString()
    })
    
    if (!session?.user?.email) {
      console.log('❌ API /prompts - No session, returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    console.log('🔍 API /prompts - Looking up user by email:', session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('❌ API /prompts - User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('✅ API /prompts - User found:', { id: user.id, email: user.email })

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'
    
    console.log('🔍 API /prompts - Query params:', { page, limit, search, category, sortBy, sortOrder })

    // Build where clause
    const where: any = {
      userId: user.id,
      deletedAt: null, // Only non-deleted prompts
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    if (category) {
      where.category = category
    }

    // Get total count for pagination
    console.log('🔍 API /prompts - Counting prompts with where clause:', where)
    const totalCount = await prisma.prompt.count({ where })
    console.log('🔍 API /prompts - Total count found:', totalCount)

    // Get prompts with pagination
    console.log('🔍 API /prompts - Fetching prompts...')
    const prompts = await prisma.prompt.findMany({
      where,
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
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      prompts: prompts.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        isPublic: prompt.isPublic,
        tokensUsed: prompt.tokensUsed,
        createdAt: prompt.createdAt,
        updatedAt: prompt.updatedAt,
        versionCount: prompt._count.versions,
        testCount: prompt._count.tests,
        feedbackCount: prompt._count.feedback,
        latestVersion: prompt.versions[0] || null
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })

  } catch (error) {
    console.error('Get prompts error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

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

    // Parse request body
    const body = await request.json()
    const { title, description, category, tags, isPublic } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Create prompt
    const prompt = await prisma.prompt.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || '',
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        isPublic: Boolean(isPublic),
        tokensUsed: 0
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
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      category: prompt.category,
      tags: prompt.tags,
      isPublic: prompt.isPublic,
      tokensUsed: prompt.tokensUsed,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
      versionCount: prompt._count.versions,
      testCount: prompt._count.tests,
      feedbackCount: prompt._count.feedback,
      latestVersion: prompt.versions[0] || null
    })

  } catch (error) {
    console.error('Create prompt error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}