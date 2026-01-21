import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaPlus, FaFilter, FaMagic } from 'react-icons/fa';
import { aiRecipeAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import MealCard from './common/MealCard';
import CreateRecipeModal from './CreateRecipeModal';
import LogMealModal from './LogMealModal';
import '../styles/design-system.css';

function FindMeals() {
  const { currentUserId } = useUser();
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  // Common ingredients for selection
  const availableIngredients = [
    'Chicken', 'Beef', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Bread',
    'Tomatoes', 'Onions', 'Garlic', 'Peppers', 'Carrots', 'Broccoli',
    'Spinach', 'Cheese', 'Milk', 'Yogurt', 'Oats', 'Quinoa',
    'Potatoes', 'Sweet Potatoes', 'Beans', 'Lentils', 'Tofu',
    'Olive Oil', 'Butter', 'Avocado', 'Banana', 'Apple', 'Berries'
  ];

  useEffect(() => {
    if (selectedIngredients.length >= 2) {
      searchMeals();
    } else if (selectedIngredients.length === 0) {
      setMeals([]);
    }
  }, [selectedIngredients]);

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const searchMeals = async () => {
    if (selectedIngredients.length < 2) {
      setMeals([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await aiRecipeAPI.searchByIngredients(
        selectedIngredients,
        10,
        1 // Minimum 1 ingredient match
      );
      setMeals(response.data || []);
    } catch (err) {
      if (err.response?.status === 503) {
        setError('AI model not trained yet. Please create some recipes first.');
      } else {
        setError('Failed to search recipes.');
      }
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMealAction = (action, meal) => {
    if (action === 'log') {
      setSelectedMeal(meal);
      setShowLogMealModal(true);
    } else if (action === 'save') {
      // Logic for save would go here, maybe move it to a common context or hook
      alert('Save functionality pending common context refactor');
    }
  };

  const filteredIngredients = availableIngredients.filter(ing =>
    ing.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    layout: {
      display: 'grid',
      gridTemplateColumns: 'minmax(280px, 1fr) 3fr',
      gap: 'var(--space-xl)',
      alignItems: 'start',
    },
    sidebar: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      border: '1px solid var(--border-color)',
      position: 'sticky',
      top: '100px',
    },
    searchBox: {
      position: 'relative',
      marginBottom: 'var(--space-md)',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      fontSize: 'var(--text-sm)',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-tertiary)',
    },
    chipGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-xs)',
      marginTop: 'var(--space-md)',
    },
    chip: (active) => ({
      padding: '0.5rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-sm)',
      cursor: 'pointer',
      border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
      backgroundColor: active ? 'var(--primary-soft)' : 'var(--bg-app)',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      transition: 'var(--transition)',
    }),
    selectedArea: {
      marginBottom: 'var(--space-lg)',
      paddingBottom: 'var(--space-md)',
      borderBottom: '1px solid var(--border-color)',
    },
    mealGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-lg)',
    },
    emptyState: {
      textAlign: 'center',
      padding: 'var(--space-2xl)',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
    }
  };

  return (
    <PageContainer
      title="Find Meals"
      subtitle="Select ingredients to discover personalized recipes"
      action={
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
          disabled={!currentUserId}
        >
          <FaPlus size={12} style={{ marginRight: '8px' }} />
          Create Recipe
        </button>
      }
    >
      <div style={styles.layout}>
        {/* Ingredients Sidebar */}
        <aside style={styles.sidebar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <FaFilter color="var(--primary)" />
            <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Ingredients</h3>
          </div>

          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {selectedIngredients.length > 0 && (
            <div style={styles.selectedArea}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase' }}>Selected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {selectedIngredients.map(ing => (
                  <span
                    key={ing}
                    style={{ ...styles.chip(true), display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => removeIngredient(ing)}
                  >
                    {ing} <FaTimes size={10} />
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedIngredients([])}
                style={{
                  background: 'none', border: 'none', color: 'var(--danger)',
                  fontSize: 'var(--text-sm)', marginTop: 'var(--space-sm)',
                  cursor: 'pointer', padding: 0
                }}
              >
                Clear all
              </button>
            </div>
          )}

          <div style={styles.chipGrid}>
            {filteredIngredients.map(ing => (
              <div
                key={ing}
                style={styles.chip(selectedIngredients.includes(ing))}
                onClick={() => toggleIngredient(ing)}
              >
                {ing}
              </div>
            ))}
          </div>
        </aside>

        {/* Results Area */}
        <div style={{ width: '100%' }}>
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

          {loading ? (
            <div style={styles.emptyState}>
              <div className="spinner" style={{ marginBottom: 'var(--space-md)' }}>🔄</div>
              <p>Searching for delicious recipes...</p>
            </div>
          ) : meals.length > 0 ? (
            <div style={styles.mealGrid}>
              {meals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onClick={() => navigate(`/recipe/${meal.id}`)}
                  onAction={handleMealAction}
                />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', opacity: 0.5 }}>🥘</div>
              <h3>No meals found</h3>
              <p>Select at least 2 ingredients to start searching.</p>
              {selectedIngredients.length === 1 && (
                <p style={{ color: 'var(--primary)' }}>Select 1 more ingredient!</p>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateRecipeModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          searchMeals();
        }}
        currentUserId={currentUserId}
        initialIngredients={selectedIngredients}
      />

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
            // Show toast or notification
          }}
        />
      )}
    </PageContainer>
  );
}

export default FindMeals;
