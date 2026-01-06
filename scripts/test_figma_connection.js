// scripts/test_figma_connection.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// .env.local 파일 경로
const envPath = path.join(__dirname, '..', '.env.local');

try {
    // 1. .env.local 파일 읽기
    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: .env.local file not found.');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/FIGMA_ACCESS_TOKEN=(.+)/);

    if (!match || !match[1] || match[1].trim() === '') {
        console.error('❌ Error: FIGMA_ACCESS_TOKEN not found or empty in .env.local');
        process.exit(1);
    }

    const token = match[1].trim();

    // 2. Figma API 호출 (Get Current User only)
    const options = {
        hostname: 'api.figma.com',
        path: '/v1/me',
        method: 'GET',
        headers: {
            'X-Figma-Token': token
        },
        timeout: 5000 // 5초 타임아웃 설정
    };

    console.log('🔄 Connecting to Figma API...');

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const user = JSON.parse(data);
                console.log('✅ Connection Successful!');
                console.log(`👤 Connected as: ${user.handle} (Email: ${user.email})`);
            } else {
                console.error(`❌ Connection Failed (Status: ${res.statusCode})`);
                console.error('Response:', data);
            }
        });
    });

    req.on('timeout', () => {
        req.destroy();
        console.error('❌ Request Timeout (5s)');
    });

    req.on('error', (e) => {
        console.error(`❌ Request Error: ${e.message}`);
    });

    req.end();

} catch (error) {
    console.error('❌ Unexpected Error:', error);
}
