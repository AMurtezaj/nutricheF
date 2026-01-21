"""Custom exception classes for the Meal Recommendation System."""


class MealRecommendationException(Exception):
    """Base exception for meal recommendation system."""
    
    def __init__(self, message: str, details: dict = None):
        """
        Initialize the exception.
        
        Args:
            message: Error message
            details: Optional dictionary with additional error details
        """
        super().__init__(message)
        self.message = message
        self.details = details or {}
    
    def __str__(self):
        if self.details:
            return f"{self.message} | Details: {self.details}"
        return self.message


class UserNotFoundException(MealRecommendationException):
    """Exception raised when a user is not found in the database."""
    
    def __init__(self, user_id: int = None, email: str = None, username: str = None):
        """
        Initialize user not found exception.
        
        Args:
            user_id: User ID that was not found
            email: Email that was not found
            username: Username that was not found
        """
        if user_id:
            message = f"User with ID {user_id} not found"
            details = {"user_id": user_id}
        elif email:
            message = f"User with email '{email}' not found"
            details = {"email": email}
        elif username:
            message = f"User with username '{username}' not found"
            details = {"username": username}
        else:
            message = "User not found"
            details = {}
        
        super().__init__(message, details)
        self.user_id = user_id
        self.email = email
        self.username = username


class MealNotFoundException(MealRecommendationException):
    """Exception raised when a meal is not found in the database."""
    
    def __init__(self, meal_id: int = None, meal_name: str = None):
        """
        Initialize meal not found exception.
        
        Args:
            meal_id: Meal ID that was not found
            meal_name: Meal name that was not found
        """
        if meal_id:
            message = f"Meal with ID {meal_id} not found"
            details = {"meal_id": meal_id}
        elif meal_name:
            message = f"Meal '{meal_name}' not found"
            details = {"meal_name": meal_name}
        else:
            message = "Meal not found"
            details = {}
        
        super().__init__(message, details)
        self.meal_id = meal_id
        self.meal_name = meal_name


class InvalidNutritionDataException(MealRecommendationException):
    """Exception raised when nutrition data is invalid."""
    
    def __init__(self, message: str, nutrition_data: dict = None):
        """
        Initialize invalid nutrition data exception.
        
        Args:
            message: Error message describing the validation failure
            nutrition_data: The invalid nutrition data
        """
        super().__init__(message, {"nutrition_data": nutrition_data} if nutrition_data else {})
        self.nutrition_data = nutrition_data


class RatingValidationException(MealRecommendationException):
    """Exception raised when rating validation fails."""
    
    def __init__(self, rating: float, message: str = None):
        """
        Initialize rating validation exception.
        
        Args:
            rating: The invalid rating value
            message: Custom error message
        """
        if message is None:
            message = f"Rating must be between 1 and 5, got {rating}"
        
        super().__init__(message, {"rating": rating, "valid_range": {"min": 1, "max": 5}})
        self.rating = rating


class ModelTrainingException(MealRecommendationException):
    """Exception raised when ML model training fails."""
    
    def __init__(self, message: str, model_type: str = None, error_details: dict = None):
        """
        Initialize model training exception.
        
        Args:
            message: Error message describing the training failure
            model_type: Type of model that failed to train (e.g., 'collaborative_filtering', 'ai_recipe')
            error_details: Additional error details
        """
        details = {}
        if model_type:
            details["model_type"] = model_type
        if error_details:
            details.update(error_details)
        
        super().__init__(message, details)
        self.model_type = model_type


class DatabaseException(MealRecommendationException):
    """Exception raised when database operations fail."""
    
    def __init__(self, message: str, operation: str = None, table: str = None):
        """
        Initialize database exception.
        
        Args:
            message: Error message describing the database failure
            operation: The database operation that failed (e.g., 'create', 'update', 'delete')
            table: The database table involved
        """
        details = {}
        if operation:
            details["operation"] = operation
        if table:
            details["table"] = table
        
        super().__init__(message, details)
        self.operation = operation
        self.table = table


class PreferenceException(MealRecommendationException):
    """Exception raised when preference operations fail."""
    
    def __init__(self, message: str, user_id: int = None):
        """
        Initialize preference exception.
        
        Args:
            message: Error message describing the preference error
            user_id: User ID related to the preference error
        """
        details = {"user_id": user_id} if user_id else {}
        super().__init__(message, details)
        self.user_id = user_id
