# iFarm — Software Architecture & Technical Requirements

**Document status:** Architecture planning — Version 1.1
**Purpose:** Technical reference for Codex, development, infrastructure setup, and implementation planning.  
**Authority:** Technical decision record. Read with `docs/PROJECT_CONTEXT.md`, which records the current approved product and phase context. Newer explicit user decisions supersede historical statements below. Confirmed requirements, proposed choices, deferred work, and unresolved decisions are labelled separately.

## 1. Project overview

iFarm consists of two independent systems:

1. **iFarm Monitoring Dashboard:** IoT monitoring for sensors, live cameras, farm management, analytics, and notifications.
2. **iFarm Store:** E-commerce for agricultural products and order management.

The systems belong to one company but use separate application architectures, databases, authentication systems, and private GitHub repositories. The Dashboard is the first priority. Planning targets are approximately three months for the Dashboard and six months for the Store; these are not guaranteed deadlines.

## 2. Technology choices

| Component                | Technology                                                             | Status                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Dashboard web            | React, Vite, TypeScript                                                | Confirmed                                                                                                                  |
| Dashboard mobile         | React Native, Expo                                                     | Confirmed                                                                                                                  |
| Dashboard backend        | Not selected                                                           | **Unresolved.** NestJS was marked confirmed in v1.0; that choice is superseded. Do not assume NestJS or another framework. |
| Dashboard database       | Dedicated Supabase PostgreSQL project                                  | Confirmed                                                                                                                  |
| Dashboard authentication | Backend-enforced authentication; implementation and session design TBD | The former NestJS/JWT pairing is superseded with the framework choice.                                                     |
| Store web                | Next.js, TypeScript                                                    | Proposed                                                                                                                   |
| Store mobile             | React Native, Expo                                                     | Confirmed                                                                                                                  |
| Store backend            | Node.js, NestJS, TypeScript                                            | Confirmed                                                                                                                  |
| Store database           | Separate Supabase PostgreSQL project                                   | Confirmed                                                                                                                  |
| Store authentication     | Supabase Auth                                                          | Planned                                                                                                                    |
| Initial hosting          | Hostinger VPS KVM 2                                                    | Initial selection                                                                                                          |
| Containers               | Docker, Docker Compose                                                 | Planned                                                                                                                    |
| Reverse proxy / HTTPS    | Caddy, Let's Encrypt                                                   | Proposed                                                                                                                   |
| Source control           | Separate private GitHub repositories                                   | Confirmed                                                                                                                  |
| Sensor messaging         | MQTT + JSON                                                            | Confirmed                                                                                                                  |
| MQTT broker              | Eclipse Mosquitto                                                      | Planned                                                                                                                    |
| Camera control           | ONVIF                                                                  | Confirmed capability                                                                                                       |
| Camera video input       | RTSP                                                                   | Pending camera verification                                                                                                |
| Browser video            | WebRTC; HLS fallback if needed                                         | Proposed                                                                                                                   |
| Media gateway            | go2rtc                                                                 | Proposed                                                                                                                   |

**Current constraint:** Do not select or implement a Dashboard backend framework without an approved decision. The v1.0 NestJS constraint is historical, not current.

## 3. Hosting and infrastructure

Initial deployment is planned on one Hostinger KVM 2 VPS: 2 vCPU, 8 GB RAM, 100 GB SSD, and an advertised 8 TB traffic allowance. Test actual resource use before production.

Planned VPS services include both application backends and web frontends, Mosquitto, reverse proxy, application containers, and potentially a camera streaming service. The VPS does not host production PostgreSQL.

Use two separate Supabase projects:

- **Dashboard:** PostgreSQL for accounts, farms/devices, readings, thresholds, notifications, and audit records. Dashboard authentication is intended to be enforced by the backend; its framework and session design are undecided. The former NestJS/Supabase Auth exclusion pairing should be revisited when backend design is approved.
- **Store:** PostgreSQL, Supabase Auth, product/order data, and storage as needed.

Keep services, secrets, authorization boundaries, and deployment configurations separate even if both systems share the VPS. A VPS failure can affect both. Production readiness requires monitoring, external backups, and recovery procedures.

