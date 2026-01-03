# 🌸 OvaWell Clinical Suite

**AI-Powered PCOS Diagnosis & Nutrition Management for Healthcare Professionals**

A professional-grade platform that combines PCOS detection with geographically-intelligent nutrition planning, specifically designed for healthcare providers.

---

## 🎯 Problem Statement

**PCOS affects 1 in 10 women worldwide**, yet:
- Diagnosis takes 2+ years on average
- After diagnosis, patients receive vague advice ("eat healthy, lose weight")
- No tools exist to bridge diagnosis → personalized nutrition management
- Generic meal plans ignore local food availability and cultural preferences

**OvaWell solves this** by providing doctors with:
1. AI-powered PCOS risk assessment (symptoms + optional ultrasound)
2. Automatic generation of culturally-adapted, PCOS-optimized 4-week meal plans
3. Geographic intelligence - recipes use locally available ingredients
4. Smart leftover recipe generator for patient compliance
5. Patient tracking dashboard for monitoring outcomes

---

## ✨ Key Features

### 1. Clinical PCOS Assessment
- **Rotterdam Criteria-based** symptom analysis
- Optional ultrasound image analysis
- **Gemini AI** for intelligent risk scoring
- Phenotype classification (A, B, C, D)
- Evidence-based recommendations

### 2. Geographic Nutrition Intelligence ⭐ *Unique Innovation*
- Select clinic location (Pune, Chennai, London, etc.)
- **Spoonacular API** fetches PCOS-safe recipes
- **Gemini AI** adapts recipes to local ingredients
- Shopping lists with local store recommendations
- Budget-aware planning (Low/Medium/High)

### 3. Smart Leftover Recipe Generator
- Input available ingredients
- Get PCOS-friendly recipe suggestions
- Reduces food waste → increases patient compliance

### 4. Patient Tracking Dashboard
- Multi-patient management
- Compliance monitoring
- Symptom trend visualization
- Export reports as professional PDFs

