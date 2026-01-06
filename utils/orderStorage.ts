// utils/orderStorage.ts
import { Order } from "@/types";
import { DUMMY_ORDERS } from "./dummyData";

const ORDER_STORAGE_KEY = 'shop_orders';

export const getOrders = (): Order[] => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!saved || JSON.parse(saved).length === 0) {
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

export const saveOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
        ...orderData,
        id: `ord_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Paid'
    };

    const existingOrders = getOrders();
    const updatedOrders = [newOrder, ...existingOrders];

    if (typeof window !== 'undefined') {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    }

    return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status'], extraUpdates?: Partial<Order>) => {
    const orders = getOrders();
    const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status, ...extraUpdates } : order
    );
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updatedOrders));
    return updatedOrders;
};
