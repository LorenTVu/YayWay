'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { Mic, Users, Star, Zap } from 'lucide-react'
import logo from '@/assets/yayway-logo.png'

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-[#F7F7FA] px-4 text-center">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src={logo} alt="YayWay Logo" width={80} height={80} className="rounded-xl shadow-md" />
      </div>
      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-heading leading-tight tracking-tight">
        YayWay <span className="text-highlight">Karaoke</span>
      </h1>
      {/* Summary */}
      <p className="text-xl md:text-2xl text-karaoke-muted mb-10 max-w-2xl mx-auto">
        The playful, social karaoke app for Gen Z and music lovers. Sing together in real-time rooms, get instant AI feedback, and build your music community!
      </p>
      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <Button
          size="lg"
          className="text-lg px-8 py-4 bg-primary-500 text-white font-bold hover:bg-primary-600"
          onClick={() => router.push('/coming-soon')}
        >
          Start Singing Free
        </Button>
        <Button
          size="lg"
          className="text-lg px-8 py-4 font-bold border-2 border-gray-300 bg-white text-gray-700 hover:bg-highlight hover:text-white hover:border-highlight"
          onClick={() => router.push('/demo')}
        >
          Try Demo
        </Button>
      </div>
      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="karaoke-card p-6 text-center bg-white rounded-2xl shadow-md">
          <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mic className="w-6 h-6 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-heading mb-2">
            Real-time Lyrics
          </h3>
          <p className="text-karaoke-muted text-sm">
            Synchronized lyrics that highlight in real-time as you sing
          </p>
        </div>
        <div className="karaoke-card p-6 text-center bg-white rounded-2xl shadow-md">
          <div className="w-12 h-12 bg-highlight/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-highlight" />
          </div>
          <h3 className="text-lg font-semibold text-heading mb-2">
            AI Performance Scoring
          </h3>
          <p className="text-karaoke-muted text-sm">
            Get instant feedback on pitch, rhythm, and timing
          </p>
        </div>
        <div className="karaoke-card p-6 text-center bg-white rounded-2xl shadow-md">
          <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-secondary-500" />
          </div>
          <h3 className="text-lg font-semibold text-heading mb-2">
            Social Rooms
          </h3>
          <p className="text-karaoke-muted text-sm">
            Join public or private rooms with friends and strangers
          </p>
        </div>
      </div>
    </section>
  )
} 