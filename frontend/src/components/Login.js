import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { userAPI } from '../services/api';
import './Auth.css';

function Login({ setCurrentUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // For demo purposes - in real app, you'd have proper auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Since we don't have a login endpoint, we'll search for user by email
      // In a real app, you'd authenticate with email/password
      alert('Demo: For now, please create an account or use the home page to create a user');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      <div className="split-left d-none d-lg-flex">
        <div className="text-center text-white">
          <h1 style={{fontFamily: 'Poppins', fontSize: '3rem', fontWeight: 700, marginBottom: '1rem'}}>
            Welcome Back! 👋
          </h1>
          <p style={{fontSize: '1.25rem', opacity: 0.9}}>
            Sign in to continue your healthy journey
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
                <p className="text-muted mt-2">Sign in to your account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    className="form-control-modern"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="form-control-modern"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="text-end mt-2">
                    <Link to="#" style={{color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem'}}>
                      Forgot password?
                    </Link>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    className="form-label-modern"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-modern btn-primary-modern w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: 600}}>
                      Sign up here
                    </Link>
                  </p>
                </div>

                <div className="mt-4">
                  <div className="divider">
                    <span>Or continue with</span>
                  </div>
                  <div className="social-login mt-3">
                    <Button variant="outline" className="w-100 mb-2" style={{borderColor: 'var(--border)', borderRadius: '12px'}}>
                      🔵 Continue with Google
                    </Button>
                    <Button variant="outline" className="w-100" style={{borderColor: 'var(--border)', borderRadius: '12px'}}>
                      📘 Continue with Facebook
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


