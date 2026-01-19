"""
Abstract base class for service pattern.

This module defines the IService interface that all services
must implement, ensuring consistent business logic patterns.
"""
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, Dict
from sqlalchemy.orm import Session

# Type variable for the return type
T = TypeVar('T')


class IService(ABC, Generic[T]):
    """
    Abstract base class defining the service interface.
    
    All services must implement these methods to ensure
    consistent business logic patterns across the application.
    
    This is Level 1 of the 3-level inheritance hierarchy:
    IService (Abstract) -> BaseService (Concrete Base) -> ConcreteService
    """
    
    @staticmethod
    @abstractmethod
    def get_by_id(db: Session, id: int) -> Optional[T]:
        """
        Retrieve an entity by its ID.
        
        Args:
            db: Database session
            id: Entity ID
            
        Returns:
            The entity if found, None otherwise
        """
        pass
    
    @staticmethod
    @abstractmethod
    def create(db: Session, data: Dict) -> T:
        """
        Create a new entity with business logic.
        
        Args:
            db: Database session
            data: Dictionary containing entity data
            
        Returns:
            The created entity
        """
        pass
    
    @staticmethod
    @abstractmethod
    def update(db: Session, id: int, data: Dict) -> Optional[T]:
        """
        Update an existing entity with business logic.
        
        Args:
            db: Database session
            id: Entity ID
            data: Dictionary containing updated data
            
        Returns:
            The updated entity if found, None otherwise
        """
        pass
    
    @staticmethod
    @abstractmethod
    def delete(db: Session, id: int) -> bool:
        """
        Delete an entity by its ID.
        
        Args:
            db: Database session
            id: Entity ID
            
        Returns:
            True if deleted, False if not found
        """
        pass
