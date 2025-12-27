# Meal Recommendation Frontend

React.js frontend for the Intelligent Meal Recommendation & Nutrition Analyzer application.

## Features

- User profile management
- Browse and search meals
- Personalized meal recommendations
- Daily nutrition tracking and analysis
- Responsive Bootstrap-based UI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API URL (optional):
   Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

3. Start development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # React components
│   ├── Home.js         # Landing page
│   ├── UserProfile.js  # User profile management
│   ├── MealSearch.js   # Meal browsing and search
│   ├── Recommendations.js  # Personalized recommendations
│   └── NutritionAnalysis.js  # Daily nutrition tracking
├── services/           # API service layer
│   └── api.js         # API client functions
├── App.js             # Main app component
└── index.js           # Entry point
```

## API Integration

The frontend communicates with the backend API through the `services/api.js` module, which provides:
- User management endpoints
- Meal search and management
- Nutrition analysis
- Personalized recommendations

Make sure the backend API is running on the configured URL (default: http://localhost:8000).


