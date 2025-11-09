#!/bin/bash

echo "🚀 Starting My Repair Assistant..."

# Navigate to project directory
cd "/Users/janhvidoijad/Downloads/model_qna/my-repair-react-native"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "expo" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
sleep 2

# Clear Metro cache
echo "🗑️  Clearing Metro cache..."
npx metro --reset-cache 2>/dev/null || true

# Start API server in background if not running
API_STATUS=$(curl -s -m 2 http://localhost:8000/health 2>/dev/null | grep -o "healthy" || echo "not running")
if [ "$API_STATUS" != "healthy" ]; then
    echo "🔧 Starting API server..."
    cd "/Users/janhvidoijad/Downloads/model_qna/my_ai_api - Copy"
    python main.py &
    sleep 3
    cd "/Users/janhvidoijad/Downloads/model_qna/my-repair-react-native"
fi

# Start React Native with retry logic
echo "📱 Starting React Native app..."
for i in {1..3}; do
    echo "Attempt $i/3..."
    timeout 30s npm start &
    PID=$!
    sleep 15
    
    # Check if server is responding
    if curl -s -m 5 http://localhost:8081 > /dev/null 2>&1; then
        echo "✅ App is running at http://localhost:8081"
        wait $PID
        exit 0
    else
        echo "❌ Attempt $i failed, retrying..."
        kill $PID 2>/dev/null || true
        sleep 2
    fi
done

echo "❌ Failed to start app after 3 attempts"
echo "💡 Try running manually: cd /Users/janhvidoijad/Downloads/model_qna/my-repair-react-native && npm start"
