// app/admin/users/page.tsx
'use client';

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
    id: string;
    email: string;
    name: string;
    phone_number: string | null;
    role: string;
    points: number;
    created_at: string;
    zonecode?: string;
    address?: string;
    address_detail?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone_number: '',
        points: 0,
        role: 'customer'
    });

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

    const openUserModal = (user: Profile, edit = false) => {
        setSelectedUser(user);
        setIsEditing(edit);
        setEditForm({
            name: user.name || '',
            phone_number: user.phone_number || '',
            points: user.points || 0,
            role: user.role || 'customer'
        });
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                name: editForm.name,
                phone_number: editForm.phone_number,
                points: editForm.points,
                role: editForm.role
            })
            .eq('id', selectedUser.id);

        if (error) {
            console.error('Error updating user:', error);
            alert('회원 정보 수정에 실패했습니다: ' + error.message);
        } else {
            alert('회원 정보가 수정되었습니다.');
            setIsEditing(false);
            setSelectedUser(null);
            fetchUsers();
        }
    };

    const toggleAdminRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
            fetchUsers();
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`"${userName}" 회원을 삭제하시겠습니까?`)) return;
        if (!confirm('이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?')) return;

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            alert('회원 삭제에 실패했습니다: ' + error.message);
        } else {
            alert('회원이 삭제되었습니다.');
            setSelectedUser(null);
            fetchUsers();
        }
    };

    const generateDummyUsers = async () => {
        if (!confirm('테스트용 더미 회원 10명을 생성하시겠습니까?')) return;

        const dummies = Array.from({ length: 10 }).map((_, i) => ({
            id: crypto.randomUUID(),
            email: `dummy${Date.now()}_${i}@test.com`,
            name: `테스트 회원 ${i + 1}`,
            role: 'customer',
            points: Math.floor(Math.random() * 10000),
            created_at: new Date().toISOString()
        }));

        const { error } = await supabase.from('profiles').insert(dummies);

        if (error) {
            console.error('Error generating dummies:', error);
            alert('더미 회원 생성 실패: ' + error.message);
        } else {
            alert('더미 회원 10명이 생성되었습니다!');
            fetchUsers();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">회원 관리</h1>
                <button
                    onClick={generateDummyUsers}
                    className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800"
                >
                    + 더미 회원 생성
                </button>
            </div>

            <div className="bg-white border shadow-sm overflow-x-auto rounded">
                <table className="w-full text-left text-sm min-w-[900px]">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase">회원 정보</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase">가입일</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase text-right">포인트</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase text-center">권한</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase text-center">관리자</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">로딩 중...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-bold">{user.name}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right font-bold">
                                    {(user.points || 0).toLocaleString()} P
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.role === 'admin' ? '관리자' : '일반'}
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
                                <td className="p-4 text-center space-x-2">
                                    <button
                                        onClick={() => openUserModal(user, false)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        상세
                                    </button>
                                    <button
                                        onClick={() => openUserModal(user, true)}
                                        className="text-green-600 hover:underline text-sm"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && users.length === 0 && (
                    <div className="p-20 text-center text-gray-400">
                        등록된 회원이 없습니다
                    </div>
                )}
            </div>

            {/* User Detail/Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedUser(null); setIsEditing(false); }}>
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{isEditing ? '회원 정보 수정' : '회원 상세 정보'}</h2>
                            <button onClick={() => { setSelectedUser(null); setIsEditing(false); }} className="text-gray-400 hover:text-black text-2xl">&times;</button>
                        </div>

                        {isEditing ? (
                            /* Edit Mode */
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">이메일 (수정불가)</label>
                                    <input type="text" value={selectedUser.email} disabled className="w-full border p-2 rounded bg-gray-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">이름</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">연락처</label>
                                    <input
                                        type="text"
                                        value={editForm.phone_number}
                                        onChange={e => setEditForm({ ...editForm, phone_number: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">포인트</label>
                                    <input
                                        type="number"
                                        value={editForm.points}
                                        onChange={e => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">권한</label>
                                    <select
                                        value={editForm.role}
                                        onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    >
                                        <option value="customer">일반 회원</option>
                                        <option value="admin">관리자</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 border rounded font-bold hover:bg-gray-50">
                                        취소
                                    </button>
                                    <button onClick={handleSaveUser} className="flex-1 py-3 bg-black text-white rounded font-bold hover:bg-gray-800">
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">이름</label>
                                        <div className="font-bold">{selectedUser.name}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">이메일</label>
                                        <div className="font-mono text-sm">{selectedUser.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">연락처</label>
                                        <div>{selectedUser.phone_number || '-'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">가입일</label>
                                        <div>{new Date(selectedUser.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">포인트</label>
                                        <div className="font-bold text-lg">{(selectedUser.points || 0).toLocaleString()} P</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">권한</label>
                                        <span className={`px-3 py-1 rounded text-sm font-bold
                                            ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {selectedUser.role === 'admin' ? '관리자' : '일반 회원'}
                                        </span>
                                    </div>
                                </div>
                                {selectedUser.address && (
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">주소</label>
                                        <div>[{selectedUser.zonecode}] {selectedUser.address} {selectedUser.address_detail}</div>
                                    </div>
                                )}
                                <div className="flex gap-2 mt-8">
                                    <button onClick={() => setIsEditing(true)} className="flex-1 py-3 bg-black text-white rounded font-bold hover:bg-gray-800">
                                        수정하기
                                    </button>
                                    <button onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)} className="px-6 py-3 bg-red-600 text-white rounded font-bold hover:bg-red-700">
                                        삭제
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
