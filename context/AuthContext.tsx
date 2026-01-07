// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => boolean;
    register: (email: string, password: string, name: string, phone?: string, addressData?: { zonecode?: string; address?: string; addressDetail?: string }) => { success: boolean; error?: string };
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

    const login = (email: string, password?: string): boolean => {
        // Check if this is an admin email
        const isAdminEmail = email.includes('admin') || email.includes('manager');

        // Check if user exists in registered users
        const usersStr = localStorage.getItem('registered_users');
        const users: Record<string, { password: string; user: User }> = usersStr ? JSON.parse(usersStr) : {};

        if (users[email]) {
            // User exists, check password
            if (password && users[email].password === password) {
                // Update isAdmin based on email pattern
                const userWithAdmin = { ...users[email].user, isAdmin: isAdminEmail };
                setUser(userWithAdmin);
                localStorage.setItem('auth_user', JSON.stringify(userWithAdmin));
                return true;
            }
            return false; // Wrong password
        }

        // For admin emails without registration, allow login (like adminLogin behavior)
        if (isAdminEmail) {
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

        // Fallback: for demo, allow email-only login
        const savedUserStr = localStorage.getItem('auth_user');
        if (savedUserStr) {
            const savedUser = JSON.parse(savedUserStr);
            if (savedUser.email === email) {
                setUser(savedUser);
                return true;
            }
        }

        return false;
    };

    const register = (email: string, password: string, name: string, phone?: string, addressData?: { zonecode?: string; address?: string; addressDetail?: string }): { success: boolean; error?: string } => {
        const usersStr = localStorage.getItem('registered_users');
        const users: Record<string, { password: string; user: User }> = usersStr ? JSON.parse(usersStr) : {};

        // Check if email already exists
        if (users[email]) {
            return { success: false, error: '이미 등록된 이메일입니다.' };
        }

        // Create new user
        const newUser: User = {
            email,
            name,
            phoneNumber: phone,
            zonecode: addressData?.zonecode,
            address: addressData?.address,
            addressDetail: addressData?.addressDetail,
            points: 1000, // Welcome bonus
            isAdmin: false
        };

        // Save to registered users
        users[email] = { password, user: newUser };
        localStorage.setItem('registered_users', JSON.stringify(users));

        // Auto login
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));

        // Sync with Admin Panel (admin_users_mock)
        const adminUsersStr = localStorage.getItem('admin_users_mock');
        const adminUsers = adminUsersStr ? JSON.parse(adminUsersStr) : [];

        // Check if already in admin list (by email) to avoid duplicates
        // Note: The main check above prevents email duplicates, but good to be safe
        const existingAdminIndex = adminUsers.findIndex((u: any) => u.email === email);

        if (existingAdminIndex === -1) {
            const newAdminUser = {
                ...newUser,
                id: Date.now().toString(), // Simple ID generation
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                totalOrders: 0,
                totalSpent: 0
            };
            const updatedAdminUsers = [newAdminUser, ...adminUsers];
            localStorage.setItem('admin_users_mock', JSON.stringify(updatedAdminUsers));
        }

        return { success: true };
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
        <AuthContext.Provider value={{ user, login, register, adminLogin, logout, updateUser, deleteUser, isLoading }}>
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
