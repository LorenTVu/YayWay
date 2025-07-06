'use client'

import { useState } from 'react'
import { LyricsDisplay } from '@/components/lyrics/LyricsDisplay'
import { AIScoring } from '@/components/performance/AIScoring'
import { SocialRooms } from '@/components/rooms/SocialRooms'
import { Button } from '@/components/ui/Button'
import { Play, Pause, Mic, Users, Brain, ArrowLeft, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock lyrics data
const mockLyrics = [
  { id: '1', text: "I've been tryna call", startTime: 0, endTime: 3, isActive: false, isCompleted: false },
  { id: '2', text: "I've been on my own for long enough", startTime: 3, endTime: 7, isActive: false, isCompleted: false },
  { id: '3', text: "Maybe you can show me how to love, maybe", startTime: 7, endTime: 12, isActive: false, isCompleted: false },
  { id: '4', text: "I'm going through withdrawals", startTime: 12, endTime: 15, isActive: false, isCompleted: false },
  { id: '5', text: "You don't even have to do too much", startTime: 15, endTime: 19, isActive: false, isCompleted: false },
  { id: '6', text: "You can turn me on with just a touch, baby", startTime: 19, endTime: 24, isActive: false, isCompleted: false },
  { id: '7', text: "Sign of the times", startTime: 24, endTime: 27, isActive: false, isCompleted: false },
  { id: '8', text: "We gotta get away from here", startTime: 27, endTime: 31, isActive: false, isCompleted: false },
]

export default function DemoPage() {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [activeFeature, setActiveFeature] = useState<'lyrics' | 'scoring' | 'rooms'>('lyrics')
  const router = useRouter()

  // Simulate audio playback
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      // Start simulation
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 31) {
            setIsPlaying(false)
            clearInterval(interval)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    }
  }

  const handleLyricClick = (time: number) => {
    setCurrentTime(time)
  }

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room:', roomId)
    // Add your room joining logic here
  }

  const handleCreateRoom = () => {
    console.log('Creating new room')
    // Add your room creation logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="karaoke-container py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <h1 className="text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent drop-shadow-sm">YayWay</span>
                <span className="bg-gradient-to-r from-highlight to-yellow-500 bg-clip-text text-transparent drop-shadow-sm"> Karaoke Demo</span>
              </h1>
            </div>
            <p className="text-gray-700 text-xl font-medium bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent mb-6">
              Experience the future of karaoke ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center gap-3 text-gray-700 hover:text-primary-500 hover:bg-white/20 rounded-2xl px-6 py-3 transition-all duration-300 border border-gray-300 hover:border-primary-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold"> Home</span>
              </Button>
              <Button
                onClick={() => router.push('/coming-soon')}
                className="flex items-center gap-3 bg-gradient-to-r from-highlight to-yellow-500 text-white hover:shadow-highlight/40 rounded-2xl px-6 py-3 transition-all duration-300 shadow-lg shadow-highlight/25 font-semibold"
              >
                <span>Invest</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="karaoke-container py-16">
        {/* Feature Navigation */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-4 bg-white/20 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/30">
            <Button
              variant={activeFeature === 'lyrics' ? 'primary' : 'ghost'}
              onClick={() => setActiveFeature('lyrics')}
              size="lg"
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeFeature === 'lyrics' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                  : 'text-gray-700 hover:text-gray-800 hover:bg-white/30'
              }`}
            >
              <Mic className="w-6 h-6" />
              Real-time Lyrics
            </Button>
            <Button
              variant={activeFeature === 'scoring' ? 'primary' : 'ghost'}
              onClick={() => setActiveFeature('scoring')}
              size="lg"
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeFeature === 'scoring' 
                  ? 'bg-gradient-to-r from-highlight to-yellow-500 text-white shadow-lg shadow-highlight/25' 
                  : 'text-gray-700 hover:text-gray-800 hover:bg-white/30'
              }`}
            >
              <Brain className="w-6 h-6" />
              AI Scoring
            </Button>
            <Button
              variant={activeFeature === 'rooms' ? 'primary' : 'ghost'}
              onClick={() => setActiveFeature('rooms')}
              size="lg"
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeFeature === 'rooms' 
                  ? 'bg-gradient-to-r from-secondary-500 to-purple-600 text-white shadow-lg shadow-secondary-500/25' 
                  : 'text-gray-700 hover:text-gray-800 hover:bg-white/30'
              }`}
            >
              <Users className="w-6 h-6" />
              Social Rooms
            </Button>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="text-center mb-16">
          <div className="bg-white/20 backdrop-blur-md p-8 inline-block rounded-3xl shadow-xl border border-white/30">
            <div className="flex items-center gap-8">
              <Button
                onClick={handlePlayPause}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/25' 
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/25 hover:shadow-primary-500/40'
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isPlaying ? 'Pause' : 'Play'} Demo
              </Button>
              
              <Button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
                    : 'bg-white/30 text-black hover:bg-white/50 shadow-lg border border-white/50'
                }`}
              >
                <Mic className="w-6 h-6" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <div className="text-gray-700 font-mono text-xl bg-white/30 px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Display */}
        <div className="mb-16">
          {activeFeature === 'lyrics' && (
            <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-4">
                  Real-time Lyrics
                </h2>
                <p className="text-2xl font-semibold text-gray-700 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Synchronization
                </p>
              </div>
              <LyricsDisplay
                lyrics={mockLyrics}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onLyricClick={handleLyricClick}
              />
            </div>
          )}

          {activeFeature === 'scoring' && (
            <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-highlight via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm mb-4">
                  AI Performance
                </h2>
                <p className="text-2xl font-semibold text-gray-700 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Scoring
                </p>
              </div>
              <AIScoring
                isRecording={isRecording}
                onScoreUpdate={(metrics) => console.log('Score update:', metrics)}
              />
            </div>
          )}

          {activeFeature === 'rooms' && (
            <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-secondary-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm mb-4">
                  Social
                </h2>
                <p className="text-2xl font-semibold text-gray-700 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Rooms
                </p>
              </div>
              <SocialRooms
                onJoinRoom={handleJoinRoom}
                onCreateRoom={handleCreateRoom}
              />
            </div>
          )}
        </div>

        {/* Feature Description */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-sm mb-6">
              How to Use This Demo
            </h3>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-highlight animate-bounce" />
              <span className="text-xl font-semibold text-gray-700">Interactive Guide</span>
              <Sparkles className="w-6 h-6 text-highlight animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-4">Real-time Lyrics</h4>
              <p className="text-gray-700 leading-relaxed">
                Click "Play Demo" to see lyrics highlight in sync with the audio. 
                Click on any lyric line to jump to that time.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-highlight to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-4">AI Performance Scoring</h4>
              <p className="text-gray-700 leading-relaxed">
                Click "Start Recording" to see real-time AI analysis of pitch, 
                rhythm, and timing with instant feedback.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-4">Social Rooms</h4>
              <p className="text-gray-700 leading-relaxed">
                Browse horizontal room cards, filter by public/private, 
                and see real-time participant activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 