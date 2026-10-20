# Security checklist

Statuses reflect inspected source and commands actually run on this branch. BLOCKED means the
requested implementation or verification is incomplete; evidence does not imply deployment.

| ID | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| SEC-01 | No unsafe HTML or script evaluation sinks | PASS | `rg` inspection of `src`; no `dangerouslySetInnerHTML`, `innerHTML`, or `eval` found |
| SEC-02 | External URLs use HTTP(S) allowlist | PASS | `src/App.tsx` AppLink validates `http:` and `https:` |
| SEC-03 | Redirect paths use a dedicated allowlist | BLOCKED | No auth API or redirect helper exists |
| SEC-04 | No auth tokens or user data in browser storage | PASS | `src/App.tsx` stores locale only; no auth persistence found |
| SEC-05 | No secrets committed | BLOCKED | Secret scan of working tree and history not completed |
| SEC-06 | CSP and response headers configured | BLOCKED | `public/_headers`, `deploy/nginx.conf.example`; hosting edge not verified and API placeholder remains |
| SEC-07 | Dependency audit has no high findings | BLOCKED | `npm audit` could not reach registry; see recorded EAI_AGAIN result |
| SEC-08 | Third-party fonts removed | BLOCKED | `index.html` still references Google Fonts; font packages unavailable |
| SEC-09 | Production source maps disabled | PASS | `vite.config.ts` explicitly sets `build.sourcemap: false` |
| SEC-10 | Errors do not reveal credentials | BLOCKED | Backend auth flow is not implemented |
| SEC-11 | No unsafe postMessage or iframe flow | N/A | No such flow found in current source |
| SEC-12 | File handling is constrained | N/A | No file upload or file parsing flow found |
| SEC-13 | Credentialed CORS assumptions documented | BLOCKED | API origin and server CORS policy are unresolved; see `SECURITY_HEADERS.md` |
| SEC-14 | Authorization enforced by server | BLOCKED | No backend exists in this repository; architecture requires server-side authorization |
| SEC-15 | Sensitive data is not logged | PASS | No `console.log` call found by source inspection |
| SEC-16 | External target links use safe rel values | PASS | External website link uses `noopener noreferrer` in `src/App.tsx` |
| SEC-17 | Decoding malformed URL fragments cannot throw | PASS | `src/App.tsx` `decodeHash` wraps `decodeURIComponent` in try/catch |
