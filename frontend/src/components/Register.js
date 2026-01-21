import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import '../styles/design-system.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.create({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      });

      login(response.data.id);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
      background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-2xl)',
      color: 'white',
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
      maxWidth: '520px',
      padding: 'var(--space-xl)',
    },
    title: {
      fontSize: 'var(--text-3xl)',
      marginBottom: 'var(--space-sm)',
      color: 'var(--text-primary)',
      fontWeight: '700',
    },
    subtitle: {
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-lg)',
      fontSize: 'var(--text-base)',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-md)',
    },
    inputGroup: {
      marginBottom: 'var(--space-md)',
    },
    label: {
      display: 'block',
      marginBottom: 'var(--space-xs)',
      fontWeight: '500',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      fontSize: 'var(--text-sm)',
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
      marginTop: 'var(--space-md)',
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel} className="d-none d-lg-flex">
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: 'var(--space-md)' }}>
          Join the Club! 🥑
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, textAlign: 'center', maxWidth: '400px' }}>
          Create your account and start discovering personalized meal plans today.
        </p>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.authCard}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Fill in your details to get started.</p>

          {error && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'rgba(255, 90, 95, 0.1)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
              fontSize: 'var(--text-sm)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name</label>
                <div style={styles.inputWrapper}>
                  <FaUser style={styles.inputIcon} />
                  <input
                    type="text"
                    name="first_name"
                    style={styles.input}
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name</label>
                <div style={styles.inputWrapper}>
                  <FaUser style={styles.inputIcon} />
                  <input
                    type="text"
                    name="last_name"
                    style={styles.input}
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <FaUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="username"
                  style={styles.input}
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  style={styles.input}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type="password"
                  name="confirmPassword"
                  style={styles.input}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
