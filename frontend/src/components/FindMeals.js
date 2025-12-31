import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { mealAPI, recommendationAPI } from '../services/api';
import './FindMeals.css';

function FindMeals({ currentUserId }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Common ingredients for selection
  const availableIngredients = [
    'Chicken', 'Beef', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Bread',
    'Tomatoes', 'Onions', 'Garlic', 'Peppers', 'Carrots', 'Broccoli',
    'Spinach', 'Cheese', 'Milk', 'Yogurt', 'Oats', 'Quinoa',
    'Potatoes', 'Sweet Potatoes', 'Beans', 'Lentils', 'Tofu',
    'Olive Oil', 'Butter', 'Avocado', 'Banana', 'Apple', 'Berries'
  ];

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      searchMeals();
    }
  }, [selectedIngredients]);

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const searchMeals = async () => {
    if (selectedIngredients.length === 0) {
      setMeals([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Search for meals based on selected ingredients
      const searchTerm = selectedIngredients.join(' ');
      const response = await mealAPI.search(searchTerm);
      setMeals(response.data || []);
    } catch (err) {
      setError('Failed to search meals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMealClick = (mealId) => {
    navigate(`/recipe/${mealId}`);
  };

  const filteredIngredients = availableIngredients.filter(ing =>
    ing.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="find-meals-container mt-4">
      <Row>
        <Col>
          <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1rem'}}>
            Find Perfect Meals 🍽️
          </h1>
          <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '2rem'}}>
            Select ingredients you have, and we'll recommend delicious recipes
          </p>
        </Col>
      </Row>

      <Row>
        {/* Left Sidebar - Ingredient Selector */}
        <Col lg={4} className="mb-4">
          <Card className="card-modern sticky-sidebar">
            <div className="card-header-modern">
              <h5 className="mb-0">Select Ingredients</h5>
            </div>
            <Card.Body className="card-body-modern">
              {/* Search Bar */}
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    placeholder="Search ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputGroup.Text style={{background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0 12px 12px 0'}}>
                    🔍
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* Selected Ingredients */}
              {selectedIngredients.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {selectedIngredients.map((ingredient) => (
                      <Badge
                        key={ingredient}
                        bg="primary"
                        className="ingredient-tag"
                        style={{fontSize: '0.9rem', padding: '0.5rem 0.75rem', cursor: 'pointer'}}
                        onClick={() => removeIngredient(ingredient)}
                      >
                        {ingredient} ×
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setSelectedIngredients([])}
                    style={{borderRadius: '8px'}}
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Ingredient Grid */}
              <div className="ingredient-grid">
                {filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className={`ingredient-chip ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>

              {selectedIngredients.length === 0 && (
                <div className="empty-state mt-4">
                  <div className="empty-state-icon">🥘</div>
                  <p className="text-muted">Select ingredients to get started</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Content - Meal Results */}
        <Col lg={8}>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Row className="g-4">
              {[1, 2, 3].map(i => (
                <Col md={6} key={i}>
                  <div className="skeleton-card skeleton" style={{height: '350px'}} />
                </Col>
              ))}
            </Row>
          ) : meals.length > 0 ? (
            <Row className="g-4">
              {meals.map((meal) => (
                <Col md={6} key={meal.id}>
                  <div className="recipe-card" onClick={() => handleMealClick(meal.id)}>
                    <div className="recipe-image">
                      {meal.category === 'breakfast' && '🥞'}
                      {meal.category === 'lunch' && '🥗'}
                      {meal.category === 'dinner' && '🍽️'}
                      {meal.category === 'snack' && '🍎'}
                      {!meal.category && '🍕'}
                    </div>
                    <div className="recipe-content">
                      <div style={{position: 'relative'}}>
                        <div className="match-badge">Match</div>
                        <h5 className="recipe-title">{meal.name}</h5>
                      </div>
                      <p className="recipe-description">
                        {meal.description || 'Delicious and nutritious meal'}
                      </p>
                      <div className="recipe-stats">
                        <div className="recipe-stat">
                          <span>🔥</span>
                          <span>{meal.calories} kcal</span>
                        </div>
                        <div className="recipe-stat">
                          <span>💪</span>
                          <span>{meal.protein}g protein</span>
                        </div>
                        <div className="recipe-stat">
                          <span>📊</span>
                          <span>{meal.category || 'meal'}</span>
                        </div>
                      </div>
                      <Button
                        className="btn-modern btn-primary-modern w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMealClick(meal.id);
                        }}
                      >
                        View Recipe
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : selectedIngredients.length > 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h4 className="empty-state-title">No meals found</h4>
              <p className="empty-state-text">
                Try selecting different ingredients or check back later for more recipes
              </p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👆</div>
              <h4 className="empty-state-title">Select ingredients to get started</h4>
              <p className="empty-state-text">
                Choose ingredients from the left sidebar to find matching recipes
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default FindMeals;




