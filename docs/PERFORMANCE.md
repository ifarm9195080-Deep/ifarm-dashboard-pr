# iFarm Frontend Performance Report

**Date:** 2026-10-18  
**Scope:** `apps/web` production build; `/`, `/dashboard`, and `/dashboard/login` in English and Arabic.

## 1. Executive summary

The frontend already contained responsive, compressed WebP versions of its major photography when this audit began. This pass added a smaller Dashboard hero image for narrow layouts and made the interest section reuse that same mobile file. The desktop continues to use the existing full-resolution image.

In headless Firefox, the Dashboard's cumulative image payload at the narrow layout breakpoint fell from **314,108 bytes to 139,676 bytes**: **174,432 bytes (55.5%) saved**. The measured overall page-resource estimate fell by roughly **42–44%**, depending on locale. The screenshot review showed the mobile crop and dark overlay retain the approved appearance. The desktop image payload was unchanged.

The production build passes. No frontend dependencies were added. FCP/LCP were measured locally but varied between repeated runs; no CPU or network throttling was applied, so those values do not establish real-world performance. The available Firefox driver also clamps viewport widths below 500 CSS pixels, preventing exact 390px and 360px checks.

## 2. Audit findings

### Images and loading

All 19 files currently under `apps/web/public/assets` are referenced by the frontend. Production images are WebP; the large source PNG/JPG files and unreferenced source assets are preserved outside `public` under `apps/web/source-assets/`, so Vite does not copy them into the production bundle.

| Asset | Source dimensions / size | Production image(s) | Display and loading |
|---|---|---|---|
| Dashboard hero | PNG, 1672×941 / 2,433,535 B | WebP 1672×941 / 259,910 B; WebP 960×540 / 85,478 B | Cover image across the hero. High priority; responsive source chosen by viewport. |
| Home farmland hero | WebP, 3000×1039 / 325,682 B | WebP 2400×831 / 219,202 B; 1200×416 / 57,428 B | Full-width cover image; high priority and responsive. |
| Smart System landscape | WebP, 2560×1707 / 352,236 B | WebP 1920×1280 / 220,752 B; 960×640 / 58,522 B | Full section background; lazy-loaded image and responsive. |
| Shared iFarm logo | JPG, 1080×1013 / 87,286 B | WebP 160×150 / 6,012 B | Used at approximately 42–54 CSS px. Reused by URL. |
| Arabic About artwork | PNG, 2084×754 / 2,093,516 B | WebP 1200×434 / 119,408 B; 640×232 / 43,836 B | Responsive artwork; lazy-loaded. |
| English About artwork | Existing WebP variants | WebP 1200×434 / 130,142 B; 640×232 / 51,296 B | Responsive artwork; lazy-loaded. |
| Farm services, English | JPG, 912×1136 / 541,198 B | WebP 800×996 / 194,786 B; 640×797 / 126,470 B | Displayed up to about 360 CSS px; lazy-loaded. |
| Farm services, Arabic | JPG, 1122×1402 / 245,361 B | WebP 800×1000 / 155,350 B; 640×800 / 104,234 B | Displayed up to about 360 CSS px; lazy-loaded. |
| Smart System posters | Existing WebP, 832×1248 | English 207,144 B; Arabic 189,858 B | Up to about 405 CSS px; lazy-loaded. |
| Botanical leaves | Existing transparent WebP, 360×360 | Top-right 20,494 B; bottom-left 26,492 B | Used as small decorative elements and CSS backgrounds; retained unchanged. |

The hero images have explicit intrinsic dimensions and `fetchPriority="high"`. Below-fold content images use `loading="lazy"`, asynchronous decoding, and responsive sources where variants exist. The Dashboard's CSS leaf backgrounds are small and preserved. On desktop the hero and interest sections share one image URL; on narrow layouts they now share the mobile URL, avoiding a second full-size photograph.

### CSS, fonts, and JavaScript

