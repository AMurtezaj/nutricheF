import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import '../../styles/design-system.css';

const TopBar = () => {
    const { user } = useUser();

    const styles = {
        topbar: {
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-xl)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            borderBottom: '1px solid var(--border-color)',
        },
        searchContainer: {
            position: 'relative',
            width: '300px',
        },
        searchInput: {
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-app)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-body)',
            transition: 'var(--transition)',
        },
        searchIcon: {
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
        },
        actions: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-lg)',
        },
        iconBtn: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            position: 'relative',
            transition: 'var(--transition)',
        },
        profileBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontWeight: '500',
        },
        badge: {
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger)',
        }
    };

    return (
        <header style={styles.topbar}>
            <div style={styles.searchContainer}>
                <FaSearch style={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search for meals, ingredients..."
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.actions}>
                <button style={styles.iconBtn}>
                    <FaBell size={20} />
                    <span style={styles.badge}></span>
                </button>

                <Link to="/profile" style={styles.profileBtn}>
                    <FaUserCircle size={32} color="var(--primary)" />
                    <span>{user ? user.first_name : 'Guest'}</span>
                </Link>
            </div>
        </header>
    );
};

export default TopBar;
