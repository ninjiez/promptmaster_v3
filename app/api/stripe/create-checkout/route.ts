import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import { stripe, TOKEN_TIERS, TokenTier } from '@/lib/stripe'
import { authConfig } from '@/lib/auth/config'

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Create checkout session request received')
    const session = await getServerSession(authConfig)
    console.log('🔐 Session:', session ? `User: ${session.user?.email}` : 'No session')
    
    if (!session?.user?.email) {
      console.log('❌ Unauthorized: No session or email')
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tier } = body as { tier: TokenTier }
    console.log('🎯 Tier requested:', tier)

    if (!tier || !TOKEN_TIERS[tier]) {
      console.log('❌ Invalid tier:', tier)
      return NextResponse.json(
        { error: 'Invalid token tier specified' },
        { status: 400 }
      )
    }

    const tierConfig = TOKEN_TIERS[tier]
    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tierConfig.name} - ${tierConfig.tokens.toLocaleString()} Tokens`,
              description: `${tierConfig.tokens.toLocaleString()} PromptGOD tokens for AI-powered prompt generation`,
            },
            unit_amount: tierConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        tier,
        tokens: tierConfig.tokens.toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
    })

    console.log('✅ Checkout session created:', checkoutSession.id)
    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}