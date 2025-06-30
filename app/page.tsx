"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import InitialView from "@/components/prompt-forensics/initial-view"
import PromptTypeSelectionView from "@/components/prompt-forensics/prompt-type-selection-view"
import WorkingView from "@/components/prompt-forensics/working-view"
import TopNav from "@/components/prompt-forensics/top-nav"
import FeedbackView from "@/components/prompt-forensics/feedback-view"
import LoginModal from "@/components/prompt-forensics/login-modal"
import IdeaInputView from "@/components/prompt-forensics/idea-input-view"

export default function PromptForensicsPage() {
  const { data: session, status } = useSession()
  const [view, setView] = useState<"initial" | "idea-input" | "prompt-type-selection" | "working" | "feedback">(
    "initial",
  )
  const [promptType, setPromptType] = useState<"system-user" | "direct">("system-user")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFromPromptInput, setIsFromPromptInput] = useState(false)

  const handleIdeaStart = () => {
    setIsFromPromptInput(false)
    setView("idea-input")
  }

  const handlePromptStart = () => {
    setIsFromPromptInput(true)
    setView("prompt-type-selection")
  }

  const handleShowLoginModal = () => {
    if (!session) {
      setShowLoginModal(true)
    }
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
  }

  const handleLogin = () => {
    setShowLoginModal(false)
    setView("working")
    console.log("User logged in")
  }

  const handlePromptTypeSelected = (type: "system-user" | "direct") => {
    setPromptType(type)
    if (!isFromPromptInput) {
      // Coming from idea flow - check if user is authenticated
      if (!session) {
        setShowLoginModal(true)
      } else {
        setView("working")
      }
    } else {
      // Coming from prompt input flow - check if user is authenticated
      if (!session) {
        setShowLoginModal(true)
      } else {
        setView("working")
      }
    }
  }

  const handleNavigateToFeedback = () => {
    setView("feedback")
  }

  const handleGoBack = () => {
    if (view === "idea-input") {
      setView("initial")
    } else if (view === "prompt-type-selection") {
      if (isFromPromptInput) {
        setView("initial")
      } else {
        setView("idea-input")
      }
    } else if (view === "feedback") {
      setView("initial")
    } else {
      setView("initial")
    }
  }

  const handlePromptTypeChange = (type: "system-user" | "direct") => {
    setPromptType(type)
  }

  const handleStartGenerating = () => {
    setIsGenerating(true)
  }

  const handleStopGenerating = () => {
    setIsGenerating(false)
  }

  const handleGenerateV1 = () => {
    setView("prompt-type-selection")
  }

  return (
    <div className="bg-[#0D1117] text-white min-h-screen font-sans antialiased flex flex-col">
      <TopNav
        showBackButton={view !== "initial"}
        onBack={handleGoBack}
        promptType={promptType}
        onPromptTypeChange={handlePromptTypeChange}
        onNavigateToFeedback={handleNavigateToFeedback}
        onShowLogin={handleShowLoginModal}
      />
      <main
        className={`${view === "working" ? "min-h-screen pt-20 px-6" : "flex-grow flex flex-col items-center justify-center overflow-auto"} ${isGenerating ? "blur-sm" : ""}`}
      >
        {view === "initial" && <InitialView onIdeaStart={handleIdeaStart} onPromptStart={handlePromptStart} />}
        {view === "idea-input" && (
          <IdeaInputView
            onGenerateV1={handleGenerateV1}
            onShowLoginModal={handleShowLoginModal}
            onStartGenerating={handleStartGenerating}
            onStopGenerating={handleStopGenerating}
          />
        )}
        {view === "prompt-type-selection" && (
          <PromptTypeSelectionView onPromptTypeSelected={handlePromptTypeSelected} />
        )}
        {view === "working" && (
          <WorkingView
            promptType={promptType}
            onShowLoginModal={handleShowLoginModal}
            isFromPromptInput={isFromPromptInput}
          />
        )}
        {view === "feedback" && <FeedbackView />}
      </main>

      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
    </div>
  )
}
