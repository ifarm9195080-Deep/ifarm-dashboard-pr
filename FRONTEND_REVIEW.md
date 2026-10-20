# Frontend cleanup, code quality, and security review

Review date: 2026-10-20
Scope: `apps/web` and repository-level guidance/configuration relevant to it.
Review branch/commit: `main` at `c7a62f6` (`chore: save latest iFarm progress`).

## 1. Scope and baseline

The repository root is `/run/media/dany0x/DAN-CODEEK/ifarm-dashboard-project`. `AGENTS.md` and `ARCHITECTURE.md` were read before editing. This is a React 19, TypeScript, Vite 6 single-page frontend under `apps/web`, with npm and `apps/web/package-lock.json`. The root workspace contains no API, mobile app, shared package, or deployment/reverse-proxy configuration. The architecture document describes a future NestJS API, custom authentication, and separate mobile app; those are requirements, not implemented services in this repository.

Routes are selected in `apps/web/src/App.tsx`: `/`, `/dashboard`, `/dashboard/login`, `/store`, `/ai`, with unknown paths rendering the home page. Components and inline localization are in `App.tsx`, `src/components/SectionLabel.tsx` is the other React component, and styles are in `src/styles.css`. Entry points are `src/main.tsx` and `index.html`. Vite serves `public/assets`; source imagery is under `source-assets/` and is excluded from normal public serving/build copying.

The baseline Git working tree was clean on `main`; there were no modified or untracked user files to preserve. Git history is available, so no separate recovery copy was necessary. Baseline checks were run before editing:

| Command | Exit | Result |
|---|---:|---|
| `git status --short --branch` | 0 | `## main` |
| `git rev-parse --short HEAD` | 0 | `c7a62f6` |
| `npm run` (from `apps/web`) | 0 | Only `dev`, `build`, and `preview` scripts exist; no lint, format, test, or typecheck script. |
| `npm run build` (from `apps/web`) | 0 | TypeScript build and Vite production build passed; Vite 6.4.4 built 30 modules. Initial JS chunk 279.40 kB (85.12 kB gzip), CSS 60.37 kB (12.81 kB gzip). |
| `npx tsc -b --pretty false` (from `apps/web`) | 0 | No diagnostics. |
| `npx eslint . --max-warnings 0` (from `apps/web`) | 2 | ESLint 10.13.0 could not find `eslint.config.*`; source was not linted. |
| `npx prettier --check .` (from `apps/web`) | 1 | Existing formatting warnings in source and generated `dist` files. No formatting changes made. |
| `npm audit` (from `apps/web`, registry access allowed) | 0 | `found 0 vulnerabilities`. |

`npm audit` initially failed in the restricted environment with registry DNS `EAI_AGAIN`; the same check was rerun with registry access and passed. There is no `test` script; `npm test` exits 1 with `Missing script: "test"`. No test suite exists to run. `gitleaks` is unavailable. No production site URL or deployment headers configuration is present.

## 2. Cleanup and consolidation manifest

`PERFORMANCE.md:18` says all 19 production assets are referenced and that original/unreferenced source images are intentionally preserved outside the bundle. Current source inspection confirms dynamic locale-selected image paths and responsive `srcSet`/CSS background references. Asset references were checked in `src/App.tsx`, `src/styles.css`, `index.html`, build config, and repository documentation. No `public/assets` file was removed.

