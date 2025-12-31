# Intelligent Meal Recommendation & Nutrition Analyzer

## Team Members

- **Team Leader**: Altin Murtezaj (am51230@ubt-uni.net, +383 43 827 825)
- **Team Member 2**: Vjollca Baxhaku (vb69325@ubt-uni.net, +386 49 264 030)
- **Team Member 3**: Blerta Xheladini (bx68051@ubt-uni.net, +383 43 721 007)

## Project Description

The Meal Recommendation & Nutrition Analyzer is an intelligent system that:
- Analyzes nutritional content of meals (calories, proteins, carbs, fats)
- Learns user preferences, dietary restrictions, and health goals
- Provides personalized meal recommendations using machine learning
- Offers daily nutrition analysis and insights

## Architecture

The system uses a **Layered Architecture**:
- **Frontend**: React.js with Bootstrap for responsive UI
- **Backend**: Python with REST API (controllers → services → repositories)
- **Database**: PostgreSQL
- **ML Engine**: Integrated in the service layer for personalized recommendations

## Project Structure

```
InteligentMealRecommendation/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── models/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

5. Run database migrations (if using Alembic) or initialize database manually

6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Database Schema

- **Users**: Store user information, preferences, dietary restrictions, health goals
- **Meals**: Store meal data with nutritional information
- **User_Meals**: Track user meal consumption and daily nutrition
- **Preferences**: User preferences and restrictions

## API Endpoints

- `GET /api/users/{user_id}` - Get user information
- `POST /api/users` - Create new user
- `PUT /api/users/{user_id}/preferences` - Update user preferences
- `GET /api/meals` - Get all meals
- `GET /api/meals/recommendations/{user_id}` - Get personalized recommendations
- `POST /api/meals/analyze` - Analyze meal nutrition
- `GET /api/users/{user_id}/nutrition/daily` - Get daily nutrition summary
- `POST /api/users/{user_id}/meals` - Add meal to user's daily log

## Technologies

- **Frontend**: React.js, Bootstrap
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **ML**: scikit-learn, pandas, numpy
- **Tools**: VS Code, GitHub, Postman, Docker (optional)

## Development

### Running Tests
```bash
cd backend
pytest
```

### Code Quality
- Follow PEP 8 for Python code
- Use ESLint/Prettier for React code
- Write unit tests for services and ML models




