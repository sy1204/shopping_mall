// app/admin/users/page.tsx
'use client';

import { getUsers, updateUserStatus } from "@/utils/userStorage";
import { AdminUser } from "@/types";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const handleStatusChange = (userId: string, newStatus: AdminUser['status']) => {
        if (confirm(`Change user status to ${newStatus}?`)) {
            const updated = updateUserStatus(userId, newStatus);
            setUsers(updated);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-mono tracking-tight uppercase">User Management</h1>
            </div>

            <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-[var(--tech-silver)] border-opacity-20 font-mono">
                        <tr>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">User / Email</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Join Date</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Points</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Activity</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-center">Status</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-[var(--neural-black)]">
                                        <Link href={`/admin/users/${user.id}`} className="hover:text-[var(--brand-accent)] transition-colors">
                                            {user.name}
                                        </Link>
                                    </div>
                                    <div className="text-[10px] font-mono text-[var(--tech-silver)] tracking-wider uppercase">{user.email}</div>
                                </td>
                                <td className="p-4 text-xs font-mono text-gray-500">
                                    {user.joinDate}
                                </td>
                                <td className="p-4 text-right font-mono font-bold">
                                    {(user.points || 0).toLocaleString()} P
                                </td>
                                <td className="p-4 text-right">
                                    <div className="font-mono font-bold text-xs uppercase text-[var(--neural-black)]">₩ {(user.totalSpent || 0).toLocaleString()}</div>
                                    <div className="text-[10px] font-mono text-[var(--tech-silver)] uppercase tracking-tighter">{(user.totalOrders || 0)} ORDERS</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tighter
                                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'}`}>
                                        {user.status?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <select
                                        className="border border-[var(--tech-silver)] border-opacity-30 rounded px-2 py-1 bg-white text-[10px] font-mono focus:border-[var(--brand-accent)] outline-none"
                                        value=""
                                        onChange={(e) => handleStatusChange(user.id, e.target.value as AdminUser['status'])}
                                    >
                                        <option value="" disabled>CHANGE STATUS</option>
                                        <option value="Active">ACTIVE</option>
                                        <option value="Inactive">INACTIVE</option>
                                        <option value="Banned">BANNED</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-20 text-center text-[var(--tech-silver)] font-mono text-xs uppercase tracking-[0.2em]">
                        NO USERS REGISTERED
                    </div>
                )}
            </div>
        </div>
    );
}
