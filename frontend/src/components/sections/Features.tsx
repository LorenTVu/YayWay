import { Mic, Brain, Users } from 'lucide-react'

export function Features() {
  return (
    <section className="py-20 bg-[#F7F7FA]">
      <div className="karaoke-container">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-heading mb-4 tracking-tight">
            Amazing Features
          </h2>
          <p className="text-xl text-karaoke-muted">
            Everything you need for the ultimate karaoke experience
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          <div className="karaoke-card p-8 flex-1 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-karaoke-text mb-4">
              Real-time Lyrics
            </h3>
            <p className="text-karaoke-muted">
              Synchronized lyrics that highlight in real-time as you sing
            </p>
          </div>
          
          <div className="karaoke-card p-8 flex-1 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-2xl font-semibold text-karaoke-text mb-4">
              AI Performance Scoring
            </h3>
            <p className="text-karaoke-muted">
              Get instant feedback on pitch, rhythm, and timing
            </p>
          </div>
          
          <div className="karaoke-card p-8 flex-1 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-karaoke-text mb-4">
              Social Rooms
            </h3>
            <p className="text-karaoke-muted">
              Join public or private rooms with friends and strangers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 