// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // 외부 기기(모바일, 태블릿 등) 테스트를 위한 설정
    allowedDevOrigins: [
        'http://192.168.0.33:3000',
        'http://192.168.*.*:3000', // 로컬 네트워크 대역
    ],
};

export default nextConfig;
