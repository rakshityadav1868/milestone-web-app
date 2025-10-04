#!/bin/bash

# 🎉 CelebrateHub Setup Script
# This script will install all dependencies and set up the project for you

echo "🎉 Welcome to CelebrateHub Setup!"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. You have version $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
echo ""

# Install root dependencies
echo "Installing server dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created (you can edit it later if needed)"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo "=================="
echo ""
echo "To start the application:"
echo "  npm run dev-demo    # Start in demo mode (recommended)"
echo "  npm run dev         # Start in full mode (requires Firebase/OpenAI)"
echo ""
echo "Then open your browser to: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"
