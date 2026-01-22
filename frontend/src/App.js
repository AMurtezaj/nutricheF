import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Recommendations from './components/Recommendations';
import NutritionAnalysis from './components/NutritionAnalysis';
import FindMeals from './components/FindMeals';
import RecipeDetail from './components/RecipeDetail';
import SavedMeals from './components/SavedMeals';
import MealPlanner from './components/MealPlanner';
import { UserProvider, useUser } from './context/UserContext';
import './styles/design-system.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUserId, loading } = useUser();

  if (loading) {
    // You might want a better loading spinner here
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--bg-app)'
    }}>Loading...</div>;
  }

  if (!currentUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

// Route wrapper to redirect authenticated users away from public auth pages
const PublicRoute = ({ children }) => {
  const { currentUserId, loading } = useUser();

  if (loading) return null; // Or spinner

  if (currentUserId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes wrapped in MainLayout via ProtectedRoute */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <FindMeals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedMeals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipe/:mealId"
              element={
                <ProtectedRoute>
                  <RecipeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <NutritionAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal-planner"
              element={
                <ProtectedRoute>
                  <MealPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '2rem' }}><h2>Settings Page (Coming Soon)</h2></div>
                </ProtectedRoute>
              }
            />

            {/* Legacy routes */}
            <Route path="/meal-search" element={<Navigate to="/meals" replace />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;

