"""AI Recipe API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from app.repositories.database import get_db
from app.services.ai_recipe_service import get_ai_service
from app.repositories.meal_repository import MealRepository
from app.repositories.recipe_rating_repository import RecipeRatingRepository
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/ai-recipes", tags=["ai-recipes"])


# Pydantic models
class IngredientSearchRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1, description="List of ingredient names")
    limit: int = Field(10, ge=1, le=50, description="Maximum number of results")
    min_ingredients_match: int = Field(1, ge=1, description="Minimum ingredients that must match")


class RecipeMatch(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: str
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    ingredients: Optional[str]
    similarity: float
    matched_ingredients: int
    total_ingredients: int
    score: float
    average_rating: float
    rating_count: int
    
    class Config:
        from_attributes = True


class RecipeCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    ingredients: str  # Comma-separated list
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float = 0.0
    sugar: float = 0.0
    sodium: float = 0.0
    serving_size: Optional[str] = None
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    is_dairy_free: bool = False
    is_nut_free: bool = False
    is_halal: bool = False
    is_kosher: bool = False
    created_by_user_id: Optional[int] = None


class RecipeRatingRequest(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating from 1 to 5")
    comment: Optional[str] = None


class RecipeRatingResponse(BaseModel):
    id: int
    user_id: int
    meal_id: int
    rating: float
    comment: Optional[str]
    
    class Config:
        from_attributes = True


@router.post("/search", response_model=List[RecipeMatch])
def search_recipes_by_ingredients(
    request: IngredientSearchRequest,
    db: Session = Depends(get_db)
):
    """
    Search for recipes using AI based on selected ingredients.
    """
    ai_service = get_ai_service()
    
    if not ai_service.is_trained:
        # Try to load model
        if not ai_service._load_model():
            raise HTTPException(
                status_code=503,
                detail="AI model not trained. Please train the model first using /api/ai-recipes/train"
            )
    
    results = ai_service.find_recipes_by_ingredients(
        ingredients=request.ingredients,
        limit=request.limit,
        min_ingredients_match=request.min_ingredients_match
    )
    
    # Format response
    formatted_results = []
    for result in results:
        meal = result['meal']
        formatted_results.append({
            "id": meal.id,
            "name": meal.name,
            "description": meal.description,
            "category": meal.category,
            "calories": meal.calories,
            "protein": meal.protein,
            "carbohydrates": meal.carbohydrates,
            "fat": meal.fat,
            "ingredients": meal.ingredients,
            "similarity": result['similarity'],
            "matched_ingredients": result['matched_ingredients'],
            "total_ingredients": result['total_ingredients'],
            "score": result['score'],
            "average_rating": result['average_rating'],
            "rating_count": result['rating_count']
        })
    
    return formatted_results


@router.post("/create", response_model=RecipeMatch)
def create_recipe(
    recipe: RecipeCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new recipe. This will be used to train the AI model.
    """
    # Validate user if provided
    if recipe.created_by_user_id:
        user = UserRepository.get_by_id(db, recipe.created_by_user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    # Create meal
    meal_data = recipe.dict(exclude_none=True)
    new_meal = MealRepository.create(db, meal_data)
    
    # Retrain model if it exists (async in production, sync for now)
    ai_service = get_ai_service()
    if ai_service.is_trained:
        # In production, you'd want to do this asynchronously
        try:
            ai_service.train_model(db)
        except Exception as e:
            print(f"Error retraining model: {e}")
    
    return {
        "id": new_meal.id,
        "name": new_meal.name,
        "description": new_meal.description,
        "category": new_meal.category,
        "calories": new_meal.calories,
        "protein": new_meal.protein,
        "carbohydrates": new_meal.carbohydrates,
        "fat": new_meal.fat,
        "ingredients": new_meal.ingredients,
        "similarity": 1.0,
        "matched_ingredients": len(new_meal.ingredients.split(',')) if new_meal.ingredients else 0,
        "total_ingredients": len(new_meal.ingredients.split(',')) if new_meal.ingredients else 0,
        "score": 1.0,
        "average_rating": 0.0,
        "rating_count": 0
    }


@router.post("/meals/{meal_id}/rate", response_model=RecipeRatingResponse)
def rate_recipe(
    meal_id: int,
    user_id: int,
    rating_request: RecipeRatingRequest,
    db: Session = Depends(get_db)
):
    """
    Rate a recipe. Users can rate recipes to help improve recommendations.
    """
    # Validate meal exists
    meal = MealRepository.get_by_id(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    # Validate user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create or update rating
    rating = RecipeRatingRepository.create_or_update(
        db=db,
        user_id=user_id,
        meal_id=meal_id,
        rating=rating_request.rating,
        comment=rating_request.comment
    )
    
    # Retrain model to incorporate new ratings
    ai_service = get_ai_service()
    if ai_service.is_trained:
        try:
            ai_service.train_model(db)
        except Exception as e:
            print(f"Error retraining model after rating: {e}")
    
    return rating


@router.get("/meals/{meal_id}/ratings", response_model=List[RecipeRatingResponse])
def get_recipe_ratings(
    meal_id: int,
    db: Session = Depends(get_db)
):
    """Get all ratings for a recipe."""
    ratings = RecipeRatingRepository.get_by_meal(db, meal_id)
    return ratings


@router.get("/meals/{meal_id}/user/{user_id}/rating", response_model=Optional[RecipeRatingResponse])
def get_user_rating(
    meal_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get a user's rating for a specific recipe."""
    rating = RecipeRatingRepository.get_by_user_and_meal(db, user_id, meal_id)
    return rating


@router.post("/train")
def train_model(db: Session = Depends(get_db)):
    """
    Train the AI model from all recipes in the database.
    This endpoint can be called manually or scheduled to retrain periodically.
    """
    ai_service = get_ai_service()
    result = ai_service.train_model(db)
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message", "Training failed"))
    
    return result


@router.get("/model/status")
def get_model_status():
    """Get the current status of the AI model."""
    ai_service = get_ai_service()
    return ai_service.get_model_status()

