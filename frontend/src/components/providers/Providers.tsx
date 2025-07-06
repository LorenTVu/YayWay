'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SocketProvider } from '@/components/providers/SocketProvider'
import { AudioProvider } from '@/components/providers/AudioProvider'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

// Separate component for devtools that only renders on client
function ClientOnlyDevtools() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return <ReactQueryDevtools initialIsOpen={false} />
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </SocketProvider>
      </AuthProvider>
      <ClientOnlyDevtools />
    </QueryClientProvider>
  )
} 