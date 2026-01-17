import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogMealModal from './LogMealModal';
import './SavedMeals.css';

const API_BASE_URL = 'http://localhost:8000/api';

function SavedMeals({ currentUserId }) {
  const [savedMeals, setSavedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadSavedMeals();
    }
  }, [currentUserId]);

  const loadSavedMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/saved-meals/users/${currentUserId}`);
      setSavedMeals(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load saved meals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (mealId) => {
    if (!window.confirm('Are you sure you want to remove this from your saved meals?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`);
      // Remove from local state
      setSavedMeals(savedMeals.filter(meal => meal.meal_id !== mealId));
    } catch (err) {
      alert('Failed to unsave meal');
      console.error(err);
    }
  };

  if (!currentUserId) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Please log in to view your saved meals.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your saved meals...</p>
      </Container>
    );
  }

  return (
    <Container className="saved-meals-container mt-4">
      <div className="page-header mb-4">
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem' }}>
          💾 My Saved Recipes
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Your personal collection of favorite meals
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {savedMeals.length === 0 ? (
        <Card className="card-modern text-center py-5">
          <Card.Body>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <h3>No saved meals yet</h3>
            <p className="text-muted mb-4">
              Start exploring recipes and save your favorites!
            </p>
            <Button 
              className="btn-modern btn-primary-modern"
              onClick={() => navigate('/meals')}
            >
              Find Meals
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="mb-3">
            <span className="text-muted">
              {savedMeals.length} saved {savedMeals.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </div>
          <Row className="g-4">
            {savedMeals.map((savedMeal) => (
              <Col key={savedMeal.id} md={6} lg={4}>
                <Card className="card-modern h-100 saved-meal-card">
                  <Card.Body className="d-flex flex-column">
                    <div className="meal-icon mb-3 text-center">
                      {savedMeal.meal_category === 'breakfast' && <span style={{ fontSize: '3rem' }}>🥞</span>}
                      {savedMeal.meal_category === 'lunch' && <span style={{ fontSize: '3rem' }}>🥗</span>}
                      {savedMeal.meal_category === 'dinner' && <span style={{ fontSize: '3rem' }}>🍽️</span>}
                      {savedMeal.meal_category === 'snack' && <span style={{ fontSize: '3rem' }}>🍎</span>}
                    </div>
                    
                    <h5 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                      {savedMeal.meal_name}
                    </h5>
                    
                    <p className="text-muted small mb-3" style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {savedMeal.meal_description || 'Delicious and nutritious meal'}
                    </p>

                    {savedMeal.note && (
                      <div className="saved-note mb-3 p-2" style={{
                        backgroundColor: 'var(--bg-light)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}>
                        <strong>Note:</strong> {savedMeal.note}
                      </div>
                    )}

                    <div className="nutrition-quick-info mb-3">
                      <Row className="g-2 text-center small">
                        <Col xs={4}>
                          <div><strong>{savedMeal.calories.toFixed(0)}</strong></div>
                          <div className="text-muted">kcal</div>
                        </Col>
                        <Col xs={4}>
                          <div><strong>{savedMeal.protein.toFixed(0)}g</strong></div>
                          <div className="text-muted">protein</div>
                        </Col>
                        <Col xs={4}>
                          <div><strong>{savedMeal.carbohydrates.toFixed(0)}g</strong></div>
                          <div className="text-muted">carbs</div>
                        </Col>
                      </Row>
                    </div>

                    <div className="saved-at mb-3">
                      <small className="text-muted">
                        Saved {new Date(savedMeal.saved_at).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="mt-auto">
                      <Button
                        className="btn-modern btn-primary-modern w-100 mb-2"
                        onClick={() => {
                          setSelectedMeal(savedMeal);
                          setShowLogMealModal(true);
                        }}
                      >
                        📊 Log This Meal
                      </Button>
                      <Button
                        className="btn-modern btn-outline-modern w-100 mb-2"
                        onClick={() => navigate(`/recipe/${savedMeal.meal_id}`)}
                      >
                        View Recipe
                      </Button>
                      <Button
                        className="w-100"
                        variant="outline-danger"
                        onClick={() => handleUnsave(savedMeal.meal_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Log Meal Modal */}
      {selectedMeal && (
        <LogMealModal
          show={showLogMealModal}
          onHide={() => {
            setShowLogMealModal(false);
            setSelectedMeal(null);
          }}
          meal={{
            id: selectedMeal.meal_id,
            name: selectedMeal.meal_name,
            description: selectedMeal.meal_description,
            category: selectedMeal.category,
            calories: selectedMeal.calories,
            protein: selectedMeal.protein,
            carbohydrates: selectedMeal.carbohydrates,
            fat: selectedMeal.fat,
            fiber: selectedMeal.fiber,
            sugar: selectedMeal.sugar
          }}
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

export default SavedMeals;





