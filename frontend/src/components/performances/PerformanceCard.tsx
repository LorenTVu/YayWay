import React from 'react'
import { Card } from '@/components/ui/Card'

interface Performance {
  id: string
  songTitle: string
  artist: string
  score: number
  duration: number
  createdAt: string
  likes: number
  user: {
    id: string
    username: string
    avatar?: string
  }
}

interface PerformanceCardProps {
  performance: Performance
  onLike?: (performanceId: string) => void
  onPlay?: (performanceId: string) => void
}

export function PerformanceCard({ performance, onLike, onPlay }: PerformanceCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
          {performance.user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{performance.songTitle}</h3>
          <p className="text-white/70 text-sm">{performance.artist}</p>
          <div className="flex items-center space-x-4 text-xs text-white/50 mt-1">
            <span>by {performance.user.username}</span>
            <span>•</span>
            <span>{formatDuration(performance.duration)}</span>
            <span>•</span>
            <span>{formatDate(performance.createdAt)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{performance.score}</div>
          <div className="text-white/70 text-xs">Score</div>
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => onLike?.(performance.id)}
              className="text-white/70 hover:text-red-400 transition-colors"
            >
              ❤️ {performance.likes}
            </button>
            {onPlay && (
              <button
                onClick={() => onPlay(performance.id)}
                className="text-white/70 hover:text-green-400 transition-colors"
              >
                ▶️
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 