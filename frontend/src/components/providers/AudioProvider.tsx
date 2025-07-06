'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'

interface AudioContextType {
  isPlaying: boolean
  isRecording: boolean
  currentTime: number
  duration: number
  volume: number
  play: (url: string) => Promise<void>
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob>
  getAudioData: () => Float32Array | null
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio()
    audioRef.current.preload = 'metadata'

    // Set up audio event listeners
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    })

    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    })

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    audioRef.current.addEventListener('play', () => {
      setIsPlaying(true)
    })

    audioRef.current.addEventListener('pause', () => {
      setIsPlaying(false)
    })

    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256
    const bufferLength = analyserRef.current.frequencyBinCount
    dataArrayRef.current = new Float32Array(bufferLength)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const play = async (url: string) => {
    if (!audioRef.current) return

    try {
      audioRef.current.src = url
      audioRef.current.volume = volume
      await audioRef.current.play()

      // Connect to Web Audio API for visualization
      if (audioContextRef.current && analyserRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audioRef.current)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      throw error
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      setIsRecording(true)

      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error starting recording:', error)
      throw error
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'))
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const tracks = mediaRecorderRef.current?.stream.getTracks()
        tracks?.forEach(track => track.stop())
        setIsRecording(false)
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        resolve(event.data)
      }

      mediaRecorderRef.current.stop()
    })
  }

  const getAudioData = (): Float32Array | null => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getFloatTimeDomainData(dataArrayRef.current)
      return dataArrayRef.current
    }
    return null
  }

  const value = {
    isPlaying,
    isRecording,
    currentTime,
    duration,
    volume,
    play,
    pause,
    stop,
    seek,
    setVolume,
    startRecording,
    stopRecording,
    getAudioData,
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
} 