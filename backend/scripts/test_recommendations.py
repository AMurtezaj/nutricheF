"""
Test script to verify ML recommendations are working.
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.repositories.database import SessionLocal
from app.services.ml_recommendation_service import MLRecommendationService
from app.models.user import User
from app.models.meal import Meal

def test_recommendations():
    """Test ML recommendations."""
    print("=" * 70)
    print("Testing ML Recommendations")
    print("=" * 70)
    
    db = SessionLocal()
    
    try:
        # Check database
        meal_count = db.query(Meal).count()
        user_count = db.query(User).count()
        print(f"\n📊 Database Status:")
        print(f"  - Total meals: {meal_count:,}")
        print(f"  - Total users: {user_count}")
        
        if user_count == 0:
            print("\n⚠️  No users found. Please create a user first.")
            return
        
        # Get first user
        user = db.query(User).first()
        print(f"\n👤 Testing with user: {user.username} (ID: {user.id})")
        
        # Test ML recommendations
        print("\n🔍 Testing ML recommendations...")
        recommendations = MLRecommendationService.get_recommendations(
            db, user.id, limit=10, use_ml=True
        )
        
        print(f"\n✅ Got {len(recommendations)} recommendations:")
        for i, rec in enumerate(recommendations[:5], 1):
            meal = rec["meal"]
            print(f"\n  {i}. {meal.name} (ID: {meal.id})")
            print(f"     Score: {rec['score']}")
            if rec.get('ml_score'):
                print(f"     ML Score: {rec['ml_score']}")
            print(f"     Content Score: {rec['content_score']}")
            print(f"     Category: {meal.category}")
            print(f"     Calories: {meal.calories:.0f}")
            print(f"     Reason: {rec['reason']}")
        
        # Test popular meals
        print("\n" + "-" * 70)
        print("🔍 Testing popular meals...")
        popular = MLRecommendationService.get_popular_meals(db, limit=5)
        
        print(f"\n✅ Got {len(popular)} popular meals:")
        for i, rec in enumerate(popular[:3], 1):
            meal = rec["meal"]
            print(f"\n  {i}. {meal.name}")
            print(f"     Popularity Score: {rec['score']}")
            print(f"     Reason: {rec['reason']}")
        
        print("\n" + "=" * 70)
        print("✅ All tests passed!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_recommendations()

