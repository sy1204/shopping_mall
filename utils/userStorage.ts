import { User, AdminUser } from "@/types";
import { DUMMY_USERS } from "./dummyData";

const USER_STORAGE_KEY = 'registered_users';

export const getUsers = (): { [email: string]: User } => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
};

export const getUserByEmail = (email: string): User | undefined => {
    // 1. Check registered users (localStorage)
    const users = getUsers();
    if (users[email]) return users[email];

    // 2. Check dummy/admin users
    const dummyUser = DUMMY_USERS.find(u => u.email === email);
    if (dummyUser) return dummyUser;

    return undefined;
};
