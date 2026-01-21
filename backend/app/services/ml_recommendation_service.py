"""
Enhanced recommendation service with ML model integration.
Combines collaborative filtering with content-based filtering.

This module provides the MLRecommendationService class which handles
ML-based recommendation logic, implementing the IRecommendationEngine interface.
"""

import os
import pickle
from pathlib import Path
from typing import List, Dict, Optional
from functools import lru_cache
from sqlalchemy.orm import Session
import logging

from app.repositories.meal_repository import MealRepository
from app.repositories.user_repository import UserRepository
from app.repositories.preference_repository import PreferenceRepository
from app.repositories.user_meal_repository import UserMealRepository
from app.services.nutrition_service import NutritionService
from app.services.recommendation_service import BaseRecommendationService, RecommendationService
from app.services.cache_service import cached
from app.exceptions import UserNotFoundException
from datetime import date

logger = logging.getLogger(__name__)

# Model file path
MODELS_DIR = Path(__file__).parent.parent.parent.parent / "models"
ML_MODEL_FILE = MODELS_DIR / "collaborative_filtering_model.pkl"


class MLRecommendationService(BaseRecommendationService):
    """
    Enhanced recommendation service with ML model integration.
    
    Combines:
    - Collaborative filtering (from ML model)
    - Content-based filtering (from existing service)
    - Hybrid approach for best results
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IRecommendationEngine (Abstract interface)
    - Level 2: BaseRecommendationService (Concrete base)
    - Level 3: MLRecommendationService (ML-enhanced recommendations)
    
    This demonstrates polymorphism - both RecommendationService and
    MLRecommendationService implement the same interface but with
    different algorithms.
    """
    
    _ml_model = None
    _model_loaded = False
    
    @classmethod
    def _load_ml_model(cls):
        """Load ML model (lazy loading with caching)."""
        if cls._model_loaded:
            return cls._ml_model
        
        if not ML_MODEL_FILE.exists():
            logger.warning(f"ML model not found at {ML_MODEL_FILE}. Using content-based only.")
            cls._model_loaded = True
            return None
        
        try:
            # Import the model class directly
            import sys
            scripts_path = Path(__file__).parent.parent / "scripts"
            sys.path.insert(0, str(scripts_path))
            from train_ml_model import CollaborativeFilteringModel
            
            cls._ml_model = CollaborativeFilteringModel.load(ML_MODEL_FILE)
            cls._model_loaded = True
            logger.info("✅ ML model loaded successfully")
            return cls._ml_model
        except Exception as e:
            logger.warning(f"Error loading ML model: {e}. Using content-based only.")
            cls._model_loaded = True
            return None
    
    @staticmethod
    def calculate_score(
        meal,
        user,
        preference,
        user_meals: List,
        today_nutrition: Dict
    ) -> float:
        """
        Calculate score using content-based filtering.
        
        This method is called as a fallback when ML predictions are not available.
        """
        return RecommendationService._calculate_meal_score(
            meal, user, preference, user_meals, today_nutrition
        )
    
    @staticmethod
    @cached(ttl_seconds=1800)  # Cache for 30 minutes
    def get_recommendations(
        db: Session,
        user_id: int,
        category: Optional[str] = None,
        limit: int = 10,
        use_ml: bool = True
    ) -> List[Dict]:
        """
        Generate personalized meal recommendations using hybrid approach.
        
        Args:
            db: Database session
            user_id: User ID
            category: Optional meal category filter
            limit: Number of recommendations to return
            use_ml: Whether to use ML model (default: True)
        
        Returns:
            List of recommended meals with scores and reasons
            
        Raises:
            UserNotFoundException: If user is not found
        """
        # Get user
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise UserNotFoundException(user_id=user_id)
        
        # Get all meals (or filtered by category)
        if category:
            all_meals = MealRepository.get_by_category(db, category)
        else:
            all_meals = MealRepository.get_all(db, skip=0, limit=50000)  # Get all
        
        if not all_meals:
            return []
        
        meal_ids = [meal.id for meal in all_meals]
        
        # Try to use ML model
        ml_predictions = {}
        if use_ml:
            ml_model = MLRecommendationService._load_ml_model()
            if ml_model and ml_model.is_trained:
                try:
                    # Convert user_id to string for ML model lookup
                    user_id_str = str(user_id)
                    # Get ML recommendations
                    ml_recommendations = ml_model.get_recommendations(
                        user_id_str, 
                        meal_ids, 
                        limit=limit * 3  # Get more candidates from ML
                    )
                    # Convert to dict for easy lookup
                    ml_predictions = {meal_id: score for meal_id, score in ml_recommendations}
                    logger.debug(f"ML model provided {len(ml_predictions)} predictions")
                except Exception as e:
                    logger.warning(f"ML prediction failed: {e}. Falling back to content-based.")
        
        # Get content-based scores
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        user_meals = UserMealRepository.get_user_meals(db, user_id)
        today_nutrition = UserMealRepository.get_daily_nutrition(db, user_id, date.today())
        
        # Combine ML and content-based scores
        scored_meals = []
        for meal in all_meals:
            # Content-based score (from existing service)
            content_score = RecommendationService._calculate_meal_score(
                meal, user, preference, user_meals, today_nutrition
            )
            
            # Skip if content-based score is 0 (fails dietary restrictions)
            if content_score == 0:
                continue
            
            # ML prediction score (0-5 rating, normalize to 0-1)
            ml_score = 0.0
            if meal.id in ml_predictions:
                # Normalize ML prediction from 1-5 to 0-1 scale
                raw_ml_score = ml_predictions[meal.id]
                # Clamp to [1, 5] range and normalize
                raw_ml_score = max(1.0, min(5.0, raw_ml_score))
                ml_score = (raw_ml_score - 1.0) / 4.0
            
            # Hybrid score: weighted combination
            # ML weight: 0.6 (if available), Content weight: 0.4
            # If ML not available, use content-based only
            if ml_score > 0:
                hybrid_score = ml_score * 0.6 + content_score * 0.4
            else:
                hybrid_score = content_score
            
            scored_meals.append((meal, hybrid_score, ml_score, content_score))
        
        # Sort by hybrid score
        scored_meals.sort(key=lambda x: x[1], reverse=True)
        
        # Get top recommendations
        recommendations = []
        for meal, hybrid_score, ml_score, content_score in scored_meals[:limit]:
            # Generate reason
            reason = MLRecommendationService._generate_reason(
                meal, user, preference, user_meals, hybrid_score, 
                ml_score, content_score, today_nutrition
            )
            
            recommendations.append({
                "meal": meal,
                "score": round(hybrid_score, 3),
                "ml_score": round(ml_score, 3) if ml_score > 0 else None,
                "content_score": round(content_score, 3),
                "reason": reason
            })
        
        return recommendations
    
    @staticmethod
    def _generate_reason(
        meal,
        user,
        preference: Optional,
        user_meals: List,
        hybrid_score: float,
        ml_score: float,
        content_score: float,
        today_nutrition: Dict
    ) -> str:
        """Generate recommendation reason combining ML and content-based signals."""
        reasons = []
        
        # ML-based reasons
        if ml_score > 0:
            if ml_score > 0.7:
                reasons.append("Highly rated by similar users")
            elif ml_score > 0.5:
                reasons.append("Popular among users with similar preferences")
        
        # Content-based reasons (from existing service)
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
        
        # Fallback
        if not reasons:
            if ml_score > 0:
                reasons.append("Personalized recommendation based on user behavior")
            else:
                reasons.append("Personalized recommendation based on your profile")
        
        return "; ".join(reasons)
    
    @staticmethod
    @cached(ttl_seconds=3600)  # Cache popular meals for 1 hour
    def get_popular_meals(db: Session, limit: int = 10) -> List[Dict]:
        """Get popular meals based on ML model popularity scores."""
        ml_model = MLRecommendationService._load_ml_model()
        
        if not ml_model or not ml_model.is_trained:
            # Fallback: get meals by popularity (most in database)
            meals = MealRepository.get_all(db, skip=0, limit=limit)
            return [{"meal": meal, "score": 1.0, "reason": "Popular meal"} for meal in meals]
        
        # Sort meals by popularity score
        meal_popularity = sorted(
            ml_model.meal_popularity.items(),
            key=lambda x: x[1],
            reverse=True
        )[:limit]
        
        popular_meals = []
        for meal_id, popularity_score in meal_popularity:
            meal = MealRepository.get_by_id(db, meal_id)
            if meal:
                popular_meals.append({
                    "meal": meal,
                    "score": round(popularity_score, 3),
                    "reason": "Popular among all users"
                })
        
        return popular_meals
