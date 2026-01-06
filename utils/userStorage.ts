// utils/userStorage.ts
import { AdminUser } from "@/types";
import { DUMMY_USERS } from "./dummyData";

const STORAGE_KEY = 'admin_users_mock';

export const getUsers = (): AdminUser[] => {
    if (typeof window === 'undefined') return DUMMY_USERS;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_USERS));
        return DUMMY_USERS;
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to parse users', e);
        return DUMMY_USERS;
    }
};

export const updateUserStatus = (userId: string, status: AdminUser['status']) => {
    const users = getUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, status } : u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    return updatedUsers;
};
