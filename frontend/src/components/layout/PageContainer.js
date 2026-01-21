import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/design-system.css';

const PageContainer = ({ title, subtitle, action, children }) => {
    const styles = {
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            marginBottom: 'var(--space-xl)',
        },
        titleGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
        },
        title: {
            fontSize: 'var(--text-3xl)',
            color: 'var(--text-primary)',
            margin: 0,
        },
        subtitle: {
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-base)',
            margin: 0,
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {(title || action) && (
                <div style={styles.header}>
                    <div style={styles.titleGroup}>
                        {title && <h1 style={styles.title}>{title}</h1>}
                        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default PageContainer;
