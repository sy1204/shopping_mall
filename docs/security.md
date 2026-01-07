# 🔐 [N-D] 쇼핑몰 보안 강화 계획

## 현재 보안 상태 분석

### 인증 시스템
| 항목 | 현재 상태 | 위험도 |
|------|----------|--------|
| 비밀번호 저장 | 평문 (localStorage) | 🔴 높음 |
| 인증 방식 | 클라이언트 측만 | 🔴 높음 |
| 비밀번호 정책 | 최소 6자 | 🟡 중간 |
| 로그인 시도 제한 | 없음 | 🟡 중간 |

### 권한 관리
| 항목 | 현재 상태 | 위험도 |
|------|----------|--------|
| 관리자 식별 | 이메일 패턴 매칭 | 🔴 높음 |
| 권한 검증 | 클라이언트 측 | 🟡 중간 |

---

## 권장 보안 기능

### 1단계: 즉시 개선 (Critical)

#### 1.1 비밀번호 해시화
```typescript
// bcrypt 사용 예시
import bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
```

#### 1.2 서버 측 인증 (Supabase Auth 연동)
- JWT 토큰 기반 세션 관리
- Refresh Token 구현
- 서버 미들웨어에서 권한 검증

### 2단계: 보안 강화

#### 2.1 강력한 비밀번호 정책
- 최소 8자 이상
- 대문자, 소문자, 숫자, 특수문자 포함
- 이전 비밀번호 재사용 금지

#### 2.2 로그인 시도 제한
- 5회 실패 시 15분 잠금
- IP 기반 Rate Limiting

#### 2.3 세션 관리
- 비활성 30분 후 자동 로그아웃
- 동시 로그인 제한 옵션

### 3단계: 고급 보안

#### 3.1 2단계 인증 (2FA)
- 이메일 OTP
- SMS 인증 (선택)
- TOTP 앱 지원

#### 3.2 보안 헤더
```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];
```

#### 3.3 입력값 검증
- XSS 방지: 모든 사용자 입력 sanitization
- SQL Injection 방지: Parameterized queries
- CSRF 토큰 구현

---

## 구현 우선순위

| 순위 | 기능 | 난이도 | 예상 시간 |
|------|------|--------|----------|
| 1 | 비밀번호 해시화 | 중 | 2시간 |
| 2 | 서버 측 인증 (Supabase) | 상 | 8시간 |
| 3 | 로그인 시도 제한 | 하 | 1시간 |
| 4 | 세션 타임아웃 | 하 | 1시간 |
| 5 | 비밀번호 재설정 | 중 | 3시간 |
| 6 | 2FA 구현 | 상 | 6시간 |

---

## 추가 권장 사항

- **HTTPS 적용**: Vercel 배포 시 자동 적용됨 ✅
- **환경 변수 관리**: API 키 등 민감 정보는 `.env.local`에 보관
- **정기 보안 감사**: 분기별 취약점 점검
- **로그인 이력 관리**: IP, 기기 정보, 시간 기록
- **개인정보 암호화**: 주소, 전화번호 등 AES 암호화 저장

---

*마지막 업데이트: 2026-01-07*
