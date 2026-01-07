"""
Complete dataset processing pipeline.
Processes recipes and interactions data for ML training.
"""

import os
import sys
import csv
import ast
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
from collections import Counter
from datetime import datetime

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.repositories.database import SessionLocal, engine
from app.models.meal import Meal
from app.models.base import Base

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent.parent / "data"
MODELS_DIR = Path(__file__).parent.parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)


class FullDatasetProcessor:
    """Processes the complete Food.com dataset for ML training."""
    
    def __init__(self, db: Session):
        self.db = db
        self.recipes_data = []
        self.interactions_data = []
        self.recipe_id_mapping = {}  # Kaggle recipe_id -> database meal_id
        self.stats = {
            'recipes_processed': 0,
            'recipes_imported': 0,
            'recipes_skipped': 0,
            'interactions_processed': 0,
            'errors': 0
        }
    
    def analyze_data_quality(self):
        """Analyze data quality and provide statistics."""
        logger.info("=" * 70)
        logger.info("Data Quality Analysis")
        logger.info("=" * 70)
        
        recipes_file = DATA_DIR / "RAW_recipes.csv"
        interactions_file = DATA_DIR / "RAW_interactions.csv"
        
        # Analyze recipes
        logger.info("\n📊 Analyzing RAW_recipes.csv...")
        total_recipes = 0
        valid_nutrition = 0
        missing_nutrition = 0
        categories = Counter()
        
        with open(recipes_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader):
                total_recipes += 1
                if idx < 1000:  # Sample first 1000 for quick analysis
                    try:
                        nutrition = ast.literal_eval(row.get('nutrition', '[]'))
                        if len(nutrition) >= 7 and nutrition[0] > 0:
                            valid_nutrition += 1
                        else:
                            missing_nutrition += 1
                        
                        # Sample category inference
                        tags_str = row.get('tags', '[]')
                        tags = ast.literal_eval(tags_str) if isinstance(tags_str, str) else tags_str
                        tags_lower = [str(t).lower() for t in tags]
                        if any('breakfast' in t for t in tags_lower):
                            categories['breakfast'] += 1
                        elif any('lunch' in t for t in tags_lower):
                            categories['lunch'] += 1
                        else:
                            categories['dinner'] += 1
                    except:
                        pass
        
        logger.info(f"Total recipes: {total_recipes:,}")
        logger.info(f"Valid nutrition (sample): {valid_nutrition}")
        logger.info(f"Missing nutrition (sample): {missing_nutrition}")
        logger.info(f"Category distribution (sample): {dict(categories)}")
        
        # Analyze interactions
        logger.info("\n📊 Analyzing RAW_interactions.csv...")
        total_interactions = 0
        unique_users = set()
        unique_recipes = set()
        ratings = Counter()
        
        with open(interactions_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader):
                total_interactions += 1
                if idx < 10000:  # Sample first 10K for quick analysis
                    unique_users.add(row.get('user_id'))
                    unique_recipes.add(row.get('recipe_id'))
                    rating = row.get('rating')
                    if rating:
                        ratings[rating] += 1
        
        logger.info(f"Total interactions: {total_interactions:,}")
        logger.info(f"Unique users (sample): {len(unique_users):,}")
        logger.info(f"Unique recipes (sample): {len(unique_recipes):,}")
        logger.info(f"Rating distribution (sample): {dict(ratings)}")
        
        logger.info("\n" + "=" * 70)
        return {
            'total_recipes': total_recipes,
            'total_interactions': total_interactions
        }
    
    def process_recipes(self, limit: Optional[int] = None, batch_size: int = 1000):
        """Process and import recipes to database."""
        logger.info("=" * 70)
        logger.info("Processing Recipes")
        logger.info("=" * 70)
        
        recipes_file = DATA_DIR / "RAW_recipes.csv"
        
        if not recipes_file.exists():
            raise FileNotFoundError(f"Recipes file not found: {recipes_file}")
        
        logger.info(f"Reading from: {recipes_file}")
        logger.info(f"Limit: {limit or 'ALL'} recipes")
        logger.info(f"Batch size: {batch_size}")
        
        batch = []
        
        with open(recipes_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for idx, row in enumerate(reader):
                if limit and idx >= limit:
                    break
                
                try:
                    # Parse nutrition
                    nutrition_str = row.get('nutrition', '[]')
                    try:
                        nutrition = ast.literal_eval(nutrition_str)
                    except:
                        self.stats['errors'] += 1
                        continue
                    
                    if len(nutrition) < 7:
                        self.stats['recipes_skipped'] += 1
                        continue
                    
                    calories, total_fat, sugar, sodium, protein, saturated_fat, carbs = nutrition
                    
                    # Skip invalid nutrition data
                    if calories <= 0 or calories > 5000:
                        self.stats['recipes_skipped'] += 1
                        continue
                    
                    # Parse tags and ingredients
                    tags_str = row.get('tags', '[]')
                    ingredients_str = row.get('ingredients', '[]')
                    
                    try:
                        tags = ast.literal_eval(tags_str) if isinstance(tags_str, str) else tags_str
                        tags_lower = [str(t).lower() for t in tags]
                    except:
                        tags_lower = []
                    
                    try:
                        ingredients = ast.literal_eval(ingredients_str) if isinstance(ingredients_str, str) else ingredients_str
                        ingredients_lower = ' '.join([str(ing).lower() for ing in ingredients])
                    except:
                        ingredients_lower = ''
                    
                    # Infer dietary restrictions
                    has_meat = any(word in ingredients_lower for word in [
                        'meat', 'chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb', 'bacon', 'sausage'
                    ])
                    is_vegetarian = any('vegetarian' in tag for tag in tags_lower) or not has_meat
                    is_vegan = any('vegan' in tag for tag in tags_lower) and \
                              not any(word in ingredients_lower for word in ['milk', 'cheese', 'butter', 'egg', 'yogurt', 'cream'])
                    is_gluten_free = any('gluten-free' in tag for tag in tags_lower) or \
                                    not any(word in ingredients_lower for word in ['wheat', 'flour', 'bread', 'pasta', 'gluten'])
                    is_dairy_free = not any(word in ingredients_lower for word in ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'dairy'])
                    is_nut_free = not any(word in ingredients_lower for word in ['peanut', 'almond', 'walnut', 'cashew', 'nut'])
                    
                    # Infer category
                    name_lower = row.get('name', '').lower()
                    category = self._infer_category(name_lower, tags_lower)
                    
                    # Get description
                    description = row.get('description', '')
                    if not description and ingredients:
                        description = f"Made with {', '.join(str(ing) for ing in ingredients[:3])}..."
                    description = description[:500]  # Limit length
                    
                    # Prep time
                    minutes = row.get('minutes', '0')
                    try:
                        prep_time = int(minutes)
                        serving_size = f"1 serving ({prep_time} min prep)"
                    except:
                        serving_size = "1 serving"
                    
                    # Check if meal already exists
                    existing = self.db.query(Meal).filter(Meal.name == row.get('name')).first()
                    if existing:
                        self.recipe_id_mapping[row.get('id')] = existing.id
                        self.stats['recipes_skipped'] += 1
                        continue
                    
                    # Create meal
                    meal_data = {
                        'name': row.get('name', 'Unknown Recipe'),
                        'description': description,
                        'category': category,
                        'calories': float(calories),
                        'protein': float(protein),
                        'carbohydrates': float(carbs),
                        'fat': float(total_fat),
                        'fiber': 0.0,  # Food.com doesn't provide fiber
                        'sugar': float(sugar),
                        'sodium': float(sodium),
                        'serving_size': serving_size,
                        'is_vegetarian': is_vegetarian,
                        'is_vegan': is_vegan,
                        'is_gluten_free': is_gluten_free,
                        'is_dairy_free': is_dairy_free,
                        'is_nut_free': is_nut_free,
                        'is_halal': False,
                        'is_kosher': False,
                    }
                    
                    meal = Meal(**meal_data)
                    batch.append((meal, row.get('id')))
                    
                    self.stats['recipes_processed'] += 1
                    
                    # Commit in batches
                    if len(batch) >= batch_size:
                        self._commit_batch(batch)
                        batch = []
                        
                        if (idx + 1) % 10000 == 0:
                            logger.info(f"Processed {idx + 1:,} recipes... (imported: {self.stats['recipes_imported']:,})")
                    
                except Exception as e:
                    logger.error(f"Error processing recipe {idx}: {e}")
                    self.stats['errors'] += 1
                    continue
        
        # Commit remaining batch
        if batch:
            self._commit_batch(batch)
        
        logger.info("\n" + "=" * 70)
        logger.info("Recipes Processing Complete!")
        logger.info("=" * 70)
        logger.info(f"✅ Processed: {self.stats['recipes_processed']:,}")
        logger.info(f"✅ Imported: {self.stats['recipes_imported']:,}")
        logger.info(f"⏭️  Skipped: {self.stats['recipes_skipped']:,}")
        logger.info(f"❌ Errors: {self.stats['errors']}")
        logger.info(f"📊 Recipe ID mappings: {len(self.recipe_id_mapping):,}")
    
    def _commit_batch(self, batch: List[Tuple]):
        """Commit a batch of meals and create ID mappings."""
        try:
            for meal, kaggle_id in batch:
                self.db.add(meal)
            
            self.db.flush()  # Get IDs without committing
            
            # Create ID mappings
            for (meal, kaggle_id) in batch:
                self.recipe_id_mapping[kaggle_id] = meal.id
            
            self.db.commit()
            self.stats['recipes_imported'] += len(batch)
            
        except Exception as e:
            logger.error(f"Error committing batch: {e}")
            self.db.rollback()
            raise
    
    def _infer_category(self, name: str, tags: List[str]) -> str:
        """Infer meal category from name and tags."""
        name_lower = name.lower()
        tags_lower = ' '.join(tags).lower() if tags else ''
        combined = f"{name_lower} {tags_lower}"
        
        if any(word in combined for word in ['breakfast', 'cereal', 'pancake', 'waffle', 'toast', 'muffin']):
            return 'breakfast'
        elif any(word in combined for word in ['lunch', 'sandwich', 'salad', 'soup', 'wrap']):
            return 'lunch'
        elif any(word in combined for word in ['snack', 'chip', 'cracker', 'bar', 'cookie']):
            return 'snack'
        else:
            return 'dinner'
    
    def save_recipe_mappings(self):
        """Save recipe ID mappings for later use."""
        mappings_file = MODELS_DIR / "recipe_id_mappings.json"
        with open(mappings_file, 'w') as f:
            json.dump(self.recipe_id_mapping, f)
        logger.info(f"💾 Saved recipe ID mappings to: {mappings_file}")
    
    def process_interactions_sample(self, limit: int = 100000):
        """Process a sample of interactions for analysis."""
        logger.info("=" * 70)
        logger.info("Processing Interactions Sample")
        logger.info("=" * 70)
        
        interactions_file = DATA_DIR / "RAW_interactions.csv"
        
        if not interactions_file.exists():
            logger.warning("Interactions file not found. Skipping...")
            return
        
        logger.info(f"Processing sample of {limit:,} interactions...")
        
        interactions = []
        unique_users = set()
        unique_recipes = set()
        
        with open(interactions_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader):
                if idx >= limit:
                    break
                
                recipe_id = row.get('recipe_id')
                user_id = row.get('user_id')
                rating = row.get('rating')
                
                # Map recipe_id to database meal_id
                meal_id = self.recipe_id_mapping.get(recipe_id)
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
                
                unique_users.add(user_id)
                unique_recipes.add(recipe_id)
                
                if (idx + 1) % 10000 == 0:
                    logger.info(f"Processed {idx + 1:,} interactions...")
        
        # Save interactions for ML training
        interactions_file_out = MODELS_DIR / "interactions_sample.json"
        with open(interactions_file_out, 'w') as f:
            json.dump(interactions, f)
        
        logger.info(f"\n✅ Processed {len(interactions):,} interactions")
        logger.info(f"👥 Unique users: {len(unique_users):,}")
        logger.info(f"🍽️  Unique recipes: {len(unique_recipes):,}")
        logger.info(f"💾 Saved to: {interactions_file_out}")
        
        self.interactions_data = interactions


