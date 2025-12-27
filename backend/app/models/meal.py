"""Meal model."""
from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base


class Meal(Base):
    """Meal model representing meals available in the system."""
    
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
    
    def __repr__(self):
        return f"<Meal(id={self.id}, name={self.name}, calories={self.calories})>"


