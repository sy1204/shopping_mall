// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
    email: string;
    name: string;
    phoneNumber?: string;
    address?: string;
    addressDetail?: string;
    zipCode?: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    adminLogin: (email: string) => boolean;
    logout: () => void;
    updateUser: (updatedData: Partial<User>) => void;
    deleteUser: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (email: string) => {
        // Mock login: extract name from email or use default
        // In a real app, this would fetch user data from DB
        const savedUserStr = localStorage.getItem('auth_user');
        if (savedUserStr) {
            const savedUser = JSON.parse(savedUserStr);
            if (savedUser.email === email) {
                setUser(savedUser);
                return;
            }
        }

        const name = email.split('@')[0];
        const newUser: User = {
            email,
            name,
            points: 0, // Default points
            isAdmin: false
        };

        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
    };

    const adminLogin = (email: string): boolean => {
        // Simple mock admin check
        if (email.includes('admin') || email.includes('manager')) {
            const name = email.split('@')[0];
            const adminUser: User = {
                email,
                name,
                points: 0,
                isAdmin: true
            };
            setUser(adminUser);
            localStorage.setItem('auth_user', JSON.stringify(adminUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
    };

    const updateUser = (updatedData: Partial<User>) => {
        if (!user) return;
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
    };

    const deleteUser = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        // Theoretically should also clear orders/reviews/etc. associated with user in a real backend
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, logout, updateUser, deleteUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
