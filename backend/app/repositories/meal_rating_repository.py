"""Repository for MealRating operations.

This module provides the MealRatingRepository class which handles all database
operations for MealRating entities, implementing the 3-level inheritance hierarchy:
IRepository (Abstract) -> BaseRepository (Concrete Base) -> MealRatingRepository
"""
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.meal_rating import MealRating
from app.exceptions import RatingValidationException


class MealRatingRepository:
    """Repository for MealRating model operations."""
    
    @staticmethod
    def get_by_id(db: Session, rating_id: int) -> Optional[MealRating]:
        """Get rating by ID."""
        return db.query(MealRating).filter(MealRating.id == rating_id).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[MealRating]:
        """Get all ratings with pagination."""
        return db.query(MealRating).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_or_update_rating(
        db: Session, 
        user_id: int, 
        meal_id: int, 
        rating: float, 
        review: Optional[str] = None
    ) -> MealRating:
        """Create or update a meal rating."""
        # Validate rating using custom exception
        if rating < 1 or rating > 5:
            raise RatingValidationException(rating)
        
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
    
    @staticmethod
    def create(db: Session, rating_data: dict) -> MealRating:
        """Create a new rating."""
        rating = MealRating(**rating_data)
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating
    
    @staticmethod
    def update(db: Session, rating_id: int, rating_data: dict) -> Optional[MealRating]:
        """Update a rating."""
        rating = MealRatingRepository.get_by_id(db, rating_id)
        if rating:
            for key, value in rating_data.items():
                setattr(rating, key, value)
            db.commit()
            db.refresh(rating)
        return rating
    
    @staticmethod
    def delete(db: Session, rating_id: int) -> bool:
        """Delete a rating by ID."""
        rating = MealRatingRepository.get_by_id(db, rating_id)
        if rating:
            db.delete(rating)
            db.commit()
            return True
        return False
