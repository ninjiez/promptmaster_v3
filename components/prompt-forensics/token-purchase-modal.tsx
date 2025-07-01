"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Zap, Star, Crown, Loader2 } from "lucide-react"
import { TOKEN_TIERS, TokenTier } from "@/lib/stripe-config"

interface TokenPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchase?: (tokens: number, price: number) => void
}

const tokenPackages = [
  {
    tier: 'STARTER' as TokenTier,
    tokens: TOKEN_TIERS.STARTER.tokens,
    price: TOKEN_TIERS.STARTER.price / 100,
    icon: Zap,
    title: TOKEN_TIERS.STARTER.name,
    description: TOKEN_TIERS.STARTER.description,
    color: "blue",
    popular: false,
    discount: null,
  },
  {
    tier: 'SKEPTIC' as TokenTier,
    tokens: TOKEN_TIERS.SKEPTIC.tokens,
    price: TOKEN_TIERS.SKEPTIC.price / 100,
    icon: Zap,
    title: TOKEN_TIERS.SKEPTIC.name,
    description: TOKEN_TIERS.SKEPTIC.description,
    color: "gray",
    popular: false,
    discount: null,
  },
  {
    tier: 'PROMPT_KIDDO' as TokenTier,
    tokens: TOKEN_TIERS.PROMPT_KIDDO.tokens,
    price: TOKEN_TIERS.PROMPT_KIDDO.price / 100,
    icon: Star,
    title: TOKEN_TIERS.PROMPT_KIDDO.name,
    description: TOKEN_TIERS.PROMPT_KIDDO.description,
    color: "green",
    popular: true,
    discount: null,
  },
  {
    tier: 'PROMPT_ENGINEER' as TokenTier,
    tokens: TOKEN_TIERS.PROMPT_ENGINEER.tokens,
    price: TOKEN_TIERS.PROMPT_ENGINEER.price / 100,
    icon: Star,
    title: TOKEN_TIERS.PROMPT_ENGINEER.name,
    description: TOKEN_TIERS.PROMPT_ENGINEER.description,
    color: "purple",
    popular: false,
    discount: null,
  },
  {
    tier: 'PROMPT_GOD' as TokenTier,
    tokens: TOKEN_TIERS.PROMPT_GOD.tokens,
    price: TOKEN_TIERS.PROMPT_GOD.price / 100,
    icon: Crown,
    title: TOKEN_TIERS.PROMPT_GOD.name,
    description: TOKEN_TIERS.PROMPT_GOD.description,
    color: "gold",
    popular: false,
    discount: null,
  },
]

