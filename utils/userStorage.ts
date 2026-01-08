// utils/userStorage.ts
import { AdminUser } from "@/types";
import { supabase } from "./supabase/client";

// Get all users from Supabase profiles
export const getUsers = async (): Promise<AdminUser[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    return data.map(mapDbToAdminUser);
};

// Get user by ID or email
export const getUserById = async (userId: string): Promise<AdminUser | undefined> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${userId},email.eq.${userId}`)
        .single();

    if (error) {
        console.error('Failed to fetch user:', error);
        return undefined;
    }

    return data ? mapDbToAdminUser(data) : undefined;
};

// Update user status (requires admin privileges)
export const updateUserStatus = async (userId: string, status: AdminUser['status']): Promise<AdminUser[]> => {
    const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

    if (error) {
        console.error('Failed to update user status:', error);
        throw error;
    }

    return getUsers();
};

// Helper: Map DB row to AdminUser type
function mapDbToAdminUser(row: Record<string, unknown>): AdminUser {
    return {
        id: row.id as string,
        email: row.email as string,
        name: (row.name as string) || 'Unknown',
        joinDate: row.created_at as string,
        status: (row.status as AdminUser['status']) || 'Active',
        points: (row.points as number) || 0,
        totalOrders: 0, // Would need to query orders
        totalSpent: 0,  // Would need to query orders
        phoneNumber: row.phone_number as string | undefined,
        address: row.address as string | undefined,
        addressDetail: row.address_detail as string | undefined,
    };
}
