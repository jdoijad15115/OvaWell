# 🚀 Cloud Deployment Guide for AI Repair Assistant

## Option 1: Vercel (Recommended for Web)

### Frontend (React Native Web)
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Configure for Expo Web:**
   ```bash
   cd my-repair-react-native
   npx expo export --platform web
   ```

3. **Create vercel.json:**
   ```json
   {
     "builds": [
       {
         "src": "dist/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Backend API (FastAPI)
1. **Create requirements.txt:**
   ```txt
   fastapi
   uvicorn
   transformers
   torch
   sentence-transformers
   scikit-learn
   pickle
   python-multipart
   ```

2. **Create vercel.json for API:**
   ```json
   {
     "functions": {
       "main.py": {
         "runtime": "python3.9"
       }
     },
     "routes": [
       {
         "src": "/(.*)",
         "dest": "main.py"
       }
     ]
   }
   ```

3. **Deploy API:**
   ```bash
   cd "my_ai_api - Copy"
   vercel --prod
   ```

## Option 2: Railway (Full-Stack)

### 1. Frontend + Backend Together
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize:**
   ```bash
   railway login
   railway init
   ```

3. **Create railway.json:**
   ```json
   {
     "deploy": {
       "startCommand": "npm run build && npm start",
       "healthcheckPath": "/health"
     }
   }
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

## Option 3: Netlify + Render

### Frontend on Netlify
1. **Build for web:**
   ```bash
   cd my-repair-react-native
   npx expo export --platform web
   ```

2. **Create _redirects file:**
   ```
   /*    /index.html   200
   ```

3. **Deploy to Netlify:**
   - Drag dist folder to netlify.com
   - Or connect GitHub repo

### Backend on Render
1. **Create render.yaml:**
   ```yaml
   services:
     - type: web
       name: ai-repair-api
       env: python
       buildCommand: "pip install -r requirements.txt"
       startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
       envVars:
         - key: PYTHON_VERSION
           value: 3.9.0
   ```

## Option 4: AWS (Advanced)

### Using AWS Amplify + Lambda
1. **Install AWS Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize project:**
   ```bash
   cd my-repair-react-native
   amplify init
   ```

3. **Add hosting:**
   ```bash
   amplify add hosting
   amplify publish
   ```

4. **Add API:**
   ```bash
   amplify add api
   amplify push
   ```

## Option 5: Google Cloud Platform

### Using Cloud Run
1. **Create Dockerfile for API:**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy ai-repair-api --source .
   ```

## Quick Start Recommendation

**For beginners:** Use Vercel (easiest)
**For full control:** Use Railway or Render
**For enterprise:** Use AWS or GCP

## Environment Variables to Set

```env
# API Configuration
API_BASE_URL=your-deployed-api-url
MODEL_PATH=/path/to/models
CORS_ORIGINS=your-frontend-url

# Optional
SENTRY_DSN=your-error-tracking
ANALYTICS_KEY=your-analytics-key
```

## Post-Deployment Checklist

- [ ] Test API endpoints
- [ ] Verify CORS settings
- [ ] Check mobile responsiveness
- [ ] Test TTS functionality
- [ ] Validate model predictions
- [ ] Set up monitoring
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Add error tracking

Would you like me to help you deploy with a specific option?
