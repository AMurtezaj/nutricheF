"""Recommendation API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.repositories.database import get_db
from app.services.recommendation_service import RecommendationService
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


class MealRecommendation(BaseModel):
    id: int
    name: str
    description: str = None
    category: str
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    score: float
    reason: str
    
    class Config:
        from_attributes = True


@router.get("/users/{user_id}", response_model=List[MealRecommendation])
def get_recommendations(
    user_id: int,
    category: Optional[str] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get personalized meal recommendations for a user."""
    # Check if user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        recommendations = RecommendationService.get_recommendations(
            db, user_id, category, limit
        )
        
        # Format response
        formatted_recommendations = []
        for rec in recommendations:
            meal = rec["meal"]
            formatted_recommendations.append({
                "id": meal.id,
                "name": meal.name,
                "description": meal.description,
                "category": meal.category,
                "calories": meal.calories,
                "protein": meal.protein,
                "carbohydrates": meal.carbohydrates,
                "fat": meal.fat,
                "score": rec["score"],
                "reason": rec["reason"],
            })
        
        return formatted_recommendations
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))




