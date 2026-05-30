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
  "app_id": "hoverstay-demo-site",
  "device": "desktop",
  "events": [
    {
      "event_id": "uuid",
      "session_id": "hover-session",
      "user_id": "anon-user",
      "app_id": "hoverstay-demo-site",
      "ts": "2026-05-31T00:00:00.000Z",
      "event_type": "visibility_change",
      "type": "visibility_change",
      "page_url": "http://localhost:3000/packages/demo-site/index.html",
      "referrer": "",
      "device": "desktop",
      "payload": {}
    }
  ]
}
```

## Decision API

- Base URL: `http://localhost:4001`
- `POST /decide`
- Used by: `packages/tracking-sdk`, `packages/widget-sdk`, `packages/demo-site/hover-client.js`
- Purpose: request S1/S2 intervention decisions for the current session.

Request shape:

```json
{
  "session_id": "hover-session",
  "user_id": "anon-user",
  "scenario_id": "S1",
  "context": {
    "hotel_name": "Grand Mapo Hotel",
    "room_name": "Deluxe Room"
  }
}
```

Response shape expected by FE1:

```json
{
  "intervention_id": "uuid",
  "session_id": "hover-session",
  "scenario_id": "S1",
  "ab_group": "treatment",
  "widgets": [
    {
      "type": "coupon_modal",
      "duration_ms": 5000,
      "data": {
        "hotel_name": "Grand Mapo Hotel",
        "room_name": "Deluxe Room",
        "discount_percent": 5,
        "cta_text": "Apply coupon"
      }
    }
  ]
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
