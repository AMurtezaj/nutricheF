"""
Abstract base classes for database models.

This module provides abstract base classes (mixins) that define common
attributes and behaviors shared across multiple database models.

These demonstrate OOP abstraction by encapsulating common patterns.
"""
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func


class TimestampMixin:
    """
    Abstract base class providing timestamp fields.
    
    This mixin adds created_at and updated_at fields to any model that inherits it.
    Demonstrates abstraction and code reuse.
    """
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def get_age(self):
        """Calculate how long ago this entity was created."""
        from datetime import datetime, timezone
        if self.created_at:
            return datetime.now(timezone.utc) - self.created_at
        return None


class RatedMixin:
    """
    Abstract base class providing rating fields.
    
    This mixin adds average_rating and rating_count fields to any model
    that can be rated by users.
    """
    average_rating = Column(Float, default=0.0, nullable=False)
    rating_count = Column(Integer, default=0, nullable=False)
    
    def update_rating(self, new_rating: float, is_new: bool = False):
        """
        Update the average rating when a new rating is added or updated.
        
        Args:
            new_rating: The new rating value (1-5)
            is_new: Whether this is a new rating (vs updating existing)
        """
        if is_new:
            total = (self.average_rating * self.rating_count) + new_rating
            self.rating_count += 1
            self.average_rating = total / self.rating_count
        else:
            # For updates, this is simplified - in production you'd track individual ratings
            pass
    
    def has_ratings(self) -> bool:
        """Check if this entity has any ratings."""
        return self.rating_count > 0


class OwnedMixin:
    """
    Abstract base class providing ownership tracking.
    
    This mixin adds created_by_user_id field to track which user created
    an entity. Useful for user-generated content.
    """
    created_by_user_id = Column(
        Integer, 
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    def is_owned_by(self, user_id: int) -> bool:
        """Check if this entity is owned by a specific user."""
        return self.created_by_user_id == user_id
    
    def is_system_generated(self) -> bool:
        """Check if this entity was created by the system (not a user)."""
        return self.created_by_user_id is None


class SoftDeleteMixin:
    """
    Abstract base class providing soft delete functionality.
    
    This mixin adds deleted_at field to support soft deletes
    (marking records as deleted without actually removing them).
    """
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    def soft_delete(self):
        """Mark this entity as deleted."""
        from datetime import datetime, timezone
        self.deleted_at = datetime.now(timezone.utc)
    
    def restore(self):
        """Restore a soft-deleted entity."""
        self.deleted_at = None
    
    def is_deleted(self) -> bool:
        """Check if this entity is soft-deleted."""
        return self.deleted_at is not None


# Export all mixins
__all__ = [
    "TimestampMixin",
    "RatedMixin",
    "OwnedMixin",
    "SoftDeleteMixin",
]
