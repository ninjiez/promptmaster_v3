"use client"

import { User, Zap, Calendar, Settings, CreditCard, Activity } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserStats {
  totalPrompts: number
  totalTokensUsed: number
  currentTokenBalance: number
  promptsThisMonth: number
  joinDate: string
}

function ProfileView() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalPrompts: 0,
    totalTokensUsed: 0,
    currentTokenBalance: 0,
    promptsThisMonth: 0,
    joinDate: new Date().toISOString()
  })

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/")
      return
    }

    // Fetch user stats
    fetchUserStats()
  }, [session, status, router])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      
      // Fetch user prompts for stats calculation
      const response = await fetch('/api/prompts?limit=1000')
      const data = await response.json()
      
      if (response.ok) {
        const prompts = data.prompts
        const thisMonth = new Date()
        thisMonth.setDate(1)
        thisMonth.setHours(0, 0, 0, 0)

        const stats = {
          totalPrompts: prompts.length,
          totalTokensUsed: prompts.reduce((sum: number, p: any) => sum + p.tokensUsed, 0),
          currentTokenBalance: 0, // This would come from user profile in a real implementation
          promptsThisMonth: prompts.filter((p: any) => 
            new Date(p.createdAt) >= thisMonth
          ).length,
          joinDate: session?.user?.createdAt || new Date().toISOString()
        }
        
        setUserStats(stats)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#0D1117] relative overflow-hidden">
      {/* Background effects matching the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Account Profile</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Manage your account settings and view your usage</p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Account Information Card */}
          <Card className="lg:col-span-1 bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/10 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    getUserInitials(session.user?.name)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{session.user?.name || "User"}</h3>
                  <p className="text-white/70">{session.user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Member since</span>
                  <span className="text-white">{formatDate(userStats.joinDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Account type</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                    Free User
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Activity className="h-5 w-5" />
                </div>
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{userStats.totalPrompts}</div>
                  <div className="text-sm text-white/70">Total Prompts</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{userStats.totalTokensUsed.toLocaleString()}</div>
                  <div className="text-sm text-white/70">Tokens Used</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{userStats.promptsThisMonth}</div>
                  <div className="text-sm text-white/70">This Month</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-1">{userStats.currentTokenBalance.toLocaleString()}</div>
                  <div className="text-sm text-white/70">Token Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                Token Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Purchase more tokens to continue creating prompts</p>
              <Button className="w-full bg-gradient-to-br from-green-500/80 via-green-400/70 to-emerald-500/60 backdrop-blur-xl border border-green-400/40">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Tokens
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Manage your preferences and account settings</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">View your prompt creation history and activity</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/dashboard")}
              >
                <Activity className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
