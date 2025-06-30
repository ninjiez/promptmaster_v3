'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification link is invalid or has expired.',
  Default: 'An unexpected error occurred during authentication.',
}

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        
        <p className="text-white/70 mb-8">
          {errorMessage}
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}