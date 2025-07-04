import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  appInfo: {
    name: 'PromptGOD',
    version: '1.0.0',
  },
})

// Re-export client-safe config
export { TOKEN_TIERS, type TokenTier } from './stripe-config'