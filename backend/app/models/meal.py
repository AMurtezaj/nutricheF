"""Meal model."""
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.abstract_models import RatedMixin, OwnedMixin


class Meal(Base, RatedMixin, OwnedMixin):
    """
    Meal model representing meals available in the system.
    
    Inherits from:
    - Base: SQLAlchemy declarative base
    - RatedMixin: Provides average_rating, rating_count, and rating methods
    - OwnedMixin: Provides created_by_user_id and ownership methods
    """
    
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    category = Column(String(100), index=True)  # 'breakfast', 'lunch', 'dinner', 'snack'
    
    # Nutritional information (per serving)
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)  # in grams
    carbohydrates = Column(Float, nullable=False)  # in grams
    fat = Column(Float, nullable=False)  # in grams
    fiber = Column(Float, default=0.0)  # in grams
    sugar = Column(Float, default=0.0)  # in grams
    sodium = Column(Float, default=0.0)  # in mg
    
    # Serving information
    serving_size = Column(String(100))  # e.g., "1 cup", "200g"
    
    # Ingredients (comma-separated list for AI model training)
    ingredients = Column(Text)  # e.g., "chicken, rice, tomatoes, onions"
    
    # Inherited from RatedMixin: average_rating, rating_count, update_rating(), has_ratings()
    # Inherited from OwnedMixin: created_by_user_id, is_owned_by(), is_system_generated()
    
    # Dietary tags
    is_vegetarian = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    is_dairy_free = Column(Boolean, default=False)
    is_nut_free = Column(Boolean, default=False)
    is_halal = Column(Boolean, default=False)
    is_kosher = Column(Boolean, default=False)
    
    # Relationships
    user_meals = relationship("UserMeal", back_populates="meal")
    saved_by_users = relationship("SavedMeal", back_populates="meal")
    ratings = relationship("MealRating", back_populates="meal")
    
    def __repr__(self):
        return f"<Meal(id={self.id}, name={self.name}, calories={self.calories})>"




