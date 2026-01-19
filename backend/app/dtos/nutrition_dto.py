"""
Nutrition Data Transfer Objects (DTOs).

This module defines Pydantic models for nutrition-related data transfer
between the API layer and the service layer.
"""
from pydantic import BaseModel
from typing import Optional, Dict
from app.enums import Gender, ActivityLevel, Goal


class MacroTargetsDTO(BaseModel):
    """DTO for macro nutrient targets."""
    protein: float
    carbohydrates: float
    fat: float


class BMRCalculationDTO(BaseModel):
    """DTO for BMR calculation input/output."""
    weight: float
    height: float
    age: int
    gender: Gender
    bmr: Optional[float] = None
    
    class Config:
        use_enum_values = True


class TDEECalculationDTO(BMRCalculationDTO):
    """DTO for TDEE calculation (extends BMR)."""
    activity_level: ActivityLevel
    tdee: Optional[float] = None
    
    class Config:
        use_enum_values = True


class NutritionProgressDTO(BaseModel):
    """DTO for nutrition progress percentages."""
    calories: float
    protein: float
    carbohydrates: float
    fat: float


class NutritionRemainingDTO(BaseModel):
    """DTO for remaining nutrition targets."""
    calories: float
    protein: float
    carbohydrates: float
    fat: float


class NutritionTargetsDTO(BaseModel):
    """DTO for nutrition targets."""
    calories: float
    protein: float
    carbohydrates: float
    fat: float


class NutritionSummaryDTO(BaseModel):
    """DTO for daily nutrition summary."""
    total_calories: float
    total_protein: float
    total_carbohydrates: float
    total_fat: float
    meal_count: int
    targets: NutritionTargetsDTO
    progress: NutritionProgressDTO
    remaining: NutritionRemainingDTO
    
    class Config:
        from_attributes = True


class CalorieTargetCalculationDTO(BaseModel):
    """DTO for calorie target calculation."""
    tdee: float
    goal: Goal
    calorie_target: Optional[float] = None
    
    class Config:
        use_enum_values = True
