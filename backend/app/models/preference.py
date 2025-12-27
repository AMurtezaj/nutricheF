"""Preference model for user dietary preferences and restrictions."""
from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, Float
from sqlalchemy.orm import relationship
from app.models.base import Base


class Preference(Base):
    """Preference model storing user dietary preferences and restrictions."""
    
    __tablename__ = "preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Dietary restrictions
    vegetarian = Column(Boolean, default=False)
    vegan = Column(Boolean, default=False)
    gluten_free = Column(Boolean, default=False)
    dairy_free = Column(Boolean, default=False)
    nut_free = Column(Boolean, default=False)
    halal = Column(Boolean, default=False)
    kosher = Column(Boolean, default=False)
    
    # Preferences
    preferred_cuisine = Column(String(100))  # e.g., 'italian', 'asian', 'mediterranean'
    disliked_ingredients = Column(String(500))  # comma-separated list
    favorite_ingredients = Column(String(500))  # comma-separated list
    
    # Macro preferences (as percentages)
    preferred_protein_ratio = Column(Float)  # 0.0 to 1.0
    preferred_carb_ratio = Column(Float)  # 0.0 to 1.0
    preferred_fat_ratio = Column(Float)  # 0.0 to 1.0
    
    # Relationship
    user = relationship("User", back_populates="preferences")
    
    def __repr__(self):
        return f"<Preference(user_id={self.user_id})>"


