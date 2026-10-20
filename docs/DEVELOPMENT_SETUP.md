# Development environment setup

## Scope and verification sources

This document records the development tools for the iFarm Monitoring Dashboard workspace. The inventory separates:

- **Host-verified:** installation and functional checks reported as completed on the Ubuntu host by the project owner.
- **Codex sandbox:** commands and version queries run from this workspace during this review. The sandbox shares the host's installed command-line tools, but has its own permission limits; a CLI version check does not prove that a service or device is usable from the sandbox.

No application code, project dependencies, or database migrations have been created or run.

## Verified tool inventory

| Tool | Host-verified result | Codex sandbox observation |
|---|---|---|
| Node.js | 24.22.0 | `node --version` returned `v24.22.0` |
| npm | 11.19.1 | `npm --version` returned `11.19.1` |
| pnpm | 12.14.0 | `pnpm --version` returned `12.14.0` |
| fnm | 1.39.0 | `fnm --version` returned `1.39.0` |
| NestJS CLI | 12.0.8 | `nest --version` returned `12.0.8` |
| TypeScript | 7.0.2 | `tsc --version` returned `7.0.2` |
| Git | 2.53.0 | `git --version` returned `2.53.0` |
| GitHub CLI (`gh`) | 2.46.0 | `gh --version` returned `2.46.0` |
| Docker Engine | Installed; `hello-world` test passed | Docker CLI 29.1.3 is present. Docker daemon access is denied (`/var/run/docker.sock`), so the sandbox could not query the server or repeat the container test. |
| Docker Compose | 2.40.3 | `docker compose version` returned 2.40.3 |
| Docker Buildx | 0.30.1 | `docker buildx version` returned 0.30.1 |
| PostgreSQL client | 18.6 | `psql --version` returned 18.6 |
| Mosquitto clients | 2.0.22 | `mosquitto_sub` reported 2.0.22 |
| FFmpeg | 8.0.1 | `ffmpeg -version` reported 8.0.1 |
| Java | 17 | `java -version` reported OpenJDK 17.0.20.1 |
| Android Debug Bridge (ADB) | 34.0.5 | `adb --version` reported 34.0.5 |

Codex also confirmed the reported Ubuntu 26.04.1 LTS environment and found these previously installed command-line tools available: ESLint, Prettier, Supabase CLI, Bruno CLI, traceroute, mtr, nmap, ping, curl, and Python 3. Their versions were not audited as part of this update. VS Code is present at `/snap/bin/code`; launching it or inspecting its extensions was not verified.

## Remaining setup issues and limits

- **Docker access in Codex:** the CLI is installed, but the sandbox user cannot access the Docker daemon. Docker Engine and `hello-world` were verified on the host; sandbox container operations remain unavailable.
- **Git repository metadata:** `git status --short` reports that this workspace is not inside a Git repository. Confirm or initialize the intended private Dashboard repository before the first commit. No repository was initialized during this review.
- **Device and service workflows:** version checks do not verify Android device authorization, emulator availability, MQTT broker connectivity, PostgreSQL server connectivity, or a running application stack. Those are not required for the initial setup record.
- **VS Code:** the CLI path exists, but Snap launch and extension inspection were not tested.
- **Architecture decisions:** camera RTSP support and connectivity, MQTT device provisioning, authentication details, notification channels, retention, and other items listed in `ARCHITECTURE.md` remain decisions to resolve in their planned phases; they are not host installation failures.

No `sudo` commands, mount changes, filesystem repair, application scaffolding, or hosted database operations were attempted.

## Next development step

Proceed with **Phase 0 — Repository and decision review** from `IMPLEMENTATION_PLAN.md`: confirm the intended Dashboard repository and its conventions, then resolve the minimum identity, tenant, session, and device-authentication decisions needed to propose a small Phase 1 foundation for approval. Do not scaffold application code until that phase is approved.
