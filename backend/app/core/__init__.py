"""Core module containing base classes and interfaces."""
from app.core.interfaces import (
    IRepository,
    IService,
    IRecommendationEngine,
    INutritionCalculator,
    IModelSerializer,
)
from app.core.base_repository import BaseRepository
from app.core.base_service import BaseService

__all__ = [
    "IRepository",
    "IService",
    "IRecommendationEngine",
    "INutritionCalculator",
    "IModelSerializer",
    "BaseRepository",
    "BaseService",
]
