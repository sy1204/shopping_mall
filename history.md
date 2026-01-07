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

*Last Updated: 2026-01-07 21:00*