## 4. Dashboard product model and tenancy

Each farm has one Owner and may have Members with configurable permissions. The earlier v1.0 single-customer-login assumption is superseded. Only an Admin may add or remove sensors and dashboard widgets. Sensor readings are expected every five minutes. Sensor count must be expandable. Initial product planning anticipates two PTZ cameras, web access, and mobile access; the exact initial sensor count is not a confirmed minimum.

Use tenant-based isolation. Give each farm/customer environment a unique internal identifier; associate all farm-specific records with the correct tenant. The backend must enforce tenant isolation for every relevant API request. PostgreSQL RLS may add defense in depth but does not replace backend authorization.

## 5. Identity and authentication

### Customer identity

Each farm has one Owner and may have Members with configurable permissions. This supersedes the v1.0 single-customer-login assumption. The exact permission matrix, invitation flows, and relationship between farm Admin and platform administration remain unresolved. Administrative staff accounts remain a separate concept.

The following Internal/External ID requirements are retained as historical design context pending review against the new membership model:

- **Internal ID:** backend-generated, preferably UUID, stable for the account lifetime, used for database relations to farms, devices, reports, and other data.
- **External ID:** unique, customer-facing identifier, proposed 12 characters, generated administratively, associated with the physical Dashboard product, usable for login and support, and regenerable by authorized staff. Never use as a primary key.

External ID is neither a password nor a second factor. Proposed protections: cryptographically secure generation; keyed HMAC for exact lookup where at-rest protection is needed; separately store the last four characters for support; enforce uniqueness and rate-limit attempts. Unsalted hashes of low-entropy IDs are insufficient against offline guessing.

Regeneration must authorize the administrator and account, include appropriate customer identity verification, generate and transactionally set a unique replacement, invalidate the old ID, preserve the Internal ID and all farm data, audit the action, and issue a replacement customer-facing QR when needed. It must not create a new farm account.

### Login, passwords, and tokens

Customer login requires External ID, username, and password, all belonging to the same account. Hash passwords with Argon2id; never store plaintext. Provide secure password reset, rate limits, and generic authentication errors that do not reveal which credential failed.

Proposed token approach: 15-minute access JWTs; rotating refresh tokens; secure storage and revocation; logout and session invalidation. Web refresh tokens should use Secure, HttpOnly cookies. Mobile credentials should use platform secure storage. Validate permissions server-side.

Password reset uses a short-lived, single-use email link, stores a new Argon2id hash, and invalidates existing sessions according to policy. A transactional email provider remains to be selected; Gmail addresses must be supported as recipients.

2FA is intended, but method and enforcement are unresolved. External ID + username + password is not 2FA.

## 6. QR codes

### Permanent device QR

The physical Dashboard QR helps customers find/open the right login experience. It may identify an account/installation but must not contain a password, permanent session token, or auto-authentication credential. Normal login remains required. A stable, non-secret device QR reference is an option to evaluate. External ID regeneration must not break the permanent Internal ID relationship; replace/invalidate printed identifiers as designed.

### Temporary Admin QR

If implemented, an authorized Admin Panel may issue a single-use, five-minute onboarding/login QR bound to the intended account. It must expire, invalidate on use, be audited, and resist replay. The security of granting an authenticated session through this flow must be finalized first. It is not an initial-release priority.

## 7. Sensors and MQTT

Sensors connect to farm Wi-Fi and are expected to connect directly to the broker; no separate local gateway is currently required for sensor messaging. Hardware/firmware belongs to a separate engineer. The iFarm software team receives, validates, stores, and presents sensor data.

Use secure MQTT connections and device-specific authentication. Eclipse Mosquitto on the VPS is planned. Agree final topics and provisioning with the hardware engineer. Proposed topic: `ifarm/{tenant_id}/{device_id}/data`.

Example JSON:

```json
{
  "device_id": "SOIL_NODE_001",
  "battery_voltage": 12.45,
  "soil_moisture": 38.2,
  "soil_temperature": 25.6,
  "soil_ec": 1.12,
  "rssi": -65
}
```

