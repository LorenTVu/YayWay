'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Music, Clock, Target } from 'lucide-react'

interface PerformanceMetrics {
  pitch: number // 0-100
  rhythm: number // 0-100
  timing: number // 0-100
  overall: number // 0-100
}

interface AIScoringProps {
  isRecording: boolean
  onScoreUpdate?: (metrics: PerformanceMetrics) => void
}

export function AIScoring({ isRecording, onScoreUpdate }: AIScoringProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pitch: 0,
    rhythm: 0,
    timing: 0,
    overall: 0
  })
  const [feedback, setFeedback] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulate AI analysis when recording
  useEffect(() => {
    if (!isRecording) return

    setIsAnalyzing(true)
    
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      const newMetrics = {
        pitch: Math.min(100, metrics.pitch + Math.random() * 10 - 5),
        rhythm: Math.min(100, metrics.rhythm + Math.random() * 8 - 4),
        timing: Math.min(100, metrics.timing + Math.random() * 12 - 6),
        overall: 0
      }
      
      newMetrics.overall = Math.round(
        (newMetrics.pitch + newMetrics.rhythm + newMetrics.timing) / 3
      )
      
      setMetrics(newMetrics)
      onScoreUpdate?.(newMetrics)
      
      // Generate feedback based on performance
      generateFeedback(newMetrics)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRecording, metrics, onScoreUpdate])

  const generateFeedback = (currentMetrics: PerformanceMetrics) => {
    const feedbacks = []
    
    if (currentMetrics.pitch < 30) {
      feedbacks.push('Try to match the melody more closely')
    } else if (currentMetrics.pitch > 80) {
      feedbacks.push('Excellent pitch accuracy!')
    }
    
    if (currentMetrics.rhythm < 30) {
      feedbacks.push('Keep the beat steady')
    } else if (currentMetrics.rhythm > 80) {
      feedbacks.push('Great rhythm!')
    }
    
    if (currentMetrics.timing < 30) {
      feedbacks.push('Stay in sync with the lyrics')
    } else if (currentMetrics.timing > 80) {
      feedbacks.push('Perfect timing!')
    }
    
    if (feedbacks.length > 0) {
      setFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎯'
    if (score >= 80) return '🌟'
    if (score >= 70) return '👍'
    if (score >= 60) return '😊'
    if (score >= 40) return '🤔'
    return '😅'
  }

  return (
    <div className="karaoke-card p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-karaoke-text mb-2">
          AI Performance Scoring
        </h3>
        <div className="flex items-center justify-center gap-2 text-karaoke-muted">
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm">
            {isRecording ? 'Analyzing...' : 'Ready to analyze'}
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block"
        >
          <div className={`text-6xl font-bold ${getScoreColor(metrics.overall)}`}>
            {metrics.overall}
          </div>
          <div className="text-4xl mt-2">
            {getScoreEmoji(metrics.overall)}
          </div>
        </motion.div>
        <p className="text-karaoke-muted mt-2">Overall Score</p>
      </div>

      {/* Individual Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="karaoke-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-primary-400 mr-2" />
            <span className="text-sm font-medium text-karaoke-text">Pitch</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.pitch}%` }}
            className="h-2 bg-primary-500 rounded-full mb-2"
          />
          <div className={`text-lg font-bold ${getScoreColor(metrics.pitch)}`}>
            {Math.round(metrics.pitch)}
          </div>
        </div>

        <div className="karaoke-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Music className="w-5 h-5 text-accent-400 mr-2" />
            <span className="text-sm font-medium text-karaoke-text">Rhythm</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.rhythm}%` }}
            className="h-2 bg-accent-500 rounded-full mb-2"
          />
          <div className={`text-lg font-bold ${getScoreColor(metrics.rhythm)}`}>
            {Math.round(metrics.rhythm)}
          </div>
        </div>

        <div className="karaoke-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-secondary-400 mr-2" />
            <span className="text-sm font-medium text-karaoke-text">Timing</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.timing}%` }}
            className="h-2 bg-secondary-500 rounded-full mb-2"
          />
          <div className={`text-lg font-bold ${getScoreColor(metrics.timing)}`}>
            {Math.round(metrics.timing)}
          </div>
        </div>
      </div>

      {/* Real-time Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="karaoke-card p-4 bg-primary-500/10 border border-primary-500/30"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary-400" />
              <p className="text-karaoke-text font-medium">{feedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Tips */}
      {!isRecording && (
        <div className="mt-6 p-4 bg-karaoke-surface/50 rounded-lg">
          <h4 className="text-lg font-semibold text-karaoke-text mb-2">
            Performance Tips
          </h4>
          <ul className="text-sm text-karaoke-muted space-y-1">
            <li>• Listen to the original song to understand the melody</li>
            <li>• Practice breathing techniques for better pitch control</li>
            <li>• Tap your foot to keep rhythm steady</li>
            <li>• Watch the lyrics timing for better synchronization</li>
          </ul>
        </div>
      )}
    </div>
  )
} 