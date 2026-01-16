"""
Retrain ML model with full interactions data.
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import json
import csv
from collections import defaultdict
from typing import Dict, List
import logging

from app.repositories.database import SessionLocal
from app.models.meal import Meal
from train_ml_model import CollaborativeFilteringModel

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent.parent / "models"
DATA_DIR = Path(__file__).parent.parent.parent / "data"


def load_recipe_mappings():
    """Load recipe ID mappings."""
    mappings_file = MODELS_DIR / "recipe_id_mappings.json"
    if not mappings_file.exists():
        return {}
    
    with open(mappings_file, 'r') as f:
        return json.load(f)


def process_full_interactions(recipe_mappings: Dict, limit: int = 500000):
    """Process full interactions file."""
    logger.info("=" * 70)
    logger.info("Processing Full Interactions Dataset")
    logger.info("=" * 70)
    
    interactions_file = DATA_DIR / "RAW_interactions.csv"
    
    if not interactions_file.exists():
        logger.error(f"Interactions file not found: {interactions_file}")
        return []
    
    logger.info(f"Processing up to {limit:,} interactions...")
    
    interactions = []
    processed = 0
    mapped = 0
    
    db = SessionLocal()
    try:
        # Get all meal IDs in database for quick lookup
        meal_ids_in_db = {meal.id for meal in db.query(Meal.id).all()}
        logger.info(f"Meals in database: {len(meal_ids_in_db):,}")
    finally:
        db.close()
    
    with open(interactions_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            if idx >= limit:
                break
            
            recipe_id = row.get('recipe_id')
            user_id = row.get('user_id')
            rating = row.get('rating')
            
            # Map recipe_id to database meal_id
            meal_id = recipe_mappings.get(recipe_id)
            if not meal_id:
                # Try direct lookup in database meal IDs
                if recipe_id and recipe_id.isdigit():
                    meal_id = int(recipe_id) if int(recipe_id) in meal_ids_in_db else None
            
            if not meal_id:
                continue  # Skip if recipe not in database
            
            try:
                rating_val = float(rating) if rating else 0
                if rating_val < 1 or rating_val > 5:
                    continue
            except:
                continue
            
            interactions.append({
                'user_id': user_id,
                'recipe_id': recipe_id,
                'meal_id': meal_id,
                'rating': rating_val,
                'date': row.get('date', '')
            })
            
            mapped += 1
            
            if (idx + 1) % 50000 == 0:
                logger.info(f"Processed {idx + 1:,} interactions... (mapped: {mapped:,})")
            
            processed += 1
    
    logger.info(f"\n✅ Processed {processed:,} interactions")
    logger.info(f"✅ Successfully mapped {mapped:,} interactions")
    
    return interactions


def main():
    """Main function."""
    print("=" * 70)
    print("Retrain ML Model with Full Interactions Data")
    print("=" * 70)
    
    # Load recipe mappings
    recipe_mappings = load_recipe_mappings()
    logger.info(f"Loaded {len(recipe_mappings):,} recipe mappings")
    
    # Process full interactions
    interactions = process_full_interactions(recipe_mappings, limit=500000)
    
    if not interactions:
        logger.error("No interactions processed. Exiting.")
        return
    
    # Save interactions
    interactions_file = MODELS_DIR / "interactions_full.json"
    with open(interactions_file, 'w') as f:
        json.dump(interactions, f)
    logger.info(f"💾 Saved {len(interactions):,} interactions to: {interactions_file}")
    
    # Train model
    logger.info("\n" + "=" * 70)
    logger.info("Training ML Model")
    logger.info("=" * 70)
    
    model = CollaborativeFilteringModel()
    model.train(interactions_file)
    
    # Save model
    model_file = MODELS_DIR / "collaborative_filtering_model.pkl"
    model.save(model_file)
    
    logger.info("\n" + "=" * 70)
    logger.info("✅ Model Retraining Complete!")
    logger.info("=" * 70)
    logger.info(f"💾 Model saved to: {model_file}")
    logger.info(f"📊 Model statistics:")
    logger.info(f"  - Users in model: {len(model.user_ratings):,}")
    logger.info(f"  - Meals in model: {len(model.meal_ratings):,}")
    logger.info(f"  - Popularity scores: {len(model.meal_popularity):,}")
    logger.info("\n" + "=" * 70)


if __name__ == "__main__":
    main()





