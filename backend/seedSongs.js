const mongoose = require('mongoose');
const Song = require('./src/models/Song');
require('dotenv').config();

const songs = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    genre: 'Pop',
    language: 'English',
    year: 2020,
    instrumentalUrl: 'https://example.com/audio/blinding-lights.mp3',
    coverArt: 'https://example.com/images/blinding-lights.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    genre: 'Pop',
    language: 'English',
    year: 2020,
    instrumentalUrl: 'https://example.com/audio/levitating.mp3',
    coverArt: 'https://example.com/images/levitating.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    genre: 'Pop',
    language: 'English',
    year: 2020,
    instrumentalUrl: 'https://example.com/audio/watermelon-sugar.mp3',
    coverArt: 'https://example.com/images/watermelon-sugar.jpg',
    lyrics: [],
    difficulty: 'easy'
  },
  {
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    genre: 'Pop',
    language: 'English',
    year: 2020,
    instrumentalUrl: 'https://example.com/audio/save-your-tears.mp3',
    coverArt: 'https://example.com/images/save-your-tears.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    duration: 198,
    genre: 'R&B',
    language: 'English',
    year: 2021,
    instrumentalUrl: 'https://example.com/audio/peaches.mp3',
    coverArt: 'https://example.com/images/peaches.jpg',
    lyrics: [],
    difficulty: 'easy'
  },
  {
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    genre: 'Pop Rock',
    language: 'English',
    year: 2021,
    instrumentalUrl: 'https://example.com/audio/good-4-u.mp3',
    coverArt: 'https://example.com/images/good-4-u.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 167,
    genre: 'Pop',
    language: 'English',
    year: 2022,
    instrumentalUrl: 'https://example.com/audio/as-it-was.mp3',
    coverArt: 'https://example.com/images/as-it-was.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    duration: 141,
    genre: 'Pop',
    language: 'English',
    year: 2021,
    instrumentalUrl: 'https://example.com/audio/stay.mp3',
    coverArt: 'https://example.com/images/stay.jpg',
    lyrics: [],
    difficulty: 'easy'
  },
  {
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    album: '=',
    duration: 231,
    genre: 'Pop',
    language: 'English',
    year: 2021,
    instrumentalUrl: 'https://example.com/audio/bad-habits.mp3',
    coverArt: 'https://example.com/images/bad-habits.jpg',
    lyrics: [],
    difficulty: 'medium'
  },
  {
    title: 'About Damn Time',
    artist: 'Lizzo',
    album: 'Special',
    duration: 194,
    genre: 'Pop',
    language: 'English',
    year: 2022,
    instrumentalUrl: 'https://example.com/audio/about-damn-time.mp3',
    coverArt: 'https://example.com/images/about-damn-time.jpg',
    lyrics: [],
    difficulty: 'easy'
  }
];

async function seedSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are not needed in Mongoose 6+
    });
    console.log('Connected to MongoDB');

    await Song.deleteMany({});
    await Song.insertMany(songs);
    console.log('Seeded songs successfully!');
  } catch (err) {
    console.error('Error seeding songs:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedSongs(); 