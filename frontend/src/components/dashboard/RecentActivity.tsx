import React from 'react'
import { Card } from '@/components/ui/Card'

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'performance',
      message: 'You performed "Bohemian Rhapsody"',
      time: '2 hours ago',
      points: 150
    },
    {
      id: 2,
      type: 'room',
      message: 'Joined "Friday Night Karaoke" room',
      time: '4 hours ago',
      points: 10
    },
    {
      id: 3,
      type: 'achievement',
      message: 'Unlocked "First Performance" badge',
      time: '1 day ago',
      points: 50
    }
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-white/50 text-xs">{activity.time}</p>
            </div>
            <span className="text-green-400 text-sm font-semibold">+{activity.points}</span>
          </div>
        ))}
      </div>
    </Card>
  )
} 