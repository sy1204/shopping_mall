// utils/orderStorage.ts
import { Order } from "@/types";
import { supabase } from "./supabase/client";

// Get orders (optionally filtered by user)
export const getOrders = async (userId?: string): Promise<Order[]> => {
    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    return data.map(mapDbToOrder);
};

// Save new order
export const saveOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
    const newOrder = {
        user_id: orderData.userId,
        total_price: orderData.totalPrice,
        status: 'Paid',
        shipping_address: orderData.shippingAddress,
        items: orderData.items,
    };

    const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

    if (error) {
        console.error('Failed to save order:', error);
        throw error;
    }

    return mapDbToOrder(data);
};

// Update order status
export const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    extraUpdates?: Partial<Order>
): Promise<Order[]> => {
    const updates: Record<string, unknown> = { status };

    if (extraUpdates?.trackingNumber) updates.tracking_number = extraUpdates.trackingNumber;
    if (extraUpdates?.adminMemo) updates.admin_memo = extraUpdates.adminMemo;
    if (extraUpdates?.returnReason) updates.return_reason = extraUpdates.returnReason;
    if (extraUpdates?.exchangeReason) updates.exchange_reason = extraUpdates.exchangeReason;

    const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

    if (error) {
        console.error('Failed to update order:', error);
        throw error;
    }

    return getOrders();
};

// Helper: Map DB row to Order type
function mapDbToOrder(row: Record<string, unknown>): Order {
    const items = row.items as Order['items'] || [];
    const shippingAddress = row.shipping_address as Order['shippingAddress'] || { name: '', address: '', phone: '' };

    return {
        id: row.id as string,
        date: row.created_at as string,
        items,
        totalPrice: row.total_price as number,
        shippingAddress,
        status: row.status as Order['status'],
        trackingNumber: row.tracking_number as string | undefined,
        usedPoints: (row.used_points as number) || 0,
        earnedPoints: (row.earned_points as number) || 0,
        adminMemo: row.admin_memo as string | undefined,
        returnReason: row.return_reason as string | undefined,
        exchangeReason: row.exchange_reason as string | undefined,
        exchangeRequest: row.exchange_request as string | undefined,
        userId: row.user_id as string,
    };
}
