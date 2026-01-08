// app/(shop)/mypage/profile/edit/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Daum Postcode API types
declare global {
    interface Window {
        daum: {
            Postcode: new (options: {
                oncomplete: (data: {
                    zonecode: string;
                    roadAddress: string;
                    jibunAddress: string;
                    userSelectedType: string;
                    buildingName: string;
                }) => void;
            }) => {
                open: () => void;
            };
        };
    }
}

export default function ProfileEditPage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        zonecode: '',
        address: '',
        addressDetail: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load Daum Postcode script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // Open Daum Postcode popup
    const openPostcodeSearch = () => {
        if (!window.daum) {
            alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                const address = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                setFormData(prev => ({
                    ...prev,
                    zonecode: data.zonecode,
                    address: address
                }));
            }
        }).open();
    };

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                zonecode: user.zonecode || '',
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

        // Update user including zonecode
        updateUser({
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            zonecode: formData.zonecode,
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
                            className="w-full border p-3 bg-gray-100 text-gray-500 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">연락처</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                            placeholder="010-0000-0000"
                        />
                    </div>
                </section>

                {/* Address with Daum Postcode */}
                <section className="space-y-4">
                    <h2 className="font-bold text-lg">주소 정보</h2>
                    <div>
                        <label className="block text-sm font-bold mb-1">주소</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="w-32 border p-3 bg-gray-50 rounded"
                                placeholder="우편번호"
                                value={formData.zonecode}
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={openPostcodeSearch}
                                className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 rounded"
                            >
                                주소 검색
                            </button>
                        </div>
                        <input
                            type="text"
                            className="w-full border p-3 mb-2 bg-gray-50 rounded"
                            placeholder="주소 검색 버튼을 클릭하세요"
                            value={formData.address}
                            readOnly
                        />
                        <input
                            type="text"
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                            placeholder="상세 주소 (동/호수 등)"
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
                            className="w-full border p-3 rounded"
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
                            className="w-full border p-3 rounded"
                            placeholder="비밀번호 확인"
                        />
                    </div>
                </section>

                {/* Account Withdrawal */}
                <section className="space-y-4 pt-4 border-t">
                    <h2 className="font-bold text-lg text-red-600">회원 탈퇴</h2>
                    <p className="text-sm text-gray-500">
                        회원 탈퇴 시 모든 개인정보와 주문 내역이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            if (!confirm('정말로 회원 탈퇴를 하시겠습니까? 모든 데이터가 삭제됩니다.')) return;
                            if (!confirm('탈퇴 후에는 복구가 불가능합니다. 계속하시겠습니까?')) return;
                            // Call deleteUser from AuthContext
                            alert('회원 탈퇴가 완료되었습니다.');
                            router.push('/');
                        }}
                        className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded hover:bg-red-50 transition-colors"
                    >
                        회원 탈퇴하기
                    </button>
                </section>

                <div className="flex gap-4 pt-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-4 border font-bold hover:bg-gray-50 rounded"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-4 bg-black text-white font-bold hover:bg-gray-900 rounded"
                    >
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
}
