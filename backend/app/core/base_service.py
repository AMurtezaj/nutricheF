"""
Concrete base service class.

This module provides a concrete base implementation of the IService
interface that can be extended by specific services.
"""
from typing import Generic, TypeVar, Optional, Dict
from sqlalchemy.orm import Session
from app.core.interfaces.base_service import IService

# Type variable for the return type
T = TypeVar('T')


class BaseService(IService[T], Generic[T]):
    """
    Concrete base service implementing common business logic patterns.
    
    This is Level 2 of the 3-level inheritance hierarchy:
    IService (Abstract) -> BaseService (Concrete Base) -> ConcreteService
    
    Subclasses should set the `repository` class attribute to their repository class.
    """
    
    # Subclasses must set this to their repository class
    repository = None
    
    @classmethod
    def get_by_id(cls, db: Session, id: int) -> Optional[T]:
        """
        Retrieve an entity by its ID.
        
        Args:
            db: Database session
            id: Entity ID
            
        Returns:
            The entity if found, None otherwise
        """
        if cls.repository is None:
            raise NotImplementedError("Subclass must set 'repository' class attribute")
        return cls.repository.get_by_id(db, id)
    
    @classmethod
    def create(cls, db: Session, data: Dict) -> T:
        """
        Create a new entity with business logic.
        
        Args:
            db: Database session
            data: Dictionary containing entity data
            
        Returns:
            The created entity
        """
        if cls.repository is None:
            raise NotImplementedError("Subclass must set 'repository' class attribute")
        # Subclasses can override to add validation/business logic
        return cls.repository.create(db, data)
    
    @classmethod
    def update(cls, db: Session, id: int, data: Dict) -> Optional[T]:
        """
        Update an existing entity with business logic.
        
        Args:
            db: Database session
            id: Entity ID
            data: Dictionary containing updated data
            
        Returns:
            The updated entity if found, None otherwise
        """
        if cls.repository is None:
            raise NotImplementedError("Subclass must set 'repository' class attribute")
        # Subclasses can override to add validation/business logic
        return cls.repository.update(db, id, data)
    
    @classmethod
    def delete(cls, db: Session, id: int) -> bool:
        """
        Delete an entity by its ID.
        
        Args:
            db: Database session
            id: Entity ID
            
        Returns:
            True if deleted, False if not found
        """
        if cls.repository is None:
            raise NotImplementedError("Subclass must set 'repository' class attribute")
        return cls.repository.delete(db, id)
