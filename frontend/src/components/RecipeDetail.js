import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, ListGroup, Modal, Form } from 'react-bootstrap';
import { mealAPI } from '../services/api';
import axios from 'axios';
import LogMealModal from './LogMealModal';
import './RecipeDetail.css';

const API_BASE_URL = 'http://localhost:8000/api';

function RecipeDetail({ currentUserId }) {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [review, setReview] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMeal();
    if (currentUserId) {
      checkIfSaved();
      loadUserRating();
    }
  }, [mealId, currentUserId]);

  const loadMeal = async () => {
    try {
      const response = await mealAPI.get(mealId);
      setMeal(response.data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}/is-saved`
      );
      setIsSaved(response.data.is_saved);
    } catch (err) {
      console.error('Failed to check if saved:', err);
    }
  };

  const loadUserRating = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ratings/users/${currentUserId}/meals/${mealId}`
      );
      if (response.data) {
        setUserRating(response.data);
        setRatingValue(response.data.rating);
        setReview(response.data.review || '');
      }
    } catch (err) {
      // No rating yet, that's okay
      console.log('No existing rating');
    }
  };

  const handleSaveToggle = async () => {
    if (!currentUserId) {
      alert('Please log in to save recipes');
      return;
    }

    try {
      if (isSaved) {
        // Unsave
        await axios.delete(`${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`);
        setIsSaved(false);
        alert('Recipe removed from saved meals');
      } else {
        // Save
        await axios.post(
          `${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`,
          { note: '' }
        );
        setIsSaved(true);
        alert('Recipe saved successfully! View it in your Saved Meals.');
      }
    } catch (err) {
      alert('Failed to save/unsave recipe');
      console.error(err);
    }
  };

  const handleRatingSubmit = async () => {
    if (!currentUserId) {
      alert('Please log in to rate recipes');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/ratings/users/${currentUserId}/meals/${mealId}`,
        {
          rating: ratingValue,
          review: review
        }
      );
      setShowRatingModal(false);
      alert('Rating submitted successfully!');
      loadMeal(); // Reload to get updated rating stats
      loadUserRating();
    } catch (err) {
      alert('Failed to submit rating');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary-modern" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !meal) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Recipe not found'}</Alert>
      </Container>
    );
  }

  const getDietaryBadges = () => {
    const badges = [];
    if (meal.is_vegetarian) badges.push(<Badge key="veg" bg="success" className="me-2 mb-2">🥬 Vegetarian</Badge>);
    if (meal.is_vegan) badges.push(<Badge key="vegan" bg="success" className="me-2 mb-2">🌱 Vegan</Badge>);
    if (meal.is_gluten_free) badges.push(<Badge key="gf" bg="info" className="me-2 mb-2">🌾 Gluten Free</Badge>);
    if (meal.is_dairy_free) badges.push(<Badge key="df" bg="warning" className="me-2 mb-2">🥛 Dairy Free</Badge>);
    if (meal.is_kosher) badges.push(<Badge key="kosher" bg="primary" className="me-2 mb-2">✡️ Kosher</Badge>);
    if (meal.is_halal) badges.push(<Badge key="halal" bg="primary" className="me-2 mb-2">☪️ Halal</Badge>);
    return badges;
  };

  const nutritionData = [
    { label: 'Calories', value: meal.calories, unit: 'kcal', color: 'var(--primary)' },
    { label: 'Protein', value: meal.protein, unit: 'g', color: 'var(--success-dark)' },
    { label: 'Carbs', value: meal.carbohydrates, unit: 'g', color: 'var(--secondary)' },
    { label: 'Fat', value: meal.fat, unit: 'g', color: 'var(--accent)' },
    { label: 'Fiber', value: meal.fiber || 0, unit: 'g', color: 'var(--text-light)' },
    { label: 'Sugar', value: meal.sugar || 0, unit: 'g', color: 'var(--text-light)' },
  ];

  const totalMacros = meal.protein + meal.carbohydrates + meal.fat;
  const proteinPercent = totalMacros > 0 ? (meal.protein / totalMacros) * 100 : 0;
  const carbPercent = totalMacros > 0 ? (meal.carbohydrates / totalMacros) * 100 : 0;
  const fatPercent = totalMacros > 0 ? (meal.fat / totalMacros) * 100 : 0;

  return (
    <Container className="recipe-detail-container mt-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)}
        className="mb-4"
        style={{borderRadius: '12px'}}
      >
        ← Back
      </Button>

      <Row>
        <Col lg={8}>
          {/* Recipe Header */}
          <Card className="card-modern mb-4">
            <Card.Body className="card-body-modern text-center">
              <div className="recipe-detail-image mb-4">
                {meal.category === 'breakfast' && '🥞'}
                {meal.category === 'lunch' && '🥗'}
                {meal.category === 'dinner' && '🍽️'}
                {meal.category === 'snack' && '🍎'}
                {!meal.category && '🍕'}
              </div>
              <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1rem'}}>
                {meal.name}
              </h1>
              <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
                {meal.description || 'Delicious and nutritious meal'}
              </p>
              <div className="mb-3">
                {getDietaryBadges()}
              </div>
              <Row className="g-3 mt-4">
                <Col md={3}>
                  <div>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📅</div>
                    <div className="text-muted">Category</div>
                    <div style={{fontWeight: 600, textTransform: 'capitalize'}}>
                      {meal.category || 'General'}
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🍽️</div>
                    <div className="text-muted">Serving</div>
                    <div style={{fontWeight: 600}}>
                      {meal.serving_size || '1 serving'}
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⏱️</div>
                    <div className="text-muted">Prep Time</div>
                    <div style={{fontWeight: 600}}>~30 min</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⭐</div>
                    <div className="text-muted">Difficulty</div>
                    <div style={{fontWeight: 600}}>Easy</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Ingredients Section */}
          <Card className="card-modern mb-4">
            <div className="card-header-modern">
              <h5 className="mb-0">Ingredients</h5>
            </div>
            <Card.Body className="card-body-modern">
              <ListGroup variant="flush">
                <ListGroup.Item style={{border: 'none', padding: '0.75rem 0'}}>
                  {meal.description ? (
                    <div className="text-muted">
                      {meal.description.split(',').map((ingredient, idx) => (
                        <div key={idx} className="ingredient-item">
                          <span className="me-2">✓</span>
                          <span>{ingredient.trim()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted">Check recipe description for ingredients</div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Nutrition Panel */}
        <Col lg={4}>
          <Card className="card-modern nutrition-panel">
            <div className="card-header-modern">
              <h5 className="mb-0">Nutrition Facts</h5>
            </div>
            <Card.Body className="card-body-modern">
              {/* Macro Breakdown Chart */}
              <div className="nutrition-chart mb-4">
                <div className="macro-breakdown">
                  <div 
                    className="macro-bar protein"
                    style={{ width: `${proteinPercent}%`, backgroundColor: 'var(--success-dark)' }}
                  >
                    <span>Protein</span>
                  </div>
                  <div 
                    className="macro-bar carbs"
                    style={{ width: `${carbPercent}%`, backgroundColor: 'var(--secondary)' }}
                  >
                    <span>Carbs</span>
                  </div>
                  <div 
                    className="macro-bar fat"
                    style={{ width: `${fatPercent}%`, backgroundColor: 'var(--accent)' }}
                  >
                    <span>Fat</span>
                  </div>
                </div>
              </div>

              {/* Nutrition List */}
              <div className="nutrition-list">
                {nutritionData.map((item, idx) => (
                  <div key={idx} className="nutrition-item">
                    <span className="nutrition-label">{item.label}</span>
                    <span className="nutrition-value">
                      {item.value.toFixed(1)} {item.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rating Display */}
              {meal.average_rating > 0 && (
                <div className="mb-3 pb-3" style={{borderBottom: '1px solid var(--border)'}}>
                  <div className="text-center">
                    <div style={{fontSize: '2rem', color: 'var(--accent)'}}>
                      {'⭐'.repeat(Math.round(meal.average_rating))}
                    </div>
                    <div style={{fontSize: '1.25rem', fontWeight: 600}}>
                      {meal.average_rating.toFixed(1)} / 5.0
                    </div>
                    <div className="text-muted small">
                      {meal.total_ratings} {meal.total_ratings === 1 ? 'rating' : 'ratings'}
                    </div>
                  </div>
                </div>
              )}

              {/* User's Rating */}
              {userRating && (
                <Alert variant="info" className="small mb-3">
                  <strong>Your rating:</strong> {userRating.rating}/5
                  {userRating.review && <div className="mt-1">{userRating.review}</div>}
                </Alert>
              )}

              {/* Actions */}
              <div className="mt-4 pt-3" style={{borderTop: '1px solid var(--border)'}}>
                <Button 
                  className="btn-modern btn-primary-modern w-100 mb-2"
                  onClick={() => setShowLogMealModal(true)}
                  style={{fontWeight: 600}}
                >
                  📊 Log This Meal
                </Button>
                <Button 
                  className={`btn-modern w-100 mb-2 ${isSaved ? 'btn-outline-modern' : 'btn-secondary-modern'}`}
                  onClick={handleSaveToggle}
                >
                  {isSaved ? '❤️ Saved' : '💾 Save Recipe'}
                </Button>
                <Button 
                  className="btn-modern btn-outline-modern w-100"
                  onClick={() => setShowRatingModal(true)}
                >
                  ⭐ {userRating ? 'Update Rating' : 'Rate Recipe'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate this Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating (1-5 stars)</Form.Label>
              <div className="text-center my-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRatingValue(star)}
                    style={{
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: star <= ratingValue ? 'var(--accent)' : '#ccc'
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div className="text-center">
                <strong>{ratingValue} / 5</strong>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Review (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                maxLength={1000}
              />
              <Form.Text className="text-muted">
                {review.length}/1000 characters
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            Cancel
          </Button>
          <Button className="btn-primary-modern" onClick={handleRatingSubmit}>
            Submit Rating
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Log Meal Modal */}
      <LogMealModal
        show={showLogMealModal}
        onHide={() => setShowLogMealModal(false)}
        meal={meal}
        userId={currentUserId}
        onSuccess={() => {
          alert('✅ Meal logged successfully! Check your Nutrition page to see your daily progress.');
        }}
      />
    </Container>
  );
}

export default RecipeDetail;




