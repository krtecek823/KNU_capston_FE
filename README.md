# HoverStay Demo — 실행 가이드

## 한 번에 전체 실행 (권장)

**사전 요구사항:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치 및 실행

```bash
git clone -b Fastly https://github.com/krtecek823/KNU_capston_FE.git
cd KNU_capston_FE
docker compose up -d
```

브라우저에서 → **http://localhost:3000**

---

## 실행되는 서비스

| 서비스 | 주소 | 설명 |
|--------|------|------|
| 호텔 데모 사이트 | http://localhost:3000 | 프론트엔드 |
| Ingestion API | http://localhost:4000 | 이벤트 수집 |
| Decision API | http://localhost:4001 | 개입 결정 |
| Dashboard API | http://localhost:4002 | 분석 대시보드 |

---

## 쿠폰 모달 동작 확인

1. http://localhost:3000 접속
2. 호텔 상세 페이지에서 호텔 이름 텍스트 드래그 → Ctrl+C
3. 약 4초 이내에 쿠폰 모달 자동 등장
4. "쿠폰 받기" 클릭 → 예약 페이지에서 10% 추가 할인 자동 적용

---

## 종료

```bash
docker compose down
```
