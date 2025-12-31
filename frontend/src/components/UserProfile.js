import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { userAPI } from '../services/api';
import './UserProfile.css';

function UserProfile({ currentUserId, setCurrentUserId }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [prefEditMode, setPrefEditMode] = useState(false);

  const getErrorMessage = (err, fallback) => {
    const detail = err?.response?.data?.detail;
    if (!detail) return fallback;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (!item) return null;
          const rawMsg = item.msg || '';
          // Make generic Pydantic string errors more user-friendly
          if (rawMsg.includes('Input should be a valid string')) {
            return 'This field is required';
          }
          return rawMsg || JSON.stringify(item);
        })
        .filter(Boolean)
        .join(' | ');
    }
    try {
      return JSON.stringify(detail);
    } catch {
      return fallback;
    }
  };

  // Scroll to top when a new error or success message appears
  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error, success]);

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
      // If preferences don't exist yet or fail to load, we can safely ignore and treat as empty
      console.error('Failed to load preferences', err);
      setPreferences(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const userData = {
        age: formData.get('age') ? parseInt(formData.get('age')) : null,
        gender: formData.get('gender') || null,
        height: formData.get('height') ? parseFloat(formData.get('height')) : null,
        weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
        activity_level: formData.get('activity_level') || null,
        goal: formData.get('goal') || null,
      };

      await userAPI.update(currentUserId, userData);
      setSuccess('Profile updated successfully!');
      loadUser();
      setEditMode(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const preferenceData = {
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

      await userAPI.updatePreferences(currentUserId, preferenceData);
      setSuccess('Preferences updated successfully!');
      await loadPreferences();
      setPrefEditMode(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update preferences'));
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId) {
    return (
      <Container>
        <Alert variant="warning">Please create or select a user first.</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert variant="info">Loading user profile...</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container mt-4">
      <Row className="mb-4">
        <Col>
          <h1 style={{fontFamily: 'Poppins', fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem'}}>
            Profile & Settings ⚙️
          </h1>
          <p className="text-muted" style={{fontSize: '1.1rem'}}>
            Manage your profile information and dietary preferences
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Row className="g-4">
        <Col lg={6}>
          <Card className="card-modern">
            <div className="card-header-modern">
              <h5 className="mb-0">User Profile</h5>
            </div>
            <Card.Body className="card-body-modern">
              {!editMode ? (
                <div>
                  <div className="profile-header mb-4 text-center">
                    <div className="profile-avatar mb-3">
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: 'white',
                        margin: '0 auto'
                      }}>
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                      <h3 style={{fontFamily: 'Poppins', fontWeight: 600, marginTop: '1rem'}}>
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-muted">{user.email}</p>
                    </div>
                  </div>

                  <div className="profile-info">
                    <div className="info-item">
                      <span className="info-label">Username</span>
                      <span className="info-value">{user.username}</span>
                    </div>
                    {user.age && (
                      <div className="info-item">
                        <span className="info-label">Age</span>
                        <span className="info-value">{user.age} years</span>
                      </div>
                    )}
                    {user.gender && (
                      <div className="info-item">
                        <span className="info-label">Gender</span>
                        <span className="info-value" style={{textTransform: 'capitalize'}}>{user.gender}</span>
                      </div>
                    )}
                    {user.height && (
                      <div className="info-item">
                        <span className="info-label">Height</span>
                        <span className="info-value">{user.height} cm</span>
                      </div>
                    )}
                    {user.weight && (
                      <div className="info-item">
                        <span className="info-label">Weight</span>
                        <span className="info-value">{user.weight} kg</span>
                      </div>
                    )}
                    {user.activity_level && (
                      <div className="info-item">
                        <span className="info-label">Activity Level</span>
                        <span className="info-value" style={{textTransform: 'capitalize'}}>
                          {user.activity_level.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    {user.goal && (
                      <div className="info-item">
                        <span className="info-label">Health Goal</span>
                        <Badge bg="primary" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                          {user.goal.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {user.daily_calorie_target && (
                    <div className="daily-targets mt-4 pt-4" style={{borderTop: '1px solid var(--border)'}}>
                      <h5 style={{fontFamily: 'Poppins', fontWeight: 600, marginBottom: '1rem'}}>Daily Targets</h5>
                      <Row className="g-3">
                        <Col xs={6}>
                          <div className="target-item">
                            <div className="target-label">Calories</div>
                            <div className="target-value">{user.daily_calorie_target.toFixed(0)} kcal</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="target-item">
                            <div className="target-label">Protein</div>
                            <div className="target-value">{user.daily_protein_target?.toFixed(0)}g</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="target-item">
                            <div className="target-label">Carbs</div>
                            <div className="target-value">{user.daily_carb_target?.toFixed(0)}g</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="target-item">
                            <div className="target-label">Fat</div>
                            <div className="target-value">{user.daily_fat_target?.toFixed(0)}g</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Button 
                    className="btn-modern btn-primary-modern w-100 mt-4"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleUpdateUser}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Age</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="age" 
                      defaultValue={user.age} 
                      className="form-control-modern"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Gender</Form.Label>
                    <Form.Select name="gender" defaultValue={user.gender} className="form-control-modern">
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Height (cm)</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1" 
                      name="height" 
                      defaultValue={user.height} 
                      className="form-control-modern"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Weight (kg)</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1" 
                      name="weight" 
                      defaultValue={user.weight} 
                      className="form-control-modern"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Activity Level</Form.Label>
                    <Form.Select name="activity_level" defaultValue={user.activity_level} className="form-control-modern">
                      <option value="">Select...</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                      <option value="extremely_active">Extremely Active</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Goal</Form.Label>
                    <Form.Select name="goal" defaultValue={user.goal} className="form-control-modern">
                      <option value="">Select...</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle_gain">Muscle Gain</option>
                    </Form.Select>
                  </Form.Group>
                  <Button 
                    className="btn-modern btn-primary-modern w-100 mb-2"
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </Button>
                  <Button 
                    className="btn-modern btn-outline-modern w-100"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="card-modern">
            <div className="card-header-modern">
              <h5 className="mb-0">Dietary Preferences</h5>
            </div>
            <Card.Body className="card-body-modern">
              {!prefEditMode ? (
                <div>
                  <h6 style={{fontFamily: 'Poppins', fontWeight: 600, marginBottom: '1rem'}}>Your Saved Preferences</h6>
                  {preferences ? (
                    <div className="profile-info">
                      <div className="info-item">
                        <span className="info-label">Dietary Restrictions</span>
                        <span className="info-value">
                          {[
                            preferences.vegetarian && 'Vegetarian',
                            preferences.vegan && 'Vegan',
                            preferences.gluten_free && 'Gluten Free',
                            preferences.dairy_free && 'Dairy Free',
                            preferences.nut_free && 'Nut Free',
                            preferences.halal && 'Halal',
                            preferences.kosher && 'Kosher',
                          ].filter(Boolean).join(', ') || 'None set'}
                        </span>
                      </div>
                      {preferences.preferred_cuisine && (
                        <div className="info-item">
                          <span className="info-label">Preferred Cuisine</span>
                          <span className="info-value">{preferences.preferred_cuisine}</span>
                        </div>
                      )}
                      {preferences.favorite_ingredients && (
                        <div className="info-item">
                          <span className="info-label">Favorite Ingredients</span>
                          <span className="info-value">{preferences.favorite_ingredients}</span>
                        </div>
                      )}
                      {preferences.disliked_ingredients && (
                        <div className="info-item">
                          <span className="info-label">Disliked Ingredients</span>
                          <span className="info-value">{preferences.disliked_ingredients}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted mb-3">No dietary preferences set yet. Click the button below to add them.</p>
                  )}
                  <Button
                    className="btn-modern btn-secondary-modern w-100 mt-3"
                    onClick={() => setPrefEditMode(true)}
                  >
                    ✏️ Edit Preferences
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleUpdatePreferences}>
                  <h6 style={{fontFamily: 'Poppins', fontWeight: 600, marginBottom: '1rem'}}>Dietary Restrictions</h6>
                  <div className="preferences-grid mb-4">
                    <Form.Check
                      type="checkbox"
                      label="🥬 Vegetarian"
                      name="vegetarian"
                      className="preference-check"
                      defaultChecked={preferences?.vegetarian}
                    />
                    <Form.Check
                      type="checkbox"
                      label="🌱 Vegan"
                      name="vegan"
                      className="preference-check"
                      defaultChecked={preferences?.vegan}
                    />
                    <Form.Check
                      type="checkbox"
                      label="🌾 Gluten Free"
                      name="gluten_free"
                      className="preference-check"
                      defaultChecked={preferences?.gluten_free}
                    />
                    <Form.Check
                      type="checkbox"
                      label="🥛 Dairy Free"
                      name="dairy_free"
                      className="preference-check"
                      defaultChecked={preferences?.dairy_free}
                    />
                    <Form.Check
                      type="checkbox"
                      label="🥜 Nut Free"
                      name="nut_free"
                      className="preference-check"
                      defaultChecked={preferences?.nut_free}
                    />
                    <Form.Check
                      type="checkbox"
                      label="☪️ Halal"
                      name="halal"
                      className="preference-check"
                      defaultChecked={preferences?.halal}
                    />
                    <Form.Check
                      type="checkbox"
                      label="✡️ Kosher"
                      name="kosher"
                      className="preference-check"
                      defaultChecked={preferences?.kosher}
                    />
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Preferred Cuisine</Form.Label>
                    <Form.Control
                      type="text"
                      name="preferred_cuisine"
                      placeholder="e.g., Italian, Asian, Mediterranean"
                      className="form-control-modern"
                      defaultValue={preferences?.preferred_cuisine || ''}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Favorite Ingredients</Form.Label>
                    <Form.Control
                      type="text"
                      name="favorite_ingredients"
                      placeholder="e.g., chicken, rice, vegetables"
                      className="form-control-modern"
                      defaultValue={preferences?.favorite_ingredients || ''}
                    />
                    <Form.Text className="text-muted">Separate with commas</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-modern">Disliked Ingredients</Form.Label>
                    <Form.Control
                      type="text"
                      name="disliked_ingredients"
                      placeholder="e.g., mushrooms, olives"
                      className="form-control-modern"
                      defaultValue={preferences?.disliked_ingredients || ''}
                    />
                    <Form.Text className="text-muted">Separate with commas</Form.Text>
                  </Form.Group>

                  <Button
                    className="btn-modern btn-secondary-modern w-100 mb-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Preferences'}
                  </Button>
                  <Button
                    className="btn-modern btn-outline-modern w-100"
                    type="button"
                    onClick={() => setPrefEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;

