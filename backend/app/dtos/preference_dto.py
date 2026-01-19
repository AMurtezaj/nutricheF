"""
Preference Data Transfer Objects (DTOs).

This module defines Pydantic models for preference-related data transfer
between the API layer and the service layer.
"""
from pydantic import BaseModel
from typing import Optional


class PreferenceBaseDTO(BaseModel):
    """Base DTO with common preference fields."""
    vegetarian: Optional[bool] = False
    vegan: Optional[bool] = False
    gluten_free: Optional[bool] = False
    dairy_free: Optional[bool] = False
    nut_free: Optional[bool] = False
    halal: Optional[bool] = False
    kosher: Optional[bool] = False


class PreferenceCreateDTO(PreferenceBaseDTO):
    """DTO for creating new preferences."""
    user_id: int
    preferred_cuisine: Optional[str] = None
    disliked_ingredients: Optional[str] = None
    favorite_ingredients: Optional[str] = None
    preferred_protein_ratio: Optional[float] = None
    preferred_carb_ratio: Optional[float] = None
    preferred_fat_ratio: Optional[float] = None


class PreferenceUpdateDTO(BaseModel):
    """DTO for updating existing preferences."""
    vegetarian: Optional[bool] = None
    vegan: Optional[bool] = None
    gluten_free: Optional[bool] = None
    dairy_free: Optional[bool] = None
    nut_free: Optional[bool] = None
    halal: Optional[bool] = None
    kosher: Optional[bool] = None
    preferred_cuisine: Optional[str] = None
    disliked_ingredients: Optional[str] = None
    favorite_ingredients: Optional[str] = None
    preferred_protein_ratio: Optional[float] = None
    preferred_carb_ratio: Optional[float] = None
    preferred_fat_ratio: Optional[float] = None


class PreferenceResponseDTO(PreferenceBaseDTO):
    """DTO for preference response data."""
    id: int
    user_id: int
    preferred_cuisine: Optional[str] = None
    disliked_ingredients: Optional[str] = None
    favorite_ingredients: Optional[str] = None
    preferred_protein_ratio: Optional[float] = None
    preferred_carb_ratio: Optional[float] = None
    preferred_fat_ratio: Optional[float] = None
    
    class Config:
        from_attributes = True
