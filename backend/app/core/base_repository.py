"""
Concrete base repository class.

This module provides a concrete base implementation of the IRepository
interface that can be extended by specific repositories.
"""
from typing import Generic, TypeVar, List, Optional, Dict, Type
from sqlalchemy.orm import Session
from app.core.interfaces.base_repository import IRepository

# Type variable for the model type
T = TypeVar('T')


class BaseRepository(IRepository[T], Generic[T]):
    """
    Concrete base repository implementing common CRUD operations.
    
    This is Level 2 of the 3-level inheritance hierarchy:
    IRepository (Abstract) -> BaseRepository (Concrete Base) -> ConcreteRepository
    
    Subclasses should set the `model` class attribute to their model class.
    """
    
    # Subclasses must set this to their model class
    model: Type[T] = None
    
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
        if cls.model is None:
            raise NotImplementedError("Subclass must set 'model' class attribute")
        return db.query(cls.model).filter(cls.model.id == id).first()
    
    @classmethod
    def get_all(cls, db: Session, skip: int = 0, limit: int = 100) -> List[T]:
        """
        Retrieve all entities with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of entities
        """
        if cls.model is None:
            raise NotImplementedError("Subclass must set 'model' class attribute")
        return db.query(cls.model).offset(skip).limit(limit).all()
    
    @classmethod
    def create(cls, db: Session, data: Dict) -> T:
        """
        Create a new entity.
        
        Args:
            db: Database session
            data: Dictionary containing entity data
            
        Returns:
            The created entity
        """
        if cls.model is None:
            raise NotImplementedError("Subclass must set 'model' class attribute")
        entity = cls.model(**data)
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return entity
    
    @classmethod
    def update(cls, db: Session, id: int, data: Dict) -> Optional[T]:
        """
        Update an existing entity.
        
        Args:
            db: Database session
            id: Entity ID
            data: Dictionary containing updated data
            
        Returns:
            The updated entity if found, None otherwise
        """
        entity = cls.get_by_id(db, id)
        if entity:
            for key, value in data.items():
                setattr(entity, key, value)
            db.commit()
            db.refresh(entity)
        return entity
    
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
        entity = cls.get_by_id(db, id)
        if entity:
            db.delete(entity)
            db.commit()
            return True
        return False
    
    @classmethod
    def count(cls, db: Session) -> int:
        """
        Count all entities.
        
        Args:
            db: Database session
            
        Returns:
            Number of entities
        """
        if cls.model is None:
            raise NotImplementedError("Subclass must set 'model' class attribute")
        return db.query(cls.model).count()
