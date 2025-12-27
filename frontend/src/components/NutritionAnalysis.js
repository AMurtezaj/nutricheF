import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, ProgressBar, Alert, Button } from 'react-bootstrap';
import { nutritionAPI, mealAPI } from '../services/api';

function NutritionAnalysis({ currentUserId }) {
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [userMeals, setUserMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (currentUserId) {
      loadDailyNutrition();
      loadUserMeals();
    }
  }, [currentUserId, selectedDate]);

  const loadDailyNutrition = async () => {
    if (!currentUserId) return;

    setLoading(true);
    setError('');
    try {
      const response = await nutritionAPI.getDailyNutrition(currentUserId, selectedDate);
      setDailyNutrition(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load daily nutrition');
    } finally {
      setLoading(false);
    }
  };

  const loadUserMeals = async () => {
    if (!currentUserId) return;

    try {
      const response = await mealAPI.getUserMeals(currentUserId, selectedDate);
      setUserMeals(response.data);
    } catch (err) {
      console.error('Failed to load user meals:', err);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage <= 50) return 'success';
    if (percentage <= 100) return 'primary';
    return 'danger';
  };

  if (!currentUserId) {
    return (
      <Container>
        <Alert variant="warning">
          Please create a user profile first to view nutrition analysis.
        </Alert>
      </Container>
    );
  }

  if (!dailyNutrition) {
    return (
      <Container>
        <Alert variant="info">Loading nutrition data...</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h3>Daily Nutrition Analysis</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2"
              />
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-2"
                onClick={loadDailyNutrition}
              >
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Row>
                <Col md={3}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>Calories</Card.Title>
                      <h2>{dailyNutrition.total_calories.toFixed(0)}</h2>
                      <p className="text-muted">
                        of {dailyNutrition.targets.calories.toFixed(0)} kcal
                      </p>
                      <ProgressBar
                        variant={getProgressColor(dailyNutrition.progress.calories)}
                        now={Math.min(dailyNutrition.progress.calories, 100)}
                        label={`${dailyNutrition.progress.calories.toFixed(1)}%`}
                      />
                      <p className="mt-2">
                        <small>
                          Remaining: {dailyNutrition.remaining.calories.toFixed(0)} kcal
                        </small>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>Protein</Card.Title>
                      <h2>{dailyNutrition.total_protein.toFixed(1)}g</h2>
                      <p className="text-muted">
                        of {dailyNutrition.targets.protein.toFixed(0)}g
                      </p>
                      <ProgressBar
                        variant={getProgressColor(dailyNutrition.progress.protein)}
                        now={Math.min(dailyNutrition.progress.protein, 100)}
                        label={`${dailyNutrition.progress.protein.toFixed(1)}%`}
                      />
                      <p className="mt-2">
                        <small>
                          Remaining: {dailyNutrition.remaining.protein.toFixed(1)}g
                        </small>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>Carbohydrates</Card.Title>
                      <h2>{dailyNutrition.total_carbohydrates.toFixed(1)}g</h2>
                      <p className="text-muted">
                        of {dailyNutrition.targets.carbohydrates.toFixed(0)}g
                      </p>
                      <ProgressBar
                        variant={getProgressColor(dailyNutrition.progress.carbohydrates)}
                        now={Math.min(dailyNutrition.progress.carbohydrates, 100)}
                        label={`${dailyNutrition.progress.carbohydrates.toFixed(1)}%`}
                      />
                      <p className="mt-2">
                        <small>
                          Remaining: {dailyNutrition.remaining.carbohydrates.toFixed(1)}g
                        </small>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={3}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>Fat</Card.Title>
                      <h2>{dailyNutrition.total_fat.toFixed(1)}g</h2>
                      <p className="text-muted">
                        of {dailyNutrition.targets.fat.toFixed(0)}g
                      </p>
                      <ProgressBar
                        variant={getProgressColor(dailyNutrition.progress.fat)}
                        now={Math.min(dailyNutrition.progress.fat, 100)}
                        label={`${dailyNutrition.progress.fat.toFixed(1)}%`}
                      />
                      <p className="mt-2">
                        <small>
                          Remaining: {dailyNutrition.remaining.fat.toFixed(1)}g
                        </small>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={12}>
                  <Card>
                    <Card.Header>
                      <h5>Meals Logged Today</h5>
                    </Card.Header>
                    <Card.Body>
                      {userMeals.length > 0 ? (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Meal</th>
                              <th>Type</th>
                              <th>Servings</th>
                              <th>Calories</th>
                              <th>Protein</th>
                              <th>Carbs</th>
                              <th>Fat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMeals.map((userMeal) => (
                              <tr key={userMeal.id}>
                                <td>{userMeal.meal?.name || 'N/A'}</td>
                                <td>{userMeal.meal_type}</td>
                                <td>{userMeal.servings}</td>
                                <td>{userMeal.total_calories?.toFixed(0)}</td>
                                <td>{userMeal.total_protein?.toFixed(1)}g</td>
                                <td>{userMeal.total_carbohydrates?.toFixed(1)}g</td>
                                <td>{userMeal.total_fat?.toFixed(1)}g</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <Alert variant="info">
                          No meals logged for this date. Add meals from the Meals page.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NutritionAnalysis;


