import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '@/api/axios';
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    email: string;
    username: string;
    // Adicione outros campos do usuário que você espera do backend
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: { user_id: string; email: string; username: string; } = jwtDecode(token);
                setUser({ id: decoded.user_id, email: decoded.email, username: decoded.username });
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token");
                logout();
            }
        }
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        const decoded: { user_id: string; email: string; username: string; } = jwtDecode(accessToken);
        setUser({ id: decoded.user_id, email: decoded.email, username: decoded.username });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
        // Opcional: notificar o backend sobre o logout
        // apiClient.post('/auth/logout/', { refresh: localStorage.getItem('refreshToken') });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
