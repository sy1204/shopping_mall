import { AdminUser } from "@/types";
import { DUMMY_USERS } from "./dummyData";

const STORAGE_KEYS = {
    USERS: 'admin_users_mock',
};

export const getUsers = (): AdminUser[] => {
    if (typeof window === 'undefined') return DUMMY_USERS;

    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DUMMY_USERS));
        return DUMMY_USERS;
    }
    return JSON.parse(stored);
};

export const getUserById = (userId: string): AdminUser | undefined => {
    const users = getUsers();
    return users.find(u => u.id === userId || u.email === userId);
};

export const updateUserStatus = (userId: string, status: AdminUser['status']): AdminUser[] => {
    const users = getUsers();
    const updated = users.map(user =>
        user.id === userId ? { ...user, status } : user
    );

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }

    return updated;
};
