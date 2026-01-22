import React, { useState } from 'react';
import { FaCalendarAlt, FaMagic, FaUtensils, FaFire, FaDrumstickBite, FaBreadSlice, FaOilCan, FaCheck, FaRedo } from 'react-icons/fa';
import { mealPlannerAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import PageContainer from './layout/PageContainer';
import '../styles/design-system.css';

function MealPlanner() {
    const { currentUserId } = useUser();
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState('');
    const [days, setDays] = useState(7);

    const generatePlan = async () => {
        if (!currentUserId) {
            setError('Please login to generate a meal plan');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await mealPlannerAPI.generatePlan(currentUserId, days);
            setPlan(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate meal plan');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        generateSection: {
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            marginBottom: 'var(--space-xl)',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
        },
        daysSelector: {
            display: 'flex',
            gap: 'var(--space-sm)',
            justifyContent: 'center',
            marginBottom: 'var(--space-lg)',
        },
        dayButton: (isActive) => ({
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            backgroundColor: isActive ? 'var(--primary-soft)' : 'var(--bg-app)',
            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: isActive ? '600' : '400',
            cursor: 'pointer',
            transition: 'var(--transition)',
        }),
        generateBtn: {
            padding: '1rem 2.5rem',
            fontSize: 'var(--text-lg)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            transition: 'var(--transition)',
        },
        summaryGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
        },
        summaryCard: {
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
        },
        weekGrid: {
            display: 'grid',
            gap: 'var(--space-lg)',
        },
        dayCard: {
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: '1px solid var(--border-color)',
        },
        dayHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
            paddingBottom: 'var(--space-md)',
            borderBottom: '1px solid var(--border-color)',
        },
        mealsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-md)',
        },
        mealSlot: {
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            border: '1px solid var(--border-color)',
        },
        mealType: {
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            fontWeight: '600',
            marginBottom: 'var(--space-xs)',
        },
        mealName: {
            fontSize: 'var(--text-md)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-xs)',
        },
        mealInfo: {
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
        },
        progressBar: {
            height: '8px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginTop: 'var(--space-sm)',
        },
        progressFill: (percentage, color) => ({
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
            transition: 'width 0.3s ease',
        }),
    };

    const getMealEmoji = (mealType) => {
        const emojis = {
            breakfast: '🍳',
            lunch: '🥗',
            dinner: '🍽️',
            snack: '🍎',
        };
        return emojis[mealType] || '🍴';
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90 && percentage <= 110) return 'var(--success)';
        if (percentage >= 75 && percentage <= 125) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <PageContainer
            title="Weekly Meal Planner"
            subtitle="AI-powered personalized meal plans based on your nutrition goals"
            action={plan && (
                <button className="btn-outline" onClick={() => setPlan(null)}>
                    <FaRedo size={14} style={{ marginRight: '8px' }} />
                    New Plan
                </button>
            )}
        >
            <div style={styles.container}>
                {!plan ? (
                    <div style={styles.generateSection}>
                        <FaCalendarAlt size={48} color="var(--primary)" style={{ marginBottom: 'var(--space-md)', opacity: 0.8 }} />
                        <h2 style={{ marginBottom: 'var(--space-md)' }}>Generate Your Meal Plan</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Our AI will create a personalized meal plan based on your calorie targets, dietary preferences, and nutritional goals.
                        </p>

                        <div style={styles.daysSelector}>
                            {[3, 5, 7, 14].map((d) => (
                                <button
                                    key={d}
                                    style={styles.dayButton(days === d)}
                                    onClick={() => setDays(d)}
                                >
                                    {d} Days
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>
                                {error}
                            </div>
                        )}

                        <button
                            style={styles.generateBtn}
                            onClick={generatePlan}
                            disabled={loading || !currentUserId}
                        >
                            {loading ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <FaMagic /> Generate Meal Plan
                                </>
                            )}
                        </button>

                        {!currentUserId && (
                            <p style={{ color: 'var(--text-tertiary)', marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>
                                Please login to generate a personalized meal plan
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div style={styles.summaryGrid}>
                            <div style={styles.summaryCard}>
                                <FaCalendarAlt size={24} color="var(--primary)" />
                                <h3 style={{ fontSize: 'var(--text-2xl)', margin: 'var(--space-sm) 0' }}>{plan.days}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Days Planned</p>
                            </div>
                            <div style={styles.summaryCard}>
                                <FaFire size={24} color="var(--danger)" />
                                <h3 style={{ fontSize: 'var(--text-2xl)', margin: 'var(--space-sm) 0' }}>
                                    {Math.round(plan.weekly_totals?.average_daily_calories || 0)}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Avg Daily Calories</p>
                            </div>
                            <div style={styles.summaryCard}>
                                <FaDrumstickBite size={24} color="var(--success)" />
                                <h3 style={{ fontSize: 'var(--text-2xl)', margin: 'var(--space-sm) 0' }}>
                                    {Math.round(plan.weekly_totals?.average_daily_protein || 0)}g
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Avg Daily Protein</p>
                            </div>
                            <div style={styles.summaryCard}>
                                <FaCheck size={24} color="var(--success)" />
                                <h3 style={{ fontSize: 'var(--text-2xl)', margin: 'var(--space-sm) 0' }}>
                                    {Math.round(plan.variety_score || 0)}%
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Variety Score</p>
                            </div>
                        </div>

                        {/* Weekly Plan */}
                        <div style={styles.weekGrid}>
                            {plan.weekly_plan?.map((day, index) => (
                                <div key={index} style={styles.dayCard}>
                                    <div style={styles.dayHeader}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{day.day_name}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                                {day.date}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontWeight: '600' }}>{Math.round(day.totals?.calories || 0)} kcal</p>
                                            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                                                {day.targets_met?.calories}% of target
                                            </p>
                                        </div>
                                    </div>

                                    <div style={styles.mealsGrid}>
                                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                                            const meal = day.meals?.[mealType];
                                            if (!meal) return null;
                                            return (
                                                <div key={mealType} style={styles.mealSlot}>
                                                    <div style={styles.mealType}>
                                                        {getMealEmoji(mealType)} {mealType}
                                                    </div>
                                                    <div style={styles.mealName}>{meal.name}</div>
                                                    <div style={styles.mealInfo}>
                                                        {meal.calories} kcal • {meal.protein}g protein
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Daily Progress */}
                                    <div style={{ marginTop: 'var(--space-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                                            <span>Target Progress</span>
                                            <span>{day.targets_met?.calories}%</span>
                                        </div>
                                        <div style={styles.progressBar}>
                                            <div style={styles.progressFill(day.targets_met?.calories || 0, getProgressColor(day.targets_met?.calories || 0))} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    );
}

export default MealPlanner;
