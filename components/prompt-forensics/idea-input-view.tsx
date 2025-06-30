"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Lightbulb } from "lucide-react"

interface IdeaInputViewProps {
  onGenerateV1: () => void
  onShowLoginModal?: () => void
  onStartGenerating?: () => void
  onStopGenerating?: () => void
}

export default function IdeaInputView({
  onGenerateV1,
  onShowLoginModal,
  onStartGenerating,
  onStopGenerating,
}: IdeaInputViewProps) {
  const [idea, setIdea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!idea.trim()) return

    setIsGenerating(true)
    if (onStartGenerating) onStartGenerating()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    if (onStopGenerating) onStopGenerating()
    onGenerateV1()
  }

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // If clicking the same category, deselect it to show all categories again
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(category)
      setSelectedSubcategory(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="bg-white/10 p-3 rounded-xl w-fit mx-auto mb-4">
            <Lightbulb className="h-8 w-8 text-blue-300" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-3">It's time to bring your idea to life. </h1>
          <p className="text-lg text-white/70">
            Describe what you want to accomplish and we'll create your first optimized prompt.
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">What do you want to create?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={`Describe your professional communication goal in detail...

For example: "I need API docs for our payment service" or "I want investor emails that showcase our growth metrics"`}
              className="bg-white/5 border-white/20 placeholder:text-white/40 min-h-[120px] text-base leading-relaxed resize-none text-white"
            />

            {/* Professional Category System */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold mb-4 text-blue-300 text-base">💡 Quick starts for professionals:</h3>

              {/* Level 1: Quick Start Categories */}
              {!selectedCategory && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => handleCategoryClick("dev")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    💻 Dev Tools
                  </button>

                  <button
                    onClick={() => handleCategoryClick("startup")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    🚀 Startup
                  </button>

                  <button
                    onClick={() => handleCategoryClick("marketing")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    📈 Marketing
                  </button>

                  <button
                    onClick={() => handleCategoryClick("sales")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    🎯 Sales
                  </button>

                  <button
                    onClick={() => handleCategoryClick("business")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    📊 Business
                  </button>

                  <button
                    onClick={() => handleCategoryClick("automation")}
                    className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:via-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl px-2 py-2.5 rounded-full text-center transition-all duration-300 text-sm font-medium text-white/80 hover:text-white"
                  >
                    ⚡ Automation
                  </button>
                </div>
              )}

              {/* Selected Category and Subcategories */}
              {selectedCategory && (
                <div className="space-y-4">
                  <div className="flex items-start gap-6">
                    {/* Selected Category Button on Left - Glass Morphism */}
                    <button
                      onClick={() => handleCategoryClick(selectedCategory)}
                      className="px-2 py-2.5 rounded-full text-center text-sm font-medium bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/40 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex-shrink-0"
                    >
                      {selectedCategory === "dev" && "💻 Dev Tools"}
                      {selectedCategory === "startup" && "🚀 Startup"}
                      {selectedCategory === "marketing" && "📈 Marketing"}
                      {selectedCategory === "sales" && "🎯 Sales"}
                      {selectedCategory === "business" && "📊 Business"}
                      {selectedCategory === "automation" && "⚡ Automation"}
                    </button>

                    {/* Subcategory Buttons on Right */}
                    <div className="flex flex-wrap gap-4 flex-1">
                      {selectedCategory === "dev" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "api-docs" ? null : "api-docs")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "api-docs"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            API Documentation
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "code-docs" ? null : "code-docs")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "code-docs"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Code Documentation
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "tech-tutorials" ? null : "tech-tutorials")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "tech-tutorials"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Technical Tutorials
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "code-reviews" ? null : "code-reviews")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "code-reviews"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Code Reviews
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "github-readme" ? null : "github-readme")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "github-readme"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            GitHub README Files
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "dev-onboarding" ? null : "dev-onboarding")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "dev-onboarding"
                                ? "bg-gradient-to-br from-orange-500/30 via-orange-400/20 to-amber-500/20 backdrop-blur-xl border border-orange-400/40 text-white shadow-2xl shadow-orange-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Developer Onboarding
                          </button>
                        </>
                      )}

                      {selectedCategory === "startup" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "investor-emails" ? null : "investor-emails",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "investor-emails"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Investor Communications
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "pitch-decks" ? null : "pitch-decks")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "pitch-decks"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Pitch Deck Content
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "product-launches" ? null : "product-launches",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "product-launches"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Product Launches
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "feature-announcements" ? null : "feature-announcements",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "feature-announcements"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Feature Announcements
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "user-onboarding" ? null : "user-onboarding",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "user-onboarding"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            User Onboarding
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "mvp-descriptions" ? null : "mvp-descriptions",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "mvp-descriptions"
                                ? "bg-gradient-to-br from-green-500/30 via-emerald-400/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            MVP Descriptions
                          </button>
                        </>
                      )}

                      {selectedCategory === "marketing" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "landing-copy" ? null : "landing-copy")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "landing-copy"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Landing Page Copy
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "email-campaigns" ? null : "email-campaigns",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "email-campaigns"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Email Campaigns
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "content-marketing" ? null : "content-marketing",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "content-marketing"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Content Marketing
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "social-media" ? null : "social-media")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "social-media"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Social Media Content
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "product-marketing" ? null : "product-marketing",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "product-marketing"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Product Marketing
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "seo-content" ? null : "seo-content")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "seo-content"
                                ? "bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-rose-500/20 backdrop-blur-xl border border-rose-400/40 text-white shadow-2xl shadow-rose-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            SEO Content
                          </button>
                        </>
                      )}

                      {selectedCategory === "sales" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "cold-outreach" ? null : "cold-outreach")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "cold-outreach"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Cold Outreach
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "demo-scripts" ? null : "demo-scripts")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "demo-scripts"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Demo Scripts
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "proposals" ? null : "proposals")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "proposals"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Proposal Writing
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "client-presentations" ? null : "client-presentations",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "client-presentations"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Client Presentations
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "follow-up-sequences" ? null : "follow-up-sequences",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "follow-up-sequences"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Follow-up Sequences
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(selectedSubcategory === "lead-nurturing" ? null : "lead-nurturing")
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "lead-nurturing"
                                ? "bg-gradient-to-br from-yellow-500/30 via-amber-400/20 to-amber-500/20 backdrop-blur-xl border border-amber-400/40 text-white shadow-2xl shadow-amber-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Lead Nurturing
                          </button>
                        </>
                      )}

                      {selectedCategory === "business" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "strategic-planning" ? null : "strategic-planning",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "strategic-planning"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Strategic Planning
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "team-communication" ? null : "team-communication",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "team-communication"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Team Communication
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "executive-reports" ? null : "executive-reports",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "executive-reports"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Executive Reports
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "process-documentation" ? null : "process-documentation",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "process-documentation"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Process Documentation
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "meeting-summaries" ? null : "meeting-summaries",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "meeting-summaries"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Meeting Summaries
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "performance-reviews" ? null : "performance-reviews",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "performance-reviews"
                                ? "bg-gradient-to-br from-cyan-500/30 via-teal-400/20 to-teal-500/20 backdrop-blur-xl border border-teal-400/40 text-white shadow-2xl shadow-teal-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Performance Reviews
                          </button>
                        </>
                      )}

                      {selectedCategory === "automation" && (
                        <>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "workflow-automation" ? null : "workflow-automation",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "workflow-automation"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Workflow Automation
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "chatgpt-integrations" ? null : "chatgpt-integrations",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "chatgpt-integrations"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            ChatGPT Integrations
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "ai-tool-prompts" ? null : "ai-tool-prompts",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "ai-tool-prompts"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            AI Tool Prompts
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "data-processing" ? null : "data-processing",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "data-processing"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Data Processing
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "report-generation" ? null : "report-generation",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "report-generation"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Report Generation
                          </button>
                          <button
                            onClick={() =>
                              setSelectedSubcategory(
                                selectedSubcategory === "task-optimization" ? null : "task-optimization",
                              )
                            }
                            className={`px-2 py-2.5 rounded-full transition-all duration-300 text-center text-sm font-medium ${
                              selectedSubcategory === "task-optimization"
                                ? "bg-gradient-to-br from-violet-500/30 via-purple-400/20 to-purple-500/20 backdrop-blur-xl border border-purple-400/40 text-white shadow-2xl shadow-purple-500/25"
                                : "bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-lg border border-white/15 hover:from-white/12 hover:via-white/8 hover:to-white/12 hover:border-white/25 shadow-md hover:shadow-lg text-white/90"
                            }`}
                          >
                            Task Optimization
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sample Starters */}
                  {selectedSubcategory === "api-docs" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Create API documentation for [your endpoints] with real examples that developers can copy-paste. Include authentication methods, request/response schemas, error codes, and practical implementation examples.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create API documentation for [your endpoints] with real examples that developers can
                          copy-paste..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Write error handling guides for [your API] that help developers debug integration issues. Include common error scenarios, troubleshooting steps, and code examples for proper error handling.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write error handling guides for [your API] that help developers debug integration
                          issues..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate OpenAPI specifications for [your REST API] with accurate request/response schemas. Include detailed parameter descriptions, example payloads, and comprehensive endpoint documentation.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate OpenAPI specifications for [your REST API] with accurate request/response
                          schemas..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Dev Tools - Code Documentation */}
                  {selectedSubcategory === "code-docs" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Write clear documentation for [your API/library] that reduces support tickets and onboarding time. Include setup instructions, common use cases, and troubleshooting guides.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write clear documentation for [your API/library] that reduces support tickets and
                          onboarding time..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Create technical specifications for [your feature] that prevent miscommunication with stakeholders. Include detailed requirements, acceptance criteria, and implementation guidelines.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create technical specifications for [your feature] that prevent miscommunication with
                          stakeholders..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate architecture documentation for [your system] that helps new developers understand design decisions. Include system diagrams, data flow, and architectural patterns used.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate architecture documentation for [your system] that helps new developers understand
                          design decisions..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Dev Tools - Technical Tutorials */}
                  {selectedSubcategory === "tech-tutorials" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Write setup guides for [your development environment] that work on different operating systems. Include step-by-step instructions, common issues, and verification steps.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write setup guides for [your development environment] that work on different operating
                          systems..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Create debugging tutorials for common [framework/language] issues your team encounters. Include error messages, root causes, and step-by-step solutions.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create debugging tutorials for common [framework/language] issues your team encounters..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate migration guides for updating from [old version] to [new version] of your stack. Include breaking changes, migration steps, and testing procedures.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate migration guides for updating from [old version] to [new version] of your
                          stack..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Startup - Investor Communications */}
                  {selectedSubcategory === "investor-emails" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Write monthly investor updates for [your startup] that maintain momentum between funding rounds. Include key metrics, milestones achieved, challenges faced, and specific asks for support.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write monthly investor updates for [your startup] that maintain momentum between funding
                          rounds..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Create fundraising emails for [your Series A/B] that get warm introductions to VCs. Focus on traction metrics, market opportunity, and clear funding goals.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create fundraising emails for [your Series A/B] that get warm introductions to VCs..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate investor meeting follow-ups that address concerns and move deals forward. Include answers to questions raised, additional data requested, and next steps.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate investor meeting follow-ups that address concerns and move deals forward..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Startup - Pitch Deck Content */}
                  {selectedSubcategory === "pitch-decks" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Create investor pitch content for [your B2B SaaS] that clearly shows market opportunity and traction. Include problem/solution fit, competitive advantages, and growth metrics.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create investor pitch content for [your B2B SaaS] that clearly shows market opportunity and
                          traction..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Write problem/solution slides for [your startup] that make investors feel the pain point. Include market size, current solutions' shortcomings, and your unique approach.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write problem/solution slides for [your startup] that make investors feel the pain
                          point..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate financial projection slides for [your business model] that are realistic but ambitious. Include revenue forecasts, key assumptions, and path to profitability.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate financial projection slides for [your business model] that are realistic but
                          ambitious..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Startup - Product Launches */}
                  {selectedSubcategory === "product-launches" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Create Product Hunt launch copy for [your product] that drives upvotes and user signups. Include compelling headlines, feature highlights, and clear value propositions.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create Product Hunt launch copy for [your product] that drives upvotes and user signups..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Write launch announcement emails to your user base that maximize feature adoption. Include benefits, usage examples, and clear calls-to-action.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write launch announcement emails to your user base that maximize feature adoption..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate press release content for [your product launch] that tech journalists will actually cover. Include newsworthy angles, industry impact, and quotable insights.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate press release content for [your product launch] that tech journalists will
                          actually cover..."
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sample Starters for Marketing - Landing Page Copy */}
                  {selectedSubcategory === "landing-copy" && (
                    <div className="bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 backdrop-blur-lg border border-blue-400/25 p-4 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-3">💡 Try these starters:</div>
                      <div className="space-y-2 text-white/80 text-sm">
                        <button
                          onClick={() =>
                            setIdea(
                              "Create landing page copy for [your B2B product] that converts traffic from [specific channel]. Include compelling headlines, benefit-focused copy, and strong calls-to-action.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Create landing page copy for [your B2B product] that converts traffic from [specific
                          channel]..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Write PPC landing pages for [your service] that improve Quality Score and conversion rates. Include keyword-relevant headlines, clear value props, and optimized forms.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Write PPC landing pages for [your service] that improve Quality Score and conversion
                          rates..."
                        </button>
                        <button
                          onClick={() =>
                            setIdea(
                              "Generate A/B test variations for [your headline/CTA] to optimize conversion rates. Include multiple angles, emotional triggers, and clear differentiation.",
                            )
                          }
                          className="block w-full text-left p-3 hover:bg-white/15 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/25 bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          • "Generate A/B test variations for [your headline/CTA] to optimize conversion rates..."
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!idea.trim() || isGenerating}
              className="bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 hover:border-blue-400/50 shadow-2xl hover:shadow-blue-500/40 w-full text-white text-base py-4 rounded-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating V1 Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Version 1 Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
