"""
Abstract base class for model serializer pattern.

This module defines the IModelSerializer interface for converting
between model objects and dictionary representations.
"""
from abc import ABC, abstractmethod
from typing import Dict, TypeVar, Generic

T = TypeVar('T')


class IModelSerializer(ABC, Generic[T]):
    """
    Abstract base class defining the model serializer interface.
    
    All serializers must implement these methods to ensure
    consistent serialization patterns across the application.
    """
    
    @abstractmethod
    def to_dict(self) -> Dict:
        """
        Convert the model to a dictionary representation.
        
        Returns:
            Dictionary representation of the model
        """
        pass
    
    @classmethod
    @abstractmethod
    def from_dict(cls, data: Dict) -> T:
        """
        Create a model instance from a dictionary.
        
        Args:
            data: Dictionary containing model data
            
        Returns:
            Model instance
        """
        pass
    
    @abstractmethod
    def validate(self) -> bool:
        """
        Validate the model data.
        
        Returns:
            True if valid, raises exception otherwise
        """
        pass
