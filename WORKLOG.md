# WORKLOG — Pune Bookies
*Append-only. Never edit past entries. This is the project's memory.*

## Pre-history [reconstructed from git history]

### `5a208d1` — Initial commit: Pune Bookies static site with live-reload dev setup
- index.html + brands.html, hand-built static HTML/CSS, all styles inline per page
- Fraunces (SOFT/opsz/WONK variable axes) + Lora via Google Fonts; Paper/Ink/Gulmohar palette as CSS custom properties
- Homepage sections: hero (inline-SVG watercolour tree + sloth), manifesto, Sunday timeline, photo grid (Unsplash placeholders), three stories, FAQ (accordion-style rules), sister chapters, come-on-Sunday, footer
- /brands: hero, manifesto, press boxes, things-we-won't-do, where-the-money-goes, people, talk-to-us
- live-server dev dependency; .gitignore for node_modules/.DS_Store/logs

### `e30cca5` — Add motion layer: arrival bloom, petal drift, countdown, smooth scroll
- animations.js: every timing in named constant blocks (ARRIVAL, PETALS, COUNTDOWN, LENIS, ATMOSPHERE)
- Arrival sequence (canopy washes → structure → wordmark wet-ink reveal → tagline → meta), once per session via sessionStorage gate, pre-paint inline gate script, 6s failsafe
- Continuous gulmohar petal drift (5–8 petals, sine sway, visibility-paused, reduced-motion off)
- "Library date stamp" countdown injected under the hero (next Sunday 08:00 IST; "happening now" until 10:00)
- Lenis 1.1.18 vendored; site-wide atmosphere: 3% paper grain, faded selection, ink-thin fading scrollbar, click-bleed
- FAQ redesigned to a reading column with hand-drawn rule draws; partner bookmark ribbon added to both pages

### `62db162` — Homepage: year/email fixes, library date stamp, navbar redesign
- Homepage navbar redesigned (wordmark + three tiny small-caps links, condensed scrolled state, mobile "menu" text toggle) — brands.html kept the old header
- Homepage footer year/emails corrected (2024, Tanvi/Shrey gmails) — brands.html not updated (caught in audit)

---

## 2026-06-12 — Session 1: Phase 0 audit
- Read every file; rendered both pages headless (1440/375); probed live deployment; scanned full git history for secrets; npm audit; measured element positions programmatically (found the mobile bookmark/menu overlap that screenshots alone mis-reported)
- Produced AUDIT.md: 6 P0s, 17 P1s, P2 list, plan correction (the /brands evidence layer does not exist yet — Phase 2 is partly a build)
- Decisions:
  - Audited against live deployment as well as repo — caught /brands 404 (no cleanUrls) and missing headers that repo-only reading would miss
  - Verified the "huge watercolour PNGs" assumption was false before recommending an image pipeline (illustrations are inline SVG; the 14MB folder is untracked/unused)
- Rejected: trusting old-headless screenshots showing a mobile horizontal overflow — re-measured with real layout queries; it was a tooling artifact. (Lesson: measure, don't eyeball.)
- Gate passed: audit approved in full; auto-run directive received for Phases 1–9

## 2026-06-12 — Session 2: Phases 1–9 continuous build (this log grows as checkpoints pass)
- Branch `overhaul/banyan` created; AUDIT.md committed
- Baseline Lighthouse capture of the live site started (before numbers for the final report)
- Free-tier verification research dispatched (Sanity / Resend / Neon / Umami / Vercel analytics) — findings will be reported in ANALYTICS.md + REPORT.md
- Owner answers folded in: Tanvi is the founder (fix /brands credit); Samruddhi joins team as "content"; punebookies.com NOT owned — gmails stay live contacts, hello@ is dead and must be removed everywhere; sister-chapter IG handles not supplied → cities mentioned, nothing linked
