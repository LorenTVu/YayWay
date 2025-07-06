export interface User {
  _id: string
  username: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  isOnline: boolean
  lastSeen: Date
  totalPerformances: number
  averageScore: number
  totalPoints: number
  followers: string[]
  following: string[]
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      email: boolean
      push: boolean
      roomInvites: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'followers' | 'private'
      showOnlineStatus: boolean
    }
  }
  isBanned: boolean
  banReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends Omit<User, 'email' | 'isBanned' | 'banReason'> {
  followerCount: number
  followingCount: number
}

export interface UserStats {
  totalPerformances: number
  averageScore: number
  totalPoints: number
  totalViews: number
  totalLikes: number
  totalFollowers: number
  totalFollowing: number
} 