// utils/productStorage.ts
import { Product } from "@/types";
import { supabase } from "./supabase/client";
import { DUMMY_PRODUCTS } from "./dummyData";

// Get all products
export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch products:', error);
        return DUMMY_PRODUCTS; // Fallback to dummy data
    }

    if (!data || data.length === 0) {
        return DUMMY_PRODUCTS;
    }

    return data.map(mapDbToProduct);
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Failed to fetch product:', error);
        // Fallback: search in dummy data
        return DUMMY_PRODUCTS.find(p => p.id === id);
    }

    return data ? mapDbToProduct(data) : undefined;
};

// Save new product
export const saveProduct = async (productData: Omit<Product, 'id' | 'like_count' | 'review_count'>): Promise<Product> => {
    const newProduct = {
        name: productData.name,
        brand: productData.brand,
        price: productData.price,
        original_price: productData.original_price || null,
        discount_rate: productData.discount_rate || 0,
        category: productData.category,
        images: productData.images,
        is_best: productData.is_best || false,
        is_new: productData.is_new || false,
        story_content: productData.story_content || null,
    };

    const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

    if (error) {
        console.error('Failed to save product:', error);
        throw error;
    }

    return mapDbToProduct(data);
};

// Update product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product[]> => {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.original_price !== undefined) dbUpdates.original_price = updates.original_price;
    if (updates.discount_rate !== undefined) dbUpdates.discount_rate = updates.discount_rate;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.is_best !== undefined) dbUpdates.is_best = updates.is_best;
    if (updates.is_new !== undefined) dbUpdates.is_new = updates.is_new;
    if (updates.story_content !== undefined) dbUpdates.story_content = updates.story_content;

    const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

    if (error) {
        console.error('Failed to update product:', error);
        throw error;
    }

    return getProducts();
};

// Delete product
export const deleteProduct = async (id: string): Promise<Product[]> => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Failed to delete product:', error);
        throw error;
    }

    return getProducts();
};

// Helper: Map DB row to Product type
function mapDbToProduct(row: Record<string, unknown>): Product {
    return {
        id: row.id as string,
        name: row.name as string,
        brand: row.brand as string,
        price: row.price as number,
        original_price: row.original_price as number | undefined,
        discount_rate: row.discount_rate as number | undefined,
        category: row.category as string,
        images: (row.images as string[]) || [],
        is_best: row.is_best as boolean | undefined,
        is_new: row.is_new as boolean | undefined,
        like_count: 0, // Will be calculated from reviews/likes table
        review_count: 0, // Will be calculated
        story_content: row.story_content as string | undefined,
    };
}
