// Client-safe Stripe configuration (no secret keys)
export const TOKEN_TIERS = {
  STARTER: {
    name: 'Starter',
    tokens: 1000,
    price: 500, // $5.00 in cents
    priceId: 'price_starter_1000_tokens', // Update with real Stripe price ID
    description: 'Perfect for trying out the platform',
  },
  SKEPTIC: {
    name: 'Skeptic',
    tokens: 5000,
    price: 2000, // $20.00 in cents
    priceId: 'price_skeptic_5000_tokens', // Update with real Stripe price ID
    description: 'For occasional prompt engineering',
  },
  PROMPT_KIDDO: {
    name: 'Prompt Kiddo',
    tokens: 15000,
    price: 5000, // $50.00 in cents
    priceId: 'price_kiddo_15000_tokens', // Update with real Stripe price ID
    description: 'For regular prompt optimization',
  },
  PROMPT_ENGINEER: {
    name: 'Prompt Engineer',
    tokens: 50000,
    price: 15000, // $150.00 in cents
    priceId: 'price_engineer_50000_tokens', // Update with real Stripe price ID
    description: 'For professional prompt engineers',
  },
  PROMPT_GOD: {
    name: 'Prompt GOD',
    tokens: 150000,
    price: 40000, // $400.00 in cents
    priceId: 'price_god_150000_tokens', // Update with real Stripe price ID
    description: 'For prompt engineering masters',
  },
} as const

export type TokenTier = keyof typeof TOKEN_TIERS