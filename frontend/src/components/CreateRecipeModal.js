import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { FaMagic, FaPlus, FaTimes } from 'react-icons/fa';
import { aiRecipeAPI } from '../services/api';

const CreateRecipeModal = ({ show, onHide, onSuccess, currentUserId, initialIngredients = [] }) => {
    const [ingredients, setIngredients] = useState(initialIngredients);
    const [newIngredient, setNewIngredient] = useState('');
    const [preferences, setPreferences] = useState({
        calories: '',
        protein: '',
        diet: 'balanced',
        cuisine: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddIngredient = () => {
        if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const removeIngredient = (ing) => {
        setIngredients(ingredients.filter(i => i !== ing));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (ingredients.length < 2) {
            setError('Please add at least 2 ingredients');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await aiRecipeAPI.createRecipe({
                user_id: currentUserId,
                ingredients: ingredients,
                preferences: {
                    ...preferences,
                    calories: preferences.calories ? parseInt(preferences.calories) : null,
                    protein: preferences.protein ? parseInt(preferences.protein) : null
                }
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to create recipe. AI service might be busy.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title><FaMagic className="me-2 text-primary" /> Create AI Recipe</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Alert variant="info">
                        Tell our AI what ingredients you have, and we'll create a unique recipe for you!
                    </Alert>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-4">
                        <Form.Label>Ingredients Available</Form.Label>
                        <div className="d-flex gap-2 mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Add ingredient (e.g., Chicken, Rice)"
                                value={newIngredient}
                                onChange={(e) => setNewIngredient(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                            />
                            <Button variant="outline-primary" onClick={handleAddIngredient}>
                                <FaPlus />
                            </Button>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {ingredients.map((ing, idx) => (
                                <span key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                                    {ing} <FaTimes style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeIngredient(ing)} />
                                </span>
                            ))}
                        </div>
                        {ingredients.length === 0 && <small className="text-muted">No ingredients added yet.</small>}
                    </Form.Group>

                    <h6 className="mb-3">Preferences (Optional)</h6>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Max Calories</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={preferences.calories}
                                    onChange={(e) => setPreferences({ ...preferences, calories: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Min Protein (g)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g. 20"
                                    value={preferences.protein}
                                    onChange={(e) => setPreferences({ ...preferences, protein: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Diet Type</Form.Label>
                                <Form.Select
                                    value={preferences.diet}
                                    onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
                                >
                                    <option value="balanced">Balanced</option>
                                    <option value="low-carb">Low Carb</option>
                                    <option value="high-protein">High Protein</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="vegetarian">Vegetarian</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cuisine Style</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Italian, Asian"
                                    value={preferences.cuisine}
                                    onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading || ingredients.length < 2}>
                        {loading ? 'Creating Recipe...' : 'Generate Recipe'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateRecipeModal;
