'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import HexagonChart from './HexagonChart';

interface HexagonParams {
    boldness: number;        // 도전성
    materialValue: number;   // 소재 가치
    utility: number;         // 실용성
    reliability: number;     // 신뢰도
    comfort: number;         // 편안함
    exclusivity: number;     // 희소성
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: {
        id: string;
        productName?: string;
        category?: string;
        similarity?: number;
    }[];
}

const DEFAULT_HEXAGON: HexagonParams = {
    boldness: 0.5,
    materialValue: 0.5,
    utility: 0.5,
    reliability: 0.5,
    comfort: 0.5,
    exclusivity: 0.5
};

const LOADING_MESSAGES = [
    '상품 가치를 분석 중입니다...',
    '취향에 맞는 정보를 찾고 있습니다...',
    '전문가 인사이트를 정리 중입니다...',
    '맞춤 추천을 준비하고 있습니다...'
];

export default function FashionChatUI() {
    const [hexagonParams, setHexagonParams] = useState<HexagonParams>(DEFAULT_HEXAGON);
    const [usePreferences, setUsePreferences] = useState(true);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 로딩 메시지 순환
    useEffect(() => {
        if (!isLoading) return;

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % LOADING_MESSAGES.length;
            setLoadingMessage(LOADING_MESSAGES[index]);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading]);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // 고품질 정적 Fallback 데이터
    const FALLBACK_PRODUCTS = [
        { id: '1', productName: '이태리 캐시미어 혼방 싱글 코트', category: '아우터' },
        { id: '2', productName: '베지터블 탄닝 램스킨 라이더 자켓', category: '아우터' },
        { id: '3', productName: '엑스트라파인 메리노 터틀넥', category: '니트웨어' },
        { id: '4', productName: '일본 셀비지 데님 트러커 자켓', category: '아우터' },
        { id: '5', productName: '수퍼 120s 울 테이퍼드 슬랙스', category: '하의' },
    ];

    // API 호출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: question };
        setMessages(prev => [...prev, userMessage]);
        setQuestion('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: question.trim(),
                    hexagon: usePreferences ? hexagonParams : DEFAULT_HEXAGON
                })
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: data.answer,
                    sources: data.sources
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                // 429 할당량 오류 감지
                const isQuotaError = response.status === 429 ||
                    data.error?.includes('quota') ||
                    data.error?.includes('429') ||
                    data.error?.includes('Too Many Requests') ||
                    data.error?.includes('RESOURCE_EXHAUSTED');

                if (isQuotaError) {
                    const fallbackMessage: ChatMessage = {
                        role: 'assistant',
                        content: `⚠️ 현재 사용량이 많아 임시 가이드로 답변드립니다.\n\n회원님의 취향 설정을 분석한 결과, 다음 상품들이 잘 어울릴 것 같습니다. 각 상품은 프리미엄 소재와 뛰어난 품질로 만족도가 높은 베스트셀러입니다.\n\n자세한 상품 정보는 개별 상품 페이지에서 확인해주세요.`,
                        sources: FALLBACK_PRODUCTS
                    };
                    setMessages(prev => [...prev, fallbackMessage]);
                } else {
                    const errorMessage: ChatMessage = {
                        role: 'assistant',
                        content: `죄송합니다. 오류가 발생했습니다: ${data.error || '알 수 없는 오류'}`
                    };
                    setMessages(prev => [...prev, errorMessage]);
                }
            }
        } catch {
            // 네트워크 오류 시에도 Fallback 제공
            const fallbackMessage: ChatMessage = {
                role: 'assistant',
                content: `⚠️ 현재 사용량이 많아 임시 가이드로 답변드립니다.\n\n회원님의 취향 분석 결과를 바탕으로 추천 상품을 안내해드립니다. 프리미엄 품질과 세련된 디자인으로 높은 만족도를 자랑하는 아이템입니다.`,
                sources: FALLBACK_PRODUCTS
            };
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fashion-chat-container">
            <div className="chat-layout">
                {/* 왼쪽: 슬라이더 섹션 */}
                <aside className="chart-sidebar">
                    <div className="sidebar-status">
                        <span className="status-dot"></span>
                        <span className="status-text">SYSTEM ACTIVE</span>
                    </div>

                    {/* 취향 반영 토글 */}
                    <div className="preference-toggle-container">
                        <label className="toggle-label">
                            <span className="toggle-text">나의 취향 반영</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={usePreferences}
                                onClick={() => setUsePreferences(!usePreferences)}
                                className={`toggle-switch ${usePreferences ? 'active' : ''}`}
                                disabled={isLoading}
                            >
                                <span className="toggle-slider"></span>
                            </button>
                        </label>
                        {!usePreferences && (
                            <p className="toggle-info">취향 설정이 비활성화되었습니다. AI는 일반적인 추천을 제공합니다.</p>
                        )}
                    </div>

                    <HexagonChart
                        values={hexagonParams}
                        onChange={setHexagonParams}
                        disabled={isLoading || !usePreferences}
                        preferencesEnabled={usePreferences}
                    />
                </aside>

                {/* 오른쪽: 채팅 영역 */}
                <main className="chat-main">
                    <div className="chat-header">
                        <p className="session-id">세션 ID: 8X-291</p>
                        <h1 className="chat-title">에디토리얼 어시스턴트</h1>
                    </div>

                    {/* 메시지 영역 */}
                    <div className="messages-container">
                        {messages.length === 0 && (
                            <div className="empty-state">
                                <div className="time-badge">오늘 오전 10:42</div>
                                <div className="welcome-message">
                                    <div className="ai-avatar">
                                        <span>✨</span>
                                    </div>
                                    <div className="welcome-bubble">
                                        <p>안녕하세요. 설정하신 취향을 반영하여 활용도 높은 아이템을 선별해드리겠습니다.</p>
                                    </div>
                                </div>
                                <div className="example-questions">
                                    <button onClick={() => setQuestion('겨울 코트 추천해줘')}>
                                        겨울 코트 추천해줘
                                    </button>
                                    <button onClick={() => setQuestion('캐시미어 니트 어떤 게 좋을까?')}>
                                        캐시미어 니트 추천
                                    </button>
                                    <button onClick={() => setQuestion('데일리룩에 어울리는 가방 알려줘')}>
                                        데일리 가방 알려줘
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'user' ? (
                                        <div className="user-avatar"></div>
                                    ) : (
                                        <div className="ai-avatar"><span>✨</span></div>
                                    )}
                                </div>
                                <div className="message-bubble">
                                    <p>{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="message-sources">
                                            {msg.sources.slice(0, 3).map((source, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/products/${source.id}`}
                                                    className="source-tag"
                                                >
                                                    {source.productName || source.category}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* 로딩 애니메이션 */}
                        {isLoading && (
                            <div className="message assistant loading">
                                <div className="message-avatar">
                                    <div className="ai-avatar"><span>✨</span></div>
                                </div>
                                <div className="message-bubble">
                                    <div className="loading-indicator">
                                        <div className="loading-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <p className="loading-text">{loadingMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* 입력 영역 */}
                    <form onSubmit={handleSubmit} className="input-form">
                        <div className="input-wrapper">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="명령어를 입력하거나 조언을 구하세요..."
                                disabled={isLoading}
                                className="question-input"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !question.trim()}
                                className="submit-button"
                            >
                                <span>↑</span>
                            </button>
                        </div>
                        <div className="input-footer">
                            <p>Enter를 눌러 전송</p>
                            <p>AI 패션 모델 v2.4</p>
                        </div>
                    </form>
                </main>
            </div>

            <style jsx>{`
                .fashion-chat-container {
                    min-height: 100vh;
                    background: var(--background-light, #fff);
                }

                .chat-layout {
                    display: grid;
                    grid-template-columns: 45% 1fr;
                    min-height: 100vh;
                }

                @media (max-width: 1024px) {
                    .chat-layout {
                        grid-template-columns: 1fr;
                    }
                }

                .chart-sidebar {
                    border-right: 1px solid #f0f0f0;
                    padding: 40px 32px;
                    overflow-y: auto;
                    background: linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
                    background-size: 60px 60px;
                }

                .sidebar-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--primary, #2b52ee);
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(43,82,238,0.4);
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .status-text {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: var(--primary, #2b52ee);
                    font-weight: 500;
                }

                .preference-toggle-container {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(43,82,238,0.03);
                    border: 1px solid rgba(43,82,238,0.1);
                    border-radius: 12px;
                }

                .toggle-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }

                .toggle-text {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--neural-black, #121212);
                    letter-spacing: 0.02em;
                }

                .toggle-switch {
                    position: relative;
                    width: 48px;
                    height: 24px;
                    background: #d1d5db;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    padding: 0;
                }

                .toggle-switch:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .toggle-switch.active {
                    background: var(--primary, #2b52ee);
                }

                .toggle-slider {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: #fff;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .toggle-switch.active .toggle-slider {
                    transform: translateX(24px);
                }

                .toggle-info {
                    margin-top: 12px;
                    font-size: 0.75rem;
                    color: #6b7280;
                    line-height: 1.5;
                    font-style: italic;
                }

                .chat-main {
                    display: flex;
                    flex-direction: column;
                    background: #fafafa;
                }

                .chat-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid #f0f0f0;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(8px);
                }

                .session-id {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #9ca3af;
                    margin-bottom: 4px;
                }

                .chat-title {
                    font-family: var(--font-display, 'Nanum Myeongjo', serif);
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--neural-black, #121212);
                }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .time-badge {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #9ca3af;
                    background: #f0f0f0;
                    padding: 6px 12px;
                    border-radius: 999px;
                }

                .welcome-message {
                    display: flex;
                    gap: 12px;
                    max-width: 600px;
                }

                .ai-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--primary, #2b52ee);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(43,82,238,0.2);
                    flex-shrink: 0;
                }

                .welcome-bubble {
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 16px;
                    border-top-left-radius: 4px;
                    padding: 16px 20px;
                    font-size: 1rem;
                    color: #374151;
                    line-height: 1.6;
                }

                .example-questions {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 12px;
                }

                .example-questions button {
                    background: #fff;
                    border: 1px solid rgba(43,82,238,0.2);
                    color: var(--primary, #2b52ee);
                    padding: 10px 16px;
                    border-radius: 999px;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .example-questions button:hover {
                    background: rgba(43,82,238,0.05);
                    border-color: var(--primary, #2b52ee);
                }

                .message {
                    display: flex;
                    gap: 12px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message.user {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    flex-shrink: 0;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    border: 1px solid #d1d5db;
                }

                .message-bubble {
                    max-width: 70%;
                    padding: 16px 20px;
                    border-radius: 16px;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .message.user .message-bubble {
                    background: var(--primary, #2b52ee);
                    color: #fff;
                    border-top-right-radius: 4px;
                    box-shadow: 0 4px 12px rgba(43,82,238,0.2);
                }

                .message.assistant .message-bubble {
                    background: #fff;
                    color: #374151;
                    border: 1px solid #f0f0f0;
                    border-top-left-radius: 4px;
                }

                .message-sources {
                    margin-top: 12px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .source-tag {
                    font-size: 0.75rem;
                    background: rgba(43,82,238,0.1);
                    color: var(--primary, #2b52ee);
                    padding: 6px 12px;
                    border-radius: 999px;
                    border: 1px solid rgba(43,82,238,0.2);
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .source-tag:hover {
                    background: var(--primary, #2b52ee);
                    color: #fff;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(43,82,238,0.3);
                }

                .loading-indicator {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .loading-dots {
                    display: flex;
                    gap: 4px;
                }

                .loading-dots span {
                    width: 8px;
                    height: 8px;
                    background: var(--primary, #2b52ee);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
                .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
                .loading-dots span:nth-child(3) { animation-delay: 0; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                .loading-text {
                    font-size: 0.875rem;
                    color: #6b7280;
                    font-style: italic;
                }

                .input-form {
                    padding: 24px 32px;
                    background: #fff;
                    border-top: 1px solid #f0f0f0;
                }

                .input-wrapper {
                    display: flex;
                    align-items: flex-end;
                    gap: 12px;
                    padding: 12px 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    background: #fafafa;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: var(--primary, #2b52ee);
                    box-shadow: 0 0 0 3px rgba(43,82,238,0.1);
                }

                .question-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    resize: none;
                    outline: none;
                    font-family: inherit;
                    color: var(--neural-black, #121212);
                    min-height: 24px;
                }

                .question-input::placeholder {
                    color: #9ca3af;
                }

                .question-input:disabled {
                    opacity: 0.5;
                }

                .submit-button {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--primary, #2b52ee);
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: background 0.2s;
                    flex-shrink: 0;
                }

                .submit-button:hover:not(:disabled) {
                    background: #1e40af;
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .input-footer {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    padding: 0 4px;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
}
