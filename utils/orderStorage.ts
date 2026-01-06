// utils/orderStorage.ts
import { CartItem } from "@/context/CartContext";

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    totalPrice: number;
    shippingAddress: {
        name: string;
        address: string;
        phone: string;
    };
    status: 'Pending' | 'Paid' | 'Preparing' | 'Shipped' | 'Delivered' | 'Confirmed' | 'Cancelled' | 'Return Requested' | 'Exchange Requested' | 'Return Completed' | 'Exchange Completed';
    claimStatus?: string;
    trackingNumber?: string;
    usedPoints: number;
    earnedPoints: number;
    adminMemo?: string;
}

const ORDER_STORAGE_KEY = 'shop_orders';

export const saveOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
        ...orderData,
        id: `ord_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Paid' // Mocking immediate payment
    };

    const existingOrders = getOrders();
    const updatedOrders = [newOrder, ...existingOrders];

    if (typeof window !== 'undefined') {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    }

    return newOrder;
};

const DUMMY_ORDERS: Order[] = [
    {
        id: 'ord_sample_1',
        date: '2025-12-20T10:00:00Z',
        items: [{ id: 'p1', name: 'Essential Oversized Wool Coat', brand: 'LOW CLASSIC', price: 348000, quantity: 1, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000'], selectedOptions: new Map([['Size', 'M']]) }],
        totalPrice: 348000,
        shippingAddress: { name: 'Kim Min-su', address: 'Seoul Gangnam-gu Teheran-ro 123', phone: '010-1234-5678' },
        status: 'Delivered',
        trackingNumber: '1234567890',
        usedPoints: 0,
        earnedPoints: 3480
    },
    {
        id: 'ord_sample_2',
        date: '2025-12-25T14:30:00Z',
        items: [{ id: 'p10', name: 'Running Shoes 990v5', brand: 'NEW BALANCE', price: 239000, quantity: 1, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'], selectedOptions: new Map([['Size', '270']]) }],
        totalPrice: 239000,
        shippingAddress: { name: 'Lee Ha-eun', address: 'Busan Haeundae-gu U-dong 456', phone: '010-9876-5432' },
        status: 'Return Requested',
        claimStatus: 'Size Mismatch',
        usedPoints: 5000,
        earnedPoints: 2390
    },
    {
        id: 'ord_sample_3',
        date: '2026-01-02T09:15:00Z',
        items: [{ id: 'p2', name: 'Arch Logo Hoodie', brand: 'THISISNEVERTHAT', price: 89000, quantity: 2, images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000'], selectedOptions: new Map([['Size', 'L']]) }],
        totalPrice: 178000,
        shippingAddress: { name: 'Park Ji-hoon', address: 'Incheon Namdong-gu Guwol-dong 789', phone: '010-1111-2222' },
        status: 'Preparing',
        usedPoints: 0,
        earnedPoints: 1780
    }
];

export const getOrders = (): Order[] => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!saved || JSON.parse(saved).length === 0) {
        // Initialize with dummy data if empty
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(DUMMY_ORDERS));
        return DUMMY_ORDERS;
    }

    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error('Failed to parse orders', e);
        return [];
    }
};

export const updateOrderStatus = (orderId: string, status: Order['status'], extraUpdates?: Partial<Order>) => {
    const orders = getOrders();
    const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status, ...extraUpdates } : order
    );
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
};
