"""
Factory pattern implementations for the Meal Recommendation System.

This module demonstrates the Factory Method design pattern by providing
factory classes that encapsulate object creation logic.
"""
from typing import List, Dict, Optional
from app.models.user import User
from app.models.meal import Meal
from app.models.preference import Preference
from app.dtos.user_dto import UserResponseDTO, UserDTO
from app.dtos.meal_dto import MealResponseDTO, MealRecommendationDTO
from app.dtos.preference_dto import PreferenceResponseDTO
from app.dtos.nutrition_dto import NutritionSummaryDTO, MacroTargetsDTO


class DTOFactory:
    """
    Factory class for creating Data Transfer Objects (DTOs) from database models.
    
    Design Pattern: Factory Method
    Purpose: Encapsulates the creation logic of DTOs, providing a centralized
             place for object creation and transformation logic.
    
    Benefits:
    - Single Responsibility: All DTO creation logic in one place
    - Easy to modify: Changes to DTO creation affect only this class
    - Testability: Easy to mock for testing
    """
    
    @staticmethod
    def create_user_response(user: User) -> UserResponseDTO:
        """
        Factory method for creating UserResponseDTO from User model.
        
        Args:
            user: User database model
            
        Returns:
            UserResponseDTO with all user data
        """
        return UserResponseDTO(
            id=user.id,
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            age=user.age,
            gender=user.gender,
            height=user.height,
            weight=user.weight,
            activity_level=user.activity_level,
            goal=user.goal,
            daily_calorie_target=user.daily_calorie_target,
            daily_protein_target=user.daily_protein_target,
            daily_carb_target=user.daily_carb_target,
            daily_fat_target=user.daily_fat_target,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    def create_user_list_response(users: List[User]) -> List[UserResponseDTO]:
        """
        Factory method for creating a list of UserResponseDTOs.
        
        Args:
            users: List of User database models
            
        Returns:
            List of UserResponseDTOs
        """
        return [DTOFactory.create_user_response(user) for user in users]
    
    @staticmethod
    def create_meal_response(meal: Meal) -> MealResponseDTO:
        """
        Factory method for creating MealResponseDTO from Meal model.
        
        Args:
            meal: Meal database model
            
        Returns:
            MealResponseDTO with all meal data
        """
        return MealResponseDTO(
            id=meal.id,
            name=meal.name,
            description=meal.description,
            category=meal.category,
            calories=meal.calories,
            protein=meal.protein,
            carbohydrates=meal.carbohydrates,
            fat=meal.fat,
            fiber=meal.fiber,
            sugar=meal.sugar,
            sodium=meal.sodium,
            serving_size=meal.serving_size,
            ingredients=meal.ingredients,
            created_by_user_id=meal.created_by_user_id,
            average_rating=meal.average_rating,
            rating_count=meal.rating_count,
            is_vegetarian=meal.is_vegetarian,
            is_vegan=meal.is_vegan,
            is_gluten_free=meal.is_gluten_free,
            is_dairy_free=meal.is_dairy_free,
            is_nut_free=meal.is_nut_free,
            is_halal=meal.is_halal,
            is_kosher=meal.is_kosher
        )
    
    @staticmethod
    def create_meal_list_response(meals: List[Meal]) -> List[MealResponseDTO]:
        """
        Factory method for creating a list of MealResponseDTOs.
        
        Args:
            meals: List of Meal database models
            
        Returns:
            List of MealResponseDTOs
        """
        return [DTOFactory.create_meal_response(meal) for meal in meals]
    
    @staticmethod
    def create_meal_recommendation(
        meal: Meal,
        score: float,
        reason: str,
        ml_score: Optional[float] = None,
        content_score: Optional[float] = None
    ) -> MealRecommendationDTO:
        """
        Factory method for creating MealRecommendationDTO.
        
        Args:
            meal: Meal database model
            score: Overall recommendation score
            reason: Explanation for recommendation
            ml_score: Optional ML-based score
            content_score: Optional content-based score
            
        Returns:
            MealRecommendationDTO with meal and recommendation data
        """
        meal_dto = DTOFactory.create_meal_response(meal)
        return MealRecommendationDTO(
            meal=meal_dto,
            score=score,
            ml_score=ml_score,
            content_score=content_score,
            reason=reason
        )
    
    @staticmethod
    def create_preference_response(preference: Preference) -> PreferenceResponseDTO:
        """
        Factory method for creating PreferenceResponseDTO from Preference model.
        
        Args:
            preference: Preference database model
            
        Returns:
            PreferenceResponseDTO with all preference data
        """
        return PreferenceResponseDTO(
            id=preference.id,
            user_id=preference.user_id,
            vegetarian=preference.vegetarian,
            vegan=preference.vegan,
            gluten_free=preference.gluten_free,
            dairy_free=preference.dairy_free,
            nut_free=preference.nut_free,
            halal=preference.halal,
            kosher=preference.kosher,
            preferred_cuisine=preference.preferred_cuisine,
            disliked_ingredients=preference.disliked_ingredients,
            favorite_ingredients=preference.favorite_ingredients,
            preferred_protein_ratio=preference.preferred_protein_ratio,
            preferred_carb_ratio=preference.preferred_carb_ratio,
            preferred_fat_ratio=preference.preferred_fat_ratio
        )
    
    @staticmethod
    def create_nutrition_summary(
        total_calories: float,
        total_protein: float,
        total_carbohydrates: float,
        total_fat: float,
        meal_count: int,
        targets: Dict[str, float],
        progress: Dict[str, float],
        remaining: Dict[str, float]
    ) -> NutritionSummaryDTO:
        """
        Factory method for creating NutritionSummaryDTO.
        
        Args:
            total_calories: Total calories consumed
            total_protein: Total protein consumed
            total_carbohydrates: Total carbs consumed
            total_fat: Total fat consumed
            meal_count: Number of meals
            targets: Daily targets
            progress: Progress percentages
            remaining: Remaining amounts
            
        Returns:
            NutritionSummaryDTO with nutrition summary
        """
        from app.dtos.nutrition_dto import (
            NutritionTargetsDTO,
            NutritionProgressDTO,
            NutritionRemainingDTO
        )
        
        return NutritionSummaryDTO(
            total_calories=total_calories,
            total_protein=total_protein,
            total_carbohydrates=total_carbohydrates,
            total_fat=total_fat,
            meal_count=meal_count,
            targets=NutritionTargetsDTO(**targets),
            progress=NutritionProgressDTO(**progress),
            remaining=NutritionRemainingDTO(**remaining)
        )


# Export factory
__all__ = ["DTOFactory"]
