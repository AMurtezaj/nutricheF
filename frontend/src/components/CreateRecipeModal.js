import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { aiRecipeAPI } from '../services/api';

function CreateRecipeModal({ show, onHide, onSuccess, currentUserId, initialIngredients = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'dinner',
    ingredients: initialIngredients.join(', '),
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    fiber: '0',
    sugar: '0',
    sodium: '0',
    serving_size: '',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_dairy_free: false,
    is_nut_free: false,
    is_halal: false,
    is_kosher: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.ingredients || !formData.calories || 
        !formData.protein || !formData.carbohydrates || !formData.fat) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const recipeData = {
        ...formData,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbohydrates: parseFloat(formData.carbohydrates),
        fat: parseFloat(formData.fat),
        fiber: parseFloat(formData.fiber) || 0,
        sugar: parseFloat(formData.sugar) || 0,
        sodium: parseFloat(formData.sodium) || 0,
        created_by_user_id: currentUserId,
      };

      await aiRecipeAPI.createRecipe(recipeData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create recipe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Recipe</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Recipe Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Chicken Fried Rice"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the recipe..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ingredients * (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              placeholder="e.g., chicken, rice, tomatoes, onions, garlic"
            />
            <Form.Text className="text-muted">
              Separate ingredients with commas. This helps the AI match your recipe to ingredient searches.
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Calories *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Protein (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Carbs (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="carbohydrates"
                  value={formData.carbohydrates}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fat (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Serving Size</Form.Label>
                <Form.Control
                  type="text"
                  name="serving_size"
                  value={formData.serving_size}
                  onChange={handleChange}
                  placeholder="e.g., 1 cup, 200g"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Fiber (g)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="fiber"
                  value={formData.fiber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sugar (g)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="sugar"
                  value={formData.sugar}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Dietary Tags</Form.Label>
            <Row>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Vegetarian"
                  name="is_vegetarian"
                  checked={formData.is_vegetarian}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Vegan"
                  name="is_vegan"
                  checked={formData.is_vegan}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Gluten Free"
                  name="is_gluten_free"
                  checked={formData.is_gluten_free}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Dairy Free"
                  name="is_dairy_free"
                  checked={formData.is_dairy_free}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Nut Free"
                  name="is_nut_free"
                  checked={formData.is_nut_free}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Halal"
                  name="is_halal"
                  checked={formData.is_halal}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Kosher"
                  name="is_kosher"
                  checked={formData.is_kosher}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Recipe'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateRecipeModal;

