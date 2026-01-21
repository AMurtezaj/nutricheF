import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaFire, FaDrumstickBite, FaBreadSlice, FaHamburger, FaSearch, FaStar, FaChartLine } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { nutritionAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import StatCard from './common/StatCard';
import '../styles/design-system.css';

const Dashboard = () => {
  const { currentUserId, user } = useUser();
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadData();
      loadWeeklyData();
    }
  }, [currentUserId]);

  const loadData = async () => {
    try {
      const nutritionResponse = await nutritionAPI.getDailyNutrition(currentUserId);
      setDailyNutrition(nutritionResponse.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyData = async () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    try {
      const promises = dates.map(date =>
        nutritionAPI.getDailyNutrition(currentUserId, date)
          .then(res => ({
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            calories: res.data.total_calories || 0
          }))
          .catch(() => ({
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            calories: 0
          }))
      );

      const results = await Promise.all(promises);
      setWeeklyData(results);
    } catch (err) {
      console.error('Failed to load weekly data', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculatePercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'var(--space-lg)',
      marginBottom: 'var(--space-2xl)',
    },
    sectionTitle: {
      fontSize: 'var(--text-xl)',
      fontWeight: '600',
      marginBottom: 'var(--space-md)',
      color: 'var(--text-primary)',
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-md)',
    },
    actionCard: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-md)',
      cursor: 'pointer',
      textAlign: 'center',
      border: '1px solid var(--border-color)',
      transition: 'var(--transition)',
      textDecoration: 'none',
    },
    actionIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      fontSize: '1.5rem',
      marginBottom: 'var(--space-xs)',
    },
    actionTitle: {
      fontWeight: '600',
      color: 'var(--text-primary)',
      margin: 0,
    },
    tipCard: {
      backgroundColor: 'rgba(61, 144, 227, 0.1)',
      border: '1px solid rgba(61, 144, 227, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      display: 'flex',
      gap: 'var(--space-lg)',
      alignItems: 'start',
      gridColumn: '1 / -1', // Span full width
    },
    chartCard: {
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      border: '1px solid var(--border-color)',
      marginBottom: 'var(--space-2xl)',
      height: '300px',
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!dailyNutrition || !user) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  return (
    <PageContainer
      title={`${getGreeting()}, ${user.first_name}! 👋`}
      subtitle={`Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
    >

      {/* Nutrition Stats Grid */}
      <div style={styles.grid}>
        <StatCard
          label="Calories"
          value={dailyNutrition.total_calories.toFixed(0)}
          subValue={`Target: ${dailyNutrition.targets.calories.toFixed(0)}`}
          icon={FaFire}
          type="primary"
          progress={calculatePercentage(dailyNutrition.total_calories, dailyNutrition.targets.calories)}
        />
        <StatCard
          label="Protein"
          value={`${dailyNutrition.total_protein.toFixed(1)}g`}
          subValue={`Target: ${dailyNutrition.targets.protein.toFixed(0)}g`}
          icon={FaDrumstickBite}
          type="success"
          progress={calculatePercentage(dailyNutrition.total_protein, dailyNutrition.targets.protein)}
        />
        <StatCard
          label="Carbs"
          value={`${dailyNutrition.total_carbohydrates.toFixed(1)}g`}
          subValue={`Target: ${dailyNutrition.targets.carbohydrates.toFixed(0)}g`}
          icon={FaBreadSlice}
          type="info"
          progress={calculatePercentage(dailyNutrition.total_carbohydrates, dailyNutrition.targets.carbohydrates)}
        />
        <StatCard
          label="Fat"
          value={`${dailyNutrition.total_fat.toFixed(1)}g`}
          subValue={`Target: ${dailyNutrition.targets.fat.toFixed(0)}g`}
          icon={FaHamburger}
          type="accent"
          progress={calculatePercentage(dailyNutrition.total_fat, dailyNutrition.targets.fat)}
        />
      </div>

      {/* Weekly Trend Chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.sectionTitle}>Weekly Calorie Trend</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
            <Area type="monotone" dataKey="calories" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCalories)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <h3 style={styles.sectionTitle}>What would you like to do?</h3>
      <div style={{ ...styles.grid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Link to="/meals" style={styles.actionCard} className="card-hover">
          <div style={styles.actionIcon}><FaSearch /></div>
          <div>
            <h4 style={styles.actionTitle}>Find Meals</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Search & filter database</p>
          </div>
        </Link>

        <Link to="/recommendations" style={styles.actionCard} className="card-hover">
          <div style={{ ...styles.actionIcon, color: 'var(--accent)' }}><FaStar /></div>
          <div>
            <h4 style={styles.actionTitle}>Get Recommendations</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Personalized for you</p>
          </div>
        </Link>

        <Link to="/nutrition" style={styles.actionCard} className="card-hover">
          <div style={{ ...styles.actionIcon, color: 'var(--success)' }}><FaChartLine /></div>
          <div>
            <h4 style={styles.actionTitle}>Analyze Nutrition</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Detailed breakdown</p>
          </div>
        </Link>
      </div>

      {/* Daily Tip */}
      <div style={styles.tipCard}>
        <div style={{ fontSize: '2rem' }}>💡</div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--info)' }}>Daily Tip</h4>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {dailyNutrition.total_protein < dailyNutrition.targets.protein * 0.8
              ? "Try adding more protein to your meals today! Protein helps with muscle recovery and keeps you feeling full longer."
              : dailyNutrition.total_calories < dailyNutrition.targets.calories * 0.5
                ? "You're doing great! Make sure to have balanced meals throughout the day to meet your calorie goals."
                : "Keep up the excellent work! Your nutrition is well-balanced. Continue making healthy choices!"
            }
          </p>
        </div>
      </div>

    </PageContainer>
  );
};

export default Dashboard;
