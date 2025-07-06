'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  language: string
  duration: number
  popularity: number
  difficulty: 'easy' | 'medium' | 'hard'
  thumbnail?: string
}

export default function SongsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)

  const genres = ['all', 'pop', 'rock', 'hip-hop', 'country', 'jazz', 'classical', 'electronic', 'folk', 'r&b']
  const languages = ['all', 'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean', 'chinese']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchSongs()
    }
  }, [user])

  useEffect(() => {
    filterSongs()
  }, [songs, searchTerm, selectedGenre, selectedLanguage, selectedDifficulty])

  const fetchSongs = async () => {
    try {
      setIsLoadingSongs(true)
      // Mock data - replace with actual API call
      const mockSongs: Song[] = [
        {
          id: '1',
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          genre: 'rock',
          language: 'english',
          duration: 354,
          popularity: 95,
          difficulty: 'hard'
        },
        {
          id: '2',
          title: 'Imagine',
          artist: 'John Lennon',
          genre: 'pop',
          language: 'english',
          duration: 183,
          popularity: 88,
          difficulty: 'medium'
        },
        {
          id: '3',
          title: 'Hotel California',
          artist: 'Eagles',
          genre: 'rock',
          language: 'english',
          duration: 391,
          popularity: 92,
          difficulty: 'medium'
        },
        {
          id: '4',
          title: 'Wonderwall',
          artist: 'Oasis',
          genre: 'rock',
          language: 'english',
          duration: 258,
          popularity: 85,
          difficulty: 'easy'
        },
        {
          id: '5',
          title: 'Despacito',
          artist: 'Luis Fonsi',
          genre: 'pop',
          language: 'spanish',
          duration: 229,
          popularity: 90,
          difficulty: 'medium'
        },
        {
          id: '6',
          title: 'La Vie En Rose',
          artist: 'Édith Piaf',
          genre: 'jazz',
          language: 'french',
          duration: 185,
          popularity: 82,
          difficulty: 'medium'
        }
      ]
      
      setSongs(mockSongs)
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setIsLoadingSongs(false)
    }
  }

  const filterSongs = () => {
    let filtered = songs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(song => song.language === selectedLanguage)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(song => song.difficulty === selectedDifficulty)
    }

    setFilteredSongs(filtered)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-white/70'
    }
  }

  const handleSingSong = (song: Song) => {
    // Navigate to solo room with this song
    router.push(`/rooms/create?type=solo&song=${song.id}`)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">🎵 Song Library</h1>
              <span className="text-white/70">{filteredSongs.length} songs found</span>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="ghost"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-6">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search songs or artists..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-white font-semibold mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-white font-semibold mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-white font-semibold mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Songs List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {isLoadingSongs ? (
          <div className="flex items-center justify-center py-12">
            <div className="karaoke-loading">
              <div className="karaoke-loading-spinner"></div>
              <span>Loading songs...</span>
            </div>
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <Card key={song.id} className="p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{song.title}</h3>
                    <p className="text-white/70 mb-2">{song.artist}</p>
                    <div className="flex items-center space-x-4 text-sm text-white/50">
                      <span className="capitalize">{song.genre}</span>
                      <span>•</span>
                      <span className="capitalize">{song.language}</span>
                      <span>•</span>
                      <span>{formatDuration(song.duration)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getDifficultyColor(song.difficulty)}`}>
                      {song.difficulty.toUpperCase()}
                    </div>
                    <div className="text-green-400 text-sm">🔥 {song.popularity}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/70 text-sm">Available</span>
                  </div>
                  <Button
                    onClick={() => handleSingSong(song)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Sing Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-white mb-2">No songs found</h2>
            <p className="text-white/70 mb-6">
              Try adjusting your search terms or filters to find more songs.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('all')
                setSelectedLanguage('all')
                setSelectedDifficulty('all')
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
} 