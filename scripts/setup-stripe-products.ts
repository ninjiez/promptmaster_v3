#!/usr/bin/env tsx

/**
 * Setup script to create Stripe products and prices for token tiers
 * Run this once after setting up your Stripe account
 * 
 * Usage: npx tsx scripts/setup-stripe-products.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import Stripe from 'stripe'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Initialize Stripe directly here after env vars are loaded
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  appInfo: {
    name: 'PromptGOD',
    version: '1.0.0',
  },
})

// Token tier products configuration
const TOKEN_TIERS = {
  SKEPTIC: {
    name: 'Skeptic',
    tokens: 500,
    price: 499, // $4.99 in cents
  },
  PROMPT_KIDDO: {
    name: 'Prompt Kiddo',
    tokens: 2500,
    price: 999, // $9.99 in cents
  },
  PROMPT_ENGINEER: {
    name: 'Prompt Engineer',
    tokens: 10000,
    price: 1999, // $19.99 in cents
  },
  PROMPT_GOD: {
    name: 'Prompt GOD',
    tokens: 100000,
    price: 4999, // $49.99 in cents
  },
} as const

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products for PromptGOD token tiers...\n')

  try {
    for (const [tierKey, tierConfig] of Object.entries(TOKEN_TIERS)) {
      console.log(`Creating product: ${tierConfig.name}`)
      
      // Create product
      const product = await stripe.products.create({
        name: `${tierConfig.name} - ${tierConfig.tokens.toLocaleString()} Tokens`,
        description: `${tierConfig.tokens.toLocaleString()} PromptGOD tokens for AI-powered prompt generation`,
        metadata: {
          tier: tierKey,
          tokens: tierConfig.tokens.toString(),
        },
      })

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tierConfig.price,
        currency: 'usd',
        metadata: {
          tier: tierKey,
          tokens: tierConfig.tokens.toString(),
        },
      })

      console.log(`✅ Created ${tierConfig.name}:`)
      console.log(`   Product ID: ${product.id}`)
      console.log(`   Price ID: ${price.id}`)
      console.log(`   Amount: $${(tierConfig.price / 100).toFixed(2)}`)
      console.log(`   Tokens: ${tierConfig.tokens.toLocaleString()}\n`)
    }

    console.log('🎉 All Stripe products created successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Copy the Price IDs above')
    console.log('2. Update your TOKEN_TIERS configuration in lib/stripe.ts')
    console.log('3. Add your actual Stripe keys to .env.local')
    console.log('4. Test the integration with the TokenPurchaseModal')

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error)
    process.exit(1)
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupStripeProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}