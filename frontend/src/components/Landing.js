import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center hero-content">
              <h1 className="hero-title">
                Turn Your Ingredients Into<br />
                Delicious, Healthy Meals 🍽️
              </h1>
              <p className="hero-subtitle">
                AI-powered meal recommendations with complete nutrition analysis.<br />
                Get personalized recipes based on what you have and your health goals.
              </p>
              <div className="hero-cta">
                <Link to="/register">
                  <button className="btn-modern btn-primary-modern me-3">
                    Get Started Free
                  </button>
                </Link>
                <Link to="/login">
                  <button className="btn-modern btn-outline-modern" style={{background: 'rgba(255,255,255,0.2)', borderColor: 'white', color: 'white'}}>
                    Sign In
                  </button>
                </Link>
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
              <h2 className="mb-3" style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem'}}>
                Why Choose NutriChef AI?
              </h2>
              <p className="text-muted" style={{fontSize: '1.1rem'}}>
                Everything you need to eat healthier and smarter
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon mb-3" style={{fontSize: '3rem'}}>🧠</div>
                  <h4 style={{fontFamily: 'Poppins', fontWeight: 600}}>Smart Recommendations</h4>
                  <p className="text-muted">
                    AI-powered suggestions based on your ingredients, preferences, and health goals
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon mb-3" style={{fontSize: '3rem'}}>📊</div>
                  <h4 style={{fontFamily: 'Poppins', fontWeight: 600}}>Nutrition Analysis</h4>
                  <p className="text-muted">
                    Complete breakdown of calories, macros, and nutrients for every meal
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon mb-3" style={{fontSize: '3rem'}}>🎯</div>
                  <h4 style={{fontFamily: 'Poppins', fontWeight: 600}}>Goal Tracking</h4>
                  <p className="text-muted">
                    Monitor your daily nutrition and progress toward your health goals
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="card-modern text-center h-100">
                <div className="card-body-modern">
                  <div className="feature-icon mb-3" style={{fontSize: '3rem'}}>⭐</div>
                  <h4 style={{fontFamily: 'Poppins', fontWeight: 600}}>Personalized</h4>
                  <p className="text-muted">
                    Tailored meal plans that fit your dietary restrictions and preferences
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Proof */}
      <section className="social-proof py-5" style={{background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)', color: 'white'}}>
        <Container>
          <Row className="text-center">
            <Col>
              <h3 style={{fontFamily: 'Poppins', fontWeight: 700, marginBottom: '1rem'}}>
                Join 1,000+ users eating healthier
              </h3>
              <div className="rating-stars mb-3" style={{justifyContent: 'center'}}>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
                <span className="star active">⭐</span>
              </div>
              <p style={{fontSize: '1.1rem', opacity: 0.95}}>
                "This app changed how I plan my meals. The recommendations are spot on!" - Sarah M.
              </p>
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


