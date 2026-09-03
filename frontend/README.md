# 🏨 HoverStay Frontend (AI 스마트 케어 & 이탈 방지 마케팅 테크)

> **React 18 + TypeScript + Vite 기반의 프리미엄 숙소 예약 & 사용자 행동(Exit-Intent) 실시간 감지 플랫폼**

<p align="left">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_v5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📌 서비스 개요 (Service Overview)

**HoverStay**는 단순한 숙소 예약 플랫폼을 넘어, **사용자의 실시간 행동(마우스 이동, 이탈 의도, 체류 시간, 스크롤 깊이)을 감지하여 최적의 할인 혜택(쿠폰/최저가 보장)을 동적으로 제안하는 마케팅 테크(MarTech) 프론트엔드 애플리케이션**입니다.

경북대학교(KNU) 캡스톤 디자인의 정적 HTML 버전을 **Modern React SPA Architecture**로 완전히 리팩토링하고 고도화한 포트폴리오입니다.

---

## ✨ 핵심 기술 특징 (Key Engineering Features)

### 1. 🎯 `useHoverTracker` Custom Hook (핵심 기술 무기)
- **Exit-Intent Detection**: 사용자의 마우스 커서가 브라우저 상단 닫기/탭 영역(`clientY <= 15px`)으로 급격히 이동하는 이탈 의도를 감지하여 서프라이즈 15% 할인 쿠폰 모달(`CouponModal`)을 다이내믹하게 팝업합니다.
- **비동기 이벤트 배치(Batch) 처리**: UI 마이크로 스터터링(Stuttering)을 방지하기 위해 이벤트를 큐(Queue)에 적재 후 백그라운드 비동기 처리합니다.
- **Route Change Tracking**: React Router와 연동하여 SPA 페이지 전환 시 자동으로 `page_view` 이벤트를 기록합니다.

### 2. 🔌 백엔드 독립형 Mock API Layer
- 실제 백엔드 서버 없이도 클라이언트 사이드에서 **숙소 검색, 필터링, 최저가 계산, 실시간 이탈 감지 시뮬레이션, 예약 완료**까지 100% 동작합니다.
- Vercel / GitHub Pages 등 정적 호스팅 서비스에 즉시 배포하여 면접관이 실시간 체험 가능합니다.

### 3. 🎨 Modern UI & Component Architecture
- **Responsive Layout**: Tailwind CSS 기반으로 모바일, 태블릿, 데스크톱 반응형 대응.
- **Type Safety**: TypeScript Strict Mode를 적용하여 데이터 인터페이스(`Hotel`, `Coupon`, `TrackingEvent`, `DecisionResponse`)를 엄격하게 관리.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Framework & Build**: React 18, TypeScript, Vite
* **Routing**: React Router DOM v6
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **Icons**: Lucide React
* **State & Tracking**: React Hooks (`useHoverTracker`, Custom Event Queue)

---

## ⚡ 빠른 시작 가이드 (Quick Start)

### 1. 패키지 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행 (Port: 5100)
```bash
npm run dev
```
브라우저에서 `http://localhost:5100` 접속 후 사용하실 수 있습니다.

### 3. 프로덕션 빌드 및 검증
```bash
npm run build
```

---

## 📁 디렉토리 구조 (Directory Structure)

```text
hoverstay-frontend/
├── src/
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── Header.tsx           # 상단 내비게이션 & 이탈 감지 시뮬레이션 버튼
│   │   ├── Footer.tsx           # 푸터 정보
│   │   ├── HotelCard.tsx        # 숙소 카드 컴포넌트
│   │   ├── CouponModal.tsx      # 이탈 감지 시크릿 쿠폰 모달
│   │   └── PriceMatchBanner.tsx # 최저가 보장제 다이내믹 바너
│   ├── hooks/            # 핵심 커스텀 훅
│   │   └── useHoverTracker.ts   # 실시간 이벤트 트래킹 & Exit-Intent 엔진
│   ├── pages/            # 라우트 페이지
│   │   ├── HomePage.tsx         # 메인 탐색 페이지
│   │   ├── SearchPage.tsx       # 숙소 검색 페이지
│   │   ├── HotelDetailPage.tsx  # 숙소 상세 정보 페이지
│   │   ├── BookingPage.tsx      # 예약 및 결제 페이지
│   │   └── CouponsPage.tsx      # 쿠폰함 페이지
│   ├── services/         # API 및 Mock 데이터 레이어
│   │   ├── api.ts               # 비동기 API 통신 및 Decision 엔진
│   │   └── mockData.ts          # 숙소 및 쿠폰 데이터셋
│   ├── types/            # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx           # 라우팅 & 글로벌 위젯 인젝션
│   ├── main.tsx          # 애플리케이션 진입점
│   └── index.css         # Tailwind directives
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
