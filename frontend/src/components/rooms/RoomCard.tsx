import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

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

interface RoomCardProps {
  room: Room
  onJoin?: (roomId: string) => void
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'solo': return '🎤'
      case 'group': return '👥'
      case 'public': return '🌍'
      case 'private': return '🔒'
      default: return '🎵'
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'solo': return 'bg-blue-500'
      case 'group': return 'bg-green-500'
      case 'public': return 'bg-orange-500'
      case 'private': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${getRoomTypeColor(room.type)} flex items-center justify-center text-white text-lg`}>
            {getRoomTypeIcon(room.type)}
          </div>
          <div>
            <h3 className="text-white font-semibold">{room.name}</h3>
            <p className="text-white/70 text-sm">Host: {room.host.username}</p>
            <div className="flex items-center space-x-4 text-xs text-white/50">
              <span>{room.currentUsers}/{room.maxUsers} users</span>
              {room.currentSong && (
                <span>🎵 {room.currentSong}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${room.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          {onJoin && (
            <Button 
              onClick={() => onJoin(room.id)}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 