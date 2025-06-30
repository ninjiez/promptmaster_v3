"use client"

import type React from "react"
import { Lightbulb, FileText } from "lucide-react"
import { ContainerTextFlip } from "@/components/ui/container-text-flip"
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from "motion/react"

interface InitialViewProps {
  onIdeaStart: () => void
  onPromptStart: () => void
}

const GlassCard = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-2xl border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-2xl hover:shadow-white/10 rounded-3xl p-12 text-left w-full max-w-lg transition-all duration-300 hover:scale-105 group"
  >
    <div className="flex flex-col items-center text-center gap-6">
      <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/15 backdrop-blur-xl group-hover:from-white/25 group-hover:via-white/20 group-hover:to-white/25 shadow-lg group-hover:shadow-xl p-6 rounded-2xl transition-colors">
        <Icon className="h-12 w-12 text-blue-300" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
      </div>
    </div>
  </button>
)

export default function InitialView({ onIdeaStart, onPromptStart }: InitialViewProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full overflow-hidden animate-in fade-in duration-1000">
      {/* Spotlight effect from top right corner */}
      <Spotlight className="-top-20 -right-20 md:-top-10 md:-right-10" fill="white" />

      {/* Grid background pattern */}
      <div className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-20 [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]" />

      <div className="relative z-10 text-center mb-20 max-w-4xl">
        <motion.h1
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          className="text-7xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent"
          layout
        >
          <div className="space-y-6">
            <div>Prompt Engineering</div>
            <div className="flex items-center justify-center gap-4">
              Made <ContainerTextFlip words={["Fun", "Smart", "Fast"]} />.
            </div>
          </div>
        </motion.h1>
        <p className="text-2xl md:text-3xl text-white/70 leading-relaxed">
          Easy enough for beginners, powerful enough for experts
        </p>
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
        <GlassCard icon={Lightbulb} title="I have an IDEA" subtitle="Start from your concept" onClick={onIdeaStart} />

        <GlassCard icon={FileText} title="I have a PROMPT" subtitle="Improve existing text" onClick={onPromptStart} />
      </div>
    </div>
  )
}
