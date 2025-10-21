#!/bin/bash

echo "Starting Statistical Analysis and Probability Tools..."
echo ""

# Kill any existing processes on ports 3000 and 5000
echo "Cleaning up ports..."
lsof -ti:5000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# Start the backend server
echo "Starting backend server on port 5000..."
cd backend && npm start &
BACKEND_PID=$!
sleep 3

# Start the frontend
echo "Starting frontend on port 3000..."
cd ../frontend && npm start &
FRONTEND_PID=$!
n
echo ""
echo "✓ Backend server starting on http://localhost:5000"
echo "✓ Frontend app starting on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID