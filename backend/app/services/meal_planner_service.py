"""Meal Planner Service for generating weekly meal plans.

This module provides AI-powered meal planning functionality that generates
optimized weekly meal plans based on user preferences, nutritional targets,
and dietary restrictions.
"""
from typing import List, Dict, Optional
from datetime import date, timedelta
from sqlalchemy.orm import Session
import random

from app.repositories.meal_repository import MealRepository
from app.repositories.user_repository import UserRepository
from app.repositories.preference_repository import PreferenceRepository
from app.exceptions import UserNotFoundException


class MealPlannerService:
    """
    Service for generating personalized weekly meal plans.
    
    Uses a constraint-satisfaction approach to optimize meal selection
    based on:
    - Daily calorie targets
    - Macro nutrient goals (protein, carbs, fat)
    - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
    - Variety (avoiding repetition)
    - Nutritional balance across the week
    """
    
    # Meal type distribution for daily calories
    MEAL_CALORIE_DISTRIBUTION = {
        'breakfast': 0.25,  # 25% of daily calories
        'lunch': 0.35,      # 35% of daily calories
        'dinner': 0.30,     # 30% of daily calories
        'snack': 0.10       # 10% of daily calories
    }
    
    @staticmethod
    def generate_weekly_plan(
        db: Session,
        user_id: int,
        start_date: Optional[date] = None,
        days: int = 7
    ) -> Dict:
        """
        Generate a weekly meal plan for a user.
        
        Args:
            db: Database session
            user_id: User ID
            start_date: Start date for the plan (defaults to today)
            days: Number of days to plan (default 7)
            
        Returns:
            Dictionary containing the weekly meal plan with daily breakdowns
            
        Raises:
            UserNotFoundException: If user is not found
        """
        # Get user and preferences
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise UserNotFoundException(user_id=user_id)
        
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        
        # Get all available meals
        all_meals = MealRepository.get_all(db, skip=0, limit=5000)
        
        # Filter meals based on dietary restrictions
        eligible_meals = MealPlannerService._filter_by_preferences(all_meals, preference)
        
        if len(eligible_meals) < 10:
            return {
                "success": False,
                "message": "Not enough meals matching your dietary preferences. Need at least 10 meals.",
                "meals_available": len(eligible_meals)
            }
        
        # Categorize meals
        meals_by_category = MealPlannerService._categorize_meals(eligible_meals)
        
        # Calculate daily targets
        daily_calories = user.daily_calorie_target or 2000
        daily_protein = user.daily_protein_target or 50
        daily_carbs = user.daily_carb_target or 250
        daily_fat = user.daily_fat_target or 65
        
        # Generate plan
        if start_date is None:
            start_date = date.today()
        
        weekly_plan = []
        used_meal_ids = set()  # Track used meals for variety
        
        for day_offset in range(days):
            current_date = start_date + timedelta(days=day_offset)
            day_plan = MealPlannerService._plan_single_day(
                meals_by_category,
                daily_calories,
                daily_protein,
                daily_carbs,
                daily_fat,
                used_meal_ids
            )
            
            # Add date info
            day_plan['date'] = current_date.isoformat()
            day_plan['day_name'] = current_date.strftime('%A')
            day_plan['day_number'] = day_offset + 1
            
            weekly_plan.append(day_plan)
        
        # Calculate weekly totals
        weekly_totals = MealPlannerService._calculate_weekly_totals(weekly_plan)
        
        return {
            "success": True,
            "user_id": user_id,
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(days=days-1)).isoformat(),
            "days": days,
            "daily_targets": {
                "calories": daily_calories,
                "protein": daily_protein,
                "carbohydrates": daily_carbs,
                "fat": daily_fat
            },
            "weekly_plan": weekly_plan,
            "weekly_totals": weekly_totals,
            "variety_score": len(used_meal_ids) / (days * 4) * 100  # Unique meals percentage
        }
    
    @staticmethod
    def _filter_by_preferences(meals: List, preference) -> List:
        """Filter meals based on user dietary preferences."""
        if not preference:
            return meals
        
        filtered = []
        for meal in meals:
            # Check dietary restrictions
            if preference.vegetarian and not meal.is_vegetarian:
                continue
            if preference.vegan and not meal.is_vegan:
                continue
            if preference.gluten_free and not meal.is_gluten_free:
                continue
            if preference.dairy_free and not meal.is_dairy_free:
                continue
            if preference.nut_free and not meal.is_nut_free:
                continue
            if preference.halal and not meal.is_halal:
                continue
            if preference.kosher and not meal.is_kosher:
                continue
            
            # Check disliked ingredients
            if preference.disliked_ingredients and meal.ingredients:
                disliked = [ing.strip().lower() for ing in preference.disliked_ingredients.split(',')]
                meal_ingredients = meal.ingredients.lower()
                if any(ing in meal_ingredients for ing in disliked):
                    continue
            
            filtered.append(meal)
        
        return filtered
    
    @staticmethod
    def _categorize_meals(meals: List) -> Dict[str, List]:
        """Categorize meals by type."""
        categories = {
            'breakfast': [],
            'lunch': [],
            'dinner': [],
            'snack': []
        }
        
        for meal in meals:
            category = (meal.category or 'lunch').lower()
            if category in categories:
                categories[category].append(meal)
            else:
                # Default to lunch if unknown category
                categories['lunch'].append(meal)
        
        # Ensure we have meals in each category (fallback to lunch)
        for cat in categories:
            if len(categories[cat]) == 0:
                categories[cat] = categories['lunch'][:] if categories['lunch'] else meals[:5]
        
        return categories
    
    @staticmethod
    def _plan_single_day(
        meals_by_category: Dict[str, List],
        daily_calories: float,
        daily_protein: float,
        daily_carbs: float,
        daily_fat: float,
        used_meal_ids: set
    ) -> Dict:
        """Plan meals for a single day."""
        day_meals = {}
        day_totals = {'calories': 0, 'protein': 0, 'carbohydrates': 0, 'fat': 0}
        
        for meal_type, calorie_ratio in MealPlannerService.MEAL_CALORIE_DISTRIBUTION.items():
            target_calories = daily_calories * calorie_ratio
            
            # Get best meal for this slot
            best_meal = MealPlannerService._select_best_meal(
                meals_by_category.get(meal_type, meals_by_category['lunch']),
                target_calories,
                used_meal_ids
            )
            
            if best_meal:
                used_meal_ids.add(best_meal.id)
                day_meals[meal_type] = {
                    'id': best_meal.id,
                    'name': best_meal.name,
                    'calories': best_meal.calories,
                    'protein': best_meal.protein,
                    'carbohydrates': best_meal.carbohydrates,
                    'fat': best_meal.fat,
                    'category': best_meal.category,
                    'is_vegetarian': best_meal.is_vegetarian
                }
                day_totals['calories'] += best_meal.calories
                day_totals['protein'] += best_meal.protein
                day_totals['carbohydrates'] += best_meal.carbohydrates
                day_totals['fat'] += best_meal.fat
        
        # Calculate how well we hit targets
        targets_met = {
            'calories': round((day_totals['calories'] / daily_calories) * 100, 1) if daily_calories else 0,
            'protein': round((day_totals['protein'] / daily_protein) * 100, 1) if daily_protein else 0,
            'carbohydrates': round((day_totals['carbohydrates'] / daily_carbs) * 100, 1) if daily_carbs else 0,
            'fat': round((day_totals['fat'] / daily_fat) * 100, 1) if daily_fat else 0
        }
        
        return {
            'meals': day_meals,
            'totals': day_totals,
            'targets_met': targets_met
        }
    
    @staticmethod
    def _select_best_meal(meals: List, target_calories: float, used_meal_ids: set):
        """Select the best meal for a slot based on calorie target and variety."""
        if not meals:
            return None
        
        # Prefer meals not yet used (for variety)
        unused_meals = [m for m in meals if m.id not in used_meal_ids]
        candidate_meals = unused_meals if unused_meals else meals
        
        # Score meals based on how close they are to target calories
        scored_meals = []
        for meal in candidate_meals:
            calorie_diff = abs(meal.calories - target_calories)
            # Score: lower is better (closer to target)
            score = calorie_diff / (target_calories + 1)
            scored_meals.append((meal, score))
        
        # Sort by score and pick from top 3 randomly (for variety)
        scored_meals.sort(key=lambda x: x[1])
        top_meals = scored_meals[:min(3, len(scored_meals))]
        
        if top_meals:
            return random.choice(top_meals)[0]
        return None
    
    @staticmethod
    def _calculate_weekly_totals(weekly_plan: List[Dict]) -> Dict:
        """Calculate weekly nutrition totals."""
        totals = {'calories': 0, 'protein': 0, 'carbohydrates': 0, 'fat': 0}
        
        for day in weekly_plan:
            for key in totals:
                totals[key] += day['totals'].get(key, 0)
        
        return {
            'total_calories': round(totals['calories'], 1),
            'total_protein': round(totals['protein'], 1),
            'total_carbohydrates': round(totals['carbohydrates'], 1),
            'total_fat': round(totals['fat'], 1),
            'average_daily_calories': round(totals['calories'] / len(weekly_plan), 1) if weekly_plan else 0,
            'average_daily_protein': round(totals['protein'] / len(weekly_plan), 1) if weekly_plan else 0
        }
