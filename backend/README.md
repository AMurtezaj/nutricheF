# Meal Recommendation Backend

Python FastAPI backend for the Intelligent Meal Recommendation & Nutrition Analyzer application.

## Architecture

The backend follows a **Layered Architecture** pattern:

- **Controllers** (`app/controllers/`): API endpoints and request/response handling
- **Services** (`app/services/`): Business logic, ML recommendation engine, nutrition calculations
- **Repositories** (`app/repositories/`): Database access layer
- **Models** (`app/models/`): SQLAlchemy database models

## Features

- RESTful API with FastAPI
- PostgreSQL database integration
- ML-based meal recommendation engine
- Nutrition calculation and analysis
- User preference management
- Automatic Swagger/OpenAPI documentation

## Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Create a `.env` file with your database configuration:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/meal_recommendation
   ```

4. Initialize database:
   ```bash
   python init_db.py
   ```

5. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

API documentation: http://localhost:8000/docs

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/{user_id}` - Get user
- `PUT /api/users/{user_id}` - Update user
- `PUT /api/users/{user_id}/preferences` - Update preferences

### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/{meal_id}` - Get meal by ID
- `GET /api/meals/search/{query}` - Search meals
- `POST /api/meals/users/{user_id}/meals` - Add meal to user log

### Nutrition
- `POST /api/nutrition/analyze` - Analyze meal nutrition
- `GET /api/nutrition/users/{user_id}/daily` - Get daily nutrition summary

### Recommendations
- `GET /api/recommendations/users/{user_id}` - Get personalized recommendations

## ML Recommendation Engine

The recommendation service uses a hybrid approach combining:
- **Content-based filtering**: Dietary restrictions, nutritional fit, preferences
- **Collaborative filtering**: User meal history and preferences
- **Nutritional balance**: How well meals fit remaining daily targets

## Testing

Run tests with pytest:
```bash
pytest
```

## Database Models

- `User`: User profiles with health and fitness goals
- `Meal`: Meal database with nutritional information
- `Preference`: User dietary preferences and restrictions
- `UserMeal`: Daily meal logging and tracking




