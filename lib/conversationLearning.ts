/**
 * 대화 학습 시스템 유틸리티 함수들
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Types
interface HexagonParams {
    boldness: number;
    materialValue: number;
    utility: number;
    reliability: number;
    comfort: number;
    exclusivity: number;
}

interface ChatLog {
    session_id: string;
    user_message: string;
    ai_response: string;
    conversation_type: string;
    user_tone: string;
    extracted_keywords: string[];
    hexagon_params: HexagonParams;
}

/**
 * 대화 로그 저장
 */
export async function saveChatLog(log: ChatLog): Promise<void> {
    try {
        const { error } = await supabase
            .from('chat_logs')
            .insert({
                session_id: log.session_id,
                user_message: log.user_message,
                ai_response: log.ai_response,
                conversation_type: log.conversation_type,
                user_tone: log.user_tone,
                extracted_keywords: log.extracted_keywords,
                hexagon_params: log.hexagon_params
            });

        if (error) {
            console.error('[Learning] Failed to save chat log:', error);
        } else {
            console.log('[Learning] Chat log saved successfully');
        }
    } catch (error) {
        console.error('[Learning] Error saving chat log:', error);
    }
}

/**
 * 대화에서 패턴 학습
 */
export async function learnFromConversation(
    keywords: string[],
    conversationType: string,
    userMessage: string
): Promise<void> {
    try {
        // 키워드 학습
        for (const keyword of keywords) {
            await supabase.rpc('increment_pattern_frequency', {
                p_type: 'keyword',
                p_value: keyword
            });
        }

        // 질문 패턴 학습
        if (conversationType === 'question') {
            const questionPattern = extractQuestionPattern(userMessage);
            if (questionPattern) {
                await supabase.rpc('increment_pattern_frequency', {
                    p_type: 'question',
                    p_value: questionPattern
                });
            }
        }
    } catch (error) {
        console.error('[Learning] Error learning from conversation:', error);
    }
}

/**
 * 질문 패턴 추출
 */
export function extractQuestionPattern(question: string): string | null {
    const lowerQuestion = question.toLowerCase();

    // 소재 정보 질문
    const materialQuestions = ['뭐야', '무엇', '어떤'];
    const materials = ['캐시미어', '울', '코튼', '린넨', '데님', '가죽'];
    if (materials.some(m => lowerQuestion.includes(m)) &&
        materialQuestions.some(q => lowerQuestion.includes(q))) {
        return '소재 정보 질문';
    }

    // 관리 방법 질문
    if (lowerQuestion.includes('관리') || lowerQuestion.includes('세탁') || lowerQuestion.includes('손질')) {
        return '관리 방법 질문';
    }

    // 가격 문의
    if (lowerQuestion.includes('가격') || lowerQuestion.includes('얼마')) {
        return '가격 문의';
    }

    // 사이즈 문의
    if (lowerQuestion.includes('사이즈') || lowerQuestion.includes('크기') || lowerQuestion.includes('핏')) {
        return '사이즈 문의';
    }

    // 스타일 문의
    if (lowerQuestion.includes('스타일') || lowerQuestion.includes('어울리') || lowerQuestion.includes('코디')) {
        return '스타일 문의';
    }

    return null;
}

/**
 * 인기 키워드 조회
 */
export async function getPopularKeywords(limit: number = 10): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .rpc('get_popular_patterns', {
                p_type: 'keyword',
                p_limit: limit
            });

        if (error || !data) return [];
        return data.map((d: any) => d.pattern_value);
    } catch (error) {
        console.error('[Learning] Error getting popular keywords:', error);
        return [];
    }
}

/**
 * 자주 묻는 질문 조회
 */
export async function getFrequentQuestions(limit: number = 5): Promise<Array<{ pattern: string, frequency: number }>> {
    try {
        const { data, error } = await supabase
            .rpc('get_popular_patterns', {
                p_type: 'question',
                p_limit: limit
            });

        if (error || !data) return [];
        return data.map((d: any) => ({
            pattern: d.pattern_value,
            frequency: d.frequency
        }));
    } catch (error) {
        console.error('[Learning] Error getting frequent questions:', error);
        return [];
    }
}

/**
 * 자주 묻는 질문에 대한 미리 준비된 답변
 */
export function getPresetAnswer(questionPattern: string): string | null {
    const answers: Record<string, string> = {
        '소재 정보 질문': '캐시미어는 카슈미르 지역 염소 털에서 얻은 고급 섬유로, 일반 양모보다 부드럽고 보온성이 뛰어나요. 울은 양털로 만든 천연 섬유이며, 코튼은 면화에서 얻은 통기성 좋은 소재입니다.',
        '관리 방법 질문': '대부분의 프리미엄 소재는 드라이클리닝을 권장드립니다. 제품 라벨의 세탁 표시를 꼭 확인해주세요. 울이나 캐시미어는 찬물 손세탁도 가능하지만 조심스럽게 다뤄야 합니다.',
        '가격 문의': '제품마다 가격대가 다릅니다. 구체적인 제품을 말씀해주시면 정확한 가격을 안내드릴게요.',
        '사이즈 문의': '각 제품 상세 페이지에서 사이즈 차트를 확인하실 수 있어요. 일반적으로 S, M, L 사이즈를 제공하며, 제품에 따라 상세한 치수가 표기되어 있습니다.',
        '스타일 문의': '스타일링은 개인의 취향과 상황에 따라 다양하게 연출할 수 있어요. 구체적으로 어떤 아이템과 매치하고 싶으신지 말씀해주시면 더 도움을 드릴 수 있습니다.'
    };

    return answers[questionPattern] || null;
}

/**
 * 학습 데이터 통계 조회
 */
export async function getLearningStats(): Promise<{
    totalConversations: number;
    uniqueSessions: number;
    topKeywords: string[];
    topQuestions: string[];
}> {
    try {
        // 전체 대화 수
        const { count: totalConversations } = await supabase
            .from('chat_logs')
            .select('*', { count: 'exact', head: true });

        // 고유 세션 수
        const { data: sessions } = await supabase
            .from('chat_logs')
            .select('session_id');
        const uniqueSessions = new Set(sessions?.map(s => s.session_id)).size;

        // 인기 키워드
        const topKeywords = await getPopularKeywords(5);

        // 자주 묻는 질문
        const frequentQuestions = await getFrequentQuestions(5);
        const topQuestions = frequentQuestions.map(q => q.pattern);

        return {
            totalConversations: totalConversations || 0,
            uniqueSessions,
            topKeywords,
            topQuestions
        };
    } catch (error) {
        console.error('[Learning] Error getting stats:', error);
        return {
            totalConversations: 0,
            uniqueSessions: 0,
            topKeywords: [],
            topQuestions: []
        };
    }
}
