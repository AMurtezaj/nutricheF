# ✅ Complete Feature Testing Guide

## 🎯 All Features Implemented

### Backend Features ✅
1. **Recipe Viewing** - Get meal details with ratings
2. **Recipe Saving** - Save/unsave favorite meals
3. **Recipe Rating** - Rate and review meals (1-5 stars)
4. **Nutrition Tab** - Complete nutrition calculations with clear formulas
5. **ML Recommendations** - Collaborative filtering + content-based

### API Endpoints

#### 1. Recipe Viewing
```bash
# Get meal by ID (with rating stats)
curl http://localhost:8000/api/meals/1

# Search meals
curl http://localhost:8000/api/meals/search/chicken

# Get meals by category
curl http://localhost:8000/api/meals?category=breakfast
```

#### 2. Recipe Saving
```bash
# Save a meal
curl -X POST http://localhost:8000/api/saved-meals/users/1/meals/100 \
  -H "Content-Type: application/json" \
  -d '{"note": "My favorite breakfast!"}'

# Get saved meals
curl http://localhost:8000/api/saved-meals/users/1

# Check if saved
curl http://localhost:8000/api/saved-meals/users/1/meals/100/is-saved

# Unsave a meal
curl -X DELETE http://localhost:8000/api/saved-meals/users/1/meals/100
```

#### 3. Recipe Rating
```bash
# Rate a meal
curl -X POST http://localhost:8000/api/ratings/users/1/meals/100 \
  -H "Content-Type: application/json" \
  -d '{"rating": 5.0, "review": "Absolutely delicious!"}'

# Get user's rating
curl http://localhost:8000/api/ratings/users/1/meals/100

# Get all ratings for a meal
curl http://localhost:8000/api/ratings/meals/100

# Get rating statistics
curl http://localhost:8000/api/ratings/meals/100/stats

# Delete rating
curl -X DELETE http://localhost:8000/api/ratings/users/1/meals/100
```

#### 4. Nutrition Analysis
```bash
# Get daily nutrition summary
curl http://localhost:8000/api/nutrition/users/1/daily?date=2026-01-07

# Calculate user's targets
curl -X POST http://localhost:8000/api/nutrition/users/1/calculate-targets

# Get nutrition for a meal
curl http://localhost:8000/api/nutrition/meals/100?servings=1.5
```

## 🧪 Quick Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"
USER_ID=1
MEAL_ID=100

echo "=== Testing All Features ==="

# 1. View Recipe
echo -e "\n1. Viewing Recipe..."
curl -s "$BASE_URL/api/meals/$MEAL_ID" | json_pp

# 2. Save Recipe
echo -e "\n2. Saving Recipe..."
curl -s -X POST "$BASE_URL/api/saved-meals/users/$USER_ID/meals/$MEAL_ID" \
  -H "Content-Type: application/json" \
  -d '{"note": "Test save"}' | json_pp

# 3. Rate Recipe
echo -e "\n3. Rating Recipe..."
curl -s -X POST "$BASE_URL/api/ratings/users/$USER_ID/meals/$MEAL_ID" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5.0, "review": "Great meal!"}' | json_pp

# 4. Get Rating Stats
echo -e "\n4. Rating Statistics..."
curl -s "$BASE_URL/api/ratings/meals/$MEAL_ID/stats" | json_pp

# 5. Nutrition Summary
echo -e "\n5. Nutrition Summary..."
curl -s "$BASE_URL/api/nutrition/users/$USER_ID/daily" | json_pp

echo -e "\n=== All Tests Complete ===" 
```

## 📊 Nutrition Calculations Explained

### BMR (Basal Metabolic Rate)
```
Men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
Women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

### TDEE (Total Daily Energy Expenditure)
```
TDEE = BMR × Activity Multiplier

Activity Levels:
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extremely Active: 1.9
```

### Calorie Targets
```
Weight Loss: TDEE - 500 (lose ~0.5kg/week)
Weight Gain: TDEE + 500 (gain ~0.5kg/week)
Muscle Gain: TDEE + 300 (lean gains)
Maintenance: TDEE (no change)
```

### Macronutrient Targets
```
Protein: 1.8-2.2g per kg body weight (goal-dependent)
- Calories: protein_grams × 4

Fat: 30% of total calories
- Calories: fat_calories / 9

Carbohydrates: Remaining calories
- Calories: carb_calories / 4
```

## 🎨 Frontend Integration (Next Step)

The backend is ready. Frontend components need to call these APIs:

1. **RecipeDetail.js** - Display meal with save/rate buttons
2. **SavedMeals.js** - List saved recipes
3. **NutritionTab.js** - Show daily progress with calculations
4. **Rating Component** - Star rating UI

## ✅ All Backend Features Complete

- ✅ Recipe viewing with full nutrition data
- ✅ Recipe saving/unsaving
- ✅ Recipe rating (1-5 stars with reviews)
- ✅ Nutrition calculations with clear formulas
- ✅ ML-powered recommendations
- ✅ Database models and relationships
- ✅ API endpoints with validation
- ✅ Error handling
- ✅ Documentation

## 🚀 Start Testing

```bash
# Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# In another terminal, run tests
bash test_features.sh
```

All features are production-ready! 🎉





