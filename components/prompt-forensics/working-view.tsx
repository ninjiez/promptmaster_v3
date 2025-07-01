"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginModal from "./login-modal"
import {
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowLeft,
  ChevronDown,
  X,
  HelpCircle,
  Check,
} from "lucide-react"

export default function WorkingView({
  promptType = "system-user",
  onShowLoginModal,
  isFromPromptInput = false,
  generatedPromptData,
}: {
  promptType?: "system-user" | "direct"
  onShowLoginModal?: () => void
  isFromPromptInput?: boolean
  generatedPromptData?: any
}) {
  const [question1Answer, setQuestion1Answer] = useState("")
  const [question2Answer, setQuestion2Answer] = useState("")
  const [showExamples, setShowExamples] = useState(false)
  const [showV1Prompt, setShowV1Prompt] = useState(true)
  const [showV2Prompt, setShowV2Prompt] = useState(true)
  const [showQuestions, setShowQuestions] = useState(true)
  const [unlockExamples, setUnlockExamples] = useState(false)
  const [showExamplesPanel, setShowExamplesPanel] = useState(false)
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false)
  const [showWhyMattersModal, setShowWhyMattersModal] = useState(false)
  const [whyMattersContent, setWhyMattersContent] = useState("")
  const [currentVersions, setCurrentVersions] = useState(() => {
    if (generatedPromptData) {
      // With real data, start with just V1
      return { left: "v1", right: "v1" }
    }
    // Default to V1 vs V2 for demo
    return { left: "v1", right: "v2" }
  })
  const [showVersionSelector, setShowVersionSelector] = useState({ left: false, right: false })
  const [currentPromptType, setCurrentPromptType] = useState<"system-user" | "direct">(promptType)

  // --- Login modal state ---
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  // Voting state
  const [votingMode, setVotingMode] = useState<"v1" | "v2" | null>(null)
  const [feedbackContext, setFeedbackContext] = useState("")

  // Show the login modal 1.5 s after the first “Generate Version 1 Prompt” click
  const handleLogin = () => {
    setIsUserLoggedIn(true)
    setShowLoginModal(false)
  }

  const [hasGeneratedV1, setHasGeneratedV1] = useState(false)

  // Initialize version history with real data or defaults
  const [versionHistory, setVersionHistory] = useState(() => {
    if (generatedPromptData) {
      // Create V1 from generated prompt data
      return [
        {
          id: "v1",
          label: "V1",
          systemPrompt: promptType === "system-user" ? "You are a helpful assistant." : "",
          userPrompt: generatedPromptData.content,
          content: generatedPromptData.content,
          output: generatedPromptData.content,
          promptId: generatedPromptData.id,
          title: generatedPromptData.title,
          description: generatedPromptData.description,
          tags: generatedPromptData.tags || [],
          suggestions: generatedPromptData.suggestions || []
        }
      ]
    }
    
    // Fallback to mock data for demo purposes
    return [
      {
        id: "v1",
        label: "V1",
        systemPrompt: "You are a helpful assistant. Provide accurate and concise information.",
        userPrompt:
          "Tell me about the Eiffel Tower. Include basic information about its location, architect, and significance.",
        content:
          "Tell me about the Eiffel Tower. Include basic information about its location, architect, and significance.",
        output:
          "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. It is a famous landmark and tourist attraction that offers great views of the city.",
      },
      {
        id: "v2",
        label: "V2",
        systemPrompt:
          "You are an expert travel guide and historian. Provide comprehensive information using clear structure and engaging details. Always include key facts, historical context, and modern significance.",
        userPrompt:
          "Tell me about the Eiffel Tower. Include basic information about its location, architect, and significance.",
        content:
          "Tell me about the Eiffel Tower. Include basic information about its location, architect, and significance.",
        output:
          "Eiffel Tower: Complete Overview\n\nLocation: Champ de Mars, 7th arrondissement, Paris, France\nArchitect: Gustave Eiffel (1832-1923)\nConstruction: 1887-1889\nHeight: 330 meters (1,083 feet)\nSignificance: Iconic symbol of France, UNESCO World Heritage site, and one of the most visited monuments globally with over 6 million visitors annually.",
      },
    ]
  })

  const [comparisonVersion, setComparisonVersion] = useState("v2") // Default to latest version

  // Example states
  const [exampleStates, setExampleStates] = useState({
    example1: {
      approved: false,
      rejected: false,
      text: `# Eiffel Tower Overview

## Key Facts
• Location: Champ de Mars, Paris, France
• Height: 330 meters (1,083 feet)
• Architect: Gustave Eiffel
• Construction: 1887-1889

## Historical Context
The Eiffel Tower was built as the entrance arch to the 1889 World's Fair, celebrating the centennial of the French Revolution. Initially criticized by Parisian artists and intellectuals, it has become the most iconic symbol of France.

## Modern Significance
1. Most visited paid monument in the world
2. UNESCO World Heritage Site since 1991
3. Symbol of French engineering excellence
4. Tourist attraction with 6+ million visitors annually

**Quick Facts Box:**
Height: 330m | Year Built: 1889 | Architect: Gustave Eiffel | Daily Visitors: 16,000+ | Did You Know?: It grows 6 inches taller in summer due to thermal expansion!`,
    },
    example2: {
      approved: false,
      rejected: false,
      text: `**EIFFEL TOWER GUIDE**

🗼 ESSENTIAL INFO:
- Built: 1887-1889 by Gustave Eiffel
- Location: 7th arrondissement, Paris
- Height: 330 meters (1,083 feet)
- Purpose: 1889 World's Fair entrance

📚 FASCINATING HISTORY:
Originally intended as a temporary structure, the Eiffel Tower faced fierce opposition from prominent Parisians who called it an eyesore. However, its practical use as a radio transmission tower saved it from demolition, and it gradually became beloved by both locals and visitors.

🌟 WHY IT MATTERS TODAY:
The tower represents French innovation and attracts over 6 million visitors yearly, making it the world's most-visited paid monument. It's not just a tourist attraction—it's a working radio antenna and weather station that continues to serve practical purposes.

💡 INSIDER TIP: Visit at sunset for the best photos, and stay for the hourly light show that begins at dusk!`,
    },
    example3: {
      approved: false,
      rejected: false,
      text: `EIFFEL TOWER FACT SHEET

BASIC INFORMATION
Name: La Tour Eiffel
Location: Champ de Mars, Paris, France
Coordinates: 48.8584° N, 2.2945° E
Height: 330 meters (1,083 feet)
Weight: 10,100 tons
Architect: Gustave Eiffel
Construction Period: January 1887 - March 1889

HISTORICAL SIGNIFICANCE
• Built for the 1889 Exposition Universelle (World's Fair)
• Commemorated the 100th anniversary of the French Revolution
• Initially planned as a temporary 20-year structure
• Saved from demolition due to its value as a radio transmission tower

CURRENT STATUS
Annual Visitors: 6+ million
UNESCO Status: World Heritage Site (1991)
Economic Impact: €435 million annually to Paris economy
Maintenance: Painted every 7 years (takes 60 tons of paint)

DID YOU KNOW?
The tower sways up to 7 centimeters in strong winds and grows 6 inches taller in summer heat!`,
    },
  })

  // Question states with categories
  const [questionStates, setQuestionStates] = useState({
    structure: {
      approved: false,
      rejected: false,
      category: "Format",
      categoryColor: "blue",
      question: "How should the output be structured or formatted?",
      placeholder: "e.g., As a bulleted list, JSON format, step-by-step guide...",
      answer: "",
      whyMatters:
        "Structure determines how easily users can scan, understand, and act on the AI's response. Clear formatting reduces cognitive load and improves usability.",
    },
    tone: {
      approved: false,
      rejected: false,
      category: "Style",
      categoryColor: "purple",
      question: "What specific tone or style should the AI use?",
      placeholder: "e.g., Professional, casual, persuasive, technical...",
      answer: "",
      whyMatters:
        "Tone affects how your audience perceives and trusts the content. The right tone builds rapport and ensures your message resonates with your target audience.",
    },
    context: {
      approved: false,
      rejected: false,
      category: "Context",
      categoryColor: "green",
      question: "What background context should the AI consider?",
      placeholder: "e.g., Industry standards, company values, target audience...",
      answer: "",
      whyMatters:
        "Context helps AI understand the bigger picture and constraints, leading to more relevant and appropriate responses that fit your specific situation.",
    },
    constraints: {
      approved: false,
      rejected: false,
      category: "Rules",
      categoryColor: "orange",
      question: "Are there any specific constraints or requirements?",
      placeholder: "e.g., Word count limits, must include citations, avoid certain topics...",
      answer: "",
      whyMatters:
        "Constraints ensure the AI output meets your exact requirements and stays within your exact requirements and stays within necessary boundaries, preventing costly revisions.",
    },
    examples: {
      approved: false,
      rejected: false,
      category: "Examples",
      categoryColor: "pink",
      question: "Can you provide examples of desired output?",
      placeholder: "e.g., Show a sample response, reference similar content...",
      answer: "",
      whyMatters:
        "Examples are the most powerful way to communicate your expectations. They show rather than tell, leading to more accurate results.",
    },
  })

  const handleVote = (voteType: "v1" | "v2" | null) => {
    setVotingMode(voteType)
    setFeedbackContext("")
  }

  const handleCancelVote = () => {
    setVotingMode(null)
    setFeedbackContext("")
  }

  const handleGenerateV3 = async () => {
    if (!feedbackContext.trim() || feedbackContext.length < 50) {
      alert('Please provide more detailed feedback before generating V3.')
      return
    }

    console.log("Generating V3 with feedback:", {
      voteType: votingMode,
      context: feedbackContext,
      questions: questionStates,
    })

    try {
      // Get the current prompt ID and content
      const currentVersion = versionHistory.find(v => v.id === currentVersions.right)
      if (!currentVersion) {
        alert('Cannot find current version to improve.')
        return
      }

      // Prepare feedback data
      const approvedQuestions = Object.entries(questionStates)
        .filter(([_, state]) => state.approved && !state.rejected)
        .map(([key, state]) => ({
          questionId: key,
          answer: state.answer
        }))

      const requestBody = {
        promptId: currentVersion.promptId || 'demo',
        currentPrompt: currentVersion.content,
        feedback: approvedQuestions,
        votingFeedback: {
          selectedVersion: votingMode,
          reason: feedbackContext,
          comparison: `User preferred ${votingMode} and provided this feedback: ${feedbackContext}`
        },
        userGoals: currentVersion.suggestions || [],
        previousVersions: versionHistory.map(v => v.content)
      }

      const response = await fetch('/api/prompts/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('V3 generation failed:', result.error)
        alert(`V3 generation failed: ${result.error}`)
        return
      }

      if (result.success) {
        // Create new V3 version with AI-generated content
        const newVersion = {
          id: `v${versionHistory.length + 1}`,
          label: `V${versionHistory.length + 1}`,
          systemPrompt: currentVersion.systemPrompt,
          userPrompt: result.data.improvedPrompt,
          content: result.data.improvedPrompt,
          output: result.data.improvedPrompt,
          promptId: currentVersion.promptId,
          title: currentVersion.title,
          description: currentVersion.description,
          tags: currentVersion.tags,
          suggestions: currentVersion.suggestions,
          changelog: result.data.changelog || [],
          improvements: result.data.improvements || {}
        }

        // Add new version to history
        setVersionHistory((prev) => [...prev, newVersion])

        // Shift versions: current right becomes left, new version becomes right
        setCurrentVersions({ left: currentVersions.right, right: newVersion.id })

        // Reset voting state
        setVotingMode(null)
        setFeedbackContext("")
      } else {
        console.error('V3 generation failed:', result.error)
        alert(`V3 generation failed: ${result.error}`)
      }
    } catch (error) {
      console.error('V3 generation error:', error)
      alert('V3 generation failed. Please try again.')
    }
  }

  const getStrengthColor = (length: number) => {
    if (length < 50) return "text-red-400"
    if (length < 100) return "text-yellow-400"
    if (length < 150) return "text-blue-400"
    return "text-green-400"
  }

  const getStrengthText = (length: number) => {
    if (length < 50) return "Too short - Add more details"
    if (length < 100) return "Getting better - Keep going"
    if (length < 150) return "Good context - Almost there"
    return "Excellent context!"
  }

  const getBorderColor = () => {
    if (votingMode === "v2") return "border-green-500 border-2"
    if (votingMode === "v1") return "border-red-500 border-2"
    return "border-white/10"
  }

  const handleExampleApprove = (exampleKey: keyof typeof exampleStates) => {
    setExampleStates((prev) => ({
      ...prev,
      [exampleKey]: {
        ...prev[exampleKey],
        approved: true,
        rejected: false,
      },
    }))
  }

  const handleExampleReject = (exampleKey: keyof typeof exampleStates) => {
    setExampleStates((prev) => ({
      ...prev,
      [exampleKey]: {
        ...prev[exampleKey],
        approved: false,
        rejected: true,
      },
    }))
  }

  const handleExampleTextChange = (exampleKey: keyof typeof exampleStates, newText: string) => {
    setExampleStates((prev) => ({
      ...prev,
      [exampleKey]: {
        ...prev[exampleKey],
        text: newText,
      },
    }))
  }

  const handleQuestionApprove = (questionKey: keyof typeof questionStates) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionKey]: {
        ...prev[questionKey],
        approved: true,
        rejected: false,
      },
    }))
  }

  const handleQuestionReject = (questionKey: keyof typeof questionStates) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionKey]: {
        ...prev[questionKey],
        approved: false,
        rejected: true,
      },
    }))
  }

  const handleQuestionAnswerChange = (questionKey: keyof typeof questionStates, answer: string) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionKey]: {
        ...prev[questionKey],
        answer,
      },
    }))
  }

  const getApprovedExamples = () => {
    return Object.entries(exampleStates)
      .filter(([_, state]) => state.approved && !state.rejected)
      .map(([key, state]) => ({ key, text: state.text }))
  }

  const getApprovedQuestions = () => {
    return Object.entries(questionStates)
      .filter(([_, state]) => state.approved && !state.rejected)
      .map(([key, state]) => ({ key, question: state.question, answer: state.answer }))
  }

  const handleUnlockExamples = () => {
    setUnlockExamples(true)
    setShowExamplesPanel(true)
  }

  const handleShowWhyMatters = (content: string) => {
    setWhyMattersContent(content)
    setShowWhyMattersModal(true)
  }

  const getCategoryGradient = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-r from-blue-500/80 to-cyan-500/60"
      case "purple":
        return "bg-gradient-to-r from-purple-500/80 to-violet-500/60"
      case "green":
        return "bg-gradient-to-r from-green-500/80 to-emerald-500/60"
      case "orange":
        return "bg-gradient-to-r from-orange-500/80 to-amber-500/60"
      case "pink":
        return "bg-gradient-to-r from-pink-500/80 to-rose-500/60"
      default:
        return "bg-gradient-to-r from-gray-500/80 to-slate-500/60"
    }
  }

  const [showPromptInputModal, setShowPromptInputModal] = useState(isFromPromptInput)
  const [userPromptInput, setUserPromptInput] = useState("")

  const handleStartWithPrompt = () => {
    setShowPromptInputModal(false)
    // After prompt input, show login modal
    if (onShowLoginModal) {
      onShowLoginModal()
    }
  }

  return (
    <>
      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />

      <div
        className={`grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4 h-screen pt-4 overflow-hidden pb-28 ${showLoginModal || showPromptInputModal ? "blur-sm" : ""}`}
      >
        {/* Left Panel: Controls */}
        <Card
          className={`bg-white/5 backdrop-blur-2xl ${getBorderColor()} text-white flex flex-col h-full overflow-hidden`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span>Control Panel</span>
              {votingMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelVote}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Cancel
                </Button>
              )}
            </CardTitle>
            <div className="border-t border-white/20 mt-2 pt-2">
              <h3 className="text-sm font-semibold text-white/90 mb-2">Mode</h3>
              {/* System+User/Direct Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPromptType("system-user")}
                  className={`flex-1 text-sm ${
                    currentPromptType === "system-user"
                      ? "bg-gradient-to-br from-blue-500/25 via-blue-400/20 to-purple-500/25 backdrop-blur-lg shadow-lg text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  System + User
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPromptType("direct")}
                  className={`flex-1 text-sm ${
                    currentPromptType === "direct"
                      ? "bg-gradient-to-br from-blue-500/25 via-blue-400/20 to-purple-500/25 backdrop-blur-lg shadow-lg text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Direct
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-grow overflow-y-auto">
            {votingMode && (
              // Voting Feedback Input - moved to top
              <div className="space-y-2">
                <Label htmlFor="feedback-context" className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {votingMode === "v2" ? (
                      <>
                        <ThumbsUp className="h-4 w-4 text-green-400" />
                        Why is V2 Better? *
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 text-red-400" />
                        Why was V1 Better? *
                      </>
                    )}
                  </span>
                  <span className={`text-xs ${getStrengthColor(feedbackContext.length)}`}>
                    {feedbackContext.length} chars
                  </span>
                </Label>
                <Textarea
                  id="feedback-context"
                  value={feedbackContext}
                  onChange={(e) => setFeedbackContext(e.target.value)}
                  placeholder="Be specific about what made this version better or worse. Consider factors like clarity, completeness, tone, structure, accuracy, and usefulness..."
                  className="bg-white/5 border-white/20 placeholder:text-white/40 min-h-[80px] text-base leading-relaxed resize-none"
                />
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      feedbackContext.length < 50
                        ? "bg-red-400"
                        : feedbackContext.length < 100
                          ? "bg-yellow-400"
                          : feedbackContext.length < 150
                            ? "bg-blue-400"
                            : "bg-green-400"
                    }`}
                    style={{ width: `${Math.min((feedbackContext.length / 200) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-white/60">{getStrengthText(feedbackContext.length)}</div>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 space-y-3">
              {/* Navbar for Questions vs Examples */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowExamples(false)
                    setShowQuestions(true)
                  }}
                  className={`flex-1 text-sm ${
                    showQuestions
                      ? "bg-gradient-to-br from-blue-500/25 via-blue-400/20 to-purple-500/25 backdrop-blur-lg shadow-lg text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Questions
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowQuestions(false)
                    setShowExamples(true)
                  }}
                  className={`flex-1 text-sm flex items-center gap-2 ${
                    showExamples
                      ? "bg-gradient-to-br from-blue-500/25 via-blue-400/20 to-purple-500/25 backdrop-blur-lg shadow-lg text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Lock className="h-3 w-3" />
                  Examples
                </Button>
              </div>

              {/* Questions Content - Simple Overview */}
              {showQuestions && (
                <div className="bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-2xl rounded-lg p-4 text-sm text-white/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                      <HelpCircle className="h-4 w-4 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Professional Questions</h3>
                      <p className="text-white/70 leading-relaxed text-xs">
                        Answer strategic questions to guide AI behavior and improve output quality.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      className="bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white"
                      onClick={() => setShowQuestionsPanel(true)}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Answer Questions
                    </Button>
                  </div>
                </div>
              )}

              {/* Examples Content - Original Unlock Screen */}
              {showExamples && !unlockExamples && (
                <div className="bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-2xl rounded-lg p-4 text-sm text-white/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Unlock Professional Examples</h3>
                      <p className="text-white/70 leading-relaxed text-xs">
                        Examples are a powerful way to enhance your prompts beyond basic questions. They teach AI
                        exactly how you want your results formatted and styled.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      className="bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white"
                      onClick={handleUnlockExamples}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Examples (400 tokens)
                    </Button>
                  </div>
                </div>
              )}

              {/* Show simple message when examples are unlocked but panel is closed */}
              {showExamples && unlockExamples && !showExamplesPanel && (
                <div className="bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-500/10 backdrop-blur-2xl rounded-lg p-5 text-sm text-white/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Examples Unlocked!</h3>
                      <p className="text-white/70">Click below to manage your examples</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowExamplesPanel(true)}
                    className="w-full bg-gradient-to-br from-green-500/80 via-green-400/70 to-emerald-500/60 backdrop-blur-xl border border-green-400/40 hover:from-green-500/90 hover:via-green-400/80 hover:to-emerald-500/70 shadow-xl hover:shadow-green-500/30 text-white"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Manage Examples
                  </Button>
                </div>
              )}
            </div>

            {/* Applied Items Display */}
            {(getApprovedQuestions().length > 0 || getApprovedExamples().length > 0) && (
              <div className="border-t border-white/10 pt-3 space-y-3">
                <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Applied to Prompt
                </h3>

                {/* Applied Questions */}
                {getApprovedQuestions().length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <HelpCircle className="h-3 w-3" />
                      <span>
                        Questions ({getApprovedQuestions().length})
                        {getApprovedQuestions().length > 2 ? ` (showing 2 of ${getApprovedQuestions().length})` : ""}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {getApprovedQuestions()
                        .slice(0, 2)
                        .map(({ key, question, answer }) => (
                          <div
                            key={key}
                            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-2 border border-blue-400/20"
                          >
                            <div className="text-xs font-medium text-blue-300 mb-1">
                              {questionStates[key as keyof typeof questionStates]?.category}
                            </div>
                            <div className="text-xs text-white/80 mb-1 line-clamp-1">{question}</div>
                            {answer && (
                              <div className="text-xs text-white/60 bg-white/5 rounded px-2 py-1 line-clamp-1">
                                {answer}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Applied Examples */}
                {getApprovedExamples().length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Lightbulb className="h-3 w-3" />
                      <span>
                        Examples ({getApprovedExamples().length})
                        {getApprovedExamples().length > 2 ? ` (showing 2 of ${getApprovedExamples().length})` : ""}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {getApprovedExamples()
                        .slice(0, 2)
                        .map(({ key, text }, index) => (
                          <div
                            key={key}
                            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-2 border border-green-400/20"
                          >
                            <div className="text-xs font-medium text-green-300 mb-1">Example #{index + 1}</div>
                            <div className="text-xs text-white/60 bg-white/5 rounded px-2 py-1 line-clamp-2 font-mono">
                              {text}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto space-y-3">
              <Button
                onClick={votingMode ? handleGenerateV3 : undefined}
                className="w-full bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 hover:border-blue-400/50 shadow-xl hover:shadow-blue-500/30 text-white flex items-center justify-between"
                disabled={!getApprovedQuestions().length && !unlockExamples && !votingMode}
              >
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate V3
                </span>
                <span className="text-white/60 text-sm">600 tokens</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: AI Outputs */}
        <div className="flex flex-col gap-6 relative">
          {/* See Prompt Toggle - Styled like Output Windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-500/10 border-gray-400/20 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVersionSelector((prev) => ({ ...prev, left: !prev.left }))}
                        className="text-white hover:text-white hover:bg-white/20 h-8 px-3 bg-gray-500/20 rounded flex items-center gap-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                        <span className="text-sm">
                          {versionHistory.find((v) => v.id === currentVersions.left)?.label}
                        </span>
                      </Button>
                      {showVersionSelector.left && (
                        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-50 min-w-[120px]">
                          {versionHistory.map((version) => {
                            const isCurrentlySelected = currentVersions.left === version.id
                            const isSelectedInOtherWindow = currentVersions.right === version.id
                            const isDisabled = isSelectedInOtherWindow

                            return (
                              <button
                                key={version.id}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setCurrentVersions((prev) => ({ ...prev, left: version.id }))
                                    setShowVersionSelector((prev) => ({ ...prev, left: false }))
                                  }
                                }}
                                disabled={isDisabled}
                                className={`block w-full text-left px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                  isCurrentlySelected
                                    ? "bg-blue-500/20 text-blue-300"
                                    : isDisabled
                                      ? "bg-red-500/10 text-red-400/50 cursor-not-allowed"
                                      : "text-white/80 hover:bg-white/10 cursor-pointer"
                                }`}
                              >
                                {version.label}
                                {isDisabled && " (in use)"}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    See Prompt
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowV1Prompt(!showV1Prompt)}
                      className="text-white hover:text-white hover:bg-white/20 h-8 px-3 bg-white/10"
                    >
                      {showV1Prompt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {showV1Prompt && (
                <CardContent className="pt-0 text-white/80 bg-gray-500/10 space-y-4">
                  {currentPromptType === "system-user" && (
                    <div>
                      <div className="text-xs font-medium text-white/60 mb-2">SYSTEM PROMPT</div>
                      <div className="bg-white/5 rounded-lg p-4 text-sm font-mono leading-relaxed">
                        {versionHistory.find((v) => v.id === currentVersions.left)?.systemPrompt}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-medium text-white/60 mb-2">
                      {currentPromptType === "system-user" ? "USER INPUT" : "DIRECT PROMPT"}
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-sm font-mono leading-relaxed">
                      {currentPromptType === "system-user"
                        ? versionHistory.find((v) => v.id === currentVersions.left)?.userPrompt
                        : versionHistory.find((v) => v.id === currentVersions.left)?.systemPrompt}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="bg-blue-500/10 border-blue-400/20 text-white ring-1 ring-blue-400/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVersionSelector((prev) => ({ ...prev, right: !prev.right }))}
                        className="text-white hover:text-white hover:bg-white/20 h-8 px-3 bg-blue-500/30 rounded flex items-center gap-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                        <span className="text-sm">
                          {versionHistory.find((v) => v.id === currentVersions.right)?.label}
                        </span>
                      </Button>
                      {showVersionSelector.right && (
                        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-xl z-50 min-w-[120px]">
                          {versionHistory.map((version) => {
                            const isCurrentlySelected = currentVersions.right === version.id
                            const isSelectedInOtherWindow = currentVersions.left === version.id
                            const isDisabled = isSelectedInOtherWindow

                            return (
                              <button
                                key={version.id}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setCurrentVersions((prev) => ({ ...prev, right: version.id }))
                                    setShowVersionSelector((prev) => ({ ...prev, right: false }))
                                  }
                                }}
                                disabled={isDisabled}
                                className={`block w-full text-left px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                  isCurrentlySelected
                                    ? "bg-blue-500/20 text-blue-300"
                                    : isDisabled
                                      ? "bg-red-500/10 text-red-400/50 cursor-not-allowed"
                                      : "text-white/80 hover:bg-white/10 cursor-pointer"
                                }`}
                              >
                                {version.label}
                                {isDisabled && " (in use)"}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    See Prompt
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowV2Prompt(!showV2Prompt)}
                      className="text-white hover:text-white hover:bg-white/20 h-8 px-3 bg-white/10"
                    >
                      {currentVersions.right === "v2" ? (
                        <Lock className="h-4 w-4" />
                      ) : showV2Prompt ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {showV2Prompt && (
                <CardContent className="pt-0 text-white/90 bg-blue-500/10 space-y-4">
                  {currentPromptType === "system-user" && isUserLoggedIn && (
                    <div>
                      <div className="text-xs font-medium text-white/60 mb-2">SYSTEM PROMPT</div>
                      <div className="bg-white/5 rounded-lg p-4 text-sm font-mono leading-relaxed">
                        {versionHistory.find((v) => v.id === currentVersions.right)?.systemPrompt}
                      </div>
                    </div>
                  )}
                  {currentPromptType === "system-user" && !isUserLoggedIn && (
                    <div>
                      <div className="text-xs font-medium text-white/60 mb-2">SYSTEM PROMPT</div>
                      <button
                        onClick={onShowLoginModal}
                        className="bg-white/5 rounded-lg p-4 text-sm font-mono leading-relaxed flex items-center justify-center min-h-[60px] text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors cursor-pointer w-full"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Login required to view system prompt
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-medium text-white/60 mb-2">
                      {currentPromptType === "system-user" ? "USER INPUT" : "DIRECT PROMPT"}
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-sm font-mono leading-relaxed">
                      {currentPromptType === "system-user"
                        ? versionHistory.find((v) => v.id === currentVersions.right)?.userPrompt
                        : versionHistory.find((v) => v.id === currentVersions.right)?.systemPrompt}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-0">
            <Card className="bg-gray-500/10 border-gray-400/20 text-white flex flex-col min-h-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="bg-gray-500/20 px-2 py-1 rounded text-sm">
                    {versionHistory.find((v) => v.id === currentVersions.left)?.label}
                  </span>
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 overflow-y-auto flex-grow min-h-0">
                <div className="whitespace-pre-line text-sm">
                  {versionHistory.find((v) => v.id === currentVersions.left)?.output}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-400/20 text-white flex flex-col ring-1 ring-blue-400/30 min-h-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="bg-blue-500/30 px-2 py-1 rounded text-sm">
                    {versionHistory.find((v) => v.id === currentVersions.right)?.label}
                  </span>
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 overflow-y-auto flex-grow min-h-0">
                <div className="whitespace-pre-line text-sm">
                  {versionHistory.find((v) => v.id === currentVersions.right)?.output}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
            <CardContent className="p-6 flex items-center justify-center gap-6">
              <h3 className="text-lg font-semibold">Which version is better?</h3>
              <Button
                onClick={() => handleVote(votingMode === "v2" ? null : "v2")}
                className={`px-6 border ${
                  votingMode === "v2"
                    ? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-br from-green-500/25 via-green-400/20 to-emerald-500/25 backdrop-blur-lg border-green-500 text-white hover:bg-green-500/30"
                }`}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {versionHistory.find((v) => v.id === currentVersions.right)?.label} is Better
              </Button>
              <Button
                onClick={() => handleVote(votingMode === "v1" ? null : "v1")}
                className={`px-6 border ${
                  votingMode === "v1"
                    ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/25"
                    : "bg-gradient-to-br from-red-500/15 via-red-400/10 to-pink-500/15 backdrop-blur-lg border-red-500/50 text-white hover:bg-red-500/20"
                }`}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                {versionHistory.find((v) => v.id === currentVersions.left)?.label} was Better
              </Button>
            </CardContent>
          </Card>

          {/* Questions Slide-out Panel */}
          <AnimatePresence>
            {showQuestionsPanel && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setShowQuestionsPanel(false)}
                />

                {/* Slide-out Panel - Covers entire right side */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-[75vw] bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border-l border-white/20 z-50 flex flex-col shadow-2xl"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <HelpCircle className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Professional Questions</h2>
                        <p className="text-sm text-white/60">Answer strategic questions to improve your prompts</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowQuestionsPanel(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {Object.entries(questionStates).map(([key, question]) => {
                        if (question.rejected) return null

                        return (
                          <div
                            key={key}
                            className={`rounded-xl p-6 border transition-all duration-300 ${
                              question.approved
                                ? "bg-green-500/10 border-green-400/40 shadow-lg shadow-green-500/20"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryGradient(question.categoryColor)}`}
                                >
                                  {question.category}
                                </span>
                                <span className="text-white font-semibold text-lg">{question.question}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleShowWhyMatters(question.whyMatters)}
                                  className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
                                >
                                  <HelpCircle className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleQuestionApprove(key as keyof typeof questionStates)}
                                  className={`h-10 w-10 p-0 rounded-full transition-all duration-200 ${
                                    question.approved
                                      ? "bg-green-500/40 border-green-400/60 shadow-lg shadow-green-500/30"
                                      : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/40"
                                  }`}
                                >
                                  <Check className="h-4 w-4 text-green-400" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleQuestionReject(key as keyof typeof questionStates)}
                                  className="h-10 w-10 p-0 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-full"
                                >
                                  <span className="text-red-400 text-xl leading-none">✕</span>
                                </Button>
                              </div>
                            </div>
                            <Input
                              value={question.answer}
                              onChange={(e) =>
                                handleQuestionAnswerChange(key as keyof typeof questionStates, e.target.value)
                              }
                              placeholder={question.placeholder}
                              className="bg-white/5 border-white/20 text-white text-base"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Panel Footer - Apply Button */}
                  {getApprovedQuestions().length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                      <Button
                        onClick={() => {
                          const approvedQuestions = getApprovedQuestions()
                          console.log("Applying selected questions to prompt:", approvedQuestions)
                          setShowQuestionsPanel(false)
                        }}
                        className="w-full bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white py-4 text-lg font-semibold"
                      >
                        <Sparkles className="mr-3 h-5 w-5" />
                        Apply {getApprovedQuestions().length} Question{getApprovedQuestions().length !== 1 ? "s" : ""}{" "}
                        to Prompt
                      </Button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Examples Slide-out Panel - Covers the entire right side */}
          <AnimatePresence>
            {showExamplesPanel && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setShowExamplesPanel(false)}
                />

                {/* Slide-out Panel - Covers entire right side */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-[75vw] bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border-l border-white/20 z-50 flex flex-col shadow-2xl"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Professional Examples</h2>
                        <p className="text-sm text-white/60">Enhance your prompts with specific examples</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowExamplesPanel(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Example 1 */}
                      {!exampleStates.example1.rejected && (
                        <div
                          className={`rounded-xl p-6 border transition-all duration-300 ${
                            exampleStates.example1.approved
                              ? "bg-green-500/10 border-green-400/40 shadow-lg shadow-green-500/20"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-white font-semibold text-lg">Output Format Example #1</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleExampleApprove("example1")}
                                className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                                  exampleStates.example1.approved
                                    ? "bg-green-500/40 border-green-400/60 shadow-lg shadow-green-500/30"
                                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/40"
                                }`}
                              >
                                <Check className="h-4 w-4 text-green-400" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleExampleReject("example1")}
                                className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-full"
                              >
                                <span className="text-red-400 text-xl leading-none">✕</span>
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={exampleStates.example1.text}
                            onChange={(e) => handleExampleTextChange("example1", e.target.value)}
                            className="bg-white/5 border-white/20 text-white text-sm font-mono min-h-[300px] resize-none"
                          />
                        </div>
                      )}

                      {/* Example 2 */}
                      {!exampleStates.example2.rejected && (
                        <div
                          className={`rounded-xl p-6 border transition-all duration-300 ${
                            exampleStates.example2.approved
                              ? "bg-green-500/10 border-green-400/40 shadow-lg shadow-green-500/20"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-white font-semibold text-lg">Output Format Example #2</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleExampleApprove("example2")}
                                className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                                  exampleStates.example2.approved
                                    ? "bg-green-500/40 border-green-400/60 shadow-lg shadow-green-500/30"
                                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/40"
                                }`}
                              >
                                <Check className="h-4 w-4 text-green-400" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleExampleReject("example2")}
                                className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-full"
                              >
                                <span className="text-red-400 text-xl leading-none">✕</span>
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={exampleStates.example2.text}
                            onChange={(e) => handleExampleTextChange("example2", e.target.value)}
                            className="bg-white/5 border-white/20 text-white text-sm font-mono min-h-[300px] resize-none"
                          />
                        </div>
                      )}

                      {/* Example 3 */}
                      {!exampleStates.example3.rejected && (
                        <div
                          className={`rounded-xl p-6 border transition-all duration-300 ${
                            exampleStates.example3.approved
                              ? "bg-green-500/10 border-green-400/40 shadow-lg shadow-green-500/20"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className="text-white font-semibold text-lg">Output Format Example #3</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleExampleApprove("example3")}
                                className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                                  exampleStates.example3.approved
                                    ? "bg-green-500/40 border-green-400/60 shadow-lg shadow-green-500/30"
                                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-400/40"
                                }`}
                              >
                                <Check className="h-4 w-4 text-green-400" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleExampleReject("example3")}
                                className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-full"
                              >
                                <span className="text-red-400 text-xl leading-none">✕</span>
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={exampleStates.example3.text}
                            onChange={(e) => handleExampleTextChange("example3", e.target.value)}
                            className="bg-white/5 border-white/20 text-white text-sm font-mono min-h-[300px] resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Panel Footer - Apply Button */}
                  {getApprovedExamples().length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                      <Button
                        onClick={() => {
                          const approvedExamples = getApprovedExamples()
                          console.log("Applying selected examples to prompt:", approvedExamples)
                          setShowExamplesPanel(false)
                        }}
                        className="w-full bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white py-4 text-lg font-semibold"
                      >
                        <Sparkles className="mr-3 h-5 w-5" />
                        Apply {getApprovedExamples().length} Example{getApprovedExamples().length !== 1 ? "s" : ""} to
                        Prompt
                      </Button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Why Matters Modal */}
          <AnimatePresence>
            {showWhyMattersModal && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setShowWhyMattersModal(false)}
                />

                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,600px)] bg-gray-900/95 backdrop-blur-2xl rounded-xl border border-white/20 z-50 flex flex-col shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Why This Matters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowWhyMattersModal(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-white/80 leading-relaxed">{whyMattersContent}</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      {showPromptInputModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Paste your prompt here ↓</h2>
            </div>
            <div className="space-y-6">
              <Textarea
                value={userPromptInput}
                onChange={(e) => setUserPromptInput(e.target.value)}
                placeholder="Paste your prompt here..."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[200px] text-base leading-relaxed resize-none"
              />
              <Button
                onClick={handleStartWithPrompt}
                className="w-full bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white py-4 text-lg font-semibold"
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
