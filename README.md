# KNU Capston FE1 Integration

This branch integrates the FE2 demo hotel site, the FE3 admin dashboard, and new FE1-owned tracking/widget SDK packages.

## Structure

- `packages/demo-site`: FE2 static hotel booking demo site.
- `packages/admin-dashboard`: FE3 Next.js dashboard with Dashboard API fallback support.
- `packages/tracking-sdk`: browser event collection SDK.
- `packages/widget-sdk`: Shadow DOM intervention widget SDK.
- `docs/api-spec.md`: backend API contracts referenced from `amblergonz/knu_gcp_capston_6`.

## Run

Demo site from the repository root:

```bash
npx http-server . -p 3000 -c-1
```

Open:

```text
http://localhost:3000/packages/demo-site/index.html
```

## Demo Intervention Flows

Backend branches checked: `main`, `be-a/thresholds-pr-1`, `be-a/thresholds-pr-2`, and `be-c/worker`.

- `main`: documents S1 as `cart.count >= 1` plus tab hidden for N seconds, and S2 as hotel/room clipboard copy or multi-tab comparison.
- `be-a/thresholds-pr-1`: sets S1 `cart_min_count: 1`, `tab_hidden_seconds: 10`, `intent_score_min: 0.6`; S2 weights remain domain defaults.
- `be-a/thresholds-pr-2`: adds final S2 thresholds: clipboard copy or broadcast multi-tab, `intent_score_min: 0.5`, with clipboard and broadcast weights at `0.4` each.
- `be-c/worker`: consumes those thresholds. S1 fires `coupon_modal` when `cart_count >= 1`, `hidden_for_seconds >= 10`, and `intent_score >= 0.6`. S2 fires `price_match_banner` when `clipboard_copy_match` or `broadcast_channel_multi_tab` is true and `intent_score >= 0.5`.

To trigger S1 coupon modal in the demo:

1. Open a hotel detail page such as `packages/demo-site/mapo.html`.
2. Click a room card, `이 객실 선택`, or a `예약하기` button. The demo sends `add_to_cart` and `cart_change(count: 1)`.
3. Switch to another tab or hide the page, then return. The demo sends `visibility_change`, `page_lifecycle`, and a demo comparison `broadcast_channel` signal so the BE-C worker can satisfy the S1 threshold quickly.

To trigger S2 price-match banner:

1. On a hotel detail page, click the share/copy control with `data-hover-copy`, or select a hotel/room name and copy it.
2. The demo sends `clipboard_copy` with hotel/room text plus `broadcast_channel(tab_count: 2)`.
3. The widget appears after the worker produces `/decision/:session_id`.

Mock-only UI check:

```text
http://localhost:3000/packages/demo-site/index.html?mockDecision=1
http://localhost:3000/packages/demo-site/index.html?mockDecision=1&mockWidget=banner
```

Admin dashboard:

```bash
corepack pnpm --dir packages/admin-dashboard install --frozen-lockfile
corepack pnpm --dir packages/admin-dashboard dev --port 3001
```

Optional backend API environment:

```bash
set NEXT_PUBLIC_DASHBOARD_API=http://localhost:4002
```
