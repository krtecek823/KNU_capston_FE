# 🏨 HoverStay (AI 실시간 마케팅 개입 & 이탈 방지 스테이 플랫폼)

> **호텔 예약 사이트에서 손님이 다른 탭/사이트로 이탈하기 전, 마우스 행동(Exit-Intent) 및 체류 신호를 실시간 감지하여 AI 기반 최저가 보장 및 시크릿 할인 혜택을 동적으로 제공하는 Enterprise MarTech 풀스택 모노레포입니다.**

---

## 🛠️ 기술 스택 라벨 요약 (Tech Stack Labels)

### 📱 Frontend Stack
<p align="left">
  <img src="https://img.shields.io/badge/Language-TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framework-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Build_Tool-Vite_v5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Routing-React_Router_v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
</p>

### ⚙️ Backend Stack
<p align="left">
  <img src="https://img.shields.io/badge/Language-TypeScript_/_JavaScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TS/JS" />
  <img src="https://img.shields.io/badge/Language-Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/API_Framework-Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Queue-Redis_Streams_7-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Streams" />
  <img src="https://img.shields.io/badge/AI_Engine-Google_Gemini_2.5-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/OLAP_DB-ClickHouse-FFCC00?style=for-the-badge&logo=clickhouse&logoColor=black" alt="ClickHouse" />
  <img src="https://img.shields.io/badge/RDBMS-PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/DevOps-Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📋 1. 프론트엔드 & 백엔드 기술 명세 (Tech Stack Detail)

### 📱 Frontend (클라이언트 스택)
| 구분 | 기술 / 언어 | 설명 |
|---|---|---|
| **사용 언어** | **TypeScript (v5)** | Strict Mode 기반 타입 안정성 확보 및 인터페이스 설계 |
| **UI 프레임워크** | **React 18** | Component 기반 SPA (Single Page Application) 아키텍처 |
| **빌드 툴** | **Vite (v5)** | 초고속 HMR 로컬 개발 환경 구축 (`Port: 5100`) |
| **스타일링** | **Tailwind CSS (v3)** | 반응형 레이아웃 및 모던 인터랙션 애니메이션 구현 |
| **라우팅** | **React Router DOM (v6)** | SPA 클라이언트 사이드 페이지 전환 처리 |
| **행동 엔진** | **`useHoverTracker` Hook** | 마우스 Exit-Intent 감지 및 비동기 이벤트 배치 수집 엔진 |

---

### ⚙️ Backend (서버 & 데이터 파이프라인 스택)
| 구분 | 기술 / 언어 | 설명 |
|---|---|---|
| **사용 언어** | **TypeScript / JavaScript, Python 3.11** | API 서비스(TS/JS) + 데이터 사이언스/ML 모델(Python) |
| **API 프레임워크** | **Fastify, FastAPI** | 초고속 Event Ingestion API + Python ML Model API |
| **메시지 큐** | **Redis Streams 7** | 초당 수천 건 유저 행동 이벤트의 비동기 메시지 스트리밍 |
| **AI 룰 엔진** | **Google Gemini AI (2.5-flash)** | 유저 체류 시간/문맥 기반 실시간 설득 혜택 카피 생성 |
| **데이터베이스** | **ClickHouse, PostgreSQL 16** | OLAP 실시간 행동 분석 DB + RDBMS 서비스 메타데이터 |
| **인프라 / 배포** | **Docker, Docker Compose** | 원클릭 멀티 마이크로서비스 오케스트레이션 |

---

## ✨ 2. 핵심 기능 요약 (Key Features)

### 🎯 Frontend Key Features
* **Exit-Intent Detection**: 마우스 커서가 브라우저 상단 영역(`clientY <= 15px`)으로 이동할 때 시크릿 15% 할인 쿠폰 모달(`CouponModal`) 자동 팝업.
* **Non-blocking Event Stream Queue**: 메인 UI 스레드 렌더링 지연 없이 백그라운드 이벤트 큐 연동.
* **Mock Service Layer**: 백엔드 서버가 구동되지 않아도 프론트엔드 단독으로 100% 시뮬레이션 동작.

### ⚡ Backend Key Features
* **High-throughput Ingestion**: Fastify 기반 고성능 이벤트 가공 및 Redis Streams 적재.
* **Context-aware Intervention**: Google Gemini AI 연동을 통해 유저의 이탈 타임라인 문맥 분석.
* **Realtime Analytics**: ClickHouse를 통한 실시간 A/B 테스트 및 전환율 지표 집계.

