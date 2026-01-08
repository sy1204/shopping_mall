/**
 * /api/chat - RAG 기반 패션 큐레이션 API
 * 
 * 사용자 질문과 6각형 취향 파라미터를 받아
 * 벡터 검색 후 맞춤형 답변을 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side only keys (never exposed to client)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// API endpoints
const EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Simple in-memory rate limiter (per-server instance)
const rateLimiter = {
    lastRequest: 0,
    minInterval: 1000, // 1 second between requests
    async wait() {
        const now = Date.now();
        const elapsed = now - this.lastRequest;
        if (elapsed < this.minInterval) {
            await new Promise(resolve => setTimeout(resolve, this.minInterval - elapsed));
        }
        this.lastRequest = Date.now();
    }
};

// Types
interface HexagonParams {
    adventurous: number;    // 도전 지수: 트렌디/실험적 요소
    reliability: number;    // 안정 지수: 평점/검증된 소재
    materialValue: number;  // 소재 가치: 공법/소재 깊이
    trendiness: number;     // 트렌디함
    practicality: number;   // 실용성
    uniqueness: number;     // 독특함
}

interface ChatRequest {
    question: string;
    hexagon?: HexagonParams;
}

interface ProductContent {
    id: string;
    content: string;
    metadata: {
        category?: string;
        type?: string;
        productName?: string;
        brand?: string;
        rating?: number;
        materials?: string[];
        techniques?: string[];
    };
    similarity: number;
}

/**
 * 질문을 벡터로 변환
 */
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

/**
 * Supabase에서 유사한 콘텐츠 검색
 */
async function searchSimilarContent(
    queryEmbedding: number[],
    matchCount: number = 5,
    threshold: number = 0.5
): Promise<ProductContent[]> {
    // First try RPC
    const { data, error } = await supabase.rpc('match_contents', {
        query_embedding: queryEmbedding,
        match_count: matchCount,
        match_threshold: threshold
    });

    if (error) {
        console.error('[Chat API] Supabase RPC error:', error.message, error.details);

        // Fallback: Direct query without vector search (just get some products)
        console.log('[Chat API] Falling back to direct query...');
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('product_contents')
            .select('id, content, metadata')
            .limit(matchCount);

        if (fallbackError) {
            console.error('[Chat API] Fallback query error:', fallbackError.message);
            return [];
        }

        // Add dummy similarity
        return (fallbackData || []).map(item => ({
            ...item,
            similarity: 0.5
        }));
    }

    return data || [];
}

/**
 * 6각형 파라미터 기반 시스템 프롬프트 생성
 */
function buildSystemPrompt(hexagon: HexagonParams): string {
    const guidelines: string[] = [];

    if (hexagon.adventurous > 0.6) {
        guidelines.push('- 트렌디하고 실험적인 스타일링을 적극 제안하세요.');
        guidelines.push('- 평소와 다른 새로운 조합을 추천해도 좋습니다.');
    }

    if (hexagon.reliability > 0.6) {
        guidelines.push('- 리뷰 평점이 높고 검증된 제품 정보를 강조하세요.');
        guidelines.push('- 실패 없는 클래식한 소재(코마사 면, 메리노 울 등)의 장점을 설명하세요.');
    }

    if (hexagon.materialValue > 0.6) {
        guidelines.push('- 소재의 원산지와 품질(이태리산 캐시미어, 일본 셀비지 데님 등)을 강조하세요.');
        guidelines.push('- 제작 공법(텐타 가공, 해리 테이핑, 바이오 워싱 등)의 의미를 깊이 있게 해석하세요.');
    }

    if (hexagon.trendiness > 0.6) {
        guidelines.push('- 현재 시즌 트렌드와의 연관성을 언급하세요.');
    }

    if (hexagon.practicality > 0.6) {
        guidelines.push('- 관리 방법, 세탁 용이성, 다양한 활용도를 강조하세요.');
    }

    if (hexagon.uniqueness > 0.6) {
        guidelines.push('- 다른 제품과 차별화되는 독특한 디자인 요소를 부각하세요.');
    }

    return `당신은 프리미엄 패션 편집샵의 전문 큐레이터입니다.

[역할]
고객의 질문에 대해 검색된 상품 정보를 바탕으로 맞춤형 가치 해석을 제공합니다.
단순한 정보 나열이 아닌, 패션 전문가의 인사이트를 담아 답변하세요.

[취향 반영 가이드라인]
${guidelines.length > 0 ? guidelines.join('\n') : '- 균형 잡힌 관점에서 객관적으로 설명하세요.'}

[답변 스타일]
- 친근하지만 전문적인 톤
- 구체적인 소재/공법 용어 활용
- 실질적인 스타일링 조언 포함
- 200-400자 내외로 핵심 정보 전달`;
}

