# Backend API Spec Reference

This FE1 branch only consumes the backend API contracts from `amblergonz/knu_gcp_capston_6`.

## Ingestion API

- Base URL: `http://localhost:4000`
- `POST /events`
- Used by: `packages/tracking-sdk`
- Purpose: batch browser behavior events into the backend event stream.

Request shape used by FE1:

```json
{
  "session_id": "hover-session",
  "user_id": "anon-user",
  "device": "desktop",
  "events": [
    {
      "event_id": "uuid",
      "ts": 1780123456789,
      "type": "visibility_change",
      "page_url": "http://localhost:3000/packages/demo-site/index.html",
      "referrer": "",
      "payload": { "hidden": true }
    }
  ]
}
```

## Decision API

- Base URL: `http://localhost:4001`
- `GET /decision/:session_id`
- Used by: `packages/tracking-sdk`, `packages/widget-sdk`, `packages/demo-site/hover-client.js`
- Purpose: request S1/S2 intervention decisions for the current session.

Request:

```http
GET /decision/hover-session
```

Response shape expected by FE1:

```json
{
  "intervention_id": "uuid",
  "session_id": "hover-session",
  "scenario_id": "S1",
  "ab_group": "treatment",
  "component": "coupon_modal",
  "copy": {
    "title": "Before you go",
    "body": "Complete this booking now and keep the current benefit.",
    "cta": "Get coupon"
  },
  "context": {
    "hotel_name": "Grand Mapo Hotel",
    "discount_percent": 10
  },
  "ttl_seconds": 600,
  "intent_score": 0.8,
  "active_boosters": ["hidden_repeated"],
  "copy_source": "fallback"
}
```

## Dashboard API

- Base URL: `http://localhost:4002`
- Used by: `packages/admin-dashboard`

Endpoints:

- `GET /signals/coverage`
- `GET /scenarios/firings?from={unix_ms}&to={unix_ms}`
- `GET /ab/results?scenario=S1`
- `GET /stream/live`

The dashboard reads `NEXT_PUBLIC_DASHBOARD_API` and falls back to mock data when the API is unavailable.
