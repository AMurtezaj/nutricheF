import React from 'react';
import '../../styles/design-system.css';

const StatCard = ({ label, value, subValue, icon: Icon, type = 'default', progress }) => {
    const styles = {
        card: {
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            transition: 'var(--transition)',
            border: '1px solid var(--border-color)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-xs)',
        },
        label: {
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        iconWrapper: {
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'success' ? 'rgba(32, 227, 178, 0.1)' :
                type === 'accent' ? 'rgba(255, 159, 28, 0.1)' :
                    type === 'info' ? 'rgba(61, 144, 227, 0.1)' :
                        'rgba(255, 107, 53, 0.1)',
            color: type === 'success' ? 'var(--success)' :
                type === 'accent' ? 'var(--accent)' :
                    type === 'info' ? 'var(--info)' :
                        'var(--primary)',
        },
        value: {
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
        },
        subValue: {
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            marginTop: 'var(--space-xs)',
        },
        progressBar: {
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-full)',
            marginTop: 'var(--space-md)',
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            width: `${Math.min(progress || 0, 100)}%`,
            backgroundColor: type === 'success' ? 'var(--success)' :
                type === 'accent' ? 'var(--accent)' :
                    type === 'info' ? 'var(--info)' :
                        'var(--primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 1s ease-out',
        }
    };

    return (
        <div style={styles.card} className="card-hover">
            <div style={styles.header}>
                <span style={styles.label}>{label}</span>
                {Icon && (
                    <div style={styles.iconWrapper}>
                        <Icon size={20} />
                    </div>
                )}
            </div>

            <div style={styles.value}>{value}</div>

            {subValue && (
                <div style={styles.subValue}>
                    {subValue}
                </div>
            )}

            {progress !== undefined && (
                <div style={styles.progressBar}>
                    <div style={styles.progressFill} />
                </div>
            )}
        </div>
    );
};

export default StatCard;
