# Initial implementation plan

This is a proposal derived from the architecture reference, not approval to begin implementation.

## Phase 0 — Repository and decision review

- Inspect the target GitHub repository and existing files, branches, and project conventions.
- Confirm this workspace is the Dashboard repository and identify any existing code that must be preserved.
- Resolve the smallest decisions needed for a secure foundation: External ID format/lookup, tenant/account relationship, customer/admin identity boundary, token/session revocation, and sensor device authentication/provisioning with the hardware engineer.
- Return a phased proposal with file-level scope and acceptance criteria for approval.

## Phase 1 — Project foundation

After approval, establish only the agreed monorepo skeleton and developer configuration for the Dashboard: `apps/web`, `apps/mobile`, `apps/api`, `apps/admin`, `packages/shared-types`, `infrastructure`, and `docs` as appropriate. Keep the Admin Panel separate from customer UI and use the same API with separate authorization.

## Phase 2 — Identity, tenant boundaries, and API contracts

Design the database schema and API contracts for tenants, the single customer account per Dashboard, admin accounts, Internal and External IDs, permissions, audit records, password reset, access/refresh sessions, and tenant-scoped authorization. Review the schema before creating or applying migrations.

## Phase 3 — Device registry and MQTT ingestion

Agree broker access, device provisioning, topic structure, payload validation, and tenant/device binding with the hardware engineer. Implement ingestion and reading storage with idempotent/error handling appropriate to the agreed protocol. Model missing readings as gaps; do not synthesize values.

## Phase 4 — Status, thresholds, alerts, and notifications

Add configurable availability thresholds, sensor online/delayed/offline transitions, threshold permission controls, abnormal-reading alerts, deduplication, and audit trails. Confirm notification channels and threshold values before enabling delivery.

## Phase 5 — Dashboard experiences and reporting

Build the web and mobile experiences against the shared API, then add historical charts and reporting with UTC storage and Africa/Cairo display. Preserve visible gaps in missing readings.

## Phase 6 — Cameras and deployment readiness

Verify the camera models' RTSP and codec support; select and test secure farm-to-server connectivity; decide on-demand versus continuous streaming; estimate concurrent-viewer bandwidth; then validate the proposed media gateway and VPS capacity. Do not expose RTSP or ONVIF directly to the public internet.

Prepare Docker Compose, Caddy/HTTPS, CI/CD, monitoring, external backups, and recovery procedures after operational requirements and deployment access are confirmed.

## Explicitly out of the first foundation scope

- Implementing the complete Dashboard or Store at once.
- Store features in the Dashboard repository.
- Microservices without evidence they are needed.
- Temporary QR login until its session-issuance security design is approved.
- Production camera streaming until connectivity and media support are verified.
- Hosted database changes before schema review and explicit approval.
