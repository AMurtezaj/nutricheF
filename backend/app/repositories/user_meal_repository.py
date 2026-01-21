"""UserMeal repository for database operations.

This module provides the UserMealRepository class which handles all database
operations for UserMeal entities, implementing the 3-level inheritance hierarchy:
IRepository (Abstract) -> BaseRepository (Concrete Base) -> UserMealRepository
"""
from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.user_meal import UserMeal
from app.models.user import User
from app.core.base_repository import BaseRepository


class UserMealRepository(BaseRepository[UserMeal]):
    """
    Repository for UserMeal model database operations.
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IRepository (Abstract interface)
    - Level 2: BaseRepository (Concrete base with common CRUD)
    - Level 3: UserMealRepository (Specific user meal operations)
    """
    
    # Set the model class for BaseRepository
    model = UserMeal
    
    @staticmethod
    def get_by_id(db: Session, user_meal_id: int) -> Optional[UserMeal]:
        """Get user meal by ID."""
        return db.query(UserMeal).filter(UserMeal.id == user_meal_id).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[UserMeal]:
        """Get all user meals with pagination."""
        return db.query(UserMeal).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_meals(
        db: Session,
        user_id: int,
        meal_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[UserMeal]:
        """Get all meals for a user, optionally filtered by date."""
        query = db.query(UserMeal).options(joinedload(UserMeal.meal)).filter(UserMeal.user_id == user_id)
        if meal_date:
            query = query.filter(UserMeal.date == meal_date)
        return query.order_by(UserMeal.date.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_daily_nutrition(db: Session, user_id: int, meal_date: date) -> dict:
        """Get total daily nutrition for a user on a specific date."""
        result = db.query(
            func.sum(UserMeal.total_calories).label("total_calories"),
            func.sum(UserMeal.total_protein).label("total_protein"),
            func.sum(UserMeal.total_carbohydrates).label("total_carbohydrates"),
            func.sum(UserMeal.total_fat).label("total_fat"),
            func.count(UserMeal.id).label("meal_count")
        ).filter(
            UserMeal.user_id == user_id,
            UserMeal.date == meal_date
        ).first()
        
        return {
            "date": meal_date.isoformat(),
            "total_calories": float(result.total_calories or 0),
            "total_protein": float(result.total_protein or 0),
            "total_carbohydrates": float(result.total_carbohydrates or 0),
            "total_fat": float(result.total_fat or 0),
            "meal_count": result.meal_count or 0,
        }
    
    @staticmethod
    def create(db: Session, user_meal_data: dict) -> UserMeal:
        """Create a new user meal entry."""
        user_meal = UserMeal(**user_meal_data)
        db.add(user_meal)
        db.commit()
        db.refresh(user_meal)
        return user_meal
    
    @staticmethod
    def update(db: Session, user_meal_id: int, user_meal_data: dict) -> Optional[UserMeal]:
        """Update a user meal entry."""
        user_meal = UserMealRepository.get_by_id(db, user_meal_id)
        if user_meal:
            for key, value in user_meal_data.items():
                setattr(user_meal, key, value)
            db.commit()
            db.refresh(user_meal)
        return user_meal
    
    @staticmethod
    def delete(db: Session, user_meal_id: int) -> bool:
        """Delete a user meal entry."""
        user_meal = UserMealRepository.get_by_id(db, user_meal_id)
        if user_meal:
            db.delete(user_meal)
            db.commit()
            return True
        return False
