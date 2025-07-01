import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../database/client'
import { createUser } from '../database/utils'

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/', // We'll use the modal on the main page
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔍 NextAuth - signIn callback:', {
        userEmail: user?.email,
        accountProvider: account?.provider,
        profileEmail: profile?.email
      })
      // Allow sign in
      return true
    },
    async session({ session, token }) {
      console.log('🔍 NextAuth - session callback:', {
        hasSession: !!session,
        hasToken: !!token,
        tokenSub: token?.sub,
        sessionUserEmail: session?.user?.email
      })
      
      // Add user ID and token balance to session from JWT
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        
        // Get fresh user data with token balance
        const userData = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            tokenBalance: true,
            subscriptionTier: true,
            stripeCustomerId: true,
          },
        })

        if (userData) {
          session.user.tokenBalance = userData.tokenBalance
          session.user.subscriptionTier = userData.subscriptionTier
          session.user.stripeCustomerId = userData.stripeCustomerId
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      console.log('🔍 NextAuth - jwt callback:', {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account,
        userEmail: user?.email,
        tokenSub: token?.sub
      })
      
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  events: {
    async createUser({ user }) {
      // This runs when a new user is created via OAuth
      // The PrismaAdapter handles user creation, but we need to add signup bonus
      if (user.id && user.email) {
        try {
          const signupBonus = parseInt(process.env.SIGNUP_BONUS_TOKENS || '1500')
          
          // Update user with signup bonus and create transaction
          await prisma.$transaction(async (tx) => {
            await tx.user.update({
              where: { id: user.id },
              data: { tokenBalance: signupBonus },
            })

            await tx.tokenTransaction.create({
              data: {
                userId: user.id,
                type: 'BONUS',
                amount: signupBonus,
                description: 'Welcome bonus - thank you for signing up!',
                balanceBefore: 0,
                balanceAfter: signupBonus,
              },
            })
          })

          console.log(`✅ Signup bonus of ${signupBonus} tokens granted to user ${user.email}`)
        } catch (error) {
          console.error('❌ Error granting signup bonus:', error)
        }
      }
    },
  },
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      tokenBalance?: number
      subscriptionTier?: string
      stripeCustomerId?: string
    }
  }

  interface User {
    id: string
    tokenBalance?: number
    subscriptionTier?: string
    stripeCustomerId?: string
  }
}