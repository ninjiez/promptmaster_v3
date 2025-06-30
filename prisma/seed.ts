import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create system configuration
  const systemConfigs = [
    {
      key: 'stripe_webhook_endpoint_secret',
      value: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    {
      key: 'signup_bonus_tokens',
      value: '1500',
    },
    {
      key: 'token_costs',
      value: JSON.stringify({
        generate_v3: 600,
        unlock_examples: 400,
        generate_questions: 100,
        test_prompt: 10,
      }),
    },
    {
      key: 'subscription_tiers',
      value: JSON.stringify({
        SKEPTIC: { tokens: 500, price: 4.99 },
        KIDDO: { tokens: 2500, price: 9.99 },
        ENGINEER: { tokens: 10000, price: 19.99 },
        GOD: { tokens: 100000, price: 49.99 },
      }),
    },
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  console.log('✅ System configuration created')

  // Create a demo user for development
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@promptgod.ai' },
    update: {},
    create: {
      email: 'demo@promptgod.ai',
      name: 'Demo User',
      tokenBalance: 5000, // Extra tokens for testing
      subscriptionTier: 'ENGINEER',
    },
  })

  console.log('✅ Demo user created')

  // Create sample prompts for the demo user
  const samplePrompts = [
    {
      title: 'Email Subject Line Generator',
      description: 'Generate compelling email subject lines for marketing campaigns',
      category: 'Marketing',
      subcategory: 'Email Marketing',
      promptType: 'SYSTEM_USER' as const,
    },
    {
      title: 'Code Review Assistant',
      description: 'Review code for bugs, performance issues, and best practices',
      category: 'Dev Tools',
      subcategory: 'Code Quality',
      promptType: 'SYSTEM_USER' as const,
    },
    {
      title: 'Social Media Post Creator',
      description: 'Create engaging social media posts for various platforms',
      category: 'Marketing',
      subcategory: 'Social Media',
      promptType: 'DIRECT' as const,
    },
  ]

  for (const promptData of samplePrompts) {
    const prompt = await prisma.prompt.create({
      data: {
        ...promptData,
        userId: demoUser.id,
        status: 'ACTIVE',
        versions: {
          create: {
            version: 'V1',
            content: `You are a ${promptData.title}. Help users with ${promptData.description}.`,
            systemPrompt: `You are an expert ${promptData.category} specialist.`,
            userPrompt: 'Generate compelling content based on the user\'s requirements.',
            isActive: true,
          },
        },
      },
    })

    console.log(`✅ Created sample prompt: ${prompt.title}`)
  }

  // Create sample token transactions
  const transactions = [
    {
      userId: demoUser.id,
      type: 'BONUS' as const,
      amount: 1500,
      description: 'Signup bonus',
      balanceBefore: 0,
      balanceAfter: 1500,
    },
    {
      userId: demoUser.id,
      type: 'PURCHASE' as const,
      amount: 3500,
      description: 'Engineer tier purchase',
      balanceBefore: 1500,
      balanceAfter: 5000,
    },
  ]

  for (const transaction of transactions) {
    await prisma.tokenTransaction.create({
      data: transaction,
    })
  }

  console.log('✅ Sample token transactions created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })