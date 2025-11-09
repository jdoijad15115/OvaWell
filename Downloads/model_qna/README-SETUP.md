# 🚀 RepAIr AI-Powered App - Complete Setup Guide

## 🎯 What You Now Have:
- ✅ **React Native App** with your AI model integration
- ✅ **FastAPI Backend** ready for your trained models
- ✅ **Real-time API Connection** with fallback to demo mode
- ✅ **Mobile & Web Support** through Expo

## 🔧 Quick Start (2 Terminals):

### Terminal 1: Start Your AI API Server
```bash
cd "my_ai_api - Copy"

# Create virtual environment if needed
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# OR venv\Scripts\activate  # On Windows

# Install dependencies
pip install fastapi uvicorn sentence-transformers transformers torch joblib

# Start your AI server
uvicorn main:app --reload --port 8000
```

### Terminal 2: Start React Native App  
```bash
cd my-repair-react-native
npm start
```

## 📱 Access Your App:
- **Web**: http://localhost:8081
- **Mobile**: Scan QR code with Expo Go app or camera

## 🤖 Your Trained Models Integration:

### 1. **Ask Questions** (`/ask` page):
- Connects to your **T5 model** at `/ask` endpoint
- Uses your `final_repair_model` for repair advice
- Real-time responses from your trained model

### 2. **Issue Detection** (`/detect` page):  
- Connects to your **Anomaly Detector** at `/detect` endpoint
- Uses your `sentence_transformer_model` + `anomaly_detector_model.pkl`
- Shows anomaly scores and confidence levels

## 🟢 Status Indicators:
- **Green "AI Model Connected"**: Your real models are responding
- **Red "Demo Mode"**: API offline, using fallback responses

## 🔍 Testing Your Models:

### Test Question Examples:
- "My laptop won't turn on, what should I check?"
- "The screen is flickering on my monitor"
- "How do I fix a loose charging port?"

### Test Detection Examples:
- "Remove 10 screws from the back panel"
- "Use hammer to fix the connection" (should detect as anomaly)
- "Gently disconnect the ribbon cable"

## 📂 File Structure:
```
my-repair-react-native/
├── app/
│   ├── index.tsx          # Home page
│   ├── ask.tsx           # Q&A with your T5 model
│   ├── detect.tsx        # Anomaly detection
│   └── _layout.tsx       # Navigation
├── services/
│   └── AIService.ts      # API connection service
└── package.json

my_ai_api - Copy/
├── main.py               # FastAPI server (updated for React Native)
├── final_repair_model/   # Your T5 model
├── sentence_transformer_model/  # Your embedding model
└── anomaly_detector_model.pkl   # Your anomaly detector
```

## 🎯 Next Steps:
1. Start both servers (API + React Native)
2. Test the web app at localhost:8081
3. Verify green "AI Model Connected" status
4. Try asking questions and detecting issues
5. Scan QR code to test on mobile

Your trained AI models are now powering a full mobile & web app! 🎉
