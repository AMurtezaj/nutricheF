"""Service for meal-related business logic.

This module provides the MealService class which handles business logic
for meal operations, implementing the 3-level inheritance hierarchy:
IService (Abstract) -> BaseService (Concrete Base) -> MealService
"""
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.repositories.meal_repository import MealRepository
from app.repositories.user_meal_repository import UserMealRepository
from app.repositories.user_repository import UserRepository
from app.repositories.preference_repository import PreferenceRepository
from app.services.nutrition_service import NutritionService
from app.core.base_service import BaseService
from app.exceptions import MealNotFoundException
from datetime import date


class MealService(BaseService):
    """
    Service for meal-related operations.
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IService (Abstract interface)
    - Level 2: BaseService (Concrete base with common operations)
    - Level 3: MealService (Specific meal business logic)
    """
    
    # Set the repository class for BaseService
    repository = MealRepository
    
    @staticmethod
    def get_by_id(db: Session, meal_id: int) -> Optional[Dict]:
        """Get meal by ID."""
        return MealRepository.get_by_id(db, meal_id)
    
    @staticmethod
    def create(db: Session, meal_data: Dict) -> Dict:
        """Create a new meal."""
        meal = MealRepository.create(db, meal_data)
        return meal
    
    @staticmethod
    def update(db: Session, meal_id: int, meal_data: Dict) -> Optional[Dict]:
        """Update meal information."""
        return MealRepository.update(db, meal_id, meal_data)
    
    @staticmethod
    def delete(db: Session, meal_id: int) -> bool:
        """Delete a meal."""
        return MealRepository.delete(db, meal_id)
    
    @staticmethod
    def create_meal(db: Session, meal_data: Dict) -> Dict:
        """Create a new meal (alias for create)."""
        meal = MealRepository.create(db, meal_data)
        return meal
    
    @staticmethod
    def get_all_meals(db: Session, skip: int = 0, limit: int = 100) -> List[Dict]:
        """Get all meals."""
        meals = MealRepository.get_all(db, skip, limit)
        return meals
    
    @staticmethod
    def get_meal_by_id(db: Session, meal_id: int) -> Optional[Dict]:
        """Get meal by ID (alias for get_by_id)."""
        meal = MealRepository.get_by_id(db, meal_id)
        return meal
    
    @staticmethod
    def search_meals(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Dict]:
        """Search meals by name or description."""
        meals = MealRepository.search(db, query, skip, limit)
        return meals
    
    @staticmethod
    def add_user_meal(
        db: Session,
        user_id: int,
        meal_id: int,
        meal_date: date,
        meal_type: str,
        servings: float = 1.0
    ) -> Dict:
        """
        Add a meal to user's daily log.
        
        Args:
            db: Database session
            user_id: User ID
            meal_id: Meal ID
            meal_date: Date of consumption
            meal_type: Type of meal (breakfast, lunch, dinner, snack)
            servings: Number of servings
        
        Returns:
            Created UserMeal object
            
        Raises:
            MealNotFoundException: If meal is not found
        """
        # Get meal
        meal = MealRepository.get_by_id(db, meal_id)
        if not meal:
            raise MealNotFoundException(meal_id)
        
        # Calculate nutrition
        nutrition = NutritionService.analyze_meal_nutrition(meal, servings)
        
        # Create user meal entry
        user_meal_data = {
            "user_id": user_id,
            "meal_id": meal_id,
            "date": meal_date,
            "meal_type": meal_type,
            "servings": servings,
            "total_calories": nutrition["calories"],
            "total_protein": nutrition["protein"],
            "total_carbohydrates": nutrition["carbohydrates"],
            "total_fat": nutrition["fat"],
        }
        
        user_meal = UserMealRepository.create(db, user_meal_data)
        return user_meal
    
    @staticmethod
    def get_user_meals(
        db: Session,
        user_id: int,
        meal_date: Optional[date] = None
    ) -> List[Dict]:
        """Get meals for a user."""
        meals = UserMealRepository.get_user_meals(db, user_id, meal_date)
        return meals
