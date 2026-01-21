import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI } from '../services/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [currentUserId, setCurrentUserId] = useState(() => {
        const saved = localStorage.getItem('currentUserId');
        return saved ? parseInt(saved) : null;
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (currentUserId) {
                try {
                    const response = await userAPI.get(currentUserId);
                    setUser(response.data);
                } catch (err) {
                    console.error('Failed to load user', err);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        loadUser();
    }, [currentUserId]);

    const login = (userId) => {
        setCurrentUserId(userId);
        localStorage.setItem('currentUserId', userId.toString());
    };

    const logout = () => {
        setCurrentUserId(null);
        setUser(null);
        localStorage.removeItem('currentUserId');
    };

    const refreshUser = async () => {
        if (currentUserId) {
            try {
                const response = await userAPI.get(currentUserId);
                setUser(response.data);
            } catch (err) {
                console.error('Failed to refresh user', err);
            }
        }
    };

    return (
        <UserContext.Provider value={{
            currentUserId,
            user,
            loading,
            login,
            logout,
            refreshUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
