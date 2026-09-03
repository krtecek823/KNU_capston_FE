# 🏨 HoverStay (AI 실시간 마케팅 개입 & 이탈 방지 스테이 플랫폼)

> **호텔 예약 사이트에서 손님이 다른 탭/사이트로 이탈하기 전, 마우스 행동(Exit-Intent) 및 체류 신호를 실시간 감지하여 AI 기반 최저가 보장 및 시크릿 할인 혜택을 동적으로 제공하는 Enterprise MarTech 풀스택 모노레포입니다.**

<p align="left">
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_v5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Redis_Streams-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/ClickHouse-FFCC00?style=for-the-badge&logo=clickhouse&logoColor=black" alt="ClickHouse" />
</p>

---

## 📋 1. 프로젝트 개요 (Overview)

HoverStay는 단순한 숙소 예약 사이트 역할을 넘어, **실시간 사용자 행동 이벤트 스트리밍, AI 룰 엔진(Google Gemini), 대용량 OLAP 분석(ClickHouse)**이 통합된 마케팅 테크(MarTech) 플랫폼입니다.

* **핵심 해결 과제**: 사용자가 타사(아고다, 부킹닷컴 등)로 가격 비교를 하러 이탈하는 타이밍을 1.5초 이내에 포착하여, 맞춤형 혜택(15% 시크릿 할인 쿠폰 / 최저가 보장제)을 제시함으로써 **구매 전환율(CVR)을 극대화**합니다.
* **아키텍처 스코프**: React 18 + TypeScript SPA 프론트엔드부터 Fastify + Redis Streams + Gemini AI 백엔드 마이크로서비스까지 완벽하게 분리/연동된 모노레포 구조입니다.

---

## ✨ 2. 핵심 기술 특징 (Key Features)

### 🎯 1) `useHoverTracker` Custom Tracking Engine (Front-end)
* **Exit-Intent Detection**: 마우스 커서가 브라우저 상단 영역(`clientY <= 15px`)으로 이동하는 이탈 의도를 감지하여 서프라이즈 할인 모달(`CouponModal`)을 다이내믹 팝업.
* **비동기 이벤트 배치(Batch) 처리**: UI 지연(Stuttering)을 방지하기 위해 이벤트를 큐(Queue)에 적재 후 백그라운드 비동기 수신 전송.
* **SPA Route Tracking**: React Router 페이지 이동 시 `page_view` 행동 이벤트를 자동 기록.

### ⚡ 2) Redis Streams & Fastify Event Ingestion Pipeline (Back-end)
* 초당 수천 건의 유저 행동 이벤트를 지연 없이 수신하기 위해 **Fastify API + Redis Streams 비동기 큐**를 채택.
* 백그라운드 `stream-worker` 서비스가 실시간 이벤트를 컨슘(Consume)하여 룰 엔진 실행.

### 🤖 3) Google Gemini AI (gemini-2.5-flash) 문맥 기반 룰 엔진
* 유저의 체류 시간, 검색 키워드, 스크롤 깊이 문맥을 **Google Gemini AI LLM**이 실시간 평가하여 최적의 설득 문구 및 혜택을 동적으로 생성.

### 📊 4) ClickHouse 대용량 OLAP 행동 로그 분석
* 대용량 실시간 행동 데이터를 OLAP DB(**ClickHouse**)에 저장하여 A/B 테스트 전환율 및 시나리오별 성과 지표를 실시간 통계 분석.

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
│   ├── Dockerfile             # Nginx 프론트엔드 컨테이너 빌드
│   └── README.md
│
├── ⚙️ backend/               # Microservices Monorepo & AI Pipeline
│   ├── packages/
│   │   ├── ingestion-api/     # Fastify 고성능 이벤트 수집 API (:4000)
│   │   ├── decision-api/      # 실시간 개입 의사결정 API (:4001)
│   │   ├── stream-worker/     # Redis Stream Consumer & Google Gemini AI 룰 엔진
│   │   ├── dashboard-api/     # OLAP 분석 & 대시보드 API (:4002)
│   │   ├── data-science/      # Python 임계치 ML 분석 모델 API (:8000)
│   │   ├── simulator/         # 사용자 행동 트래픽 시뮬레이터
│   │   └── shared/            # 공통 스키마 및 환경설정
│   ├── notebooks/             # 행동 데이터셋 분석 & A/B 테스트 지표 도출 (Jupyter)
│   ├── docs/                  # API 규격서 및 아키텍처 명세서
│   └── docker-compose.yml     # 백엔드 마이크로서비스 일괄 실행 환경
│
├── 🚀 docker-compose.yml     # 풀스택(FE + BE) 통합 Docker 인프라 실행 환경
├── 📄 package.json           # 루트 모노레포 명령어 스크립트
└── 📘 README.md              # 메인 포트폴리오 안내 문서
```

---

## 🛠️ 4. 기술 스택 (Tech Stack)

| 영역 | 기술 스택 | 비고 |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React | SPA 라우팅, 반응형 UI, 커스텀 이벤트 수집 엔진 |
| **Backend API** | Node.js, Fastify, Express | 고성능 REST API & 비동기 파이프라인 |
| **Message Queue** | Redis Streams (Redis 7) | 실시간 행동 이벤트 메시지 큐 |
| **Database** | PostgreSQL 16, ClickHouse | RDBMS(메타데이터) + OLAP DB(행동 분석) |
| **AI / ML** | Google Gemini AI (gemini-2.5-flash), Python, FastAPI | 실시간 문맥 기반 개입 생성 & 임계치 분석 |
| **Infra / DevOps** | Docker, Docker Compose, Nginx | 원클릭 멀티 컨테이너 오케스트레이션 |

---

## ⚡ 5. 시스템 실행 방법 (Quick Start)

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

## 🔌 6. 백엔드 서비스 포트 명세 (Service Ports)

| 서비스 명 | 포트 번호 | 주요 역할 및 엔드포인트 |
|---|---|---|
| **Frontend Web** | `5100` | HoverStay React SPA 프론트엔드 |
| **Ingestion API** | `4000` | `POST /events` - 유저 행동 이벤트 수집 |
| **Decision API** | `4001` | `POST /decisions` - 실시간 개입 의사결정 반환 |
| **Dashboard API** | `4002` | `GET /analytics` - OLAP 분석 통계 대시보드 API |
| **Model API** | `8000` | Python 기반 이탈 임계치 추론 API |
| **Redis** | `6379` | Redis Streams 메시지 브로커 |
| **ClickHouse** | `8123` / `9000` | 실시간 이벤트 OLAP 분석 데이터베이스 |
| **PostgreSQL** | `5432` | 회원/숙소 메타데이터 저장소 |

---

## 📜 7. 라이선스 (License)

This project is licensed under the MIT License - see the `LICENSE` file for details.
