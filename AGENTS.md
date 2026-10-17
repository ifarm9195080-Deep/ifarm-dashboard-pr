# Project instructions

## Source of truth

Read `ARCHITECTURE.md` before making project decisions. Keep confirmed choices, proposals, and unresolved items distinct. The architecture document records the user's current requirements.

## Product scope

- Prioritize the iFarm Monitoring Dashboard.
- Keep iFarm Store in its own private GitHub repository, Supabase project, authentication system, deployment configuration, and authorization boundary.
- Do not add Store implementation to this Dashboard workspace.

## Architecture constraints

- Use NestJS and TypeScript for the Dashboard API. Do not replace NestJS with Spring Boot.
- Use a modular monolith initially; do not introduce microservices without a demonstrated need.
- Use React + Vite + TypeScript for web and React Native + Expo for mobile, against the same NestJS API.
- Use the Dashboard's dedicated Supabase PostgreSQL project. Dashboard authentication is custom in NestJS, not Supabase Auth.
- Enforce tenant authorization in the backend for every tenant-scoped request. RLS is only an additional defense.
- Keep the backend-generated Internal ID stable. The regenerable External ID must never be a primary key or password substitute.
- Never expose service-role credentials, secrets, or permanent authentication tokens to frontends or QR codes.
- Treat device QR as identification/navigation. Treat temporary admin QR as a proposed, security-sensitive feature requiring final design.
- Store timestamps in UTC and display reports in the farm's local timezone; Africa/Cairo is the initial target.
- Do not assume Store details, 2FA, camera transport/network, notification channels, retention, or other unresolved decisions are finalized.

## Workflow

1. Inspect the existing repository and report its current state before proposing changes.
2. For the initial foundation, propose a small, reviewable phase with scope, risks, and acceptance criteria.
3. Wait for user approval before major architectural changes or broad implementation.
4. Do not apply database migrations to a hosted project without explicit approval for that operation.
5. Keep secrets out of source control. Do not reveal secret values found in local files.
6. Do not add or run tests unless asked; when asked to verify, report exactly what was run.
