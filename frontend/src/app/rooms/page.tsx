'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RoomCard } from '@/components/rooms/RoomCard'

interface Room {
  id: string
  name: string
  type: 'solo' | 'group' | 'public' | 'private'
  currentUsers: number
  maxUsers: number
  isActive: boolean
  currentSong?: string
  host: {
    id: string
    username: string
  }
}

export default function RoomsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [filter, setFilter] = useState<'all' | 'solo' | 'group' | 'public' | 'private'>('all')
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user, filter])

  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true)
      // Mock data for now - replace with actual API call
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'Friday Night Karaoke',
          type: 'public',
          currentUsers: 8,
          maxUsers: 20,
          isActive: true,
          currentSong: 'Bohemian Rhapsody',
          host: { id: '1', username: 'musiclover' }
        },
        {
          id: '2',
          name: 'Solo Practice Room',
          type: 'solo',
          currentUsers: 1,
          maxUsers: 1,
          isActive: true,
          host: { id: '2', username: 'singer123' }
        },
        {
          id: '3',
          name: 'Friends Only',
          type: 'private',
          currentUsers: 3,
          maxUsers: 10,
          isActive: true,
          host: { id: '3', username: 'friendhost' }
        },
        {
          id: '4',
          name: 'Rock Classics',
          type: 'group',
          currentUsers: 5,
          maxUsers: 15,
          isActive: false,
          host: { id: '4', username: 'rockstar' }
        }
      ]
      
      const filteredRooms = filter === 'all' 
        ? mockRooms 
        : mockRooms.filter(room => room.type === filter)
      
      setRooms(filteredRooms)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const handleJoinRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}`)
  }

  const handleCreateRoom = () => {
    router.push('/rooms/create')
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-karaoke-bg">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">🎤 Karaoke Rooms</h1>
              <span className="text-white/70">{rooms.length} rooms available</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleCreateRoom}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Create Room
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="ghost"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Filter:</span>
            {(['all', 'solo', 'group', 'public', 'private'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Rooms List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {isLoadingRooms ? (
          <div className="flex items-center justify-center py-12">
            <div className="karaoke-loading">
              <div className="karaoke-loading-spinner"></div>
              <span>Loading rooms...</span>
            </div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinRoom}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl font-bold text-white mb-2">No rooms found</h2>
            <p className="text-white/70 mb-6">
              {filter === 'all' 
                ? 'There are no active rooms at the moment.'
                : `No ${filter} rooms are currently available.`
              }
            </p>
            <Button 
              onClick={handleCreateRoom}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Create the first room!
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
} 