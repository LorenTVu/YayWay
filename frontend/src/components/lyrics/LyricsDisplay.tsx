'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LyricLine {
  id: string
  text: string
  startTime: number
  endTime: number
  isActive: boolean
  isCompleted: boolean
}

interface LyricsDisplayProps {
  lyrics: LyricLine[]
  currentTime: number
  isPlaying: boolean
  onLyricClick?: (time: number) => void
}

export function LyricsDisplay({ 
  lyrics, 
  currentTime, 
  isPlaying, 
  onLyricClick 
}: LyricsDisplayProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedLines, setCompletedLines] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  // Update active line based on current time
  useEffect(() => {
    const newActiveIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1]
      return currentTime >= line.startTime && 
             (!nextLine || currentTime < nextLine.startTime)
    })

    if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex)
      
      // Mark previous lines as completed
      const newCompleted = new Set(completedLines)
      for (let i = 0; i < newActiveIndex; i++) {
        newCompleted.add(lyrics[i].id)
      }
      setCompletedLines(newCompleted)
    }
  }, [currentTime, lyrics, activeIndex, completedLines])

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current
      const activeLine = activeLineRef.current
      const containerHeight = container.clientHeight
      const lineTop = activeLine.offsetTop
      const lineHeight = activeLine.clientHeight
      
      container.scrollTo({
        top: lineTop - containerHeight / 2 + lineHeight / 2,
        behavior: 'smooth'
      })
    }
  }, [activeIndex])

  const handleLineClick = (line: LyricLine) => {
    onLyricClick?.(line.startTime)
  }

  return (
    <div className="karaoke-card p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-karaoke-text mb-2">
          Lyrics
        </h3>
        <div className="flex items-center justify-center gap-2 text-karaoke-muted">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-karaoke-muted scrollbar-track-transparent"
      >
        <div className="space-y-4 pb-8">
          <AnimatePresence>
            {lyrics.map((line, index) => {
              const isActive = index === activeIndex
              const isCompleted = completedLines.has(line.id)
              
              return (
                <motion.div
                  key={line.id}
                  ref={isActive ? activeLineRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-300
                    ${isActive 
                      ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400 font-semibold' 
                      : isCompleted 
                        ? 'bg-white/10 text-gray-600' 
                        : 'bg-white/10 hover:bg-white/30 text-gray-700'
                    }
                  `}
                  onClick={() => handleLineClick(line)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg leading-relaxed">
                      {line.text}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-primary-400 rounded-full"
                      />
                    )}
                  </div>
                  
                  {/* Progress bar for active line */}
                  {isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, ((currentTime - line.startTime) / (line.endTime - line.startTime)) * 100)}%`
                      }}
                      className="h-1 bg-primary-400 rounded-full mt-2"
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Current time display */}
      <div className="text-center mt-4 text-karaoke-muted text-sm">
        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
      </div>
    </div>
  )
} 