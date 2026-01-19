"""Meal repository for database operations.

This module provides the MealRepository class which handles all database
operations for Meal entities, implementing the 3-level inheritance hierarchy:
IRepository (Abstract) -> BaseRepository (Concrete Base) -> MealRepository
"""
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.meal import Meal
from app.core.base_repository import BaseRepository


class MealRepository(BaseRepository[Meal]):
    """
    Repository for Meal model database operations.
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IRepository (Abstract interface)
    - Level 2: BaseRepository (Concrete base with common CRUD)
    - Level 3: MealRepository (Specific meal operations)
    
    This demonstrates polymorphism through method overriding and
    provides meal-specific query methods beyond basic CRUD.
    """
    
    # Set the model class for BaseRepository
    model = Meal
    
    @staticmethod
    def get_by_id(db: Session, meal_id: int) -> Optional[Meal]:
        """Get meal by ID."""
        return db.query(Meal).filter(Meal.id == meal_id).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Meal]:
        """Get all meals with pagination."""
        return db.query(Meal).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_category(db: Session, category: str, skip: int = 0, limit: int = 100) -> List[Meal]:
        """Get meals by category."""
        return db.query(Meal).filter(Meal.category == category).offset(skip).limit(limit).all()
    
    @staticmethod
    def search(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Meal]:
        """Search meals by name or description."""
        search_pattern = f"%{query}%"
        return db.query(Meal).filter(
            or_(
                Meal.name.ilike(search_pattern),
                Meal.description.ilike(search_pattern)
            )
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def filter_by_dietary_restrictions(
        db: Session,
        restrictions: Dict[str, bool],
        skip: int = 0,
        limit: int = 100
    ) -> List[Meal]:
        """Filter meals by dietary restrictions."""
        query = db.query(Meal)
        
        if restrictions.get("vegetarian"):
            query = query.filter(Meal.is_vegetarian == True)
        if restrictions.get("vegan"):
            query = query.filter(Meal.is_vegan == True)
        if restrictions.get("gluten_free"):
            query = query.filter(Meal.is_gluten_free == True)
        if restrictions.get("dairy_free"):
            query = query.filter(Meal.is_dairy_free == True)
        if restrictions.get("nut_free"):
            query = query.filter(Meal.is_nut_free == True)
        if restrictions.get("halal"):
            query = query.filter(Meal.is_halal == True)
        if restrictions.get("kosher"):
            query = query.filter(Meal.is_kosher == True)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def create(db: Session, meal_data: dict) -> Meal:
        """Create a new meal."""
        meal = Meal(**meal_data)
        db.add(meal)
        db.commit()
        db.refresh(meal)
        return meal
    
    @staticmethod
    def update(db: Session, meal_id: int, meal_data: dict) -> Optional[Meal]:
        """Update meal information."""
        meal = MealRepository.get_by_id(db, meal_id)
        if meal:
            for key, value in meal_data.items():
                setattr(meal, key, value)
            db.commit()
            db.refresh(meal)
        return meal
    
    @staticmethod
    def delete(db: Session, meal_id: int) -> bool:
        """Delete a meal."""
        meal = MealRepository.get_by_id(db, meal_id)
        if meal:
            db.delete(meal)
            db.commit()
            return True
        return False
