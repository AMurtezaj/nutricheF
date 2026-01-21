import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FaSync, FaCalendarAlt, FaFire, FaDrumstickBite, FaBreadSlice, FaHamburger } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { nutritionAPI, mealAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import '../styles/design-system.css';

function NutritionAnalysis() {
  const { currentUserId } = useUser();
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [userMeals, setUserMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (currentUserId) {
      loadDailyNutrition();
      loadUserMeals();
    }
  }, [currentUserId, selectedDate]);

  const loadDailyNutrition = async () => {
    if (!currentUserId) return;
    setLoading(true);
    setError('');
    try {
      const response = await nutritionAPI.getDailyNutrition(currentUserId, selectedDate);
      setDailyNutrition(response.data);
    } catch (err) {
      setError('Failed to load daily nutrition');
    } finally {
      setLoading(false);
    }
  };

  const loadUserMeals = async () => {
    if (!currentUserId) return;
    try {
      const response = await mealAPI.getUserMeals(currentUserId, selectedDate);
      setUserMeals(response.data);
    } catch (err) {
      console.error('Failed to load user meals:', err);
    }
  };

  const getProgressColor = (percent) => {
    if (percent > 110) return 'var(--danger)';
    if (percent >= 90) return 'var(--success)';
    return 'var(--primary)';
  };

  const styles = {
    controls: {
      display: 'flex',
      gap: 'var(--space-md)',
      marginBottom: 'var(--space-xl)',
      alignItems: 'center',
      backgroundColor: 'var(--bg-surface)',
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
    },
    dateInput: {
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '0.5rem',
      color: 'var(--text-primary)',
      outline: 'none',
    },
    refreshBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--space-lg)',
      marginBottom: 'var(--space-2xl)',
    },
    statCard: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      border: '1px solid var(--border-color)',
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      marginBottom: 'var(--space-md)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-sm)',
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    statValue: {
      fontSize: 'var(--text-3xl)',
      fontWeight: '700',
      marginBottom: 'var(--space-xs)',
      color: 'var(--text-primary)',
    },
    progressBar: {
      height: '8px',
      backgroundColor: 'var(--bg-app)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden',
      marginTop: 'var(--space-md)',
    },
    progressFill: (percent, color) => ({
      height: '100%',
      width: `${Math.min(percent, 100)}%`,
      backgroundColor: color,
      transition: 'width 1s ease',
    }),
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: 'var(--space-md)',
      color: 'var(--text-secondary)',
      fontWeight: '600',
      borderBottom: '1px solid var(--border-color)',
      fontSize: 'var(--text-sm)',
    },
    td: {
      padding: 'var(--space-md)',
      borderBottom: '1px solid var(--bg-app)',
      color: 'var(--text-primary)',
    }
  };

  if (!currentUserId) return <div className="p-8 text-center">Please log in.</div>;

  return (
    <PageContainer title="Nutrition Analysis" subtitle="Track your daily macros and meals">
      <div style={styles.controls}>
        <FaCalendarAlt color="var(--text-secondary)" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
        <button style={styles.refreshBtn} onClick={loadDailyNutrition}>
          <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Data
        </button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {dailyNutrition ? (
        <>
          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
            {/* Macro Distribution Pie Chart */}
            <div style={styles.statCard}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Macro Distribution</h3>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Protein', value: dailyNutrition.total_protein, color: 'var(--success)' },
                        { name: 'Carbs', value: dailyNutrition.total_carbohydrates, color: 'var(--secondary)' },
                        { name: 'Fat', value: dailyNutrition.total_fat, color: 'var(--accent)' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {
                        [
                          { name: 'Protein', value: dailyNutrition.total_protein, color: 'var(--success)' },
                          { name: 'Carbs', value: dailyNutrition.total_carbohydrates, color: 'var(--secondary)' },
                          { name: 'Fat', value: dailyNutrition.total_fat, color: 'var(--accent)' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Targets vs Actual Bar Chart */}
            <div style={styles.statCard}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Progress to Targets</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Calories', current: dailyNutrition.total_calories, target: dailyNutrition.targets.calories },
                      { name: 'Protein', current: dailyNutrition.total_protein, target: dailyNutrition.targets.protein },
                      { name: 'Carbs', current: dailyNutrition.total_carbohydrates, target: dailyNutrition.targets.carbohydrates },
                      { name: 'Fat', current: dailyNutrition.total_fat, target: dailyNutrition.targets.fat }
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'var(--text-secondary)' }} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    />
                    <Bar dataKey="current" name="Current" fill="var(--primary)" barSize={20} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="target" name="Target" fill="#e0e0e0" barSize={20} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ ...styles.statCard, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Meals Logged Today</h3>
            </div>
            {userMeals.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Meal</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Servings</th>
                      <th style={styles.th}>Calories</th>
                      <th style={styles.th}>Protein</th>
                      <th style={styles.th}>Carbs</th>
                      <th style={styles.th}>Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userMeals.map((meal) => (
                      <tr key={meal.id}>
                        <td style={styles.td}><strong>{meal.meal?.name || 'Unknown'}</strong></td>
                        <td style={styles.td}><span style={{ textTransform: 'capitalize' }}>{meal.meal_type}</span></td>
                        <td style={styles.td}>{meal.servings}</td>
                        <td style={styles.td}>{meal.total_calories?.toFixed(0)}</td>
                        <td style={{ ...styles.td, color: 'var(--success)' }}>{meal.total_protein?.toFixed(0)}g</td>
                        <td style={{ ...styles.td, color: 'var(--secondary)' }}>{meal.total_carbohydrates?.toFixed(0)}g</td>
                        <td style={{ ...styles.td, color: 'var(--accent)' }}>{meal.total_fat?.toFixed(0)}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
                <p>No meals logged for this date.</p>
                <div style={{ fontSize: '0.9rem' }}>Go to 'Find Meals' to add something!</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-5">Loading data...</div>
      )}
    </PageContainer>
  );
}

export default NutritionAnalysis;
