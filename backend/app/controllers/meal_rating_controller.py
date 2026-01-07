"""API endpoints for meal rating functionality."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

from app.repositories.database import get_db
from app.repositories.meal_rating_repository import MealRatingRepository
from app.repositories.meal_repository import MealRepository
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/ratings", tags=["ratings"])


class CreateRatingRequest(BaseModel):
    """Request model for creating/updating a rating."""
    rating: float = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review: Optional[str] = Field(None, max_length=1000)


class RatingResponse(BaseModel):
    """Response model for rating."""
    id: int
    user_id: int
    meal_id: int
    rating: float
    review: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class MealRatingStatsResponse(BaseModel):
    """Response model for meal rating statistics."""
    average_rating: float
    total_ratings: int


@router.post("/users/{user_id}/meals/{meal_id}", response_model=RatingResponse)
def create_or_update_rating(
    user_id: int,
    meal_id: int,
    request: CreateRatingRequest,
    db: Session = Depends(get_db)
):
    """Create or update a meal rating."""
    # Verify user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify meal exists
    meal = MealRepository.get_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    try:
        # Create or update rating
        rating = MealRatingRepository.create_or_update_rating(
            db, user_id, meal_id, request.rating, request.review
        )
        
        return rating
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/users/{user_id}/meals/{meal_id}", response_model=Optional[RatingResponse])
def get_user_rating(
    user_id: int,
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Get user's rating for a specific meal."""
    rating = MealRatingRepository.get_user_rating(db, user_id, meal_id)
    return rating


@router.get("/meals/{meal_id}", response_model=List[RatingResponse])
def get_meal_ratings(
    meal_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all ratings for a meal."""
    # Verify meal exists
    meal = MealRepository.get_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    ratings = MealRatingRepository.get_meal_ratings(db, meal_id, skip, limit)
    return ratings


@router.get("/meals/{meal_id}/stats", response_model=MealRatingStatsResponse)
def get_meal_rating_stats(
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Get rating statistics for a meal."""
    # Verify meal exists
    meal = MealRepository.get_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    stats = MealRatingRepository.get_meal_rating_stats(db, meal_id)
    return stats


@router.delete("/users/{user_id}/meals/{meal_id}")
def delete_rating(
    user_id: int,
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Delete a rating."""
    success = MealRatingRepository.delete_rating(db, user_id, meal_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    return {"message": "Rating deleted successfully"}

