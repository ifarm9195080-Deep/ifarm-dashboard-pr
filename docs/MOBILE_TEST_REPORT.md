# iFarm Mobile Test Report

**Date:** 2026-10-18  
**Project:** `apps/web`  
**Test type:** Source-level responsive review and production build. Browser rendering was unavailable in this environment.

## Executive summary

The existing Home, Dashboard, and Dashboard Login layouts already include responsive breakpoints for small phones, larger phones, tablets, and desktop. The dashboard preview collapses its sidebar for narrow screens, forms stack on mobile, the Home and Dashboard hero images have smaller responsive candidates, and reduced-motion preferences are respected.

I made two focused improvements: mobile navigation and language controls now have 44px minimum interaction areas, mobile form inputs use 16px text, and the Vite development server binds to loopback instead of all network interfaces. No section layouts, colors, images, copy, or desktop compositions were redesigned.

## Routes and viewport matrix

The following matrix was reviewed against the route components and CSS media queries. These are **source-level checks**, not browser-rendered tests.

| Route | Viewports reviewed | Language/layout review |
| --- | --- | --- |
| `/` | 360×800, 375×812, 390×844, 412×915, 480×960, 768×1024, 1440×900 | English and Arabic direction, navbar rules, hero, section stacking, contact form, footer |
| `/dashboard` | 360×800, 375×812, 390×844, 412×915, 480×960, 768×1024, 1440×900 | English and Arabic direction, navbar rules, dashboard preview, sign-in card, interest form, foliage |
| `/dashboard/login` | 360×800, 375×812, 390×844, 412×915, 480×960, 768×1024, 1440×900 | English and Arabic direction, login header, form/card, footer |

### Source-level findings

- No fixed page-wide minimum width beyond 320px was found. Responsive wrappers use viewport-relative widths and `min-width: 0` in important grid/form columns.
- Public navigation changes to a menu at 960px and its content is scrollable on narrow screens. The logo remains a non-shrinking first item; the desktop navbar remains direction LTR, with direction localized to the link group.
- The dashboard preview stacks into a compact four-item menu at 520px and collapses its chart/activity panels to one column.
- Dashboard registration controls stack below 520px; Home contact fields stack below 680px.
- Existing botanical artwork is reduced or repositioned at narrow widths. Existing `prefers-reduced-motion` rules disable smooth scrolling and page transitions.
- Mobile controls that were 32–42px tall and form fields using 14px text were increased to 44px interaction areas and 16px mobile input text.
- The Vite dev server previously bound to `0.0.0.0`; it now binds to `127.0.0.1` by default.
- Navbar, form submission, keyboard navigation, actual text wrapping, crop, clipping, scrolling, and RTL interaction could not be exercised in a browser.

## Changes made

| File | Change |
| --- | --- |
| `apps/web/src/styles.css` | Set mobile menu toggle, nav links, and language buttons to at least 44px tall/wide interaction areas; set mobile form input text to 16px; give mobile footer links a 44px minimum height. |
| `apps/web/vite.config.ts` | Bind the development server to `127.0.0.1` by default to avoid listening on all network interfaces. |

No image files were changed. Existing mobile image candidates remain in use, including the 960px Dashboard background and 1200px Home hero candidate. Images are WebP where served from `public/assets`.

## Build and asset measurements

`npm run build` completed successfully on 2026-10-18 (TypeScript build and Vite production build). Vite reported:

| Output | Raw size | Gzip size |
| --- | ---: | ---: |
| CSS bundle | 60.37 kB | 12.81 kB |
| JavaScript bundle | 279.40 kB | 85.12 kB |
| HTML | 0.91 kB | 0.48 kB |

Measured on-disk sizes, not route transfer measurements:

| Public image | Bytes | Approx. size |
| --- | ---: | ---: |
| `dashboard-hero-background.webp` | 259,910 | 253.8 KiB |
| `smart-system-landscape.webp` | 220,752 | 215.6 KiB |
| `farmland-landscape.webp` | 219,202 | 214.1 KiB |
| `localized/en/smart-system.webp` | 207,144 | 202.3 KiB |
| `localized/en/farm-services.webp` | 194,786 | 190.2 KiB |
| `localized/ar/smart-system.webp` | 189,858 | 185.4 KiB |
| `localized/ar/farm-services.webp` | 155,350 | 151.7 KiB |
| `who-we-are/en-1200.webp` | 130,142 | 127.1 KiB |
| `dashboard-hero-background-960.webp` | 85,478 | 83.5 KiB |
| `smart-system-landscape-960.webp` | 58,522 | 57.1 KiB |
| `farmland-landscape-1200.webp` | 57,428 | 56.1 KiB |

`public/assets` totals 2,276,814 bytes (about 2.17 MiB); the complete generated `dist` directory totals 2,617,490 bytes (about 2.50 MiB). These totals include assets for multiple routes and are not the amount downloaded by any one visit.

## Browser and performance results

| Measurement | Result |
| --- | --- |
| Browser screenshots | Not captured |
| Chromium / Playwright | Not installed or available in the project |
| Firefox | Installed as a Snap, but headless launch was refused by `snap-confine` due to the host Snap/AppArmor environment |
| Lighthouse | Not installed or available |
| Performance score, LCP, CLS, TBT, FCP, INP | Not measured |
| Per-route transfer sizes | Not measured in a browser/network profiler |

No performance scores or Core Web Vitals are inferred from bundle or file sizes.

## Remaining limitations and recommendations

- Run the viewport matrix in Chromium/Playwright on Android emulation and at least one physical Android device before treating visual overflow, RTL order, or touch behavior as browser-verified.
- Collect Lighthouse mobile results after the browser tooling is available; measure LCP, CLS, TBT and per-route transfer bytes under equivalent network/CPU settings.
- Google Fonts are fetched from Google Fonts at runtime; their network contribution was not profiled.
- The login page uses blurred decorative gradients and shadows. They were preserved because no rendering trace was available to show a mobile performance problem.
- Decorative CSS backgrounds below the fold and cached repeat uses were not network-profiled. The existing responsive image candidates were retained.
- The development server is loopback-only by default. Use the production build and a protected tunnel for approved external review; see `PREVIEW_SHARING_GUIDE.md`.
