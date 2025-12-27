"""UserMeal repository for database operations."""
from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user_meal import UserMeal
from app.models.user import User


class UserMealRepository:
    """Repository for UserMeal model database operations."""
    
    @staticmethod
    def get_by_id(db: Session, user_meal_id: int) -> Optional[UserMeal]:
        """Get user meal by ID."""
        return db.query(UserMeal).filter(UserMeal.id == user_meal_id).first()
    
    @staticmethod
    def get_user_meals(
        db: Session,
        user_id: int,
        meal_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[UserMeal]:
        """Get all meals for a user, optionally filtered by date."""
        from sqlalchemy.orm import joinedload
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
            func.sum(UserMeal.total_fat).label("total_fat")
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
    def delete(db: Session, user_meal_id: int) -> bool:
        """Delete a user meal entry."""
        user_meal = UserMealRepository.get_by_id(db, user_meal_id)
        if user_meal:
            db.delete(user_meal)
            db.commit()
            return True
        return False

