// utils/userStorage.ts
export interface User {
    id: string;
    email: string;
    name: string;
    joinDate: string;
    status: 'Active' | 'Inactive' | 'Banned';
    points: number;
    totalOrders: number;
    totalSpent: number;
    phoneNumber?: string;
    address?: string;
    addressDetail?: string;
}

const DUMMY_USERS: User[] = [
    {
        id: 'u1', email: 'user1@example.com', name: 'Kim Min-su', joinDate: '2025-12-01', status: 'Active', points: 5000,
        totalOrders: 15,
        totalSpent: 1250000,
        phoneNumber: '010-1234-5678',
        address: 'Seoul Gangnam-gu Teheran-ro 123',
        addressDetail: 'Apt 101'
    },
    {
        id: 'u2',
        email: 'lee.he@example.com',
        name: 'Lee Ha-eun',
        joinDate: '2023-02-20',
        status: 'Active',
        points: 2000,
        totalOrders: 3,
        totalSpent: 450000,
        phoneNumber: '010-9876-5432',
        address: 'Busan Haeundae-gu U-dong 456',
        addressDetail: 'Suite 202'
    },
    {
        id: 'u3',
        email: 'park.jh@example.com',
        name: 'Park Ji-hoon',
        joinDate: '2023-03-05',
        status: 'Inactive',
        points: 0,
        totalOrders: 1,
        totalSpent: 89000
    },
    { id: 'u4', email: 'user4@example.com', name: 'Choi So-yeon', joinDate: '2025-12-12', status: 'Active', points: 3400, totalOrders: 8, totalSpent: 890000 },
    { id: 'u5', email: 'user5@example.com', name: 'Jung Woo-sung', joinDate: '2025-12-15', status: 'Active', points: 150, totalOrders: 1, totalSpent: 45000 },
    { id: 'u6', email: 'user6@example.com', name: 'Kang Ji-won', joinDate: '2025-12-20', status: 'Banned', points: 0, totalOrders: 0, totalSpent: 0 },
    { id: 'u7', email: 'user7@example.com', name: 'Yoon Seo-joon', joinDate: '2025-12-22', status: 'Active', points: 5600, totalOrders: 12, totalSpent: 1250000 },
    { id: 'u8', email: 'user8@example.com', name: 'Lim Da-in', joinDate: '2025-12-25', status: 'Active', points: 890, totalOrders: 3, totalSpent: 210000 },
    { id: 'u9', email: 'user9@example.com', name: 'Han Tae-yong', joinDate: '2025-12-28', status: 'Inactive', points: 200, totalOrders: 1, totalSpent: 30000 },
    { id: 'u10', email: 'user10@example.com', name: 'Song Min-ji', joinDate: '2026-01-02', status: 'Active', points: 1100, totalOrders: 4, totalSpent: 380000 },
];

const STORAGE_KEY = 'admin_users_mock';

// Initialize with dummy data if empty or if version mismatch
export const initUsers = () => {
    if (typeof window === 'undefined') return;

    // Simple version check by checking if u1 has phoneNumber
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (!storedUsers) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_USERS));
        return;
    }

    const parsedUsers = JSON.parse(storedUsers);
    if (parsedUsers.length > 0 && !parsedUsers[0].phoneNumber) {
        // Old data detected, overwrite with new dummy data
        console.log('Old user data detected. Refreshing with new schema...');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_USERS));
    }
};

export function getUsers(): User[] {
    if (typeof window === 'undefined') return DUMMY_USERS;

    initUsers(); // Ensure localStorage is initialized/updated

    const stored = localStorage.getItem(STORAGE_KEY);
    // At this point, 'stored' should always exist due to initUsers,
    // but a fallback is good practice in case of localStorage issues.
    if (!stored) {
        return DUMMY_USERS; // Fallback to dummy data if initUsers somehow failed or data was cleared
    }
    return JSON.parse(stored);
}

export function updateUserStatus(userId: string, status: User['status']) {
    const users = getUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, status } : u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    return updatedUsers;
}
