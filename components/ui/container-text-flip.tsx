"use client"
import { motion } from "motion/react"
import type React from "react"

import { useState, useEffect } from "react"

interface ContainerTextFlipProps {
  words: string[]
}

export const ContainerTextFlip: React.FC<ContainerTextFlipProps> = ({ words }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 4000) // Slowed down from 2000ms to 4000ms

    return () => clearInterval(intervalId)
  }, [words.length])

  return (
    <motion.span
      key={words[index]}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="inline-block relative px-4 py-2 rounded-2xl bg-gradient-to-r from-slate-700/30 via-slate-600/40 to-slate-700/30 backdrop-blur-sm border border-white/10"
    >
      {/* Spotlight glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-white/30 to-blue-500/20 rounded-2xl blur-lg opacity-75 animate-pulse" />

      {/* Text content */}
      <span className="relative z-10 text-white font-bold">{words[index]}</span>
    </motion.span>
  )
}
