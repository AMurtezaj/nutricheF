import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button, Row, Col, InputGroup, Badge, Alert, Modal } from 'react-bootstrap';
import { mealAPI } from '../services/api';

function MealSearch({ currentUserId }) {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servings, setServings] = useState(1.0);
  const [mealType, setMealType] = useState('breakfast');
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    loadMeals();
  }, [category]);

  const loadMeals = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await mealAPI.getAll(0, 100, category || null);
      setMeals(response.data);
    } catch (err) {
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMeals();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await mealAPI.search(searchQuery);
      setMeals(response.data);
    } catch (err) {
      setError('Failed to search meals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!currentUserId) {
      alert('Please create a user profile first');
      return;
    }

    try {
      await mealAPI.addUserMeal(currentUserId, {
        meal_id: selectedMeal.id,
        date: new Date().toISOString().split('T')[0],
        meal_type: mealType,
        servings: servings,
      });
      setAddSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setAddSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add meal');
    }
  };

  const openMealModal = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
    setServings(1.0);
  };

  const getDietaryBadges = (meal) => {
    const badges = [];
    if (meal.is_vegetarian) badges.push(<Badge key="veg" bg="success">Vegetarian</Badge>);
    if (meal.is_vegan) badges.push(<Badge key="vegan" bg="success">Vegan</Badge>);
    if (meal.is_gluten_free) badges.push(<Badge key="gf" bg="info">Gluten Free</Badge>);
    if (meal.is_dairy_free) badges.push(<Badge key="df" bg="info">Dairy Free</Badge>);
    return badges;
  };

  return (
    <Container>
      <Card>
        <Card.Header>
          <h3>Meal Search</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" onClick={loadMeals}>
                Show All
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <p>Loading meals...</p>
          ) : (
            <Row>
              {meals.map((meal) => (
                <Col md={4} key={meal.id} className="mb-3">
                  <Card className="meal-card">
                    <Card.Body>
                      <Card.Title>{meal.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{meal.category}</Card.Subtitle>
                      {meal.description && <Card.Text>{meal.description}</Card.Text>}
                      
                      <div className="mb-2">
                        {getDietaryBadges(meal)}
                      </div>

                      <div className="nutrition-info">
                        <p><strong>Calories:</strong> {meal.calories} kcal</p>
                        <p><strong>Protein:</strong> {meal.protein}g | <strong>Carbs:</strong> {meal.carbohydrates}g | <strong>Fat:</strong> {meal.fat}g</p>
                      </div>

                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => openMealModal(meal)}
                        disabled={!currentUserId}
                      >
                        {currentUserId ? 'Add to Daily Log' : 'Login Required'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {meals.length === 0 && !loading && (
            <Alert variant="info">No meals found. Try adjusting your search.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Add Meal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add {selectedMeal?.name} to Daily Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {addSuccess ? (
            <Alert variant="success">Meal added successfully!</Alert>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Meal Type</Form.Label>
                <Form.Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Servings</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={servings}
                  onChange={(e) => setServings(parseFloat(e.target.value))}
                />
              </Form.Group>
              {selectedMeal && (
                <div className="nutrition-preview">
                  <p><strong>Total Nutrition:</strong></p>
                  <p>Calories: {(selectedMeal.calories * servings).toFixed(1)} kcal</p>
                  <p>Protein: {(selectedMeal.protein * servings).toFixed(1)}g</p>
                  <p>Carbs: {(selectedMeal.carbohydrates * servings).toFixed(1)}g</p>
                  <p>Fat: {(selectedMeal.fat * servings).toFixed(1)}g</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {!addSuccess && (
            <Button variant="primary" onClick={handleAddMeal}>
              Add Meal
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MealSearch;




