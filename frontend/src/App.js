import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import MealSearch from './components/MealSearch';
import Recommendations from './components/Recommendations';
import NutritionAnalysis from './components/NutritionAnalysis';
import FindMeals from './components/FindMeals';
import RecipeDetail from './components/RecipeDetail';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem('currentUserId');
    return saved ? parseInt(saved) : null;
  });

  const handleSetUserId = (userId) => {
    setCurrentUserId(userId);
    if (userId) {
      localStorage.setItem('currentUserId', userId.toString());
    } else {
      localStorage.removeItem('currentUserId');
    }
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('currentUserId');
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation - only show when logged in */}
        {currentUserId && (
          <Navbar expand="lg" className="navbar-modern">
            <Container>
              <Navbar.Brand as={Link} to="/dashboard">
                🍽️ NutriChef AI
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/meals">Find Meals</Nav.Link>
                  <Nav.Link as={Link} to="/recommendations">Recommendations</Nav.Link>
                  <Nav.Link as={Link} to="/nutrition">Nutrition</Nav.Link>
                </Nav>
                <Nav>
                  <NavDropdown title="👤 Account" id="account-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={<Login setCurrentUserId={handleSetUserId} />} 
          />
          <Route 
            path="/register" 
            element={<Register setCurrentUserId={handleSetUserId} />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={<Dashboard currentUserId={currentUserId} />} 
          />
          <Route 
            path="/profile" 
            element={<UserProfile currentUserId={currentUserId} setCurrentUserId={handleSetUserId} />} 
          />
          <Route path="/meals" element={<FindMeals currentUserId={currentUserId} />} />
          <Route path="/recipe/:mealId" element={<RecipeDetail currentUserId={currentUserId} />} />
          <Route path="/recommendations" element={<Recommendations currentUserId={currentUserId} />} />
          <Route path="/nutrition" element={<NutritionAnalysis currentUserId={currentUserId} />} />
          
          {/* Legacy routes */}
          <Route path="/meal-search" element={<MealSearch currentUserId={currentUserId} />} />
          <Route 
            path="/home" 
            element={<Home currentUserId={currentUserId} setCurrentUserId={handleSetUserId} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

