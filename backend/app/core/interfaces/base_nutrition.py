"""
Abstract base class for nutrition calculator pattern.

This module defines the INutritionCalculator interface that all
nutrition calculation services must implement.
"""
from abc import ABC, abstractmethod
from typing import Dict


class INutritionCalculator(ABC):
    """
    Abstract base class defining the nutrition calculator interface.
    
    All nutrition services must implement these methods to ensure
    consistent nutrition calculation patterns across the application.
    """
    
    @staticmethod
    @abstractmethod
    def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
        """
        Calculate Basal Metabolic Rate (BMR).
        
        Args:
            weight: Weight in kg
            height: Height in cm
            age: Age in years
            gender: Gender string
            
        Returns:
            BMR in calories per day
        """
        pass
    
    @staticmethod
    @abstractmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        """
        Calculate Total Daily Energy Expenditure (TDEE).
        
        Args:
            bmr: Basal Metabolic Rate
            activity_level: Activity level string
            
        Returns:
            TDEE in calories per day
        """
        pass
    
    @staticmethod
    @abstractmethod
    def calculate_calorie_target(tdee: float, goal: str) -> float:
        """
        Calculate daily calorie target based on goal.
        
        Args:
            tdee: Total Daily Energy Expenditure
            goal: User's fitness goal
            
        Returns:
            Target calories per day
        """
        pass
    
    @staticmethod
    @abstractmethod
    def calculate_macro_targets(calories: float, goal: str) -> Dict[str, float]:
        """
        Calculate macro nutrient targets in grams.
        
        Args:
            calories: Target daily calories
            goal: User's fitness goal
            
        Returns:
            Dictionary with protein, carbohydrates, and fat targets in grams
        """
        pass
