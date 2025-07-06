'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RoomCard } from '@/components/rooms/RoomCard'
import { PerformanceCard } from '@/components/performances/PerformanceCard'
import { TrendingSongs } from '@/components/songs/TrendingSongs'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { StatsOverview } from '@/components/dashboard/StatsOverview'

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

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [recentRooms, setRecentRooms] = useState([])
  const [recentPerformances, setRecentPerformances] = useState<Performance[]>([])
  const [stats, setStats] = useState({
    totalPerformances: 0,
    totalSongs: 0,
    totalPoints: 0,
    rank: 0
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setRecentPerformances([
        {
          id: '1',
          songTitle: 'Blinding Lights',
          artist: 'The Weeknd',
          score: 95,
          duration: 200,
          createdAt: '2024-07-06T12:00:00Z',
          likes: 10,
          user: {
            id: user._id,
            username: user.username,
            avatar: user.avatar || ''
          }
        },
        {
          id: '2',
          songTitle: 'Levitating',
          artist: 'Dua Lipa',
          score: 88,
          duration: 203,
          createdAt: '2024-07-05T15:00:00Z',
          likes: 7,
          user: {
            id: user._id,
            username: user.username,
            avatar: user.avatar || ''
          }
        }
      ])
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch recent rooms, performances, and stats
      // This would be implemented with actual API calls
      console.log('Fetching dashboard data...')
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
              <h1 className="text-2xl font-bold text-white">🎤 YayWay Karaoke</h1>
              <span className="text-white/70">Welcome back, {user.username}!</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/rooms/create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Create Room
              </Button>
              <Button 
                onClick={() => router.push('/profile')}
                variant="secondary"
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => router.push('/rooms/create')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  🎤 Solo Room
                </Button>
                <Button 
                  onClick={() => router.push('/rooms/create?type=group')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  👥 Group Room
                </Button>
                <Button 
                  onClick={() => router.push('/rooms')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  🔍 Find Rooms
                </Button>
                <Button 
                  onClick={() => router.push('/songs')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  🎵 Browse Songs
                </Button>
              </div>
            </Card>

            {/* Recent Performances */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Performances</h2>
              <div className="space-y-4">
                {recentPerformances.length > 0 ? (
                  recentPerformances.map((performance) => (
                    <PerformanceCard key={performance.id} performance={performance} />
                  ))
                ) : (
                  <p className="text-white/70 text-center py-8">
                    No recent performances. Start singing to see your history!
                  </p>
                )}
              </div>
            </Card>

            {/* Trending Songs */}
            <TrendingSongs />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <StatsOverview stats={stats} />

            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Performances</span>
                  <span className="text-white font-semibold">{stats.totalPerformances}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Songs Sung</span>
                  <span className="text-white font-semibold">{stats.totalSongs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Points</span>
                  <span className="text-white font-semibold">{stats.totalPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Global Rank</span>
                  <span className="text-white font-semibold">#{stats.rank}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 