"""
OvaWell Clinical Suite - Main Streamlit Application
AI-Powered PCOS Diagnosis & Nutrition Management for Healthcare Professionals
"""

import streamlit as st
import json
import os
from datetime import datetime
from typing import Dict, List, Optional
import pandas as pd

# Import utility modules
from utils.gemini_client import GeminiClient
from utils.spoonacular_client import SpoonacularClient
from utils.image_analyzer import UltrasoundAnalyzer
from utils.assessment import PCOSAssessment
from utils.pdf_generator import PDFGenerator

# Page configuration
st.set_page_config(
    page_title="OvaWell Clinical Suite",
    page_icon="🌸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for women's health theme
st.markdown("""
<style>
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Main styling */
    .main {
        background-color: #FFF5F7;
        font-family: 'Inter', sans-serif;
    }
    
    /* Headers */
    h1, h2, h3 {
        font-family: 'Poppins', sans-serif;
        color: #4A4A4A;
    }
    
    /* Hero header */
    .hero-header {
        background: linear-gradient(135deg, #FFB3C1 0%, #FF8FA3 100%);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    /* Cards */
    .metric-card {
        background: white;
        border: 1px solid #FFE4E8;
        border-left: 4px solid #FFB3C1;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 20px rgba(255, 179, 193, 0.15);
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #FFB3C1 0%, #FF8FA3 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 143, 163, 0.4);
    }
    
    /* Info boxes */
    .stInfo {
        background-color: #F3E5F5;
        border-left: 4px solid #B39DDB;
        border-radius: 8px;
    }
    
    .stSuccess {
        background-color: #E8F5E9;
        border-left: 4px solid #81C784;
        border-radius: 8px;
    }
    
    .stWarning {
        background-color: #FFF3E0;
        border-left: 4px solid #FFB74D;
        border-radius: 8px;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 1rem;
        background-color: transparent;
    }
    
    .stTabs [data-baseweb="tab"] {
        background-color: white;
        border-radius: 8px 8px 0 0;
        color: #8E8E8E;
        font-weight: 500;
    }
    
    .stTabs [aria-selected="true"] {
        background-color: #FFB3C1;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Load configuration files
@st.cache_data
def load_config():
    """Load all configuration files."""
    with open('config/cities.json', 'r') as f:
        cities = json.load(f)
    with open('config/pcos_rules.json', 'r') as f:
        pcos_rules = json.load(f)
    with open('config/ui_config.json', 'r') as f:
        ui_config = json.load(f)
    return cities, pcos_rules, ui_config

# Initialize session state
def init_session_state():
    """Initialize session state variables."""
    if 'patients' not in st.session_state:
        st.session_state.patients = []
    if 'current_patient' not in st.session_state:
        st.session_state.current_patient = None
    if 'current_assessment' not in st.session_state:
        st.session_state.current_assessment = None
    if 'current_meal_plan' not in st.session_state:
        st.session_state.current_meal_plan = None
    if 'selected_city' not in st.session_state:
        st.session_state.selected_city = "Pune"

# Initialize clients
@st.cache_resource
def get_clients():
    """Initialize API clients (cached)."""
    try:
        gemini_client = GeminiClient()
        spoonacular_client = SpoonacularClient()
        ultrasound_analyzer = UltrasoundAnalyzer()
        pcos_assessor = PCOSAssessment()
        pdf_generator = PDFGenerator()
        return gemini_client, spoonacular_client, ultrasound_analyzer, pcos_assessor, pdf_generator
    except Exception as e:
        st.error(f"Error initializing clients: {str(e)}")
        st.info("Please check your .env file and ensure API keys are set correctly.")
        return None, None, None, None, None

# Main app
def main():
    """Main application entry point."""
    
    # Initialize
    init_session_state()
    cities_config, pcos_rules, ui_config = load_config()
    clients = get_clients()
    
    if clients[0] is None:
        st.stop()
    
    gemini_client, spoonacular_client, ultrasound_analyzer, pcos_assessor, pdf_generator = clients
    
    # Sidebar
    with st.sidebar:
        st.markdown("### 🌸 OvaWell Clinical Suite")
        st.markdown("*AI-Powered PCOS Care*")
        st.markdown("---")
        
        # Clinic location selector
        st.markdown("#### 📍 Clinic Location")
        city_options = list(cities_config['cities'].keys())
        selected_city = st.selectbox(
            "Select your city",
            city_options,
            index=city_options.index(st.session_state.selected_city),
            help=ui_config['help_text']['geographic_customization']
        )
        st.session_state.selected_city = selected_city
        
        city_info = cities_config['cities'][selected_city]
        st.info(f"""
        **{city_info['name']}**  
        📍 {city_info['region']}  
        💰 Currency: {city_info['currency_symbol']}  
        🍽️ Cuisines: {', '.join(city_info['cuisine_tags'][:2])}
        """)
        
        st.markdown("---")
        
        # Quick stats
        st.markdown("#### 📊 Quick Stats")
        st.metric("Total Patients", len(st.session_state.patients))
        st.metric("Active Plans", sum(1 for p in st.session_state.patients if p.get('has_meal_plan')))
        
        st.markdown("---")
        st.caption(ui_config['app_info']['footer_text'])
    
    # Main content
    # Hero header
    st.markdown(f"""
    <div class="hero-header">
        <h1>🌸 {ui_config['app_info']['name']}</h1>
        <p>{ui_config['app_info']['tagline']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Tabs
    tab1, tab2, tab3, tab4 = st.tabs([
        "🔬 Patient Assessment",
        "🍽️ Nutrition Prescription",
        "♻️ Leftover Recipe Finder",
        "📊 Patient Tracker"
    ])
    
    # TAB 1: PATIENT ASSESSMENT
    with tab1:
        render_assessment_tab(
            gemini_client, 
            ultrasound_analyzer, 
            pcos_assessor, 
            ui_config
        )
    
    # TAB 2: NUTRITION PRESCRIPTION
    with tab2:
        render_nutrition_tab(
            gemini_client,
            spoonacular_client,
            pdf_generator,
            city_info,
            selected_city,
            ui_config
        )
    
    # TAB 3: LEFTOVER RECIPE FINDER
    with tab3:
        render_leftover_tab(
            spoonacular_client,
            city_info,
            ui_config
        )
    
    # TAB 4: PATIENT TRACKER
    with tab4:
        render_tracker_tab(ui_config)

# ==================== TAB 1: PATIENT ASSESSMENT ====================
def render_assessment_tab(gemini_client, ultrasound_analyzer, pcos_assessor, ui_config):
    """Render the patient assessment tab."""
    
    st.header("🔬 PCOS Clinical Assessment")
    st.markdown(ui_config['help_text']['rotterdam_criteria'])
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Patient Information")
        
        patient_name = st.text_input(
            "Patient Name",
            placeholder=ui_config['placeholders']['patient_name']
        )
        
        col_age, col_bmi = st.columns(2)
        with col_age:
            age = st.number_input("Age", min_value=15, max_value=50, value=25)
        with col_bmi:
            bmi = st.number_input("BMI", min_value=15.0, max_value=50.0, value=22.0, step=0.1)
        
        st.markdown("#### Menstrual History")
        
        periods_per_year = st.slider(
            "Periods in last 12 months",
            min_value=0,
            max_value=13,
            value=12,
            help="< 9 indicates oligo-ovulation"
        )
        
        cycle_length = st.number_input(
            "Average cycle length (days)",
            min_value=21,
            max_value=90,
            value=28,
            help="> 35 days indicates irregular ovulation"
        )
        
        st.markdown("#### Clinical Signs")
        
        hirsutism = st.checkbox("Hirsutism (excess facial/body hair)")
        acne = st.checkbox("Acne (especially jawline/chest)")
        hair_loss = st.checkbox("Hair thinning/male-pattern baldness")
        
        st.markdown("#### Additional Risk Factors")
        
        family_history = st.checkbox("Family history of PCOS")
        insulin_resistance = st.checkbox("Known insulin resistance/prediabetes")
        testosterone_elevated = st.checkbox("Elevated testosterone (lab result)")
    
    with col2:
        st.subheader("Ultrasound Analysis (Optional)")
        st.info(ui_config['help_text']['ultrasound_analysis'])
        
        ultrasound_file = st.file_uploader(
            "Upload ultrasound image",
            type=['jpg', 'jpeg', 'png'],
            help="Transvaginal ultrasound showing ovaries"
        )
        
        ultrasound_result = None
        
        if ultrasound_file:
            # Display image
            st.image(ultrasound_file, caption="Uploaded Ultrasound", width=400)
            
            # Analyze button
            if st.button("🔍 Analyze Ultrasound", key="analyze_ultrasound"):
                with st.spinner("Analyzing ultrasound image..."):
                    # Save temporarily
                    temp_path = f"/tmp/ultrasound_{datetime.now().timestamp()}.jpg"
                    with open(temp_path, 'wb') as f:
                        f.write(ultrasound_file.read())
                    
                    # Analyze
                    ultrasound_result = ultrasound_analyzer.analyze_image(temp_path)
                    
                    # Clean up
                    os.remove(temp_path)
                    
                    # Display results
                    if 'error' not in ultrasound_result:
                        if ultrasound_result['pcos_pattern'] == 'positive':
                            st.success(f"✅ PCOS Pattern Detected ({ultrasound_result['confidence']:.0f}% confidence)")
                        else:
                            st.info(f"ℹ️ No PCOS Pattern ({ultrasound_result['confidence']:.0f}% confidence)")
                        
                        st.write(f"**Cyst Count:** {ultrasound_result['cyst_count_estimate']}")
                        st.write(f"**Volume:** {ultrasound_result['ovarian_volume_estimate']}")
                        st.caption(ultrasound_result['interpretation'])
                        
                        if 'note' in ultrasound_result:
                            st.caption(f"⚠️ {ultrasound_result['note']}")
                    else:
                        st.error(ultrasound_result['error'])
    
    st.markdown("---")
    
    # Analyze button
    col_btn1, col_btn2, col_btn3 = st.columns([1, 1, 2])
    
    with col_btn1:
        analyze_button = st.button(
            "🔬 Analyze & Diagnose",
            type="primary",
            use_container_width=True
        )
    
    if analyze_button:
        if not patient_name:
            st.error("Please enter patient name")
        else:
            with st.spinner("Analyzing patient data..."):
                # Prepare symptom data
                symptoms = {
                    'periods_per_year': periods_per_year,
                    'cycle_length': cycle_length,
                    'hirsutism': hirsutism,
                    'acne': acne,
                    'hair_loss': hair_loss,
                    'testosterone_elevated': testosterone_elevated
                }
                
                patient_history = {
                    'age': age,
                    'bmi': bmi,
                    'family_history': family_history,
                    'insulin_resistance': insulin_resistance
                }
                
                # Rotterdam criteria evaluation
                rotterdam_eval = pcos_assessor.evaluate_rotterdam_criteria(
                    symptoms,
                    ultrasound_result
                )
                
                # Risk score
                risk_score = pcos_assessor.calculate_risk_score(symptoms, patient_history)
                
                # Determine risk level
                if risk_score >= 70:
                    risk_level = "High"
                elif risk_score >= 40:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"
                
                # Get recommendations
                recommendations = pcos_assessor.get_recommendations(
                    rotterdam_eval['diagnosis'],
                    rotterdam_eval['phenotype'],
                    risk_score
                )
                
                # Use Gemini for detailed analysis
                gemini_assessment = gemini_client.assess_pcos_risk(
                    symptoms,
                    ultrasound_result,
                    patient_history
                )
                
                # Combine results
                assessment_result = {
                    'patient_name': patient_name,
                    'age': age,
                    'bmi': bmi,
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'rotterdam_score': rotterdam_eval['rotterdam_score'],
                    'criteria_met': rotterdam_eval['criteria_met'],
                    'diagnosis': rotterdam_eval['diagnosis'],
                    'phenotype': rotterdam_eval['phenotype'],
                    'risk_level': risk_level,
                    'risk_score': risk_score,
                    'confidence_percent': gemini_assessment.get('confidence_percent', risk_score),
                    'evidence': rotterdam_eval['evidence'],
                    'key_findings': gemini_assessment.get('key_findings', []),
                    'recommendations': recommendations,
                    'metabolic_risk': gemini_assessment.get('metabolic_risk', 'Moderate'),
                    'ultrasound_result': ultrasound_result
                }
                
                # Store in session state
                st.session_state.current_assessment = assessment_result
                st.session_state.current_patient = patient_name
            
            # Display results
            st.success("✅ Assessment Complete!")
            
            # Results display
            st.markdown("### 📋 Assessment Results")
            
            # Metrics row
            metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
            
            with metric_col1:
                st.metric("Rotterdam Score", rotterdam_eval['rotterdam_score'])
            
            with metric_col2:
                color = {"Low": "🟢", "Medium": "🟡", "High": "🔴"}
                st.metric("Risk Level", f"{color.get(risk_level, '')} {risk_level}")
            
            with metric_col3:
                st.metric("Confidence", f"{assessment_result['confidence_percent']}%")
            
            with metric_col4:
                phenotype_display = rotterdam_eval['phenotype'] if rotterdam_eval['phenotype'] else "N/A"
                st.metric("Phenotype", phenotype_display)
            
            # Diagnosis
            st.markdown("#### 🩺 Diagnosis")
            if rotterdam_eval['diagnosis'] == "PCOS":
                st.error(f"**PCOS Confirmed** - {rotterdam_eval['phenotype']} phenotype")
            else:
                st.success("**PCOS Not Confirmed** based on Rotterdam criteria")
            
            # Evidence
            st.markdown("#### 📊 Evidence")
            for criterion, explanation in rotterdam_eval['evidence'].items():
                with st.expander(f"**{criterion.replace('_', ' ').title()}**"):
                    st.write(explanation)
            
            # Recommendations
            st.markdown("#### 💊 Clinical Recommendations")
            for i, rec in enumerate(recommendations, 1):
                st.write(f"{i}. {rec}")
            
            # Save patient
            with col_btn2:
                if st.button("💾 Save Patient", use_container_width=True):
                    patient_record = assessment_result.copy()
                    patient_record['has_meal_plan'] = False
                    st.session_state.patients.append(patient_record)
                    st.success(f"Patient {patient_name} saved!")
            
            # Generate meal plan button
            with col_btn3:
                if rotterdam_eval['diagnosis'] == "PCOS":
                    st.info("➡️ Go to 'Nutrition Prescription' tab to generate meal plan")

# ==================== TAB 2: NUTRITION PRESCRIPTION ====================
def render_nutrition_tab(gemini_client, spoonacular_client, pdf_generator, city_info, selected_city, ui_config):
    """Render the nutrition prescription tab."""
    
    st.header("🍽️ PCOS Nutrition Prescription")
    
    if not st.session_state.current_assessment:
        st.warning("⚠️ No patient assessment available. Please complete assessment in the first tab.")
        return
    
    assessment = st.session_state.current_assessment
    
    # Patient summary
    st.markdown(f"""
    <div class="metric-card">
        <h3>Current Patient: {assessment['patient_name']}</h3>
        <p><b>Diagnosis:</b> {assessment['diagnosis']} | <b>Phenotype:</b> {assessment.get('phenotype', 'N/A')} | <b>Risk:</b> {assessment['risk_level']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Preferences
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Dietary Preferences")
        
        dietary_restrictions = st.multiselect(
            "Dietary Restrictions",
            ["Vegetarian", "Vegan", "Dairy-Free", "Gluten-Free", "Nut-Free"],
            help="Select any dietary restrictions or preferences"
        )
        
        # Map to Spoonacular intolerances
        intolerance_map = {
            "Dairy-Free": "dairy",
            "Gluten-Free": "gluten",
            "Nut-Free": "tree nut"
        }
        intolerances = [intolerance_map[d] for d in dietary_restrictions if d in intolerance_map]
        
        budget_level = st.select_slider(
            "Budget Level",
            options=["Low", "Medium", "High"],
            value="Medium"
        )
    
    with col2:
        st.subheader("Meal Plan Duration")
        
        plan_weeks = st.slider(
            "Number of weeks",
            min_value=1,
            max_value=4,
            value=1,
            help="Generate meal plan for this many weeks"
        )
        
        st.info(f"""
        **Location:** {selected_city}  
        **Cuisine:** {', '.join(city_info['cuisine_tags'])}  
        **Budget Multiplier:** {city_info['budget_multiplier']}x
        """)
    
    st.markdown("---")
    
    # Generate button
    if st.button("🍳 Generate Personalized Meal Plan", type="primary", use_container_width=True):
        with st.spinner(f"Creating {plan_weeks}-week PCOS meal plan for {selected_city}..."):
            
            # Progress tracking
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            try:
                meal_plan = {}
                all_recipes = []
                
                # Generate for each week
                for week in range(1, plan_weeks + 1):
                    status_text.text(f"Generating Week {week}...")
                    progress_bar.progress(week / (plan_weeks + 2))
                    
                    # Generate for each day
                    for day in range(1, 8):
                        day_key = f"Week{week}_Day{day}"
                        
                        # Breakfast
                        breakfast_recipes = spoonacular_client.search_pcos_recipes(
                            cuisine=city_info['spoonacular_cuisine'],
                            meal_type="breakfast",
                            dietary_restrictions=intolerances,
                            number=1
                        )
                        
                        # Lunch
                        lunch_recipes = spoonacular_client.search_pcos_recipes(
                            cuisine=city_info['spoonacular_cuisine'],
                            meal_type="lunch",
                            dietary_restrictions=intolerances,
                            number=1
                        )
                        
                        # Dinner
                        dinner_recipes = spoonacular_client.search_pcos_recipes(
                            cuisine=city_info['spoonacular_cuisine'],
                            meal_type="dinner",
                            dietary_restrictions=intolerances,
                            number=1
                        )
                        
                        # Snack
                        snack_recipes = spoonacular_client.search_pcos_recipes(
                            cuisine=city_info['spoonacular_cuisine'],
                            meal_type="snack",
                            dietary_restrictions=intolerances,
                            number=1
                        )
                        
                        # Check for errors
                        if any('error' in r for r in [breakfast_recipes, lunch_recipes, dinner_recipes, snack_recipes]):
                            st.error("API error occurred. Please try again or check API limits.")
                            return
                        
                        # Store meals
                        day_meals = {
                            'breakfast': breakfast_recipes['results'][0] if breakfast_recipes.get('results') else {},
                            'lunch': lunch_recipes['results'][0] if lunch_recipes.get('results') else {},
                            'dinner': dinner_recipes['results'][0] if dinner_recipes.get('results') else {},
                            'snack': snack_recipes['results'][0] if snack_recipes.get('results') else {}
                        }
                        
                        meal_plan[day_key] = day_meals
                        
                        # Collect all recipes
                        for meal_type, recipe in day_meals.items():
                            if recipe:
                                all_recipes.append(recipe)
                
                # Adapt recipes to location using Gemini
                status_text.text("Adapting recipes to local ingredients...")
                progress_bar.progress(0.8)
                
                adapted_recipes = gemini_client.customize_recipes_for_location(
                    all_recipes[:5],  # Sample for adaptation
                    selected_city,
                    city_info,
                    {'dietary_restrictions': dietary_restrictions, 'budget': budget_level}
                )
                
                # Generate shopping list
                status_text.text("Creating shopping list...")
                progress_bar.progress(0.9)
                
                shopping_list = gemini_client.generate_shopping_list(
                    meal_plan,
                    selected_city,
                    city_info,
                    num_people=1
                )
                
                # Store in session state
                st.session_state.current_meal_plan = {
                    'meal_plan': meal_plan,
                    'adapted_recipes': adapted_recipes,
                    'shopping_list': shopping_list,
                    'city': selected_city,
                    'weeks': plan_weeks
                }
                
                # Update patient record
                for patient in st.session_state.patients:
                    if patient['patient_name'] == assessment['patient_name']:
                        patient['has_meal_plan'] = True
                        break
                
                progress_bar.progress(1.0)
                status_text.text("✅ Meal plan generated successfully!")
                
                st.success("🎉 Personalized PCOS meal plan ready!")
                
            except Exception as e:
                st.error(f"Error generating meal plan: {str(e)}")
                return
    
    # Display meal plan if available
    if st.session_state.current_meal_plan:
        st.markdown("---")
        st.markdown("### 📅 Your Meal Plan")
        
        meal_plan_data = st.session_state.current_meal_plan
        
        # Week selector
        selected_week = st.selectbox(
            "Select Week",
            [f"Week {i+1}" for i in range(meal_plan_data['weeks'])]
        )
        
        week_num = int(selected_week.split()[1])
        
        # Display week's meals in a table
        for day in range(1, 8):
            day_key = f"Week{week_num}_Day{day}"
            
            if day_key in meal_plan_data['meal_plan']:
                st.markdown(f"#### Day {day}")
                
                day_meals = meal_plan_data['meal_plan'][day_key]
                
                col1, col2, col3, col4 = st.columns(4)
                
                for col, (meal_type, recipe) in zip([col1, col2, col3, col4], day_meals.items()):
                    with col:
                        if recipe:
                            st.markdown(f"**{meal_type.title()}**")
                            if 'image' in recipe:
                                st.image(recipe['image'], width=200)
                            st.write(recipe.get('title', 'N/A')[:40])
                            if 'readyInMinutes' in recipe:
                                st.caption(f"⏱️ {recipe['readyInMinutes']} min")
                
                st.markdown("---")
        
        # Shopping list
        st.markdown("### 🛒 Shopping List")
        
        shopping_data = meal_plan_data['shopping_list']
        
        if 'categories' in shopping_data:
            for category, items in shopping_data['categories'].items():
                with st.expander(f"**{category}**"):
                    for item in items:
                        st.write(f"✓ {item.get('item', 'N/A')} - {item.get('quantity', '')} ({item.get('where', 'Local stores')})")
        
        if 'total_estimated_cost' in shopping_data:
            st.metric("Estimated Weekly Cost", shopping_data['total_estimated_cost'])
        
        # Download PDF
        st.markdown("---")
        
        if st.button("📄 Download PDF Report", type="primary"):
            with st.spinner("Generating professional PDF report..."):
                try:
                    pdf_path = f"/tmp/meal_plan_{assessment['patient_name']}_{datetime.now().timestamp()}.pdf"
                    
                    pdf_generator.generate_meal_plan_pdf(
                        assessment['patient_name'],
                        meal_plan_data['meal_plan'],
                        shopping_data,
                        assessment,
                        pdf_path,
                        selected_city
                    )
                    
                    with open(pdf_path, 'rb') as f:
                        st.download_button(
                            label="⬇️ Download Meal Plan PDF",
                            data=f,
                            file_name=f"OvaWell_MealPlan_{assessment['patient_name']}.pdf",
                            mime="application/pdf"
                        )
                    
                    st.success("PDF generated! Click button above to download.")
                    
                except Exception as e:
                    st.error(f"Error generating PDF: {str(e)}")

# ==================== TAB 3: LEFTOVER RECIPE FINDER ====================
def render_leftover_tab(spoonacular_client, city_info, ui_config):
    """Render the leftover recipe finder tab."""
    
    st.header("♻️ Smart Leftover Recipe Finder")
    st.markdown("Enter ingredients you have, and we'll suggest PCOS-friendly recipes!")
    
    st.markdown("---")
    
    # Ingredient input
    ingredients_input = st.text_area(
        "Available Ingredients",
        placeholder="e.g., chicken, spinach, quinoa, tomatoes",
        help="Enter ingredients separated by commas"
    )
    
    if st.button("🔍 Find PCOS-Friendly Recipes", type="primary"):
        if not ingredients_input:
            st.warning("Please enter at least one ingredient")
        else:
            ingredients_list = [i.strip() for i in ingredients_input.split(',')]
            
            with st.spinner("Searching for recipes..."):
                recipes = spoonacular_client.find_recipes_by_ingredients(
                    ingredients_list,
                    cuisine=city_info['spoonacular_cuisine'],
                    number=5
                )
                
                if recipes:
                    st.success(f"Found {len(recipes)} PCOS-friendly recipes!")
                    
                    for recipe in recipes:
                        col1, col2 = st.columns([1, 2])
                        
                        with col1:
                            if 'image' in recipe:
                                st.image(recipe['image'], width=300)
                        
                        with col2:
                            st.subheader(recipe.get('title', 'Unknown Recipe'))
                            
                            # PCOS score
                            pcos_score = recipe.get('pcos_score', 50)
                            score_color = "🟢" if pcos_score >= 70 else "🟡" if pcos_score >= 50 else "🔴"
                            st.metric("PCOS Score", f"{score_color} {pcos_score}/100")
                            
                            # Used ingredients
                            used = recipe.get('usedIngredientCount', 0)
                            missed = recipe.get('missedIngredientCount', 0)
                            st.write(f"✅ Uses {used} of your ingredients")
                            st.write(f"🛒 Need {missed} more ingredients")
                            
                            # Nutrition
                            if 'nutrition' in recipe:
                                nutrition = recipe['nutrition']
                                if 'nutrients' in nutrition:
                                    nutrients = {n['name']: n['amount'] for n in nutrition['nutrients']}
                                    
                                    ncol1, ncol2, ncol3 = st.columns(3)
                                    with ncol1:
                                        st.metric("Protein", f"{nutrients.get('Protein', 0):.0f}g")
                                    with ncol2:
                                        st.metric("Carbs", f"{nutrients.get('Carbohydrates', 0):.0f}g")
                                    with ncol3:
                                        st.metric("Sugar", f"{nutrients.get('Sugar', 0):.0f}g")
                        
                        st.markdown("---")
                else:
                    st.info("No recipes found. Try different ingredients or relax dietary restrictions.")

# ==================== TAB 4: PATIENT TRACKER ====================
def render_tracker_tab(ui_config):
    """Render the patient tracker tab."""
    
    st.header("📊 Patient Tracker")
    
    if not st.session_state.patients:
        st.info(ui_config['messages']['no_patients'])
        return
    
    # Convert to DataFrame
    df = pd.DataFrame(st.session_state.patients)
    
    # Select columns to display
    display_columns = ['patient_name', 'date', 'diagnosis', 'phenotype', 'risk_level', 'has_meal_plan']
    df_display = df[display_columns].copy()
    
    # Rename columns
    df_display.columns = ['Patient', 'Date', 'Diagnosis', 'Phenotype', 'Risk Level', 'Has Meal Plan']
    
    # Display table
    st.dataframe(df_display, use_container_width=True)
    
    # Summary statistics
    st.markdown("---")
    st.markdown("### 📈 Summary Statistics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Patients", len(df))
    
    with col2:
        pcos_count = len(df[df['diagnosis'] == 'PCOS'])
        st.metric("PCOS Diagnosed", pcos_count)
    
    with col3:
        high_risk = len(df[df['risk_level'] == 'High'])
        st.metric("High Risk", high_risk)
    
    with col4:
        with_plans = len(df[df['has_meal_plan'] == True])
        st.metric("With Meal Plans", with_plans)

# Run the app
if __name__ == "__main__":
    main()
