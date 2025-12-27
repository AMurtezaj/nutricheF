import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home({ currentUserId, setCurrentUserId }) {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.create({
        email: userEmail,
        username: username,
        first_name: firstName,
        last_name: lastName,
      });
      setCurrentUserId(response.data.id);
      setSuccess('User created successfully! Redirecting to profile...');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.get(currentUserId);
      setSuccess('User loaded successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h2>Welcome to Meal Recommendation & Nutrition Analyzer</h2>
            </Card.Header>
            <Card.Body>
              <p className="lead">
                Get personalized meal recommendations based on your preferences, dietary restrictions, 
                and health goals. Track your daily nutrition and make informed food choices.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {!currentUserId ? (
                <div>
                  <h4 className="mt-4">Create New Account</h4>
                  <Form onSubmit={handleCreateUser}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </Form>
                </div>
              ) : (
                <div className="mt-4">
                  <Alert variant="info">
                    Current User ID: {currentUserId}
                  </Alert>
                  <Button variant="primary" onClick={() => navigate('/profile')}>
                    Go to Profile
                  </Button>
                </div>
              )}

              <Row className="mt-5">
                <Col md={4}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>🍽️ Browse Meals</Card.Title>
                      <Card.Text>
                        Explore our extensive meal database with detailed nutritional information.
                      </Card.Text>
                      <Button variant="outline-primary" onClick={() => navigate('/meals')}>
                        Browse Meals
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>⭐ Get Recommendations</Card.Title>
                      <Card.Text>
                        Receive personalized meal recommendations based on your preferences and goals.
                      </Card.Text>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => navigate('/recommendations')}
                        disabled={!currentUserId}
                      >
                        Get Recommendations
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="nutrition-card">
                    <Card.Body>
                      <Card.Title>📊 Nutrition Analysis</Card.Title>
                      <Card.Text>
                        Track your daily nutrition intake and monitor your progress.
                      </Card.Text>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => navigate('/nutrition')}
                        disabled={!currentUserId}
                      >
                        View Analysis
                      </Button>
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

export default Home;


