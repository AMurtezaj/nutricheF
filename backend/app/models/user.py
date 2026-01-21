"""User model."""
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.models.base import Base
from app.models.abstract_models import TimestampMixin


class User(Base, TimestampMixin):
    """
    User model representing users of the application.
    
    Inherits from:
    - Base: SQLAlchemy declarative base
    - TimestampMixin: Provides created_at and updated_at fields
    """
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Health and fitness goals
    age = Column(Integer)
    gender = Column(String(20))  # 'male', 'female', 'other'
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    activity_level = Column(String(50))  # 'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
    goal = Column(String(50))  # 'weight_loss', 'weight_gain', 'maintenance', 'muscle_gain'
    
    # Daily calorie and macro targets
    daily_calorie_target = Column(Float)
    daily_protein_target = Column(Float)  # in grams
    daily_carb_target = Column(Float)  # in grams
    daily_fat_target = Column(Float)  # in grams
    
    # Timestamps inherited from TimestampMixin:
    # created_at, updated_at, get_age()
    
    # Relationships
    preferences = relationship("Preference", back_populates="user", cascade="all, delete-orphan")
    user_meals = relationship("UserMeal", back_populates="user", cascade="all, delete-orphan")
    saved_meals = relationship("SavedMeal", back_populates="user", cascade="all, delete-orphan")
    meal_ratings = relationship("MealRating", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"

