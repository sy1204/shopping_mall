import { User, AdminUser } from "@/types";
import { DUMMY_USERS } from "./dummyData";

const USER_STORAGE_KEY = 'registered_users';

export const getUsers = (): AdminUser[] => {
    if (typeof window === 'undefined') return DUMMY_USERS;

    let registeredUsers: AdminUser[] = [];
    try {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
            const usersMap: { [email: string]: User } = JSON.parse(saved);
            registeredUsers = Object.values(usersMap).map((u, i) => ({
                ...u,
                // Ensure AdminUser compatible fields
                id: u.email, // Use email as ID for registered users if no ID
                joinDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                totalOrders: 0,
                totalSpent: 0,
                points: u.points || 0
            }));
        }
    } catch (e) {
        console.error("Failed to load users", e);
    }

    // Merge Dummy Users and Registered Users
    // In a real app we would de-duplicate or have a better system
    return [...DUMMY_USERS, ...registeredUsers];
};

export const getUserByEmail = (email: string): User | undefined => {
    // 1. Check registered users (localStorage)
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
            const users = JSON.parse(saved);
            if (users[email]) return users[email];
        }
    }

    // 2. Check dummy users
    const dummyUser = DUMMY_USERS.find(u => u.email === email);
    if (dummyUser) return dummyUser;

    return undefined;
};

export const updateUserStatus = (userId: string, newStatus: AdminUser['status']): AdminUser[] => {
    // Simulating status update.
    // Since we don't have a persistent ID-based storage for all users (mixed sources),
    // we will mostly rely on returning the modified list for the UI state.
    // We are NOT persisting this to localStorage for Dummy Users, and for Registered (by email) we'd need to map back.

    // For now, just return the updated list for the view.
    const allUsers = getUsers();
    return allUsers.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
    );
};
