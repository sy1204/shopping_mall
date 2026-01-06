// app/(shop)/mypage/profile/edit/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileEditPage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        addressDetail: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                addressDetail: user.addressDetail || ''
            }));
        } else {
            router.push('/auth/login');
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Password validation
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                alert('새 비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        // Mock Update
        // In real app, we would send API request including password if changed.
        // Here we just update context.
        updateUser({
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            addressDetail: formData.addressDetail
        });

        alert('회원정보가 수정되었습니다.');
        router.push('/mypage');
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 pb-4 border-b">회원정보 수정</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="font-bold text-lg">기본 정보</h2>
                    <div>
                        <label className="block text-sm font-bold mb-1">이메일 (아이디)</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full border p-3 bg-gray-100 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">연락처</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border p-3"
                            placeholder="010-0000-0000"
                        />
                    </div>
                </section>

                {/* Address */}
                <section className="space-y-4">
                    <h2 className="font-bold text-lg">주소 정보</h2>
                    <div>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border p-3 mb-2"
                            placeholder="기본 주소"
                        />
                        <input
                            type="text"
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            className="w-full border p-3"
                            placeholder="상세 주소"
                        />
                    </div>
                </section>

                {/* Password Change */}
                <section className="space-y-4 pt-4 border-t">
                    <h2 className="font-bold text-lg">비밀번호 변경</h2>
                    <p className="text-xs text-gray-500 mb-2">변경할 경우에만 입력해 주세요.</p>
                    <div>
                        <label className="block text-sm font-bold mb-1">새 비밀번호</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full border p-3"
                            placeholder="변경할 비밀번호"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border p-3"
                            placeholder="비밀번호 확인"
                        />
                    </div>
                </section>

                <div className="flex gap-4 pt-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-4 border font-bold hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="w-full py-4 bg-black text-white font-bold hover:bg-gray-900"
                    >
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
}