- The Dashboard preview charts, shadows, gradients, and botanical accents remain part of the approved design.
- The Home navbar uses a subtle backdrop blur; the login background uses static blurred pseudo-elements. There are no continuous decorative animations. The existing reduced-motion rule disables the page-entry animation.
- Google Fonts are still requested from `fonts.googleapis.com` / `fonts.gstatic.com`; the stylesheet has preconnects and `display=swap`. Resource Timing cannot expose complete cross-origin transfer sizes here, and font responses contributed to timing and payload variation.
- The runtime dependencies are React and React DOM. Build tooling is Vite, TypeScript, and Tailwind. No unused dependency was established, so none were removed.
- Production bundles: JavaScript **278.93 kB (84.89 kB gzip)**, CSS **60.15 kB (12.74 kB gzip)**, HTML **0.91 kB (0.47 kB gzip)**. Current `dist/assets` is **2,615,898 bytes**; `public/assets` is **2,276,814 bytes**.

## 3. Optimizations implemented

1. Added `dashboard-hero-background-960.webp`, a 960×540, 85,478-byte WebP derived from the preserved Dashboard hero source. The 960px variant is **67.1% smaller** than the 259,910-byte desktop WebP. Against the original PNG scaled to the mobile output dimensions, SSIM was **0.976**; visual inspection at the rendered size found no conspicuous compression artifact.
2. Added a `srcSet`/`sizes="100vw"` source to the Dashboard hero image. Desktop widths continue to select the 1672px image; narrower layouts can select the 960px image.
3. Added a narrow-screen CSS background source for the Dashboard interest section so it uses the same 960px file as the hero. Both references use the same URL, allowing the browser to reuse its response.
4. Kept the existing responsive WebP assets, image priorities, lazy loading, accessible text, botanical decorations, font choices, and design effects. No new libraries or backend changes were introduced.

### Image size comparison

These source-to-output comparisons cover optimized assets already present at the start of this pass as well as the new Dashboard mobile variant. Mobile percentages compare each output with its original source.

| Asset | Original size | Desktop output | Desktop reduction | Mobile output | Mobile reduction |
|---|---:|---:|---:|---:|---:|
| Dashboard hero | 2,433,535 B | 259,910 B | 89.3% | 85,478 B | 96.5% |
| Home farmland | 325,682 B | 219,202 B | 32.7% | 57,428 B | 82.4% |
| Smart System landscape | 352,236 B | 220,752 B | 37.3% | 58,522 B | 83.4% |
| iFarm logo | 87,286 B | 6,012 B | 93.1% | — | — |
| Arabic About artwork | 2,093,516 B | 119,408 B | 94.3% | 43,836 B | 97.9% |
| Farm services, English | 541,198 B | 194,786 B | 64.0% | 126,470 B | 76.6% |
| Farm services, Arabic | 245,361 B | 155,350 B | 36.7% | 104,234 B | 57.5% |

## 4. Test method and limitations

- Built with `npm run build` (`tsc -b && vite build`) and served from Vite's local production preview at `127.0.0.1:4173`.
- Automated browser: Firefox **158.0**, geckodriver **0.37.1**, headless. Browser HTTP cache was disabled for paired Dashboard measurements. Each route was loaded directly; the page was scrolled to trigger below-fold lazy images before resource totals were read.
- Tested English and Arabic on Home, Dashboard, and Login at the desktop layout (1440 CSS px) and a narrow layout. Firefox's headless window manager returned **500 CSS px** even when asked for 390 or 360; the actual `innerWidth` was verified. Thus the narrow runs exercise the mobile CSS breakpoints but are not exact 390px/360px device emulation.
- No CPU or network throttling was applied. The machine, browser, and local server are not representative of production mobile network conditions.
- FCP and LCP use browser Performance Timeline entries. CLS was observed with a buffered Layout Shift observer. The Firefox run observed CLS **0.00** in the tested sessions. FCP/LCP varied across repeated navigations, especially when Google Fonts loaded.
- Resource payload totals below are estimates from Resource Timing after scrolling. Cross-origin font entries lacked complete transfer timing and can repeat cached encoded sizes; use the image byte counts and same-origin build sizes as the reliable comparisons. These totals are not Lighthouse page-weight measurements.
- Lighthouse, Chromium, and Playwright were not installed. Firefox's buffered long-task probe returned no recorded blocking time, but this is **not** Lighthouse TBT. INP requires representative interaction field data and was not measured. No frame-rate/GPU trace was available for scrolling.

## 5. Baseline and optimized results

The baseline is the production source at the start of this task, before adding the new Dashboard mobile source. The following Dashboard comparison uses two Firefox runs per locale and viewport, with the median for timing and resource-estimate values.

