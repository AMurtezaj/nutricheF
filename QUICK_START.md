# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8+ installed (`python --version`)
- ✅ Node.js 16+ installed (`node --version`)
- ✅ PostgreSQL installed and running
- ✅ Git installed (optional, for version control)

## Step 1: Database Setup

1. Create PostgreSQL database:
   ```bash
   createdb meal_recommendation
   ```
   
   Or using psql:
   ```bash
   psql -U postgres
   CREATE DATABASE meal_recommendation;
   \q
   ```

## Step 2: Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file in backend directory:
   ```env
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/meal_recommendation
   ```

5. Initialize database:
   ```bash
   python init_db.py
   ```

6. Start backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

✅ Backend running at: http://localhost:8000
✅ API docs at: http://localhost:8000/docs

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend server:
   ```bash
   npm start
   ```

✅ Frontend running at: http://localhost:3000

## Step 4: Using the Application

1. **Create a User Account**
   - Go to http://localhost:3000
   - Fill in the registration form (email, username, first name, last name)
   - Click "Create Account"

2. **Complete Your Profile**
   - Navigate to "Profile" in the navigation bar
   - Fill in your health information:
     - Age, Gender, Height, Weight
     - Activity Level (sedentary, lightly active, etc.)
     - Goal (weight loss, weight gain, maintenance, muscle gain)
   - Click "Save Changes"

3. **Set Dietary Preferences**
   - In the Profile page, scroll to "Dietary Preferences"
   - Select your dietary restrictions (vegetarian, vegan, gluten-free, etc.)
   - Add preferred cuisine and favorite ingredients
   - Click "Save Preferences"

4. **Browse Meals**
   - Click "Meals" in the navigation
   - Browse available meals or search for specific meals
   - Click "Add to Daily Log" to log a meal you've consumed

5. **Get Recommendations**
   - Click "Recommendations" in the navigation
   - View personalized meal recommendations based on your profile
   - Each recommendation shows why it was suggested

6. **Track Nutrition**
   - Click "Nutrition Analysis" in the navigation
   - View your daily nutrition progress
   - See calories, protein, carbs, and fat intake vs. targets
   - View logged meals for the day

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
uvicorn app.main:app --port 8001
```

**Database connection error:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env file
- Ensure database exists: `psql -l | grep meal_recommendation`

**Module not found errors:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
PORT=3001 npm start
```

**npm install errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Verify backend is running
- Check browser console for errors
- Verify CORS settings in backend/config.py

## Next Steps

- Add more meals to the database through the API
- Explore the API documentation at http://localhost:8000/docs
- Customize user preferences and see how recommendations change
- Track your nutrition over multiple days

## Getting Help

- Check the main README.md for detailed documentation
- Review SETUP.md for detailed setup instructions
- Check API documentation at /docs endpoint
- Review code comments for implementation details


