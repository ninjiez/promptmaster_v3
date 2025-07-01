"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, BotMessageSquare, User, LogOut, Coins, ChevronDown, LayoutDashboard } from "lucide-react"
import TokenPurchaseModal from "./token-purchase-modal"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)


  const handleLogout = async () => {
    await signOut()
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const getFirstName = (name?: string | null) => {
    if (!name) return "User"
    return name.split(" ")[0]
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
          {session ? (
            /* User Profile Dropdown */
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="bg-gradient-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-xl border border-white/20 hover:from-white/20 hover:via-white/12 hover:to-white/20 shadow-lg hover:shadow-xl rounded-full px-3 py-2 flex items-center gap-3 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                      {getUserInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-white text-sm font-medium max-w-24 truncate">
                    {getFirstName(session.user.name)}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl"
              >
                {/* User Info Header with Token Balance */}
                <DropdownMenuLabel className="text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name || "User"}</p>
                      <p className="text-xs text-white/60">{session.user.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Coins className="h-3 w-3" />
                      <span className="font-medium">
                        {session.user.tokenBalance?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Actions */}
                <DropdownMenuItem 
                  onClick={() => {
                    router.push("/dashboard")
                    setIsDropdownOpen(false)
                  }}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 text-green-400" />
                  <span>Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => {
                    setShowTokenModal(true)
                    setIsDropdownOpen(false)
                  }}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <Coins className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Buy Tokens</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onShowLogin}
              className="bg-gradient-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-xl border border-white/20 hover:from-white/20 hover:via-white/12 hover:to-white/20 shadow-lg hover:shadow-xl text-white rounded-full px-4 py-2 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </header>

      <TokenPurchaseModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
      />
    </>
  )
}
