"use client"

import { User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock session for prototype - replace with real auth later
const mockSession = {
  user: {
    email: "demo@example.com",
  },
}

function useSession() {
  return {
    data: mockSession,
  }
}

function ProfileView() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/")
    }
  }, [session])

  if (!session) return null

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects matching the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Account Profile</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Manage your account settings</p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 max-w-2xl mx-auto">
          {/* Account Information Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-white/10 rounded-xl mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account Information</h2>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-400 block mb-2">Email Address</label>
              <p className="text-xl font-semibold text-white">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
