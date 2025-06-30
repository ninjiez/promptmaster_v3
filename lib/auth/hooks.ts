'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(status === 'loading')
  }, [status])

  const refreshSession = async () => {
    await update()
  }

  return {
    user: session?.user,
    session,
    isAuthenticated: !!session,
    isLoading,
    status,
    refreshSession,
  }
}

export function useTokenBalance() {
  const { user, refreshSession } = useAuth()
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    if (user?.tokenBalance !== undefined) {
      setBalance(user.tokenBalance)
    }
  }, [user?.tokenBalance])

  const updateBalance = async () => {
    await refreshSession()
  }

  return {
    balance,
    updateBalance,
    subscriptionTier: user?.subscriptionTier || 'FREE',
  }
}