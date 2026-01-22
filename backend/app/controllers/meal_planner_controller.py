"""API endpoints for meal planning functionality."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from pydantic import BaseModel

from app.repositories.database import get_db
from app.services.meal_planner_service import MealPlannerService
from app.exceptions import UserNotFoundException

router = APIRouter(prefix="/api/meal-planner", tags=["meal-planner"])


class MealPlanRequest(BaseModel):
    """Request model for generating a meal plan."""
    days: int = 7
    start_date: Optional[str] = None


@router.post("/users/{user_id}/generate")
def generate_meal_plan(
    user_id: int,
    request: MealPlanRequest = MealPlanRequest(),
    db: Session = Depends(get_db)
):
    """
    Generate a personalized weekly meal plan for a user.
    
    Args:
        user_id: User ID
        request: MealPlanRequest with optional days and start_date
        
    Returns:
        Complete weekly meal plan with daily breakdowns and nutrition info
    """
    try:
        # Parse start date if provided
        start_date = None
        if request.start_date:
            try:
                start_date = date.fromisoformat(request.start_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        # Validate days
        if request.days < 1 or request.days > 14:
            raise HTTPException(status_code=400, detail="Days must be between 1 and 14")
        
        # Generate the meal plan
        result = MealPlannerService.generate_weekly_plan(
            db=db,
            user_id=user_id,
            start_date=start_date,
            days=request.days
        )
        
        return result
        
    except UserNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating meal plan: {str(e)}")


@router.get("/users/{user_id}/quick-plan")
def get_quick_plan(
    user_id: int,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """
    Quick endpoint to generate a meal plan with default settings.
    
    Args:
        user_id: User ID
        days: Number of days (default 7)
        
    Returns:
        Weekly meal plan
    """
    try:
        result = MealPlannerService.generate_weekly_plan(
            db=db,
            user_id=user_id,
            days=min(days, 14)
        )
        return result
    except UserNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
