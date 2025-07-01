import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../lib/auth/provider'
import LayoutWrapper from './layout-wrapper'

export const metadata: Metadata = {
  title: 'PromptGOD - AI Prompt Engineering Made Easy',
  description: 'Transform your ideas into perfect AI prompts with our advanced optimization tools',
  generator: 'PromptGOD',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
