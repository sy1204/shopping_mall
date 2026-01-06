// context/CartContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem } from '@/types';

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
