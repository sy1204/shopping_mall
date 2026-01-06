<!-- docs/team_building.md -->
# 팀 구성 계획 (Team Building Plan)

## 1. 개요 (Overview)
Phase B(본격 개발) 진입에 앞서, 프로젝트를 효율적으로 수행하기 위한 전문 에이전트(Agent) 팀을 구성하고 역할을 분담합니다.

## 2. 조직 구조 (Organization)

| Role | Position | Main Tech Stack | Responsibility |
| :--- | :--- | :--- | :--- |
| **PM** | Project Manager | Notion, Git | 프로젝트 총괄, 일정/문서 관리, 기획 |
| **Designer** | UI/UX Designer | Figma | 디자인 시스템, UI/UX 설계, 리소스 관리 |
| **Frontend** | FE Developer | Next.js, Vercel | 웹 애플리케이션 구현, UI 개발 |
| **Backend** | BE Developer | Node.js, Supabase | API 서버, DB 설계, AI 연동 |

## 3. 에이전트별 상세 역할 (R&R)

### 🧑‍💼 Project Manager (PM)
*   **Blueprint**: `blueprints/project_manager.md` (완료)
*   **Mission**: 프로젝트의 성공적인 런칭과 일정 준수.
*   **Tasks**:
    *   사용자 요구사항 분석 및 기능 상세화.
    *   WBS 관리 및 진척도 체크.
    *   Notion 문서화 및 이슈 트래킹.

### 🎨 UI/UX Designer
*   **Blueprint**: `blueprints/designer.md` (신규 예정)
*   **Mission**: "Wow" 포인트가 있는 프리미엄 감성 디자인 창조.
*   **Tasks**:
    *   Figma를 활용한 화면 정의 및 User Flow 설계.
    *   Brand Identity(Color, Typo) 정립 및 Design System 구축.
    *   고품질 이미지 생성 및 관리.

### 💻 Frontend Developer
*   **Blueprint**: `blueprints/frontend.md` (신규 예정)
*   **Mission**: 최적의 성능과 인터랙션을 갖춘 웹 클라이언트 구현.
*   **Tasks**:
    *   Next.js (App Router) 기반의 아키텍처 수립.
    *   TailwindCSS를 활용한 반응형 퍼블리싱.
    *   Vercel 배포 자동화 및 SEO 최적화.

### 🔧 Backend Developer
*   **Blueprint**: `blueprints/backend.md` (신규 예정)
*   **Mission**: 안정적이고 확장 가능한 서버 인프라 구축.
*   **Tasks**:
    *   Supabase (PostgreSQL) 데이터 모델링 및 Auth 연동.
    *   Render 기반의 백엔드 서비스 배포.
    *   Google AI Studio (Gemini) API 연동 로직 구현.

## 4. 향후 계획 (Next Step)
1.  **Blueprints 작성**: 각 역할별 구체적인 페르소나와 지침이 담긴 마크다운 파일 생성.
2.  **Agent 등록**: `antigravity.json`에 신규 에이전트 정보 추가.
3.  **Kick-off**: 팀 구성 후 개발 환경 세팅(Boilerplate) 시작.
