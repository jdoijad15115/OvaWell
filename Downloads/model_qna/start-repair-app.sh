#!/bin/bash

echo "🚀 Starting RepAIr AI-Powered App Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -d "my-repair-react-native" ]; then
    echo "❌ Error: Please run this script from the model_qna directory"
    exit 1
fi

echo "📱 Step 1: Starting React Native App..."
cd my-repair-react-native
npm start &
RN_PID=$!
cd ..

echo "🤖 Step 2: Starting AI API Server..."
cd "my_ai_api - Copy"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements if they exist
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Start the API server
echo "Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
API_PID=$!

cd ..

echo ""
echo "✅ Setup Complete!"
echo "==================="
echo "🤖 AI API Server: http://localhost:8000"
echo "📱 React Native App: http://localhost:8081"
echo ""
echo "📋 What's Available:"
echo "   • Ask Questions: Uses your trained T5 model"
echo "   • Issue Detection: Uses your anomaly detector"
echo "   • Mobile App: Scan QR code for mobile testing"
echo ""
echo "🔧 To stop both servers:"
echo "   kill $RN_PID $API_PID"
echo ""
echo "📖 Test the connection:"
echo "   1. Open http://localhost:8081 in your browser"
echo "   2. Click 'Ask Questions' or 'Detect Issues'"
echo "   3. Look for green 'AI Model Connected' status"
echo ""

# Keep the script running
wait
