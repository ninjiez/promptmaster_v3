"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import InitialView from "@/components/prompt-forensics/initial-view"
import PromptTypeSelectionView from "@/components/prompt-forensics/prompt-type-selection-view"
import WorkingView from "@/components/prompt-forensics/working-view"
import FeedbackView from "@/components/prompt-forensics/feedback-view"
import IdeaInputView from "@/components/prompt-forensics/idea-input-view"
import { useModal } from "@/lib/contexts/modal-context"

export default function PromptForensicsPage() {
  const { data: session, status } = useSession()
  const { handleShowLoginModal, handleShowTokenModal } = useModal()
  
  console.log('🔍 Main Page - Session state:', {
    status,
    hasSession: !!session,
    userEmail: session?.user?.email,
    tokenBalance: session?.user?.tokenBalance
  })
  
  const [view, setView] = useState<"initial" | "idea-input" | "prompt-type-selection" | "working" | "feedback">(
    "initial",
  )
  const [promptType, setPromptType] = useState<"system-user" | "direct">("system-user")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFromPromptInput, setIsFromPromptInput] = useState(false)
  const [generatedPromptData, setGeneratedPromptData] = useState<any>(null)

  const handleIdeaStart = () => {
    setIsFromPromptInput(false)
    setView("idea-input")
  }

  const handlePromptStart = () => {
    setIsFromPromptInput(true)
    setView("prompt-type-selection")
  }

  const handlePromptTypeSelected = (type: "system-user" | "direct") => {
    setPromptType(type)
    if (!isFromPromptInput) {
      // Coming from idea flow - check if user is authenticated
      if (!session) {
        handleShowLoginModal()
      } else {
        setView("working")
      }
    } else {
      // Coming from prompt input flow - check if user is authenticated
      if (!session) {
        handleShowLoginModal()
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

  const handleGenerateV1 = (promptData?: any) => {
    if (promptData) {
      setGeneratedPromptData(promptData)
    }
    setView("prompt-type-selection")
  }

  return (
    <main
      className={`${view === "working" ? "min-h-screen pt-20 px-6" : "flex-grow flex flex-col items-center justify-center overflow-auto"} ${isGenerating ? "blur-sm" : ""}`}
    >
      {view === "initial" && <InitialView onIdeaStart={handleIdeaStart} onPromptStart={handlePromptStart} />}
      {view === "idea-input" && (
        <IdeaInputView
          onGenerateV1={handleGenerateV1}
          onShowLoginModal={handleShowLoginModal}
          onShowTokenModal={handleShowTokenModal}
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
          generatedPromptData={generatedPromptData}
        />
      )}
      {view === "feedback" && <FeedbackView />}
    </main>
  )
}
