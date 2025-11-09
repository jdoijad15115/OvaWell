#!/bin/bash

echo "🚀 Starting AI Repair Assistant with Multimedia Features..."
echo ""

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Kill existing processes
echo -e "${YELLOW}📡 Stopping existing servers...${NC}"
pkill -f "expo start" 2>/dev/null || true
pkill -f "python main.py" 2>/dev/null || true
sleep 2

# Start API Server
echo -e "${BLUE}🤖 Starting FastAPI Server...${NC}"
cd "/Users/janhvidoijad/Downloads/model_qna/my_ai_api - Copy"
python main.py &
API_PID=$!
echo "API Server PID: $API_PID"

# Wait for API to be ready
echo -e "${YELLOW}⏳ Waiting for API server to start...${NC}"
for i in {1..20}; do
    if check_port 8000; then
        echo -e "${GREEN}✅ API Server is running on http://localhost:8000${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 20 ]; then
        echo -e "${RED}❌ API Server failed to start${NC}"
        kill $API_PID 2>/dev/null || true
        exit 1
    fi
done

# Start React Native App
echo -e "${BLUE}📱 Starting React Native App...${NC}"
cd "/Users/janhvidoijad/Downloads/model_qna/my-repair-react-native"
npx expo start &
EXPO_PID=$!
echo "Expo Server PID: $EXPO_PID"

# Wait for Expo to be ready
echo -e "${YELLOW}⏳ Waiting for Expo server to start...${NC}"
sleep 5

echo ""
echo -e "${GREEN}🎉 Both servers are running!${NC}"
echo ""
echo -e "${GREEN}📡 API Server:${NC}      http://localhost:8000"
echo -e "${GREEN}📱 Mobile App:${NC}      Scan QR code with Expo Go app"
echo -e "${GREEN}🌐 Web App:${NC}        http://localhost:8081"
echo -e "${GREEN}📊 API Health:${NC}     http://localhost:8000/health"
echo ""
echo -e "${BLUE}🎯 Features Available:${NC}"
echo -e "  • ${GREEN}Multilingual TTS${NC} - 12 languages supported"
echo -e "  • ${GREEN}Background Image${NC} - Technology-themed background"
echo -e "  • ${GREEN}Video Placeholder${NC} - Ready for your demo video"
echo -e "  • ${GREEN}Beautiful UI${NC} - Gradients, animations, shadows"
echo -e "  • ${GREEN}Audio Feedback${NC} - Auto-speak confident responses"
echo ""
echo -e "${YELLOW}📹 To add your demo video:${NC}"
echo -e "  1. Place your .mp4 file in: ${BLUE}assets/videos/${NC}"
echo -e "  2. Update the Video component in: ${BLUE}app/index.tsx${NC}"
echo ""
echo -e "${RED}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $API_PID 2>/dev/null || true
    kill $EXPO_PID 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    pkill -f "python main.py" 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
