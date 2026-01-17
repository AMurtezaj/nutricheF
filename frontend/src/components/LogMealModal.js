import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { mealAPI } from '../services/api';

function LogMealModal({ show, onHide, meal, userId, onSuccess }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('lunch');
  const [servings, setServings] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLog = async () => {
    if (!userId) {
      setError('Please log in to track meals');
      return;
    }

    if (servings <= 0) {
      setError('Servings must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await mealAPI.addUserMeal(userId, {
        meal_id: meal.id,
        date: date,
        meal_type: mealType,
        servings: parseFloat(servings)
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setMealType('lunch');
      setServings(1.0);
      
      onHide();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🍪'
    };
    return icons[type] || '🍽️';
  };

  const calculateNutrition = () => {
    if (!meal) return null;
    
    return {
      calories: (meal.calories * servings).toFixed(0),
      protein: (meal.protein * servings).toFixed(1),
      carbohydrates: (meal.carbohydrates * servings).toFixed(1),
      fat: (meal.fat * servings).toFixed(1),
      fiber: meal.fiber ? (meal.fiber * servings).toFixed(1) : '0',
      sugar: meal.sugar ? (meal.sugar * servings).toFixed(1) : '0'
    };
  };

  const nutrition = calculateNutrition();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{borderBottom: '2px solid var(--border)', paddingBottom: '1rem'}}>
        <Modal.Title style={{fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)'}}>
          📊 Log Meal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{padding: '1.5rem'}}>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        
        {meal && (
          <>
            <div className="mb-4 text-center" style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%)',
              borderRadius: '12px'
            }}>
              <h5 style={{fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)'}}>
                {meal.name}
              </h5>
              <small className="text-muted">
                {meal.category && <span style={{textTransform: 'capitalize'}}>{meal.category}</span>}
              </small>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: 600, color: 'var(--text)'}}>
                  📅 Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{borderRadius: '8px', border: '2px solid var(--border)'}}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                <Form.Text className="text-muted">
                  You can log meals for today or plan ahead (up to 7 days)
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: 600, color: 'var(--text)'}}>
                  🍽️ Meal Type
                </Form.Label>
                <div className="d-grid gap-2">
                  <Row>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                      <Col xs={6} key={type}>
                        <Button
                          variant={mealType === type ? 'primary' : 'outline-secondary'}
                          className="w-100 mb-2"
                          onClick={() => setMealType(type)}
                          style={{
                            borderRadius: '8px',
                            padding: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            border: mealType === type ? '2px solid var(--primary)' : '2px solid var(--border)'
                          }}
                        >
                          {getMealTypeIcon(type)} {type}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{fontWeight: 600, color: 'var(--text)'}}>
                  🔢 Servings
                </Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                    disabled={servings <= 0.5}
                    style={{borderRadius: '8px', width: '40px', height: '40px', fontWeight: 'bold'}}
                  >
                    −
                  </Button>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={servings}
                    onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    style={{
                      borderRadius: '8px',
                      border: '2px solid var(--border)',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setServings(Math.min(10, servings + 0.5))}
                    disabled={servings >= 10}
                    style={{borderRadius: '8px', width: '40px', height: '40px', fontWeight: 'bold'}}
                  >
                    +
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  Adjust servings to match your portion size
                </Form.Text>
              </Form.Group>

              {nutrition && (
                <div style={{
                  background: 'var(--background-light)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border)'
                }}>
                  <h6 style={{fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)'}}>
                    📊 Nutrition Preview
                  </h6>
                  <Row className="g-3">
                    <Col xs={6}>
                      <div className="text-center" style={{
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)'}}>
                          {nutrition.calories}
                        </div>
                        <div className="text-muted" style={{fontSize: '0.85rem'}}>kcal</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center" style={{
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-dark)'}}>
                          {nutrition.protein}g
                        </div>
                        <div className="text-muted" style={{fontSize: '0.85rem'}}>protein</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center" style={{
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)'}}>
                          {nutrition.carbohydrates}g
                        </div>
                        <div className="text-muted" style={{fontSize: '0.85rem'}}>carbs</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-center" style={{
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)'}}>
                          {nutrition.fat}g
                        </div>
                        <div className="text-muted" style={{fontSize: '0.85rem'}}>fat</div>
                      </div>
                    </Col>
                  </Row>
                  {(parseFloat(nutrition.fiber) > 0 || parseFloat(nutrition.sugar) > 0) && (
                    <div className="mt-3 pt-3" style={{borderTop: '1px solid var(--border)'}}>
                      <Row>
                        {parseFloat(nutrition.fiber) > 0 && (
                          <Col xs={6}>
                            <small className="text-muted">Fiber: {nutrition.fiber}g</small>
                          </Col>
                        )}
                        {parseFloat(nutrition.sugar) > 0 && (
                          <Col xs={6}>
                            <small className="text-muted">Sugar: {nutrition.sugar}g</small>
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}
                </div>
              )}
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{borderTop: '2px solid var(--border)', paddingTop: '1rem'}}>
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          disabled={loading}
          style={{borderRadius: '8px', fontWeight: 600}}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleLog}
          disabled={loading || !userId}
          style={{
            borderRadius: '8px',
            fontWeight: 600,
            background: 'var(--primary)',
            border: 'none',
            padding: '0.5rem 1.5rem'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging...
            </>
          ) : (
            <>
              ✓ Log Meal
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogMealModal;
