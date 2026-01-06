// context/CartContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/utils/dummyData';

export interface CartItem extends Product {
    cartItemId: string; // Unique ID for cart item (product ID + options)
    quantity: number;
    selectedOptions: {
        size?: string;
        color?: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, options: { size?: string; color?: string }) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shopping-cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: Product, options: { size?: string; color?: string }) => {
        const cartItemId = `${product.id}-${options.size || ''}-${options.color || ''}`;

        setItems((prev) => {
            const existingItem = prev.find((item) => item.cartItemId === cartItemId);
            if (existingItem) {
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cartItemId, quantity: 1, selectedOptions: options }];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalPrice = items.reduce((acc, item) => {
        const price = item.price * (item.discount_rate ? (100 - item.discount_rate) / 100 : 1); // logic check: dummy data price is final or original? assumes final price in 'price' field usually, but waiting for clarification. 
        // Based on BuyBox component: Price is displayed as main, original is separate.
        // Let's assume 'price' is the selling price for simplicity, ignoring discount calc logic here if it was already applied.
        // Actually looking at dummyData: price: 348000, original_price: 498000. So price IS the discounted price.
        return acc + (item.price * item.quantity);
    }, 0);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
