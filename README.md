# iFarm Dashboard

Frontend-only monitoring dashboard and agricultural development website. The web app lives in
`apps/web` and uses React, TypeScript, and Vite. There is no production API in this repository.

## Setup

```sh
cd apps/web
npm ci
npm run dev
```

## Scripts

- `npm run lint` — ESLint checks
- `npm run typecheck` — TypeScript project check
- `npm run format` / `npm run format:check` — format or check source formatting
- `npm run test` — Vitest unit tests
- `npm run test:e2e` — Chromium Playwright tests
- `npm run build` — typecheck and create the production bundle
- `npm run validate` — lint, typecheck, format, unit tests, build, and high severity audit

## Structure

- `apps/web/src` — application and styles
- `apps/web/public/assets` — published images
- `apps/web/source-assets` — retained source images
- `docs` — architecture, planning, review, and deployment notes

Local development uses a development-only MSW mock by default; leave `VITE_API_BASE_URL` unset.
Copying `.env.example` does not set an API URL. Set `VITE_API_BASE_URL` in an ignored local `.env`
only when intentionally connecting to a running API configured for this app's origin and
credentials. A configured API URL disables MSW because its service worker cannot intercept
cross-origin requests. Never put secrets or credentials in frontend environment variables. Run
`npm run validate` from `apps/web` for the complete frontend validation gate.
