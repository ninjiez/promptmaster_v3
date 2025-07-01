"use client"

import { usePathname, useRouter } from "next/navigation"
import TopNav from "@/components/prompt-forensics/top-nav"
import LoginModal from "@/components/prompt-forensics/login-modal"
import TokenPurchaseModal from "@/components/prompt-forensics/token-purchase-modal"
import { ModalProvider, useModal } from "@/lib/contexts/modal-context"

function LayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { showLoginModal, showTokenModal, setShowLoginModal, setShowTokenModal, handleShowLoginModal } = useModal()
  
  // Determine if we should show the back button
  const showBackButton = pathname !== "/" && pathname !== "/dashboard"
  
  // Determine current view for prompt type selector
  const isWorkingView = pathname === "/" || pathname.startsWith("/prompts/")
  
  const handleGoBack = () => {
    if (pathname === "/dashboard") {
      router.push("/")
    } else if (pathname.startsWith("/prompts/")) {
      router.push("/dashboard")
    } else {
      router.back()
    }
  }
  
  const handleNavigateToFeedback = () => {
    // Navigate to feedback page when implemented
    console.log("Navigate to feedback")
  }
  
  const handlePromptTypeChange = (type: "system-user" | "direct") => {
    // Handle prompt type change if needed
    console.log("Prompt type changed to:", type)
  }
  
  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
  }
  
  const handleCloseTokenModal = () => {
    setShowTokenModal(false)
  }
  
  const handleLogin = () => {
    setShowLoginModal(false)
    console.log("User logged in")
  }

  return (
    <div className="bg-[#0D1117] text-white min-h-screen font-sans antialiased flex flex-col">
      <TopNav
        showBackButton={showBackButton}
        onBack={handleGoBack}
        promptType={isWorkingView ? "system-user" : undefined}
        onPromptTypeChange={isWorkingView ? handlePromptTypeChange : undefined}
        onNavigateToFeedback={handleNavigateToFeedback}
        onShowLogin={handleShowLoginModal}
      />
      <main className="flex-grow">
        {children}
      </main>
      
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
      <TokenPurchaseModal isOpen={showTokenModal} onClose={handleCloseTokenModal} />
    </div>
  )
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ModalProvider>
      <LayoutContent>{children}</LayoutContent>
    </ModalProvider>
  )
}