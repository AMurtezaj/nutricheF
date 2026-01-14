"""API endpoints for saved meals functionality."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.repositories.database import get_db
from app.repositories.saved_meal_repository import SavedMealRepository
from app.repositories.meal_repository import MealRepository
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/saved-meals", tags=["saved-meals"])


class SaveMealRequest(BaseModel):
    """Request model for saving a meal."""
    note: Optional[str] = None


class SavedMealResponse(BaseModel):
    """Response model for saved meal."""
    id: int
    meal_id: int
    meal_name: str
    meal_description: Optional[str]
    meal_category: str
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    note: Optional[str]
    saved_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/users/{user_id}/meals/{meal_id}", response_model=SavedMealResponse)
def save_meal(
    user_id: int,
    meal_id: int,
    request: SaveMealRequest,
    db: Session = Depends(get_db)
):
    """Save a meal for a user."""
    # Verify user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify meal exists
    meal = MealRepository.get_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    # Save the meal
    saved_meal = SavedMealRepository.save_meal(db, user_id, meal_id, request.note)
    
    return {
        "id": saved_meal.id,
        "meal_id": meal.id,
        "meal_name": meal.name,
        "meal_description": meal.description,
        "meal_category": meal.category,
        "calories": meal.calories,
        "protein": meal.protein,
        "carbohydrates": meal.carbohydrates,
        "fat": meal.fat,
        "note": saved_meal.note,
        "saved_at": saved_meal.created_at
    }


@router.delete("/users/{user_id}/meals/{meal_id}")
def unsave_meal(
    user_id: int,
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Remove a saved meal."""
    # Verify user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Unsave the meal
    success = SavedMealRepository.unsave_meal(db, user_id, meal_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Saved meal not found")
    
    return {"message": "Meal unsaved successfully"}


@router.get("/users/{user_id}", response_model=List[SavedMealResponse])
def get_saved_meals(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all saved meals for a user."""
    # Verify user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get saved meals
    saved_meals = SavedMealRepository.get_saved_meals(db, user_id, skip, limit)
    
    # Format response
    response = []
    for saved_meal in saved_meals:
        meal = saved_meal.meal
        response.append({
            "id": saved_meal.id,
            "meal_id": meal.id,
            "meal_name": meal.name,
            "meal_description": meal.description,
            "meal_category": meal.category,
            "calories": meal.calories,
            "protein": meal.protein,
            "carbohydrates": meal.carbohydrates,
            "fat": meal.fat,
            "note": saved_meal.note,
            "saved_at": saved_meal.created_at
        })
    
    return response


@router.get("/users/{user_id}/meals/{meal_id}/is-saved")
def check_if_saved(
    user_id: int,
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Check if a meal is saved by the user."""
    is_saved = SavedMealRepository.is_meal_saved(db, user_id, meal_id)
    return {"is_saved": is_saved}





