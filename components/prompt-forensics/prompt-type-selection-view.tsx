"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Info, FileText, MessageSquare, Bot } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface PromptTypeSelectionViewProps {
  onPromptTypeSelected: (type: "system-user" | "direct", isFromPromptInput?: boolean) => void
}

const InfoModal = ({
  isOpen,
  onClose,
  type,
}: { isOpen: boolean; onClose: () => void; type: "direct" | "system-user" }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                {type === "direct" ? (
                  <MessageSquare className="h-5 w-5 text-blue-300" />
                ) : (
                  <FileText className="h-5 w-5 text-blue-300" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">
                {type === "direct" ? "Direct Prompt" : "System + User Mode"}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            >
              ✕
            </Button>
          </div>

          <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/20">
            <h4 className="font-semibold text-green-300 mb-3">Best for:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              {type === "direct" ? (
                <>
                  <li>• Simple, one-off tasks</li>
                  <li>• Quick content generation</li>
                  <li>• When context is minimal</li>
                  <li>• Straightforward instructions</li>
                </>
              ) : (
                <>
                  <li>• Complex, multi-step workflows</li>
                  <li>• Consistent AI behavior</li>
                  <li>• Role-based interactions</li>
                  <li>• Reusable prompt templates</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function PromptTypeSelectionView({ onPromptTypeSelected }: PromptTypeSelectionViewProps) {
  const [showInfoModal, setShowInfoModal] = useState<"direct" | "system-user" | null>(null)

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative z-10 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Which prompt type are we optimizing?
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">Choose the approach that best fits your use case</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* System + User Mode Card */}
          <div
            onClick={() => onPromptTypeSelected("system-user", true)}
            className="bg-gradient-to-br from-white/5 via-white/2 to-white/5 backdrop-blur-2xl border border-white/10 hover:from-white/8 hover:via-white/4 hover:to-white/8 hover:border-white/20 shadow-xl hover:shadow-2xl rounded-2xl p-5 text-white transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/20 p-2 rounded-xl">
                <FileText className="h-6 w-6 text-purple-300" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInfoModal("system-user")
                }}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-xl font-bold mb-2 text-white">
              System + User Mode <span className="italic text-white/70">{"(Advanced)"}</span>
            </h2>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">AI has specific job role + handles tasks</p>

            <div className="space-y-2">
              <div className="bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-purple-500/10 backdrop-blur-lg rounded-lg p-3 border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">⚙️</span>
                  <span className="text-purple-300 font-medium text-xs">System:</span>
                </div>
                <div className="bg-black/30 rounded p-2 font-mono text-xs text-white/90 border border-white/10">
                  "You are a customer support specialist..."
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 backdrop-blur-lg rounded-lg p-3 border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">👤</span>
                  <span className="text-green-300 font-medium text-xs">User:</span>
                </div>
                <div className="bg-black/30 rounded p-2 font-mono text-xs text-white/90 border border-white/10">
                  "Write a professional refund email for damaged item"
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-500/10 backdrop-blur-lg rounded-lg p-3 border border-orange-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-3 w-3 text-orange-300" />
                  <span className="text-orange-300 font-medium text-xs">AI Answer:</span>
                </div>
                <div className="bg-black/30 rounded p-2 font-mono text-xs text-white/90 border border-white/10">
                  "Dear Valued Customer, I sincerely apologize for the inconvenience caused by the damaged item you
                  received. As your dedicated support specialist, I want to make this right immediately. I've already
                  initiated a full refund to your original payment method, which should appear within 2-3 business days.
                  Additionally, I'm including a 15% discount code for your next purchase as a gesture of goodwill. Thank
                  you for bringing this to our attention and for giving us the opportunity to resolve this matter for
                  you."
                </div>
              </div>
            </div>
          </div>

          {/* Direct Prompt Mode Card */}
          <div
            onClick={() => onPromptTypeSelected("direct", true)}
            className="bg-gradient-to-br from-white/5 via-white/2 to-white/5 backdrop-blur-2xl border border-white/10 hover:from-white/8 hover:via-white/4 hover:to-white/8 hover:border-white/20 shadow-xl hover:shadow-2xl rounded-2xl p-5 text-white transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-300" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInfoModal("direct")
                }}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-xl font-bold mb-2 text-white">
              Direct Prompt Mode <span className="italic text-white/70">{"(Simple)"}</span>
            </h2>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">Direct conversation with AI</p>

            <div className="space-y-2">
              <div className="bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 backdrop-blur-lg rounded-lg p-3 border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">👤</span>
                  <span className="text-green-300 font-medium text-xs">User:</span>
                </div>
                <div className="bg-black/30 rounded p-2 font-mono text-xs text-white/90 border border-white/10">
                  "Write a professional refund email for damaged item"
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-500/10 backdrop-blur-lg rounded-lg p-3 border border-orange-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-3 w-3 text-orange-300" />
                  <span className="text-orange-300 font-medium text-xs">AI Answer:</span>
                </div>
                <div className="bg-black/30 rounded p-2 font-mono text-xs text-white/90 border border-white/10">
                  "Subject: Immediate Refund for Your Damaged Order..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <InfoModal isOpen={showInfoModal === "direct"} onClose={() => setShowInfoModal(null)} type="direct" />
      <InfoModal isOpen={showInfoModal === "system-user"} onClose={() => setShowInfoModal(null)} type="system-user" />
    </div>
  )
}
