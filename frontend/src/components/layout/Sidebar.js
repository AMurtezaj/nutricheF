import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
    FaHome,
    FaUtensils,
    FaHeart,
    FaChartPie,
    FaMagic,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaCalendarAlt
} from 'react-icons/fa';
import '../../styles/design-system.css';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useUser();

    const navItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/meals', icon: FaUtensils, label: 'Find Meals' },
        { path: '/saved', icon: FaHeart, label: 'Saved Meals' },
        { path: '/meal-planner', icon: FaCalendarAlt, label: 'Meal Planner' },
        { path: '/recommendations', icon: FaMagic, label: 'For You' },
        { path: '/nutrition', icon: FaChartPie, label: 'Nutrition' },
    ];

    const bottomItems = [
        { path: '/profile', icon: FaUser, label: 'Profile' },
        { path: '/settings', icon: FaCog, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    const styles = {
        sidebar: {
            width: '280px',
            height: '100vh',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s ease',
        },
        logo: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--primary)',
            marginBottom: 'var(--space-2xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
        },
        navSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
            flex: 1,
        },
        navItem: (active) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
            backgroundColor: active ? 'var(--primary-soft)' : 'transparent',
            fontWeight: active ? '600' : '500',
            transition: 'var(--transition)',
        }),
        logoutBtn: {
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            padding: '0.75rem 1rem',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontWeight: '500',
            width: '100%',
            textAlign: 'left',
        }
    };

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <span>🍽️</span> NutriChef AI
            </div>

            <nav style={styles.navSection}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => styles.navItem(isActive)}
                        className="sidebar-link"
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => styles.navItem(isActive)}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
                <button onClick={logout} style={styles.logoutBtn} className="sidebar-logout">
                    <FaSignOutAlt size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
