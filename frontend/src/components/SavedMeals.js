import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import MealCard from './common/MealCard';
import LogMealModal from './LogMealModal';
import '../styles/design-system.css';

const API_BASE_URL = 'http://localhost:8000/api';

function SavedMeals() {
  const { currentUserId } = useUser();
  const [savedMeals, setSavedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadSavedMeals();
    }
  }, [currentUserId]);

  const loadSavedMeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/saved-meals/users/${currentUserId}`);
      // Transform response to match MealCard expectation if needed
      // API returns meal_id, meal_name, etc. MealCard expects id, name
      const transformed = response.data.map(item => ({
        ...item,
        id: item.meal_id,
        name: item.meal_name,
        description: item.meal_description,
        category: item.meal_category,
        average_rating: 0 // Saved meals endpoint might not return rating, defaulting to 0 or we need to fetch it
      }));
      setSavedMeals(transformed);
      setError('');
    } catch (err) {
      setError('Failed to load saved meals');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (mealId) => {
    if (!window.confirm('Remove from saved meals?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`);
      setSavedMeals(savedMeals.filter(meal => meal.id !== mealId));
    } catch (err) {
      alert('Failed to remove meal');
    }
  };

  const handleMealAction = (action, meal) => {
    if (action === 'log') {
      setSelectedMeal(meal);
      setShowLogMealModal(true);
    } else if (action === 'save') {
      // It's already saved, so the action implies unsaving or already saved
      handleUnsave(meal.id);
    }
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-lg)',
    },
    emptyState: {
      textAlign: 'center',
      padding: 'var(--space-2xl)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-surface)',
      border: '1px dashed var(--border-color)',
    }
  };

  if (!currentUserId) return <div className="p-8 text-center">Please log in.</div>;

  return (
    <PageContainer
      title="Saved Recipes"
      subtitle="Your personal collection of favorite meals"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading saved meals...</div>
      ) : savedMeals.length > 0 ? (
        <div style={styles.grid}>
          {savedMeals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => navigate(`/recipe/${meal.id}`)}
              onAction={(action) => {
                if (action === 'save') {
                  handleUnsave(meal.id);
                } else {
                  handleMealAction(action, meal);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>❤️</div>
          <h3>No saved meals yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            Start exploring recipes and save your favorites here!
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/meals')}
          >
            Find Meals
          </button>
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

export default SavedMeals;
