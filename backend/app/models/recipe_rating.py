"""Recipe Rating model for user ratings and feedback."""
from sqlalchemy import Column, Integer, ForeignKey, Float, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class RecipeRating(Base):
    """RecipeRating model for tracking user ratings and feedback on recipes."""
    
    __tablename__ = "recipe_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False, index=True)
    
    # Rating (1-5 stars)
    rating = Column(Float, nullable=False)  # 1.0 to 5.0
    
    # Optional feedback
    comment = Column(Text)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Ensure one rating per user per meal
    __table_args__ = (UniqueConstraint('user_id', 'meal_id', name='unique_user_meal_rating'),)
    
    # Relationships
    user = relationship("User", backref="recipe_ratings")
    meal = relationship("Meal", backref="recipe_ratings")
    
    def __repr__(self):
        return f"<RecipeRating(user_id={self.user_id}, meal_id={self.meal_id}, rating={self.rating})>"

