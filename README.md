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

Mock decision UI without the backend decision-api:

```text
http://localhost:3000/packages/demo-site/index.html?mockDecision=1
http://localhost:3000/packages/demo-site/index.html?mockDecision=banner
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
