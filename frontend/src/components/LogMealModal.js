import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaUtensils, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { mealAPI } from '../services/api';

const LogMealModal = ({ show, onHide, meal, userId, onSuccess }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealType, setMealType] = useState('lunch');
    const [servings, setServings] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (meal) {
                // Logging an existing meal
                await mealAPI.addUserMeal(userId, {
                    meal_id: meal.id,
                    date: date,  // Backend expects 'date' not 'meal_date'
                    meal_type: mealType,
                    servings: parseFloat(servings)
                });
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to log meal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!meal) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title><FaUtensils /> Log Meal</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="d-flex align-items-center mb-4">
                        {meal.image_url && (
                            <img
                                src={meal.image_url}
                                alt={meal.name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                            />
                        )}
                        <div>
                            <h5 className="mb-1">{meal.name}</h5>
                            <small className="text-muted">{meal.calories} kcal • {meal.protein}g Protein</small>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Meal Type</Form.Label>
                        <Form.Select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                        >
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
                            min="0.5"
                            step="0.5"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Logging...' : 'Log Meal'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default LogMealModal;
