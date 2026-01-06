<!-- docs/29cm_analysis_report.md -->
# 29CM 벤치마킹 분석 보고서

## 1. 개요
본 문서는 '29cm.co.kr' 사이트의 구조와 UX를 분석하여, 본 프로젝트의 쇼핑몰 구축 시 참고할 수 있는 벤치마킹 포인트와 IA(Information Architecture)를 정의합니다.

### 분석 대상
- **URL**: https://www.29cm.co.kr/
- **분석 일자**: 2026-01-02
- **분석 목적**: 에디토리얼 커머스(Editorial Commerce) 구조 이해 및 벤치마킹

---

## 2. 웹 사이트 구성 및 구현 분석

### 2.1 GNB (Global Navigation Bar)
29CM는 '상품 찾기'보다 **'콘텐츠 발견'**에 최적화된 네비게이션 구조를 가지고 있습니다.
- **Top Utility**: 로그인, 마이페이지, 장바구니, 좋아요, 검색
- **Main Menu (Content 중심)**
    - **Special-Order**: 29CM 단독 상품 및 선발매 중심의 큐레이션
    - **Showcase**: 신규 브랜드나 컬렉션을 매거진 형식으로 소개
    - **PT**: 브랜드의 스토리를 인터랙티브한 화보와 함께 전달 (시그니처 기능)
    - **29Magazine**: 에디터가 작성한 라이프스타일 콘텐츠
- **Category Menu**: BEST, WOMEN, MEN, LIFE 등 (2차 메뉴로 배치)

### 2.2 메인 홈 레이아웃
- **에디토리얼 배너**: 잡지 표지와 같은 대형 배너를 사용하여 시각적 몰입감 극대화.
- **브랜드 스토리텔링**: 상품 단순 나열보다 '브랜드의 가치'를 전달하는 섹션 우선 배치.
- **그리드 시스템**: 화이트 스페이스(여백)를 충분히 활용하고 고해상도 이미지를 강조하는 클린한 그리드 사용.

### 2.3 상품 상세 페이지 (Product Detail)
- **비주얼 중심**: 텍스트 스펙 대신 감성적인 화보와 에세이 스타일의 상세 설명.
- **구매 정보 분리**: 상품 설명이 길어질 수 있으므로, 구매 버튼/가격 정보 등을 사이드바나 하단에 고정(Sticky)하여 접근성 유지.
- **Brand Home 연결**: 해당 브랜드의 팬덤 형성을 위해 브랜드 홈으로 이동하는 진입점을 명확히 배치.

---

## 3. 기존 쇼핑몰과의 비교

| 구분 | 일반적인 의류 쇼핑몰 | 29CM (취향 셀렉트샵) |
| :--- | :--- | :--- |
| **핵심 가치** | 최저가, 빠른 검색, 많은 상품 수 | 브랜드 스토리, 큐레이션, 감도 높은 비주얼 |
| **GNB 구성** | 카테고리(상의, 하의) 중심 | 콘텐츠(PT, Magazine) 중심 |
| **UX 디자인** | 정보 밀집형 (이벤트/할인 배너 다수) | 여백 중심의 미니멀리즘 (콘텐츠 집중) |
| **콘텐츠** | 단순 상품 스펙 제공 | 읽을거리(Article)와 쇼핑의 결합 |

---

## 4. IA (Information Architecture) 제안

```markdown
# Information Architecture Draft

## 1. Global Navigation
- [Utility] Search, Cart, My Page, Login
- [Content] Special-Order, Showcase, PT, Magazine
- [Shop] Best, New, Women, Men, Life, Category...

## 2. Main Page Sections
- Hero Banner (Full-width Slide)
- AI Curation Feed (User Personalization)
- Daily Content / Magazine
- Brand Focus / Showcase

## 3. Product Detail Structure
- Product Image Viewer (Zoom/Slide)
- Sticky Buy Box (Product Name, Price, Options, CTA)
- Editorial Content Body (Images + Texts)
- Reviews & QnA
- Recommendation (Related Products)
```

---

## 5. 추가 분석 및 기획 인사이트 (PM Note)

본 보고서에 담지 않았던 기술적/기획적 고려사항을 기록합니다.

### 5.1 UX/UI 기획 포인트
- **Sticky Buy Box 구현 필수**: 에디토리얼 커머스 특성상 상세 페이지의 스크롤이 매우 깁니다. 사용자가 언제든 구매 결정을 내릴 수 있도록 '구매하기/장바구니' 버튼이 포함된 영역을 화면 하단이나 우측에 **Sticky(고정)** 처리하는 것이 구매 전환율에 핵심적입니다.
- **마이크로 인터랙션**: 좋아요(하트) 버튼 클릭 시의 애니메이션, 이미지 호버 시의 줌인 효과 등 감성적인 품질을 높이는 마이크로 인터랙션이 '프리미엄' 느낌을 주는 데 큰 역할을 합니다.

### 5.2 개발 요구사항 (Technical Requirement)
- **이미지 최적화 (Image Optimization)**: 텍스트보다 이미지가 압도적으로 많은 사이트입니다. 로딩 속도 저하를 막기 위해 **Lazy Loading**, **WebP 포맷 적용**, **CDN 활용**이 초기 아키텍처 설계 시 필수적으로 고려되어야 합니다.
- **데이터 모델 설계 (Data Modeling)**:
    - **브랜드(Brand) 엔티티의 격상**: 일반 쇼핑몰처럼 단순히 상품의 속성(Attribute)으로 브랜드를 처리하면 안 됩니다. '브랜드' 자체가 하나의 미니 홈페이지(Brand Home)를 가질 수 있도록 독립적인 엔티티로 설계하고, 스토리/상품/룩북 등을 포함할 수 있어야 합니다.
    - **콘텐츠-상품 결합 구조**: 매거진 아티클 내에 상품 태그를 심거나 링크를 연결하는 **CMS(Content Management System)** 기능이 백오피스에 필요합니다.

### 5.3 검색 및 탐색
- **태그 기반 검색**: 카테고리 뎁스(Depth)가 얕은 대신, '분위기', '상황', '스타일' 등 감성적인 태그를 데이터에 포함시켜 사용자가 취향 기반으로 탐색할 수 있게 해야 합니다.

---
**작성자**: Project Manager Agent
**작성일**: 2026-01-02
