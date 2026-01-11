/**
 * /api/chat - RAG 기반 패션 큐레이션 API
 * 
 * 사용자 질문과 6각형 취향 파라미터를 받아
 * 키워드 검색 후 맞춤형 답변을 생성합니다.
 * 
 * AI Provider: OpenAI GPT-4o-mini
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side only keys (never exposed to client)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validate environment variables
const validateEnvVars = () => {
    const missing: string[] = [];
    if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
    return missing;
};

// Supabase client with service role
const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');

// OpenAI API endpoint
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

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

// Simple response cache (in-memory, per-server instance)
const responseCache = new Map<string, { answer: string; sources: unknown[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

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
 * 헥사곤 파라미터가 모두 기본값(0.5)인지 확인
 */
function isDefaultHexagon(hexagon: HexagonParams): boolean {
    return Object.values(hexagon).every(v => v === 0.5);
}


/**
 * 취향 설정 여부에 따른 시스템 프롬프트 생성
 */
function buildSystemPrompt(hexagon: HexagonParams, usePreferences: boolean): string {
    // 취향 설정이 꺼져있을 때 (기본값)
    if (!usePreferences) {
        return `당신은 프리미엄 패션 편집샵 [N-D]의 전문 AI 어시스턴트입니다.

## 역할
고객의 질문에 친절하고 전문적으로 답변합니다.
상품 정보를 제공할 때는 객관적인 특징(소재, 디자인, 활용도)을 중심으로 설명하세요.

## 답변 구조
1. **질문 리마인드**: 고객이 물어본 내용을 간략히 언급 (예: "겨울 코트를 찾고 계시는군요!")
2. **직접 답변**: 질문에 대한 구체적인 답변 제공
3. **상품 소개**: 검색된 상품이 있다면 객관적으로 소개
4. **추가 질문**: 필요시 고객의 추가 의견 물어보기 (선택)

## 답변 스타일
- "~해요" 체로 친근하게
- 구체적인 정보 제공 (소재, 공법, 디자인 등)
- 200-300자 내외로 간결하게
- 대화하듯 자연스럽게
- 취향이나 개인화 언급 금지 (객관적 정보만)`;
    }

    // 취향 설정이 켜져있을 때
    const guidelines: string[] = [];

    // 도전성 (Boldness)
    if (hexagon.boldness > 0.6) {
        guidelines.push('- 독특하고 트렌디한 스타일의 장점을 자연스럽게 언급하세요.');
    } else if (hexagon.boldness < 0.4) {
        guidelines.push('- 클래식하고 오래 입을 수 있는 디자인의 가치를 강조하세요.');
    }

    // 소재 가치 (Material Value)
    if (hexagon.materialValue > 0.6) {
        guidelines.push('- 원단의 품질과 특수 가공 기술을 자연스럽게 설명하세요.');
    } else if (hexagon.materialValue < 0.4) {
        guidelines.push('- 전체적인 룩과 스타일링에 초점을 맞추세요.');
    }

    // 실용성 (Utility)
    if (hexagon.utility > 0.6) {
        guidelines.push('- 다양한 상황에서의 활용도를 언급하세요.');
    } else if (hexagon.utility < 0.4) {
        guidelines.push('- 특별한 순간을 위한 아이템임을 강조하세요.');
    }

    // 신뢰도 (Reliability)
    if (hexagon.reliability > 0.6) {
        guidelines.push('- 검증된 베스트셀러나 높은 평점을 언급하세요.');
    } else if (hexagon.reliability < 0.4) {
        guidelines.push('- 신상품의 특별함과 잠재력을 설명하세요.');
    }

    // 편안함 (Comfort)
    if (hexagon.comfort > 0.6) {
        guidelines.push('- 편안한 착용감과 활동성을 강조하세요.');
    } else if (hexagon.comfort < 0.4) {
        guidelines.push('- 단정하고 포멀한 핏의 매력을 설명하세요.');
    }

    // 희소성 (Exclusivity)
    if (hexagon.exclusivity > 0.6) {
        guidelines.push('- 장인정신과 디테일의 가치를 언급하세요.');
    } else if (hexagon.exclusivity < 0.4) {
        guidelines.push('- 합리적인 가격과 품질의 균형을 강조하세요.');
    }

    return `당신은 프리미엄 패션 편집샵 [N-D]의 전문 AI 어시스턴트입니다.

## 고객 취향 프로필 (0-1 스케일)
- 도전성: ${hexagon.boldness.toFixed(2)} (높으면 트렌디, 낮으면 클래식)
- 소재 가치: ${hexagon.materialValue.toFixed(2)} (높으면 프리미엄 소재 중시)
- 실용성: ${hexagon.utility.toFixed(2)} (높으면 범용성, 낮으면 특별한 날)
- 신뢰도: ${hexagon.reliability.toFixed(2)} (높으면 베스트셀러, 낮으면 신상품)
- 편안함: ${hexagon.comfort.toFixed(2)} (높으면 여유핏, 낮으면 포멀핏)
- 희소성: ${hexagon.exclusivity.toFixed(2)} (높으면 리미티드, 낮으면 가성비)

## 역할
고객의 질문에 답변하되, 위 취향 프로필을 참고하여 개인화된 인사이트를 자연스럽게 더합니다.
취향은 강요하지 말고, 필요할 때만 자연스럽게 언급하세요.

## 답변 구조
1. **질문 리마인드**: 고객이 물어본 내용을 간략히 언급 (예: "겨울 코트를 찾고 계시는군요!")
2. **직접 답변**: 질문에 대한 구체적인 답변 제공
3. **취향 기반 인사이트**: 필요시 "고객님은 [특성]을 선호하시니..." 형태로 자연스럽게 추가
4. **상품 소개**: 검색된 상품 소개 및 이유 설명
5. **추가 질문**: 필요시 고객의 추가 의견 물어보기 (선택)

## 취향 반영 가이드라인
${guidelines.length > 0 ? guidelines.join('\n') : '- 균형 잡힌 관점에서 객관적으로 설명하세요.'}

## 답변 스타일
- "~해요" 체로 친근하게
- 구체적인 소재/공법 용어 활용
- 200-300자 내외로 간결하게
- 대화하듯 자연스럽게
- 취향은 자연스럽게, 강요하지 않게`;
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

고객의 질문에 직접 답변해주세요. 먼저 질문 내용을 간략히 리마인드한 후 답변을 시작하세요.`;

    try {
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.9,
                max_tokens: 1024
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices?.[0]?.message?.content || '답변을 생성하지 못했습니다.';
        }

        const errorText = await response.text();
        console.error('[Chat API] OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText.substring(0, 200)}`);
    } catch (error) {
        console.error('[Chat API] Answer generation error:', error);
        throw error;
    }
}

