import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { nutritionAPI, userAPI } from '../services/api';
import './Dashboard.css';

function Dashboard({ currentUserId }) {
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadData();
    } else {
      navigate('/');
    }
  }, [currentUserId]);

  const loadData = async () => {
    try {
      const [nutritionResponse, userResponse] = await Promise.all([
        nutritionAPI.getDailyNutrition(currentUserId),
        userAPI.get(currentUserId)
      ]);
      setDailyNutrition(nutritionResponse.data);
      setUser(userResponse.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
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

  if (!dailyNutrition || !user) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Failed to load dashboard data.</Alert>
      </Container>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculatePercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage <= 50) return 'success';
    if (percentage <= 100) return 'primary';
    return 'danger';
  };

  return (
    <Container className="dashboard-container mt-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem'}}>
            {getGreeting()}, {user.first_name}! 👋
          </h1>
          <p className="text-muted" style={{fontSize: '1.1rem'}}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <div className="stat-card">
            <div className="stat-label">Today's Calories</div>
            <div className="stat-value">
              {dailyNutrition.total_calories.toFixed(0)}
              <small className="text-muted" style={{fontSize: '1rem', fontWeight: 400}}>
                {' / '}{dailyNutrition.targets.calories.toFixed(0)}
              </small>
            </div>
            <div className="progress-modern mt-2">
              <div
                className={`progress-bar-modern ${getProgressColor(calculatePercentage(dailyNutrition.total_calories, dailyNutrition.targets.calories)) === 'success' ? 'success' : ''}`}
                style={{ width: `${calculatePercentage(dailyNutrition.total_calories, dailyNutrition.targets.calories)}%` }}
              />
            </div>
          </div>
        </Col>

        <Col md={6} lg={3}>
          <div className="stat-card success">
            <div className="stat-label">Protein</div>
            <div className="stat-value">
              {dailyNutrition.total_protein.toFixed(1)}g
              <small className="text-muted" style={{fontSize: '1rem', fontWeight: 400}}>
                {' / '}{dailyNutrition.targets.protein.toFixed(0)}g
              </small>
            </div>
            <div className="progress-modern mt-2">
              <div
                className="progress-bar-modern success"
                style={{ width: `${calculatePercentage(dailyNutrition.total_protein, dailyNutrition.targets.protein)}%` }}
              />
            </div>
          </div>
        </Col>

        <Col md={6} lg={3}>
          <div className="stat-card secondary">
            <div className="stat-label">Carbohydrates</div>
            <div className="stat-value">
              {dailyNutrition.total_carbohydrates.toFixed(1)}g
              <small className="text-muted" style={{fontSize: '1rem', fontWeight: 400}}>
                {' / '}{dailyNutrition.targets.carbohydrates.toFixed(0)}g
              </small>
            </div>
            <div className="progress-modern mt-2">
              <div
                className="progress-bar-modern"
                style={{ 
                  width: `${calculatePercentage(dailyNutrition.total_carbohydrates, dailyNutrition.targets.carbohydrates)}%`,
                  background: 'linear-gradient(90deg, var(--secondary) 0%, var(--secondary-dark) 100%)'
                }}
              />
            </div>
          </div>
        </Col>

        <Col md={6} lg={3}>
          <div className="stat-card accent">
            <div className="stat-label">Fat</div>
            <div className="stat-value">
              {dailyNutrition.total_fat.toFixed(1)}g
              <small className="text-muted" style={{fontSize: '1rem', fontWeight: 400}}>
                {' / '}{dailyNutrition.targets.fat.toFixed(0)}g
              </small>
            </div>
            <div className="progress-modern mt-2">
              <div
                className="progress-bar-modern"
                style={{ 
                  width: `${calculatePercentage(dailyNutrition.total_fat, dailyNutrition.targets.fat)}%`,
                  background: 'linear-gradient(90deg, var(--accent) 0%, #FFD54F 100%)'
                }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="card-modern">
            <Card.Body className="card-body-modern">
              <h4 style={{fontFamily: 'Poppins', fontWeight: 600, marginBottom: '1.5rem'}}>Quick Actions</h4>
              <Row className="g-3">
                <Col md={4}>
                  <Link to="/meals" className="text-decoration-none">
                    <Button className="btn-modern btn-primary-modern w-100">
                      🔍 Find Meals
                    </Button>
                  </Link>
                </Col>
                <Col md={4}>
                  <Link to="/recommendations" className="text-decoration-none">
                    <Button className="btn-modern btn-secondary-modern w-100">
                      ⭐ Get Recommendations
                    </Button>
                  </Link>
                </Col>
                <Col md={4}>
                  <Link to="/nutrition" className="text-decoration-none">
                    <Button className="btn-modern btn-outline-modern w-100">
                      📊 View Nutrition
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Goal Summary */}
      {user.goal && (
        <Row className="mb-4">
          <Col>
            <Card className="card-modern">
              <div className="card-header-modern">
                <h5 className="mb-0">Your Health Goal</h5>
              </div>
              <Card.Body className="card-body-modern">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 style={{fontFamily: 'Poppins', fontWeight: 600, textTransform: 'capitalize'}}>
                      {user.goal.replace('_', ' ')} 🎯
                    </h4>
                    <p className="text-muted mb-0">
                      Daily target: {user.daily_calorie_target?.toFixed(0) || 'Not set'} calories
                    </p>
                  </div>
                  <div className="text-end">
                    <div style={{fontSize: '2rem'}}>
                      {user.goal === 'weight_loss' && '⚖️'}
                      {user.goal === 'muscle_gain' && '💪'}
                      {user.goal === 'maintenance' && '✅'}
                      {user.goal === 'weight_gain' && '📈'}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tips Section */}
      <Row>
        <Col>
          <Card className="card-modern">
            <Card.Body className="card-body-modern">
              <h4 style={{fontFamily: 'Poppins', fontWeight: 600, marginBottom: '1rem'}}>💡 Daily Tip</h4>
              <p className="mb-0" style={{fontSize: '1.1rem', lineHeight: 1.8}}>
                {dailyNutrition.total_protein < dailyNutrition.targets.protein * 0.8 
                  ? "Try adding more protein to your meals today! Protein helps with muscle recovery and keeps you feeling full longer. 🥩"
                  : dailyNutrition.total_calories < dailyNutrition.targets.calories * 0.5
                  ? "You're doing great! Make sure to have balanced meals throughout the day to meet your calorie goals. 🍽️"
                  : "Keep up the excellent work! Your nutrition is well-balanced. Continue making healthy choices! 🌟"
                }
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;

