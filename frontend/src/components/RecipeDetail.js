import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft,
  FaClock,
  FaUtensils,
  FaChartPie,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaCheckCircle
} from 'react-icons/fa';
import { mealAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import LogMealModal from './LogMealModal';
import '../styles/design-system.css';

const API_BASE_URL = 'http://localhost:8000/api';

const AttributeBadge = ({ icon: Icon, label, value }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--bg-app)',
    borderRadius: 'var(--radius-md)',
    minWidth: '100px'
  }}>
    <Icon size={20} color="var(--primary)" />
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{value}</span>
  </div>
);

function RecipeDetail() {
  const { currentUserId } = useUser();
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMeal();
    if (currentUserId) {
      checkIfSaved();
      loadUserRating();
    }
  }, [mealId, currentUserId]);

  const loadMeal = async () => {
    try {
      const response = await mealAPI.get(mealId);
      setMeal(response.data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}/is-saved`
      );
      setIsSaved(response.data.is_saved);
    } catch (err) {
      console.error('Failed to check if saved:', err);
    }
  };

  const loadUserRating = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ratings/users/${currentUserId}/meals/${mealId}`
      );
      if (response.data) {
        setUserRating(response.data);
      }
    } catch (err) {
      // No rating yet
    }
  };

  const handleSaveToggle = async () => {
    if (!currentUserId) {
      alert('Please log in to save recipes');
      return;
    }

    try {
      if (isSaved) {
        await axios.delete(`${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`);
        setIsSaved(false);
      } else {
        await axios.post(
          `${API_BASE_URL}/saved-meals/users/${currentUserId}/meals/${mealId}`,
          { note: '' }
        );
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update saved status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading recipe...</div>;
  if (error || !meal) return <div className="p-8 text-center text-red-500">{error || 'Recipe not found'}</div>;

  const styles = {
    backBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-lg)',
      fontSize: 'var(--text-md)',
      fontWeight: '500',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--space-xl)',
      alignItems: 'start',
    },
    mainCard: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      border: '1px solid var(--border-color)',
    },
    header: {
      textAlign: 'center',
      marginBottom: 'var(--space-xl)',
    },
    emoji: {
      fontSize: '4rem',
      marginBottom: 'var(--space-md)',
      display: 'block',
    },
    title: {
      fontSize: 'var(--text-4xl)',
      marginBottom: 'var(--space-sm)',
      color: 'var(--text-primary)',
    },
    description: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-lg)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    attributes: {
      display: 'flex',
      justifyContent: 'center',
      gap: 'var(--space-md)',
      margin: 'var(--space-xl) 0',
      flexWrap: 'wrap',
    },
    sectionTitle: {
      fontSize: 'var(--text-xl)',
      fontWeight: '600',
      marginBottom: 'var(--space-md)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      color: 'var(--text-primary)',
    },
    ingredientList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 'var(--space-sm)',
    },
    ingredientItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      padding: 'var(--space-sm)',
      backgroundColor: 'var(--bg-app)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-base)',
    },
    nutritionCard: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      border: '1px solid var(--border-color)',
      position: 'sticky',
      top: '100px',
    },
    nutritionRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 'var(--space-sm) 0',
      borderBottom: '1px solid var(--border-color)',
      fontSize: 'var(--text-sm)',
    },
    macroBar: (color, percent) => ({
      height: '8px',
      backgroundColor: 'var(--bg-app)',
      borderRadius: 'var(--radius-full)',
      marginTop: 'var(--space-xs)',
      overflow: 'hidden',
      position: 'relative',
    }),
    macroFill: (color, percent) => ({
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: `${percent}%`,
      backgroundColor: color,
    }),
    actionBtn: (primary) => ({
      width: '100%',
      padding: '0.75rem',
      marginTop: 'var(--space-md)',
      borderRadius: 'var(--radius-md)',
      border: primary ? 'none' : '1px solid var(--border-color)',
      backgroundColor: primary ? 'var(--primary)' : 'transparent',
      color: primary ? 'white' : 'var(--text-primary)',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-sm)',
      transition: 'var(--transition)',
    })
  };

  const getEmoji = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'breakfast': return '🥞';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🍎';
      default: return '🥘';
    }
  };

  const totalMacros = meal.protein + meal.carbohydrates + meal.fat;
  const proteinPct = totalMacros ? (meal.protein / totalMacros) * 100 : 0;
  const carbsPct = totalMacros ? (meal.carbohydrates / totalMacros) * 100 : 0;
  const fatPct = totalMacros ? (meal.fat / totalMacros) * 100 : 0;

  return (
    <PageContainer>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to meals
      </button>

      <div style={styles.grid}>
        {/* Main Content */}
        <div style={styles.mainCard}>
          <div style={styles.header}>
            <span style={styles.emoji}>{getEmoji(meal.category)}</span>
            <h1 style={styles.title}>{meal.name}</h1>
            <p style={styles.description}>{meal.description}</p>

            <div style={styles.attributes}>
              <AttributeBadge icon={FaClock} label="Prep Time" value="~30m" />
              <AttributeBadge icon={FaUtensils} label="Category" value={meal.category || 'General'} />
              <AttributeBadge icon={FaChartPie} label="Calories" value={meal.calories} />
              <AttributeBadge icon={FaStar} label="Rating" value={meal.average_rating.toFixed(1)} />
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Ingredients</h3>
          <div style={styles.ingredientList}>
            {meal.description ? (
              meal.description.split(',').map((ing, i) => (
                <div key={i} style={styles.ingredientItem}>
                  <FaCheckCircle color="var(--success)" size={14} />
                  {ing.trim()}
                </div>
              ))
            ) : (
              <p>No ingredient details available.</p>
            )}
          </div>
        </div>

        {/* Nutrition Sidebar */}
        <div style={styles.nutritionCard}>
          <h3 style={styles.sectionTitle}>Nutrition Facts</h3>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={styles.nutritionRow}>
              <span>Protein</span>
              <strong>{meal.protein}g</strong>
            </div>
            <div style={styles.macroBar()}>
              <div style={styles.macroFill('var(--success)', proteinPct)} />
            </div>

            <div style={{ ...styles.nutritionRow, marginTop: 'var(--space-sm)' }}>
              <span>Carbs</span>
              <strong>{meal.carbohydrates}g</strong>
            </div>
            <div style={styles.macroBar()}>
              <div style={styles.macroFill('var(--secondary)', carbsPct)} />
            </div>

            <div style={{ ...styles.nutritionRow, marginTop: 'var(--space-sm)' }}>
              <span>Fat</span>
              <strong>{meal.fat}g</strong>
            </div>
            <div style={styles.macroBar()}>
              <div style={styles.macroFill('var(--accent)', fatPct)} />
            </div>
          </div>

          <div style={styles.nutritionRow}>
            <span>Fiber</span>
            <span>{meal.fiber || 0}g</span>
          </div>
          <div style={styles.nutritionRow}>
            <span>Sugar</span>
            <span>{meal.sugar || 0}g</span>
          </div>

          <button
            style={styles.actionBtn(true)}
            onClick={() => setShowLogMealModal(true)}
            className="btn-primary-hover"
          >
            Log Today
          </button>

          <button
            style={styles.actionBtn(false)}
            onClick={handleSaveToggle}
            className="btn-outline-hover"
          >
            {isSaved ? <FaHeart color="var(--danger)" /> : <FaRegHeart />}
            {isSaved ? 'Saved' : 'Save Recipe'}
          </button>
        </div>
      </div>

      <LogMealModal
        show={showLogMealModal}
        onHide={() => setShowLogMealModal(false)}
        meal={meal}
        userId={currentUserId}
        onSuccess={() => {
          setShowLogMealModal(false);
          alert('Meal logged!');
        }}
      />
    </PageContainer>
  );
}

export default RecipeDetail;
