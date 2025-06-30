import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes and all API routes
        const publicPaths = ['/', '/auth/error']
        const isPublicPath = publicPaths.some(path => 
          req.nextUrl.pathname === path || 
          req.nextUrl.pathname.startsWith('/api/')
        )
        
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