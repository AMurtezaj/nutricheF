"""API controllers (endpoints)."""
from .user_controller import router as user_router
from .meal_controller import router as meal_router
from .nutrition_controller import router as nutrition_router
from .recommendation_controller import router as recommendation_router

__all__ = [
    "user_router",
    "meal_router",
    "nutrition_router",
    "recommendation_router",
]




