// app/admin/design/page.tsx
'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function DesignContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams?.get('tab') || 'banner';

    const [banners, setBanners] = useState([
        { id: 1, title: 'Winter Collection', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', status: 'Active' },
        { id: 2, title: 'New Arrivals', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', status: 'Inactive' },
    ]);

    const [popups, setPopups] = useState([
        { id: 1, title: 'Event Popup', image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae', link: '/events', status: 'Active' },
        { id: 2, title: 'Sale Popup', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f', link: '/shop', status: 'Inactive' },
    ]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Design Settings State
    const [brandColor, setBrandColor] = useState('#E2C49C'); // Default: Brighter Camel Coat

    useEffect(() => {
        const savedColor = localStorage.getItem('brand-color');
        if (savedColor) {
            setBrandColor(savedColor);
        }
    }, []);

    const handleSaveDesign = () => {
        localStorage.setItem('brand-color', brandColor);
        window.dispatchEvent(new Event('storage')); // Trigger update for other components
        alert('디자인 설정이 저장되었습니다.');
        window.location.reload(); // Reload to apply CSS variable globally via script in RootLayout
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveBanner = () => {
        if (!selectedImage) {
            alert('이미지를 선택해주세요');
            return;
        }
        const newBanner = {
            id: Date.now(),
            title: `New Banner ${banners.length + 1}`,
            image: selectedImage,
            status: 'Active'
        };
        setBanners([...banners, newBanner]);
        setShowUploadModal(false);
        setSelectedImage(null);
        alert('배너가 등록되었습니다');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">전시 관리</h1>
            </div>

            {tab === 'banner' && (
                <div className="bg-white border rounded p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">메인 배너 관리</h2>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-black text-white px-4 py-2 rounded text-sm font-bold"
                        >
                            + 배너 등록
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map(banner => (
                            <div key={banner.id} className="border rounded overflow-hidden">
                                <div className="relative h-48 bg-gray-100">
                                    <Image src={banner.image} alt={banner.title} fill className="object-cover" unoptimized />
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded shadow">
                                        {banner.status}
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <span className="font-bold">{banner.title}</span>
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        수정
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'popup' && (
                <div className="bg-white border rounded p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold">팝업 관리</h2>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-black text-white px-4 py-2 rounded text-sm font-bold"
                        >
                            + 팝업 등록
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">미리보기</th>
                                <th className="p-3 text-left">제목</th>
                                <th className="p-3 text-left">링크</th>
                                <th className="p-3 text-center">상태</th>
                                <th className="p-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {popups.map(popup => (
                                <tr key={popup.id}>
                                    <td className="p-3">
                                        <div className="w-16 h-16 relative bg-gray-100">
                                            <Image src={popup.image} alt={popup.title} fill className="object-cover" unoptimized />
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{popup.title}</td>
                                    <td className="p-3 text-gray-500">{popup.link}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs ${popup.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {popup.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button className="text-blue-600 hover:underline text-sm">수정</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'settings' && (
                <div className="bg-white border rounded p-8 max-w-2xl">
                    <h2 className="text-xl font-bold mb-6">디자인 설정</h2>

                    <div className="space-y-8">
                        {/* Accent Color Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">포인트 컬러 영역 (Mouse Over / Highlight)</label>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col gap-2">
                                    <div
                                        className="w-20 h-20 rounded-lg border-2 border-gray-100 shadow-sm"
                                        style={{ backgroundColor: brandColor }}
                                    />
                                    <span className="text-[10px] text-center font-mono text-gray-400 uppercase">Preview</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="w-12 h-12 p-1 bg-white border rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="flex-1 border rounded px-3 py-2.5 font-mono text-sm uppercase"
                                            placeholder="#FFFFFF"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        브랜드의 핵심 포인트 컬러를 지정합니다.
                                        <br />현재 설정값: <span className="font-mono font-bold text-black">{brandColor}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <button
                                onClick={handleSaveDesign}
                                className="w-full bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition-colors"
                            >
                                설정 저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4">이미지 업로드</h3>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full border rounded p-2"
                            />
                            {selectedImage && (
                                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                                    <Image src={selectedImage} alt="Preview" fill className="object-cover" unoptimized />
                                </div>
                            )}
                            <p className="text-xs text-gray-500">
                                * 권장 사이즈: 1920x600px (배너), 600x800px (팝업)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 border rounded py-2"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveBanner}
                                    className="flex-1 bg-black text-white rounded py-2"
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminDesignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DesignContent />
        </Suspense>
    );
}
