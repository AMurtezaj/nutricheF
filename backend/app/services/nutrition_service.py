"""Service for nutrition calculations and analysis."""
from typing import Dict, List
from datetime import date
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.user_meal_repository import UserMealRepository
from app.repositories.meal_repository import MealRepository
from app.models.meal import Meal


class NutritionService:
    """Service for nutrition-related calculations and analysis."""
    
    @staticmethod
    def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
        """
        Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation.
        
        Args:
            weight: Weight in kg
            height: Height in cm
            age: Age in years
            gender: 'male', 'female', or 'other'
        
        Returns:
            BMR in calories per day
        """
        if gender.lower() == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        elif gender.lower() == "female":
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        else:
            # Use average of male and female formula
            bmr = 10 * weight + 6.25 * height - 5 * age - 78
        return bmr
    
    @staticmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        """
        Calculate Total Daily Energy Expenditure (TDEE).
        
        Args:
            bmr: Basal Metabolic Rate
            activity_level: Activity level string
        
        Returns:
            TDEE in calories per day
        """
        activity_multipliers = {
            "sedentary": 1.2,
            "lightly_active": 1.375,
            "moderately_active": 1.55,
            "very_active": 1.725,
            "extremely_active": 1.9,
        }
        multiplier = activity_multipliers.get(activity_level.lower(), 1.2)
        return bmr * multiplier
    
    @staticmethod
    def calculate_calorie_target(tdee: float, goal: str) -> float:
        """
        Calculate daily calorie target based on goal.
        
        Args:
            tdee: Total Daily Energy Expenditure
            goal: 'weight_loss', 'weight_gain', 'maintenance', 'muscle_gain'
        
        Returns:
            Target calories per day
        """
        goal_adjustments = {
            "weight_loss": -500,  # 500 calorie deficit
            "weight_gain": 500,  # 500 calorie surplus
            "maintenance": 0,
            "muscle_gain": 300,  # 300 calorie surplus
        }
        adjustment = goal_adjustments.get(goal.lower(), 0)
        return tdee + adjustment
    
    @staticmethod
    def calculate_macro_targets(
        calories: float,
        goal: str,
        protein_ratio: float = None,
        carb_ratio: float = None,
        fat_ratio: float = None
    ) -> Dict[str, float]:
        """
        Calculate macro nutrient targets in grams.
        
        Args:
            calories: Target daily calories
            goal: User's goal
            protein_ratio: Custom protein ratio (0-1)
            carb_ratio: Custom carb ratio (0-1)
            fat_ratio: Custom fat ratio (0-1)
        
        Returns:
            Dictionary with protein, carbohydrates, and fat targets in grams
        """
        # Default macro ratios based on goal
        if not protein_ratio or not carb_ratio or not fat_ratio:
            if goal.lower() == "weight_loss":
                protein_ratio, carb_ratio, fat_ratio = 0.30, 0.40, 0.30
            elif goal.lower() == "muscle_gain":
                protein_ratio, carb_ratio, fat_ratio = 0.35, 0.45, 0.20
            elif goal.lower() == "weight_gain":
                protein_ratio, carb_ratio, fat_ratio = 0.25, 0.50, 0.25
            else:  # maintenance
                protein_ratio, carb_ratio, fat_ratio = 0.30, 0.45, 0.25
        
        # Calculate grams (protein and carbs = 4 cal/g, fat = 9 cal/g)
        protein = (calories * protein_ratio) / 4
        carbohydrates = (calories * carb_ratio) / 4
        fat = (calories * fat_ratio) / 9
        
        return {
            "protein": round(protein, 2),
            "carbohydrates": round(carbohydrates, 2),
            "fat": round(fat, 2),
        }
    
    @staticmethod
    def analyze_meal_nutrition(meal: Meal, servings: float = 1.0) -> Dict[str, float]:
        """
        Analyze nutrition for a meal with given servings.
        
        Args:
            meal: Meal object
            servings: Number of servings
        
        Returns:
            Dictionary with total nutrition values
        """
        return {
            "calories": round(meal.calories * servings, 2),
            "protein": round(meal.protein * servings, 2),
            "carbohydrates": round(meal.carbohydrates * servings, 2),
            "fat": round(meal.fat * servings, 2),
            "fiber": round(meal.fiber * servings, 2),
            "sugar": round(meal.sugar * servings, 2),
            "sodium": round(meal.sodium * servings, 2),
        }
    
    @staticmethod
    def get_daily_nutrition_summary(
        db: Session,
        user_id: int,
        meal_date: date = None
    ) -> Dict:
        """
        Get daily nutrition summary for a user.
        
        Args:
            db: Database session
            user_id: User ID
            meal_date: Date to analyze (defaults to today)
        
        Returns:
            Dictionary with daily nutrition summary and progress
        """
        if meal_date is None:
            meal_date = date.today()
        
        # Get user to access targets
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise ValueError(f"User {user_id} not found")
        
        # Get daily nutrition
        daily_nutrition = UserMealRepository.get_daily_nutrition(db, user_id, meal_date)
        
        # Calculate progress percentages
        targets = {
            "calories": user.daily_calorie_target or 2000,
            "protein": user.daily_protein_target or 150,
            "carbohydrates": user.daily_carb_target or 250,
            "fat": user.daily_fat_target or 65,
        }
        
        progress = {
            "calories": round((daily_nutrition["total_calories"] / targets["calories"]) * 100, 1) if targets["calories"] > 0 else 0,
            "protein": round((daily_nutrition["total_protein"] / targets["protein"]) * 100, 1) if targets["protein"] > 0 else 0,
            "carbohydrates": round((daily_nutrition["total_carbohydrates"] / targets["carbohydrates"]) * 100, 1) if targets["carbohydrates"] > 0 else 0,
            "fat": round((daily_nutrition["total_fat"] / targets["fat"]) * 100, 1) if targets["fat"] > 0 else 0,
        }
        
        return {
            **daily_nutrition,
            "targets": targets,
            "progress": progress,
            "remaining": {
                "calories": max(0, targets["calories"] - daily_nutrition["total_calories"]),
                "protein": max(0, targets["protein"] - daily_nutrition["total_protein"]),
                "carbohydrates": max(0, targets["carbohydrates"] - daily_nutrition["total_carbohydrates"]),
                "fat": max(0, targets["fat"] - daily_nutrition["total_fat"]),
            },
        }




