# Clean code checklist

Statuses reflect the current repository state, not the intended end state.

| ID | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| CODE-01 | Components have focused responsibilities and files stay near 150 lines | FAIL | `src/App.tsx` remains a monolithic app component (over 1,900 formatted lines) |
| CODE-02 | Naming is clear and consistent | PASS | Inspected `src/App.tsx`, `src/main.tsx`, and `src/components` |
| CODE-03 | Duplicated logic is minimized | BLOCKED | Structural split and reusable UI extraction were not completed |
| CODE-04 | Dead code is removed | BLOCKED | No dead-code tooling is installed |
| CODE-05 | TypeScript avoids `any` | BLOCKED | Strict ESLint rule and full-source audit not run |
| CODE-06 | Loading, empty, and error states are present | BLOCKED | Router and async auth states are not implemented |
| CODE-07 | Accessibility checks pass | BLOCKED | Axe and Playwright dependencies are unavailable |
| CODE-08 | English and Arabic translations have identical keys | BLOCKED | Current inline dictionaries were not extracted or machine-checked |
| CODE-09 | Configuration and route constants are centralized | BLOCKED | Site constants module not created |
| CODE-10 | Unit and browser tests pass | BLOCKED | Vitest and Playwright are not installed |
| CODE-11 | Lint and format gates pass | BLOCKED | Prettier check is available; project ESLint flat config and plugins are unavailable |
| CODE-12 | CI validates the frontend | BLOCKED | CI workflow not added |
| CODE-13 | Setup and validation are documented | PASS | Root `README.md` documents setup and current available scripts |
| CODE-14 | TypeScript strictness flags are enabled | PASS | `tsconfig.app.json` enables `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` |
