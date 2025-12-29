"""AI-powered recipe recommendation service using machine learning."""
import os
import pickle
import json
from typing import List, Dict, Optional, Tuple
from pathlib import Path
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import numpy as np
from app.repositories.meal_repository import MealRepository
from app.repositories.recipe_rating_repository import RecipeRatingRepository

# Model storage path
MODEL_DIR = Path(__file__).parent.parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
MODEL_PATH = MODEL_DIR / "recipe_model.pkl"
VECTORIZER_PATH = MODEL_DIR / "recipe_vectorizer.pkl"
SCALER_PATH = MODEL_DIR / "recipe_scaler.pkl"
METADATA_PATH = MODEL_DIR / "recipe_metadata.json"


class AIRecipeService:
    """
    AI service for recipe recommendations based on ingredients.
    
    Uses TF-IDF vectorization to match ingredients to recipes and
    incorporates user ratings to improve recommendations.
    """
    
    def __init__(self):
        self.vectorizer = None
        self.scaler = None
        self.meal_data = []
        self.is_trained = False
    
    def train_model(self, db: Session) -> Dict:
        """
        Train the AI model from all recipes in the database.
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with training statistics
        """
        # Get all meals with ingredients
        all_meals = MealRepository.get_all(db, skip=0, limit=10000)
        
        # Filter meals that have ingredients
        meals_with_ingredients = [
            meal for meal in all_meals 
            if meal.ingredients and meal.ingredients.strip()
        ]
        
        if len(meals_with_ingredients) < 2:
            return {
                "success": False,
                "message": "Need at least 2 recipes with ingredients to train the model",
                "recipes_count": len(meals_with_ingredients)
            }
        
        # Prepare data
        self.meal_data = []
        ingredient_texts = []
        
        for meal in meals_with_ingredients:
            # Normalize ingredients (lowercase, strip)
            ingredients = [ing.strip().lower() for ing in meal.ingredients.split(',')]
            ingredient_text = ' '.join(ingredients)
            
            # Get average rating (default to 2.5 if no ratings)
            avg_rating = meal.average_rating if meal.average_rating > 0 else 2.5
            rating_count = meal.rating_count or 0
            
            self.meal_data.append({
                'meal_id': meal.id,
                'name': meal.name,
                'ingredients': ingredients,
                'ingredient_text': ingredient_text,
                'category': meal.category,
                'calories': meal.calories,
                'protein': meal.protein,
                'average_rating': avg_rating,
                'rating_count': rating_count,
                'meal': meal
            })
            ingredient_texts.append(ingredient_text)
        
        # Train TF-IDF vectorizer on ingredient texts
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            token_pattern=r'\b\w+\b',  # Word tokens
            max_features=500,  # Limit vocabulary size
            ngram_range=(1, 2)  # Unigrams and bigrams
        )
        
        # Fit and transform
        ingredient_vectors = self.vectorizer.fit_transform(ingredient_texts)
        
        # Create scaler for numerical features (calories, protein, rating)
        numerical_features = np.array([
            [meal['calories'], meal['protein'], meal['average_rating']]
            for meal in self.meal_data
        ])
        
        self.scaler = StandardScaler()
        self.scaler.fit(numerical_features)
        
        # Store vectors with meal data
        for i, meal in enumerate(self.meal_data):
            meal['vector'] = ingredient_vectors[i]
        
        # Save model
        self._save_model()
        
        self.is_trained = True
        
        return {
            "success": True,
            "message": "Model trained successfully",
            "recipes_count": len(meals_with_ingredients),
            "vocabulary_size": len(self.vectorizer.vocabulary_)
        }
    
    def find_recipes_by_ingredients(
        self,
        ingredients: List[str],
        limit: int = 10,
        min_ingredients_match: int = 1
    ) -> List[Dict]:
        """
        Find recipes that match the given ingredients.
        
        Args:
            ingredients: List of ingredient names
            limit: Maximum number of recipes to return
            min_ingredients_match: Minimum number of ingredients that must match
            
        Returns:
            List of matching recipes with similarity scores
        """
        if not self.is_trained or not self.vectorizer:
            # Try to load model
            if not self._load_model():
                return []
        
        if not ingredients:
            return []
        
        # Normalize input ingredients
        normalized_ingredients = [ing.strip().lower() for ing in ingredients]
        query_text = ' '.join(normalized_ingredients)
        
        # Vectorize query
        query_vector = self.vectorizer.transform([query_text])
        
        # Calculate similarity scores
        results = []
        for meal_data in self.meal_data:
            # Calculate cosine similarity
            similarity = cosine_similarity(query_vector, meal_data['vector'])[0][0]
            
            # Count how many ingredients match
            matched_ingredients = sum(
                1 for ing in normalized_ingredients
                if any(ing in stored_ing for stored_ing in meal_data['ingredients'])
            )
            
            # Skip if not enough matches
            if matched_ingredients < min_ingredients_match:
                continue
            
            # Calculate composite score
            # Base similarity (0-1) weighted by 0.6
            # Rating boost (0-1) weighted by 0.3
            # Match count boost weighted by 0.1
            rating_score = (meal_data['average_rating'] - 1) / 4.0  # Normalize 1-5 to 0-1
            match_boost = min(matched_ingredients / len(normalized_ingredients), 1.0)
            
            composite_score = (
                similarity * 0.6 +
                rating_score * 0.3 +
                match_boost * 0.1
            )
            
            results.append({
                'meal': meal_data['meal'],
                'similarity': float(similarity),
                'matched_ingredients': matched_ingredients,
                'total_ingredients': len(meal_data['ingredients']),
                'score': float(composite_score),
                'average_rating': meal_data['average_rating'],
                'rating_count': meal_data['rating_count']
            })
        
        # Sort by composite score (highest first)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return results[:limit]
    
    def _save_model(self):
        """Save the trained model to disk."""
        try:
            with open(MODEL_PATH, 'wb') as f:
                pickle.dump(self.meal_data, f)
            
            with open(VECTORIZER_PATH, 'wb') as f:
                pickle.dump(self.vectorizer, f)
            
            with open(SCALER_PATH, 'wb') as f:
                pickle.dump(self.scaler, f)
            
            metadata = {
                'is_trained': self.is_trained,
                'recipes_count': len(self.meal_data),
                'vocabulary_size': len(self.vectorizer.vocabulary_) if self.vectorizer else 0
            }
            
            with open(METADATA_PATH, 'w') as f:
                json.dump(metadata, f)
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def _load_model(self) -> bool:
        """Load the trained model from disk."""
        try:
            if not MODEL_PATH.exists():
                return False
            
            with open(MODEL_PATH, 'rb') as f:
                self.meal_data = pickle.load(f)
            
            with open(VECTORIZER_PATH, 'rb') as f:
                self.vectorizer = pickle.load(f)
            
            with open(SCALER_PATH, 'rb') as f:
                self.scaler = pickle.load(f)
            
            # Reconstruct vectors (they might not pickle well)
            ingredient_texts = [meal['ingredient_text'] for meal in self.meal_data]
            ingredient_vectors = self.vectorizer.transform(ingredient_texts)
            
            for i, meal in enumerate(self.meal_data):
                meal['vector'] = ingredient_vectors[i]
            
            self.is_trained = True
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def get_model_status(self) -> Dict:
        """Get the current status of the model."""
        if self._load_model():
            return {
                "is_trained": True,
                "recipes_count": len(self.meal_data),
                "vocabulary_size": len(self.vectorizer.vocabulary_) if self.vectorizer else 0
            }
        return {
            "is_trained": False,
            "recipes_count": 0,
            "vocabulary_size": 0
        }


# Global instance
_ai_service = None

def get_ai_service() -> AIRecipeService:
    """Get or create the global AI service instance."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIRecipeService()
        # Try to load existing model
        _ai_service._load_model()
    return _ai_service