Validate types, device registration, tenant association, and measurement formats before storage. Expected interval is one reading per five minutes: 288 per sensor/day, 8,640 per sensor/30 days, or 60,480 per 30 days for seven sensors, assuming continuous operation.

Availability states:

- **Online:** valid reading within five minutes.
- **Delayed:** more than five minutes, but not yet seven minutes.
- **Offline:** more than seven minutes.

Offline changes update Dashboard status and notify the customer and administrator. A valid new reading restores Online and updates last-seen. Make thresholds configurable later as network conditions require.

Initial reports should show latest readings and averages over a selected period. Initial policy accepts lost readings during internet outages; no full buffer/retransmit requirement. Resume on new messages after connectivity returns. Charts show missing periods as gaps and never fabricate readings.

## 8. Thresholds and alerts

Support configurable limits for soil moisture, soil temperature, soil electrical conductivity, and future measurements. Actual ranges are TBD and may vary by farm/crop/conditions.

An out-of-range reading produces a Dashboard warning and customer notification. Admins do not receive every abnormal-reading alert. Admins manage thresholds; customer edits are disabled by default and enabled only per account by an administrator. Audit every change with actor, time, previous value, and new value.

## 9. Cameras

Each farm initially has two PTZ IP cameras, both viewable simultaneously. Customer controls: pan left/right and tilt up/down; zoom is not required. Web and mobile users need remote access.

PTZ controls are up, down, left, and right; zoom is not required. ONVIF is confirmed for PTZ and may support discovery/media configuration. RTSP is proposed for video input and must be verified. WebRTC is proposed for low-latency clients; HLS is an optional fallback; go2rtc is a proposed gateway. ONVIF does not replace the media transport.

Farm cameras are behind local networks. A VPS cannot automatically reach private camera IPs. Select and test secure connectivity (VPN, outbound tunnel, or small farm-side networking gateway). Never expose RTSP/ONVIF directly to the public internet.

Video requirement is live-only; no continuous recording, cloud archives, history, or downloads. On farm internet loss, show camera Offline and disable stream/PTZ. Client auto-reconnect is not required for v1.

Streaming schedule is unresolved: continuous 24/7 delivery or on-demand delivery. Recommendation is on-demand to reduce bandwidth and processing, but user has not confirmed. Both feeds must be available simultaneously when requested.

## 10. Dashboard API and database

Backend technology and deployment topology are unresolved. The v1.0 NestJS modular monolith and module list are historical candidates, not approved architecture. Keep API contracts backend-independent until a framework and deployment design are selected. Avoid introducing microservices without demonstrated need.

Preliminary schema candidates: `tenants`, `dashboard_accounts`, `dashboard_permissions`, `devices`, `sensor_readings`, `sensor_thresholds`, `cameras`, `alerts`, `notifications`, `refresh_sessions`, `password_reset_tokens`, `temporary_qr_tokens`, `audit_logs`. Final schema, relationships, indexes, retention policy, and migrations require detailed design and review.

Store timestamps in UTC using timezone-aware types. Display farm reports in local time; Africa/Cairo is the initial timezone target.

## 11. Web, mobile, and data flow

Web uses React + Vite + TypeScript; mobile uses React Native + Expo with a native experience rather than a wrapper. Both are expected to use shared, backend-independent API contracts for authentication, farm identity, authorization, farm data, readings, camera access, alerts, and threshold settings. The API implementation technology is undecided. Their interfaces remain independent.

```text
Dashboard Web (React) ─────┐
                            ├── Dashboard API (technology undecided)
Dashboard Mobile (Expo) ────┘                 │
                                              └── Supabase PostgreSQL
```

Video may use a separately authenticated media transport rather than routing all video bytes through ordinary REST.

## 12. Administration

Advanced Admin Panel workflows are deferred. The confirmed rule is that only an Admin can add or remove sensors and dashboard widgets. Further expected capabilities (subject to approval) may include creating accounts, registering devices, managing permissions, and inspecting audit logs. Admin authentication remains separate from customer authentication, and administrative actions must be auditable when implemented.

