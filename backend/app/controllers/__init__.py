"""API controllers (endpoints)."""
from .user_controller import router as user_router
from .meal_controller import router as meal_router
from .nutrition_controller import router as nutrition_router
from .recommendation_controller import router as recommendation_router

# AI recipe router is optional (requires scikit-learn)
try:
    from .ai_recipe_controller import router as ai_recipe_router
except ImportError as e:
    ai_recipe_router = None
    import warnings
    warnings.warn(f"AI recipe controller not available: {e}", ImportWarning)

__all__ = [
    "user_router",
    "meal_router",
    "nutrition_router",
    "recommendation_router",
    "ai_recipe_router",
]




