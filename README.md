# iFarm Dashboard

Architecture and implementation workspace for the iFarm Monitoring Dashboard. This repository is the first development priority; iFarm Store remains a separate product, repository, database, and authentication system.

## Current stage

Architecture planning. No application code has been started in this workspace. Review the architecture and phased plan before implementation. Do not make major architectural changes or start broad implementation until the user approves the proposed phase.

## Documents

- [Architecture reference](ARCHITECTURE.md): agreed requirements, selected technologies, proposals, and unresolved decisions.
- [Initial implementation plan](IMPLEMENTATION_PLAN.md): suggested discovery and foundation phases.
- [Codex project instructions](AGENTS.md): constraints for future work in this directory.

## Initial Dashboard stack

- Web: React, Vite, TypeScript
- Mobile: React Native, Expo
- API: NestJS, TypeScript, modular monolith
- Database: dedicated Supabase PostgreSQL project; custom NestJS JWT authentication
- IoT: MQTT over secure connections, Eclipse Mosquitto planned

The architecture document is the source of truth. Items marked proposed or unresolved are not approvals.
