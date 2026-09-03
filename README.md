# 🏨 HoverStay Full-Stack Monorepo (AI 마케팅 테크 & 이탈 방지 플랫폼)

> **호텔 예약 사이트에서 사용자의 실시간 행동(Exit-Intent)을 감지하고, AI 기반 최저가 및 시크릿 할인 쿠폰을 자동 동적 제안하는 풀스택 풀 아키텍처**

<p align="left">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_v5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Redis_Streams-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI" />
</p>

---

## 📂 풀스택 디렉토리 구조 (Directory Structure)

```text
KNU_capston_FE/
├── frontend/                  # 📱 [FE] Modern React 18 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/        # Header, Footer, HotelCard, CouponModal, PriceMatchBanner
│   │   ├── hooks/             # useHoverTracker (마우스 Exit-Intent & 이벤트 트래킹)
│   │   ├── pages/             # HomePage, SearchPage, HotelDetailPage, BookingPage, CouponsPage
│   │   ├── services/          # api.ts (백엔드 API 연동 & Mock 서비스) 및 mockData.ts
│   │   └── types/             # TypeScript 데이터 스키마
│   ├── index.html
│   ├── package.json           # Port: 5100 설정
│   ├── vite.config.ts
│   └── README.md
│
├── backend/                   # ⚙️ [BE] Microservices Monorepo & AI Pipeline
│   ├── packages/
│   │   ├── ingestion-api/     # Fastify 고성능 이벤트 수집 API (Port: 4000)
│   │   ├── decision-api/      # 실시간 개입 의사결정 API (Port: 4001)
│   │   ├── stream-worker/     # Redis Stream Consumer & Google Gemini AI Rule Engine
│   │   ├── dashboard-api/     # OLAP 분석 & 대시보드 API (Port: 4002)
│   │   ├── data-science/      # Python 임계치 분석 모델 API (Port: 8000)
│   │   ├── simulator/         # 사용자 행동 트래픽 시뮬레이터
│   │   └── shared/            # 공통 스키마 & 설정
│   ├── notebooks/             # A/B 테스트 & 행동 데이터셋 분석 (Jupyter)
│   ├── docs/                  # API 규격서 & 이벤트 스키마
│   └── docker-compose.yml     # 백엔드 마이크로서비스 독립 실행 환경
│
├── docker-compose.yml         # 🚀 풀스택 통합 Docker 인프라 실행 환경
├── package.json               # 루트 모노레포 명령어 스크립트
└── README.md                  # 포트폴리오 메인 가이드 문서
```

---

## ⚡ 빠른 시작 가이드 (Quick Start)

### 1. 프론트엔드 실행 (React SPA / Port: 5100)
```bash
cd frontend
npm install
npm run dev
```
브라우저에서 `http://localhost:5100` 접속 후 실시간 이탈 감지 테스트 가능합니다.

### 2. 백엔드 마이크로서비스 실행 (Docker Compose)
```bash
# 루트 디렉토리에서 실행
docker compose up -d
```
Ingestion API (`:4000`), Decision API (`:4001`), Redis (`:6379`), ClickHouse (`:8123`)가 자동 구동됩니다.

---

## ✨ 핵심 기술 스택 및 아키텍처

| 영역 | 사용 기술 | 설명 |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | SPA 라우팅, 반응형 UI, 커스텀 이벤트 수집 엔진 |
| **Tracking Engine** | `useHoverTracker` Custom Hook | 마우스 Y좌표(`clientY <= 15`) 기반 이탈 감지 & 비동기 큐 |
| **Backend API** | Node.js, Fastify, Redis Streams | 초당 고성능 이벤트 수신 및 비동기 스트리밍 처리 |
| **AI Rule Engine** | Google Gemini AI (gemini-2.5-flash) | 유저 문맥 기반 실시간 개입 카피/쿠폰 동적 추천 |
| **Analytics DB** | ClickHouse, PostgreSQL 16 | 대용량 실시간 행동 로그 분석 및 A/B 테스트 지표 관리 |
