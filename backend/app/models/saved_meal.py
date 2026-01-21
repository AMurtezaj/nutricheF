"""SavedMeal model for users to save favorite recipes."""
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class SavedMeal(Base):
    """SavedMeal model for users to bookmark/save meals."""
    
    __tablename__ = "saved_meals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False, index=True)
    
    # Optional note from user
    note = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="saved_meals")
    meal = relationship("Meal", back_populates="saved_by_users")
    
    def __repr__(self):
        return f"<SavedMeal(user_id={self.user_id}, meal_id={self.meal_id})>"
