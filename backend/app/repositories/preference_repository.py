"""Preference repository for database operations.

This module provides the PreferenceRepository class which handles all database
operations for Preference entities, implementing the 3-level inheritance hierarchy:
IRepository (Abstract) -> BaseRepository (Concrete Base) -> PreferenceRepository
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.preference import Preference
from app.core.base_repository import BaseRepository


class PreferenceRepository(BaseRepository[Preference]):
    """
    Repository for Preference model database operations.
    
    Inheritance Hierarchy (3 levels):
    - Level 1: IRepository (Abstract interface)
    - Level 2: BaseRepository (Concrete base with common CRUD)
    - Level 3: PreferenceRepository (Specific preference operations)
    """
    
    # Set the model class for BaseRepository
    model = Preference
    
    @staticmethod
    def get_by_id(db: Session, preference_id: int) -> Optional[Preference]:
        """Get preference by ID."""
        return db.query(Preference).filter(Preference.id == preference_id).first()
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Preference]:
        """Get all preferences with pagination."""
        return db.query(Preference).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[Preference]:
        """Get preferences for a user."""
        return db.query(Preference).filter(Preference.user_id == user_id).first()
    
    @staticmethod
    def create(db: Session, preference_data: dict) -> Preference:
        """Create new preferences."""
        preference = Preference(**preference_data)
        db.add(preference)
        db.commit()
        db.refresh(preference)
        return preference
    
    @staticmethod
    def update(db: Session, user_id: int, preference_data: dict) -> Optional[Preference]:
        """Update user preferences."""
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        if preference:
            for key, value in preference_data.items():
                setattr(preference, key, value)
            db.commit()
            db.refresh(preference)
        return preference
    
    @staticmethod
    def delete(db: Session, preference_id: int) -> bool:
        """Delete a preference by ID."""
        preference = PreferenceRepository.get_by_id(db, preference_id)
        if preference:
            db.delete(preference)
            db.commit()
            return True
        return False
    
    @staticmethod
    def create_or_update(db: Session, user_id: int, preference_data: dict) -> Preference:
        """Create or update preferences."""
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        if preference:
            return PreferenceRepository.update(db, user_id, preference_data)
        else:
            preference_data["user_id"] = user_id
            return PreferenceRepository.create(db, preference_data)
