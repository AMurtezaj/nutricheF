import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import '../styles/design-system.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.getAll();
      const user = response.data.find(u => u.email === email);

      if (!user) {
        setError('Invalid email. Please check your credentials.');
        setLoading(false);
        return;
      }

      login(user.id);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
    },
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-2xl)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--bg-surface)',
    },
    authCard: {
      width: '100%',
      maxWidth: '480px',
      padding: 'var(--space-2xl)',
    },
    title: {
      fontSize: 'var(--text-4xl)',
      marginBottom: 'var(--space-sm)',
      color: 'var(--text-primary)',
      fontWeight: '700',
    },
    subtitle: {
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-xl)',
      fontSize: 'var(--text-lg)',
    },
    inputGroup: {
      marginBottom: 'var(--space-lg)',
    },
    label: {
      display: 'block',
      marginBottom: 'var(--space-xs)',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 2.5rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      fontSize: 'var(--text-base)',
      transition: 'var(--transition)',
      outline: 'none',
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-tertiary)',
    },
    button: {
      width: '100%',
      padding: '0.875rem',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--primary)',
      color: 'white',
      border: 'none',
      fontSize: 'var(--text-base)',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'var(--transition)',
      marginBottom: 'var(--space-lg)',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      color: 'var(--text-tertiary)',
      margin: 'var(--space-lg) 0',
      fontSize: 'var(--text-sm)',
    },
    line: {
      flex: 1,
      height: '1px',
      backgroundColor: 'var(--border-color)',
    },
    socialBtn: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      backgroundColor: 'white',
      color: 'var(--text-primary)',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-sm)',
      marginBottom: 'var(--space-sm)',
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Brand */}
      <motion.div
        style={styles.leftPanel}
        className="d-none d-lg-flex"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: 'var(--space-md)' }}>
          NutriChef AI 🍽️
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, textAlign: 'center', maxWidth: '400px' }}>
          Your personal nutrition assistant. Discover meals, track calories, and live healthier.
        </p>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div style={styles.rightPanel}>
        <motion.div
          style={styles.authCard}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Please enter your details to sign in.</p>

          {error && (
            <div style={{
              padding: 'var(--space-md)',
              backgroundColor: 'rgba(255, 90, 95, 0.1)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: 'var(--space-xs)' }}>
                <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: '500' }}>
                  Forgot Password?
                </a>
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <span>Or continue with</span>
            <div style={styles.line}></div>
          </div>

          <button style={styles.socialBtn}>
            <FaGoogle color="#DB4437" /> Google
          </button>
          <button style={styles.socialBtn}>
            <FaFacebookF color="#4267B2" /> Facebook
          </button>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