---

## 🏗️ 3. 풀스택 디렉토리 구조 (Directory Structure)

```text
KNU_capston_FE/
├── 📱 frontend/              # Modern React 18 + TypeScript + Vite + Tailwind SPA
│   ├── src/
│   │   ├── components/        # Header, Footer, HotelCard, CouponModal, PriceMatchBanner
│   │   ├── hooks/             # useHoverTracker (Exit-Intent 실시간 감지 커스텀 훅)
│   │   ├── pages/             # HomePage, SearchPage, HotelDetailPage, BookingPage, CouponsPage
│   │   ├── services/          # api.ts (백엔드 연동 & Mock 서비스) 및 mockData.ts
│   │   └── types/             # TypeScript 인터페이스 스키마
│   ├── package.json           # Port: 5100 설정
│   ├── vite.config.ts
│   └── README.md
│
├── ⚙️ backend/               # Microservices Monorepo & AI Pipeline
│   ├── packages/
│   │   ├── ingestion-api/     # Fastify 고성능 이벤트 수집 API (:4000)
│   │   ├── decision-api/      # 실시간 개입 의사결정 API (:4001)
│   │   ├── stream-worker/     # Redis Stream Consumer & Google Gemini AI 룰 엔진
│   │   ├── dashboard-api/     # OLAP 분석 & 대시보드 API (:4002)
│   │   ├── data-science/      # Python 임계치 ML 분석 모델 API (:8000)
│   │   └── simulator/         # 사용자 행동 트래픽 시뮬레이터
│   ├── notebooks/             # 행동 데이터셋 분석 & A/B 테스트 지표 도출 (Jupyter)
│   └── docker-compose.yml     # 백엔드 마이크로서비스 일괄 실행 환경
│
├── 🚀 docker-compose.yml     # 풀스택(FE + BE) 통합 Docker 인프라 실행 환경
├── 📄 package.json           # 모노레포 스크립트
└── 📘 README.md              # 메인 포트폴리오 안내 문서
```

---

## ⚡ 4. 시스템 실행 방법 (Quick Start)

### 1) 프론트엔드 전용 실행 (React SPA / Port: 5100)
```bash
cd frontend
npm install
npm run dev
```
👉 브라우저에서 `http://localhost:5100` 접속 후 사용 가능합니다.
* **이탈 감지 테스트**: 마우스 커서를 브라우저 주소창 위로 빠르게 이동하거나 상단 **[이탈감지 시뮬레이션]** 버튼을 클릭하세요!

### 2) 백엔드 마이크로서비스 통합 실행 (Docker Compose)
```bash
# 루트 디렉토리에서 실행
docker compose up -d
```
👉 Ingestion API (`:4000`), Decision API (`:4001`), Dashboard API (`:4002`), Redis (`:6379`), PostgreSQL (`:5432`), ClickHouse (`:8123`)가 자동 서비스됩니다.

---

## 🔌 5. 백엔드 서비스 포트 명세 (Service Ports)

| 서비스 명 | 포트 번호 | 사용 언어 / 기술 | 주요 역할 및 엔드포인트 |
|---|---|---|---|
| **Frontend Web** | `5100` | TypeScript / React 18 | HoverStay SPA 프론트엔드 |
| **Ingestion API** | `4000` | TypeScript / Fastify | `POST /events` - 유저 행동 이벤트 수집 |
| **Decision API** | `4001` | TypeScript / Express | `POST /decisions` - 실시간 개입 의사결정 반환 |
| **Dashboard API** | `4002` | JavaScript / Node.js | `GET /analytics` - OLAP 분석 통계 대시보드 API |
| **Model API** | `8000` | Python / FastAPI | Python 기반 이탈 임계치 추론 API |
| **Redis** | `6379` | C / Redis 7 | Redis Streams 메시지 브로커 |
| **ClickHouse** | `8123` / `9000` | C++ / ClickHouse | 실시간 이벤트 OLAP 분석 데이터베이스 |
| **PostgreSQL** | `5432` | C / PostgreSQL 16 | 회원/숙소 메타데이터 저장소 |

---

## 📜 6. 라이선스 (License)

This project is licensed under the MIT License - see the `LICENSE` file for details.
