# Security headers

The files in `public/_headers` and `deploy/nginx.conf.example` document headers for static hosting
and Nginx. These policies must be applied at the hosting edge; a static frontend cannot enforce
response headers itself. Replace `https://API_ORIGIN_PLACEHOLDER` with the approved API origin
before deployment. Keep it aligned with `VITE_API_BASE_URL` and the API's credentialed CORS policy.

The application currently loads Google Fonts, so the strict `style-src 'self'` policy requires
self-hosting those font assets before it can be enabled without visual changes. These CSP values are
deployment examples, not evidence that the deployed host currently sends them.
