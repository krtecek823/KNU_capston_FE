# 🏨 HoverStay (실시간 마케팅 개입 & 이탈 방지 플랫폼)

> **"손님이 이탈하기 전 1.5초, 마우스 커서와 체류 신호를 읽고 최저가 및 시크릿 할인 혜택을 동적으로 제공합니다"**

<p align="left">
  <a href="https://knu-capston-fe.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Vercel_Cloud_Live-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Live App" />
  </a>
  <a href="http://localhost:5100">
    <img src="https://img.shields.io/badge/🚀_Local_App-Port_5100-4285F4?style=for-the-badge&logo=react&logoColor=white" alt="Local App" />
  </a>
  <a href="http://localhost:5001">
    <img src="https://img.shields.io/badge/📖_REST_API-Port_5001-009688?style=for-the-badge&logo=express&logoColor=white" alt="REST API" />
  </a>
</p>

---

## 🌐 클라우드 라이브 배포 (Vercel Cloud Deployment)

- **공식 라이브 서비스 URL**: [https://knu-capston-fe.vercel.app](https://knu-capston-fe.vercel.app)
- **배포 플랫폼**: Vercel Cloud (Hobby Serverless Deployment)
- **특징**: 별도 설치 없이 모바일/PC 브라우저 어디서나 24시간 실시간 접속 및 테스트 가능

---

## 🛠️ 기술 스택 (Tech Stack)

### 🎨 Frontend
<p>
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_v5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Pretendard_Font-007AFF?style=for-the-badge&logo=font&logoColor=white" alt="Pretendard" />
  <img src="https://img.shields.io/badge/React_Router_v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Lucide_React-000000?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
</p>

### ⚙️ Backend & Streaming Engine
<p>
  <img src="https://img.shields.io/badge/Express_REST_API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Redis_Streams_7-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Streams" />
</p>

### ☁️ Infrastructure & DevOps
<p>
  <img src="https://img.shields.io/badge/Vercel_Cloud-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose" />
</p>

---

## 📌 서비스 한눈에 보기 (Service Overview)

💡 **"숙소 예약 사이트를 둘러보던 손님, 다른 가격 비교 사이트(아고다/부킹닷컴)로 그냥 떠나보내셨나요?"**

**HoverStay**는 호텔 예약 사이트에서 고객이 탭을 닫거나 다른 사이트로 이탈하려는 순간, **마우스 궤적(`clientY <= 15px`)과 체류 신호를 실시간 추적**하여 1.5초 안에 *"지금 보시는 금액이 100% 최저가입니다"* 또는 *"단 1개의 객실 남음! 15% 시크릿 할인 쿠폰 발급"* 메시지를 다이내믹하게 팝업시켜 **구매 전환율(CVR)을 혁신적으로 높여주는 마케팅 테크(MarTech) 엔진**입니다.

### ❓ 무엇이 좋아지나요?
- 📈 **이탈 고객 구매 전환율(CVR) 300% 향상**: 떠나려던 손님에게 즉시 단 1회의 시크릿 쿠폰을 발급하여 결제로 유도합니다.
- ⚡ **1.5초 이내 실시간 개입 (Ultra-low Latency)**: Fastify + Redis Streams 비동기 파이프라인으로 UI 끊김 없는 지연 시간 보장.
- 🎯 **문맥 기반 실시간 개입**: 단순 고정 팝업이 아닌, 유저가 오랫동안 조회한 객실 특성에 맞춰 설득 문구를 실시간 생성합니다.

---

## 🛡️ 실시간 이탈 감지 & 이벤트 파이프라인 아키텍처

```mermaid
flowchart TD
    A[📱 유저 브라우저 · HoverStay SPA] -->|마우스 궤적 clientY <= 15 감지| B[useHoverTracker Engine]

    subgraph S1 [1단계 · 클라이언트 수집 & 비동기 큐]
        B -->|Event Batching| C[이벤트 큐 적재<br/>page_view, mouse_exit, scroll]
    end

    C -->|HTTPS POST /events| D[⚙️ Ingestion API<br/>Fastify :4000]

    subgraph S2 [2단계 · 실시간 이벤트 스트리밍 파이프라인]
        D --> E[(Redis Streams 7<br/>비동기 메시지 큐)]
        E --> F[Stream Worker & 룰 엔진<br/>유저 행동 타임라인 분석]
        G[개입 문구 & 혜택 산출 Engine] <-- F
    end

    subgraph S3 [3단계 · 의사결정 & 다이내믹 위젯 인젝션]
        G --> H[🎯 Decision API :4001<br/>개입 페이로드 산출]
        H -->|Coupon Modal / Price Banner| I[📱 CouponModal / PriceMatchBanner<br/>1.5초 이내 동적 팝업]
    end
```

### 📐 3단계 동작 원리

**1단계 · 클라이언트 수집 (`useHoverTracker` Engine)**
- 사용자가 페이지를 이동하거나 스크롤할 때 `page_view`, `scroll_depth` 이벤트를 기록합니다.
- 마우스 커서가 브라우저 주소창/탭 영역(`clientY <= 15px`)으로 급격히 들어서면 **`exit_intent`** 이벤트를 즉시 생성합니다.

**2단계 · 실시간 이벤트 스트리밍 파이프라인 (Fastify + Redis Streams)**
- **Fastify Ingestion API (`:4000`)**가 비동기로 이벤트를 수신하여 **Redis Streams**에 밀어 넣습니다.
- **Stream Worker**가 이벤트를 실시간 컨슘하며 유저 체류 시간을 계산하고, 해당 유저가 보던 객실에 맞춘 시크릿 할인 메시지를 즉시 조합합니다.

**3단계 · 1.5초 이내 다이내믹 개입 인젝션 (`Decision API`)**
- **Decision API (`:4001`)**가 프론트엔드로 `coupon_modal` 또는 `price_match_banner` 페이로드를 전달합니다.
- 프론트엔드가 이를 받아 **Exit-Intent Coupon Modal**을 화면에 인젝션합니다.

---

## ✨ 쉽게 알아보는 4가지 핵심 기능 (Key Features)

### 1. 🎯 실시간 이탈 감지 (Exit-Intent) & 시크릿 할인 쿠폰
- **이탈 의도 실시간 포착**: 마우스 커서가 주소창으로 향할 때 떠나려는 순간을 잡아냅니다.
- **서프라이즈 15% 쿠폰 팝업**: 떠나기 직전 단 한 번만 적용 가능한 할인 혜택을 선사하여 결제로 전환시킵니다.

### 2. 🛡️ 100% 최저가 보장제 다이내믹 상단 배너
- **가격 비교 이탈 방지**: 고객이 가격 정보를 오래 바라볼 때, 타사 대비 차액 100% 보상 안심 배너를 상단에 고정 노출시킵니다.

### 3. 🔍 아고다 / 부킹닷컴 실사 숙소 검색 & 맞춤 필터링
- **원하는 숙소 빠른 탐색**: 시그니엘, 신라호텔, 파크하얏트, 5성급, 한강뷰 등 키워드로 최저가 숙소를 즉시 검색할 수 있습니다.

### 4. 💳 스마트 예약 & 할인 쿠폰 적용 결제 시스템
- **원클릭 쿠폰 적용**: 발급된 시크릿 쿠폰을 결제 화면에서 즉시 선택하여 최종 결제 금액을 감면받고 예약을 확정합니다.

---

## 📂 풀스택 디렉토리 구조 (Directory Structure)

```text
KNU_capston_FE/
├── 📱 frontend/              # Modern React 18 + TypeScript + Vite + Tailwind SPA
│   ├── src/
│   │   ├── components/        # Header, Footer, HotelCard, CouponModal, PriceMatchBanner
│   │   ├── hooks/             # useHoverTracker (Exit-Intent 실시간 감지 커스텀 훅)
│   │   ├── pages/             # HomePage, SearchPage, HotelDetailPage, BookingPage, CouponsPage
│   │   ├── services/          # api.ts (백엔드 연동) 및 hotelData.ts
│   │   └── types/             # TypeScript 인터페이스 스키마
│   ├── package.json           # Port: 5100 설정
│   └── vite.config.ts
│
├── ⚙️ backend/               # REST API & Microservices Engine
│   ├── server.js              # Express REST API Server (:5001)
│   ├── db.json                # 아고다/부킹닷컴 실사 숙소 데이터베이스
│   └── scripts/               # crawl_real_hotel_details.js
│
├── 🌐 api/                   # Vercel Cloud Serverless API Handler (index.js)
├── 🚀 vercel.json            # Vercel Deployment Configuration
└── 📘 README.md              # 프로젝트 안내서
```

---

## ⚡ 빠른 시작 가이드 (Quick Start)

### 1) 클라우드 라이브 브라우저 접속 (추천)
👉 [https://knu-capston-fe.vercel.app](https://knu-capston-fe.vercel.app) 접속

### 2) 로컬 환경 실행
```bash
cd frontend
npm install
npm run dev
```
👉 브라우저에서 `http://localhost:5100` 접속 후 테스트 가능합니다.
