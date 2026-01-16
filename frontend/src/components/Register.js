import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { userAPI } from '../services/api';
import './Auth.css';

function Register({ setCurrentUserId }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.create({
        email: formData.email,
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      setCurrentUserId(response.data.id);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'danger' };
    if (password.length < 10) return { strength: 2, text: 'Medium', color: 'warning' };
    return { strength: 3, text: 'Strong', color: 'success' };
  };

  const pwdStrength = passwordStrength(formData.password);

  return (
    <div className="split-screen">
      <div className="split-left d-none d-lg-flex">
        <div className="text-center text-white">
          <h1 style={{fontFamily: 'Poppins', fontSize: '3rem', fontWeight: 700, marginBottom: '1rem'}}>
            Join NutriChef AI! 🎉
          </h1>
          <p style={{fontSize: '1.25rem', opacity: 0.9}}>
            Start your journey to healthier eating today
          </p>
        </div>
      </div>
      
      <div className="split-right">
        <div className="split-content">
          <div className="card-modern">
            <div className="card-body-modern">
              <div className="text-center mb-4">
                <h2 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: 'var(--primary)'}}>
                  🍽️ NutriChef AI
                </h2>
                <p className="text-muted mt-2">Create your free account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-modern">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        className="form-control-modern"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-modern">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        className="form-control-modern"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    className="form-control-modern"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="form-control-modern"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    className="form-control-modern"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {formData.password && (
                    <div className="mt-2">
                      <div className="progress-modern">
                        <div
                          className={`progress-bar-modern bg-${pwdStrength.color}`}
                          style={{ width: `${(pwdStrength.strength / 3) * 100}%` }}
                        />
                      </div>
                      <small className={`text-${pwdStrength.color}`}>
                        Password strength: {pwdStrength.text}
                      </small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    className="form-control-modern"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span>
                        I agree to the{' '}
                        <Link to="#" style={{color: 'var(--primary)'}}>Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link to="#" style={{color: 'var(--primary)'}}>Privacy Policy</Link>
                      </span>
                    }
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-modern btn-primary-modern w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: 600}}>
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;




