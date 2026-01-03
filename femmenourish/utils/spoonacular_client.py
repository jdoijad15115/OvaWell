"""
Spoonacular API Client for recipe and nutrition data.
Handles all interactions with Spoonacular Food API.
"""

import requests
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional
import streamlit as st

load_dotenv()


class SpoonacularClient:
    def __init__(self):
        """Initialize Spoonacular client with API key from environment."""
        self.api_key = os.getenv("SPOONACULAR_API_KEY")
        if not self.api_key:
            raise ValueError("SPOONACULAR_API_KEY not found in environment variables")
        
        self.base_url = "https://api.spoonacular.com"
        self.daily_limit = 150  # Free tier limit
        self.request_count = 0
    
    def _make_request(self, endpoint: str, params: Dict) -> Dict:
        """
        Make API request with error handling and rate limiting.
        
        Args:
            endpoint: API endpoint path
            params: Query parameters
        
        Returns:
            API response as dict
        """
        params["apiKey"] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            self.request_count += 1
            
            # Check rate limit
            if self.request_count >= self.daily_limit:
                st.warning(f"⚠️ Approaching daily API limit ({self.request_count}/{self.daily_limit})")
            
            return response.json()
        
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 402:
                return {"error": "API quota exceeded. Please upgrade your Spoonacular plan."}
            elif e.response.status_code == 401:
                return {"error": "Invalid API key. Please check your credentials."}
            else:
                return {"error": f"HTTP error: {e.response.status_code}"}
        
        except requests.exceptions.Timeout:
            return {"error": "Request timed out. Please try again."}
        
        except requests.exceptions.RequestException as e:
            return {"error": f"Network error: {str(e)}"}
    
    def search_pcos_recipes(
        self,
        cuisine: str,
        meal_type: str,
        dietary_restrictions: Optional[List[str]] = None,
        number: int = 10
    ) -> Dict:
        """
        Search for PCOS-friendly recipes with specific filters.
        
        Args:
            cuisine: Cuisine type (e.g., "Indian", "British")
            meal_type: Meal type (e.g., "breakfast", "lunch", "dinner", "snack")
            dietary_restrictions: List of intolerances (e.g., ["dairy", "gluten"])
            number: Number of recipes to return
        
        Returns:
            Dict with recipe results
        """
        
        params = {
            "cuisine": cuisine,
            "type": meal_type,
            "maxSugar": 25,          # Max 25g sugar per serving (PCOS-friendly)
            "minProtein": 20,        # Min 20g protein (supports insulin sensitivity)
            "minFiber": 8,           # Min 8g fiber (blood sugar management)
            "maxGlycemicLoad": 10,   # Low glycemic load
            "diet": "low-carb",      # Low-carb preference for PCOS
            "number": number,
            "addRecipeInformation": True,
            "fillIngredients": True,
            "addRecipeNutrition": True,
            "instructionsRequired": True,
            "sort": "popularity"     # Get proven popular recipes
        }
        
        # Add dietary restrictions
        if dietary_restrictions:
            params["intolerances"] = ",".join(dietary_restrictions)
        
        result = self._make_request("recipes/complexSearch", params)
        
        # Check if we got valid results
        if "error" in result:
            return result
        
        if "results" not in result or len(result["results"]) == 0:
            # Relax constraints and try again
            print(f"No results found, relaxing constraints...")
            params["minProtein"] = 15
            params["minFiber"] = 5
            result = self._make_request("recipes/complexSearch", params)
        
        return result
    
    def find_recipes_by_ingredients(
        self,
        ingredients: List[str],
        cuisine: Optional[str] = None,
        number: int = 5
    ) -> List[Dict]:
        """
        Find recipes based on available ingredients (leftover manager).
        
        Args:
            ingredients: List of ingredient names
            cuisine: Optional cuisine filter
            number: Number of recipes to return
        
        Returns:
            List of recipe dicts
        """
        
        params = {
            "ingredients": ",".join(ingredients),
            "number": number,
            "ranking": 2,            # Maximize used ingredients
            "ignorePantry": True     # Don't assume pantry staples
        }
        
        if cuisine:
            params["cuisine"] = cuisine
        
        result = self._make_request("recipes/findByIngredients", params)
        
        if "error" in result:
            return []
        
        # Filter results for PCOS compatibility
        pcos_friendly_recipes = []
        
        for recipe in result:
            # Get detailed nutrition info
            recipe_id = recipe.get("id")
            nutrition = self.get_recipe_nutrition(recipe_id)
            
            if nutrition and self._is_pcos_friendly(nutrition):
                recipe["nutrition"] = nutrition
                recipe["pcos_score"] = self._calculate_pcos_score(nutrition)
                pcos_friendly_recipes.append(recipe)
        
        # Sort by PCOS score
        pcos_friendly_recipes.sort(key=lambda x: x.get("pcos_score", 0), reverse=True)
        
        return pcos_friendly_recipes
    
    def get_recipe_details(self, recipe_id: int) -> Dict:
        """
        Get detailed information about a specific recipe.
        
        Args:
            recipe_id: Spoonacular recipe ID
        
        Returns:
            Dict with complete recipe information
        """
        
        params = {
            "includeNutrition": True
        }
        
        return self._make_request(f"recipes/{recipe_id}/information", params)
    
    def get_recipe_nutrition(self, recipe_id: int) -> Dict:
        """
        Get nutrition information for a recipe.
        
        Args:
            recipe_id: Spoonacular recipe ID
        
        Returns:
            Dict with nutrition data
        """
        
        result = self._make_request(f"recipes/{recipe_id}/nutritionWidget.json", {})
        return result
    
    def _is_pcos_friendly(self, nutrition: Dict) -> bool:
        """
        Check if recipe meets PCOS nutrition guidelines.
        
        Args:
            nutrition: Nutrition data dict
        
        Returns:
            Boolean indicating if recipe is PCOS-friendly
        """
        
        try:
            # Extract key nutrients
            nutrients = {n["name"]: n["amount"] for n in nutrition.get("nutrients", [])}
            
            sugar = nutrients.get("Sugar", 100)  # Default to high if not found
            protein = nutrients.get("Protein", 0)
            fiber = nutrients.get("Fiber", 0)
            
            # PCOS criteria
            is_low_sugar = sugar <= 25
            is_high_protein = protein >= 15
            is_high_fiber = fiber >= 5
            
            return is_low_sugar and (is_high_protein or is_high_fiber)
        
        except:
            return False
    
    def _calculate_pcos_score(self, nutrition: Dict) -> int:
        """
        Calculate a PCOS-friendliness score (0-100).
        
        Args:
            nutrition: Nutrition data dict
        
        Returns:
            Score from 0-100
        """
        
        try:
            nutrients = {n["name"]: n["amount"] for n in nutrition.get("nutrients", [])}
            
            score = 50  # Base score
            
            # Sugar (lower is better)
            sugar = nutrients.get("Sugar", 50)
            if sugar < 10:
                score += 20
            elif sugar < 20:
                score += 10
            elif sugar > 30:
                score -= 20
            
            # Protein (higher is better)
            protein = nutrients.get("Protein", 0)
            if protein > 25:
                score += 20
            elif protein > 15:
                score += 10
            
            # Fiber (higher is better)
            fiber = nutrients.get("Fiber", 0)
            if fiber > 10:
                score += 15
            elif fiber > 5:
                score += 8
            
            # Healthy fats
            omega3 = nutrients.get("Omega-3", 0)
            if omega3 > 0:
                score += 5
            
            return min(100, max(0, score))
        
        except:
            return 50  # Default middle score
