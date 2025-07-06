import React from 'react'
import { Card } from '@/components/ui/Card'
import { TrendingUp, Music, Star, Trophy } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalPerformances: number
    totalSongs: number
    totalPoints: number
    rank: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      label: 'Performances',
      value: stats.totalPerformances,
      icon: Music,
      color: 'text-blue-400'
    },
    {
      label: 'Songs Sung',
      value: stats.totalSongs,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Total Points',
      value: stats.totalPoints,
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      label: 'Global Rank',
      value: `#${stats.rank}`,
      icon: Trophy,
      color: 'text-purple-400'
    }
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Stats Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center p-3 bg-white/5 rounded-lg">
            <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
            <div className="text-white font-semibold text-lg">{item.value}</div>
            <div className="text-white/70 text-sm">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
} 