/**
 * Gemini로 최종 답변 생성
 */
async function generateAnswer(
    question: string,
    context: ProductContent[],
    systemPrompt: string
): Promise<string> {
    // 검색된 상품 정보 포맷팅
    const contextText = context.map((item, idx) => {
        const meta = item.metadata;
        return `[상품 ${idx + 1}] ${meta.productName || '상품'}
카테고리: ${meta.category || '-'} / ${meta.type || '-'}
브랜드: ${meta.brand || '-'}
평점: ${meta.rating || '-'}점
${meta.materials ? `소재: ${meta.materials.join(', ')}` : ''}
${meta.techniques ? `공법: ${meta.techniques.join(', ')}` : ''}

${item.content}
---`;
    }).join('\n\n');

    const userPrompt = `[검색된 상품 정보]
${contextText}

[고객 질문]
${question}

위 정보를 바탕으로 고객에게 맞춤형 답변을 제공해주세요.`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: userPrompt }] }
                ],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', response.status, errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '답변을 생성하지 못했습니다.';
    } catch (error) {
        console.error('Answer generation error:', error);
        throw error;
    }
}

/**
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();

        // Validation
        if (!body.question || typeof body.question !== 'string') {
            return NextResponse.json(
                { error: 'question is required' },
                { status: 400 }
            );
        }

        // Default hexagon parameters (balanced)
        const hexagon: HexagonParams = {
            adventurous: body.hexagon?.adventurous ?? 0.5,
            reliability: body.hexagon?.reliability ?? 0.5,
            materialValue: body.hexagon?.materialValue ?? 0.5,
            trendiness: body.hexagon?.trendiness ?? 0.5,
            practicality: body.hexagon?.practicality ?? 0.5,
            uniqueness: body.hexagon?.uniqueness ?? 0.5
        };

        // Rate limiting
        await rateLimiter.wait();

        // 1. 질문 벡터화
        console.log('[Chat API] Step 1: Getting embedding for:', body.question);
        const embedding = await getEmbedding(body.question);
        if (!embedding) {
            return NextResponse.json(
                { error: 'Failed to generate embedding. Check GEMINI_API_KEY.' },
                { status: 500 }
            );
        }
        console.log('[Chat API] Embedding generated, length:', embedding.length);

        // 2. 유사 콘텐츠 검색 (상위 5개)
        console.log('[Chat API] Step 2: Searching similar contents...');
        const similarContents = await searchSimilarContent(embedding, 5, 0.3);
        console.log('[Chat API] Found similar contents:', similarContents.length);

        // 3. 시스템 프롬프트 생성
        const systemPrompt = buildSystemPrompt(hexagon);

        // 4. 최종 답변 생성 (with fallback)
        let answer: string;
        try {
            console.log('[Chat API] Step 4: Generating answer with Gemini...');
            answer = await generateAnswer(body.question, similarContents, systemPrompt);
        } catch (geminiError) {
            console.error('[Chat API] Gemini failed, using fallback answer');
            // Fallback: 검색 결과 기반 간단 답변
            if (similarContents.length > 0) {
                const topProducts = similarContents.slice(0, 3).map(c =>
                    c.metadata.productName || c.metadata.type || '상품'
                ).join(', ');
                answer = `검색된 추천 상품: ${topProducts}. 각 상품은 프리미엄 소재로 제작되어 높은 품질을 자랑합니다. 자세한 정보는 상품 상세 페이지에서 확인해주세요.`;
            } else {
                answer = '죄송합니다. 현재 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해주세요.';
            }
        }

        return NextResponse.json({
            answer,
            sources: similarContents.map(c => ({
                id: c.id,
                productName: c.metadata.productName,
                category: c.metadata.category,
                similarity: c.similarity
            })),
            hexagon
        });

    } catch (error) {
        console.error('[Chat API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Internal server error', details: errorMessage },
            { status: 500 }
        );
    }
}
