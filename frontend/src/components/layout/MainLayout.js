import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../styles/design-system.css';

const MainLayout = ({ children }) => {
    const styles = {
        layout: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-app)',
        },
        mainContent: {
            flex: 1,
            marginLeft: '280px', // Width of Sidebar
            display: 'flex',
            flexDirection: 'column',
        },
        contentArea: {
            padding: 'var(--space-xl)',
            flex: 1,
            overflowY: 'auto',
        }
    };

    return (
        <div style={styles.layout}>
            <Sidebar />
            <main style={styles.mainContent}>
                <TopBar />
                <div style={styles.contentArea}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
