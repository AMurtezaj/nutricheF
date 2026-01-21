"""
Enumeration types for the Meal Recommendation System.

This module defines all enumeration types used throughout the application
for type safety and validation.
"""
from enum import Enum



class BaseEnum(str, Enum):
    """Base enumeration class with helper methods."""
    
    @classmethod
    def list(cls):
        """Return list of all values."""
        return [e.value for e in cls]
        
    @classmethod
    def dict(cls):
        """Return dictionary of {name: value}."""
        return {e.name: e.value for e in cls}


class Gender(BaseEnum):
    """Gender enumeration for user profiles."""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ActivityLevel(BaseEnum):
    """Activity level enumeration for calculating TDEE."""
    SEDENTARY = "sedentary"
    LIGHTLY_ACTIVE = "lightly_active"
    MODERATELY_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    EXTREMELY_ACTIVE = "extremely_active"


class Goal(BaseEnum):
    """User health/fitness goal enumeration."""
    WEIGHT_LOSS = "weight_loss"
    WEIGHT_GAIN = "weight_gain"
    MAINTENANCE = "maintenance"
    MUSCLE_GAIN = "muscle_gain"


class MealCategory(BaseEnum):
    """Meal category enumeration for classifying meals."""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


class MealType(BaseEnum):
    """Meal type enumeration for logging user meals."""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


# Export all enums
__all__ = [
    "Gender",
    "ActivityLevel",
    "Goal",
    "MealCategory",
    "MealType",
]
