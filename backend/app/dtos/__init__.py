"""DTO (Data Transfer Object) module for the Meal Recommendation System."""
from app.dtos.user_dto import (
    UserCreateDTO,
    UserUpdateDTO,
    UserResponseDTO,
)
from app.dtos.meal_dto import (
    MealCreateDTO,
    MealUpdateDTO,
    MealResponseDTO,
    MealRecommendationDTO,
)
from app.dtos.preference_dto import (
    PreferenceCreateDTO,
    PreferenceUpdateDTO,
    PreferenceResponseDTO,
)
from app.dtos.nutrition_dto import (
    NutritionSummaryDTO,
    MacroTargetsDTO,
    BMRCalculationDTO,
)

__all__ = [
    # User DTOs
    "UserCreateDTO",
    "UserUpdateDTO",
    "UserResponseDTO",
    # Meal DTOs
    "MealCreateDTO",
    "MealUpdateDTO",
    "MealResponseDTO",
    "MealRecommendationDTO",
    # Preference DTOs
    "PreferenceCreateDTO",
    "PreferenceUpdateDTO",
    "PreferenceResponseDTO",
    # Nutrition DTOs
    "NutritionSummaryDTO",
    "MacroTargetsDTO",
    "BMRCalculationDTO",
]
