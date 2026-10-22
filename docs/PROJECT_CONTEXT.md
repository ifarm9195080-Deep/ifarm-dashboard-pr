# i-Farm Dashboard — Project Context

**Status:** Current approved product context
**Last updated:** 2026-10-21

This document captures current approved requirements and scope. Read it with `ARCHITECTURE.md`; the latter retains technical history and marks superseded decisions explicitly.

## Confirmed decisions

### Product and repository

- Prioritize the i-Farm Smart Farming Monitoring Dashboard.
- Continue in the existing React application at `apps/web`; do not create a second dashboard application.
- Preserve the public i-Farm Welcome Page, its interest-registration form, existing marketing routes, Client Sign In, and Back to i-Farm navigation.
- The expected customer flow is **Welcome Page → Client Sign In → Dashboard Overview**. A successful sign-in goes to `/dashboard`.
- Keep iFarm Store outside this workspace and its Dashboard identity, repository, deployment, and authorization boundaries.

### Frontend and integration boundary

- The web frontend uses React, Vite, and strict TypeScript.
- Keep features isolated and dashboard styles scoped. Maintain English/Arabic and LTR/RTL support.
- Define backend-independent API contracts and replaceable mock adapters. UI components must not depend on a selected backend framework.
- No backend or database is implemented in `apps/web`.
- Frontend route guards are for user experience only; server-side authorization will be required when a backend exists.

### Farm and monitoring product rules

- Each farm has one Owner and may have Members with configurable permissions.
- Only an Admin may add or remove sensors and dashboard widgets.
- Sensor readings are expected every five minutes.
- PTZ controls provide up, down, left, and right movement; zoom is not required.
- Initial reports cover latest readings and averages over a selected period.

## Current MVP scope and phase

The current frontend phase is the dashboard foundation and application shell: public/auth navigation, development-only mock sign-in, protected dashboard UX, dashboard layout/navigation, localization, and focused regression coverage. Existing marketing functionality remains part of the application and must be preserved.

Sensor management, live monitoring, camera streaming, reports beyond placeholders, and administration workflows are not part of the current implementation scope.

## Deferred features

- Advanced administration and permission-management workflows.
- Thermal imaging implementation.
- Real backend integration and production authentication.
- Retention-policy implementation.
- Sensor management, live camera streaming, and full report features.

Deferred means not approved for implementation in the current phase; it does not imply a final product rejection.

## Unresolved technical decisions

- Backend framework and implementation technology are undecided. NestJS and other frameworks are not confirmed.
- API protocol details, real-time transport, and final API contracts remain to be designed. Keep contracts replaceable and avoid premature coupling.
- Farm configuration representation and the exact permission model for Owners, Members, and Admins remain to be designed without changing the confirmed role rules above.
- Production authentication/session design and deployment integration remain future work. Do not treat development mock authentication as security.
- Retention duration and policy remain unresolved; implementation is deferred.

## Security and change rules

- Do not add hard-coded credentials, secrets, or permanent authentication tokens. Never store auth tokens in localStorage or sessionStorage.
- Development mock authentication must be visibly identified, active only in development, and excluded from production behavior.
- Preserve existing security protections, public routes, and unrelated working functionality.
- Add regression tests for changed flows. Run lint, typecheck, unit tests, production build, and appropriate browser checks when verifying changes.
- Request approval before major architecture changes or proceeding to a new phase. Never claim visual verification without browser evidence.

## Historical decisions

`ARCHITECTURE.md` v1.0 previously marked NestJS as the confirmed Dashboard backend and described one customer login account per dashboard. Those choices are superseded by the current decisions above: backend technology is undecided, and a farm has one Owner plus Members. The historical record is retained there for context, not as current implementation authority.
