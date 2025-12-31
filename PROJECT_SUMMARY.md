# Project Summary: Intelligent Meal Recommendation & Nutrition Analyzer

## Overview

This project implements a full-stack intelligent meal recommendation system with nutritional analysis capabilities. It combines data processing, machine learning, and software engineering best practices to deliver personalized meal recommendations based on user preferences, dietary restrictions, and health goals.

## Project Structure

```
InteligentMealRecommendation/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── controllers/  # API endpoints
│   │   ├── services/     # Business logic & ML engine
│   │   ├── repositories/ # Database access layer
│   │   ├── models/       # Database models
│   │   ├── config.py     # Configuration
│   │   └── main.py       # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── init_db.py        # Database initialization script
│   └── README.md         # Backend documentation
│
├── frontend/             # React.js frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json      # Node.js dependencies
│   └── README.md         # Frontend documentation
│
├── README.md             # Main project documentation
├── SETUP.md              # Setup instructions
└── .gitignore           # Git ignore file
```

## Architecture

### Backend Architecture (Layered)

1. **Controllers Layer** (`app/controllers/`)
   - Handles HTTP requests and responses
   - Validates input using Pydantic models
   - Routes requests to appropriate services
   - API endpoints organized by domain (users, meals, nutrition, recommendations)

2. **Services Layer** (`app/services/`)
   - Contains business logic
   - **NutritionService**: Calculates BMR, TDEE, calorie targets, macro targets
   - **RecommendationService**: ML-based recommendation engine using:
     - Content-based filtering (dietary restrictions, nutritional fit)
     - Collaborative filtering (user meal history)
     - Nutritional balance (fits remaining daily targets)
   - **UserService**: User management and profile updates
   - **MealService**: Meal management and user meal logging

3. **Repositories Layer** (`app/repositories/`)
   - Database access abstraction
   - CRUD operations for all models
   - Query optimization and data access patterns

4. **Models Layer** (`app/models/`)
   - SQLAlchemy ORM models
   - Database schema definition
   - Relationships between entities

### Frontend Architecture

- **React.js** with functional components and hooks
- **React Router** for navigation
- **Bootstrap** for responsive UI
- **Axios** for API communication
- Component-based structure:
  - Home: User creation and landing page
  - UserProfile: Profile and preference management
  - MealSearch: Browse and search meals
  - Recommendations: Personalized meal recommendations
  - NutritionAnalysis: Daily nutrition tracking

## Key Features

### 1. User Management
- User profile creation with health metrics
- Automatic calculation of daily calorie and macro targets based on:
  - Age, gender, height, weight
  - Activity level
  - Health goals (weight loss, gain, maintenance, muscle gain)
- Dietary preference management

### 2. Meal Database
- Comprehensive meal database with nutritional information
- Dietary tags (vegetarian, vegan, gluten-free, etc.)
- Search and filter capabilities
- Category-based organization (breakfast, lunch, dinner, snack)

### 3. ML-Based Recommendations
- Personalized meal recommendations using hybrid approach:
  - **Content-based**: Matches dietary restrictions, preferences, nutritional needs
  - **Collaborative**: Learns from user's meal history
  - **Nutritional balance**: Recommends meals that fit remaining daily targets
- Scoring algorithm that considers multiple factors
- Explanation of why each meal is recommended

### 4. Nutrition Analysis
- Daily nutrition tracking
- Progress visualization with progress bars
- Macro and calorie breakdown
- Remaining targets calculation
- Meal logging with serving sizes

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Relational database
- **Pydantic**: Data validation
- **scikit-learn, pandas, numpy**: ML libraries (for future enhancements)

### Frontend
- **React.js**: UI library
- **React Router**: Navigation
- **Bootstrap 5**: CSS framework
- **Axios**: HTTP client

### Development Tools
- **VS Code**: IDE
- **Postman**: API testing
- **Git/GitHub**: Version control
- **Docker**: Optional containerization

## Database Schema

### Users Table
- User profile information
- Health metrics (age, gender, height, weight)
- Activity level and goals
- Calculated daily targets (calories, macros)

### Meals Table
- Meal information (name, description, category)
- Nutritional data (calories, protein, carbs, fat, etc.)
- Dietary tags (vegetarian, vegan, gluten-free, etc.)

### Preferences Table
- User dietary restrictions
- Preferred cuisine types
- Favorite/disliked ingredients
- Macro preferences

### User_Meals Table
- Daily meal logging
- Tracks consumed meals with servings
- Calculated nutrition totals

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/{user_id}` - Get user
- `PUT /api/users/{user_id}` - Update user
- `PUT /api/users/{user_id}/preferences` - Update preferences

### Meals
- `GET /api/meals` - List meals (with optional category filter)
- `GET /api/meals/{meal_id}` - Get meal details
- `GET /api/meals/search/{query}` - Search meals
- `POST /api/meals/users/{user_id}/meals` - Log meal

### Nutrition
- `POST /api/nutrition/analyze` - Analyze meal nutrition
- `GET /api/nutrition/users/{user_id}/daily` - Daily nutrition summary

### Recommendations
- `GET /api/recommendations/users/{user_id}` - Get personalized recommendations

## ML Recommendation Algorithm

The recommendation engine uses a scoring system that evaluates meals based on:

1. **Dietary Restrictions Compliance** (Hard filter - must pass)
   - Filters out meals that violate user's dietary restrictions

2. **Nutritional Fit** (0-0.5 points)
   - How well the meal fits remaining daily calorie targets
   - Protein content importance for muscle gain/weight loss goals

3. **Preference Similarity** (0-0.3 points)
   - Matches preferred cuisine types
   - Favorite ingredients presence

4. **Historical Preference** (0-0.3 points)
   - User's meal category preferences
   - Previously consumed meals

5. **Nutritional Density** (0-0.1 points)
   - Protein-to-calorie ratio bonus

## Future Enhancements

- Advanced ML models (neural networks, matrix factorization)
- Meal image recognition
- Recipe recommendations
- Social features (sharing, reviews)
- Mobile app
- Integration with fitness trackers
- Meal planning (weekly/monthly)
- Grocery list generation
- Barcode scanning for nutrition input

## Deliverables Checklist

✅ Modular backend structure (Python + ML service)
✅ Frontend in React.js with responsive UI
✅ Repository layer for database access
✅ API endpoints with Swagger documentation
✅ Fully functional Python backend with ML recommendation engine
✅ React frontend implementing meal selection, recommendations, and nutrition analysis
✅ Clean, readable, well-commented code
✅ Database models and schema
✅ Documentation (README, SETUP guide)
✅ Configuration files and requirements

## Team Members

- **Altin Murtezaj** (am51230@ubt-uni.net) - Team Leader
- **Vjollca Baxhaku** (vb69325@ubt-uni.net)
- **Blerta Xheladini** (bx68051@ubt-uni.net)

## Getting Started

See `SETUP.md` for detailed setup instructions.

1. Set up PostgreSQL database
2. Configure backend environment variables
3. Install Python dependencies and run backend
4. Install Node.js dependencies and run frontend
5. Access application at http://localhost:3000
6. API documentation at http://localhost:8000/docs




