/**
 * 상품 데이터 임베딩 생성 스크립트
 * 
 * 사용법:
 * npx tsx scripts/generate-embeddings.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// .env.local 로드
config({ path: '.env.local' });

// 환경 변수 (실행 시 직접 설정하거나 dotenv 사용)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;

async function getEmbedding(text: string): Promise<number[] | null> {
    try {
        const response = await fetch(EMBEDDING_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/text-embedding-004',
                content: { parts: [{ text }] }
            })
        });

        if (!response.ok) {
            console.error('Embedding API error:', response.status);
            return null;
        }

        const data = await response.json();
        return data.embedding?.values || null;
    } catch (error) {
        console.error('Embedding error:', error);
        return null;
    }
}

async function generateEmbeddingsForAllProducts() {
    console.log('=== 상품 임베딩 생성 시작 ===');

    // 1. 임베딩이 없는 모든 상품 조회
    const { data: products, error } = await supabase
        .from('product_contents')
        .select('id, content, metadata')
        .is('embedding', null);

    if (error) {
        console.error('상품 조회 실패:', error.message);
        return;
    }

    if (!products || products.length === 0) {
        console.log('임베딩이 필요한 상품이 없습니다.');
        return;
    }

    console.log(`총 ${products.length}개 상품의 임베딩 생성 필요`);

    // 2. 각 상품에 대해 임베딩 생성
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        // Rate limiting: 1초 간격
        await new Promise(resolve => setTimeout(resolve, 1000));

        const productName = product.metadata?.productName || '상품';
        console.log(`[${successCount + failCount + 1}/${products.length}] ${productName} 처리 중...`);

        // 임베딩할 텍스트: content + metadata 주요 정보
        const embeddingText = `${product.content} 
카테고리: ${product.metadata?.category || ''} 
타입: ${product.metadata?.type || ''} 
소재: ${(product.metadata?.materials || []).join(', ')}
공법: ${(product.metadata?.techniques || []).join(', ')}`;

        const embedding = await getEmbedding(embeddingText);

        if (embedding) {
            // Supabase에 임베딩 저장
            const { error: updateError } = await supabase
                .from('product_contents')
                .update({ embedding })
                .eq('id', product.id);

            if (updateError) {
                console.error(`  ❌ 저장 실패: ${updateError.message}`);
                failCount++;
            } else {
                console.log(`  ✅ 성공`);
                successCount++;
            }
        } else {
            console.error(`  ❌ 임베딩 생성 실패`);
            failCount++;
        }
    }

    console.log('\n=== 완료 ===');
    console.log(`성공: ${successCount}개`);
    console.log(`실패: ${failCount}개`);
}

// 실행
generateEmbeddingsForAllProducts();
