import { prisma } from './client'
import type { 
  TokenDeduction, 
  TokenAddition, 
  UserWithTokens,
  TransactionType 
} from './types'

// User utilities
export async function getUserById(id: string): Promise<UserWithTokens | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      tokenTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10, // Last 10 transactions
      },
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })
}

export async function getUserByEmail(email: string): Promise<UserWithTokens | null> {
  return prisma.user.findUnique({
    where: { email },
    include: {
      tokenTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })
}

export async function createUser(data: {
  email: string
  name?: string
  image?: string
  stripeCustomerId?: string
}) {
  const signupBonus = parseInt(process.env.SIGNUP_BONUS_TOKENS || '1500')
  
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        ...data,
        tokenBalance: signupBonus,
      },
    })

    // Create signup bonus transaction
    await tx.tokenTransaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: signupBonus,
        description: 'Welcome bonus',
        balanceBefore: 0,
        balanceAfter: signupBonus,
      },
    })

    return user
  })
}

// Token utilities
export async function deductTokens({ 
  userId, 
  amount, 
  description, 
  reference 
}: TokenDeduction): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    
    if (!user || user.tokenBalance < amount) {
      throw new Error('Insufficient token balance')
    }

    const newBalance = user.tokenBalance - amount

    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: newBalance },
    })

    await tx.tokenTransaction.create({
      data: {
        userId,
        type: 'USAGE',
        amount: -amount,
        description,
        reference,
        balanceBefore: user.tokenBalance,
        balanceAfter: newBalance,
      },
    })

    return true
  })
}

export async function addTokens({
  userId,
  amount,
  type,
  description,
  reference,
}: TokenAddition): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    
    if (!user) {
      throw new Error('User not found')
    }

    const newBalance = user.tokenBalance + amount

    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: newBalance },
    })

    await tx.tokenTransaction.create({
      data: {
        userId,
        type,
        amount,
        description,
        reference,
        balanceBefore: user.tokenBalance,
        balanceAfter: newBalance,
      },
    })

    return true
  })
}

export async function getUserTokenBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  })
  
  return user?.tokenBalance || 0
}

// Prompt utilities
export async function getUserPrompts(userId: string) {
  return prisma.prompt.findMany({
    where: { userId },
    include: {
      versions: {
        where: { isActive: true },
        take: 1,
      },
      _count: {
        select: {
          versions: true,
          tests: true,
          feedback: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getPromptWithVersions(promptId: string, userId?: string) {
  const whereClause = userId 
    ? { id: promptId, userId } 
    : { id: promptId, isPublic: true }

  return prisma.prompt.findUnique({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      versions: {
        orderBy: { createdAt: 'desc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
          examples: {
            where: { isApproved: true },
            orderBy: { order: 'asc' },
          },
          testResults: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      },
    },
  })
}

// System configuration utilities
export async function getSystemConfig(key: string): Promise<string | null> {
  const config = await prisma.systemConfig.findUnique({
    where: { key },
  })
  
  return config?.value || null
}

export async function setSystemConfig(key: string, value: string): Promise<void> {
  await prisma.systemConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
}

// Analytics utilities
export async function logApiUsage(data: {
  userId?: string
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  tokensUsed?: number
}) {
  await prisma.apiUsage.create({ data })
}

// Subscription utilities
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    stripeSubscriptionId: string
    stripePriceId: string
    tier: any
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd?: boolean
  }
) {
  return prisma.$transaction(async (tx) => {
    // Update user tier
    await tx.user.update({
      where: { id: userId },
      data: { subscriptionTier: subscriptionData.tier },
    })

    // Create or update subscription
    return tx.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionData.stripeSubscriptionId },
      update: subscriptionData,
      create: {
        ...subscriptionData,
        userId,
      },
    })
  })
}

export async function cancelUserSubscription(stripeSubscriptionId: string) {
  return prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: {
      status: 'canceled',
      cancelAtPeriodEnd: true,
    },
  })
}