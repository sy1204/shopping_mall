// utils/orderStorage.ts
import { Order } from "@/types";
import { DUMMY_ORDERS } from "./dummyData";

const ORDER_STORAGE_KEY = 'shop_orders';

export const getOrders = (userEmail?: string): Order[] => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    let orders: Order[] = [];

    if (!saved || JSON.parse(saved).length === 0) {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(DUMMY_ORDERS));
        orders = DUMMY_ORDERS;
    } else {
        try {
            orders = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse orders', e);
            orders = [];
        }
    }

    if (userEmail) {
        return orders.filter(order => order.userId === userEmail);
    }
    return orders;
};

export const saveOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
        ...orderData,
        id: `ord_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'Paid'
    };

    // We need to get ALL orders to append, so call getOrders without filter
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
