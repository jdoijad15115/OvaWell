# 🌐 Cloud Deployment Guide for RepAIr AI API

## 🚀 Deployment Options Overview

### 1. **Railway** (Recommended - Easiest)
- ✅ **Free tier**: Great for getting started
- ✅ **Auto-deploys** from GitHub
- ✅ **Built-in domain** provided
- ✅ **Easy environment variables**

### 2. **Render**
- ✅ **Free tier** available
- ✅ **Simple setup** with GitHub integration
- ✅ **Automatic HTTPS**
- ✅ **Good for Python apps**

### 3. **Google Cloud Run**
- ✅ **Pay-per-use** pricing
- ✅ **Serverless** (scales to zero)
- ✅ **Fast cold starts**
- ✅ **Good for AI models**

### 4. **AWS Lambda + API Gateway**
- ✅ **Serverless** and cost-effective
- ✅ **Auto-scaling**
- ❌ **Complex setup** for large models
- ❌ **15min timeout limit**

### 5. **Heroku**
- ✅ **Simple deployment**
- ❌ **No free tier** anymore
- ❌ **Expensive** for AI workloads

---

## 📦 Quick Start: Railway Deployment (Recommended)

### Step 1: Prepare Your API for Deployment
```bash
cd "my_ai_api - Copy"
```

### Step 2: Create requirements.txt
```bash
pip freeze > requirements.txt
```

### Step 3: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Railway auto-detects Python and deploys!

### Step 4: Update React Native App
Update the API URL in `AIService.ts`:
```typescript
const API_BASE_URL = 'https://your-app-name.railway.app';
```

---

## 🐳 Docker Deployment (Universal)

### For any cloud provider that supports Docker:

**Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔧 Platform-Specific Configurations

### Railway Configuration
**railway.toml:**
```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "always"

[env]
PYTHONPATH = "/app"
```

### Render Configuration  
**render.yaml:**
```yaml
services:
  - type: web
    name: repair-ai-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.9.16
```

### Google Cloud Run
**cloudbuild.yaml:**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/repair-ai:latest', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/repair-ai:latest']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: 
      - 'run'
      - 'deploy'
      - 'repair-ai'
      - '--image'
      - 'gcr.io/$PROJECT_ID/repair-ai:latest'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

---

## 💡 Important Considerations

### 1. **Model Size & Memory**
- Your models are large (T5 + sentence transformer)
- Choose services with **4GB+ RAM**
- Consider model compression or quantization

### 2. **Cold Start Times**
- First request may be slow (model loading)
- Consider keeping a "ping" endpoint warm
- Use model caching strategies

### 3. **Environment Variables**
```env
MODEL_PATH=/app/models
PYTHONPATH=/app
PORT=8000
CORS_ORIGINS=https://your-react-native-app.vercel.app
```

### 4. **CORS Configuration**
Update your `main.py` for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8081", 
        "http://localhost:8082",
        "https://your-domain.com",  # Add your production domain
        "https://*.railway.app",     # Allow Railway subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 React Native App Deployment

### Option 1: Expo EAS Build
```bash
cd my-repair-react-native
npx eas build --platform all
npx eas submit
```

### Option 2: Vercel (Web Version)
```bash
npm run build
npx vercel --prod
```

---

## 📊 Cost Estimates (Monthly)

| Platform | Free Tier | Paid (4GB RAM) |
|----------|-----------|----------------|
| Railway | $5/month | $20/month |
| Render | Free 750hrs | $25/month |
| Google Cloud Run | $0-5 | $15-30/month |
| AWS Lambda | $0-2 | $10-20/month |

---

## 🎯 Recommended Deployment Flow:

1. **Start with Railway** (easiest setup)
2. **Test thoroughly** with your models
3. **Monitor performance** and costs
4. **Scale up** to Google Cloud Run if needed
5. **Optimize models** for production

Want me to help you set up deployment for a specific platform?
