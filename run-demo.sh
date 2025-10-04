#!/bin/bash

echo "🎉 Starting CelebrateHub Demo Mode"
echo "=================================="

# Kill any existing processes on ports 5000, 5001, 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend on port 5001
echo "🚀 Starting backend server on port 5001..."
PORT=5001 node server/index-simple.js &
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
REACT_APP_API_URL=http://localhost:5001 npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running!"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 CelebrateHub is now running!"
echo "=================================="
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📡 Health Check: http://localhost:5001/api/health"
echo ""
echo "📝 Demo Features:"
echo "  • View sample milestones"
echo "  • Test AI post generation"
echo "  • Explore the dashboard"
echo ""
echo "🛑 To stop: Press Ctrl+C or run 'pkill -f node'"
echo ""

# Keep script running
wait
