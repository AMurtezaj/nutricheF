import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaChartLine, FaUtensils, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import '../styles/design-system.css';

function UserProfile() {
  const { currentUserId, refreshUser } = useUser();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [prefEditMode, setPrefEditMode] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      loadUser();
      loadPreferences();
    }
  }, [currentUserId]);

  const loadUser = async () => {
    try {
      const response = await userAPI.get(currentUserId);
      setUser(response.data);
    } catch (err) {
      setError('Failed to load user profile');
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await userAPI.getPreferences(currentUserId);
      setPreferences(response.data);
    } catch (err) {
      console.error('Failed to load preferences', err);
      setPreferences(null);
    }
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      if (type === 'user') {
        const userData = {
          age: formData.get('age') ? parseInt(formData.get('age')) : null,
          gender: formData.get('gender') || null,
          height: formData.get('height') ? parseFloat(formData.get('height')) : null,
          weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
          activity_level: formData.get('activity_level') || null,
          goal: formData.get('goal') || null,
        };
        await userAPI.update(currentUserId, userData);
        setEditMode(false);
        loadUser();
        refreshUser(); // Update global user context
      } else {
        const prefData = {
          vegetarian: formData.get('vegetarian') === 'on',
          vegan: formData.get('vegan') === 'on',
          gluten_free: formData.get('gluten_free') === 'on',
          dairy_free: formData.get('dairy_free') === 'on',
          nut_free: formData.get('nut_free') === 'on',
          halal: formData.get('halal') === 'on',
          kosher: formData.get('kosher') === 'on',
          preferred_cuisine: formData.get('preferred_cuisine') || null,
          favorite_ingredients: formData.get('favorite_ingredients') || null,
          disliked_ingredients: formData.get('disliked_ingredients') || null,
        };
        await userAPI.updatePreferences(currentUserId, prefData);
        setPrefEditMode(false);
        loadPreferences();
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      border: '1px solid var(--border-color)',
      height: '100%',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 'var(--space-lg)',
      borderBottom: '1px solid var(--border-color)',
      paddingBottom: 'var(--space-md)',
    },
    title: {
      fontSize: 'var(--text-xl)',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
    },
    infoGrid: {
      display: 'grid',
      gap: 'var(--space-md)',
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 'var(--space-sm) 0',
      borderBottom: '1px solid var(--bg-app)',
    },
    label: {
      color: 'var(--text-secondary)',
      fontWeight: '500',
    },
    value: {
      fontWeight: '600',
      color: 'var(--text-primary)',
      textTransform: 'capitalize',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-soft)',
      color: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: 'var(--space-md)',
      margin: '0 auto',
    }
  };

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <PageContainer title="My Profile" subtitle="Manage your account & preferences">
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Row className="g-4">
        {/* User Stats Card */}
        <Col lg={4}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <div style={styles.avatar}>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', margin: 0 }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                @{user.username}
              </p>
            </div>

            <div style={styles.header}>
              <h3 style={styles.title}><FaChartLine /> Targets</h3>
            </div>

            {user.daily_calorie_target && (
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Calories</span>
                  <span style={styles.value}>{user.daily_calorie_target.toFixed(0)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Protein</span>
                  <span style={styles.value}>{user.daily_protein_target?.toFixed(0)}g</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Carbs</span>
                  <span style={styles.value}>{user.daily_carb_target?.toFixed(0)}g</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Fat</span>
                  <span style={styles.value}>{user.daily_fat_target?.toFixed(0)}g</span>
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* User Details & Edit Form */}
        <Col lg={8}>
          <div style={{ ...styles.card, marginBottom: 'var(--space-lg)' }}>
            <div style={styles.header}>
              <h3 style={styles.title}><FaUser /> Personal Details</h3>
              <Button
                variant="link"
                onClick={() => setEditMode(!editMode)}
                style={{ textDecoration: 'none', color: 'var(--primary)' }}
              >
                {editMode ? <span className="d-flex align-items-center gap-2"><FaTimes /> Cancel</span> : <span className="d-flex align-items-center gap-2"><FaEdit /> Edit</span>}
              </Button>
            </div>

            {editMode ? (
              <Form onSubmit={(e) => handleUpdate(e, 'user')}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="number" name="age" defaultValue={user.age} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" defaultValue={user.gender}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Height (cm)</Form.Label>
                    <Form.Control type="number" step="0.1" name="height" defaultValue={user.height} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control type="number" step="0.1" name="weight" defaultValue={user.weight} />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Activity</Form.Label>
                    <Form.Select name="activity_level" defaultValue={user.activity_level}>
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                      <option value="extremely_active">Extremely Active</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Goal</Form.Label>
                    <Form.Select name="goal" defaultValue={user.goal}>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle_gain">Muscle Gain</option>
                    </Form.Select>
                  </Col>
                </Row>
                <div className="text-end">
                  <Button type="submit" disabled={loading} className="btn-primary-modern">
                    <FaSave className="me-2" /> Save Changes
                  </Button>
                </div>
              </Form>
            ) : (
              <Row>
                <Col md={6}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Age</span>
                      <span style={styles.value}>{user.age || '-'}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Gender</span>
                      <span style={styles.value}>{user.gender || '-'}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Height</span>
                      <span style={styles.value}>{user.height ? `${user.height} cm` : '-'}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Weight</span>
                      <span style={styles.value}>{user.weight ? `${user.weight} kg` : '-'}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Activity</span>
                      <span style={styles.value}>{user.activity_level?.replace('_', ' ') || '-'}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Goal</span>
                      <span style={styles.value}>{user.goal?.replace('_', ' ') || '-'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </div>

          <div style={styles.card}>
            <div style={styles.header}>
              <h3 style={styles.title}><FaUtensils /> Dietary Preferences</h3>
              <Button
                variant="link"
                onClick={() => setPrefEditMode(!prefEditMode)}
                style={{ textDecoration: 'none', color: 'var(--primary)' }}
              >
                {prefEditMode ? <span className="d-flex align-items-center gap-2"><FaTimes /> Cancel</span> : <span className="d-flex align-items-center gap-2"><FaEdit /> Edit</span>}
              </Button>
            </div>

            {prefEditMode ? (
              <Form onSubmit={(e) => handleUpdate(e, 'pref')}>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free', 'Nut Free', 'Halal', 'Kosher'].map(type => (
                    <Form.Check
                      key={type}
                      type="checkbox"
                      id={type.toLowerCase().replace(' ', '_')}
                      name={type.toLowerCase().replace(' ', '_')}
                      label={type}
                      defaultChecked={preferences?.[type.toLowerCase().replace(' ', '_')]}
                    />
                  ))}
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Cuisine</Form.Label>
                  <Form.Control name="preferred_cuisine" defaultValue={preferences?.preferred_cuisine} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Favorite Ingredients</Form.Label>
                  <Form.Control name="favorite_ingredients" defaultValue={preferences?.favorite_ingredients} />
                </Form.Group>
                <div className="text-end">
                  <Button type="submit" disabled={loading} className="btn-primary-modern">
                    <FaSave className="me-2" /> Save Preferences
                  </Button>
                </div>
              </Form>
            ) : (
              <div>
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <span style={styles.label}>Restrictions: </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {[
                      preferences?.vegetarian && 'Vegetarian',
                      preferences?.vegan && 'Vegan',
                      preferences?.gluten_free && 'Gluten Free',
                      preferences?.dairy_free && 'Dairy Free',
                      preferences?.nut_free && 'Nut Free',
                      preferences?.halal && 'Halal',
                      preferences?.kosher && 'Kosher'
                    ].filter(Boolean).map(tag => (
                      <span key={tag} style={{
                        backgroundColor: 'rgba(46, 196, 182, 0.1)',
                        color: 'var(--secondary-dark)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: 'var(--text-sm)'
                      }}>
                        {tag}
                      </span>
                    ))}
                    {!preferences && <span style={{ color: 'var(--text-tertiary)' }}>No restrictions set</span>}
                  </div>
                </div>
                {preferences?.preferred_cuisine && (
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Cuisine</span>
                    <span style={styles.value}>{preferences.preferred_cuisine}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
}

export default UserProfile;
