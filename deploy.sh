#!/bin/bash

# YayWay Karaoke App Deployment Script
# This script helps deploy the app to various hosting platforms

set -e

echo "🎤 YayWay Karaoke App Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_status "All dependencies are installed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_status "Dependencies installed successfully!"
}

# Build the application
build_app() {
    print_status "Building the application..."
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    print_status "Application built successfully!"
}

# Deploy to Vercel (Frontend) + Railway (Backend)
deploy_vercel_railway() {
    print_header "Deploying to Vercel (Frontend) + Railway (Backend)"
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy backend to Railway
    print_status "Deploying backend to Railway..."
    cd backend
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it from https://railway.app/cli"
        print_status "You can also deploy manually by pushing to Railway's Git integration"
    else
        railway login
        railway init
        railway up
    fi
    
    cd ..
    
    # Deploy frontend to Vercel
    print_status "Deploying frontend to Vercel..."
    cd frontend
    vercel --prod
    cd ..
    
    print_status "Deployment completed! Check the URLs provided by Vercel and Railway."
}

# Deploy to Render
deploy_render() {
    print_header "Deploying to Render"
    
    print_status "To deploy to Render:"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create a new Web Service for the backend"
    echo "4. Create a new Static Site for the frontend"
    echo "5. Configure environment variables"
    echo ""
    print_warning "Make sure to set up your environment variables in Render dashboard"
}

# Deploy to Netlify + Heroku
deploy_netlify_heroku() {
    print_header "Deploying to Netlify (Frontend) + Heroku (Backend)"
    
    # Deploy backend to Heroku
    print_status "Deploying backend to Heroku..."
    cd backend
    
    if ! command -v heroku &> /dev/null; then
        print_warning "Heroku CLI not found. Please install it from https://devcenter.heroku.com/articles/heroku-cli"
    else
        heroku create yayway-karaoke-backend
        heroku config:set NODE_ENV=production
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
    fi
    
    cd ..
    
    # Deploy frontend to Netlify
    print_status "Deploying frontend to Netlify..."
    cd frontend
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    netlify deploy --prod --dir=out
    cd ..
    
    print_status "Deployment completed!"
}

# Local development setup
setup_local() {
    print_header "Setting up local development environment"
    
    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. Please start MongoDB first."
        print_status "You can start MongoDB with: brew services start mongodb-community (macOS)"
        print_status "Or install MongoDB from https://docs.mongodb.com/manual/installation/"
    fi
    
    # Create environment files
    print_status "Creating environment files..."
    
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_status "Created backend/.env from template"
    fi
    
    # Start development servers
    print_status "Starting development servers..."
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "Press Ctrl+C to stop servers"
    
    # Wait for user to stop
    wait $BACKEND_PID $FRONTEND_PID
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  install     Install dependencies"
    echo "  build       Build the application"
    echo "  local       Set up local development environment"
    echo "  vercel      Deploy to Vercel + Railway"
    echo "  render      Deploy to Render"
    echo "  netlify     Deploy to Netlify + Heroku"
    echo "  all         Full deployment (install, build, deploy)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 local      # Start local development"
    echo "  $0 vercel     # Deploy to Vercel + Railway"
}

# Main script logic
case "${1:-help}" in
    "install")
        check_dependencies
        install_dependencies
        ;;
    "build")
        check_dependencies
        build_app
        ;;
    "local")
        check_dependencies
        install_dependencies
        setup_local
        ;;
    "vercel")
        check_dependencies
        install_dependencies
        build_app
        deploy_vercel_railway
        ;;
    "render")
        check_dependencies
        install_dependencies
        build_app
        deploy_render
        ;;
    "netlify")
        check_dependencies
        install_dependencies
        build_app
        deploy_netlify_heroku
        ;;
    "all")
        check_dependencies
        install_dependencies
        build_app
        deploy_vercel_railway
        ;;
    "help"|*)
        show_usage
        ;;
esac 