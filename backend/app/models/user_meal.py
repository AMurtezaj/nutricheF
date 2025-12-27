"""UserMeal model for tracking user meal consumption."""
from sqlalchemy import Column, Integer, ForeignKey, Float, String, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class UserMeal(Base):
    """UserMeal model tracking when users consume meals."""
    
    __tablename__ = "user_meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False, index=True)
    
    # Consumption details
    date = Column(Date, nullable=False, index=True)
    meal_type = Column(String(50))  # 'breakfast', 'lunch', 'dinner', 'snack'
    servings = Column(Float, default=1.0)  # Number of servings consumed
    
    # Calculated nutrition for this consumption
    total_calories = Column(Float)
    total_protein = Column(Float)
    total_carbohydrates = Column(Float)
    total_fat = Column(Float)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_meals")
    meal = relationship("Meal", back_populates="user_meals")
    
    def __repr__(self):
        return f"<UserMeal(user_id={self.user_id}, meal_id={self.meal_id}, date={self.date})>"

