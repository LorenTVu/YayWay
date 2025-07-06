import { UserPlus, DoorOpen, Mic2 } from 'lucide-react'

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#F7F7FA]">
      <div className="karaoke-container">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-heading mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-karaoke-muted">
            Get started in just a few simple steps
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          <div className="karaoke-card p-10 text-center flex-1 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-extrabold text-highlight mb-4">01</div>
            <h3 className="text-2xl font-bold text-heading mb-4 mt-2 tracking-tight">
              Create Account
            </h3>
            <p className="text-karaoke-muted text-lg">
              Sign up for free and create your profile
            </p>
          </div>
          <div className="karaoke-card p-10 text-center flex-1 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-extrabold text-highlight mb-4">02</div>
            <h3 className="text-2xl font-bold text-heading mb-4 mt-2 tracking-tight">
              Join a Room
            </h3>
            <p className="text-karaoke-muted text-lg">
              Browse and join public rooms or create your own
            </p>
          </div>
          <div className="karaoke-card p-10 text-center flex-1 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-extrabold text-highlight mb-4">03</div>
            <h3 className="text-2xl font-bold text-heading mb-4 mt-2 tracking-tight">
              Start Singing
            </h3>
            <p className="text-karaoke-muted text-lg">
              Choose a song and perform with synchronized lyrics
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 