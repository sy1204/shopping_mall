<!-- docs/brand_concept.md -->
제시해주신 브랜드 철학을 실제 웹사이트나 앱의 **UI/UX 설계에 즉시 반영할 수 있는 마크다운 형식의 가이드 문서**입니다. 이 문서는 개발자, 디자이너와의 협업 시 가이드라인으로 활용하기 좋습니다.

---

# [N-D] 브랜드 UI/UX 가이드라인 (ver 1.0)

> **Concept:** *Neural Link & Editorial Logic*
> **Motto:** 점(Node)과 선(Dash)의 연결을 통해 유행을 레거시로 데이터화한다.

---

## 1. 시각적 원칙 (Visual Principles)

### 1.1 기본 기호 체계 (Symbolic System)

UI 전반에서 브랜드 아이덴티티를 드러내기 위해 다음의 기호를 인터페이스 요소로 활용합니다.

* **`[ ]` (Brackets):** 컨텐츠를 담는 컨테이너, 버튼, 혹은 상태값을 나타내는 프레임으로 활용.
* **`-` (Dash):** 연결성, 진행 상태(Progress), 혹은 계층 구조를 나타내는 구분선으로 활용.
* **`●` (Node):** 강조점, 선택된 상태(Active), 혹은 데이터의 정점을 나타내는 인디케이터로 활용.

### 1.2 컬러 팔레트 (Color Palette)

| 구분 | 컬러명 | HEX | 용도 |
| --- | --- | --- | --- |
| **Primary** | Neural Black | `#121212` | 메인 텍스트, 배경, 강한 대비 |
| **Secondary** | Pure White | `#FFFFFF` | 배경, 카드 UI, 여백 |
| **Point** | Tech Silver | `#8E8E8E` | 보조 텍스트, 하이픈, 가이드 라인 |
| **Accent** | Logic Blue | `#2F54EB` | 링크, 데이터 처리 중 상태, 포인트 강조 |

### 1.3 타이포그래피 (Typography)

* **Heading (Serif):** 매거진의 감성을 전달하기 위해 제목류(Title)에는 세리프체를 사용합니다. (예: `Playfair Display`, `나눔명조`)
* **Body (Sans-serif):** 정보 전달의 명확성을 위해 본문과 시스템 텍스트에는 고딕체를 사용합니다. (예: `Inter`, `Pretendard`)
* **Mono (Code):** 기술적 무드(Neural Link)를 위해 가격, 제품 번호, 전치사 등에는 모노스페이스체를 혼용합니다.

---

## 2. UI 컴포넌트 설계 (UI Components)

### 2.1 버튼 및 상호작용 (Buttons & Interaction)

버튼은 단순한 사각형 대신 브랜드를 상징하는 대괄호를 활용합니다.

* **Default:** `[ SHOP NOW ]`
* **Hover:** `[ ● SHOP NOW ]` (마우스 오버 시 노드가 나타나는 효과)
* **Active:** `[- SHOP NOW -]`

### 2.2 네비게이션 구조 (Navigation)

메뉴 구조에 전치사 철학을 녹여 서비스의 확장성을 보여줍니다.

* `[N-to-D]` : **ESSENTIALS** (유행에서 기본으로)
* `[N-in-D]` : **HERITAGE** (전통 속에 박힌 가치)
* `[N-beyond-D]` : **LAB** (실험적 디자인)

---

## 3. UX 인터랙션 가이드 (UX Interaction)

### 3.1 Neural Loading (로딩 애니메이션)

페이지 전환 시 데이터가 처리되는 듯한 느낌을 줍니다.

* **Action:** `[` 와 `]` 사이에서 `-`가 늘어났다 줄어들며 점(`●`)이 이동하는 모션.
* **Meaning:** "당신의 취향을 데이터 모델링 중입니다."라는 메시지 전달.

### 3.2 Infinite Dash (스크롤 효과)

* **Effect:** 페이지 스크롤 시 배경에 옅은 가이드 라인(Dash)이 흐르며, 각 상품(Node)들이 그 선 위에 배치되는 듯한 시각적 경험 제공.
* **Meaning:** 개별 상품들이 독립된 점이 아니라 하나의 스타일 라인으로 연결되어 있음을 체감하게 함.

---

## 4. 정보 구조 (Information Architecture)

### 4.1 제품 상세 페이지 (Product Detail)

상세 페이지의 정보는 기술 명세서(Spec Sheet)와 매거진 레이아웃을 결합합니다.

```markdown
## [ITEM_SPEC]
- NAME: Minimal Wool Coat
- NODE_TYPE: Outer / Legacy
- CONNECTION: [N-in-D]
- LOGIC: 30대 체형 데이터를 기반으로 설계된 오버사이즈 실루엣

```

### 4.2 큐레이션 시스템

사용자가 장바구니에 담은 상품들을 분석하여 **'Your Dash' (당신의 스타일 선)** 그래프를 시각화하여 보여줌으로써 구매의 논리적 근거를 제시합니다.

---

## 5. 검색 및 SEO 전략 (SEO Guideline)

### 5.1 메타데이터 설정

* **Title Tag:** `[N-D] 엔디 | 컨템포러리와 클래식을 잇는 뉴럴 큐레이션`
* **Meta Description:** `패션은 점(Node)이고 스타일은 선(Dash)입니다. [N-D]에서 당신만의 레거시를 연결하세요.`

### 5.2 텍스트 노출 전략

특수문자(`[ ]`, `-`)는 검색 엔진이 건너뛸 수 있으므로, 웹사이트 하단(Footer) 및 본문 내에 **"엔디(ND)", "ND LINK"**라는 텍스트를 반드시 병기하여 인식률을 높입니다.

---

## 6. 마케팅 슬로건 활용 예시 (Copywriting)

* **Main:** "Connected by logic, Worn by legacy."
* **Internal:** "Node to Dash: 현재의 선택이 미래의 레거시가 됩니다."
* **External:** "Beyond the trend, Into the Dash."

---

이 가이드 문서는 **[N-D]** 브랜드가 지향하는 '지적인 패션'과 '데이터 기반의 큐레이션'을 사용자에게 일관되게 전달하는 지침서가 될 것입니다. 추가로 필요한 UI 컴포넌트(모바일 앱 전용 인터페이스 등)가 있다면 말씀해 주세요!