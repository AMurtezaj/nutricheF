"""Recipe Rating repository for database operations."""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.recipe_rating import RecipeRating
from app.models.meal import Meal


class RecipeRatingRepository:
    """Repository for RecipeRating model database operations."""
    
    @staticmethod
    def get_by_id(db: Session, rating_id: int) -> Optional[RecipeRating]:
        """Get rating by ID."""
        return db.query(RecipeRating).filter(RecipeRating.id == rating_id).first()
    
    @staticmethod
    def get_by_user_and_meal(
        db: Session,
        user_id: int,
        meal_id: int
    ) -> Optional[RecipeRating]:
        """Get rating by user and meal."""
        return db.query(RecipeRating).filter(
            RecipeRating.user_id == user_id,
            RecipeRating.meal_id == meal_id
        ).first()
    
    @staticmethod
    def get_by_meal(db: Session, meal_id: int) -> List[RecipeRating]:
        """Get all ratings for a meal."""
        return db.query(RecipeRating).filter(RecipeRating.meal_id == meal_id).all()
    
    @staticmethod
    def get_by_user(db: Session, user_id: int) -> List[RecipeRating]:
        """Get all ratings by a user."""
        return db.query(RecipeRating).filter(RecipeRating.user_id == user_id).all()
    
    @staticmethod
    def create_or_update(
        db: Session,
        user_id: int,
        meal_id: int,
        rating: float,
        comment: Optional[str] = None
    ) -> RecipeRating:
        """Create or update a rating."""
        existing = RecipeRatingRepository.get_by_user_and_meal(db, user_id, meal_id)
        
        if existing:
            existing.rating = rating
            if comment is not None:
                existing.comment = comment
            db.commit()
            db.refresh(existing)
            rating_obj = existing
        else:
            rating_obj = RecipeRating(
                user_id=user_id,
                meal_id=meal_id,
                rating=rating,
                comment=comment
            )
            db.add(rating_obj)
            db.commit()
            db.refresh(rating_obj)
        
        # Update meal's average rating
        RecipeRatingRepository._update_meal_rating(db, meal_id)
        
        return rating_obj
    
    @staticmethod
    def delete(db: Session, rating_id: int) -> bool:
        """Delete a rating."""
        rating = RecipeRatingRepository.get_by_id(db, rating_id)
        if rating:
            meal_id = rating.meal_id
            db.delete(rating)
            db.commit()
            # Update meal's average rating
            RecipeRatingRepository._update_meal_rating(db, meal_id)
            return True
        return False
    
    @staticmethod
    def _update_meal_rating(db: Session, meal_id: int):
        """Update the average rating for a meal."""
        result = db.query(
            func.avg(RecipeRating.rating).label('avg_rating'),
            func.count(RecipeRating.id).label('count')
        ).filter(RecipeRating.meal_id == meal_id).first()
        
        meal = db.query(Meal).filter(Meal.id == meal_id).first()
        if meal and result:
            meal.average_rating = float(result.avg_rating) if result.avg_rating else 0.0
            meal.rating_count = int(result.count) if result.count else 0
            db.commit()

