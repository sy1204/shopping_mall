// app/checkout/order/page.tsx
'use client';

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { saveOrder } from "@/utils/orderStorage";

export default function OrderPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isOrderComplete = useRef(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        detailAddress: ''
    });

    const [pointsToUse, setPointsToUse] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('신용카드');

    // Load user info manually
    const handleLoadUserInfo = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phoneNumber || '',
                address: user.address || '',
                detailAddress: user.addressDetail || ''
            });
        } else {
            alert('로그인이 필요합니다.');
        }
    };

    useEffect(() => {
        // If items are empty and we haven't just placed an order, redirect to cart
        if (items.length === 0 && !isOrderComplete.current) {
            router.replace('/checkout');
        }
    }, [items, router]);

    const maxPoints = user?.points || 0;
    const finalPrice = Math.max(0, totalPrice - pointsToUse);
    const earnedPoints = Math.floor(finalPrice * 0.01);

    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        if (val < 0) return;
        if (val > maxPoints) {
            setPointsToUse(maxPoints);
        } else if (val > totalPrice) {
            setPointsToUse(totalPrice);
        } else {
            setPointsToUse(val);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Deduct points if used
            if (pointsToUse > 0 && user) {
                const newPoints = Math.max(0, user.points - pointsToUse);
                updateUser({ points: newPoints });
            }

            // Save Order Mock
            saveOrder({
                items,
                totalPrice,
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    address: `${formData.address} ${formData.detailAddress}`.trim()
                },
                status: 'Paid',
                usedPoints: pointsToUse,
                earnedPoints: earnedPoints
            });

            alert('주문이 완료되었습니다!');

            isOrderComplete.current = true; // Set flag before clearing cart
            clearCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error(error);
            alert('주문 처리 중 오류가 발생했습니다.');
            setIsSubmitting(false);
        }
    };

    // If items are empty (and not just completed), we are redirecting, so return null
    if (items.length === 0 && !isOrderComplete.current) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-8">주문/결제</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Order Form */}
                <div className="w-full lg:w-2/3">
                    <form id="order-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Info */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                <h2 className="text-lg font-bold">배송 정보</h2>
                                <button
                                    type="button"
                                    onClick={handleLoadUserInfo}
                                    className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-gray-700"
                                >
                                    내 정보 불러오기
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">받는 사람</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border p-2"
                                        placeholder="홍길동"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">연락처</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full border p-2"
                                        placeholder="010-0000-0000"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">주소</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border p-2 mb-2"
                                        placeholder="기본 주소"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="w-full border p-2"
                                        placeholder="상세 주소"
                                        value={formData.detailAddress}
                                        onChange={e => setFormData({ ...formData, detailAddress: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Points */}
                        <section className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">적립금 사용</h2>
                            <div className="flex items-center gap-4 mb-2">
                                <input
                                    type="number"
                                    className="border p-2 w-32 text-right"
                                    value={pointsToUse}
                                    onChange={handlePointChange}
                                    min="0"
                                    max={Math.min(maxPoints, totalPrice)}
                                />
                                <span className="font-bold">P</span>
                                <button
                                    type="button"
                                    onClick={() => setPointsToUse(Math.min(maxPoints, totalPrice))}
                                    className="text-sm bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800"
                                >
                                    전액사용
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">
                                보유 적립금: <span className="font-bold text-black">{maxPoints.toLocaleString()} P</span>
                            </p>
                        </section>

                        {/* Payment Method */}
                        <section>
                            <h2 className="text-xl font-bold mb-4">결제 수단</h2>
                            <div className="flex gap-4">
                                {['신용카드', '무통장입금', '네이버페이'].map(method => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex-1 py-4 border font-bold rounded ${paymentMethod === method ? 'border-black bg-black text-white' : 'text-gray-400 border-gray-200'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50 p-6 sticky top-24 rounded-lg">
                        <h2 className="text-xl font-bold mb-6">결제 금액</h2>

                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">총 상품금액</span>
                                <span className="font-bold">{totalPrice.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">배송비</span>
                                <span className="font-bold">0원</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>적립금 사용</span>
                                <span>- {pointsToUse.toLocaleString()}원</span>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-end">
                                <span className="font-bold text-lg">최종 결제 금액</span>
                                <span className="text-2xl font-bold text-black">{finalPrice.toLocaleString()}원</span>
                            </div>
                            <div className="text-right text-xs text-blue-600 mt-2 font-medium">
                                <span>구매 확정 시 {earnedPoints.toLocaleString()}P 적립 예정</span>
                            </div>
                        </div>

                        <button
                            form="order-form"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 rounded"
                        >
                            {isSubmitting ? '결제 처리 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
