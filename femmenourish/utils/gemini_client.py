"""
Gemini AI Client for PCOS assessment and meal plan customization.
Handles all interactions with Google's Gemini API.
"""

import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from typing import Dict, List, Optional

load_dotenv()


class GeminiClient:
    def __init__(self):
        """Initialize Gemini client with API key from environment."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        # Use gemini-1.5-pro (latest stable model supporting vision and text)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        
        # System context for medical accuracy
        self.system_context = """
        You are an expert gynecologist and women's health specialist with extensive experience in PCOS diagnosis and management.
        You provide evidence-based, clinically accurate assessments while maintaining professional medical standards.
        Always format your responses as valid JSON when requested.
        Include confidence levels and evidence-based reasoning in your assessments.
        """
    
    def assess_pcos_risk(
        self,
        symptoms: Dict,
        ultrasound_result: Optional[Dict] = None,
        patient_history: Optional[Dict] = None
    ) -> Dict:
        """
        Analyze patient symptoms and generate PCOS risk assessment.
        
        Args:
            symptoms: Dict containing patient symptoms and menstrual history
            ultrasound_result: Optional dict with ultrasound analysis results
            patient_history: Optional dict with family history, BMI, etc.
        
        Returns:
            Dict containing risk assessment, phenotype, recommendations
        """
        
        prompt = f"""
{self.system_context}

Analyze this patient data for PCOS using Rotterdam criteria (2 out of 3):

PATIENT SYMPTOMS:
- Periods per year: {symptoms.get('periods_per_year')}
- Average cycle length: {symptoms.get('cycle_length')} days
- Excess hair growth (hirsutism): {symptoms.get('hirsutism', 'Not reported')}
- Acne: {symptoms.get('acne', 'Not reported')}
- Hair thinning: {symptoms.get('hair_loss', 'Not reported')}
- Weight status: BMI {patient_history.get('bmi') if patient_history else 'Not provided'}
- Family history of PCOS: {patient_history.get('family_history', 'Not reported')}

{"ULTRASOUND FINDINGS: " + json.dumps(ultrasound_result) if ultrasound_result else "No ultrasound provided"}

TASK:
1. Evaluate each Rotterdam criterion
2. Determine which criteria are met
3. Calculate overall PCOS risk
4. Identify phenotype if PCOS is likely
5. Provide evidence-based recommendations

