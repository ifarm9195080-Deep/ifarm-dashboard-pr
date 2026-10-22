# Project instructions

## Source of truth

- Read `docs/PROJECT_CONTEXT.md` and `ARCHITECTURE.md` before making project decisions.
- `docs/PROJECT_CONTEXT.md` records the latest approved product requirements, current MVP scope, phase, and deferred work.
- `ARCHITECTURE.md` records technical decisions and unresolved choices. If it conflicts with a newer explicit user decision, the newer decision prevails; reconcile the documents in the same approved change.
- Label decisions as confirmed, proposed, deferred, or unresolved. Do not turn proposals or historical choices into current requirements.

## Product and workspace boundaries

- Continue development in the existing React application at `apps/web`. Do not create another dashboard app or rebuild the repository.
- Preserve the public i-Farm Welcome Page, interest form, marketing routes, Client Sign In, Back to i-Farm navigation, and unrelated working functionality.
- Keep iFarm Store in its separate private repository, project, authentication system, deployment configuration, and authorization boundary. Do not implement Store features here.
- Do not implement backend services or database operations in this frontend workspace.

## Current frontend architecture

- Use React, Vite, and strict TypeScript. Keep features isolated in feature-based modules and keep dashboard styles scoped to dashboard roots or CSS modules.
- Keep UI components small, semantic, accessible, and free of `any`, unsafe HTML injection, unnecessary dependencies, and duplicated business logic.
- Keep API contracts backend-independent and mock adapters replaceable. Do not couple UI components to a backend framework.
- Preserve English/Arabic localization and correct RTL/LTR behavior.
- Frontend route guards are UX only, never authorization.

## Security

- Never add secrets, passwords, production credentials, or permanent tokens to source or frontend bundles.
- Never store authentication tokens in localStorage or sessionStorage. Keep mock auth development-only and clearly labeled.
- Validate external URLs before rendering them. Do not expose stack traces or sensitive errors to users; do not log credentials or sensitive data.
- Preserve existing security hardening. Do not weaken production behavior to make development mocks work.

## Changes and verification

- Inspect Git status and relevant existing code before editing. Preserve unrelated changes and files; never reset, delete, or overwrite them without explicit approval.
- Ask for approval before major architecture changes, new phases, destructive actions, deployments, or hosted database changes.
- Add focused regression tests for affected routes and UI. When the user asks for verification, run and report lint, typecheck, unit tests, production build, and appropriate browser checks.
- Never claim visual verification without an actual browser render at the stated viewport(s). Distinguish code inspection from browser evidence.
- Report failing tests and existing warnings accurately. Do not blindly update snapshots to make tests pass; verify intended behavior and review visual changes first.
- Do not proceed to a later development phase without approval.