---

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Streamlit | Rapid healthcare UI development |
| **LLM** | Google Gemini API | Symptom analysis, recipe adaptation |
| **Recipe Data** | Spoonacular API | PCOS-filtered recipe database |
| **Image Analysis** | OpenCV / TensorFlow | Ultrasound cyst detection |
| **Visualization** | Plotly | Patient progress charts |
| **PDF Export** | ReportLab | Professional meal plan reports |
| **Config** | YAML/JSON | Minimal city metadata only |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Gemini API key ([Get free key](https://makersuite.google.com/app/apikey))
- Spoonacular API key ([Get free tier - 150 req/day](https://spoonacular.com/food-api))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd femmenourish

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run the application
streamlit run app.py
```

The app will open at `http://localhost:8501`

---

## 📁 Project Structure

```
femmenourish/
├── app.py                      # Main Streamlit application
├── requirements.txt
├── .env                        # API keys (not in git)
├── README.md
├── .streamlit/
│   └── config.toml            # Theme configuration (pink palette)
├── config/
│   ├── cities.json            # City metadata (minimal!)
│   ├── pcos_rules.json        # Rotterdam criteria, nutrition rules
│   └── ui_config.json         # UI text, labels, help text
├── utils/
│   ├── __init__.py
│   ├── gemini_client.py       # Gemini API wrapper
│   ├── spoonacular_client.py  # Spoonacular API wrapper
│   ├── image_analyzer.py      # Ultrasound analysis
│   ├── assessment.py          # PCOS risk scoring
│   ├── pdf_generator.py       # Report generation
│   └── ui_components.py       # Reusable UI elements
├── assets/
│   ├── styles/
│   │   └── main.css           # Custom pink theme
│   └── sample_ultrasound.jpg  # Demo image
└── data/
    ├── cache/                 # API response caching
    └── sample_patients.json   # Demo patient data
```

---

## 🎨 Design Philosophy

**Women's Health Professional Aesthetic:**
- **Primary Color**: #FFB3C1 (Soft pastel pink)
- **Secondary**: #FF8FA3 (Medium pink)
- **Accent**: #C8E6C9 (Soft mint green)
- **Background**: #FFF5F7 (Very light pink tint)

**NOT** cold hospital blue. **NOT** overly cutesy consumer app.  
**GOAL**: Make doctors AND patients feel comfortable and confident.

---

## 📊 API Usage Strategy (No Hardcoding!)

### ✅ What We DO:
- Use **Spoonacular API** for all recipe/nutrition data
- Use **Gemini API** for intelligent analysis and adaptation
- Store only **minimal metadata** in config files

### ❌ What We DON'T Do:
- ❌ Hardcode recipe databases
- ❌ Hardcode ingredient prices
- ❌ Build complex ML models from scratch
- ❌ Store thousands of food entries

### Why This Works:
- **Scalable**: Add new cities instantly
- **Maintainable**: APIs update themselves
- **Professional**: Enterprise-grade data
- **Fast to build**: 6-hour hackathon feasible!

---

## 🌍 Geographic Intelligence

### Currently Supported Cities:
- **India**: Pune, Mumbai, Chennai, Bangalore, Delhi
- **International**: London, Dubai, New York

### How It Works:
1. Doctor selects clinic location
2. System uses city's cuisine tag (e.g., "Indian", "British")
3. Spoonacular fetches culturally appropriate recipes
4. Gemini adapts ingredients to local availability
   - Example: "Replace quinoa with jowar (available at Mandai Market)"
5. Shopping list shows local stores and estimated costs

---

## 📖 Usage Guide

### For Healthcare Professionals:

1. **Setup Clinic Location**
   - Select your city from sidebar
   - System adapts all recommendations accordingly

2. **Assess New Patient**
   - Navigate to "Patient Assessment" tab
   - Enter symptoms (takes 2 minutes)
   - Optional: Upload ultrasound image
   - Click "Analyze" → Get PCOS risk score

3. **Generate Meal Plan**
   - Click "Generate Nutrition Plan"
   - Review 4-week meal plan
   - Customize based on patient preferences
   - Download professional PDF report

4. **Send to Patient**
   - PDF includes recipes, shopping lists, nutrition guidance
   - Patient can follow plan immediately

5. **Track Progress**
   - Use "Patient Tracker" tab
   - Monitor compliance and symptom improvement
   - Adjust plans as needed

---

## 🔬 PCOS Detection (Rotterdam Criteria)

**Diagnosis requires 2 out of 3:**

1. **Oligo-ovulation / Anovulation**
   - < 9 periods per year
   - Cycle length > 35 days

2. **Hyperandrogenism** (Clinical or Biochemical)
   - Hirsutism (excess hair)
   - Acne (especially jawline)
   - Elevated testosterone

3. **Polycystic Ovaries on Ultrasound**
   - 12+ follicles (2-9mm)
   - Ovarian volume > 10ml

**Phenotypes:**
- **A** (Frank PCOS): All 3 criteria - Severe
- **B** (Classic Non-PCO): Criteria 1 + 2 - Moderate
- **C** (Ovulatory): Criteria 2 + 3 - Moderate
- **D** (Mild): Criteria 1 + 3 - Mild

---

## 🍽️ PCOS Nutrition Guidelines

### Macro Distribution:
- **40% Carbs** (Low GI only!)
- **30% Protein** (Lean sources)
- **30% Healthy Fats** (Omega-3, nuts, avocado)

### Spoonacular Filters:
- `maxSugar`: 25g
- `minProtein`: 20g
- `minFiber`: 8g
- `maxGlycemicLoad`: 10
- `diet`: "low-carb"

### Key Nutrients:
- **Omega-3**: Reduces inflammation
- **Magnesium**: Improves insulin sensitivity
- **Chromium**: Enhances insulin function
- **Vitamin D**: Supports fertility
- **Inositol**: Improves ovulation

---

## 📦 Kaggle Dataset (Optional - For Ultrasound Analysis)

To enable ultrasound image analysis:

```bash
# Install Kaggle CLI
pip install kaggle

# Download PCOS ultrasound dataset
kaggle datasets download -d anaghachoudhari/pcos-detection-using-ultrasound-images

# Extract to data/ultrasound/
unzip pcos-detection-using-ultrasound-images.zip -d data/ultrasound/
```

**Dataset**: ~3,500 labeled ultrasound images (PCOS positive/negative)

**Note**: For hackathon demo, image analysis uses simplified OpenCV approach. For production, train a CNN on this dataset.

---

## 🎤 Demo Script (2-Minute Pitch)

> *"OvaWell Clinical Suite solves a critical gap in women's healthcare. While PCOS affects 1 in 10 women, diagnosis takes years, and post-diagnosis care is vague and generic.*
>
> *Our platform empowers doctors to:*
> 1. *Assess PCOS risk in under 5 minutes using AI-powered symptom analysis*
> 2. *Instantly generate personalized 4-week meal plans that are culturally appropriate and use locally available ingredients*
> 3. *Provide patients with actionable, evidence-based nutrition guidance they can follow immediately*
>
> *What makes us unique? Geographic intelligence. A patient in Pune gets jowar-based recipes from Mandai Market. A patient in London gets meal-prep friendly salmon recipes from Tesco. Same PCOS science, locally adapted execution.*
>
> *Because the best nutrition plan is the one your patient can actually stick to."*

---

## 🏆 Competitive Advantages

| Feature | Generic Apps | OvaWell |
|---------|-------------|---------|
| **Target User** | Consumers | Healthcare Professionals |
| **Diagnosis** | Symptom checker only | Rotterdam criteria + Ultrasound |
| **Nutrition** | Generic meal plans | PCOS-optimized, evidence-based |
| **Localization** | No adaptation | Geographic intelligence |
| **Compliance Tools** | None | Leftover manager, tracking |
| **Output** | App-only | Professional PDF reports |

---

## 🚧 Roadmap

### Phase 1 (Current - Hackathon MVP)
- ✅ PCOS detection + nutrition planning
- ✅ 5-10 cities supported
- ✅ Basic patient tracking

### Phase 2 (6 months)
- 🔲 Advanced ultrasound analysis (CNN model)
- 🔲 50+ cities worldwide
- 🔲 Integration with EHR systems
- 🔲 Mobile app for patients

### Phase 3 (1 year)
- 🔲 Endometriosis support
- 🔲 Menopause management
- 🔲 Pregnancy nutrition
- 🔲 Telehealth integration

### Vision
Complete women's hormonal health platform used by clinics worldwide.

---

## 🤝 Contributing

This is a hackathon project! Contributions welcome after initial competition period.

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- Inspired by the winning OvaAI project (Google Girl Hackathon 2025)
- EatWise nutrition concept
- Rotterdam ESHRE/ASRM PCOS Consensus Guidelines
- Spoonacular and Google Gemini teams for excellent APIs

---

## 📧 Contact

[Your contact information]

---

## ⚠️ Medical Disclaimer

This tool is designed to **assist healthcare professionals** and should not replace clinical judgment. Always consider the complete clinical picture when making diagnostic and treatment decisions. Patients should consult with qualified healthcare providers before making dietary changes.

---

**Built with ❤️ for women's health**

🌸 **OvaWell - Empowering PCOS Care Through AI**
