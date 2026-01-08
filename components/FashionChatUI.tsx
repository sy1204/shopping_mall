'use client';

import React, { useState, useRef, useEffect } from 'react';
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
                    hexagon: hexagonParams
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
                const errorMessage: ChatMessage = {
                    role: 'assistant',
                    content: `죄송합니다. 오류가 발생했습니다: ${data.error || '알 수 없는 오류'}`
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fashion-chat-container">
            <div className="chat-layout">
                {/* 왼쪽: 6각형 차트 */}
                <aside className="chart-sidebar">
                    <h2 className="sidebar-title">나의 취향 설정</h2>
                    <p className="sidebar-desc">
                        슬라이더를 조절해 원하는 추천 스타일을 설정하세요
                    </p>
                    <HexagonChart
                        values={hexagonParams}
                        onChange={setHexagonParams}
                        disabled={isLoading}
                    />
                </aside>

                {/* 오른쪽: 채팅 영역 */}
                <main className="chat-main">
                    <div className="chat-header">
                        <h1 className="chat-title">N-D 패션 큐레이터</h1>
                        <p className="chat-subtitle">AI가 당신의 취향에 맞는 패션 조언을 드립니다</p>
                    </div>

                    {/* 메시지 영역 */}
                    <div className="messages-container">
                        {messages.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">👗</div>
                                <p>패션에 대해 무엇이든 물어보세요!</p>
                                <div className="example-questions">
                                    <button onClick={() => setQuestion('겨울 코트 추천해줘')}>
                                        겨울 코트 추천해줘
                                    </button>
                                    <button onClick={() => setQuestion('캐시미어 니트 어떤 게 좋을까?')}>
                                        캐시미어 니트 어떤 게 좋을까?
                                    </button>
                                    <button onClick={() => setQuestion('데일리룩에 어울리는 가방 알려줘')}>
                                        데일리룩에 어울리는 가방 알려줘
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="message-sources">
                                            <span className="sources-label">참고 상품:</span>
                                            {msg.sources.slice(0, 3).map((source, i) => (
                                                <span key={i} className="source-tag">
                                                    {source.productName || source.category}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* 로딩 애니메이션 */}
                        {isLoading && (
                            <div className="message assistant loading">
                                <div className="message-avatar">🤖</div>
                                <div className="message-content">
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
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="패션에 대해 물어보세요..."
                            disabled={isLoading}
                            className="question-input"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !question.trim()}
                            className="submit-button"
                        >
                            {isLoading ? '분석 중...' : '질문하기'}
                        </button>
                    </form>
                </main>
            </div>

            <style jsx>{`
                .fashion-chat-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
                    padding: 24px;
                }

                .chat-layout {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                    height: calc(100vh - 48px);
                }

                @media (max-width: 1024px) {
                    .chat-layout {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                }

                .chart-sidebar {
                    background: rgba(30, 30, 40, 0.6);
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow-y: auto;
                }

                .sidebar-title {
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .sidebar-desc {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .chat-main {
                    display: flex;
                    flex-direction: column;
                    background: rgba(30, 30, 40, 0.6);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                }

                .chat-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .chat-title {
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }

                .chat-subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    margin-top: 4px;
                }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: rgba(255, 255, 255, 0.6);
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .example-questions {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 20px;
                }

                .example-questions button {
                    background: rgba(139, 92, 246, 0.2);
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    color: #fff;
                    padding: 10px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .example-questions button:hover {
                    background: rgba(139, 92, 246, 0.4);
                    transform: translateY(-2px);
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
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(139, 92, 246, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .message.user .message-avatar {
                    background: rgba(59, 130, 246, 0.3);
                }

                .message-content {
                    max-width: 70%;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 14px 18px;
                    border-radius: 16px;
                    color: #fff;
                    line-height: 1.6;
                }

                .message.user .message-content {
                    background: rgba(59, 130, 246, 0.3);
                    border-bottom-right-radius: 4px;
                }

                .message.assistant .message-content {
                    background: rgba(139, 92, 246, 0.2);
                    border-bottom-left-radius: 4px;
                }

                .message-sources {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    align-items: center;
                }

                .sources-label {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.5);
                }

                .source-tag {
                    font-size: 11px;
                    background: rgba(139, 92, 246, 0.3);
                    padding: 4px 10px;
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.8);
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
                    background: #8b5cf6;
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
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    font-style: italic;
                }

                .input-form {
                    display: flex;
                    gap: 12px;
                    padding: 20px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.2);
                }

                .question-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 14px 18px;
                    color: #fff;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .question-input:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    background: rgba(139, 92, 246, 0.1);
                }

                .question-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .question-input:disabled {
                    opacity: 0.5;
                }

                .submit-button {
                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                    color: #fff;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
                }

                .submit-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
