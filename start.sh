#!/bin/bash

echo "🎉 Starting CelebrateHub Demo"
echo "============================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server/index-simple.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend
echo "🚀 Starting backend server on port 5001..."
node server/index-simple.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
echo "🔍 Testing backend..."
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd client
npm start &
FRONTEND_PID=$!

# Wait for frontend
echo "⏳ Waiting for frontend to start..."
sleep 15

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running!"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 CelebrateHub is now running!"
echo "============================="
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📡 Health Check: http://localhost:5001/api/health"
echo ""
echo "🛑 To stop: Press Ctrl+C"
echo ""

# Keep script running
wait
