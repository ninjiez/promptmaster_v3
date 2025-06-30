"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, ThumbsDown, Send, TrendingUp, Users, Lightbulb, Zap, Plus } from "lucide-react"

export default function FeedbackView() {
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
    type: "feature" as "feature" | "bug" | "improvement",
  })

  const [featureRequests, setFeatureRequests] = useState([
    {
      id: 1,
      title: "Model Comparison Feature",
      description:
        "Allow users to compare outputs from different AI models (GPT-4, Claude, Gemini) side by side to see which performs better for specific prompts. This would help users choose the best model for their use case and understand model strengths.",
      votes: 47,
      status: "under-review",
      author: "Sarah Chen",
      date: "2024-12-20",
      userVoted: true,
      voteType: "up" as "up" | "down" | null,
    },
    {
      id: 2,
      title: "Bulk Synthetic User Inputs Creation",
      description:
        "Generate multiple synthetic user inputs automatically based on a single example or prompt pattern. This would help users test their prompts against various scenarios without manually creating each test case, improving prompt robustness.",
      votes: 32,
      status: "planned",
      author: "Mike Rodriguez",
      date: "2024-12-18",
      userVoted: false,
      voteType: null,
    },
  ])

  const [userFeedback] = useState([
    {
      id: 1,
      title: "Love the new examples feature!",
      description:
        "The examples unlock feature really helped me improve my prompts. Would love to see more example templates.",
      type: "feature",
      status: "acknowledged",
      date: "2024-12-22",
    },
    {
      id: 2,
      title: "Voting buttons sometimes don't respond",
      description: "When comparing V1 vs V2, sometimes the voting buttons don't register clicks on mobile.",
      type: "bug",
      status: "in-progress",
      date: "2024-12-21",
    },
  ])

  const handleSubmitFeedback = () => {
    console.log("Submitting feedback:", newFeedback)
    // Here you would submit to your backend
    setNewFeedback({ title: "", description: "", type: "feature" })
  }

  const handleVote = (requestId: number, voteType: "up" | "down") => {
    console.log(`Voting ${voteType} on request ${requestId}`)

    // Update the feature requests state
    setFeatureRequests((prev) =>
      prev.map((request) => {
        if (request.id === requestId) {
          const wasVoted = request.userVoted
          const previousVoteType = request.voteType

          // If clicking the same vote type, remove the vote
          if (wasVoted && previousVoteType === voteType) {
            return {
              ...request,
              userVoted: false,
              voteType: null,
              votes: request.votes - 1,
            }
          }

          // If switching vote types
          if (wasVoted && previousVoteType !== voteType) {
            return {
              ...request,
              voteType: voteType,
              votes: voteType === "up" ? request.votes + 2 : request.votes - 2,
            }
          }

          // If voting for the first time
          return {
            ...request,
            userVoted: true,
            voteType: voteType,
            votes: voteType === "up" ? request.votes + 1 : request.votes - 1,
          }
        }
        return request
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30"
      case "under-review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
      case "in-progress":
        return "bg-purple-500/20 text-purple-300 border-purple-400/30"
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Lightbulb className="h-4 w-4" />
      case "bug":
        return <Zap className="h-4 w-4" />
      case "improvement":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            Feedback & Feature Requests
          </CardTitle>
          <p className="text-white/60">
            Help us improve PromptGOD by sharing your feedback and voting on feature requests
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Submit Feedback */}
        <div className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-400" />
                Submit Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-type" className="text-white">
                  Type
                </Label>
                <div className="flex gap-2">
                  {["feature", "bug", "improvement"].map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={newFeedback.type === type ? "default" : "outline"}
                      onClick={() => setNewFeedback((prev) => ({ ...prev, type: type as any }))}
                      className={`capitalize ${
                        newFeedback.type === type
                          ? "bg-blue-500 text-white border-blue-400"
                          : "border-white/30 text-gray-300 hover:bg-white/10 hover:text-white bg-transparent"
                      }`}
                    >
                      {getTypeIcon(type)}
                      <span className="ml-1">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-title" className="text-white">
                  Title
                </Label>
                <Input
                  id="feedback-title"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your feedback"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="feedback-description"
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your feedback..."
                  className="bg-white/5 border-white/20 text-white min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleSubmitFeedback}
                className="w-full bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30 text-white"
                disabled={!newFeedback.title || !newFeedback.description}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Your Feedback */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Your Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userFeedback.map((feedback) => (
                <div key={feedback.id} className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-white text-sm">{feedback.title}</h4>
                    <Badge className={`text-xs ${getStatusColor(feedback.status)}`}>{feedback.status}</Badge>
                  </div>
                  <p className="text-white/60 text-xs line-clamp-2">{feedback.description}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    {getTypeIcon(feedback.type)}
                    <span>{feedback.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Feature Requests */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Popular Feature Requests
              </CardTitle>
              <p className="text-white/60 text-sm">Vote on features you'd like to see implemented</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureRequests.map((request) => (
                <div key={request.id} className="bg-white/5 rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-2">{request.title}</h3>
                      <p className="text-white/70 leading-relaxed mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span>by {request.author}</span>
                        <span>{request.date}</span>
                        <Badge className={`${getStatusColor(request.status)}`}>{request.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-white/40" />
                      <span className="text-white/60 text-sm">{request.votes} votes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleVote(request.id, "up")}
                        className={`h-8 px-3 transition-all duration-200 ${
                          request.userVoted && request.voteType === "up"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-green-500/20 hover:bg-green-500/40 border border-green-400/40 text-green-400 hover:text-green-300"
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVote(request.id, "down")}
                        className={`h-8 px-3 transition-all duration-200 ${
                          request.userVoted && request.voteType === "down"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-red-500/20 hover:bg-red-500/40 border border-red-400/40 text-red-400 hover:text-red-300"
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
