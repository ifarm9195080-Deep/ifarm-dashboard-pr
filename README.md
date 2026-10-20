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

Set `VITE_API_BASE_URL` in an ignored local `.env` file for API integration. `.env.example` contains
the variable name only. Never put secrets or credentials in frontend environment variables. Run
`npm run validate` from `apps/web` for the complete frontend validation gate.
