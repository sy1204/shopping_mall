// app/auth/login/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Just mock login with email
        login(email);
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white p-8 border shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-8">LOGIN</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border p-3 focus:border-black outline-none transition-colors"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border p-3 focus:border-black outline-none transition-colors"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-4 font-bold hover:bg-gray-900 transition-colors"
                    >
                        LOGIN
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <span className="underline cursor-pointer">Sign up</span>
                </div>
            </div>
        </div>
    );
}