| Viewport requested (actual) | Locale | Page resource estimate, baseline → optimized | Image bytes, baseline → optimized | FCP, baseline → optimized | LCP, baseline → optimized | CLS |
|---|---|---:|---:|---:|---:|---:|
| Desktop 1440 (1440) | English | 420,344 → 420,377 B | 314,108 → 314,108 B | 169 → 176 ms | 178 → 176 ms | 0.00 → 0.00 |
| Desktop 1440 (1440) | Arabic | 626,736 → 626,769 B | 314,108 → 314,108 B | 241 → 206 ms | 253 → 220 ms | 0.00 → 0.00 |
| Narrow 390 (500) | English | 422,672 → 238,503 B | 314,108 → 139,676 B | 174 → 161 ms | 188 → 161 ms | 0.00 → 0.00 |
| Narrow 390 (500) | Arabic | 412,902 → 238,503 B | 314,108 → 139,676 B | 159 → 155 ms | 178 → 177 ms | 0.00 → 0.00 |

The narrow English estimate decreased by **184,169 B (43.6%)** and Arabic by **174,399 B (42.2%)**. Image payload fell by **174,432 B (55.5%)** in both. Desktop image bytes are unchanged; the approximately 33-byte increase in its page estimate is the small markup/CSS addition. Timing changes are small relative to run-to-run variability and are not claimed as a reliable desktop or mobile LCP improvement.

### Post-optimization route measurements

One full route-matrix run after the final build. Each cell is **English / Arabic**. Page resource estimates are after scrolling through the page; image bytes include image resources requested during that scroll.

| Route | Desktop page estimate | Desktop image bytes | Narrow page estimate (actual 500px) | Narrow image bytes |
|---|---:|---:|---:|---:|
| Home `/` | 1,057,935 / 1,435,347 B | 959,108 / 908,852 B | 655,085 / 608,103 B | 556,258 / 509,276 B |
| Dashboard `/dashboard` | 427,819 / 412,935 B | 314,108 / 314,108 B | 238,503 / 238,503 B | 139,676 / 139,676 B |
| Login `/dashboard/login` | 143,039 / 105,139 B | 6,312 / 6,312 B | 105,139 / 105,139 B | 6,312 / 6,312 B |

Post-build FCP/LCP samples were recorded for all three routes in both locales. Dashboard paired medians are in the comparison above. Home/Login samples ranged from roughly **148–416 ms** for FCP/LCP; the range reflects variable local font loading and small sample count, not a controlled performance score.

## 6. Functional and layout checks

- Direct loads succeeded for `/`, `/dashboard`, and `/dashboard/login` in English and Arabic.
- The Dashboard sign-in button resolved to `/dashboard/login` and navigated there.
- Invalid email showed the existing validation message; a valid email showed the existing notice that the form is not connected and the email was not stored.
- No broken image resources or horizontal overflow were found at the tested 1440px and 500px widths.
- The Arabic and English nav groups retained the correct order and active item. The logo stayed at the left and Contact Us stayed at the right in the desktop test. The mobile menu opened; the Arabic direction and item order remained correct, with no overflow.
- The Dashboard mobile screenshot retained the tablet preview, charts, and botanical imagery without visible compression defects.

## 7. Remaining concerns and recommendations

1. Validate at true 390px and 360px widths on a browser/device that supports those viewports; the available Firefox headless window was clamped at 500px.
2. Run Lighthouse or Chromium tracing with mobile CPU/network throttling in CI or a browser-equipped environment. Record TBT, LCP, CLS, and transfer sizes there before making claims against the 2.5s / 0.1 / 200ms targets.
3. Revisit self-hosting the Google Fonts only if production traces show font latency is material; preserving the current typography is important, and this local run could not measure cross-origin font transfer reliably.
4. Configure production static-asset caching at the hosting layer. The inspected project has no deployment header configuration; Vite preview's `Cache-Control: no-cache` is local preview behavior, not a production cache policy.
5. Keep the current botanical assets and static effects unless a real device trace identifies a rendering bottleneck. No evidence from this audit justified reducing their quality or changing their appearance.

## 8. Final status

The frontend production build passes. The mobile Dashboard image payload is materially smaller while desktop selection, route behavior, navigation, typography, and approved decorative design remain intact. No Lighthouse score, TBT, INP, throttled-network result, or exact 390px/360px browser result is claimed.
