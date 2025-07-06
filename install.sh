#!/bin/bash

echo "🎤 Setting up YayWay Karaoke MVP..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files
echo "🔧 Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > backend/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/yayway-karaoke

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Backend .env file created"
else
    echo "⚠️  Backend .env file already exists"
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Frontend .env.local file created"
else
    echo "⚠️  Frontend .env.local file already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p backend/uploads

echo ""
echo "🎉 Setup complete! Here's what you need to do next:"
echo ""
echo "1. Install and start MongoDB:"
echo "   - macOS: brew install mongodb-community && brew services start mongodb-community"
echo "   - Windows: Download from https://www.mongodb.com/try/download/community"
echo "   - Linux: sudo apt install mongodb && sudo systemctl start mongodb"
echo ""
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "3. Open your browser and visit:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo ""
echo "4. For production deployment:"
echo "   - Backend: npm run build:backend && npm start"
echo "   - Frontend: npm run build:frontend && npm start"
echo ""
echo "📚 Documentation:"
echo "   - Backend API docs: http://localhost:5000/api/docs (when implemented)"
echo "   - Frontend: Check the README.md for component documentation"
echo ""
echo "🚀 Happy coding! 🎤" 