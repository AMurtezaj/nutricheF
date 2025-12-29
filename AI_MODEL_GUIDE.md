# AI Recipe Model Guide

This guide explains how the AI recipe recommendation system works and how to train it.

## Overview

The AI model uses **TF-IDF (Term Frequency-Inverse Document Frequency)** vectorization to match user-selected ingredients with recipes in the database. It learns from:
- Recipe ingredients
- User ratings
- Recipe popularity

## How It Works

1. **Ingredient Matching**: When users select ingredients, the model searches for recipes containing those ingredients
2. **Similarity Scoring**: Uses cosine similarity to find the best matches
3. **Rating Integration**: Recipes with higher ratings get boosted in recommendations
4. **Continuous Learning**: The model retrains when new recipes are added or ratings are updated

## Training the Model

### Method 1: Via API Endpoint

```bash
# Train the model using the API
curl -X POST http://localhost:8000/api/ai-recipes/train
```

### Method 2: Using Python Script

```bash
cd backend
python train_model.py
```

### Method 3: Automatic Training

The model automatically retrains when:
- A new recipe is created via `/api/ai-recipes/create`
- A recipe is rated via `/api/ai-recipes/meals/{meal_id}/rate`

## Requirements for Training

- At least **2 recipes** with ingredients in the database
- Ingredients should be stored as comma-separated values in the `ingredients` field
- Example: `"chicken, rice, tomatoes, onions, garlic"`

## Model Storage

The trained model is saved in:
- `backend/models/recipe_model.pkl` - Recipe data and vectors
- `backend/models/recipe_vectorizer.pkl` - TF-IDF vectorizer
- `backend/models/recipe_scaler.pkl` - Feature scaler
- `backend/models/recipe_metadata.json` - Model metadata

## Checking Model Status

```bash
curl http://localhost:8000/api/ai-recipes/model/status
```

Response:
```json
{
  "is_trained": true,
  "recipes_count": 10,
  "vocabulary_size": 45
}
```

## Adding Recipes with Ingredients

When creating recipes, always include the `ingredients` field:

```json
{
  "name": "Chicken Fried Rice",
  "category": "dinner",
  "ingredients": "chicken, rice, eggs, onions, garlic, soy sauce",
  "calories": 450,
  "protein": 25.0,
  "carbohydrates": 55.0,
  "fat": 12.0
}
```

## User Ratings

Users can rate recipes (1-5 stars), which helps improve recommendations:
- Higher-rated recipes appear first
- Ratings are averaged per recipe
- The model considers ratings when scoring matches

## Best Practices

1. **Consistent Ingredient Names**: Use lowercase, singular forms (e.g., "tomato" not "tomatoes")
2. **Comprehensive Ingredients**: List all main ingredients, not just a few
3. **Regular Retraining**: Retrain periodically as the database grows
4. **Encourage Ratings**: More ratings = better recommendations

## Troubleshooting

### Model Not Trained Error
- Ensure you have at least 2 recipes with ingredients
- Run the training script or API endpoint
- Check that ingredients are properly formatted (comma-separated)

### Poor Recommendations
- Add more recipes to the database
- Ensure recipes have complete ingredient lists
- Encourage users to rate recipes
- Retrain the model after adding new recipes

### Model File Issues
- Delete `backend/models/*.pkl` and retrain
- Check file permissions
- Ensure sufficient disk space