/**
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
    try {
        // Validate environment variables first
        const missingEnvVars = validateEnvVars();
        if (missingEnvVars.length > 0) {
            console.error('[Chat API] Missing environment variables:', missingEnvVars.join(', '));
            return NextResponse.json(
                { error: `Server configuration error: Missing ${missingEnvVars.join(', ')}` },
                { status: 500 }
            );
        }

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

        // 캐시 확인
        const cacheKey = body.question.toLowerCase().trim();
        const cached = responseCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('[Chat API] Returning cached response for:', cacheKey);
            return NextResponse.json({
                answer: cached.answer,
                sources: cached.sources,
                hexagon,
                cached: true,
                debug: {
                    provider: 'OpenAI (cached)',
                    model: 'gpt-4o-mini'
                }
            });
        }

        // 1. 키워드 기반 상품 검색 (임베딩 API 호출 생략하여 API 호출 절감)
        console.log('[Chat API] Step 1: Keyword search for:', body.question);

        // 키워드 추출 및 직접 검색
        const keywords = body.question.toLowerCase().split(/\s+/).filter(w => w.length > 1);

        let similarContents: ProductContent[] = [];

        // 먼저 키워드로 검색 시도
        const { data: keywordData, error: keywordError } = await supabase
            .from('product_contents')
            .select('id, content, metadata')
            .or(keywords.map(k => `content.ilike.%${k}%`).join(','))
            .limit(5);

        if (keywordData && keywordData.length > 0) {
            similarContents = keywordData.map(item => ({
                ...item,
                similarity: 0.7
            }));
        } else {
            // 키워드 검색 실패 시 최신 상품 반환
            const { data: fallbackData } = await supabase
                .from('product_contents')
                .select('id, content, metadata')
                .limit(5);

            similarContents = (fallbackData || []).map(item => ({
                ...item,
                similarity: 0.5
            }));
        }

        console.log('[Chat API] Found products:', similarContents.length);

        // 3. 시스템 프롬프트 생성 (취향 설정 여부 감지)
        const usePreferences = !isDefaultHexagon(hexagon);
        const systemPrompt = buildSystemPrompt(hexagon, usePreferences);

        // 4. 최종 답변 생성 (with fallback)
        let answer: string;
        try {
            console.log('[Chat API] Step 4: Generating answer with OpenAI...');
            answer = await generateAnswer(body.question, similarContents, systemPrompt);
        } catch (openaiError) {
            console.error('[Chat API] OpenAI failed:', openaiError);
            const errorMsg = openaiError instanceof Error ? openaiError.message : 'Unknown error';

            // Fallback: 검색 결과 기반 간단 답변
            if (similarContents.length > 0) {
                const topProducts = similarContents.slice(0, 3).map(c =>
                    c.metadata.productName || c.metadata.type || '상품'
                ).join(', ');

                // 다양한 Fallback 템플릿
                const FALLBACK_TEMPLATES = [
                    (ctx: string, prods: string) => `**${ctx} ${prods} 같은 아이템은 어떠신가요? 현재 트렌드에 부합하면서도 고객님의 취향을 반영한 추천입니다.`,
                    (ctx: string, prods: string) => `**분석 결과, ${prods} 등이 가장 적합해 보입니다. ${ctx} 특히 만족도가 높은 상품들입니다.`,
                    (ctx: string, prods: string) => `**${prods} 등을 추천해 드리고 싶네요. ${ctx} 후회 없는 선택이 될 것입니다. 상세 정보를 확인해 보세요!`,
                    (ctx: string, prods: string) => `**고객님의 취향 데이터에 따르면 ${prods} 제품이 매칭률이 높습니다. 소재와 디자인 모두 완성도가 높은 아이템들입니다.`
                ];

                const hexagonContext = hexagon.boldness > 0.6 ? '트렌디한 스타일을 선호하시는 고객님께' :
                    hexagon.comfort > 0.6 ? '편안한 착용감을 중시하시는 고객님께' :
                        hexagon.materialValue > 0.6 ? '프리미엄 소재를 선호하시는 고객님께' : '고객님께';

                const randomTemplate = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];

                // 에러 원인 힌트 추가 (디버깅용 - 전체 에러 표시)
                const errorHint = `[DEBUG: ${errorMsg.substring(0, 100)}]`;

                answer = `${randomTemplate(hexagonContext, topProducts)} ${errorHint}`;
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

        // 성공적인 AI 응답만 캐시에 저장 (fallback 응답 제외)
        if (!answer.startsWith('**')) {
            responseCache.set(cacheKey, {
                answer,
                sources: uniqueSources,
                timestamp: Date.now()
            });
            console.log('[Chat API] Cached successful response for:', cacheKey);
        }

        return NextResponse.json({
            answer,
            sources: uniqueSources,
            hexagon,
            debug: {
                provider: 'OpenAI',
                model: 'gpt-4o-mini'
            }
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
