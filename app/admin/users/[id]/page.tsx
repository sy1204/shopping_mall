// app/admin/users/[id]/page.tsx
'use client';

import { getUsers } from "@/utils/userStorage";
import { getOrders } from "@/utils/orderStorage";
import { AdminUser, Order } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [user, setUser] = useState<AdminUser | null>(null);
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
            setUserOrders(matchedOrders);
        } else {
            alert('User not found');
            router.push('/admin/users');
        }
    }, [id, router]);

    if (!user) return <div className="p-8 font-mono">LOADING_USER_DATA...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-black transition-colors">
                    ← 회원 목록으로 돌아가기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded shadow-sm border">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                                {user.name[0]?.toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">가입일</span>
                                <span className="font-medium text-sm">{user.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">회원 등급</span>
                                <span className="font-medium text-sm">FAMILY</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">상태</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold
                                     ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
                                    {user.status}
                                </span>
                            </div>
                            {/* Contact Info */}
                            <div className="pt-4 border-t space-y-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-1 font-mono uppercase tracking-widest">Phone</p>
                                    <p className="text-sm font-medium">{user.phoneNumber || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-1 font-mono uppercase tracking-widest">Address</p>
                                    <p className="text-sm font-medium break-all leading-relaxed">
                                        {user.address || '-'}
                                        {user.addressDetail ? ` ${user.addressDetail}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-[var(--neural-black)] text-white p-6 rounded text-center">
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">AVAILABLE POINTS</p>
                            <p className="text-2xl font-bold font-mono tracking-tight">{(user.points || 0).toLocaleString()} P</p>
                        </div>
                    </div>
                </div>

                {/* detailed Info / Order History */}
                <div className="col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded border shadow-sm">
                            <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-1">TOTAL ORDERS</p>
                            <p className="text-2xl font-bold font-mono tracking-tight">{(user.totalOrders || 0)} TIMES</p>
                        </div>
                        <div className="bg-white p-6 rounded border shadow-sm">
                            <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mb-1">CUMULATIVE SPENDING</p>
                            <p className="text-2xl font-bold font-mono tracking-tight">₩ {(user.totalSpent || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 font-mono text-xs font-bold uppercase tracking-widest">
                            RECENT ORDER HISTORY
                        </div>
                        {userOrders.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="border-b font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
                                    <tr>
                                        <th className="p-4 font-normal">Order ID</th>
                                        <th className="p-4 font-normal">Product Info</th>
                                        <th className="p-4 font-normal text-right">Price</th>
                                        <th className="p-4 font-normal text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-xs">
                                    {userOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-mono text-blue-600 hover:underline">
                                                <Link href={`/admin/orders/${order.id}`}>#{order.id.replace('ord_', '')}</Link>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-[var(--neural-black)]">{order.items[0].name}</p>
                                                {order.items.length > 1 && <span className="text-[10px] text-gray-400">외 {order.items.length - 1}건</span>}
                                            </td>
                                            <td className="p-4 text-right font-mono font-bold">₩ {order.totalPrice.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-tighter">{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-20 text-center text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                                NO ORDER HISTORY FOUND
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