def main():
    """Main processing pipeline."""
    print("=" * 70)
    print("Food.com Dataset - Complete Processing Pipeline")
    print("=" * 70)
    
    db = SessionLocal()
    processor = FullDatasetProcessor(db)
    
    try:
        # Step 1: Analyze data quality
        processor.analyze_data_quality()
        
        # Step 2: Process recipes
        print("\n" + "=" * 70)
        print("Starting recipe processing...")
        print("=" * 70)
        
        # Ask for limit (or process all)
        import sys
        if len(sys.argv) > 1:
            limit = int(sys.argv[1])
        else:
            limit = None  # Process all
        
        processor.process_recipes(limit=limit, batch_size=1000)
        
        # Step 3: Save mappings
        processor.save_recipe_mappings()
        
        # Step 4: Process interactions sample
        processor.process_interactions_sample(limit=100000)
        
        print("\n" + "=" * 70)
        print("✅ Complete Processing Pipeline Finished!")
        print("=" * 70)
        print(f"\n📊 Final Statistics:")
        print(f"  - Recipes imported: {processor.stats['recipes_imported']:,}")
        print(f"  - Recipe mappings: {len(processor.recipe_id_mapping):,}")
        print(f"  - Interactions processed: {len(processor.interactions_data):,}")
        print(f"\n💾 Output files:")
        print(f"  - Recipe mappings: models/recipe_id_mappings.json")
        print(f"  - Interactions: models/interactions_sample.json")
        print("\n" + "=" * 70)
        
    except Exception as e:
        logger.error(f"Error in processing pipeline: {e}", exc_info=True)
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

