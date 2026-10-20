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

- `npm run typecheck` — TypeScript project check
- `npm run format` / `npm run format:check` — format or check source formatting
- `npm run build` — typecheck and create the production bundle

## Structure

- `apps/web/src` — application and styles
- `apps/web/public/assets` — published images
- `apps/web/source-assets` — retained source images
- `docs` — architecture, planning, review, and deployment notes

`VITE_API_BASE_URL` is reserved for a future API connection. Do not add secrets or credentials to
frontend environment variables. To validate the current frontend, run `npm run typecheck && npm run
build` from `apps/web`.
