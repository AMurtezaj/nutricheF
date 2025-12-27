"""Nutrition analysis API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from pydantic import BaseModel
from typing import Optional
from app.repositories.database import get_db
from app.services.nutrition_service import NutritionService
from app.repositories.meal_repository import MealRepository

router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])


class MealAnalysisRequest(BaseModel):
    meal_id: int
    servings: float = 1.0


class MealAnalysisResponse(BaseModel):
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float
    sugar: float
    sodium: float


class DailyNutritionResponse(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbohydrates: float
    total_fat: float
    targets: dict
    progress: dict
    remaining: dict


@router.post("/analyze", response_model=MealAnalysisResponse)
def analyze_meal(
    analysis_request: MealAnalysisRequest,
    db: Session = Depends(get_db)
):
    """Analyze nutritional content of a meal."""
    meal = MealRepository.get_by_id(db, analysis_request.meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    nutrition = NutritionService.analyze_meal_nutrition(meal, analysis_request.servings)
    return nutrition


@router.get("/users/{user_id}/daily", response_model=DailyNutritionResponse)
def get_daily_nutrition(
    user_id: int,
    meal_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get daily nutrition summary for a user."""
    try:
        summary = NutritionService.get_daily_nutrition_summary(
            db, user_id, meal_date or date.today()
        )
        return summary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


