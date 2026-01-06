// app/admin/users/[id]/page.tsx
'use client';

import { getUsers, User } from "@/utils/userStorage";
import { getOrders, Order } from "@/utils/orderStorage";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!id) return;

        const allUsers = getUsers();
        const foundUser = allUsers.find(u => u.id === id);

        if (foundUser) {
            setUser(foundUser);
            // Fetch orders for this user (matching by email or name - simplistic mock matching)
            const allOrders = getOrders();
            const matchedOrders = allOrders.filter(o =>
                o.shippingAddress.name === foundUser.name ||
                (foundUser.email.includes(o.shippingAddress.name)) // very loose matching for mock
            );
            // Better mock matching: In real app, order would probably have userId. 
            // For now, let's just use the index mock or simplistic name match. 
            // Actually, my dummy orders have names 'Kim Min-su', 'Lee Ha-eun'. 
            // My dummy users have names 'Kim Min-su', 'Lee Ha-eun'. Perfect.
            setUserOrders(matchedOrders);
        } else {
            alert('User not found');
            router.push('/admin/users');
        }
    }, [id, router]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-black">
                    ← 회원 목록으로 돌아가기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                                {user.name[0]}
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">가입일</span>
                                <span className="font-medium">{user.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">회원 등급</span>
                                <span className="font-medium">FAMILY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">상태</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold
                                     ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
                                    {user.status}
                                </span>
                            </div>
                            {/* Contact Info */}
                            <div className="pt-4 border-t space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">연락처</p>
                                    <p className="text-sm font-medium">{user.phoneNumber || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">주소</p>
                                    <p className="text-sm font-medium break-all">
                                        {user.address || '-'}
                                        {user.addressDetail ? ` ${user.addressDetail}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-black text-white p-4 rounded-lg text-center">
                            <p className="text-sm opacity-80 mb-1">보유 포인트</p>
                            <p className="text-2xl font-bold">{user.points.toLocaleString()} P</p>
                        </div>
                    </div>
                </div>

                {/* detailed Info / Order History */}
                <div className="col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <p className="text-gray-500 text-sm mb-1">총 주문 횟수</p>
                            <p className="text-2xl font-bold">{user.totalOrders}회</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <p className="text-gray-500 text-sm mb-1">총 결제 금액</p>
                            <p className="text-2xl font-bold">₩ {user.totalSpent.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 font-bold">
                            최근 주문 내역
                        </div>
                        {userOrders.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="p-4 text-gray-500 font-normal">주문번호</th>
                                        <th className="p-4 text-gray-500 font-normal">상품정보</th>
                                        <th className="p-4 text-gray-500 font-normal text-right">금액</th>
                                        <th className="p-4 text-gray-500 font-normal text-center">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {userOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-blue-600 hover:underline">
                                                <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold">{order.items[0].name}</p>
                                                {order.items.length > 1 && <span className="text-xs text-gray-400">외 {order.items.length - 1}건</span>}
                                            </td>
                                            <td className="p-4 text-right font-medium">₩ {order.totalPrice.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                주문 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
