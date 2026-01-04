# 🚀 Quick Start Guide - OvaWell Clinical Suite

Get your app running in **5 minutes**!

## ⚡ Prerequisites

- Python 3.9 or higher
- Internet connection
- API keys (Gemini + Spoonacular)

## 📋 Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd /Users/janhvidoijad/femmenourish

# Install all required packages
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed streamlit-1.31.0 google-generativeai-0.3.2 ...
```

### 2. Verify API Keys (1 minute)

Your `.env` file should already have:
```properties
GEMINI_API_KEY=your_gemini_api_key_here
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

✅ **Make sure your API keys are set!**

### 3. Run the Application (30 seconds)

```bash
streamlit run app.py
```

**Expected output:**
```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
```

### 4. Open in Browser

The app will automatically open at: **http://localhost:8501**

If it doesn't, manually visit that URL.

---

## 🎯 First Time Use

### For Your Demo/Hackathon:

1. **Select Clinic Location** (Sidebar)
   - Choose "Pune" (or your city)

2. **Tab 1: Patient Assessment**
   - Enter patient name: "Demo Patient"
   - Set periods per year: 7 (triggers PCOS criteria)
   - Check some clinical signs (hirsutism, acne)
   - Optional: Upload ultrasound image
   - Click **"Analyze & Diagnose"**

3. **Tab 2: Nutrition Prescription**
   - After assessment, click **"Generate Meal Plan"**
   - Select preferences (vegetarian, budget, etc.)
   - Wait 30-60 seconds for API calls
   - View personalized meal plan
   - Download PDF report

4. **Tab 3: Leftover Recipe Finder**
   - Enter: "chicken, spinach, quinoa"
   - Click **"Find Recipes"**
   - See PCOS-friendly suggestions

5. **Tab 4: Patient Tracker**
   - View all assessed patients
   - See summary statistics

---

## ⚠️ Troubleshooting

### "Module not found" errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### "API key not found"
- Check your `.env` file exists in project root
- Verify API keys are uncommented (no # at start)

### "API quota exceeded" (Spoonacular)
- Free tier = 150 requests/day
- Each meal plan generation uses ~30-40 requests
- Wait 24 hours or upgrade to paid plan

### Streamlit won't start
```bash
# Check if port 8501 is in use
lsof -ti:8501 | xargs kill -9

# Try again
streamlit run app.py
```

### "Cannot connect to Gemini API"
- Check internet connection
- Verify API key is valid at https://makersuite.google.com/app/apikey
- Try regenerating the key

---

## 🎨 Features Overview

| Tab | Feature | Time to Complete |
|-----|---------|------------------|
| 🔬 Assessment | PCOS diagnosis using Rotterdam criteria | 2-3 minutes |
| 🍽️ Nutrition | Geographic meal plan generation | 1-2 minutes |
| ♻️ Leftover Finder | Recipe suggestions from ingredients | 30 seconds |
| 📊 Tracker | Patient management dashboard | Instant |

---

## 💡 Demo Tips

### For Best Demo Experience:

1. **Pre-create a sample patient** before your presentation
2. **Have sample ultrasound image ready** (download from Google Images: "pcos ultrasound")
3. **Test all features once** to cache API responses
4. **Prepare 2-minute pitch** focusing on geographic intelligence
5. **Show PDF export** - judges love tangible outputs!

### Sample Demo Script (2 min):

> "OvaWell solves the gap between PCOS diagnosis and treatment. Watch as I assess a patient in real-time..."
> 
> [Enter symptoms, show analysis]
> 
> "Now, instead of vague advice, we generate a personalized 4-week meal plan. The key innovation? Geographic intelligence. This patient is in Pune, so recipes use jowar and bajra from Mandai Market, not expensive quinoa."
> 
> [Show meal plan, shopping list]
> 
> "Doctors get a professional PDF, patients get actionable guidance, and food waste is reduced through our leftover manager. That's complete PCOS care in one platform."

---

## 📊 Performance Expectations

### API Response Times:
- **PCOS Assessment:** 3-5 seconds
- **Meal Plan Generation (1 week):** 30-45 seconds
- **Meal Plan Generation (4 weeks):** 2-3 minutes
- **Leftover Recipe Finder:** 10-15 seconds
- **PDF Generation:** 2-3 seconds

### API Usage (Spoonacular Free Tier):
- **1 Patient Assessment:** 0 requests
- **1 Week Meal Plan:** ~30 requests
- **4 Week Meal Plan:** ~120 requests
- **Leftover Search:** ~5 requests

**Daily limit:** 150 requests = ~1 full meal plan + demos

---

## 🔧 Optional Enhancements (Post-Demo)

### If you have extra time:

1. **Add Custom CSS**
   - Create `assets/styles/custom.css`
   - More pink theming!

2. **Sample Data**
   - Create `data/sample_patients.json`
   - Pre-load demo patients

3. **Ultrasound Samples**
   - Download 2-3 sample images
   - Place in `assets/sample_ultrasounds/`

4. **Kaggle Dataset**
   - Follow `DATASET_SETUP.md`
   - Train custom model (if time permits)

---

## 🎬 Video Demo Checklist

Record a 2-minute video showing:

- [ ] Homepage with professional pink theme
- [ ] Patient assessment flow
- [ ] Diagnosis results with Rotterdam criteria
- [ ] Meal plan generation (can speed up video)
- [ ] Geographic-adapted recipes (zoom in on local stores)
- [ ] Shopping list with cost estimates
- [ ] PDF download
- [ ] Leftover recipe finder
- [ ] Patient tracker dashboard

---

## 📞 Support

**Common Issues:**

| Issue | Solution |
|-------|----------|
| App won't start | Check Python version: `python --version` (need 3.9+) |
| Blank screen | Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) |
| API errors | Check API keys in `.env`, verify internet connection |
| Slow generation | Normal for first time (caching), subsequent runs faster |

---

## 🏆 Winning Points to Emphasize

1. **Professional Healthcare Tool** - Not consumer app, for doctors
2. **Geographic Intelligence** - Unique innovation, culturally adapted
3. **API-First Architecture** - Scalable, maintainable, not hardcoded
4. **Complete Care Cycle** - Diagnosis → Management → Tracking
5. **Real Clinical Impact** - Solves actual gap in PCOS care
6. **Women's Health Focus** - Addressing underserved medical niche
7. **Production-Ready** - Professional PDF exports, proper disclaimers

---

## 🎯 Next Steps After Hackathon

If you win (and you will! 🎉):

1. Download Kaggle PCOS dataset
2. Train proper CNN model for ultrasound analysis
3. Add more cities (50+ locations)
4. Integrate with EHR systems
5. Build patient mobile app companion
6. Get medical advisory board
7. Seek funding / partnerships with women's health clinics

---

**You're all set! Run `streamlit run app.py` and let's win this! 🚀🌸**
