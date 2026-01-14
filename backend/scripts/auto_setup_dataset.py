"""
Automated non-interactive script to process Food.com dataset.
Works with manually downloaded files or creates sample data for testing.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.repositories.database import SessionLocal
from prepare_training_data import DataPreparer

def find_raw_recipes_file(data_dir: Path):
    """Find RAW_recipes.csv file."""
    # Check directly
    file_path = data_dir / "RAW_recipes.csv"
    if file_path.exists():
        return file_path
    
    # Check subdirectories
    for item in data_dir.iterdir():
        if item.is_dir():
            file_path = item / "RAW_recipes.csv"
            if file_path.exists():
                return file_path
    
    return None

def process_dataset(recipes_file: Path, limit: int = 5000):
    """Process and import dataset."""
    print(f"🔄 Processing: {recipes_file}")
    print(f"📊 Limit: {limit} recipes (to start, you can process more later)")
    
    preparer = DataPreparer()
    db = SessionLocal()
    
    try:
        print("⏳ Processing recipes...")
        meals = preparer.process_foodcom_dataset(str(recipes_file), limit=limit)
        
        if not meals:
            print("❌ No meals processed")
            return False
        
        print(f"✅ Processed {len(meals)} meals")
        
        print("💾 Importing to database...")
        imported, skipped = preparer.import_to_database(meals, db)
        
        print(f"\n✅ Imported {imported} meals")
        if skipped > 0:
            print(f"⏭️  Skipped {skipped} duplicates")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

def create_sample_for_testing(data_dir: Path, db: SessionLocal):
    """Create sample data if no dataset is available."""
    print("\n📝 Creating sample dataset for testing...")
    preparer = DataPreparer()
    db = SessionLocal()
    
    try:
        meals = preparer.create_sample_data(count=100)
        imported, skipped = preparer.import_to_database(meals, db)
        print(f"✅ Created {imported} sample meals for testing")
        return True
    except Exception as e:
        print(f"❌ Error creating sample: {e}")
        return False
    finally:
        db.close()

def main():
    """Main automated workflow."""
    print("="*70)
    print("Food.com Dataset - Automated Setup")
    print("="*70)
    
    data_dir = Path(__file__).parent.parent.parent / "data"
    data_dir.mkdir(exist_ok=True)
    
    # Try to find existing dataset
    recipes_file = find_raw_recipes_file(data_dir)
    
    if recipes_file:
        print(f"\n✅ Found dataset: {recipes_file}")
        # Process first 5000 recipes for initial setup
        if process_dataset(recipes_file, limit=5000):
            print("\n" + "="*70)
            print("✅ Setup Complete!")
            print("="*70)
            print("\n💡 To process more recipes, run:")
            print("   python backend/scripts/prepare_training_data.py")
            print("   (Choose option 3 and specify a higher limit)")
            return True
    else:
        print("\n⚠️  Dataset not found in data/ folder")
        print("\n📥 To download the Food.com dataset:")
        print("1. Go to: https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions")
        print("2. Click 'Download' (free Kaggle account required)")
        print("3. Extract ZIP to: data/")
        print("4. Run this script again")
        print("\n" + "-"*70)
        print("\n🔄 Creating sample data for testing instead...")
        
        db = SessionLocal()
        if create_sample_for_testing(data_dir, db):
            print("\n✅ Sample data created! You can test the system now.")
            print("💡 For production, download the full Food.com dataset.")
            return True
    
    return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)





