# Setup Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher and npm
- PostgreSQL 12 or higher
- Git (for version control)

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb meal_recommendation
   
   # Or using psql:
   psql -U postgres
   CREATE DATABASE meal_recommendation;
   \q
   ```

5. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/meal_recommendation
   API_V1_STR=/api/v1
   PROJECT_NAME=Meal Recommendation & Nutrition Analyzer
   BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

6. **Initialize database:**
   ```bash
   python init_db.py
   ```

7. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses the following main tables:
- `users` - User profiles with health and fitness data
- `meals` - Meal database with nutritional information
- `preferences` - User dietary preferences and restrictions
- `user_meals` - Daily meal logging and tracking

## Running Tests

```bash
cd backend
pytest
```

## Production Deployment

For production deployment:
1. Set proper environment variables
2. Use a production-grade WSGI server (e.g., Gunicorn with Uvicorn workers)
3. Configure proper CORS origins
4. Use environment variables for sensitive data
5. Set up proper database backups
6. Configure HTTPS

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/dbname`
- Ensure database exists and user has permissions

### Port Already in Use
- Change port in uvicorn: `uvicorn app.main:app --port 8001`
- Or change React port: `PORT=3001 npm start`

### Missing Dependencies
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check Python version compatibility


