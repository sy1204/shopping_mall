// app/checkout/success/page.tsx
'use client';

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
            <p className="text-gray-600 mb-12">
                Your order has been placed successfully.<br />
                You can check your order status in My Page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/mypage"
                    className="bg-black text-white px-8 py-4 font-bold hover:bg-gray-800"
                >
                    VIEW ORDER DETAILS
                </Link>
                <Link
                    href="/shop"
                    className="border border-gray-300 text-gray-700 px-8 py-4 font-bold hover:bg-gray-50"
                >
                    CONTINUE SHOPPING
                </Link>
            </div>
        </div>
    );
}
