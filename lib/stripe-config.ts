// Client-safe Stripe configuration (no secret keys)
export const TOKEN_TIERS = {
  SKEPTIC: {
    name: 'Skeptic',
    tokens: 500,
    price: 499, // $4.99 in cents
    priceId: 'price_1RfqQD09137e2qooC5XuRxCq',
  },
  PROMPT_KIDDO: {
    name: 'Prompt Kiddo',
    tokens: 2500,
    price: 999, // $9.99 in cents
    priceId: 'price_1RfqQE09137e2qooiEzvpyqM',
  },
  PROMPT_ENGINEER: {
    name: 'Prompt Engineer',
    tokens: 10000,
    price: 1999, // $19.99 in cents
    priceId: 'price_1RfqQE09137e2qooRhCGwXoR',
  },
  PROMPT_GOD: {
    name: 'Prompt GOD',
    tokens: 100000,
    price: 4999, // $49.99 in cents
    priceId: 'price_1RfqQF09137e2qooj1FkPDkN',
  },
} as const

export type TokenTier = keyof typeof TOKEN_TIERS