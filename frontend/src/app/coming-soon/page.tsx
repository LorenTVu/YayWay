'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Mic, Play, Clock, Star, Zap, Users, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-8">
      <div className="karaoke-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-10 mb-12"
          >
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Clock className="w-12 h-12 text-white" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Coming</span>
              <span className="bg-gradient-to-r from-primary-500 to-highlight bg-clip-text text-transparent"> Soon</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
              We're working hard to bring you the ultimate karaoke experience. 
              Sign up and account features will be available soon!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/demo')}
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Demo Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/')}
                className="text-lg px-8 py-4 bg-white/30 text-gray-700 hover:bg-white/50 shadow-lg border border-white/50"
              >
                <Mic className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-8">
              What's Coming
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  User Accounts
                </h3>
                <p className="text-gray-700">
                  Create your profile, save favorites, and track your progress
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-highlight to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Performance History
                </h3>
                <p className="text-gray-700">
                  Save and share your best performances with friends
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Social Features
                </h3>
                <p className="text-gray-700">
                  Follow friends, join communities, and compete on leaderboards
                </p>
              </div>
            </div>
          </motion.div>

          {/* Demo Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-8 mb-12"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-highlight bg-clip-text text-transparent mb-4">
              Experience the Future Today
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-lg">
              Don't wait! Try our interactive demo to experience real-time lyrics synchronization, 
              AI performance scoring, and social rooms with horizontal layout.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/demo')}
              className="text-lg px-8 py-4 bg-gradient-to-r from-highlight to-yellow-500 text-white shadow-lg shadow-highlight/25 hover:shadow-highlight/40"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Demo
            </Button>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
          >
            <div className="flex items-center justify-center gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                <span className="text-sm font-medium">Core Features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-medium">User Accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full shadow-lg"></div>
                <span className="text-sm font-medium">Social Features</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 