| Path / group | Category | Reason and reference checks | Canonical replacement | Recovery | Decision |
|---|---|---|---|---|---|
| `public/assets/**` (19 image files) | Runtime assets | Referenced by JSX, locale branches, `srcSet`, or CSS; also documented as used in `PERFORMANCE.md:18`. | None needed | Tracked at baseline commit. | Retain |
| `source-assets/originals/**` (7 files) | Source artwork | Not runtime assets; kept as source-quality inputs. Search found no app runtime path use. Project keeps these separate from deployable assets. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/agricultural-advertisement.jpg` (211,158 bytes) | Source artwork | No app runtime references; retained as source archive per `PERFORMANCE.md:18` convention. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/background.jpg` (193,554 bytes) | Source artwork; exact duplicate | No app runtime references. Hash matches `source-assets/unreferenced/localized/ar/home-hero.jpg`; both archive paths retained because naming/context may be meaningful to design workflows. | Same bytes as the localized path, but no safe archive-path consolidation evidence. | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/ifarm-smart-system-advertisement.jpg` (226,042 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/ifarm-source.png` (2,702,933 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/localized/ar/home-hero.jpg` (193,554 bytes) | Source artwork; exact duplicate | No app runtime references. Exact MD5 duplicate of `background.jpg`; do not remove either archive entry without owner confirmation. | Same bytes as `background.jpg`, but not consolidated. | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/localized/ar/smart-system.jpg` (439,364 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/localized/en/home-hero.jpg` (376,316 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/localized/en/smart-system.jpg` (476,917 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/signin-botanical.webp` (33,646 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/who-we-are/ar-1200.webp` (127,512 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |
| `source-assets/unreferenced/who-we-are/ar-640.webp` (49,106 bytes) | Source artwork | No app runtime references; retained as source archive. | None | Tracked at baseline commit. | Retain |

Image SHA-256/MD5 inspection found exactly one byte-identical pair in the scanned image set: the two 193,554-byte archive files above (MD5 `81a3e035c8c93d50f380c4d83e308e`). Other responsive variants differ and remain intentional. Files removed: **0**. Source-storage bytes reclaimed: **0**. Bundle-size change attributable to cleanup: **none** (no assets removed or rewritten).

## 3. Changes made

Only `apps/web/src/App.tsx` was changed:

- Added `readSavedLocale` / `saveLocale` so unavailable or denied browser storage falls back to English and does not break locale switching. Locale is the only value persisted; no auth token or personal data is stored there.
- Moved email syntax validation into one shared helper used by both existing forms. Existing required-field and user-facing messages remain unchanged.
- Added protocol validation to the shared `AppLink` click handler before modifier-key, download, and new-tab bypasses. Malformed URLs and non-HTTP(S) schemes are prevented; current internal links and external HTTP(S) behavior remain intact. All current route targets are constants.
- Removed unused authentication-error state and translations that could never be populated because the login page has no authentication request. Existing message still explicitly says authentication is not connected and the user was not signed in.

No assets, dependencies, routes, styles, or package scripts were changed. No tests were added because the package has no test runner/script and the changes are small; runtime browser verification was attempted but blocked as recorded below.

## 4. Clean-code checklist

| ID | Requirement | Applicability | Initial finding | Action taken | Verification method | Evidence | Final status |
|---|---|---|---|---|---|---|---|
| CQ-01 | Dead code | Applicable | Login auth-error state/copy was never set; no backend request exists. | Fixed: removed unreachable state/type/copy. | TypeScript/build and reference review. | `src/App.tsx:435–478`; `npm run build` exit 0. | PASS |
| CQ-02 | Naming | Applicable | Names reviewed; no materially misleading names identified. | Not changed. | Call-site and exported-symbol review. | Localized frontend; no public module exports beyond `App`. | PASS |
| CQ-03 | Responsibilities | Applicable | Components include localized UI and local form validation; no unrelated API/business service is mixed in because no API exists. | Not changed; no concrete split was justified. | Source review. | `src/App.tsx`; no fetch/XHR/API client found. | PASS |
| CQ-04 | Duplication | Applicable | The same email syntax expression appeared in two forms. | Fixed: shared `isValidEmail`. | TypeScript/build and reference review. | `src/App.tsx:8–10,363,399`; both callers compile. | PASS |
| CQ-05 | State/data flow | Applicable | Locale was written once in the setter and again in an effect; storage exceptions could interrupt initial render/change. | Fixed redundant write and wrapped read/write; runtime state transitions could not be exercised. | Source/build; browser unavailable. | `src/App.tsx:11–25,505–541`. | BLOCKED |
| CQ-06 | Side effects/async | Applicable | `popstate` listener has cleanup; no requests/timers/subscriptions are implemented. | Not changed. | Effect cleanup review; browser navigation not exercised. | `src/App.tsx:527–534`; browser verification blocked. | BLOCKED |
| CQ-07 | Error handling | Applicable | Storage errors were uncaught; forms do not submit and explicitly report that limitation. | Fixed storage failure path; no catch-all errors added. | TypeScript/build; storage-disabled browser scenario unavailable. | `src/App.tsx:11–25,376,397`. | BLOCKED |
| CQ-08 | Async data states | Not applicable | No asynchronous API/data-loading feature exists. | Not changed. | `rg` source scan for `fetch`, `XMLHttpRequest`, subscriptions. | No API request path found in frontend source. | NOT APPLICABLE — no asynchronous data feature exists. |
| CQ-09 | Input handling | Applicable | Required checks and email syntax checks exist; no backend validation boundary exists. | Consolidated email check; did not invent phone/business validation rules. | Build and source review; valid/invalid/boundary interaction could not be browser-tested. | `src/App.tsx:353–379,390–401,444–452`. | BLOCKED |
| CQ-10 | Types/contracts | Applicable | Strict TypeScript, `noUnusedLocals`, `noUnusedParameters`, and no API contracts. | Not changed beyond removing dead auth state. | `npx tsc -b --pretty false` and production build. | Both exit 0. | PASS |
| CQ-11 | Styles/selectors | Applicable | Styles are a large existing stylesheet; visual/mobile inspection was unavailable. | Not changed. | Prettier and build; browser launch attempted. | `src/styles.css`; `npx prettier --check ...` reports pre-existing format warnings. | BLOCKED |
| CQ-12 | Semantics/accessibility | Applicable | Labels, button types, status regions, and password toggle accessible name are present in source. | No semantic changes. | Source inspection only; keyboard/browser check unavailable. | `src/App.tsx:378,422–424,490–497`. | BLOCKED |
| CQ-13 | Config/dependencies | Applicable | No lint/test scripts or ESLint config; npm audit clean. | No tooling/dependency changes to avoid introducing a new toolchain. | npm scripts, eslint, npm audit. | ESLint exits 2 for missing config; `npm audit` reports 0 vulnerabilities. | FAIL — lint configuration/check is absent. |
| CQ-14 | Comments/docs | Applicable | Project docs correctly state source assets are retained and inquiry/auth flows are unconnected. | Added a short comment explaining the storage fallback. No docs contradicted by code changes. | Documentation and source review. | `PERFORMANCE.md:18`; `src/App.tsx:20–25`. | PASS |
| CQ-15 | Controls/navigation | Applicable | Nav, language switch, forms, password visibility, phone/external links, and placeholder routes exist. | Shared link handler now blocks unsafe schemes; no controls removed. | Source inventory and HTTP route requests; interactions not browser-tested. | Local Vite returned HTTP 200 for `/`, `/dashboard`, `/dashboard/login`; browser verification blocked. | BLOCKED |
| CQ-16 | Appropriate verification | Applicable | No test script/framework. Build/type checks available; browser unavailable. | No test framework added. | Build, type check, audit, lint, prettier, HTTP route responses. | Build/type pass; lint config missing; format check fails on existing files; no tests script. | BLOCKED |

## 5. Frontend security checklist

| ID | Requirement | Applicability | Initial finding | Action taken | Verification method | Evidence | Final status |
|---|---|---|---|---|---|---|---|
| SEC-01 | Exposed secrets | Applicable | No tracked `.env`/secret-named file; `gitleaks` unavailable. A filename-only heuristic scan of app source, lockfile, HTML, Vite config, and production bundle found no likely credential pattern. | No secret values printed; no rotation needed based on this limited scan. | `git ls-files` env-like path scan; redacted-pattern `rg -l`; tool availability. | No matching file paths/output; `gitleaks unavailable`. This is not a full history or secret scan. | BLOCKED |
| SEC-02 | XSS/unsafe rendering | Applicable | No user data is sent to a server or rendered as HTML; visible values use React text rendering. No unsafe HTML/eval sink found in `src`. | No sanitization dependency added; no rich HTML feature exists. | Source-to-sink review and production build. | No `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, or `new Function` call in app source; no API response path. | PASS — limited to implemented frontend flows. |
| SEC-03 | URL/redirect handling | Applicable | `AppLink` accepted a generic string and relied on same-origin routing after a click; non-HTTP schemes were not explicitly rejected. Current caller values are hard-coded. | Fixed protocol and parse validation before navigation bypasses. | Build and source review; click/payload runtime test blocked. | `src/App.tsx:128–145`; only current external link is the fixed `https://www.ifarm.com`. | BLOCKED — runtime exploit-case validation unavailable. |
| SEC-04 | Browser storage/sensitive data | Applicable | Only `ifarm-locale` is stored in localStorage. Login values stay in component state; no tokens or auth session handling. | Wrapped locale storage failure; no auth design change. | Search and source review. | `src/App.tsx:11–25,505–541`; no sessionStorage or token storage references. | PASS — no sensitive value is persisted in implemented flows. |
| SEC-05 | Auth/authorization boundaries | Applicable | Login screen is UI-only and says auth is not connected. No backend exists here. | Removed unpopulated fake server-error state; no client guard presented as authorization. | Source review; backend not in repository. | `src/App.tsx:460–503`; `ARCHITECTURE.md` specifies future NestJS server-side authorization. | BLOCKED — server enforcement is outside this frontend workspace. |
| SEC-06 | Requests/CSRF | Not applicable | No API requests, credential cookies, or cookie-authenticated mutation exists in this frontend. | No CSRF mechanism added to a disconnected form. | Search source for fetch/XHR/request clients and cookie access. | No request client/cookie auth path found. | NOT APPLICABLE — no authenticated requests/cookie auth exist. |
| SEC-07 | Untrusted API/external data | Not applicable | No API integration or external data parsing exists. | No schema/dependency added without a boundary. | Source search for request/response paths. | No `fetch`, `XMLHttpRequest`, or API client path found. | NOT APPLICABLE — no API response boundary exists. |
| SEC-08 | Dependencies/scripts/SRI | Applicable | Full lockfile audit is clean. No third-party script or iframe exists. Google Fonts CSS is loaded from `fonts.googleapis.com` without SRI. | No third-party code added. Left vendor CSS unchanged; pinning it without confirming a stable response could break font loading. | `npm audit`; inspect `index.html`. | `npm audit` exit 0: `found 0 vulnerabilities`; `index.html:8–10` has two preconnect hints and one Google Fonts stylesheet link; no third-party script. | BLOCKED — advisory scan passed; CDN stylesheet integrity strategy remains unverified. |
| SEC-09 | Headers/deployment | Applicable | No production proxy/deployment config or site URL in this repo. Local Vite responses do not include CSP, frame, or transport security headers. | Not changed; deployment owner/config is outside workspace. | `curl -sS -I` on local Vite routes. | All three returned HTTP 200; observed headers were Vary, Content-Type, Cache-Control, Etag, Date, Connection, Keep-Alive. No CSP, X-Frame-Options, Referrer-Policy, or HSTS in the local dev response; this does not establish production headers. | BLOCKED |
| SEC-10 | Cross-window communication | Not applicable | No `postMessage`, popup, or iframe usage. | None. | Source search. | No matching message handlers/calls or iframe markup. | NOT APPLICABLE — no cross-window communication exists. |
| SEC-11 | File handling | Not applicable | No upload, import, preview, or download feature exists. | None. | UI/source inventory. | No file input or file-handling code in implemented routes. | NOT APPLICABLE — no file feature exists. |
| SEC-12 | Debug/info exposure | Applicable | No console logging found. Production bundle source maps are disabled/not emitted in current build. | No change needed. | Source scan and `find dist -type f -name '*.map' -print`. | No console logging calls found; source-map command printed no paths. `npm run build` completed. | PASS — current frontend build only; no claim about server logs. |

### Security findings

| ID | Severity | Confidence | Location | Attack preconditions | Impact | Fix | Verification | Remaining limitation |
|---|---|---|---|---|---|---|---|---|
| SEC-03 | Low (defense-in-depth) | High | `apps/web/src/App.tsx:128–145` | A future caller passes an attacker-controlled `href` to `AppLink`. No such caller exists now. | A dangerous URL scheme could otherwise execute or navigate unexpectedly. | Fixed by requiring parseable HTTP(S) URLs before default navigation behavior. | TypeScript/production build passed; source reviewed. | Browser click test could not run, so runtime prevention remains unverified. |
| SEC-08 | Low | High | `apps/web/index.html:8–10` | A third-party stylesheet response is compromised or changed. | Vendor CSS can alter page presentation and requests external font resources; this is not a third-party executable script. | Deferred: keep existing vendor font loading to preserve design; consider self-hosting reviewed font files or a stable integrity strategy. | `npm audit` clean; markup inspected. | npm audit does not scan the remote Google Fonts CSS service. |
| SEC-09 | Medium pending deployment evidence | High that local Vite lacks headers; unknown for production | Deployment/reverse proxy is not present; local Vite responses | Production hosting serves the app without suitable response headers. | Missing CSP/frame/referrer/transport controls could weaken defense in depth. | Deferred to actual deployment configuration; do not infer production state from Vite. | Local route response headers captured. | No deployed URL or production config available. |
| SEC-01 | Unrated pending scan | Low | Current tracked app files and bundle | A credential exists outside the limited heuristic patterns or in Git history. | Potential credential exposure. | Deferred: run an approved secret scanner over repository/history in CI; rotate only if a real credential is found. | `gitleaks` unavailable; heuristic path-only scan had no matches. | No complete secret scan or history scan. |

No confirmed exploitable XSS, credential disclosure, or backend authorization flaw was identified in the inspected frontend. This does not establish backend security or production readiness.

## 6. Verification after changes

| Exact command | Exit | Result |
|---|---:|---|
| `npm run build` (from `apps/web`) | 0 | Vite production build passed; 30 modules transformed. Final JS 279.02 kB (85.02 kB gzip), CSS 60.37 kB (12.81 kB gzip). |
| `npx tsc -b --pretty false` (from `apps/web`) | 0 | No diagnostics. |
| `npx eslint . --max-warnings 0` (from `apps/web`) | 2 | Still blocked by missing `eslint.config.*`; no lint results. |
| `npx prettier --check src/App.tsx src/main.tsx src/components/SectionLabel.tsx src/styles.css index.html vite.config.ts` (from `apps/web`) | 1 | Existing formatting warnings in all six checked files. No formatter write was run. |
| `npm test` (from `apps/web`) | 1 | No `test` script. |
| `npm audit` (from `apps/web`, registry access allowed) | 0 | `found 0 vulnerabilities`. |
| `git diff --check` | 0 | No whitespace errors. |
| `curl -sS -I http://127.0.0.1:5173/` and same for `/dashboard`, `/dashboard/login` | 0 | Each local Vite route returned HTTP 200 and the SPA HTML response. These are route-serving checks, not browser interaction tests. |
| `find dist -type f -name '*.map' -print` (from `apps/web`) | 0 | No paths printed. |

Baseline and final build/type results both pass. No failure was introduced by the code changes. Lint and formatting issues were pre-existing; lint cannot run without a config, and the formatter reports existing style differences. Dependency audit passed after registry access was allowed. No tests were run because no test script exists.

Browser verification was attempted at a fixed 1440×1000 viewport with headless Firefox. The exact command `firefox --headless --no-remote --profile /tmp/ifarm-review-firefox --window-size 1440,1000 --screenshot /tmp/ifarm-review-home.png http://127.0.0.1:5173/` exited 1 with `Could not find profile folder`. A subsequent default-profile attempt exited 0 but reported `Firefox is already running, but is not responding`; it produced no screenshot. No screenshot or interaction result is claimed. Visual comparison, keyboard flow checks, storage-disabled behavior, invalid-link click behavior, and form interactions remain BLOCKED. Local HTTP route checks and production build are the available runtime evidence.

## 7. Remaining work and recovery

- Add/configure an ESLint setup and a package script before relying on lint results.
- Decide whether the project wants formatting normalized; avoid a broad formatting-only diff in this review.
- Run browser interaction/visual checks in a working browser environment, especially locale persistence with storage disabled and dangerous URL rejection.
- Run a secret scanner across the full repository/history in CI; the local heuristic scan is not conclusive.
- Verify CSP, framing, referrer, MIME, and HSTS headers at the actual deployment edge. The repository does not define that edge.
- Keep the current marketing/login form messages until real API/auth flows are implemented; server validation, CSRF, tenant authorization, and cookie flags remain backend responsibilities.
- Asset recovery is unnecessary because no files were deleted. Code changes are confined to tracked `apps/web/src/App.tsx`; the baseline version is in commit `c7a62f6`. `git diff` contains the complete review patch.

No deployment, publication, dependency upgrade, database operation, or destructive Git operation was performed.
