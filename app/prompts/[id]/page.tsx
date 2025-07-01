"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Zap, BarChart3, Edit, Share2 } from "lucide-react"
import WorkingView from "@/components/prompt-forensics/working-view"

interface PromptVersion {
  id: string
  version: number
  systemPrompt: string
  userPrompt: string
  content: string
  isActive: boolean
  tokensUsed: number
  createdAt: string
  generationParams: any
  metadata: any
  questions: any[]
  examples: any[]
  testResults: any[]
}

interface PromptData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  tokensUsed: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  versions: PromptVersion[]
  tests: any[]
  feedback: any[]
  stats: {
    versionCount: number
    testCount: number
    feedbackCount: number
    totalTokensUsed: number
  }
}

export default function PromptDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const promptId = params.id as string

  const [prompt, setPrompt] = useState<PromptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/")
      return
    }
  }, [session, status, router])

  // Fetch prompt details
  useEffect(() => {
    if (!session || !promptId) return
    
    fetchPromptDetails()
  }, [session, promptId])

  const fetchPromptDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/prompts/${promptId}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setError("Prompt not found")
        } else {
          setError(data.error || "Failed to load prompt")
        }
        return
      }

      setPrompt(data)
    } catch (error) {
      console.error("Error fetching prompt:", error)
      setError("Failed to load prompt. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit prompt:", promptId)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share prompt:", promptId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Transform prompt data for WorkingView component
  const getWorkingViewData = () => {
    if (!prompt || !prompt.versions.length) return null

    const latestVersion = prompt.versions[0] // Versions are ordered by version desc
    
    return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      content: latestVersion.content,
      tags: prompt.tags,
      suggestions: latestVersion.metadata?.suggestions || []
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
          <Button
            onClick={handleBack}
            variant="outline"
            className="bg-transparent border-white/20 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Prompt not found</div>
      </div>
    )
  }

  const workingViewData = getWorkingViewData()

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{prompt.title}</h1>
              <p className="text-white/70">{prompt.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Prompt Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prompt.stats.versionCount}</div>
              <p className="text-sm text-white/60">
                Latest: V{prompt.versions[0]?.version || 1}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Tokens Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prompt.stats.totalTokensUsed}</div>
              <p className="text-sm text-white/60">
                Across all versions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{formatDate(prompt.updatedAt)}</div>
              <p className="text-sm text-white/60">
                Created {formatDate(prompt.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tags and Category */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            {prompt.category}
          </Badge>
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/20 text-white/80">
              {tag}
            </Badge>
          ))}
          {prompt.isPublic && (
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              Public
            </Badge>
          )}
        </div>
      </div>

      {/* Working View */}
      {workingViewData && (
        <div className="container mx-auto px-6">
          <WorkingView
            promptType="system-user"
            generatedPromptData={workingViewData}
            isFromPromptInput={false}
          />
        </div>
      )}
    </div>
  )
}