Admin auth and authorization are separate from customer auth. All administrative actions are auditable.

## 13. Notifications

Confirmed: sensor Offline alerts go to customer and administrator; abnormal sensor readings go to customer only. Channels remain unresolved: in-app, mobile push, email. Expo Push Notifications is proposed for mobile. Design deduplication/cooldowns to avoid repeated alerts for the same unresolved condition.

## 14. Store (separate product)

Target customers: individuals, farmers, traders, and companies. Initial requirements: fixed prices, catalog/categories, cart, checkout, address delivery, order management, inventory, and admin product management.

Proposed Next.js web, Expo mobile, NestJS backend, dedicated Supabase project, Supabase Auth, and Supabase Storage as needed. Do not share Dashboard auth databases or business data tables by default; future integration must use explicit APIs. Payment, delivery, inventory policy, and permissions remain TBD.

## 15. Deployment and operations

Proposed Docker Compose, separate Dashboard/Store backend containers, containerized MQTT, HTTPS reverse proxy, secrets outside source, GitHub CI/CD, staging and production separation, logs, health checks, database backups, and infrastructure monitoring.

Secure VPS with SSH keys, restricted admin access, firewall, TLS, protected management interfaces, updates, monitoring, and incident recovery. Use TLS and least-privilege credentials for database access.

## 16. GitHub repository organization

Separate private repositories are confirmed. Proposed Dashboard and Store monorepos:

```text
ifarm-dashboard/
  apps/ (web/, mobile/, api/, admin/)
  packages/shared-types/
  infrastructure/ (docker/, deployment/)
  docs/
```

```text
ifarm-store/
  apps/ (web/, mobile/, api/, admin/)
  packages/shared-types/
  infrastructure/ (docker/, deployment/)
  docs/
```

The precise repository organization remains proposed, not finalized.

## 17. Open decisions

1. Verify camera RTSP and codec support.
2. Select secure remote camera connectivity.
3. Confirm on-demand versus continuous camera streaming.
4. Estimate concurrent camera viewers and VPS bandwidth.
5. Define MQTT device authentication/provisioning with hardware engineer.
6. Finalize Dashboard schema.
7. Finalize External ID encoding and permanent device QR behavior.
8. Define 2FA method/enforcement.
9. Select transactional email provider.
10. Confirm notification channels.
11. Define threshold values/configuration.
12. Define DB retention and backup policy.
13. Complete Admin Panel requirements.
14. Finalize Store payment and delivery workflows.
15. Test KVM 2 under realistic sensor/video workloads.
16. Select a Dashboard backend framework.

## 18. Codex implementation rules

1. Do not change confirmed architectural decisions without asking.
2. Keep confirmed requirements separate from proposals.
3. Do not treat unresolved features as approved.
4. Prioritize Dashboard.
5. Prefer maintainable architecture for a small team.
6. Do not assume a Dashboard backend framework; await an explicit decision.
7. Enforce tenant isolation and authorization server-side.
8. Never expose Supabase service-role credentials or secrets to frontends.
9. Keep Internal IDs stable and independent of regenerable External IDs.
10. Treat permanent device QR as identification/navigation, not authentication.
11. Avoid unnecessary microservices/infrastructure.
12. Ask before implementing security-sensitive or unresolved decisions.

## 19. Initial development objective

Establish a clean, secure, extensible foundation for the Monitoring Dashboard. Keep web/mobile API contracts backend-independent. Do not implement the entire platform at once. First inspect the repository, identify existing code, propose a phased plan, and wait for approval before major architectural changes.

## 20. Superseded v1.0 decisions and current phase

The v1.0 statements that the Dashboard backend was confirmed as NestJS and that each dashboard had one customer login account are retained in Git history but superseded by current user decisions. Backend technology is undecided. Each farm has one Owner and may have Members with configurable permissions. See `docs/PROJECT_CONTEXT.md` for the current product scope, MVP phase, and deferred features. Thermal imaging, advanced administration workflows, real backend integration, and retention-policy implementation are deferred from the current frontend phase.
