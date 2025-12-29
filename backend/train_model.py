"""Script to train the AI recipe model from the database."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.repositories.database import get_db, init_db
from app.services.ai_recipe_service import get_ai_service


def main():
    """Train the AI model from the database."""
    print("Initializing database...")
    init_db()
    
    print("Getting database session...")
    db = next(get_db())
    
    print("Training AI model...")
    ai_service = get_ai_service()
    result = ai_service.train_model(db)
    
    if result.get("success"):
        print(f"✅ Model trained successfully!")
        print(f"   - Recipes used: {result.get('recipes_count')}")
        print(f"   - Vocabulary size: {result.get('vocabulary_size')}")
        print(f"   - Model saved to: {ai_service.MODEL_PATH}")
    else:
        print(f"❌ Training failed: {result.get('message')}")
        print(f"   - Recipes found: {result.get('recipes_count')}")
        return 1
    
    db.close()
    return 0


if __name__ == "__main__":
    exit(main())

