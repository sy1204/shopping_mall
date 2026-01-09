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
    boldness: number;        // 도전성: 무난한 기본템 → 파격적이고 트렌디한 디자인
    materialValue: number;   // 소재 가치: 일반적인 혼용률 → 희소 소재 및 특수 공법
    utility: number;         // 실용성: 특정 상황용 → 범용성 높은 데일리템
    reliability: number;     // 신뢰도: 신규/실험적 상품 → 검증된 베스트셀러
    comfort: number;         // 편안함: 포멀하고 딱딱한 핏 → 활동성 높고 여유로운 핏
    exclusivity: number;     // 희소성: 대중적인 기성품 → 장인정신 및 리미티드
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
    // RPC 호출 - 파라미터 순서: query_embedding, match_threshold, match_count
    const { data, error } = await supabase.rpc('match_contents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,   // 유사도 임계값
        match_count: matchCount        // 상위 N개 추출
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

    // 도전성 (Boldness)
    if (hexagon.boldness > 0.6) {
        guidelines.push('- 주변의 시선을 사로잡는 독특한 스타일을 제안하세요.');
        guidelines.push('- 최신 트렌드 키워드와 유니크한 실루엣을 강조하세요.');
    } else if (hexagon.boldness < 0.4) {
        guidelines.push('- 유행을 타지 않고 오래 입을 수 있는 클래식한 디자인을 추천하세요.');
    }

    // 소재 가치 (Material Value)
    if (hexagon.materialValue > 0.6) {
        guidelines.push('- 단순한 디자인이라도 원단의 급이 다른 본질적인 고급스러움을 분석하세요.');
        guidelines.push('- 원단 원산지, 특수 가공(텐타, 컴팩 등), 촉감을 강조하세요.');
    } else if (hexagon.materialValue < 0.4) {
        guidelines.push('- 소재보다는 전체적인 룩과 분위기에 집중해서 설명하세요.');
    }

    // 실용성 (Utility)
    if (hexagon.utility > 0.6) {
        guidelines.push('- 청바지, 슬랙스 어디에나 잘 어울리고 관리가 편한지 알려주세요.');
        guidelines.push('- 레이어드 활용도, 세탁 용이성 등 실용성을 강조하세요.');
    } else if (hexagon.utility < 0.4) {
        guidelines.push('- 특별한 날 주인공이 될 수 있는 화려한 스타일에 집중하세요.');
    }

    // 신뢰도 (Reliability)
    if (hexagon.reliability > 0.6) {
        guidelines.push('- 실사용 리뷰 평점과 재구매율 데이터를 강조하세요.');
        guidelines.push('- 검증된 베스트셀러 상품을 우선으로 안내하세요.');
    } else if (hexagon.reliability < 0.4) {
        guidelines.push('- 신규/실험적 상품의 잠재력과 특별함을 설명하세요.');
    }

    // 편안함 (Comfort)
    if (hexagon.comfort > 0.6) {
        guidelines.push('- 신축성(스판), 무게감, 여유로운 실루엣을 강조하세요.');
        guidelines.push('- 활동성 높고 편안한 착용감을 설명하세요.');
    } else if (hexagon.comfort < 0.4) {
        guidelines.push('- 포멀하고 단정한 핏의 매력을 설명하세요.');
    }

    // 희소성 (Exclusivity)
    if (hexagon.exclusivity > 0.6) {
        guidelines.push('- 봉제 퀄리티(스티치 등), 소량 생산 여부를 강조하세요.');
        guidelines.push('- 장인정신과 리미티드 디테일의 가치를 설명하세요.');
    } else if (hexagon.exclusivity < 0.4) {
        guidelines.push('- 대중적이면서도 품질 좋은 가성비 아이템을 추천하세요.');
    }

    return `당신은 프리미엄 패션 편집샵 [N-D]의 전문 AI 큐레이터입니다.

## 고객 취향 프로필 (0-1 스케일)
- 도전성: ${hexagon.boldness.toFixed(2)} (높으면 트렌디, 낮으면 클래식)
- 소재 가치: ${hexagon.materialValue.toFixed(2)} (높으면 프리미엄 소재 중시)
- 실용성: ${hexagon.utility.toFixed(2)} (높으면 범용성, 낮으면 특별한 날)
- 신뢰도: ${hexagon.reliability.toFixed(2)} (높으면 베스트셀러, 낮으면 신상품)
- 편안함: ${hexagon.comfort.toFixed(2)} (높으면 여유핏, 낮으면 포멀핏)
- 희소성: ${hexagon.exclusivity.toFixed(2)} (높으면 리미티드, 낮으면 가성비)

## 역할
고객의 질문에 대해 검색된 상품 정보와 위 취향 프로필을 바탕으로 **개인화된 맞춤 추천**을 제공합니다.
반드시 취향 수치를 언급하며 "도전성이 높으시니..." 또는 "편안함을 중시하시니..." 같은 형태로 답변하세요.

## 취향 반영 가이드라인
${guidelines.length > 0 ? guidelines.join('\n') : '- 균형 잡힌 관점에서 객관적으로 설명하세요.'}

## 답변 형식
1. 먼저 고객의 취향 특징을 1-2문장으로 요약
2. 검색된 상품 중 1-2개를 구체적으로 추천
3. 왜 이 상품이 고객 취향에 맞는지 설명
4. 스타일링 팁 제안

## 답변 스타일
- 친근하지만 전문적인 톤 ("~해요" 체)
- 구체적인 소재/공법 용어 활용
- 200-400자 내외로 핵심 정보 전달
- 절대 같은 답변을 반복하지 마세요`;
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

    // 세션 고유 ID 생성 (다양한 답변을 위해)
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    const userPrompt = `[세션 ID: ${sessionId}]

[검색된 상품 정보]
${contextText}

[고객 질문]
${question}

위 정보와 고객의 취향 프로필을 바탕으로 개인화된 맞춤 추천을 제공해주세요.
반드시 취향 수치(도전성, 소재 가치 등)를 언급하며 "편안함을 중시하시니..." 같은 형태로 답변하세요.`;

    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: combinedPrompt }] }
                ],
                // systemInstruction 제거 (호환성 확보)
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 1024,
                    topP: 0.95,
                    topK: 40
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
            boldness: body.hexagon?.boldness ?? 0.5,
            materialValue: body.hexagon?.materialValue ?? 0.5,
            utility: body.hexagon?.utility ?? 0.5,
            reliability: body.hexagon?.reliability ?? 0.5,
            comfort: body.hexagon?.comfort ?? 0.5,
            exclusivity: body.hexagon?.exclusivity ?? 0.5
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
            console.error('[Chat API] Gemini failed:', geminiError);
            console.error('[Chat API] Error details:', geminiError instanceof Error ? geminiError.message : 'Unknown error');
            // Fallback: 검색 결과 기반 간단 답변
            if (similarContents.length > 0) {
                const topProducts = similarContents.slice(0, 3).map(c =>
                    c.metadata.productName || c.metadata.type || '상품'
                ).join(', ');

                // 취향 기반 fallback 메시지 개선
                const hexagonContext = hexagon.boldness > 0.6 ? '트렌디한 스타일을 선호하시는 고객님께' :
                    hexagon.comfort > 0.6 ? '편안한 착용감을 중시하시는 고객님께' :
                        hexagon.materialValue > 0.6 ? '프리미엄 소재를 선호하시는 고객님께' : '고객님께';

                answer = `${hexagonContext} ${topProducts}을(를) 추천드립니다. 각 상품은 프리미엄 소재로 제작되어 품질이 뛰어납니다. 상세 페이지에서 더 자세한 정보를 확인해보세요!`;
            } else {
                answer = '죄송합니다. 현재 검색 결과를 찾을 수 없습니다. 다른 키워드로 검색해주세요.';
            }
        }

        // 중복 제거: productName 기준으로 고유한 상품만 반환
        const uniqueSources = similarContents.reduce((acc, c) => {
            const productName = c.metadata.productName;
            if (productName && !acc.some(item => item.productName === productName)) {
                acc.push({
                    id: c.id,
                    productName: c.metadata.productName,
                    category: c.metadata.category,
                    similarity: c.similarity
                });
            }
            return acc;
        }, [] as { id: string; productName?: string; category?: string; similarity: number }[]);

        return NextResponse.json({
            answer,
            sources: uniqueSources,
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
