"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Calendar,
  Zap,
  FileText,
  TrendingUp,
  Filter,
  SortAsc,
  MoreHorizontal
} from "lucide-react"
import { Spotlight } from "@/components/ui/spotlight"

interface Prompt {
  id: string
  title: string
  description: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  versionCount: number
  testCount: number
  feedbackCount: number
  latestVersion: any
}

interface UserStats {
  totalPrompts: number
  totalTokensUsed: number
  currentTokenBalance: number
  promptsThisMonth: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  console.log('🔍 Dashboard Component - Render Start:', {
    sessionStatus: status,
    hasSession: !!session,
    sessionUser: session?.user?.email,
    timestamp: new Date().toISOString()
  })
  
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalPrompts: 0,
    totalTokensUsed: 0,
    currentTokenBalance: 0,
    promptsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('🔍 Dashboard - Auth Check Effect:', {
      status,
      hasSession: !!session,
      willRedirect: status !== "loading" && !session
    })
    
    if (status === "loading") return // Still loading
    if (!session) {
      console.log('🚨 Dashboard - Redirecting to login, no session')
      router.push("/")
      return
    }
    console.log('✅ Dashboard - Auth check passed')
  }, [session, status, router])

  // Fetch user prompts and stats
  useEffect(() => {
    console.log('🔍 Dashboard - Data Fetch Effect:', {
      hasSession: !!session,
      searchTerm,
      selectedCategory,
      sortBy,
      sortOrder,
      page
    })
    
    if (!session) {
      console.log('⚠️ Dashboard - Skipping data fetch, no session')
      return
    }
    
    console.log('📡 Dashboard - Starting data fetch...')
    fetchPrompts()
    fetchUserStats()
  }, [session, searchTerm, selectedCategory, sortBy, sortOrder, page])

  const fetchPrompts = async () => {
    console.log('🔍 Dashboard - fetchPrompts called')
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      })

      console.log('📡 Dashboard - Fetching prompts with params:', params.toString())
      const response = await fetch(`/api/prompts?${params}`)
      console.log('📡 Dashboard - Prompts API response status:', response.status)
      
      const data = await response.json()
      console.log('📡 Dashboard - Prompts API response data:', data)

      if (response.ok) {
        setPrompts(data.prompts)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error("Failed to fetch prompts:", data.error)
      }
    } catch (error) {
      console.error("Error fetching prompts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    console.log('📊 Dashboard - fetchUserStats called')
    try {
      // For now, calculate stats from prompts data
      // In a real implementation, you'd have a dedicated stats endpoint
      console.log('📊 Dashboard - Fetching all prompts for stats calculation')
      const response = await fetch('/api/prompts?limit=1000') // Get all for stats
      console.log('📊 Dashboard - Stats API response status:', response.status)
      
      const data = await response.json()
      console.log('📊 Dashboard - Stats API response data length:', data.prompts?.length || 0)
      
      if (response.ok) {
        const allPrompts = data.prompts
        const thisMonth = new Date()
        thisMonth.setDate(1)
        thisMonth.setHours(0, 0, 0, 0)

        const stats = {
          totalPrompts: allPrompts.length,
          totalTokensUsed: 0, // TODO: Calculate from prompt versions
          currentTokenBalance: 0, // Will be updated with user profile data
          promptsThisMonth: allPrompts.filter((p: Prompt) => 
            new Date(p.createdAt) >= thisMonth
          ).length
        }
        
        setUserStats(stats)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleCreateNew = () => {
    router.push("/")
  }

  const handleViewPrompt = (promptId: string) => {
    router.push(`/prompts/${promptId}`)
  }

  const handleEditPrompt = (promptId: string) => {
    // Open edit modal or navigate to edit page
    console.log("Edit prompt:", promptId)
  }

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        // Refresh prompts list
        fetchPrompts()
      } else {
        const error = await response.json()
        alert(`Failed to delete prompt: ${error.error}`)
      }
    } catch (error) {
      console.error("Error deleting prompt:", error)
      alert("Failed to delete prompt. Please try again.")
    }
  }

  const handleDuplicatePrompt = (promptId: string) => {
    console.log("Duplicate prompt:", promptId)
    // Implement duplication logic
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getVersionStatusColor = (count: number) => {
    if (count >= 3) return "bg-green-500"
    if (count >= 2) return "bg-yellow-500"
    return "bg-blue-500"
  }

  if (status === "loading" || !session) {
    console.log('🔍 Dashboard - Rendering loading state:', { status, hasSession: !!session })
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading... (Status: {status})</div>
      </div>
    )
  }

  console.log('🔍 Dashboard - Rendering main dashboard content')

  return (
    <div className="relative min-h-screen">
      {/* Spotlight effect */}
      <Spotlight className="-top-20 -right-20 md:-top-10 md:-right-10" fill="white" />
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-6 py-8 pt-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-white/70">Manage your prompts and track your progress</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="mt-4 lg:mt-0 bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40 hover:from-blue-500/90 hover:via-blue-400/80 hover:to-purple-500/70 shadow-xl hover:shadow-blue-500/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Total Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalPrompts}</div>
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
              <div className="text-2xl font-bold">{userStats.totalTokensUsed.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.promptsThisMonth}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-2xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Token Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.currentTokenBalance.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="marketing">Marketing</option>
              <option value="writing">Writing</option>
              <option value="coding">Coding</option>
              <option value="analysis">Analysis</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              className="px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="createdAt-desc">Recently Created</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/70">Loading prompts...</div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-white/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No prompts yet</h3>
            <p className="text-white/70 mb-4">Create your first prompt to get started</p>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-br from-blue-500/80 via-blue-400/70 to-purple-500/60 backdrop-blur-xl border border-blue-400/40"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Prompt
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/8 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1 line-clamp-1">
                        {prompt.title}
                      </CardTitle>
                      <p className="text-sm text-white/70 line-clamp-2 mb-3">
                        {prompt.description || "No description"}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prompt.category && (
                      <Badge variant="secondary" className="text-xs">
                        {prompt.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getVersionStatusColor(prompt.versionCount)}`} />
                        V{prompt.versionCount}
                      </span>
                      <span>V{prompt.versionCount}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(prompt.updatedAt)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPrompt(prompt.id)}
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPrompt(prompt.id)}
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicatePrompt(prompt.id)}
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="bg-transparent border-red-400/40 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-transparent border-white/20 text-white"
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={page === pageNum 
                      ? "bg-blue-500 text-white" 
                      : "bg-transparent border-white/20 text-white"
                    }
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-transparent border-white/20 text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}