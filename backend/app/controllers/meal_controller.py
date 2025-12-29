"""Meal API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
from app.repositories.database import get_db
from app.services.meal_service import MealService
from app.repositories.meal_repository import MealRepository

router = APIRouter(prefix="/api/meals", tags=["meals"])


# Pydantic models
class MealCreate(BaseModel):
    name: str
    description: str = None
    category: str
    ingredients: str = None  # Comma-separated list
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float = 0.0
    sugar: float = 0.0
    sodium: float = 0.0
    serving_size: str = None
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    is_dairy_free: bool = False
    is_nut_free: bool = False
    is_halal: bool = False
    is_kosher: bool = False
    created_by_user_id: int = None


class MealResponse(BaseModel):
    id: int
    name: str
    description: str = None
    category: str
    ingredients: str = None
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float = 0.0
    sugar: float = 0.0
    sodium: float = 0.0
    serving_size: str = None
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    is_dairy_free: bool = False
    is_nut_free: bool = False
    is_halal: bool = False
    is_kosher: bool = False
    average_rating: float = 0.0
    rating_count: int = 0
    
    class Config:
        from_attributes = True


class UserMealCreate(BaseModel):
    meal_id: int
    date: date
    meal_type: str  # breakfast, lunch, dinner, snack
    servings: float = 1.0


@router.post("", response_model=MealResponse, status_code=201)
def create_meal(meal: MealCreate, db: Session = Depends(get_db)):
    """Create a new meal."""
    meal_data = meal.dict(exclude_none=True)
    new_meal = MealService.create_meal(db, meal_data)
    return new_meal


@router.get("", response_model=List[MealResponse])
def get_all_meals(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all meals, optionally filtered by category."""
    if category:
        meals = MealRepository.get_by_category(db, category, skip, limit)
    else:
        meals = MealService.get_all_meals(db, skip, limit)
    return meals


@router.get("/{meal_id}", response_model=MealResponse)
def get_meal(meal_id: int, db: Session = Depends(get_db)):
    """Get meal by ID."""
    meal = MealService.get_meal_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@router.get("/search/{query}", response_model=List[MealResponse])
def search_meals(
    query: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Search meals by name or description."""
    meals = MealService.search_meals(db, query, skip, limit)
    return meals


@router.post("/users/{user_id}/meals", status_code=201)
def add_user_meal(
    user_id: int,
    user_meal: UserMealCreate,
    db: Session = Depends(get_db)
):
    """Add a meal to user's daily log."""
    try:
        new_user_meal = MealService.add_user_meal(
            db,
            user_id,
            user_meal.meal_id,
            user_meal.date,
            user_meal.meal_type,
            user_meal.servings
        )
        return new_user_meal
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/users/{user_id}/meals", response_model=List)
def get_user_meals(
    user_id: int,
    meal_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get meals for a user, optionally filtered by date."""
    meals = MealService.get_user_meals(db, user_id, meal_date)
    return meals


