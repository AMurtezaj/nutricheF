"""Repository for MealRating operations."""
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.meal_rating import MealRating


class MealRatingRepository:
    """Repository for MealRating model operations."""
    
    @staticmethod
    def create_or_update_rating(
        db: Session, 
        user_id: int, 
        meal_id: int, 
        rating: float, 
        review: Optional[str] = None
    ) -> MealRating:
        """Create or update a meal rating."""
        # Validate rating
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        
        # Check if rating exists
        existing = db.query(MealRating).filter(
            and_(MealRating.user_id == user_id, MealRating.meal_id == meal_id)
        ).first()
        
        if existing:
            # Update existing rating
            existing.rating = rating
            existing.review = review
            db.commit()
            db.refresh(existing)
            return existing
        
        # Create new rating
        meal_rating = MealRating(
            user_id=user_id,
            meal_id=meal_id,
            rating=rating,
            review=review
        )
        db.add(meal_rating)
        db.commit()
        db.refresh(meal_rating)
        return meal_rating
    
    @staticmethod
    def get_user_rating(db: Session, user_id: int, meal_id: int) -> Optional[MealRating]:
        """Get user's rating for a specific meal."""
        return db.query(MealRating).filter(
            and_(MealRating.user_id == user_id, MealRating.meal_id == meal_id)
        ).first()
    
    @staticmethod
    def get_meal_ratings(db: Session, meal_id: int, skip: int = 0, limit: int = 100) -> List[MealRating]:
        """Get all ratings for a meal."""
        return db.query(MealRating).filter(
            MealRating.meal_id == meal_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_meal_rating_stats(db: Session, meal_id: int) -> Dict:
        """Get rating statistics for a meal."""
        result = db.query(
            func.avg(MealRating.rating).label('average_rating'),
            func.count(MealRating.id).label('total_ratings')
        ).filter(MealRating.meal_id == meal_id).first()
        
        return {
            'average_rating': float(result.average_rating) if result.average_rating else 0.0,
            'total_ratings': result.total_ratings or 0
        }
    
    @staticmethod
    def delete_rating(db: Session, user_id: int, meal_id: int) -> bool:
        """Delete a rating."""
        rating = db.query(MealRating).filter(
            and_(MealRating.user_id == user_id, MealRating.meal_id == meal_id)
        ).first()
        
        if rating:
            db.delete(rating)
            db.commit()
            return True
        return False





