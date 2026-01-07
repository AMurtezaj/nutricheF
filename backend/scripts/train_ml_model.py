"""
Train ML-based recommendation model using collaborative filtering.
"""

import os
import sys
import json
import pickle
from pathlib import Path
from typing import Dict, List, Tuple
import logging
from collections import defaultdict

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)


class CollaborativeFilteringModel:
    """
    Simple collaborative filtering recommendation model.
    Uses user-item interaction matrix with cosine similarity.
    """
    
    def __init__(self):
        self.user_ratings = defaultdict(dict)  # {user_id: {meal_id: rating}}
        self.meal_ratings = defaultdict(dict)  # {meal_id: {user_id: rating}}
        self.user_similarities = {}  # Cached user similarities
        self.meal_popularity = {}  # Meal popularity scores
        self.is_trained = False
    
    def load_interactions(self, interactions_file: Path):
        """Load interactions data."""
        logger.info(f"Loading interactions from: {interactions_file}")
        
        with open(interactions_file, 'r') as f:
            interactions = json.load(f)
        
        logger.info(f"Loaded {len(interactions):,} interactions")
        
        for interaction in interactions:
            user_id = str(interaction['user_id'])
            meal_id = interaction['meal_id']
            rating = float(interaction['rating'])
            
            self.user_ratings[user_id][meal_id] = rating
            self.meal_ratings[meal_id][user_id] = rating
        
        logger.info(f"Users: {len(self.user_ratings):,}")
        logger.info(f"Meals with ratings: {len(self.meal_ratings):,}")
        
        return len(interactions)
    
    def calculate_popularity_scores(self):
        """Calculate popularity scores for meals."""
        logger.info("Calculating meal popularity scores...")
        
        for meal_id, ratings in self.meal_ratings.items():
            if ratings:
                # Average rating weighted by number of ratings
                avg_rating = sum(ratings.values()) / len(ratings)
                num_ratings = len(ratings)
                # Popularity = average rating * log(number of ratings + 1)
                # This balances rating quality with popularity
                import math
                self.meal_popularity[meal_id] = avg_rating * math.log(num_ratings + 1)
        
        logger.info(f"Calculated popularity for {len(self.meal_popularity):,} meals")
    
    def cosine_similarity(self, user1_ratings: Dict, user2_ratings: Dict) -> float:
        """Calculate cosine similarity between two users."""
        # Get common meals
        common_meals = set(user1_ratings.keys()) & set(user2_ratings.keys())
        
        if not common_meals:
            return 0.0
        
        # Calculate dot product and magnitudes
        dot_product = sum(user1_ratings[meal] * user2_ratings[meal] for meal in common_meals)
        mag1 = sum(r ** 2 for r in user1_ratings.values()) ** 0.5
        mag2 = sum(r ** 2 for r in user2_ratings.values()) ** 0.5
        
        if mag1 == 0 or mag2 == 0:
            return 0.0
        
        return dot_product / (mag1 * mag2)
    
    def find_similar_users(self, user_id: str, k: int = 50) -> List[Tuple[str, float]]:
        """Find k most similar users to given user."""
        if user_id not in self.user_ratings:
            return []
        
        user_ratings = self.user_ratings[user_id]
        similarities = []
        
        for other_user_id, other_ratings in self.user_ratings.items():
            if other_user_id == user_id:
                continue
            
            similarity = self.cosine_similarity(user_ratings, other_ratings)
            if similarity > 0:
                similarities.append((other_user_id, similarity))
        
        # Sort by similarity and return top k
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:k]
    
    def predict_rating(self, user_id: str, meal_id: int) -> float:
        """
        Predict rating for a user-meal pair using collaborative filtering.
        Falls back to popularity if user has no history.
        """
        # If user has rated this meal, return that rating
        if user_id in self.user_ratings and meal_id in self.user_ratings[user_id]:
            return self.user_ratings[user_id][meal_id]
        
        # Find similar users
        similar_users = self.find_similar_users(user_id, k=20)
        
        if not similar_users:
            # No similar users, use popularity
            return self.meal_popularity.get(meal_id, 3.0)
        
        # Weighted average of similar users' ratings
        total_weight = 0.0
        weighted_sum = 0.0
        
        for similar_user_id, similarity in similar_users:
            if meal_id in self.user_ratings[similar_user_id]:
                rating = self.user_ratings[similar_user_id][meal_id]
                weighted_sum += rating * similarity
                total_weight += abs(similarity)
        
        if total_weight > 0:
            predicted = weighted_sum / total_weight
            # Ensure rating is in [1, 5] range
            return max(1.0, min(5.0, predicted))
        else:
            # Fall back to popularity
            return self.meal_popularity.get(meal_id, 3.0)
    
    def get_recommendations(self, user_id: str, all_meal_ids: List[int], 
                           limit: int = 10) -> List[Tuple[int, float]]:
        """
        Get top recommendations for a user.
        Returns list of (meal_id, predicted_rating) tuples.
        """
        # Get meals user hasn't rated
        user_rated = set(self.user_ratings.get(user_id, {}).keys())
        candidate_meals = [mid for mid in all_meal_ids if mid not in user_rated]
        
        if not candidate_meals:
            # User has rated everything, return popular items
            recommendations = [(mid, self.meal_popularity.get(mid, 3.0)) 
                             for mid in all_meal_ids]
            recommendations.sort(key=lambda x: x[1], reverse=True)
            return recommendations[:limit]
        
        # Predict ratings for candidate meals
        predictions = [(meal_id, self.predict_rating(user_id, meal_id)) 
                      for meal_id in candidate_meals]
        
        # Sort by predicted rating
        predictions.sort(key=lambda x: x[1], reverse=True)
        
        return predictions[:limit]
    
    def train(self, interactions_file: Path):
        """Train the model."""
        logger.info("=" * 70)
        logger.info("Training Collaborative Filtering Model")
        logger.info("=" * 70)
        
        # Load interactions
        self.load_interactions(interactions_file)
        
        # Calculate popularity
        self.calculate_popularity_scores()
        
        self.is_trained = True
        logger.info("✅ Model training complete!")
    
    def save(self, model_file: Path):
        """Save trained model."""
        logger.info(f"Saving model to: {model_file}")
        
        model_data = {
            'user_ratings': dict(self.user_ratings),
            'meal_ratings': dict(self.meal_ratings),
            'meal_popularity': self.meal_popularity,
            'is_trained': self.is_trained
        }
        
        with open(model_file, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info("✅ Model saved!")
    
    @classmethod
    def load(cls, model_file: Path):
        """Load trained model."""
        logger.info(f"Loading model from: {model_file}")
        
        with open(model_file, 'rb') as f:
            model_data = pickle.load(f)
        
        model = cls()
        model.user_ratings = defaultdict(dict, model_data['user_ratings'])
        model.meal_ratings = defaultdict(dict, model_data['meal_ratings'])
        model.meal_popularity = model_data['meal_popularity']
        model.is_trained = model_data['is_trained']
        
        # Convert nested dicts back to defaultdicts
        for user_id, ratings in model.user_ratings.items():
            model.user_ratings[user_id] = dict(ratings)
        for meal_id, ratings in model.meal_ratings.items():
            model.meal_ratings[meal_id] = dict(ratings)
        
        logger.info("✅ Model loaded!")
        return model


def main():
    """Main training function."""
    interactions_file = MODELS_DIR / "interactions_sample.json"
    
    if not interactions_file.exists():
        logger.error(f"Interactions file not found: {interactions_file}")
        logger.error("Run process_full_dataset.py first to generate interactions data.")
        return
    
    # Initialize and train model
    model = CollaborativeFilteringModel()
    model.train(interactions_file)
    
    # Save model
    model_file = MODELS_DIR / "collaborative_filtering_model.pkl"
    model.save(model_file)
    
    logger.info("\n" + "=" * 70)
    logger.info("✅ ML Model Training Complete!")
    logger.info("=" * 70)
    logger.info(f"💾 Model saved to: {model_file}")
    logger.info(f"📊 Model statistics:")
    logger.info(f"  - Users in model: {len(model.user_ratings):,}")
    logger.info(f"  - Meals in model: {len(model.meal_ratings):,}")
    logger.info(f"  - Popularity scores: {len(model.meal_popularity):,}")
    logger.info("\n" + "=" * 70)


if __name__ == "__main__":
    main()

