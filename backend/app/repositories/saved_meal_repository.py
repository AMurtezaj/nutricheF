"""Repository for SavedMeal operations."""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.saved_meal import SavedMeal
from app.models.meal import Meal


class SavedMealRepository:
    """Repository for SavedMeal model operations."""
    
    @staticmethod
    def save_meal(db: Session, user_id: int, meal_id: int, note: Optional[str] = None) -> SavedMeal:
        """Save a meal for a user."""
        # Check if already saved
        existing = db.query(SavedMeal).filter(
            and_(SavedMeal.user_id == user_id, SavedMeal.meal_id == meal_id)
        ).first()
        
        if existing:
            # Update note if provided
            if note is not None:
                existing.note = note
                db.commit()
                db.refresh(existing)
            return existing
        
        # Create new saved meal
        saved_meal = SavedMeal(
            user_id=user_id,
            meal_id=meal_id,
            note=note
        )
        db.add(saved_meal)
        db.commit()
        db.refresh(saved_meal)
        return saved_meal
    
    @staticmethod
    def unsave_meal(db: Session, user_id: int, meal_id: int) -> bool:
        """Remove a saved meal."""
        saved_meal = db.query(SavedMeal).filter(
            and_(SavedMeal.user_id == user_id, SavedMeal.meal_id == meal_id)
        ).first()
        
        if saved_meal:
            db.delete(saved_meal)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_saved_meals(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[SavedMeal]:
        """Get all saved meals for a user."""
        return db.query(SavedMeal).filter(
            SavedMeal.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def is_meal_saved(db: Session, user_id: int, meal_id: int) -> bool:
        """Check if a meal is saved by user."""
        return db.query(SavedMeal).filter(
            and_(SavedMeal.user_id == user_id, SavedMeal.meal_id == meal_id)
        ).first() is not None

