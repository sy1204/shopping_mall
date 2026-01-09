# 개발 히스토리

---

## 2026-01-07: Supabase 회원가입/로그인 연동 완료

### 🎯 작업 목표
Vercel 배포 환경에서 Supabase를 활용한 회원가입 및 로그인 기능 정상 동작

### ✅ 완료된 작업

1. **Supabase 환경변수 설정**
   - `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY` Vercel 설정

2. **회원가입 기능**
   - 프로필 생성 (auth.users + profiles 테이블 연동)
   - 회원가입 후 자동 로그인 상태 유지

3. **로그인/세션 유지**
   - Supabase Auth 세션 기반 로그인 상태 유지
   - 페이지 새로고침 후에도 로그인 유지

4. **관리자 로그인**
   - 하드코딩 제거 → Supabase Auth 기반으로 변경
   - profiles 테이블의 `role='admin'`으로 관리자 권한 확인

5. **비밀번호 확인**
   - 마이페이지 개인정보 수정 시 Supabase Auth로 비밀번호 검증

6. **RLS 정책**
   - profiles 테이블 RLS 활성화 및 적절한 정책 설정

---

### 🐛 발생한 오류 및 원인 분석

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `ERR_NAME_NOT_RESOLVED` (placeholder.supabase.co) | Vercel 환경변수에 URL 오타 (`ttps://` → `https://`) | URL 자동 보정 로직 추가 + 정확한 값 재입력 |
| `ERR_NAME_NOT_RESOLVED` (실제 도메인) | Supabase Project URL 자체가 잘못됨 | Supabase 대시보드에서 정확한 URL 복사 |
| `Email address invalid` | Supabase Anon Key가 잘못되었거나 불완전함 | 정확한 Publishable Key 복사 |
| `User already registered` | 동일 이메일 중복 가입 시도 (폼 더블클릭) | isLoading 상태로 중복 제출 방지 |
| `401 Unauthorized` (profiles insert) | RLS 정책 미설정 | RLS 비활성화 또는 정책 추가 |
| Profile insert 무한 로딩 | **Supabase 클라이언트 hang 문제** | 직접 fetch API 사용으로 우회 |
| 회원가입 후 로그아웃 상태 | 세션 설정 전 페이지 이동 | 가입 성공 시 즉시 setUser() 호출 |
| 비밀번호 확인 실패 | localStorage 기반 검증 (Supabase 미사용) | Supabase Auth signInWithPassword 사용 |

---

### ⚠️ 주요 발견사항

1. **Supabase Client Hang 문제**
   - `supabase.from('profiles').insert()` 호출 시 프로미스가 resolve되지 않는 현상 발생
   - **해결**: 직접 `fetch()` API로 Supabase REST endpoint 호출
   - 원인 추정: 새로운 `sb_publishable_` 키 형식과 클라이언트 버전 호환성 문제 가능성

2. **환경변수 복사 실수**
   - Copy 버튼 대신 직접 선택 복사 시 일부 문자 누락 발생
   - **권장**: 항상 Copy 버튼 사용

3. **RLS와 개발 편의성**
   - 개발 중에는 RLS Disabled가 편리함
   - **프로덕션 배포 전 반드시 RLS 활성화 필요**

---

### 📋 내일 작업 예정

- [ ] 상품(products) 데이터 Supabase DB 연동
- [ ] 주문(orders) 데이터 Supabase DB 연동
- [ ] 기타 localStorage 기반 데이터 → Supabase 마이그레이션

---

### 📁 수정된 주요 파일

- `utils/supabase/client.ts` - URL 자동 보정 로직
- `context/AuthContext.tsx` - 회원가입/로그인/관리자 로그인 전체 수정
- `app/(auth)/signup/page.tsx` - 중복 제출 방지
- `app/(shop)/mypage/check-password/page.tsx` - Supabase Auth 비밀번호 검증
- `app/admin/users/page.tsx` - Supabase profiles 조회

---

*Last Updated: 2026-01-09 06:00*

---

## 2026-01-09: UI 리뉴얼 및 챗봇 인프라 구축

### 🎯 작업 목표
쇼핑몰 전체 UI를 "Neural Standard" 디자인으로 리뉴얼하고, Gemini AI 기반 챗봇 서비스를 위한 인프라 구축 및 API 디버깅

### ✅ 완료된 작업

1. **UI 디자인 시스템 리뉴얼 (Neural Standard)**
   - **스타일 정의**: `globals.css`에 `font-serif` (Nanum Myeongjo), `font-mono`, `[ ]` 형식의 브랜딩 적용
   - **메인 페이지**: 히어로 배너(좌우 분할), 마키 애니메이션, 뉴럴 링크 섹션 추가
   - **상품 카드**: Hover시 Grayscale → Color 전환, 이탤릭 명조체 상품명
   - **상품 상세**: 이미지 갤러리, 우측 Sticky Buy Box, 에디토리얼 스타일의 상품 설명
   - **로그인/회원가입**: 좌우 분할 레이아웃 적용

2. **챗봇 인프라 (Supabase + Gemini)**
   - **벡터 검색**: Supabase RPC 함수 `match_contents` 등록 완료
   - **데이터 시딩**: 50개의 고품질 패션 상품 데이터 `product_contents` 테이블에 삽입
   - **임베딩 생성**: Gemini API (`text-embedding-004`)를 사용하여 상품 데이터 임베딩 생성 완료 (45개 성공)

3. **챗봇 API 개선**
   - **모델 변경**: 호환성 문제 해결을 위해 `gemini-pro` 모델 사용 (안정성 확보)
   - **프롬프트 강화**: Hexagon 취향 수치를 AI 시스템 프롬프트에 구체적으로 반영하여 개인화 답변 유도 (User prompt 통합 방식 사용)
   - **디버깅**: `gemini-1.5-flash-001` 모델 호출 실패 문제 추적 중 (현재 `gemini-pro`로 우회)

---

### 🐛 트러블슈팅 및 진행 상황

| 이슈 | 원인 추정 | 조치 사항 | 상태 |
|------|-----------|-----------|------|
| **Gemini API 호출 실패 (Fallback 응답)** | `gemini-1.5-flash` 모델명 또는 Request Body 호환성 문제 | 1. 모델명 `gemini-pro`로 변경 <br> 2. `systemInstruction` 필드 제거 후 User prompt 통합 | **확인 필요** (테스트 대기) |
| **API 키 보안** | 노출된 API 키 | `.env.local`로 이동 및 `.gitignore` 확인 | **해결됨** |
| **포트 충돌** | 기존 프로세스 잔존 | `taskkill`, `Stop-Process` 등으로 프로세스 강제 종료 후 재시작 | **해결됨** |

### 📝 다음 단계 (재개 시)

1. **챗봇 응답 확인**: `gemini-pro` 모델이 적용된 상태에서 챗봇이 Fallback 메시지가 아닌 실제 생성된 답변을 주는지 브라우저/cURL로 확인 필요
2. **개인화 품질 검증**: Hexagon 슬라이더 값(도전성, 실용성 등)에 따라 답변 톤과 추천 이유가 달라지는지 테스트
3. **추가 UI 디테일**: 마이페이지, 장바구니 등 나머지 페이지 UI 마저 리뉴얼

---

*Last Updated: 2026-01-09 06:56*
