"""
Meal Data Transfer Objects (DTOs).

This module defines Pydantic models for meal-related data transfer
between the API layer and the service layer.
"""
from pydantic import BaseModel
from typing import Optional, List
from app.enums import MealCategory


class MealBaseDTO(BaseModel):
    """Base DTO with common meal fields."""
    name: str
    description: Optional[str] = None
    category: Optional[MealCategory] = None
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    
    class Config:
        use_enum_values = True


class MealCreateDTO(MealBaseDTO):
    """DTO for creating a new meal."""
    fiber: Optional[float] = 0.0
    sugar: Optional[float] = 0.0
    sodium: Optional[float] = 0.0
    serving_size: Optional[str] = None
    ingredients: Optional[str] = None
    is_vegetarian: Optional[bool] = False
    is_vegan: Optional[bool] = False
    is_gluten_free: Optional[bool] = False
    is_dairy_free: Optional[bool] = False
    is_nut_free: Optional[bool] = False
    is_halal: Optional[bool] = False
    is_kosher: Optional[bool] = False


class MealUpdateDTO(BaseModel):
    """DTO for updating an existing meal."""
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[MealCategory] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None
    fat: Optional[float] = None
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None
    serving_size: Optional[str] = None
    ingredients: Optional[str] = None
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    is_dairy_free: Optional[bool] = None
    is_nut_free: Optional[bool] = None
    is_halal: Optional[bool] = None
    is_kosher: Optional[bool] = None
    
    class Config:
        use_enum_values = True


class MealResponseDTO(MealBaseDTO):
    """DTO for meal response data."""
    id: int
    fiber: Optional[float] = 0.0
    sugar: Optional[float] = 0.0
    sodium: Optional[float] = 0.0
    serving_size: Optional[str] = None
    ingredients: Optional[str] = None
    created_by_user_id: Optional[int] = None
    average_rating: Optional[float] = 0.0
    rating_count: Optional[int] = 0
    is_vegetarian: Optional[bool] = False
    is_vegan: Optional[bool] = False
    is_gluten_free: Optional[bool] = False
    is_dairy_free: Optional[bool] = False
    is_nut_free: Optional[bool] = False
    is_halal: Optional[bool] = False
    is_kosher: Optional[bool] = False
    
    class Config:
        from_attributes = True


class MealRecommendationDTO(BaseModel):
    """DTO for meal recommendation response."""
    meal: MealResponseDTO
    score: float
    ml_score: Optional[float] = None
    content_score: Optional[float] = None
    reason: str
    
    class Config:
        from_attributes = True


class MealNutritionDTO(BaseModel):
    """DTO for meal nutrition analysis."""
    calories: float
    protein: float
    carbohydrates: float
    fat: float
    fiber: float
    sugar: float
    sodium: float
