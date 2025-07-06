'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface UserStats {
  totalPerformances: number
  totalSongs: number
  totalPoints: number
  globalRank: number
  averageScore: number
  favoriteGenre: string
  totalTime: number
  achievements: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Performance {
  id: string
  songTitle: string
  artist: string
  score: number
  date: string
  duration: number
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats>({
    totalPerformances: 0,
    totalSongs: 0,
    totalPoints: 0,
    globalRank: 0,
    averageScore: 0,
    favoriteGenre: 'Pop',
    totalTime: 0,
    achievements: 0
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [recentPerformances, setRecentPerformances] = useState<Performance[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'performances' | 'achievements' | 'settings'>('overview')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats: UserStats = {
        totalPerformances: 42,
        totalSongs: 35,
        totalPoints: 12500,
        globalRank: 156,
        averageScore: 87.5,
        favoriteGenre: 'Rock',
        totalTime: 12600, // in seconds
        achievements: 8
      }
      
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Performance',
          description: 'Complete your first karaoke performance',
          icon: '🎤',
          unlockedAt: '2024-01-15',
          rarity: 'common'
        },
        {
          id: '2',
          name: 'Rock Star',
          description: 'Perform 10 rock songs',
          icon: '🤘',
          unlockedAt: '2024-01-20',
          rarity: 'rare'
        },
        {
          id: '3',
          name: 'Perfect Score',
          description: 'Achieve a perfect score on any song',
          icon: '⭐',
          unlockedAt: '2024-01-25',
          rarity: 'epic'
        }
      ]
      
      const mockPerformances: Performance[] = [
        {
          id: '1',
          songTitle: 'Bohemian Rhapsody',
          artist: 'Queen',
          score: 95,
          date: '2024-01-25',
          duration: 354
        },
        {
          id: '2',
          songTitle: 'Imagine',
          artist: 'John Lennon',
          score: 88,
          date: '2024-01-24',
          duration: 183
        },
        {
          id: '3',
          songTitle: 'Hotel California',
          artist: 'Eagles',
          score: 92,
          date: '2024-01-23',
          duration: 391
        }
      ]
      
      setStats(mockStats)
      setAchievements(mockAchievements)
      setRecentPerformances(mockPerformances)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      default: return 'text-white'
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
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
              <h1 className="text-2xl font-bold text-white">👤 Profile</h1>
              <span className="text-white/70">{user.username}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="ghost"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
              <p className="text-white/70 mb-4">Member since {new Date().toLocaleDateString()}</p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.globalRank}</div>
                  <div className="text-white/70 text-sm">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalPoints}</div>
                  <div className="text-white/70 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.achievements}</div>
                  <div className="text-white/70 text-sm">Achievements</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {(['overview', 'performances', 'achievements', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">🎤</div>
              <div className="text-2xl font-bold text-white">{stats.totalPerformances}</div>
              <div className="text-white/70">Performances</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">🎵</div>
              <div className="text-2xl font-bold text-white">{stats.totalSongs}</div>
              <div className="text-white/70">Songs Sung</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">{stats.averageScore}</div>
              <div className="text-white/70">Avg Score</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</div>
              <div className="text-white/70">Total Time</div>
            </Card>
          </div>
        )}

        {activeTab === 'performances' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Performances</h3>
            <div className="space-y-4">
              {recentPerformances.map((performance) => (
                <div key={performance.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">{performance.songTitle}</div>
                    <div className="text-white/70 text-sm">{performance.artist}</div>
                    <div className="text-white/50 text-xs">{performance.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{performance.score}</div>
                    <div className="text-white/70 text-sm">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'achievements' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Achievements ({achievements.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className={`font-semibold ${getRarityColor(achievement.rarity)}`}>
                        {achievement.name}
                      </div>
                      <div className="text-white/70 text-sm capitalize">{achievement.rarity}</div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{achievement.description}</p>
                  <div className="text-white/50 text-xs">Unlocked: {achievement.unlockedAt}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={user.username}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  disabled
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  disabled
                />
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
} 