"""Service for ML-based meal recommendations.

This module provides the RecommendationService class which handles
recommendation logic, implementing the IRecommendationEngine interface.
"""
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.repositories.meal_repository import MealRepository
from app.repositories.user_repository import UserRepository
from app.repositories.preference_repository import PreferenceRepository
from app.repositories.user_meal_repository import UserMealRepository
from app.services.nutrition_service import NutritionService
from app.core.interfaces.base_recommendation import IRecommendationEngine
from app.exceptions import UserNotFoundException
from datetime import date
from collections import Counter


class BaseRecommendationService(IRecommendationEngine):
    """
    Base recommendation service implementing common recommendation patterns.
    
    This is Level 2 of the 3-level inheritance hierarchy:
    IRecommendationEngine (Abstract) -> BaseRecommendationService -> ConcreteRecommendationService
    
    Provides common recommendation functionality that can be overridden.
    """
    
    @staticmethod
    def get_recommendations(
        db: Session,
        user_id: int,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """Default implementation - should be overridden by subclasses."""
        raise NotImplementedError("Subclasses must implement get_recommendations")
    
    @staticmethod
    def calculate_score(
        meal,
        user,
        preference,
        user_meals: List,
        today_nutrition: Dict
    ) -> float:
        """Default implementation - should be overridden by subclasses."""
        return 0.0


class RecommendationService(BaseRecommendationService):
    """
    Service for generating personalized meal recommendations using ML techniques.
    
    Uses collaborative filtering and content-based filtering approaches.
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IRecommendationEngine (Abstract interface)
    - Level 2: BaseRecommendationService (Concrete base)
    - Level 3: RecommendationService (Content-based recommendations)
    """
    
    @staticmethod
    def get_recommendations(
        db: Session,
        user_id: int,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Generate personalized meal recommendations for a user.
        
        Args:
            db: Database session
            user_id: User ID
            category: Optional meal category filter
            limit: Number of recommendations to return
        
        Returns:
            List of recommended meals with scores
            
        Raises:
            UserNotFoundException: If user is not found
        """
        # Get user and preferences
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise UserNotFoundException(user_id=user_id)
        
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        
        # Get user's meal history
        user_meals = UserMealRepository.get_user_meals(db, user_id)
        
        # Get all meals
        all_meals = MealRepository.get_all(db, skip=0, limit=1000)
        
        if category:
            all_meals = [m for m in all_meals if m.category == category]
        
        # Get today's nutrition for scoring
        today_nutrition = UserMealRepository.get_daily_nutrition(db, user_id, date.today())
        
        # Score each meal
        scored_meals = []
        for meal in all_meals:
            score = RecommendationService.calculate_score(
                meal, user, preference, user_meals, today_nutrition
            )
            scored_meals.append((meal, score))
        
        # Sort by score (highest first) and return top recommendations
        scored_meals.sort(key=lambda x: x[1], reverse=True)
        recommendations = []
        for meal, score in scored_meals[:limit]:
            reason = RecommendationService._get_recommendation_reason(
                meal, user, preference, user_meals, score, today_nutrition
            )
            recommendations.append({
                "meal": meal,
                "score": score,
                "reason": reason
            })
        
        return recommendations
    
    @staticmethod
    def calculate_score(
        meal,
        user,
        preference,
        user_meals: List,
        today_nutrition: Dict
    ) -> float:
        """
        Calculate a recommendation score for a meal.
        
        Uses a combination of:
        - Content-based filtering (nutritional fit, dietary restrictions)
        - Collaborative filtering (similarity to previously consumed meals)
        - Nutritional balance (how well it fits remaining daily targets)
        """
        # Alias for backward compatibility
        return RecommendationService._calculate_meal_score(
            meal, user, preference, user_meals, today_nutrition
        )
    
    @staticmethod
    def _calculate_meal_score(
        meal,
        user,
        preference: Optional,
        user_meals: List,
        today_nutrition: Dict
    ) -> float:
        """
        Calculate a recommendation score for a meal.
        
        Uses a combination of:
        - Content-based filtering (nutritional fit, dietary restrictions)
        - Collaborative filtering (similarity to previously consumed meals)
        - Nutritional balance (how well it fits remaining daily targets)
        """
        score = 0.0
        
        # 1. Dietary restrictions compliance (high weight - must pass)
        if preference:
            if preference.vegetarian and not meal.is_vegetarian:
                return 0.0  # Hard filter
            if preference.vegan and not meal.is_vegan:
                return 0.0
            if preference.gluten_free and not meal.is_gluten_free:
                return 0.0
            if preference.dairy_free and not meal.is_dairy_free:
                return 0.0
            if preference.nut_free and not meal.is_nut_free:
                return 0.0
            if preference.halal and not meal.is_halal:
                return 0.0
            if preference.kosher and not meal.is_kosher:
                return 0.0
        
        # 2. Nutritional fit (how well it fits daily targets)
        if user.daily_calorie_target:
            remaining_calories = max(0, user.daily_calorie_target - today_nutrition.get("total_calories", 0))
            remaining_protein = max(0, (user.daily_protein_target or 0) - today_nutrition.get("total_protein", 0))
            
            # Score based on how well it fits remaining calories
            if remaining_calories > 0:
                calorie_fit = 1.0 - abs(meal.calories - remaining_calories * 0.3) / remaining_calories
                calorie_fit = max(0, min(1, calorie_fit))
                score += calorie_fit * 0.3
            
            # Score based on protein content (important for muscle gain/maintenance)
            if user.goal in ["muscle_gain", "weight_loss"] and remaining_protein > 0:
                protein_fit = min(1.0, meal.protein / (remaining_protein * 0.4))
                score += protein_fit * 0.2
        
        # 3. Preference similarity (content-based)
        if preference:
            # Check cuisine preference
            if preference.preferred_cuisine:
                # Simple keyword matching (in a real system, use NLP/embeddings)
                if preference.preferred_cuisine.lower() in meal.name.lower() or \
                   (meal.description and preference.preferred_cuisine.lower() in meal.description.lower()):
                    score += 0.2
            
            # Check favorite ingredients
            if preference.favorite_ingredients:
                favorite_ingredients = [i.strip().lower() for i in preference.favorite_ingredients.split(",")]
                for ingredient in favorite_ingredients:
                    if ingredient in meal.name.lower() or \
                       (meal.description and ingredient in meal.description.lower()):
                        score += 0.1
        
        # 4. Historical preference (collaborative filtering)
        if user_meals:
            # Check if user has consumed similar meals
            user_meal_categories = [um.meal.category for um in user_meals if um.meal.category]
            category_counter = Counter(user_meal_categories)
            
            if meal.category in category_counter:
                # User likes this category
                score += 0.2
            
            # Check if user has consumed this specific meal before
            user_meal_ids = [um.meal_id for um in user_meals]
            if meal.id in user_meal_ids:
                # User has consumed this before (likely enjoyed it)
                score += 0.3
        
        # 5. Nutritional density bonus
        # Meals with good protein-to-calorie ratio get bonus
        if meal.calories > 0:
            protein_density = meal.protein / meal.calories
            if protein_density > 0.1:  # Good protein density
                score += 0.1
        
        return round(score, 3)
    
    @staticmethod
    def _get_recommendation_reason(
        meal,
        user,
        preference: Optional,
        user_meals: List,
        score: float,
        today_nutrition: Dict
    ) -> str:
        """Generate a human-readable reason for the recommendation."""
        reasons = []
        
        # Check various factors and add reasons
        if user_meals:
            user_meal_ids = [um.meal_id for um in user_meals]
            if meal.id in user_meal_ids:
                reasons.append("You've enjoyed this meal before")
        
        if preference and preference.preferred_cuisine:
            if preference.preferred_cuisine.lower() in meal.name.lower():
                reasons.append(f"Matches your {preference.preferred_cuisine} preference")
        
        if user.goal and user.goal in ["muscle_gain", "weight_loss"] and meal.protein > 30:
            reasons.append("High protein content")
        
        if user.daily_calorie_target:
            remaining = user.daily_calorie_target - today_nutrition.get("total_calories", 0)
            if meal.calories <= remaining * 0.4:
                reasons.append("Fits your daily calorie goals")
        
        return "; ".join(reasons) if reasons else "Personalized recommendation based on your profile"
