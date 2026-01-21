"""
Abstract base class for repository pattern.

This module defines the IRepository interface that all repositories
must implement, ensuring consistent data access patterns.
"""
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Dict
from sqlalchemy.orm import Session

# Type variable for the model type
T = TypeVar('T')


class IRepository(ABC, Generic[T]):
    """
    Abstract base class defining the repository interface.
    
    All repositories must implement these methods to ensure
    consistent data access patterns across the application.
    
    This is Level 1 of the 3-level inheritance hierarchy:
    IRepository (Abstract) -> BaseRepository (Concrete Base) -> ConcreteRepository
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
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[T]:
        """
        Retrieve all entities with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of entities
        """
        pass
    
    @staticmethod
    @abstractmethod
    def create(db: Session, data: Dict) -> T:
        """
        Create a new entity.
        
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
        Update an existing entity.
        
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
