"""Meal API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from pydantic import BaseModel
from app.repositories.database import get_db
from app.services.meal_service import MealService
from app.repositories.meal_repository import MealRepository
from app.repositories.meal_rating_repository import MealRatingRepository

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
    """Get meal by ID with rating statistics."""
    meal = MealService.get_meal_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail=str(MealNotFoundException(meal_id=meal_id)))
    
    # Get rating stats
    rating_stats = MealRatingRepository.get_meal_rating_stats(db, meal_id)
    
    # Convert to dict and add rating stats
    meal_dict = {
        "id": meal.id,
        "name": meal.name,
        "description": meal.description,
        "category": meal.category,
        "calories": meal.calories,
        "protein": meal.protein,
        "carbohydrates": meal.carbohydrates,
        "fat": meal.fat,
        "fiber": meal.fiber,
        "sugar": meal.sugar,
        "sodium": meal.sodium,
        "serving_size": meal.serving_size,
        "is_vegetarian": meal.is_vegetarian,
        "is_vegan": meal.is_vegan,
        "is_gluten_free": meal.is_gluten_free,
        "is_dairy_free": meal.is_dairy_free,
        "is_nut_free": meal.is_nut_free,
        "is_halal": meal.is_halal,
        "is_kosher": meal.is_kosher,
        "average_rating": rating_stats['average_rating'],
        "total_ratings": rating_stats['total_ratings']
    }
    
    return meal_dict


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


@router.get("/users/{user_id}/meals")
def get_user_meals(
    user_id: int,
    meal_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get meals for a user, optionally filtered by date."""
    user_meals = MealService.get_user_meals(db, user_id, meal_date)
    
    # Serialize the response manually to include meal details
    result = []
    for um in user_meals:
        meal_data = {
            "id": um.id,
            "user_id": um.user_id,
            "meal_id": um.meal_id,
            "date": um.date.isoformat() if um.date else None,
            "meal_type": um.meal_type,
            "servings": um.servings,
            "total_calories": um.total_calories,
            "total_protein": um.total_protein,
            "total_carbohydrates": um.total_carbohydrates,
            "total_fat": um.total_fat,
            "meal": None
        }
        if um.meal:
            meal_data["meal"] = {
                "id": um.meal.id,
                "name": um.meal.name,
                "category": um.meal.category,
                "calories": um.meal.calories,
                "protein": um.meal.protein,
                "carbohydrates": um.meal.carbohydrates,
                "fat": um.meal.fat
            }
        result.append(meal_data)
    
    return result



