import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { FaSync } from 'react-icons/fa';
import { recommendationAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import MealCard from './common/MealCard';
import LogMealModal from './LogMealModal';
import '../styles/design-system.css';

function Recommendations() {
  const { currentUserId } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadRecommendations();
    }
  }, [currentUserId, category]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await recommendationAPI.getRecommendations(
        currentUserId,
        category || null,
        12
      );
      setRecommendations(response.data);
    } catch (err) {
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleMealAction = (action, meal) => {
    if (action === 'log') {
      setSelectedMeal(meal);
      setShowLogMealModal(true);
    } else if (action === 'save') {
      // Handle save
      alert('Save feature coming soon!'); // Placeholder until we unified save logic
    }
  };

  const styles = {
    controls: {
      display: 'flex',
      gap: 'var(--space-md)',
      marginBottom: 'var(--space-xl)',
      alignItems: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-lg)',
    },
    refreshBtn: {
      background: 'none',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      transition: 'var(--transition)',
    }
  };

  if (!currentUserId) return <div className="p-8 text-center">Please log in.</div>;

  return (
    <PageContainer
      title="Recommended For You"
      subtitle="Personalized meals based on your preferences and goals"
    >
      <div style={styles.controls}>
        <div style={{ width: '200px' }}>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </Form.Select>
        </div>

        <button
          style={styles.refreshBtn}
          onClick={loadRecommendations}
          className="hover:bg-gray-100"
        >
          <FaSync className={loading ? 'fa-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner">🔄</div> Loading...
        </div>
      ) : recommendations.length > 0 ? (
        <div style={styles.grid}>
          {recommendations.map(media => (
            <MealCard
              key={media.id}
              meal={media}
              onClick={() => navigate(`/recipe/${media.id}`)}
              onAction={handleMealAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>🤷‍♂️</div>
          <p>No recommendations found. Keep using the app to help us learn!</p>
        </div>
      )}

      {selectedMeal && (
        <LogMealModal
          show={showLogMealModal}
          onHide={() => {
            setShowLogMealModal(false);
            setSelectedMeal(null);
          }}
          meal={selectedMeal}
          userId={currentUserId}
          onSuccess={() => {
            setShowLogMealModal(false);
            setSelectedMeal(null);
            alert('Meal logged!');
          }}
        />
      )}
    </PageContainer>
  );
}

export default Recommendations;
