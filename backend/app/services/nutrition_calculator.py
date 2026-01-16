"""
Nutrition Calculator Service
Provides clear and explicit nutritional calculations for meal recommendations.
"""

from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class NutritionCalculator:
    """
    Service for nutritional calculations with clear, documented formulas.
    All calculations are based on established nutritional science.
    """
    
    # Activity level multipliers for TDEE calculation
    ACTIVITY_MULTIPLIERS = {
        'sedentary': 1.2,        # Little or no exercise
        'lightly_active': 1.375,  # Exercise 1-3 days/week
        'moderately_active': 1.55, # Exercise 3-5 days/week
        'very_active': 1.725,     # Exercise 6-7 days/week
        'extremely_active': 1.9   # Physical job + exercise
    }
    
    # Calorie adjustment for goals (relative to maintenance)
    GOAL_ADJUSTMENTS = {
        'weight_loss': -500,      # 500 calorie deficit for ~0.5kg/week loss
        'weight_gain': 500,       # 500 calorie surplus for ~0.5kg/week gain
        'muscle_gain': 300,       # Moderate surplus for lean muscle
        'maintenance': 0          # No adjustment
    }
    
    @staticmethod
    def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
        """
        Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation.
        This is the most accurate formula for modern populations.
        
        Formula:
        Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
        Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
        
        Args:
            weight_kg: Body weight in kilograms
            height_cm: Height in centimeters
            age: Age in years
            gender: 'male' or 'female'
        
        Returns:
            BMR in calories/day
        """
        # Base calculation (same for both genders)
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age)
        
        # Gender adjustment
        if gender.lower() == 'male':
            bmr += 5
        else:  # female or other
            bmr -= 161
        
        logger.info(f"BMR calculated: {bmr:.2f} kcal/day for {gender}, {weight_kg}kg, {height_cm}cm, {age}y")
        return round(bmr, 2)
    
    @staticmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        """
        Calculate Total Daily Energy Expenditure (TDEE).
        TDEE = BMR × Activity Multiplier
        
        This represents the total calories burned per day including activity.
        
        Args:
            bmr: Basal Metabolic Rate
            activity_level: Activity level category
        
        Returns:
            TDEE in calories/day
        """
        multiplier = NutritionCalculator.ACTIVITY_MULTIPLIERS.get(
            activity_level.lower(), 
            1.2  # Default to sedentary if unknown
        )
        
        tdee = bmr * multiplier
        
        logger.info(f"TDEE calculated: {tdee:.2f} kcal/day (BMR: {bmr} × {multiplier})")
        return round(tdee, 2)
    
    @staticmethod
    def calculate_daily_calorie_target(tdee: float, goal: str) -> float:
        """
        Calculate daily calorie target based on user's goal.
        Target = TDEE + Goal Adjustment
        
        Args:
            tdee: Total Daily Energy Expenditure
            goal: User's fitness goal
        
        Returns:
            Daily calorie target
        """
        adjustment = NutritionCalculator.GOAL_ADJUSTMENTS.get(
            goal.lower(),
            0  # Default to maintenance
        )
        
        target = tdee + adjustment
        
        logger.info(f"Calorie target: {target:.2f} kcal/day (TDEE: {tdee} {adjustment:+d})")
        return round(target, 2)
    
    @staticmethod
    def calculate_macro_targets(
        daily_calories: float, 
        goal: str,
        weight_kg: float
    ) -> Dict[str, float]:
        """
        Calculate macronutrient targets (protein, carbs, fat).
        
        Protein (g/day):
        - Weight loss/Muscle gain: 2.0-2.2g per kg body weight
        - Maintenance: 1.6-2.0g per kg body weight
        - Weight gain: 1.8-2.0g per kg body weight
        
        Fat (g/day):
        - 25-30% of total calories (essential for hormones)
        - 1g fat = 9 calories
        
        Carbohydrates (g/day):
        - Remaining calories after protein and fat
        - 1g carbs = 4 calories
        
        Args:
            daily_calories: Target daily calories
            goal: User's fitness goal
            weight_kg: Body weight in kg
        
        Returns:
            Dict with protein, carbs, and fat in grams
        """
        # Protein calculation (varies by goal)
        if goal.lower() in ['weight_loss', 'muscle_gain']:
            protein_per_kg = 2.2  # High protein for muscle preservation/building
        elif goal.lower() == 'weight_gain':
            protein_per_kg = 2.0
        else:  # maintenance
            protein_per_kg = 1.8
        
        protein_g = weight_kg * protein_per_kg
        protein_calories = protein_g * 4  # 1g protein = 4 calories
        
        # Fat calculation (30% of total calories for optimal hormone production)
        fat_percentage = 0.30
        fat_calories = daily_calories * fat_percentage
        fat_g = fat_calories / 9  # 1g fat = 9 calories
        
        # Carbohydrates (remaining calories)
        remaining_calories = daily_calories - protein_calories - fat_calories
        carbs_g = remaining_calories / 4  # 1g carbs = 4 calories
        
        macros = {
            'protein': round(protein_g, 1),
            'fat': round(fat_g, 1),
            'carbohydrates': round(carbs_g, 1)
        }
        
        logger.info(
            f"Macros calculated for {daily_calories} kcal, {goal}, {weight_kg}kg: "
            f"P={macros['protein']}g, C={macros['carbohydrates']}g, F={macros['fat']}g"
        )
        
        return macros
    
    @staticmethod
    def calculate_meal_nutrition(
        base_calories: float,
        base_protein: float,
        base_carbs: float,
        base_fat: float,
        base_fiber: float,
        base_sugar: float,
        base_sodium: float,
        servings: float = 1.0
    ) -> Dict[str, float]:
        """
        Calculate total nutrition for a meal based on servings.
        Simple multiplication: nutrient_value × servings
        
        Args:
            base_*: Nutritional values per serving
            servings: Number of servings consumed
        
        Returns:
            Dict with total nutritional values
        """
        return {
            'calories': round(base_calories * servings, 1),
            'protein': round(base_protein * servings, 1),
            'carbohydrates': round(base_carbs * servings, 1),
            'fat': round(base_fat * servings, 1),
            'fiber': round(base_fiber * servings, 1),
            'sugar': round(base_sugar * servings, 1),
            'sodium': round(base_sodium * servings, 1)
        }
    
    @staticmethod
    def calculate_daily_nutrition_summary(
        consumed_meals: list,
        daily_targets: Dict[str, float]
    ) -> Dict:
        """
        Calculate daily nutrition summary with progress towards targets.
        
        Args:
            consumed_meals: List of meals consumed today with their nutritional values
            daily_targets: User's daily nutritional targets
        
        Returns:
            Dict with totals, remaining, and percentage consumed
        """
        # Sum up all consumed nutrition
        totals = {
            'calories': 0,
            'protein': 0,
            'carbohydrates': 0,
            'fat': 0,
            'fiber': 0,
            'sugar': 0,
            'sodium': 0
        }
        
        for meal in consumed_meals:
            for key in totals.keys():
                totals[key] += meal.get(key, 0)
        
        # Calculate remaining and percentages
        summary = {
            'consumed': {
                'calories': round(totals['calories'], 1),
                'protein': round(totals['protein'], 1),
                'carbohydrates': round(totals['carbohydrates'], 1),
                'fat': round(totals['fat'], 1),
                'fiber': round(totals['fiber'], 1),
                'sugar': round(totals['sugar'], 1),
                'sodium': round(totals['sodium'], 1)
            },
            'targets': daily_targets,
            'remaining': {},
            'percentage': {}
        }
        
        # Calculate remaining and percentages for macro targets
        for nutrient in ['calories', 'protein', 'carbohydrates', 'fat']:
            target = daily_targets.get(nutrient, 0)
            consumed = totals[nutrient]
            
            if target > 0:
                remaining = target - consumed
                percentage = (consumed / target) * 100
                
                summary['remaining'][nutrient] = round(remaining, 1)
                summary['percentage'][nutrient] = round(percentage, 1)
            else:
                summary['remaining'][nutrient] = 0
                summary['percentage'][nutrient] = 0
        
        return summary
    
    @staticmethod
    def get_calculation_explanation() -> Dict[str, str]:
        """
        Get human-readable explanations of all nutrition calculations.
        Useful for UI tooltips and documentation.
        """
        return {
            'bmr': (
                "Basal Metabolic Rate (BMR) is the number of calories your body burns at rest. "
                "Calculated using the Mifflin-St Jeor Equation, the most accurate for modern populations. "
                "Formula: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + gender_adjustment"
            ),
            'tdee': (
                "Total Daily Energy Expenditure (TDEE) is your total calorie burn including activity. "
                "Calculated as: BMR × Activity Level Multiplier. "
                "Activity levels: Sedentary (1.2), Light (1.375), Moderate (1.55), Very Active (1.725), Extreme (1.9)"
            ),
            'calorie_target': (
                "Daily calorie target adjusted for your goal. "
                "Weight loss: TDEE - 500 cal (lose ~0.5kg/week). "
                "Weight gain: TDEE + 500 cal (gain ~0.5kg/week). "
                "Muscle gain: TDEE + 300 cal (lean gains). "
                "Maintenance: TDEE (no change)."
            ),
            'protein': (
                "Protein target based on body weight and goal. "
                "Weight loss/Muscle gain: 2.2g per kg (preserve/build muscle). "
                "Maintenance: 1.8g per kg. "
                "Formula: weight_kg × protein_per_kg_factor. "
                "Calories: protein_grams × 4 (1g protein = 4 calories)"
            ),
            'fat': (
                "Fat target set at 30% of total calories for optimal hormone production. "
                "Formula: (daily_calories × 0.30) / 9. "
                "Note: 1g fat = 9 calories"
            ),
            'carbohydrates': (
                "Carbohydrate target fills remaining calories after protein and fat. "
                "Formula: (total_calories - protein_calories - fat_calories) / 4. "
                "Note: 1g carbs = 4 calories"
            )
        }





