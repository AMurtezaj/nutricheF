import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge, Form, Spinner } from 'react-bootstrap';
import { recommendationAPI } from '../services/api';
import LogMealModal from './LogMealModal';
import './Recommendations.css';

function Recommendations({ currentUserId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadRecommendations();
    }
  }, [currentUserId, category]);

  const loadRecommendations = async () => {
    if (!currentUserId) {
      setError('Please create a user profile first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await recommendationAPI.getRecommendations(
        currentUserId,
        category || null,
        10
      );
      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getDietaryBadges = (meal) => {
    const badges = [];
    if (meal.is_vegetarian) badges.push(<Badge key="veg" bg="success" style={{marginRight: '0.5rem', marginBottom: '0.5rem'}}>🥬 Vegetarian</Badge>);
    if (meal.is_vegan) badges.push(<Badge key="vegan" bg="success" style={{marginRight: '0.5rem', marginBottom: '0.5rem'}}>🌱 Vegan</Badge>);
    if (meal.is_gluten_free) badges.push(<Badge key="gf" bg="info" style={{marginRight: '0.5rem', marginBottom: '0.5rem'}}>🌾 Gluten Free</Badge>);
    return badges;
  };

  const handleMealClick = (mealId) => {
    navigate(`/recipe/${mealId}`);
  };

  if (!currentUserId) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Please create a user profile first to get personalized recommendations.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="recommendations-container mt-4">
      <Row className="mb-4">
        <Col>
          <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem'}}>
            Personalized Recommendations ⭐
          </h1>
          <p className="text-muted" style={{fontSize: '1.1rem'}}>
            Meals tailored just for you based on your preferences and goals
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-control-modern"
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button 
            className="btn-modern btn-secondary-modern w-100"
            onClick={loadRecommendations}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Row className="g-4">
          {[1, 2, 3, 4].map(i => (
            <Col md={6} key={i}>
              <div className="skeleton-card skeleton" style={{height: '400px'}} />
            </Col>
          ))}
        </Row>
      ) : (
        <>
          {recommendations.length > 0 ? (
            <Row className="g-4">
              {recommendations.map((rec) => (
                <Col md={6} lg={4} key={rec.id}>
                  <div className="recipe-card recommendation-card" onClick={() => handleMealClick(rec.id)}>
                    <div className="recipe-image">
                      {rec.category === 'breakfast' && '🥞'}
                      {rec.category === 'lunch' && '🥗'}
                      {rec.category === 'dinner' && '🍽️'}
                      {rec.category === 'snack' && '🍎'}
                      {!rec.category && '🍕'}
                    </div>
                    <div style={{position: 'absolute', top: '1rem', right: '1rem'}}>
                      <Badge bg="success" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                        {(rec.score * 100).toFixed(0)}% Match
                      </Badge>
                    </div>
                    <div className="recipe-content">
                      <h5 className="recipe-title">{rec.name}</h5>
                      <p className="recipe-description">
                        {rec.description || 'Perfectly matched to your preferences'}
                      </p>
                      
                      <div className="mb-3">
                        {getDietaryBadges(rec)}
                      </div>

                      <div className="recipe-stats mb-3">
                        <div className="recipe-stat">
                          <span>🔥</span>
                          <span>{rec.calories} kcal</span>
                        </div>
                        <div className="recipe-stat">
                          <span>💪</span>
                          <span>{rec.protein}g</span>
                        </div>
                        <div className="recipe-stat">
                          <span>📊</span>
                          <span>{rec.category}</span>
                        </div>
                      </div>

                      <div className="recommendation-reason mb-3">
                        <small style={{color: 'var(--text-light)', fontStyle: 'italic'}}>
                          💡 {rec.reason || 'Recommended for you'}
                        </small>
                      </div>

                      <div className="d-grid gap-2">
                        <Button
                          className="btn-modern btn-primary-modern"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMeal(rec);
                            setShowLogMealModal(true);
                          }}
                        >
                          📊 Log Meal
                        </Button>
                        <Button
                          className="btn-modern btn-outline-modern"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMealClick(rec.id);
                          }}
                        >
                          View Recipe →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h4 className="empty-state-title">No recommendations yet</h4>
              <p className="empty-state-text">
                Complete your profile and preferences to get personalized meal recommendations
              </p>
              <Button as="a" href="/profile" className="btn-modern btn-primary-modern mt-3">
                Complete Profile
              </Button>
            </div>
          )}
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

export default Recommendations;

