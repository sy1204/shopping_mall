// app/admin/login/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
    const { adminLogin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await adminLogin(email);
        if (success) {
            router.push('/admin');
        } else {
            setError('관리자 권한이 있는 이메일이 아닙니다. (Hint: use "admin@..." or "manager@...")');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
                    <p className="text-sm text-gray-500">Please enter your credentials to access the dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black mb-4"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="*************"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition-colors"
                    >
                        Sign In
                    </button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-xs text-gray-400 hover:text-black underline">
                            Return to Store
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
