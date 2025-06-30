"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ThumbsUp, ThumbsDown } from "lucide-react"

interface VotingModalProps {
  isOpen: boolean
  onClose: () => void
  voteType: "v1" | "v2" | null
  onSubmit: (data: { context: string; question1: string; question2: string }) => void
}

export default function VotingModal({ isOpen, onClose, voteType, onSubmit }: VotingModalProps) {
  const [context, setContext] = useState("")
  const [question1, setQuestion1] = useState("")
  const [question2, setQuestion2] = useState("")

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

  const handleSubmit = () => {
    if (context.trim().length < 50) return
    onSubmit({ context, question1, question2 })
    setContext("")
    setQuestion1("")
    setQuestion2("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-[#0D1117] border-white/10 text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl flex items-center gap-3">
            {voteType === "v2" ? (
              <>
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                </div>
                Why is V2 Better?
              </>
            ) : (
              <>
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <ThumbsDown className="h-5 w-5 text-red-400" />
                </div>
                Why was V1 Better?
              </>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="context" className="text-sm font-medium flex items-center justify-between">
              <span>Explain your choice in detail *</span>
              <span className={`text-xs ${getStrengthColor(context.length)}`}>
                {context.length} chars - {getStrengthText(context.length)}
              </span>
            </Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Be specific about what made this version better or worse. Consider factors like clarity, completeness, tone, structure, accuracy, and usefulness. The more detail you provide, the better we can improve future prompts..."
              className="bg-white/5 border-white/20 placeholder:text-white/40 min-h-[120px] text-base leading-relaxed resize-none"
            />
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  context.length < 50
                    ? "bg-red-400"
                    : context.length < 100
                      ? "bg-yellow-400"
                      : context.length < 150
                        ? "bg-blue-400"
                        : "bg-green-400"
                }`}
                style={{ width: `${Math.min((context.length / 200) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="font-semibold text-white/90">Additional Questions (Optional)</h3>

            <div className="space-y-3">
              <Label htmlFor="question1" className="text-sm text-white/80">
                What specific aspect could be improved further?
              </Label>
              <Input
                id="question1"
                value={question1}
                onChange={(e) => setQuestion1(e.target.value)}
                placeholder="e.g., More examples, better structure, different tone..."
                className="bg-white/5 border-white/20 placeholder:text-white/40"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="question2" className="text-sm text-white/80">
                How would you use this output in your work?
              </Label>
              <Input
                id="question2"
                value={question2}
                onChange={(e) => setQuestion2(e.target.value)}
                placeholder="e.g., For client presentations, social media, documentation..."
                className="bg-white/5 border-white/20 placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={context.trim().length < 50}
              className={`flex-1 ${
                voteType === "v2" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
