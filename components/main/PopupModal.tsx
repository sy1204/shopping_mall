// components/main/PopupModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Popup {
    id: number;
    title: string;
    image: string;
    link: string;
    status: 'Active' | 'Inactive';
}

export default function PopupModal() {
    const [popup, setPopup] = useState<Popup | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user dismissed popup today
        const dismissedDate = localStorage.getItem('popup-dismissed-date');
        const today = new Date().toDateString();

        if (dismissedDate === today) {
            return; // Don't show popup if dismissed today
        }

        // Load active popup from localStorage (set by admin)
        const savedPopups = localStorage.getItem('admin-popups');
        if (savedPopups) {
            const popups: Popup[] = JSON.parse(savedPopups);
            const activePopup = popups.find(p => p.status === 'Active');
            if (activePopup) {
                setPopup(activePopup);
                setIsVisible(true);
            }
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleDismissToday = () => {
        localStorage.setItem('popup-dismissed-date', new Date().toDateString());
        setIsVisible(false);
    };

    if (!isVisible || !popup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-md w-full">
                {popup.link ? (
                    <Link href={popup.link} onClick={handleClose}>
                        <div className="relative w-full h-[400px] cursor-pointer">
                            <Image
                                src={popup.image}
                                alt={popup.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </Link>
                ) : (
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={popup.image}
                            alt={popup.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}
                <div className="p-4 flex justify-between items-center bg-gray-50">
                    <button
                        onClick={handleDismissToday}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        오늘 하루 보지 않기
                    </button>
                    <button
                        onClick={handleClose}
                        className="text-sm font-bold text-gray-700 hover:text-black"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
