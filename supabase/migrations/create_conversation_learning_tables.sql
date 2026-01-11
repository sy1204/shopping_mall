-- ============================================
-- 대화 학습 시스템 - Supabase 테이블 생성
-- ============================================

-- 1. 대화 로그 테이블
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    conversation_type TEXT, -- greeting, question, request, feedback, small_talk, closing
    user_tone TEXT, -- friendly, formal, urgent, disappointed, satisfied
    extracted_keywords TEXT[], -- ['코트', '캐시미어']
    hexagon_params JSONB, -- 사용자 취향 설정
    created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_logs_keywords ON chat_logs USING GIN(extracted_keywords);
CREATE INDEX IF NOT EXISTS idx_chat_logs_type ON chat_logs(conversation_type);

-- 2. 학습 데이터 집계 테이블
CREATE TABLE IF NOT EXISTS learned_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_type TEXT NOT NULL, -- 'keyword', 'question', 'style_preference'
    pattern_value TEXT NOT NULL,
    frequency INTEGER DEFAULT 1,
    last_seen TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(pattern_type, pattern_value)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_learned_patterns_type ON learned_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_learned_patterns_freq ON learned_patterns(frequency DESC);
CREATE INDEX IF NOT EXISTS idx_learned_patterns_last_seen ON learned_patterns(last_seen DESC);

-- 3. 패턴 빈도 증가 함수
CREATE OR REPLACE FUNCTION increment_pattern_frequency(
    p_type TEXT,
    p_value TEXT,
    p_metadata JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO learned_patterns (pattern_type, pattern_value, frequency, last_seen, metadata)
    VALUES (p_type, p_value, 1, NOW(), p_metadata)
    ON CONFLICT (pattern_type, pattern_value)
    DO UPDATE SET
        frequency = learned_patterns.frequency + 1,
        last_seen = NOW(),
        metadata = COALESCE(p_metadata, learned_patterns.metadata);
END;
$$ LANGUAGE plpgsql;

-- 4. 인기 패턴 조회 함수
CREATE OR REPLACE FUNCTION get_popular_patterns(
    p_type TEXT,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    pattern_value TEXT,
    frequency INTEGER,
    last_seen TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT lp.pattern_value, lp.frequency, lp.last_seen
    FROM learned_patterns lp
    WHERE lp.pattern_type = p_type
    ORDER BY lp.frequency DESC, lp.last_seen DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 5. 오래된 로그 자동 삭제 (6개월 이상)
CREATE OR REPLACE FUNCTION cleanup_old_chat_logs() RETURNS void AS $$
BEGIN
    DELETE FROM chat_logs
    WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

-- 6. Row Level Security (RLS) 설정
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE learned_patterns ENABLE ROW LEVEL SECURITY;

-- 서비스 역할은 모든 작업 가능
CREATE POLICY "Service role can do everything on chat_logs"
    ON chat_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can do everything on learned_patterns"
    ON learned_patterns
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 익명 사용자는 읽기만 가능 (통계 조회용)
CREATE POLICY "Anyone can read learned_patterns"
    ON learned_patterns
    FOR SELECT
    TO anon
    USING (true);

-- 7. 통계 뷰 생성
CREATE OR REPLACE VIEW chat_statistics AS
SELECT
    DATE(created_at) as date,
    conversation_type,
    COUNT(*) as conversation_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM chat_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), conversation_type
ORDER BY date DESC, conversation_count DESC;

-- 8. 인기 키워드 뷰
CREATE OR REPLACE VIEW popular_keywords AS
SELECT
    pattern_value as keyword,
    frequency,
    last_seen
FROM learned_patterns
WHERE pattern_type = 'keyword'
ORDER BY frequency DESC
LIMIT 50;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '대화 학습 시스템 테이블이 성공적으로 생성되었습니다!';
    RAISE NOTICE '- chat_logs: 대화 로그 저장';
    RAISE NOTICE '- learned_patterns: 학습된 패턴 저장';
    RAISE NOTICE '- 함수: increment_pattern_frequency, get_popular_patterns';
    RAISE NOTICE '- 뷰: chat_statistics, popular_keywords';
END $$;
