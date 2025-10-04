#!/bin/bash

# CelebrateHub Start Script
echo "🚀 Starting CelebrateHub..."

# Kill any existing processes
pkill -f "node server/index.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start server in background
echo "Starting server on port 5001..."
cd server && node index.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client
echo "Starting client on port 3000..."
cd ../client && npm start &
CLIENT_PID=$!

echo "✅ CelebrateHub is starting up!"
echo "📱 Client: http://localhost:3000"
echo "🔧 Server: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
