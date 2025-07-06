import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  duration: number
  popularity: number
  thumbnail?: string
}

export function TrendingSongs() {
  const trendingSongs: Song[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      genre: 'Rock',
      duration: 354,
      popularity: 95
    },
    {
      id: '2',
      title: 'Imagine',
      artist: 'John Lennon',
      genre: 'Pop',
      duration: 183,
      popularity: 88
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      genre: 'Rock',
      duration: 391,
      popularity: 92
    },
    {
      id: '4',
      title: 'Wonderwall',
      artist: 'Oasis',
      genre: 'Rock',
      duration: 258,
      popularity: 85
    }
  ]

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Trending Songs</h2>
        <Button 
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {trendingSongs.map((song, index) => (
          <div key={song.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{song.title}</h3>
              <p className="text-white/70 text-sm">{song.artist}</p>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs">{formatDuration(song.duration)}</div>
              <div className="text-green-400 text-xs">🔥 {song.popularity}%</div>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Sing
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
} 