import React from 'react';
import { FaFire, FaStar, FaLeaf } from 'react-icons/fa';
import '../../styles/design-system.css';

const MealCard = ({ meal, onClick, onAction }) => {
    const styles = {
        card: {
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            transition: 'var(--transition)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        image: {
            height: '180px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            position: 'relative',
        },
        content: {
            padding: 'var(--space-lg)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            marginBottom: 'var(--space-xs)',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
        },
        stats: {
            display: 'flex',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-sm)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
        },
        statItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
        },
        badges: {
            display: 'flex',
            gap: 'var(--space-sm)',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-sm)',
        },
        badge: {
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: '500',
            backgroundColor: 'rgba(32, 227, 178, 0.1)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        matchScore: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: '600',
            backdropFilter: 'blur(4px)',
        },
        footer: {
            marginTop: 'auto',
            paddingTop: 'var(--space-md)',
            display: 'flex',
            gap: 'var(--space-sm)',
        },
        actionBtn: {
            flex: 1,
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'var(--transition)',
        }
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

    return (
        <div
            style={styles.card}
            className="card-hover"
            onClick={onClick}
        >
            <div style={styles.image}>
                {getEmoji(meal.category)}
                {meal.matched_ingredients && (
                    <div style={styles.matchScore}>
                        {meal.matched_ingredients} Matched
                    </div>
                )}
            </div>

            <div style={styles.content}>
                <div style={styles.badges}>
                    {meal.is_vegetarian && (
                        <span style={styles.badge}><FaLeaf size={10} /> Veg</span>
                    )}
                    {meal.average_rating > 0 && (
                        <span style={{ ...styles.badge, backgroundColor: 'rgba(255, 159, 28, 0.1)', color: 'var(--accent)' }}>
                            <FaStar size={10} /> {meal.average_rating.toFixed(1)}
                        </span>
                    )}
                </div>

                <h3 style={styles.title}>{meal.name}</h3>

                <div style={styles.stats}>
                    <div style={styles.statItem}>
                        <FaFire size={12} color="var(--primary)" />
                        {meal.calories} kcal
                    </div>
                    <div style={styles.statItem}>
                        <strong style={{ color: 'var(--success)' }}>{meal.protein}g</strong> P
                    </div>
                    <div style={styles.statItem}>
                        <strong style={{ color: 'var(--secondary)' }}>{meal.carbohydrates}g</strong> C
                    </div>
                </div>

                <div style={styles.footer}>
                    <button
                        style={{ ...styles.actionBtn, backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction && onAction('log', meal);
                        }}
                    >
                        Log Meal
                    </button>
                    <button
                        style={styles.actionBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction && onAction('save', meal);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
