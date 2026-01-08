-- ============================================
-- match_contents RPC 함수
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- pgvector extension 확인 (이미 활성화되어 있어야 함)
-- create extension if not exists vector;

-- match_contents 함수: 벡터 유사도 검색
-- 파라미터 순서: query_embedding, match_threshold, match_count

-- 기존 함수 삭제 (리턴 타입 변경 시 필요)
DROP FUNCTION IF EXISTS match_contents(vector, double precision, integer);
DROP FUNCTION IF EXISTS match_contents(vector, integer, double precision);
DROP FUNCTION IF EXISTS match_contents(vector, float, integer);
DROP FUNCTION IF EXISTS match_contents(vector, integer, float);

CREATE OR REPLACE FUNCTION match_contents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.content,
    pc.metadata,
    1 - (pc.embedding <=> query_embedding) AS similarity
  FROM product_contents pc
  WHERE 1 - (pc.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 함수 테스트 (임베딩 벡터가 필요하므로 API에서 호출)
-- SELECT * FROM match_contents('[0.1, 0.2, ...]'::vector(768), 5, 0.5);

-- 권한 설정 (필요시)
-- GRANT EXECUTE ON FUNCTION match_contents TO authenticated;
-- GRANT EXECUTE ON FUNCTION match_contents TO anon;
