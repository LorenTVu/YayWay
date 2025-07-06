'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CreateRoomForm {
  name: string
  type: 'solo' | 'group' | 'public' | 'private'
  maxUsers: number
  description: string
  isPrivate: boolean
  password?: string
}

export default function CreateRoomPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<CreateRoomForm>({
    name: '',
    type: 'public',
    maxUsers: 10,
    description: '',
    isPrivate: false,
    password: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const type = searchParams.get('type')
    if (type && ['solo', 'group', 'public', 'private'].includes(type)) {
      setForm(prev => ({
        ...prev,
        type: type as 'solo' | 'group' | 'public' | 'private',
        maxUsers: type === 'solo' ? 1 : type === 'group' ? 10 : 20
      }))
    }
  }, [searchParams])

  const handleInputChange = (field: keyof CreateRoomForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name.trim()) {
      alert('Please enter a room name')
      return
    }

    try {
      setIsCreating(true)
      // Mock API call - replace with actual implementation
      console.log('Creating room:', form)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to the new room (mock room ID)
      router.push('/rooms/123')
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Failed to create room. Please try again.')
    } finally {
      setIsCreating(false)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Create New Room</h1>
            </div>
            <Button 
              onClick={() => router.push('/rooms')}
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Room Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter room name..."
                required
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Room Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['solo', 'group', 'public', 'private'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      form.type === type
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {type === 'solo' ? '🎤' : type === 'group' ? '👥' : type === 'public' ? '🌍' : '🔒'}
                    </div>
                    <div className="font-semibold capitalize">{type}</div>
                    <div className="text-xs opacity-70">
                      {type === 'solo' ? '1 person' : type === 'group' ? '2-10 people' : type === 'public' ? 'Anyone can join' : 'Invite only'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Users */}
            {form.type !== 'solo' && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  Maximum Users
                </label>
                <select
                  value={form.maxUsers}
                  onChange={(e) => handleInputChange('maxUsers', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[2, 5, 10, 15, 20, 30, 50].map(num => (
                    <option key={num} value={num}>{num} users</option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Description (Optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your room..."
                rows={3}
              />
            </div>

            {/* Privacy Settings */}
            {form.type === 'private' && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  Room Password (Optional)
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter password to protect room..."
                />
                <p className="text-white/50 text-sm mt-1">
                  Leave empty to allow anyone with the link to join
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                onClick={() => router.push('/rooms')}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !form.name.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Room'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
} 