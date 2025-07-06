'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthProvider'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  const connect = () => {
    if (socket?.connected) return

    const token = localStorage.getItem('token')
    if (!token) return

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    if (user) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [user])

  const value = {
    socket,
    isConnected,
    connect,
    disconnect,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
} 