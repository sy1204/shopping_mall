# Supabase 대화 학습 시스템 설정 가이드

## 1단계: Supabase에서 마이그레이션 실행

### 방법 A: Supabase Dashboard (추천)

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 로그인
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭
   - "New query" 버튼 클릭

3. **마이그레이션 스크립트 실행**
   - `supabase/migrations/create_conversation_learning_tables.sql` 파일 내용 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭

4. **결과 확인**
   ```
   대화 학습 시스템 테이블이 성공적으로 생성되었습니다!
   - chat_logs: 대화 로그 저장
   - learned_patterns: 학습된 패턴 저장
   - 함수: increment_pattern_frequency, get_popular_patterns
   - 뷰: chat_statistics, popular_keywords
   ```

### 방법 B: Supabase CLI (로컬)

```bash
# Supabase CLI 설치 (아직 안 했다면)
npm install -g supabase

# 프로젝트 링크
supabase link --project-ref YOUR_PROJECT_REF

# 마이그레이션 실행
supabase db push
```

---

## 2단계: 테이블 생성 확인

Supabase Dashboard > Table Editor에서 확인:
- ✅ `chat_logs` 테이블
- ✅ `learned_patterns` 테이블

---

## 3단계: API 통합 (자동 완료 예정)

다음 파일들이 업데이트됩니다:
- `app/api/chat/route.ts` - 학습 함수 통합
- 대화 저장 및 패턴 학습 자동화

---

## 테스트 방법

### 1. 대화 로그 저장 테스트
```sql
-- Supabase SQL Editor에서 실행
SELECT * FROM chat_logs ORDER BY created_at DESC LIMIT 5;
```

### 2. 학습된 패턴 확인
```sql
-- 인기 키워드 확인
SELECT * FROM popular_keywords;

-- 자주 묻는 질문 확인
SELECT * FROM learned_patterns 
WHERE pattern_type = 'question' 
ORDER BY frequency DESC;
```

### 3. 통계 확인
```sql
-- 대화 통계
SELECT * FROM chat_statistics;
```

---

## 예상 결과

### 초기 (첫 주)
- 대화 로그 쌓이기 시작
- 키워드 빈도 집계

### 1주일 후
- 인기 검색어 TOP 10 파악
- 자주 묻는 질문 3-5개 식별

### 1개월 후
- 학습 데이터 기반 검색 개선
- 자동 답변 시스템 활성화

---

## 문제 해결

### 테이블이 생성되지 않는 경우
```sql
-- 기존 테이블 확인
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 필요시 수동 삭제 후 재생성
DROP TABLE IF EXISTS chat_logs CASCADE;
DROP TABLE IF EXISTS learned_patterns CASCADE;
```

### RPC 함수 오류
```sql
-- 함수 목록 확인
SELECT proname FROM pg_proc WHERE proname LIKE '%pattern%';

-- 함수 재생성
-- (마이그레이션 스크립트의 함수 부분만 다시 실행)
```

---

## 다음 단계

마이그레이션 완료 후:
1. ✅ API 통합 (자동)
2. ✅ 첫 대화 테스트
3. ✅ 로그 확인
4. 📊 대시보드 구축 (선택사항)
