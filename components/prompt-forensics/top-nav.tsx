"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BotMessageSquare, User } from "lucide-react"
import TokenPurchaseModal from "./token-purchase-modal"

interface TopNavProps {
  showBackButton: boolean
  onBack: () => void
  promptType?: "system-user" | "direct"
  onPromptTypeChange?: (type: "system-user" | "direct") => void
  onNavigateToFeedback?: () => void
  onShowLogin?: () => void
}

export default function TopNav({
  showBackButton,
  onBack,
  promptType = "system-user",
  onPromptTypeChange,
  onNavigateToFeedback,
  onShowLogin,
}: TopNavProps) {
  const { data: session, status } = useSession()
  const [showTokenModal, setShowTokenModal] = useState(false)

  const handleTokenPurchase = (tokens: number, price: number) => {
    console.log(`Purchasing ${tokens} tokens for $${price}`)
    // TODO: Integrate with payment processor
  }

  const handleAuthAction = async () => {
    if (session) {
      await signOut()
    } else {
      onShowLogin?.()
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-gradient-to-r from-white/8 via-white/5 to-white/8 backdrop-blur-2xl border-b border-white/15 z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:backdrop-blur-lg hover:shadow-lg hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <BotMessageSquare className="h-6 w-6 text-blue-400" />
              <h1 className="text-lg font-semibold tracking-tight">{"PromptGOD"}</h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session && (
            <div className="bg-gradient-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-xl border border-white/20 shadow-lg text-sm rounded-full px-4 py-1.5">
              Tokens: <span className="font-semibold">{session.user.tokenBalance?.toLocaleString() || '0'}</span>
            </div>
          )}

          {session && (
            <Button
              onClick={() => setShowTokenModal(true)}
              className="bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 hover:border-blue-400/50 shadow-xl hover:shadow-blue-500/30 text-white rounded-full text-sm font-medium"
            >
              Buy Tokens
            </Button>
          )}

          <Button
            onClick={handleAuthAction}
            className="bg-gradient-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-xl border border-white/20 hover:from-white/20 hover:via-white/12 hover:to-white/20 shadow-lg hover:shadow-xl text-white rounded-full px-4 py-2 flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {session ? "Logout" : "Login"}
          </Button>
        </div>
      </header>

      <TokenPurchaseModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onPurchase={handleTokenPurchase}
      />
    </>
  )
}
