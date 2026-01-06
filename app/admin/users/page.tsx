// app/admin/users/page.tsx
'use client';

import { getUsers, updateUserStatus, User } from "@/utils/userStorage";
import { useState, useEffect } from "react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const handleStatusChange = (userId: string, newStatus: User['status']) => {
        if (confirm(`Change user status to ${newStatus}?`)) {
            const updated = updateUserStatus(userId, newStatus);
            setUsers(updated);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">회원 관리</h1>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">회원명/이메일</th>
                            <th className="p-4 font-medium text-gray-500">가입일</th>
                            <th className="p-4 font-medium text-gray-500 text-right">포인트</th>
                            <th className="p-4 font-medium text-gray-500 text-right">구매금액 (건수)</th>
                            <th className="p-4 font-medium text-gray-500 text-center">상태</th>
                            <th className="p-4 font-medium text-gray-500 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-bold">
                                        <a href={`/admin/users/${user.id}`} className="hover:text-blue-600 hover:underline">
                                            {user.name}
                                        </a>
                                    </div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4 text-gray-500">
                                    {user.joinDate}
                                </td>
                                <td className="p-4 text-right font-medium">
                                    {user.points.toLocaleString()} P
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-medium">₩ {user.totalSpent.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">{user.totalOrders}건</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold
                                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
                                        {user.status === 'Active' ? '활동중' :
                                            user.status === 'Inactive' ? '휴면' : '정지'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <select
                                        className="border rounded p-1 text-xs bg-white"
                                        value=""
                                        onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                                    >
                                        <option value="" disabled>상태 변경</option>
                                        <option value="Active">활동으로 변경</option>
                                        <option value="Inactive">휴면으로 변경</option>
                                        <option value="Banned">정지로 변경</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