export default function TokenPurchaseModal({ isOpen, onClose, onPurchase }: TokenPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handlePurchase = async (tier: TokenTier, tokens: number, price: number) => {
    if (!session) {
      alert('Please log in to purchase tokens')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tier }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create checkout session`)
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
      
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-3xl z-50 flex items-center justify-center p-4">
      <Card className="bg-black/20 backdrop-blur-2xl border-white/10 text-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
          <CardTitle className="text-3xl font-bold">Buy Tokens</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center mb-12">
            <p className="text-white/70 text-xl leading-relaxed">
              Choose the perfect token package for your prompt engineering needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {tokenPackages.map((pkg, index) => {
              const IconComponent = pkg.icon
              const isSelected = selectedPackage === index

              return (
                <Card
                  key={index}
                  className={`relative cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                    pkg.popular
                      ? "bg-white/10 border-white/20 ring-1 ring-green-400/50 shadow-2xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  } ${isSelected ? "scale-105 shadow-2xl" : "hover:scale-102"} rounded-2xl min-h-[420px] ${
                    pkg.color === "blue"
                      ? "bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-cyan-500/15 backdrop-blur-2xl border border-blue-400/25 hover:from-blue-500/20 hover:via-blue-400/15 hover:to-cyan-500/20 hover:border-blue-400/35 shadow-2xl hover:shadow-blue-500/20"
                      : pkg.color === "green"
                        ? "bg-gradient-to-br from-green-500/15 via-green-400/10 to-emerald-500/15 backdrop-blur-2xl border border-green-400/25 hover:from-green-500/20 hover:via-green-400/15 hover:to-emerald-500/20 hover:border-green-400/35 shadow-2xl hover:shadow-green-500/20"
                        : pkg.color === "purple"
                          ? "bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-violet-500/15 backdrop-blur-2xl border border-purple-400/25 hover:from-purple-500/20 hover:via-purple-400/15 hover:to-violet-500/20 hover:border-purple-400/35 shadow-2xl hover:shadow-purple-500/20"
                          : pkg.color === "gold"
                            ? "bg-gradient-to-br from-yellow-500/15 via-yellow-400/10 to-orange-500/15 backdrop-blur-2xl border border-yellow-400/25 hover:from-yellow-500/20 hover:via-yellow-400/15 hover:to-orange-500/20 hover:border-yellow-400/35 shadow-2xl hover:shadow-yellow-500/20"
                            : "bg-gradient-to-br from-gray-500/15 via-gray-400/10 to-slate-500/15 backdrop-blur-2xl border border-gray-400/25 hover:from-gray-500/20 hover:via-gray-400/15 hover:to-slate-500/20 hover:border-gray-400/35 shadow-2xl hover:shadow-gray-500/20"
                  }`}
                  onClick={() => setSelectedPackage(index)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {pkg.discount && (
                    <div className="absolute -top-4 -right-4">
                      <div className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        {pkg.discount}% OFF
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <div
                      className={`mx-auto p-5 rounded-2xl w-fit mb-6 backdrop-blur-xl ${
                        pkg.color === "blue"
                          ? "bg-blue-500/10 border border-blue-400/20"
                          : pkg.color === "green"
                            ? "bg-green-500/10 border border-green-400/20"
                            : pkg.color === "purple"
                              ? "bg-purple-500/10 border border-purple-400/20"
                              : pkg.color === "gold"
                                ? "bg-yellow-500/10 border border-yellow-400/20"
                                : "bg-gray-500/10 border border-gray-400/20"
                      }`}
                    >
                      <IconComponent
                        className={`h-10 w-10 ${
                          pkg.color === "blue"
                            ? "text-blue-400"
                            : pkg.color === "green"
                              ? "text-green-400"
                              : pkg.color === "purple"
                                ? "text-purple-400"
                                : pkg.color === "gold"
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                        }`}
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">{pkg.title}</CardTitle>
                    <p className="text-white/70 text-sm">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="text-center space-y-6 px-6 pb-8">
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-white leading-tight">
                        {pkg.tokens.toLocaleString()}
                        <div className="text-lg font-normal text-white/60 mt-1">tokens</div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-white">
                          ${pkg.price}
                          <span className="text-base font-normal text-white/60 ml-2">USD</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(pkg.tier, pkg.tokens, pkg.price)}
                      disabled={isLoading}
                      className={`w-full mt-8 py-4 text-base font-semibold rounded-xl ${
                        pkg.color === "blue"
                          ? "bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-cyan-500/60 backdrop-blur-xl"
                          : pkg.color === "green"
                            ? "bg-gradient-to-br from-green-500/80 via-green-400/70 to-emerald-500/60 backdrop-blur-xl"
                            : pkg.color === "purple"
                              ? "bg-gradient-to-br from-purple-500/80 via-purple-400/70 to-violet-500/60 backdrop-blur-xl"
                              : pkg.color === "gold"
                                ? "bg-gradient-to-br from-yellow-500/80 via-yellow-400/70 to-orange-500/60 backdrop-blur-xl"
                                : "bg-gradient-to-br from-gray-500/80 via-gray-400/70 to-slate-500/60 backdrop-blur-xl"
                      } text-white transition-all duration-200 disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Purchase Now'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-white/50 text-base leading-relaxed">
              Secure payment powered by Stripe • 30-day money-back guarantee
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
