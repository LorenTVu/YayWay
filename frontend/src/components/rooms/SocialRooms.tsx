'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mic, Lock, Unlock, Crown, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Room {
  id: string
  name: string
  host: {
    id: string
    username: string
    avatar?: string
  }
  participants: Array<{
    id: string
    username: string
    avatar?: string
    isPerforming: boolean
  }>
  currentSong?: {
    title: string
    artist: string
  }
  isPrivate: boolean
  maxParticipants: number
  isActive: boolean
  tags: string[]
}

interface SocialRoomsProps {
  onJoinRoom?: (roomId: string) => void
  onCreateRoom?: () => void
}

export function SocialRooms({ onJoinRoom, onCreateRoom }: SocialRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'public' | 'private'>('all')

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: '1',
        name: 'Pop Hits Party',
        host: {
          id: '1',
          username: 'Sarah',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        participants: [
          { id: '1', username: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', isPerforming: true },
          { id: '2', username: 'Mike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', isPerforming: false },
          { id: '3', username: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', isPerforming: false }
        ],
        currentSong: { title: 'Blinding Lights', artist: 'The Weeknd' },
        isPrivate: false,
        maxParticipants: 10,
        isActive: true,
        tags: ['Pop', '2020s', 'Party']
      },
      {
        id: '2',
        name: 'Chill Vibes Only',
        host: {
          id: '4',
          username: 'Alex',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        participants: [
          { id: '4', username: 'Alex', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', isPerforming: false },
          { id: '5', username: 'Lisa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', isPerforming: false }
        ],
        currentSong: { title: 'Levitating', artist: 'Dua Lipa' },
        isPrivate: false,
        maxParticipants: 8,
        isActive: true,
        tags: ['Chill', 'Pop', 'Relaxed']
      },
      {
        id: '3',
        name: 'Friends Only',
        host: {
          id: '6',
          username: 'David',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        participants: [
          { id: '6', username: 'David', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', isPerforming: false },
          { id: '7', username: 'Anna', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', isPerforming: false }
        ],
        currentSong: undefined,
        isPrivate: true,
        maxParticipants: 6,
        isActive: false,
        tags: ['Private', 'Friends']
      }
    ]
    setRooms(mockRooms)
  }, [])

  const filteredRooms = rooms.filter(room => {
    if (selectedFilter === 'public') return !room.isPrivate
    if (selectedFilter === 'private') return room.isPrivate
    return true
  })

  const handleJoinRoom = (roomId: string) => {
    onJoinRoom?.(roomId)
  }

  return (
    <div className="karaoke-card p-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-karaoke-text mb-2">
            Social Rooms
          </h3>
          <p className="text-karaoke-muted">
            Join public rooms or create your own private space
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 lg:mt-0">
          <Button
            variant={selectedFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setSelectedFilter('all')}
            size="sm"
          >
            All Rooms
          </Button>
          <Button
            variant={selectedFilter === 'public' ? 'primary' : 'secondary'}
            onClick={() => setSelectedFilter('public')}
            size="sm"
          >
            Public
          </Button>
          <Button
            variant={selectedFilter === 'private' ? 'primary' : 'secondary'}
            onClick={() => setSelectedFilter('private')}
            size="sm"
          >
            Private
          </Button>
          <Button
            variant="primary"
            onClick={onCreateRoom}
            size="sm"
          >
            Create Room
          </Button>
        </div>
      </div>

      {/* Horizontal Rooms Layout */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-4 min-w-max">
          <AnimatePresence>
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1 }}
                className="karaoke-card p-6 w-80 flex-shrink-0 hover:scale-105 hover:bg-white/30 transition-all duration-300 bg-white/10"
              >
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {room.isPrivate ? (
                      <Lock className="w-4 h-4 text-red-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-400" />
                    )}
                    <h4 className="font-semibold text-karaoke-text">{room.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-karaoke-muted text-sm">
                    <Users className="w-4 h-4" />
                    <span>{room.participants.length}/{room.maxParticipants}</span>
                  </div>
                </div>

                {/* Current Song */}
                {room.currentSong && (
                  <div className="mb-4 p-3 bg-primary-500/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {room.isActive ? (
                        <Play className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Pause className="w-4 h-4 text-karaoke-muted" />
                      )}
                      <span className="text-sm font-medium text-karaoke-text">Now Playing</span>
                    </div>
                    <p className="text-sm text-karaoke-muted">
                      {room.currentSong.title} - {room.currentSong.artist}
                    </p>
                  </div>
                )}

                {/* Participants */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-karaoke-text mb-2">Participants</h5>
                  <div className="flex flex-wrap gap-2">
                    {room.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="relative group"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-karaoke-border">
                          <img
                            src={participant.avatar || `https://ui-avatars.com/api/?name=${participant.username}&background=random`}
                            alt={participant.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {participant.isPerforming && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-400 rounded-full flex items-center justify-center">
                            <Mic className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {participant.id === room.host.id && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-karaoke-bg text-xs text-karaoke-text rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {participant.username}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {room.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-karaoke-surface text-xs text-karaoke-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  variant="primary"
                  onClick={() => handleJoinRoom(room.id)}
                  className="w-full"
                  disabled={room.participants.length >= room.maxParticipants}
                >
                  {room.participants.length >= room.maxParticipants ? 'Room Full' : 'Join Room'}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-karaoke-muted mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-karaoke-text mb-2">
            No rooms available
          </h4>
          <p className="text-karaoke-muted mb-4">
            Be the first to create a room and start singing!
          </p>
          <Button variant="primary" onClick={onCreateRoom}>
            Create First Room
          </Button>
        </div>
      )}
    </div>
  )
} 