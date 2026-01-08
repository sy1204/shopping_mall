// utils/boardStorage.ts
import { Review, ProductInquiry, OneToOneInquiry, Notice, FAQ } from "@/types";
import { supabase } from "./supabase/client";
import { DUMMY_NOTICES, DUMMY_FAQS } from "./dummyData";

// =====================
// REVIEWS
// =====================

export const getReviews = async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
    return (data || []).map(mapDbToReview);
};

export const getAllReviews = async (): Promise<Review[]> => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch all reviews:', error);
        return [];
    }
    return (data || []).map(mapDbToReview);
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    const { data, error } = await supabase
        .from('reviews')
        .insert({
            product_id: review.productId,
            user_id: review.userId,
            user_name: review.userName,
            rating: review.rating,
            content: review.content,
            images: review.images || [],
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add review:', error);
        throw error;
    }
    return mapDbToReview(data);
};

export const getMyReviews = async (userId: string): Promise<Review[]> => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch my reviews:', error);
        return [];
    }
    return (data || []).map(mapDbToReview);
};

// =====================
// PRODUCT INQUIRIES
// =====================

export const getProductInquiries = async (productId: string): Promise<ProductInquiry[]> => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'product')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch product inquiries:', error);
        return [];
    }
    return (data || []).map(mapDbToProductInquiry);
};

export const getAllProductInquiries = async (): Promise<ProductInquiry[]> => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'product')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch all product inquiries:', error);
        return [];
    }
    return (data || []).map(mapDbToProductInquiry);
};

export const addProductInquiry = async (inquiry: Omit<ProductInquiry, 'id' | 'createdAt'>): Promise<ProductInquiry> => {
    const { data, error } = await supabase
        .from('inquiries')
        .insert({
            type: 'product',
            product_id: inquiry.productId,
            user_id: inquiry.userId,
            user_name: inquiry.userName,
            content: inquiry.content,
            is_secret: inquiry.isSecret,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add product inquiry:', error);
        throw error;
    }
    return mapDbToProductInquiry(data);
};

export const getMyProductInquiries = async (userId: string): Promise<ProductInquiry[]> => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'product')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch my product inquiries:', error);
        return [];
    }
    return (data || []).map(mapDbToProductInquiry);
};

export const updateProductInquiry = async (id: string, updates: Partial<ProductInquiry>): Promise<ProductInquiry | undefined> => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.answer !== undefined) dbUpdates.answer = updates.answer;
    if (updates.content !== undefined) dbUpdates.content = updates.content;

    const { data, error } = await supabase
        .from('inquiries')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Failed to update product inquiry:', error);
        return undefined;
    }
    return mapDbToProductInquiry(data);
};

// =====================
// 1:1 INQUIRIES
// =====================

export const getMyInquiries = async (userId: string): Promise<OneToOneInquiry[]> => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'oneday')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch 1:1 inquiries:', error);
        return [];
    }
    return (data || []).map(mapDbToOneToOneInquiry);
};

export const getAllOneToOneInquiries = async (): Promise<OneToOneInquiry[]> => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'oneday')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch all 1:1 inquiries:', error);
        return [];
    }
    return (data || []).map(mapDbToOneToOneInquiry);
};

export const addOneToOneInquiry = async (inquiry: Omit<OneToOneInquiry, 'id' | 'createdAt' | 'status'>): Promise<OneToOneInquiry> => {
    const { data, error } = await supabase
        .from('inquiries')
        .insert({
            type: 'oneday',
            user_id: inquiry.userId,
            category: inquiry.category,
            title: inquiry.title,
            content: inquiry.content,
            status: 'Pending',
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add 1:1 inquiry:', error);
        throw error;
    }
    return mapDbToOneToOneInquiry(data);
};

export const updateOneToOneInquiry = async (id: string, updates: Partial<OneToOneInquiry>): Promise<OneToOneInquiry | undefined> => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.answer !== undefined) dbUpdates.answer = updates.answer;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { data, error } = await supabase
        .from('inquiries')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Failed to update 1:1 inquiry:', error);
        return undefined;
    }
    return mapDbToOneToOneInquiry(data);
};

// =====================
// NOTICES
// =====================

export const getNotices = async (): Promise<Notice[]> => {
    const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch notices:', error);
        return DUMMY_NOTICES;
    }
    if (!data || data.length === 0) return DUMMY_NOTICES;
    return data.map(mapDbToNotice);
};

export const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> => {
    const { data, error } = await supabase
        .from('notices')
        .insert({
            title: notice.title,
            content: notice.content,
            category: notice.category,
            author: notice.author,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add notice:', error);
        throw error;
    }
    return mapDbToNotice(data);
};

// =====================
// FAQs
// =====================

export const getFAQs = async (): Promise<FAQ[]> => {
    const { data, error } = await supabase
        .from('faqs')
        .select('*');

    if (error) {
        console.error('Failed to fetch FAQs:', error);
        return DUMMY_FAQS;
    }
    if (!data || data.length === 0) return DUMMY_FAQS;
    return data.map(mapDbToFAQ);
};

export const addFAQ = async (faq: Omit<FAQ, 'id'>): Promise<FAQ> => {
    const { data, error } = await supabase
        .from('faqs')
        .insert({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to add FAQ:', error);
        throw error;
    }
    return mapDbToFAQ(data);
};

// =====================
// INITIALIZATION (no-op for Supabase)
// =====================
export function initializeBoardData() {
    // No-op: Data is managed in Supabase
}

// =====================
// MAPPERS
// =====================

function mapDbToReview(row: Record<string, unknown>): Review {
    return {
        id: row.id as string,
        productId: row.product_id as string,
        userId: row.user_id as string,
        userName: (row.user_name as string) || 'Unknown',
        rating: row.rating as number,
        content: row.content as string,
        images: (row.images as string[]) || [],
        createdAt: row.created_at as string,
    };
}

function mapDbToProductInquiry(row: Record<string, unknown>): ProductInquiry {
    return {
        id: row.id as string,
        productId: row.product_id as string,
        userId: row.user_id as string,
        userName: (row.user_name as string) || 'Unknown',
        isSecret: row.is_secret as boolean,
        content: row.content as string,
        answer: row.answer as string | undefined,
        createdAt: row.created_at as string,
    };
}

function mapDbToOneToOneInquiry(row: Record<string, unknown>): OneToOneInquiry {
    return {
        id: row.id as string,
        userId: row.user_id as string,
        category: row.category as string,
        title: row.title as string,
        content: row.content as string,
        answer: row.answer as string | undefined,
        status: (row.status as 'Pending' | 'Answered') || 'Pending',
        createdAt: row.created_at as string,
    };
}

function mapDbToNotice(row: Record<string, unknown>): Notice {
    return {
        id: row.id as string,
        title: row.title as string,
        content: row.content as string,
        category: row.category as Notice['category'],
        author: row.author as string,
        createdAt: row.created_at as string,
    };
}

function mapDbToFAQ(row: Record<string, unknown>): FAQ {
    return {
        id: row.id as string,
        question: row.question as string,
        answer: row.answer as string,
        category: row.category as string,
    };
}
