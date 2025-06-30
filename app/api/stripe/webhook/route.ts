import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/database/client'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    console.log(`🎯 Processing webhook event: ${event.type}`)
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('💳 Processing successful checkout:', session.id)
        console.log('📊 Session metadata:', session.metadata)

        // Extract metadata
        const userId = session.metadata?.userId
        const tokens = parseInt(session.metadata?.tokens || '0')
        const tier = session.metadata?.tier

        console.log('🔍 Extracted values:', { userId, tokens, tier })

        if (!userId || !tokens) {
          console.error('❌ Missing required metadata:', { userId, tokens, tier })
          return NextResponse.json(
            { error: 'Missing required metadata' },
            { status: 400 }
          )
        }

        try {
          console.log(`💰 Attempting to credit ${tokens} tokens to user ${userId}`)
          // Update user's token balance and create transaction record
          await prisma.$transaction(async (tx) => {
            // Get current user balance first
            const currentUser = await tx.user.findUnique({
              where: { id: userId },
              select: { tokenBalance: true }
            })

            if (!currentUser) {
              throw new Error(`User ${userId} not found`)
            }

            const balanceBefore = currentUser.tokenBalance || 0
            const balanceAfter = balanceBefore + tokens

            // Update user's token balance
            const user = await tx.user.update({
              where: { id: userId },
              data: {
                tokenBalance: balanceAfter
              }
            })

            // Create token transaction record
            await tx.tokenTransaction.create({
              data: {
                userId,
                amount: tokens,
                type: 'PURCHASE',
                description: `Stripe payment - ${tier} tier (${tokens.toLocaleString()} tokens)`,
                reference: session.id, // Use reference field for stripe session ID
                balanceBefore,
                balanceAfter,
              }
            })

            console.log(`Successfully added ${tokens} tokens to user ${userId}`)
            console.log(`User new balance: ${user.tokenBalance}`)
          })

        } catch (dbError) {
          console.error('Database transaction failed:', dbError)
          return NextResponse.json(
            { error: 'Database transaction failed' },
            { status: 500 }
          )
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('PaymentIntent failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}