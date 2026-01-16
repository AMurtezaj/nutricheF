"""MealRating model for users to rate meals."""
from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class MealRating(Base):
    """MealRating model for user ratings and reviews."""
    
    __tablename__ = "meal_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False, index=True)
    
    # Rating (1-5 stars)
    rating = Column(Float, nullable=False)
    
    # Optional review
    review = Column(String(1000))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="meal_ratings")
    meal = relationship("Meal", back_populates="ratings")
    
    def __repr__(self):
        return f"<MealRating(user_id={self.user_id}, meal_id={self.meal_id}, rating={self.rating})>"





