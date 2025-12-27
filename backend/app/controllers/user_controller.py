"""User API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from app.repositories.database import get_db
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/users", tags=["users"])


# Pydantic models for request/response
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    age: int = None
    gender: str = None
    height: float = None
    weight: float = None
    activity_level: str = None
    goal: str = None


class UserUpdate(BaseModel):
    email: EmailStr = None
    username: str = None
    first_name: str = None
    last_name: str = None
    age: int = None
    gender: str = None
    height: float = None
    weight: float = None
    activity_level: str = None
    goal: str = None


class PreferenceUpdate(BaseModel):
    vegetarian: bool = None
    vegan: bool = None
    gluten_free: bool = None
    dairy_free: bool = None
    nut_free: bool = None
    halal: bool = None
    kosher: bool = None
    preferred_cuisine: str = None
    disliked_ingredients: str = None
    favorite_ingredients: str = None
    preferred_protein_ratio: float = None
    preferred_carb_ratio: float = None
    preferred_fat_ratio: float = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
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
    
    class Config:
        from_attributes = True


@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user."""
    # Check if user already exists
    if UserRepository.get_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if UserRepository.get_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user_data = user.dict(exclude_none=True)
    new_user = UserService.create_user(db, user_data)
    return new_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """Update user information."""
    user_data = user.dict(exclude_none=True)
    updated_user = UserService.update_user(db, user_id, user_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.put("/{user_id}/preferences", status_code=200)
def update_user_preferences(
    user_id: int,
    preferences: PreferenceUpdate,
    db: Session = Depends(get_db)
):
    """Update or create user preferences."""
    # Check if user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    preference_data = preferences.dict(exclude_none=True)
    updated_preference = UserService.update_user_preferences(db, user_id, preference_data)
    return updated_preference


@router.get("", response_model=List[UserResponse])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all users (with pagination)."""
    users = UserRepository.get_all(db, skip=skip, limit=limit)
    return users


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user."""
    success = UserRepository.delete(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None