Provide response in this EXACT JSON format (no markdown, no code blocks):
{{
  "rotterdam_score": "X/3",
  "criteria_met": ["list of criteria met"],
  "phenotype": "A/B/C/D or null if not PCOS",
  "risk_level": "Low/Medium/High",
  "confidence_percent": 0-100,
  "key_findings": ["list of 3-5 key clinical findings"],
  "evidence": {{
    "oligoanovulation": "explanation",
    "hyperandrogenism": "explanation",
    "polycystic_ovaries": "explanation"
  }},
  "recommendations": ["list of 3-5 clinical recommendations"],
  "next_steps": ["list of suggested tests or follow-up"],
  "metabolic_risk": "Low/Moderate/High",
  "disclaimer": "This is an AI-assisted assessment. Clinical judgment required."
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Clean any markdown formatting
            result_text = result_text.replace("```json", "").replace("```", "").strip()
            
            # Parse JSON
            assessment = json.loads(result_text)
            
            return assessment
            
        except json.JSONDecodeError as e:
            # Fallback response if JSON parsing fails
            return {
                "rotterdam_score": "Incomplete",
                "criteria_met": [],
                "phenotype": None,
                "risk_level": "Medium",
                "confidence_percent": 50,
                "key_findings": ["Assessment incomplete - please review manually"],
                "recommendations": ["Consult with healthcare provider for complete evaluation"],
                "error": f"JSON parsing error: {str(e)}",
                "raw_response": response.text[:500] if 'response' in locals() else "No response"
            }
        
        except Exception as e:
            return {
                "error": f"API error: {str(e)}",
                "risk_level": "Unknown",
                "recommendations": ["Technical error occurred - please retry"]
            }
    
    def customize_recipes_for_location(
        self,
        recipes: List[Dict],
        city: str,
        city_info: Dict,
        patient_preferences: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Adapt recipes to use locally available ingredients and cultural preferences.
        
        Args:
            recipes: List of recipes from Spoonacular API
            city: City name
            city_info: City metadata from config
            patient_preferences: Optional dietary restrictions/preferences
        
        Returns:
            List of adapted recipes with local ingredient suggestions
        """
        
        # Take first 3 recipes to avoid token limits
        recipes_subset = recipes[:3] if len(recipes) > 3 else recipes
        
        prompt = f"""
You are a nutrition expert specializing in PCOS management and cultural food adaptation.

RECIPES TO ADAPT:
{json.dumps(recipes_subset, indent=2)}

TARGET LOCATION: {city}, {city_info.get('region')}
- Local cuisines: {', '.join(city_info.get('cuisine_tags', []))}
- Common stores: {', '.join(city_info.get('common_stores', [])[:3])}
- Currency: {city_info.get('currency_symbol', '')}
- Budget level: {city_info.get('budget_multiplier', 1.0)}x

{f"PATIENT PREFERENCES: {json.dumps(patient_preferences)}" if patient_preferences else ""}

TASK:
For each recipe, provide:
1. Local ingredient substitutions (e.g., quinoa → jowar in India)
2. Where to buy ingredients in {city}
3. Estimated cost in local currency
4. Any cultural adaptations needed
5. Keep PCOS-friendliness intact (low-GI, high-protein)

Return as JSON array of adapted recipes with this structure:
[
  {{
    "original_title": "...",
    "adapted_title": "...",
    "local_ingredients": [
      {{
        "original": "quinoa",
        "local_alternative": "jowar",
        "where_to_buy": "Mandai Market",
        "estimated_cost": "₹60/kg"
      }}
    ],
    "cultural_notes": "...",
    "total_estimated_cost": "₹120",
    "pcos_benefits": "..."
  }}
]
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            adapted_recipes = json.loads(result_text)
            return adapted_recipes
        
        except Exception as e:
            # Return original recipes if adaptation fails
            print(f"Recipe adaptation error: {e}")
            return recipes
    
    def generate_shopping_list(
        self,
        meal_plan: Dict,
        city: str,
        city_info: Dict,
        num_people: int = 1
    ) -> Dict:
        """
        Generate organized shopping list with local store recommendations.
        
        Args:
            meal_plan: Week's worth of meals
            city: City name
            city_info: City metadata
            num_people: Number of people to shop for
        
        Returns:
            Dict with categorized shopping list and store recommendations
        """
        
        prompt = f"""
Create a shopping list for this meal plan in {city}:

MEAL PLAN (Week 1):
{json.dumps(meal_plan, indent=2)}

LOCATION DETAILS:
- City: {city}
- Available stores: {', '.join(city_info.get('common_stores', []))}
- Currency: {city_info.get('currency_symbol', '')}

For {num_people} person(s)

TASK:
1. Extract all ingredients
2. Calculate quantities needed for 1 week
3. Organize by category (Grains, Proteins, Vegetables, etc.)
4. Recommend where to buy each category
5. Estimate total cost

Return JSON:
{{
  "categories": {{
    "Whole Grains & Millets": [
      {{"item": "Jowar flour", "quantity": "1 kg", "where": "Mandai Market", "cost": "₹60"}}
    ],
    "Proteins": [...],
    "Vegetables": [...],
    "Dairy & Eggs": [...],
    "Healthy Fats": [...],
    "Spices & Herbs": [...],
    "Pantry Staples": [...]
  }},
  "shopping_tips": ["Buy seasonal vegetables at Mandai for best prices", ...],
  "total_estimated_cost": "₹2,500",
  "estimated_time": "60-90 minutes",
  "store_route": ["Start at Mandai Market for fresh produce", "Then D-Mart for packaged items"]
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            shopping_list = json.loads(result_text)
            return shopping_list
        
        except Exception as e:
            return {
                "error": f"Shopping list generation error: {str(e)}",
                "categories": {},
                "shopping_tips": ["Please create shopping list manually from meal plan"]
            }
    
    def answer_nutrition_question(
        self,
        question: str,
        context: Optional[str] = None
    ) -> str:
        """
        Answer PCOS nutrition questions for doctors.
        
        Args:
            question: Doctor's question
            context: Optional context (patient info, meal plan, etc.)
        
        Returns:
            Evidence-based answer
        """
        
        prompt = f"""
{self.system_context}

QUESTION: {question}

{f"CONTEXT: {context}" if context else ""}

Provide a concise, evidence-based answer suitable for a healthcare professional.
Include relevant research citations when applicable.
Keep response under 200 words.
"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        
        except Exception as e:
            return f"Error generating response: {str(e)}"
