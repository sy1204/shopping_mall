// app/admin/users/page.tsx
'use client';

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
    id: string;
    email: string;
    name: string;
    phone_number: string | null;
    role: string;
    points: number;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleAdminRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';

        // Optimistic update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
            fetchUsers(); // Revert
        }
    };

    const generateDummyUsers = async () => {
        if (!confirm('Generate 10 dummy users? (Note: These users cannot log in, they are for UI testing only)')) return;

        const dummies = Array.from({ length: 10 }).map((_, i) => ({
            id: crypto.randomUUID(), // Mock ID, since we can't create real Auth users easily from client without logout
            email: `dummy${Date.now()}_${i}@test.com`,
            name: `Dummy User ${i + 1}`,
            role: 'customer',
            points: Math.floor(Math.random() * 10000),
            created_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('profiles')
            .insert(dummies);

        if (error) {
            console.error('Error generating dummies:', error);
            alert('Failed to generate dummy users: ' + error.message);
        } else {
            alert('10 Dummy users generated!');
            fetchUsers();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-mono tracking-tight uppercase">User Management</h1>
                <button
                    onClick={generateDummyUsers}
                    className="bg-[var(--neural-black)] text-white px-4 py-2 rounded text-xs font-mono font-bold hover:bg-gray-800 transition-colors"
                >
                    + GENERATE DUMMY USERS
                </button>
            </div>

            <div className="bg-white border border-[var(--tech-silver)] border-opacity-20 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-[var(--tech-silver)] border-opacity-20 font-mono">
                        <tr>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">User / Email</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px]">Joined</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-right">Points</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-center">Role</th>
                            <th className="p-4 font-bold text-[var(--tech-silver)] uppercase tracking-widest text-[10px] text-center">Admin?</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-xs font-mono">LOADING...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-[var(--neural-black)]">
                                        {user.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-[var(--tech-silver)] tracking-wider uppercase">{user.email}</div>
                                </td>
                                <td className="p-4 text-xs font-mono text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right font-mono font-bold">
                                    {(user.points || 0).toLocaleString()} P
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-tighter
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={user.role === 'admin'}
                                        onChange={() => toggleAdminRole(user.id, user.role)}
                                        className="w-4 h-4 cursor-pointer accent-black"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && users.length === 0 && (
                    <div className="p-20 text-center text-[var(--tech-silver)] font-mono text-xs uppercase tracking-[0.2em]">
                        NO USERS FOUND
                    </div>
                )}
            </div>
        </div>
    );
}
