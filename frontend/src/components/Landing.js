import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaChartPie, FaBullseye, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/design-system.css';

function Landing() {
  const styles = {
    hero: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F2 0%, #FFFFFF 100%)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 var(--space-xl)',
      width: '100%',
      position: 'relative',
      zIndex: 1,
    },
    heroContent: {
      maxWidth: '600px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: 'rgba(255, 107, 53, 0.1)',
      color: 'var(--primary)',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-sm)',
      fontWeight: '600',
      marginBottom: 'var(--space-lg)',
    },
    title: {
      fontSize: '3.5rem',
      lineHeight: '1.2',
      marginBottom: 'var(--space-lg)',
      color: 'var(--text-primary)',
    },
    gradientText: {
      background: 'linear-gradient(135deg, var(--primary) 0%, #FF9F1C 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-xl)',
      lineHeight: '1.6',
    },
    ctaGroup: {
      display: 'flex',
      gap: 'var(--space-md)',
    },
    primaryBtn: {
      padding: '1rem 2rem',
      backgroundColor: 'var(--primary)',
      color: 'white',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-lg)',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 20px rgba(255, 107, 53, 0.2)',
    },
    secondaryBtn: {
      padding: '1rem 2rem',
      backgroundColor: 'white',
      color: 'var(--text-primary)',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-lg)',
      fontWeight: '600',
      border: '1px solid var(--border-color)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    features: {
      padding: '100px 0',
      backgroundColor: 'white',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'var(--space-2xl)',
      marginTop: 'var(--space-2xl)',
    },
    featureCard: {
      textAlign: 'center',
      padding: 'var(--space-xl)',
      borderRadius: 'var(--radius-lg)',
      transition: 'var(--transition)',
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      borderRadius: '24px',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto var(--space-lg)',
      fontSize: '2rem',
      color: 'var(--primary)',
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Navbar (Landing only) */}
      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 0',
        zIndex: 10
      }}>
        <div style={{ ...styles.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '2rem' }}>🥑</span> NutriChef AI
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600' }}>
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <motion.div
            style={styles.heroContent}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={styles.badge}>
              <FaRobot /> Powered by Advanced AI
            </div>
            <h1 style={styles.title}>
              Smart Nutrition for a <br />
              <span style={styles.gradientText}>Healthier You</span>
            </h1>
            <p style={styles.subtitle}>
              Get personalized meal recommendations, track your nutrition goals, and discover recipes tailored to your lifestyle.
            </p>
            <div style={styles.ctaGroup}>
              <Link to="/register">
                <button style={styles.primaryBtn} className="hover-lift">
                  Get Started Free <FaArrowRight />
                </button>
              </Link>
              <Link to="/login">
                <button style={styles.secondaryBtn} className="hover-lift">
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.container}>
          <motion.div
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>Why NutriChef AI?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              We combine nutritional science with artificial intelligence to help you make better food choices effortlessly.
            </p>
          </motion.div>

          <div style={styles.featureGrid}>
            {[
              { icon: FaRobot, color: 'var(--primary)', title: 'AI Recommendations', desc: 'Our smart algorithm learns your preferences to suggest meals you\'ll actually love.' },
              { icon: FaChartPie, color: 'var(--success)', title: 'Nutrition Tracking', desc: 'Keep track of calories, macros, and micros automatically with every meal you log.' },
              { icon: FaBullseye, color: '#3D90E3', title: 'Goal Setting', desc: 'Set custom health goals and let us guide you on the path to achieving them.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                style={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div style={{ ...styles.iconWrapper, color: feature.color }}>
                  <feature.icon />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-2xl) 0', borderTop: '1px solid var(--border-color)', backgroundColor: '#FAFAFA' }}>
        <div style={{ ...styles.container, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            © 2024 NutriChef AI. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

export default Landing;
