import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

export default withAuth(
  async function middleware(req) {
    // Add any additional middleware logic here
    console.log('🔍 Middleware - Request:', {
      path: req.nextUrl.pathname,
      method: req.method,
      timestamp: new Date().toISOString()
    })
    
    // Debug JWT token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log('🔍 Middleware - JWT Debug:', {
      hasToken: !!token,
      tokenSub: token?.sub,
      tokenEmail: token?.email
    })
    
    return
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes and all API routes
        const publicPaths = ['/', '/auth/error']
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname === path || 
          req.nextUrl.pathname.startsWith('/api/')
        )
        
        const hasToken = !!token
        const isAuthorized = isPublicPath || hasToken
        
        console.log('🔍 Middleware - Authorization check:', {
          path: req.nextUrl.pathname,
          isPublicPath,
          hasToken,
          isAuthorized,
          tokenUserId: token?.sub || 'none'
        })
        
        if (isPublicPath) {
          return true
        }

        // For protected routes, require a valid token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Match all pages except static files and API routes that don't need auth
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ]
}