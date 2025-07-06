# 🎤 YayWay Karaoke - MVP

A modern, real-time karaoke application with synchronized lyrics, AI-powered performance grading, and social features.

## ✨ Features

### 🎵 Core Karaoke Features
- **Real-time Karaoke Rooms**: Solo, group, public, and private rooms
- **Synchronized Lyrics**: Real-time lyrics display with timing sync
- **Duet Mode**: Sing together with friends in real-time
- **Performance Recording**: Record and save your performances
- **AI Performance Grading**: Get instant feedback on your singing

### 🎨 Customization & Social
- **Custom Skins & Themes**: Personalize your karaoke experience
- **Short-form Content Feed**: Share and discover performances
- **Gifting Economy**: Send virtual gifts to performers
- **Achievement System**: Unlock badges and rewards
- **Leaderboards**: Compete with other singers globally

### 💰 Monetization Features
- **Earning System**: Earn points and rewards for performances
- **Exclusive Content**: Premium songs and features
- **Virtual Currency**: In-app economy with gifts and rewards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yayway-karaoke.git
   cd yayway-karaoke
   ```

2. **Run the installation script**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start development servers**
   ```bash
   ./deploy.sh local
   ```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom karaoke theme
- **State Management**: Zustand + React Query
- **Real-time**: Socket.io client
- **Audio**: Web Audio API + WaveSurfer.js
- **UI Components**: Custom component library

### Backend (Node.js/Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live features
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local/Cloud storage for audio files
- **AI Integration**: Performance analysis and grading

### Database Schema
- **Users**: Authentication, profiles, preferences, stats
- **Rooms**: Room management, participants, settings
- **Songs**: Song metadata, lyrics, audio files
- **Performances**: Recording data, scores, analytics
- **Achievements**: Badges, rewards, progress tracking

## 🌐 Deployment Options

### Option 1: Vercel + Railway (Recommended)
```bash
./deploy.sh vercel
```

**Frontend (Vercel)**:
- Automatic deployments from Git
- Global CDN
- Serverless functions support

**Backend (Railway)**:
- Easy database integration
- Automatic scaling
- Environment variable management

### Option 2: Render
```bash
./deploy.sh render
```

**Steps**:
1. Connect GitHub repository to Render
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables

### Option 3: Netlify + Heroku
```bash
./deploy.sh netlify
```

**Frontend (Netlify)**:
- Static site hosting
- Form handling
- Analytics integration

**Backend (Heroku)**:
- Container-based deployment
- Add-on ecosystem
- Easy scaling

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/yayway-karaoke

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# AI Services (Optional)
OPENAI_API_KEY=your-openai-key
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=YayWay Karaoke
```

### Database Setup

1. **Local MongoDB**:
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu
   sudo apt install mongodb
   sudo systemctl start mongodb
   ```

2. **MongoDB Atlas (Cloud)**:
   - Create account at https://mongodb.com/atlas
   - Create cluster
   - Get connection string
   - Update MONGODB_URI in .env

## 📱 Features in Detail

### Real-time Karaoke Rooms
- **Room Types**: Solo, group, public, private
- **User Management**: Join, leave, kick, promote host
- **Queue System**: Add songs, reorder, skip
- **Chat**: Real-time messaging with emojis
- **Performance Sync**: Synchronized audio and lyrics

### AI Performance Grading
- **Pitch Analysis**: Real-time pitch detection
- **Rhythm Scoring**: Timing accuracy assessment
- **Vocal Quality**: Clarity and tone analysis
- **Overall Score**: Weighted performance rating
- **Feedback**: Detailed improvement suggestions

### Social Features
- **User Profiles**: Stats, achievements, performance history
- **Following System**: Follow other singers
- **Performance Sharing**: Share to social media
- **Comments & Likes**: Engage with performances
- **Leaderboards**: Global and genre-specific rankings

### Customization
- **Themes**: Dark, light, neon, retro themes
- **Avatars**: Custom profile pictures
- **Room Decorations**: Virtual backgrounds and effects
- **Audio Effects**: Reverb, echo, pitch correction
- **Lyrics Display**: Fonts, colors, animations

## 🛠️ Development

### Project Structure
```
yayway-karaoke/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and helpers
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── socket/          # Socket.io handlers
│   │   └── server.js        # Main server file
│   └── package.json
├── deploy.sh                # Deployment script
├── install.sh               # Installation script
└── README.md
```

### Available Scripts

**Backend**:
```bash
cd backend
npm run dev          # Development server
npm run build        # Build for production
npm start           # Production server
npm test            # Run tests
```

**Frontend**:
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm start           # Production server
npm run lint        # Run ESLint
```

### API Endpoints

**Authentication**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

**Rooms**:
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

**Songs**:
- `GET /api/songs` - List songs
- `GET /api/songs/:id` - Get song details
- `GET /api/songs/search` - Search songs
- `GET /api/songs/trending` - Get trending songs

**Performances**:
- `POST /api/performances` - Create performance
- `GET /api/performances` - List performances
- `GET /api/performances/:id` - Get performance
- `PUT /api/performances/:id` - Update performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/yourusername/yayway-karaoke/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/yayway-karaoke/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/yayway-karaoke/discussions)

## 🎯 Roadmap

### Phase 1 (MVP) ✅
- [x] Basic karaoke rooms
- [x] User authentication
- [x] Real-time chat
- [x] Song library
- [x] Performance recording

### Phase 2 (Enhancement)
- [ ] AI performance grading
- [ ] Duet mode
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Custom themes

### Phase 3 (Monetization)
- [ ] Virtual currency
- [ ] Gifting system
- [ ] Premium content
- [ ] Subscription plans
- [ ] Creator marketplace

### Phase 4 (Advanced Features)
- [ ] Mobile app
- [ ] AR/VR support
- [ ] Live streaming
- [ ] Music production tools
- [ ] Social media integration

---

**Made with ❤️ by the YayWay Team** 