import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert, Modal, FormControl } from 'react-bootstrap';
import { aiRecipeAPI } from '../services/api';
import CreateRecipeModal from './CreateRecipeModal';
import LogMealModal from './LogMealModal';
import './FindMeals.css';

function FindMeals({ currentUserId }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ratingMeal, setRatingMeal] = useState(null);
  const [userRatings, setUserRatings] = useState({}); // mealId -> rating
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
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
    if (selectedIngredients.length >= 2) {
      searchMeals();
    } else if (selectedIngredients.length === 0) {
      setMeals([]);
    }
  }, [selectedIngredients]);

  // Load user ratings for displayed meals
  useEffect(() => {
    if (meals.length > 0 && currentUserId) {
      loadUserRatings();
    }
  }, [meals, currentUserId]);

  const loadUserRatings = async () => {
    const ratings = {};
    for (const meal of meals) {
      try {
        const response = await aiRecipeAPI.getUserRating(meal.id, currentUserId);
        if (response.data) {
          ratings[meal.id] = response.data.rating;
        }
      } catch (err) {
        // User hasn't rated this meal yet
      }
    }
    setUserRatings(ratings);
  };

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
    if (selectedIngredients.length < 2) {
      setMeals([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use AI recipe search
      const response = await aiRecipeAPI.searchByIngredients(
        selectedIngredients,
        10,
        1 // Minimum 1 ingredient match
      );
      setMeals(response.data || []);
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI model not trained yet. Please create some recipes first or contact admin to train the model.');
      } else {
        setError('Failed to search recipes. ' + (err.response?.data?.detail || ''));
      }
      console.error(err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMealClick = (mealId) => {
    navigate(`/recipe/${mealId}`);
  };

  const handleRateClick = (e, meal) => {
    e.stopPropagation();
    if (!currentUserId) {
      alert('Please login to rate recipes');
      return;
    }
    setRatingMeal(meal);
    setRatingValue(userRatings[meal.id] || 0);
    setRatingComment('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (!ratingMeal || !currentUserId || ratingValue === 0) {
      alert('Please select a rating (1-5 stars)');
      return;
    }

    try {
      await aiRecipeAPI.rateRecipe(ratingMeal.id, currentUserId, ratingValue, ratingComment || null);
      setUserRatings({ ...userRatings, [ratingMeal.id]: ratingValue });
      setShowRatingModal(false);
      // Refresh meals to show updated ratings
      searchMeals();
    } catch (err) {
      alert('Failed to submit rating: ' + (err.response?.data?.detail || ''));
    }
  };

  const handleCreateRecipe = () => {
    if (!currentUserId) {
      alert('Please login to create recipes');
      return;
    }
    setShowCreateModal(true);
  };

  const handleRecipeCreated = () => {
    setShowCreateModal(false);
    // Retrain model and refresh results
    searchMeals();
  };

  const filteredIngredients = availableIngredients.filter(ing =>
    ing.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating, clickable = false, onClick = null) => {
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={clickable && onClick ? () => onClick(star) : undefined}
            style={{
              cursor: clickable ? 'pointer' : 'default',
              fontSize: '1.2rem',
              color: star <= rating ? '#ffc107' : '#e0e0e0',
            }}
          >
            ★
          </span>
        ))}
        {rating > 0 && <span style={{ marginLeft: '5px', fontSize: '0.9rem', color: '#666' }}>({rating.toFixed(1)})</span>}
      </div>
    );
  };

  return (
    <Container className="find-meals-container mt-4">
      <Row>
        <Col>
          <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1rem'}}>
            Find Perfect Meals 🍽️
          </h1>
          <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '2rem'}}>
            Select at least 2 ingredients, and our AI will find matching recipes
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
                  <p className="text-muted">Select at least 2 ingredients to get started</p>
                </div>
              )}

              {selectedIngredients.length === 1 && (
                <Alert variant="info" className="mt-3">
                  Select at least one more ingredient to search for recipes
                </Alert>
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
            <>
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
                          <div className="match-badge">
                            {meal.matched_ingredients}/{selectedIngredients.length} match
                          </div>
                          <h5 className="recipe-title">{meal.name}</h5>
                        </div>
                        <p className="recipe-description">
                          {meal.description || 'Delicious and nutritious meal'}
                        </p>
                        
                        {/* Rating Display */}
                        <div className="mb-2">
                          {renderStars(meal.average_rating)}
                          {meal.rating_count > 0 && (
                            <span style={{fontSize: '0.85rem', color: '#666', marginLeft: '5px'}}>
                              ({meal.rating_count} {meal.rating_count === 1 ? 'rating' : 'ratings'})
                            </span>
                          )}
                        </div>

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
                            <span>⭐</span>
                            <span>Score: {meal.score?.toFixed(2) || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="d-grid gap-2 mt-2">
                          <Button
                            className="btn-modern btn-primary-modern"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeal(meal);
                              setShowLogMealModal(true);
                            }}
                          >
                            📊 Log Meal
                          </Button>
                          <div className="d-flex gap-2">
                            <Button
                              className="btn-modern btn-outline-modern flex-grow-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMealClick(meal.id);
                              }}
                            >
                              View Recipe
                            </Button>
                            <Button
                              variant="outline-warning"
                              onClick={(e) => handleRateClick(e, meal)}
                              title="Rate this recipe"
                            >
                              ⭐
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              
              {/* Option to create another recipe */}
              <Row className="mt-4">
                <Col>
                  <Card className="card-modern">
                    <Card.Body className="text-center">
                      <p className="mb-2">Don't see what you're looking for?</p>
                      <Button
                        variant="success"
                        onClick={handleCreateRecipe}
                        disabled={!currentUserId}
                      >
                        + Create New Recipe with These Ingredients
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : selectedIngredients.length >= 2 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h4 className="empty-state-title">No recipes found</h4>
              <p className="empty-state-text">
                We couldn't find any recipes matching your ingredients. Be the first to create one!
              </p>
              <Button
                variant="success"
                size="lg"
                onClick={handleCreateRecipe}
                disabled={!currentUserId}
                className="mt-3"
              >
                + Create Recipe with {selectedIngredients.join(', ')}
              </Button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👆</div>
              <h4 className="empty-state-title">Select ingredients to get started</h4>
              <p className="empty-state-text">
                Choose at least 2 ingredients from the left sidebar to find matching recipes
              </p>
            </div>
          )}
        </Col>
      </Row>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rate {ratingMeal?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Your Rating</Form.Label>
            <div>
              {renderStars(ratingValue, true, setRatingValue)}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comment (Optional)</Form.Label>
            <FormControl
              as="textarea"
              rows={3}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitRating} disabled={ratingValue === 0}>
            Submit Rating
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Recipe Modal */}
      <CreateRecipeModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleRecipeCreated}
        currentUserId={currentUserId}
        initialIngredients={selectedIngredients}
      />

      {/* Log Meal Modal */}
      {selectedMeal && (
        <LogMealModal
          show={showLogMealModal}
          onHide={() => {
            setShowLogMealModal(false);
            setSelectedMeal(null);
          }}
          meal={selectedMeal}
          userId={currentUserId}
          onSuccess={() => {
            alert('✅ Meal logged successfully! Check your Nutrition page to see your daily progress.');
            setShowLogMealModal(false);
            setSelectedMeal(null);
          }}
        />
      )}
    </Container>
  );
}

export default FindMeals;




