# AI Recipe Recommendation System - Integration Summary

## Overview

A complete AI-powered recipe recommendation system has been integrated into the NutriChef application. The system uses machine learning to match user-selected ingredients with recipes, learns from user ratings, and continuously improves recommendations.

## Features Implemented

### 1. **AI-Powered Ingredient-Based Recipe Search**
   - Users select at least 2 ingredients
   - AI model searches for matching recipes using TF-IDF vectorization
   - Results are ranked by similarity score, ratings, and ingredient matches
   - Shows match percentage (e.g., "3/5 match")

### 2. **Recipe Rating System**
   - Users can rate recipes from 1-5 stars
   - Optional comments/feedback
   - Ratings improve future recommendations
   - Average ratings displayed on recipe cards

### 3. **Recipe Creation**
   - Users can create new recipes with ingredients
   - Form includes all nutritional information
   - Ingredients stored as comma-separated list for AI training
   - New recipes automatically trigger model retraining

### 4. **Model Training**
   - Can be trained manually via API or script
   - Automatically retrains when recipes/ratings are added
   - Requires minimum 2 recipes with ingredients

## Backend Changes

### New Models
- **RecipeRating**: Stores user ratings and feedback for recipes
- **Meal.ingredients**: New field for storing recipe ingredients
- **Meal.average_rating**: Average rating from users
- **Meal.rating_count**: Number of ratings received
- **Meal.created_by_user_id**: Tracks user-created recipes

### New Services
- **AIRecipeService** (`app/services/ai_recipe_service.py`):
  - TF-IDF vectorization for ingredient matching
  - Cosine similarity for recipe scoring
  - Model persistence (pickle files)
  - Automatic retraining

### New Repositories
- **RecipeRatingRepository**: Manages recipe ratings and updates meal averages

### New API Endpoints

#### `/api/ai-recipes/search` (POST)
Search recipes by ingredients using AI
```json
{
  "ingredients": ["chicken", "rice"],
  "limit": 10,
  "min_ingredients_match": 1
}
```

#### `/api/ai-recipes/create` (POST)
Create a new recipe (for AI training)
```json
{
  "name": "Chicken Fried Rice",
  "ingredients": "chicken, rice, eggs, onions",
  "category": "dinner",
  "calories": 450,
  ...
}
```

#### `/api/ai-recipes/meals/{meal_id}/rate` (POST)
Rate a recipe
```json
{
  "rating": 4.5,
  "comment": "Delicious!"
}
```

#### `/api/ai-recipes/train` (POST)
Manually train the AI model

#### `/api/ai-recipes/model/status` (GET)
Check model training status

## Frontend Changes

### Updated Components

#### `FindMeals.js`
- Now uses AI recipe search instead of simple text search
- Shows match scores and ratings
- Rating button on each recipe card
- "Create Recipe" button when no matches found
- Requires at least 2 ingredients to search

#### New Component: `CreateRecipeModal.js`
- Full recipe creation form
- Pre-fills ingredients from selected ingredients
- Includes all nutritional fields
- Dietary tags support

### Updated API Service
- Added `aiRecipeAPI` with all AI recipe endpoints

## Database Schema Changes

### New Table: `recipe_ratings`
- `id`: Primary key
- `user_id`: Foreign key to users
- `meal_id`: Foreign key to meals
- `rating`: Float (1.0-5.0)
- `comment`: Text (optional)
- Unique constraint on (user_id, meal_id)

### Updated Table: `meals`
- `ingredients`: Text (comma-separated)
- `created_by_user_id`: Integer (nullable)
- `average_rating`: Float (default 0.0)
- `rating_count`: Integer (default 0)

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

New dependencies:
- scikit-learn==1.3.2
- pandas==2.1.3
- numpy==1.26.2

### 2. Initialize Database
```bash
python init_db.py
```

This creates sample meals with ingredients for initial training.

### 3. Train the Model
```bash
# Option 1: Using script
python train_model.py

# Option 2: Using API
curl -X POST http://localhost:8000/api/ai-recipes/train
```

### 4. Start the Application
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm start
```

## Usage Flow

1. **User selects ingredients** (minimum 2)
2. **AI searches** for matching recipes
3. **Results displayed** with:
   - Match score
   - Average rating
   - Ingredient match count
4. **User can**:
   - View recipe details
   - Rate the recipe
   - Create a new recipe if none found
5. **Model learns** from:
   - New recipes added
   - User ratings
   - Recipe popularity

## Model Training Details

### How It Works
1. **TF-IDF Vectorization**: Converts ingredient lists to numerical vectors
2. **Cosine Similarity**: Calculates similarity between user ingredients and recipe ingredients
3. **Composite Scoring**: Combines similarity, ratings, and match count
4. **Ranking**: Sorts by composite score

### Training Requirements
- Minimum 2 recipes with ingredients
- Ingredients as comma-separated strings
- Model saved to `backend/models/` directory

### Retraining Triggers
- New recipe created
- Recipe rated
- Manual training via API/script

## File Structure

```
backend/
├── app/
│   ├── models/
│   │   ├── recipe_rating.py (NEW)
│   │   └── meal.py (UPDATED)
│   ├── services/
│   │   └── ai_recipe_service.py (NEW)
│   ├── repositories/
│   │   └── recipe_rating_repository.py (NEW)
│   ├── controllers/
│   │   └── ai_recipe_controller.py (NEW)
│   └── main.py (UPDATED)
├── models/ (NEW - model storage)
│   ├── recipe_model.pkl
│   ├── recipe_vectorizer.pkl
│   ├── recipe_scaler.pkl
│   └── recipe_metadata.json
└── train_model.py (NEW)

frontend/
└── src/
    ├── components/
    │   ├── FindMeals.js (UPDATED)
    │   └── CreateRecipeModal.js (NEW)
    └── services/
        └── api.js (UPDATED)
```

## Testing

### Test Recipe Search
```bash
curl -X POST http://localhost:8000/api/ai-recipes/search \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"], "limit": 5}'
```

### Test Recipe Creation
```bash
curl -X POST http://localhost:8000/api/ai-recipes/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Recipe",
    "ingredients": "chicken, rice, tomatoes",
    "category": "dinner",
    "calories": 400,
    "protein": 30,
    "carbohydrates": 50,
    "fat": 10
  }'
```

### Test Rating
```bash
curl -X POST "http://localhost:8000/api/ai-recipes/meals/1/rate?user_id=1" \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.5, "comment": "Great recipe!"}'
```

## Future Enhancements

1. **Advanced ML Models**: Deep learning for better recommendations
2. **Ingredient Substitutions**: Suggest alternatives
3. **Dietary Preferences**: Better integration with user preferences
4. **Recipe Clustering**: Group similar recipes
5. **Popularity Trends**: Track trending recipes
6. **Batch Training**: Scheduled retraining jobs
7. **A/B Testing**: Compare recommendation strategies

## Troubleshooting

### Model Not Found
- Ensure model is trained: `python train_model.py`
- Check `backend/models/` directory exists
- Verify at least 2 recipes with ingredients exist

### Poor Recommendations
- Add more recipes to database
- Encourage user ratings
- Retrain model after adding recipes
- Check ingredient format (comma-separated)

### Training Errors
- Verify database connection
- Check recipe data has ingredients field
- Ensure minimum 2 recipes exist
- Check file permissions for model directory

## Documentation

- See `AI_MODEL_GUIDE.md` for detailed model documentation
- API documentation available at `http://localhost:8000/docs`

