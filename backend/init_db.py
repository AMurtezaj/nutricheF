"""Script to initialize the database with sample data."""
from app.repositories.database import SessionLocal, init_db
from app.models import User, Meal, Preference
from app.repositories.user_repository import UserRepository
from app.repositories.meal_repository import MealRepository
from app.repositories.preference_repository import PreferenceRepository
from app.services.user_service import UserService


def create_sample_data():
    """Create sample users, meals, and preferences."""
    db = SessionLocal()
    
    try:
        # Initialize database tables
        init_db()
        print("Database tables created successfully!")
        
        # Sample meals
        sample_meals = [
            {
                "name": "Grilled Chicken Breast",
                "description": "Lean grilled chicken breast with herbs",
                "category": "dinner",
                "calories": 231,
                "protein": 43.5,
                "carbohydrates": 0,
                "fat": 5.0,
                "fiber": 0,
                "sugar": 0,
                "sodium": 78,
                "serving_size": "100g",
                "is_vegetarian": False,
                "is_vegan": False,
                "is_gluten_free": True,
                "is_dairy_free": True,
                "is_halal": True,
            },
            {
                "name": "Greek Salad",
                "description": "Fresh vegetables with feta cheese and olives",
                "category": "lunch",
                "calories": 320,
                "protein": 12.0,
                "carbohydrates": 25.0,
                "fat": 22.0,
                "fiber": 6.0,
                "sugar": 8.0,
                "sodium": 850,
                "serving_size": "1 serving",
                "is_vegetarian": True,
                "is_vegan": False,
                "is_gluten_free": True,
                "is_dairy_free": False,
            },
            {
                "name": "Oatmeal with Berries",
                "description": "Steel-cut oats with mixed berries and honey",
                "category": "breakfast",
                "calories": 350,
                "protein": 12.0,
                "carbohydrates": 58.0,
                "fat": 8.0,
                "fiber": 8.0,
                "sugar": 25.0,
                "sodium": 5,
                "serving_size": "1 bowl",
                "is_vegetarian": True,
                "is_vegan": True,
                "is_gluten_free": True,
                "is_dairy_free": True,
            },
            {
                "name": "Salmon Fillet with Quinoa",
                "description": "Baked salmon with quinoa and steamed vegetables",
                "category": "dinner",
                "calories": 485,
                "protein": 38.0,
                "carbohydrates": 42.0,
                "fat": 18.0,
                "fiber": 5.0,
                "sugar": 3.0,
                "sodium": 320,
                "serving_size": "1 serving",
                "is_vegetarian": False,
                "is_vegan": False,
                "is_gluten_free": True,
                "is_dairy_free": True,
            },
            {
                "name": "Veggie Wrap",
                "description": "Whole wheat wrap with hummus and fresh vegetables",
                "category": "lunch",
                "calories": 290,
                "protein": 10.0,
                "carbohydrates": 45.0,
                "fat": 9.0,
                "fiber": 8.0,
                "sugar": 6.0,
                "sodium": 520,
                "serving_size": "1 wrap",
                "is_vegetarian": True,
                "is_vegan": True,
                "is_gluten_free": False,
                "is_dairy_free": True,
            },
        ]
        
        print("\nAdding sample meals...")
        existing_meals = MealRepository.get_all(db, skip=0, limit=1)
        if len(existing_meals) == 0:
            for meal_data in sample_meals:
                MealRepository.create(db, meal_data)
                print(f"  ✓ Added: {meal_data['name']}")
        else:
            print("  Sample meals already exist, skipping...")
        
        print("\nSample data creation completed!")
        print("\nTo use the application:")
        print("1. Create a user through the API or frontend")
        print("2. Set up user preferences")
        print("3. Start getting personalized recommendations!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()

