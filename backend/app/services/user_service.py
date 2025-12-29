"""Service for user-related business logic."""
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.preference_repository import PreferenceRepository
from app.services.nutrition_service import NutritionService


class UserService:
    """Service for user-related operations."""
    
    @staticmethod
    def create_user(db: Session, user_data: Dict) -> Dict:
        """
        Create a new user and calculate their nutritional targets.
        
        Args:
            db: Database session
            user_data: User data dictionary
        
        Returns:
            Created user object
        """
        # Calculate nutritional targets if health data is provided
        if all([user_data.get("weight"), user_data.get("height"), 
                user_data.get("age"), user_data.get("gender")]):
            bmr = NutritionService.calculate_bmr(
                user_data["weight"],
                user_data["height"],
                user_data["age"],
                user_data["gender"]
            )
            
            activity_level = user_data.get("activity_level", "sedentary")
            tdee = NutritionService.calculate_tdee(bmr, activity_level)
            
            goal = user_data.get("goal", "maintenance")
            calorie_target = NutritionService.calculate_calorie_target(tdee, goal)
            
            macro_targets = NutritionService.calculate_macro_targets(calorie_target, goal)
            
            user_data["daily_calorie_target"] = calorie_target
            user_data["daily_protein_target"] = macro_targets["protein"]
            user_data["daily_carb_target"] = macro_targets["carbohydrates"]
            user_data["daily_fat_target"] = macro_targets["fat"]
        
        user = UserRepository.create(db, user_data)
        return user
    
    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[Dict]:
        """Get user by ID."""
        user = UserRepository.get_by_id(db, user_id)
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: Dict) -> Optional[Dict]:
        """Update user information and recalculate targets if health data changed."""
        # Check if health-related fields changed
        health_fields = ["weight", "height", "age", "gender", "activity_level", "goal"]
        if any(field in user_data for field in health_fields):
            user = UserRepository.get_by_id(db, user_id)
            if user:
                # Use updated or existing values
                weight = user_data.get("weight", user.weight)
                height = user_data.get("height", user.height)
                age = user_data.get("age", user.age)
                gender = user_data.get("gender", user.gender)
                activity_level = user_data.get("activity_level", user.activity_level)
                goal = user_data.get("goal", user.goal)
                
                if all([weight, height, age, gender]):
                    bmr = NutritionService.calculate_bmr(weight, height, age, gender)
                    tdee = NutritionService.calculate_tdee(bmr, activity_level or "sedentary")
                    calorie_target = NutritionService.calculate_calorie_target(
                        tdee, goal or "maintenance"
                    )
                    macro_targets = NutritionService.calculate_macro_targets(
                        calorie_target, goal or "maintenance"
                    )
                    
                    user_data["daily_calorie_target"] = calorie_target
                    user_data["daily_protein_target"] = macro_targets["protein"]
                    user_data["daily_carb_target"] = macro_targets["carbohydrates"]
                    user_data["daily_fat_target"] = macro_targets["fat"]
        
        return UserRepository.update(db, user_id, user_data)
    
    @staticmethod
    def update_user_preferences(db: Session, user_id: int, preference_data: Dict) -> Dict:
        """Update or create user preferences."""
        preference = PreferenceRepository.create_or_update(db, user_id, preference_data)
        return preference

    @staticmethod
    def get_user_preferences(db: Session, user_id: int) -> Optional[Dict]:
        """Get user preferences for a given user. Create default if none exist."""
        from app.repositories.user_repository import UserRepository  # Local import to avoid circular

        # Ensure user exists
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None

        preference = PreferenceRepository.get_by_user_id(db, user_id)
        if not preference:
            # Create a default preference record so frontend always gets a consistent object
            preference = PreferenceRepository.create(db, {"user_id": user_id})
        return preference


