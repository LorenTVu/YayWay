'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useSocket } from '@/components/providers/SocketProvider'
import { useAudio } from '@/components/providers/AudioProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface RoomUser {
  id: string
  username: string
  avatar?: string
  isHost: boolean
  isPerforming: boolean
  isReady: boolean
}

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  lyrics: string[]
  audioUrl: string
}

interface RoomState {
  id: string
  name: string
  type: 'solo' | 'group' | 'public' | 'private'
  users: RoomUser[]
  currentSong?: Song
  currentPerformer?: string
  queue: Song[]
  isPlaying: boolean
  currentTime: number
  duration: number
  currentLyricIndex: number
}

export default function RoomPage() {
  const { user, isLoading } = useAuth()
  const { socket } = useSocket()
  const { play, pause, stop, isPlaying, currentTime } = useAudio()
  const router = useRouter()
  const params = useParams()
  const roomId = params.id as string

  const [room, setRoom] = useState<RoomState | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: string}>>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPerforming, setIsPerforming] = useState(false)
  const [performanceScore, setPerformanceScore] = useState(0)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && socket && roomId) {
      // Join room
      socket.emit('join-room', { roomId, userId: user._id, username: user.username })
      
      // Listen for room updates
      socket.on('room-update', (updatedRoom: RoomState) => {
        setRoom(updatedRoom)
      })

      // Listen for chat messages
      socket.on('chat-message', (message: any) => {
        setChatMessages(prev => [...prev, message])
      })

      // Listen for performance start
      socket.on('performance-start', (data: any) => {
        if (data.performerId === user._id) {
          setIsPerforming(true)
          setPerformanceScore(0)
        }
      })

      // Listen for performance end
      socket.on('performance-end', (data: any) => {
        if (data.performerId === user._id) {
          setIsPerforming(false)
          setPerformanceScore(data.score || 0)
        }
      })

      // Listen for song change
      socket.on('song-change', (song: Song) => {
        setRoom(prev => prev ? { ...prev, currentSong: song } : null)
      })

      // Listen for lyrics sync
      socket.on('lyrics-sync', (data: { lyricIndex: number, time: number }) => {
        setRoom(prev => prev ? { ...prev, currentLyricIndex: data.lyricIndex } : null)
      })

      setIsConnected(true)

      return () => {
        socket.emit('leave-room', { roomId, userId: user._id })
        socket.off('room-update')
        socket.off('chat-message')
        socket.off('performance-start')
        socket.off('performance-end')
        socket.off('song-change')
        socket.off('lyrics-sync')
      }
    }
  }, [user, socket, roomId])

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    // Scroll lyrics to current line
    if (lyricsContainerRef.current && room?.currentLyricIndex !== undefined) {
      const lyricElements = lyricsContainerRef.current.children
      if (lyricElements[room.currentLyricIndex]) {
        lyricElements[room.currentLyricIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [room?.currentLyricIndex])

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('send-message', {
        roomId,
        message: newMessage.trim()
      })
      setNewMessage('')
    }
  }

  const startPerformance = () => {
    if (selectedSong && socket) {
      socket.emit('start-performance', {
        roomId,
        songId: selectedSong.id
      })
    }
  }

  const endPerformance = () => {
    if (socket) {
      socket.emit('end-performance', {
        roomId,
        score: performanceScore
      })
    }
  }

  const addToQueue = (song: Song) => {
    if (socket) {
      socket.emit('add-to-queue', {
        roomId,
        songId: song.id
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-karaoke-bg flex items-center justify-center">
        <div className="karaoke-loading">
          <div className="karaoke-loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user || !room) {
    return null
  }

  return (
    <div className="min-h-screen bg-karaoke-bg">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">🎤 {room.name}</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-white/70 text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/70">{room.users.length} users</span>
              <Button 
                onClick={() => router.push('/rooms')}
                variant="ghost"
              >
                Leave Room
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lyrics and Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Song Display */}
            {room.currentSong && (
              <Card className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {room.currentSong.title}
                  </h2>
                  <p className="text-white/70 mb-4">{room.currentSong.artist}</p>
                  {room.currentPerformer && (
                    <p className="text-purple-400 mb-4">
                      Performed by: {room.users.find(u => u.id === room.currentPerformer)?.username}
                    </p>
                  )}
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(room.currentTime / room.duration) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>{Math.floor(room.currentTime / 60)}:{(room.currentTime % 60).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(room.duration / 60)}:{(room.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Lyrics Display */}
            {room.currentSong && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Lyrics</h3>
                <div 
                  ref={lyricsContainerRef}
                  className="h-64 overflow-y-auto space-y-2"
                >
                  {room.currentSong.lyrics.map((line, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded transition-all duration-300 ${
                        index === room.currentLyricIndex
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white font-semibold'
                          : 'text-white/70'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Performance Controls */}
            {isPerforming && (
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Performance</h3>
                  <div className="text-3xl font-bold text-green-400 mb-4">
                    Score: {performanceScore}
                  </div>
                  <Button
                    onClick={endPerformance}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    End Performance
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Users, Chat, Queue */}
          <div className="space-y-6">
            {/* Users List */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Users ({room.users.length})</h3>
              <div className="space-y-2">
                {room.users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium">{user.username}</span>
                      {user.isHost && <span className="text-yellow-400 ml-2">👑</span>}
                      {user.isPerforming && <span className="text-green-400 ml-2">🎤</span>}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${user.isReady ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Chat</h3>
              <div 
                ref={chatContainerRef}
                className="h-48 overflow-y-auto space-y-2 mb-4"
              >
                {chatMessages.map((message) => (
                  <div key={message.id} className="p-2 bg-white/5 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-400 font-medium">{message.user}</span>
                      <span className="text-white/50 text-xs">{message.timestamp}</span>
                    </div>
                    <p className="text-white mt-1">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button onClick={sendMessage} size="sm">
                  Send
                </Button>
              </div>
            </Card>

            {/* Song Queue */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Queue ({room.queue.length})</h3>
              <div className="space-y-2">
                {room.queue.map((song, index) => (
                  <div key={song.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                    <span className="text-white/50 text-sm">{index + 1}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{song.title}</div>
                      <div className="text-white/70 text-sm">{song.artist}</div>
                    </div>
                  </div>
                ))}
                {room.queue.length === 0 && (
                  <p className="text-white/50 text-center py-4">No songs in queue</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 