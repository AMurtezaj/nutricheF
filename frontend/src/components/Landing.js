import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <Container>
          <Row className="align-items-center">
            <Col lg={10} className="mx-auto text-center hero-content">
              <div className="hero-badge">✨ Powered by AI</div>
              <h1 className="hero-title">
                Transform Ingredients Into<br />
                <span className="gradient-text">Delicious, Healthy Meals</span> 🍽️
              </h1>
              <p className="hero-subtitle">
                Your intelligent meal companion with complete nutrition analysis.<br />
                Get personalized recipes tailored to your preferences, dietary needs, and health goals.
              </p>
              <div className="hero-cta">
                <Link to="/register">
                  <button className="btn-modern btn-primary-modern btn-hero-primary">
                    <span>Get Started Free</span>
                    <span className="btn-icon">→</span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-modern btn-hero-outline">
                    Sign In
                  </button>
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">1,000+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Recipes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Meals Planned</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">
                Why Choose <span className="gradient-text">NutriChef AI</span>?
              </h2>
              <p className="section-subtitle">
                Everything you need to eat healthier and smarter, all in one place
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">🧠</div>
                  </div>
                  <h4 className="feature-title">Smart Recommendations</h4>
                  <p className="feature-description">
                    AI-powered suggestions based on your ingredients, preferences, and health goals
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">📊</div>
                  </div>
                  <h4 className="feature-title">Nutrition Analysis</h4>
                  <p className="feature-description">
                    Complete breakdown of calories, macros, and nutrients for every meal
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">🎯</div>
                  </div>
                  <h4 className="feature-title">Goal Tracking</h4>
                  <p className="feature-description">
                    Monitor your daily nutrition and progress toward your health goals
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">⭐</div>
                  </div>
                  <h4 className="feature-title">Personalized</h4>
                  <p className="feature-description">
                    Tailored meal plans that fit your dietary restrictions and preferences
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Proof */}
      <section className="social-proof py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="social-proof-title">
                Join thousands of users eating healthier
              </h3>
              <div className="rating-stars mb-4">
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="rating-text">4.9/5</span>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-icon">💬</div>
                <p className="testimonial-text">
                  "This app changed how I plan my meals. The AI recommendations are spot on and help me stay on track with my health goals!"
                </p>
                <div className="testimonial-author">
                  <strong>Sarah M.</strong> - Verified User
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{background: '#2C3E50', color: 'white'}}>
        <Container>
          <Row>
            <Col md={6}>
              <h5 style={{fontFamily: 'Poppins', fontWeight: 600}}>NutriChef AI</h5>
              <p className="mb-0" style={{opacity: 0.8}}>
                Intelligent Meal Recommendation & Nutrition Analyzer
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-0" style={{opacity: 0.8}}>
                © 2024 NutriChef AI. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;




