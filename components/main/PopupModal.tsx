// components/main/PopupModal.tsx
'use client';

import { useEffect } from 'react';

interface Popup {
    id: number;
    title: string;
    image: string;
    link: string;
    status: 'Active' | 'Inactive';
}

export default function PopupModal() {
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
                // Open popup in new window
                const width = 500;
                const height = 600;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                const popupWindow = window.open(
                    '',
                    'popup',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`
                );

                if (popupWindow) {
                    popupWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>${activePopup.title}</title>
                            <style>
                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                body { font-family: system-ui, sans-serif; background: #fff; }
                                .popup-container { position: relative; }
                                .popup-image { width: 100%; height: auto; display: block; cursor: pointer; }
                                .popup-footer { padding: 16px; display: flex; justify-content: space-between; align-items: center; background: #f5f5f5; border-top: 1px solid #eee; }
                                .popup-footer button { padding: 8px 16px; cursor: pointer; border: none; background: none; font-size: 14px; }
                                .popup-footer button:hover { text-decoration: underline; }
                                .dismiss-btn { color: #666; }
                                .close-btn { color: #000; font-weight: bold; }
                            </style>
                        </head>
                        <body>
                            <div class="popup-container">
                                <a href="${activePopup.link || '#'}" target="_blank">
                                    <img src="${activePopup.image}" alt="${activePopup.title}" class="popup-image" />
                                </a>
                                <div class="popup-footer">
                                    <button class="dismiss-btn" onclick="dismissToday()">오늘 하루 보지 않기</button>
                                    <button class="close-btn" onclick="window.close()">닫기</button>
                                </div>
                            </div>
                            <script>
                                function dismissToday() {
                                    window.opener.localStorage.setItem('popup-dismissed-date', new Date().toDateString());
                                    window.close();
                                }
                            </script>
                        </body>
                        </html>
                    `);
                    popupWindow.document.close();
                }
            }
        }
    }, []);

    // This component doesn't render anything - it just triggers the popup window
    return null;
}
