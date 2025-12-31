"""Preference repository for database operations."""
from typing import Optional
from sqlalchemy.orm import Session
from app.models.preference import Preference


class PreferenceRepository:
    """Repository for Preference model database operations."""
    
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
    def create_or_update(db: Session, user_id: int, preference_data: dict) -> Preference:
        """Create or update preferences."""
        preference = PreferenceRepository.get_by_user_id(db, user_id)
        if preference:
            return PreferenceRepository.update(db, user_id, preference_data)
        else:
            preference_data["user_id"] = user_id
            return PreferenceRepository.create(db, preference_data)




