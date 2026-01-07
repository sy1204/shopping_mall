// app/(shop)/mypage/check-password/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckPasswordPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('로그인이 필요합니다.');
            return;
        }

        // Get registered users from localStorage to check password
        const usersStr = localStorage.getItem('registered_users');
        const users: Record<string, { password: string; user: { email: string } }> = usersStr ? JSON.parse(usersStr) : {};

        // Check if user exists and password matches
        if (users[user.email] && users[user.email].password === password) {
            router.push('/mypage/profile/edit');
        } else {
            setError('비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 max-w-md">
            <h1 className="text-2xl font-bold mb-8 text-center">비밀번호 확인</h1>
            <p className="text-center text-gray-500 mb-8">
                회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한 번 확인합니다.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="password"
                        required
                        className="w-full border p-4 text-center text-lg tracking-widest"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-4 border font-bold hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-4 bg-black text-white font-bold hover:bg-gray-900"
                    >
                        확인
                    </button>
                </div>
            </form>
        </div>
    );
}
