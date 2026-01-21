"""Abstract interfaces for the Meal Recommendation System."""
from app.core.interfaces.base_repository import IRepository
from app.core.interfaces.base_service import IService
from app.core.interfaces.base_recommendation import IRecommendationEngine
from app.core.interfaces.base_nutrition import INutritionCalculator
from app.core.interfaces.base_serializer import IModelSerializer

__all__ = [
    "IRepository",
    "IService",
    "IRecommendationEngine",
    "INutritionCalculator",
    "IModelSerializer",
]
