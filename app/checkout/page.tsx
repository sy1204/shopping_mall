// app/checkout/page.tsx
'use client';

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Cart is empty</h1>
                <p className="mb-8 text-gray-500">Add some items to your cart to proceed.</p>
                <Link href="/shop" className="inline-block bg-black text-white px-6 py-3 font-bold hover:bg-gray-800">
                    Go Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.length})</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="w-full lg:w-2/3">
                    <ul className="divide-y border-t border-b">
                        {items.map((item) => (
                            <li key={item.cartItemId} className="py-6 flex gap-6">
                                <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={item.images[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.brand}</h3>
                                                <p className="text-sm text-gray-600">{item.name}</p>
                                                {item.selectedOptions.size && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Size: {item.selectedOptions.size}
                                                        {item.selectedOptions.color && ` / Color: ${item.selectedOptions.color}`}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium min-w-[32px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="font-bold">
                                            {(item.price * item.quantity).toLocaleString()} KRW
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Summary Sidebar */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50 p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>{totalPrice.toLocaleString()} KRW</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{totalPrice.toLocaleString()} KRW</span>
                            </div>
                        </div>
                        <Link
                            href="/checkout/order"
                            className="block w-full bg-black text-white text-center py-4 font-bold hover:bg-gray-900 transition-colors mb-4"
                        >
                            PROCEED TO CHECKOUT
                        </Link>
                        <Link
                            href="/shop"
                            className="block w-full border border-gray-300 text-gray-700 text-center py-4 font-bold hover:bg-white transition-colors"
                        >
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
