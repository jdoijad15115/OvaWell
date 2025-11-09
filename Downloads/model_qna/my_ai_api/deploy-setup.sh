#!/bin/bash

echo "🚀 RepAIr AI API - Cloud Deployment Setup"
echo "========================================"

# Check if we're in the API directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the 'my_ai_api - Copy' directory"
    exit 1
fi

echo "📦 Step 1: Preparing deployment files..."

# Create .dockerignore
echo "Creating .dockerignore..."
cat > .dockerignore << EOF
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
.env
.venv/
venv/
.git/
.gitignore
README.md
Dockerfile
.dockerignore
*.log
.pytest_cache/
EOF

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << EOF
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
.env
.venv/
venv/
.git/
*.log
.pytest_cache/
.coverage
htmlcov/
dist/
build/
*.egg-info/
EOF
fi

echo "✅ Deployment files created!"
echo ""
echo "🌟 Deployment Options:"
echo ""
echo "1. 🚂 RAILWAY (Recommended - Easiest)"
echo "   • Go to https://railway.app"
echo "   • Sign up with GitHub"
echo "   • Click 'New Project' → 'Deploy from GitHub'"
echo "   • Select your repository"
echo "   • Set service name to 'repair-ai-api'"
echo "   • Railway will auto-detect Python and deploy!"
echo ""
echo "2. 🎨 RENDER"
echo "   • Go to https://render.com"
echo "   • Sign up with GitHub"
echo "   • Click 'New' → 'Web Service'"
echo "   • Connect your repository"
echo "   • Use 'render.yaml' configuration"
echo ""
echo "3. 🐳 DOCKER (Any Platform)"
echo "   • Build: docker build -t repair-ai ."
echo "   • Run: docker run -p 8000:8000 repair-ai"
echo "   • Deploy to any Docker-compatible platform"
echo ""
echo "📝 Don't forget to:"
echo "   • Update CORS_ORIGINS in main.py with your domain"
echo "   • Update API_BASE_URL in React Native app"
echo "   • Test the /health endpoint after deployment"
echo ""
echo "🔗 After deployment, update your React Native app:"
echo "   • Edit services/AIService.ts"
echo "   • Change API_BASE_URL to your deployed URL"
echo "   • Example: const API_BASE_URL = 'https://repair-ai-production-xyz.railway.app';"
echo ""
echo "🎯 Ready to deploy! Choose your platform and follow the steps above."
