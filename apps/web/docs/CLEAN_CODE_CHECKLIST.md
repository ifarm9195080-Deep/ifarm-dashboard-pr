# Clean code checklist

Statuses reflect the current repository state, not the intended end state.

| ID | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| CODE-01 | Components have focused responsibilities and files stay near 150 lines | FAIL | `src/App.tsx` is still a 1,558-line module; full feature extraction remains incomplete |
| CODE-02 | Naming is clear and consistent | PASS | Inspected `src/App.tsx`, `src/main.tsx`, and `src/components` |
| CODE-04 | Dead code is removed | BLOCKED | No dead-code tooling is installed |
| CODE-03 | Duplicated logic is minimized | BLOCKED | Some UI modules extracted, but `src/App.tsx` remains oversized |
| CODE-05 | TypeScript avoids `any` | PASS | ESLint `no-explicit-any` gate and `npm run lint` exit 0 |
| CODE-06 | Loading, empty, and error states are present | PASS | Router fallback and auth provider state in `src/app/router.tsx` and `src/features/auth/AuthProvider.tsx` |
| CODE-07 | Accessibility checks pass | PASS | Focused Playwright axe run exit 0 across home, dashboard, login, and not-found routes |
| CODE-08 | English and Arabic translations have identical keys | PASS | `src/i18n/ar.ts` uses `satisfies` keyed by `en`; Vitest parity test |
| CODE-09 | Configuration and route constants are centralized | PASS | `src/config/site.ts` |
| CODE-10 | Unit and browser tests pass | FAIL | `npm run test` exit 0 (21 tests); Playwright exit 1 (13 passed, 4 screenshot comparisons exceed 2%) |
| CODE-11 | Lint and format gates pass | PASS | `npm run lint` exit 0 with 10 security warnings; `npm run format:check` exit 0 |
| CODE-12 | CI validates the frontend | PASS | `.github/workflows/ci.yml` |
| CODE-13 | Setup and validation are documented | PASS | Root `README.md` documents setup and current available scripts |
| CODE-14 | TypeScript strictness flags are enabled | PASS | `tsconfig.app.json` enables `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` |
