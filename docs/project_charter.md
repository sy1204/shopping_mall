<!-- docs/project_charter.md -->
# 프로젝트 헌장 (Project Charter) 및 그라운드 룰

## 1. 개요 (Overview)
본 문서는 쇼핑몰 구축 프로젝트의 목표, 원칙, 그리고 팀원(User & Agents) 간의 협업 규칙을 정의합니다. 모든 구성원은 이 규칙을 준수해야 합니다.

### 1.1 프로젝트 목표
- **종합 쇼핑몰 구축**: 프론트엔드부터 백엔드, 배포까지 쇼핑몰의 전 과정을 구축합니다.
- **에디토리얼 커머스 구현**: 단순 판매를 넘어 브랜드 스토리와 콘텐츠를 전달하는 '29CM' 스타일의 커머스를 지향합니다.
- **학습 및 훈련**: 모던 웹 기술과 아키텍처를 실습하고 내재화하는 훈련의 장으로 삼습니다.

### 1.2 핵심 원칙
1.  **언어 규칙 (Language Rule)**: 프로젝트의 **모든 문서, 주석, 커밋 메시지, 의사소통은 기본적으로 '한국어(Korean)'로 작성**합니다.
2.  **문서 우선 (Documentation First)**: 모든 설계와 변경 사항은 문서화가 선행되거나, 코드 변경과 동시에 문서에 반영되어야 합니다.
3.  **사용자 경험 중심**: 기획 및 개발 시 최종 사용자의 편의성과 심미적 경험을 최우선으로 고려합니다.

---

## 2. 기술 스택 (Tech Stack) (제안)
*확정되지 않음. 프로젝트 진행에 따라 변경 가능.*

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Node.js (NestJS 또는 Express) 또는 Python (FastAPI)
- **Database**: PostgreSQL (RDB), Redis (Cache)
- **Infrastructure**: Docker, AWS (예정)

---

## 3. 코드 컨벤션 (Code Convention)

### 3.1 네이밍 규칙
- **변수/함수**: `camelCase` (예: `getUserProfile`)
- **클래스/컴포넌트**: `PascalCase` (예: `ProductDetail`)
- **상수**: `UPPER_SNAKE_CASE` (예: `MAX_RETRY_COUNT`)
- **파일/폴더**:
    - 컴포넌트 파일: `PascalCase.tsx`
    - 유틸/설정 파일: `kebab-case.ts` (예: `date-utils.ts`)

### 3.2 파일 경로 주석
- **모든 파일의 첫 번째 줄(1열)**에는 해당 파일의 프로젝트 루트 대비 상대 경로를 주석으로 명시합니다.
- 파일 확장자에 맞는 주석 스타일을 사용합니다.
    - `.ts`, `.tsx`, `.js`, `.jsx`: `// path/to/file`
    - `.css`, `.scss`: `/* path/to/file */`
    - `.md`, `.html`: `<!-- path/to/file -->`
    - `.sql`: `-- path/to/file`
    - `.yml`, `.yaml`, `.py`, `.sh`: `# path/to/file`

### 3.3 디렉토리 구조 (예시)
```
/src
  /components  # 재사용 가능한 UI 컴포넌트
  /pages       # 페이지 라우팅
  /hooks       # 커스텀 훅
  /utils       # 유틸리티 함수
  /styles      # 전역 스타일
```

---

## 4. 협업 규칙 (Workflow)

### 4.1 깃(Git) 전략
- **Branch**: `main` (배포), `develop` (개발), `feat/*` (기능 구현)
- **Commit Message**: [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다. (한글 권장)
    - `feat`: 새로운 기능 추가
    - `fix`: 버그 수정
    - `docs`: 문서 수정
    - `style`: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
    - `refactor`: 코드 리팩토링

### 4.2 문서 관리
- 모든 산출물은 `/docs` 폴더 내에 마크다운(`*.md`) 형식으로 저장합니다.
- 주요 변경 사항 발생 시 반드시 관련 문서를 업데이트합니다.

---

## 5. 프로젝트 공유 및 환경 계획 (Plan Share)

### 5.1 작업 환경 (Work Environment)
기획 및 디자인 단계와 개발 단계를 나누어 효율적인 협업 환경을 구축합니다.

#### Phase A: 기획 및 디자인 (Planning & Design)
*   **협업 도구**:
    *   **Notion**: 프로젝트 공식 문서, 회의록, 일정 관리 등 텍스트 기반 정보의 중앙 저장소. (공식 문서는 Notion에 작성 후 프로젝트로 불러오는 방식 활용)
    *   **Figma**: User Flow, IA(정보 구조), UI 디자인, 컴포넌트 시스템 등 시각적 자산 관리 및 PM-디자이너-개발자 간 소통.
*   **주요 활동**:
    *   PM(User)과 PM Agent가 주도가 되어 상세 기획 수립.
    *   팀 구성 계획(Team Building Plan) 수립 및 에이전트 역할 정의.

#### Phase B: 개발 및 배포 (Development & Deployment)
Phase A에서 수립된 계획을 바탕으로 구성된 팀이 실제 구현을 진행합니다.

*   **Version Control**: Git / GitHub
*   **Frontend**:
    *   **Framework**: Next.js
    *   **Deployment**: **Vercel** (CI/CD 자동화)
*   **Backend**:
    *   **Deployment**: **Render** (Node.js/Docker Hosting)
*   **Database & Storage**:
    *   **Supabase**: PostgreSQL DB, Auth, Storage 관리.
*   **AI Integration**:
    *   **Google AI Studio**: Gemini 등 최신 AI 모델 연동 및 서비스 적용.
