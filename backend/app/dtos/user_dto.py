"""
User Data Transfer Objects (DTOs).

This module defines Pydantic models for user-related data transfer
between the API layer and the service layer.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.enums import Gender, ActivityLevel, Goal


class UserBaseDTO(BaseModel):
    """Base DTO with common user fields."""
    email: EmailStr
    username: str
    first_name: str
    last_name: str


class UserCreateDTO(UserBaseDTO):
    """DTO for creating a new user."""
    age: Optional[int] = None
    gender: Optional[Gender] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    goal: Optional[Goal] = None
    
    class Config:
        use_enum_values = True


class UserUpdateDTO(BaseModel):
    """DTO for updating an existing user."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[Gender] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    goal: Optional[Goal] = None
    
    class Config:
        use_enum_values = True


class UserResponseDTO(UserBaseDTO):
    """DTO for user response data."""
    id: int
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    daily_calorie_target: Optional[float] = None
    daily_protein_target: Optional[float] = None
    daily_carb_target: Optional[float] = None
    daily_fat_target: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# For ORM compatibility - convert DB model to DTO
class UserDTO(UserResponseDTO):
    """Complete user DTO with all fields."""
    pass
