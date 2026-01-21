"""
Abstract base class for recommendation engine pattern.

This module defines the IRecommendationEngine interface that all
recommendation services must implement.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from sqlalchemy.orm import Session


class IRecommendationEngine(ABC):
    """
    Abstract base class defining the recommendation engine interface.
    
    All recommendation services must implement these methods to ensure
    consistent recommendation patterns across the application.
    
    This is Level 1 of the 3-level inheritance hierarchy:
    IRecommendationEngine (Abstract) -> BaseRecommendationService -> ConcreteRecommendationService
    """
    
    @staticmethod
    @abstractmethod
    def get_recommendations(
        db: Session,
        user_id: int,
        category: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Generate personalized recommendations for a user.
        
        Args:
            db: Database session
            user_id: User ID
            category: Optional category filter
            limit: Maximum number of recommendations
            
        Returns:
            List of recommended items with scores
        """
        pass
    
    @staticmethod
    @abstractmethod
    def calculate_score(
        meal,
        user,
        preference,
        user_meals: List,
        today_nutrition: Dict
    ) -> float:
        """
        Calculate a recommendation score for an item.
        
        Args:
            meal: Meal object to score
            user: User object
            preference: User preference object
            user_meals: List of user's meal history
            today_nutrition: Today's nutrition summary
            
        Returns:
            Recommendation score (higher is better)
        """
        pass
