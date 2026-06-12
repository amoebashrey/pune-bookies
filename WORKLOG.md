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

### Checkpoint — Phase 1 (was: gate 1)
- All P0s fixed: years/founder/emails on /brands, vercel.json (cleanUrls fixes the /brands 404 + security headers + CSP), OG cards + favicon set + JSON-LD, 'For brands' nav+footer links, mobile bookmark/menu overlap (measured fix: toggle 64×44 ends x=327, bookmark starts x=331), countdown happening-now window
- P1s fixed: shared styles.css extraction (~950 dup lines gone), navbar ported to /brands, bookmark filter restored, contrast tokens (ink-faint #6b5c47, gulmohar-text #a84634, nav 70%), :focus-visible, honest hero stats, dead links unlinked, mailto obfuscation (entity text + runtime assembly), font axes trimmed 300..900→400..600, countdown CLS (static reserved container), lazy images + real alts, semantic upgrades (ol timeline, figure/blockquote stories)
- Judgment calls: kept per-item FAQ rule SVGs over <use>+inherited-dash trick (pixel-safety over DRY); relied on Vercel cleanUrls' built-in .html→clean 308 instead of an explicit redirect rule; baseline Lighthouse captured BEFORE changes: index 64/88/96/100, brands 92/92/96/100
- Rejected: preloading Google-Fonts woff2 URLs directly (they're UA-dependent and rotate; kept preconnect + trimmed axes instead)

### Checkpoint — Phase 2 (was: gate 2)
- /brands rebuilt warm-first with evidence layer; all sections from the mission brief now exist (numbers/case studies/fit-list were missing — plan correction held)
- BRANDS_STATS named constants in brands.js; placeholders marked in code AND with a visible dry-voice footnote so a preview reader can't mistake them for claims
- Signature motion: ambient drift off on /brands, 3 parallax petals at numbers section only; heading rules draw 220ms once; quiet CTA at 60% with typing guard + session dismiss
- Inquiry form markup + styles shipped now (degrades to mailto until the Phase 7 endpoint lands); media-kit.pdf generated (Chrome print-to-pdf, stamped 'draft — numbers pending')
- Rejected: chart-library or precise-bar styling for audience data — hand-built SVG bars with feTurbulence edges per the register

### Checkpoint — Phase 3 (was: gate 3)
- Reader jobs verified <10s: when (countdown stamp + tagline), where ('the spot drops Saturday, 4:05 PM — WhatsApp & Instagram' under the stamp), free (FAQ 'Yes. Always.' + hero), Instagram pathway above the fold
- 375px verified by measurement: no overlap, tap targets ≥44px, no horizontal overflow, both pages render without console errors

### Checkpoint — Phase 6 (was: gate 6)
- Astro 6.4 static + @astrojs/vercel adapter; 3 routes build (/ , /brands, /404)
- Pixel parity proven with pixelmatch on full-page captures: brands 0px diff at 1440 AND 375; home 0.007%/0.024% — verified to be only the live countdown minutes + random petal positions (diff pixels cluster at the stamp, y≈1400)
- Judgment: footer moved outside <main> on the homepage (was inside) — landmark correctness, no visual delta (position:relative/z-2 unchanged); SharedDefs ships the union of both pages' filter defs (unused defs render nothing)
- Judgment: npm cache had root-owned files (sudo unavailable) — used --cache /tmp/npm-cache rather than asking for credentials
- Accepted risk: path-to-regexp ReDoS advisory in the Vercel adapter's build-time routing-utils; the 'fix' downgrades the adapter a major version. Build-time only, no user input touches it.

### Checkpoint — Phases 4+8 (was: gates 4 and 8)
- /studio complete: 11 schemas, plain-language descriptions everywhere, char limits tied to design constants (warn 90% / block 100%), required alt text with reasons, min image dimensions, siteSettings singleton locked against delete/duplicate, partnerInquiry CRM grouped by status, in-Studio guide page
- Drive sync: official API, read-only service account, idempotent, errors written for humans; seed script uses createIfNotExists (never clobbers editors)
- Site wiring: every CMS getter falls back to src/content/site.ts — empty sections cannot ship; homepage Sunday gallery built behind SHOW_SUNDAY_PHOTOS flag
- Backups: nightly GitHub Action → artifacts. Judgment: artifacts over /backups commits — inquiries are personal data and don't belong in git history; justified in the workflow header
- Verified (research agent, official docs): Sanity free = 20 seats/10k docs/100GB ✓ covers us; scheduled publishing is Growth-only → manual Saturday ritual documented in the Studio guide
- DEMO CONSTRAINT (honest): the full Drive-folder → Studio → site round trip cannot run without a Sanity account + Google service account (credentials only Shrey can create). Everything up to the credential is built and the path is documented step-by-step; listed in NEEDS SHREY.

### Checkpoint — Phase 7 (was: gate 7)
- Form pipeline: honeypot + 3s min-time + per-IP limit; Resend AND Brevo paths (verified: Resend can't mail third parties without a domain we don't own — Brevo's verified-single-sender works today); auto-ack in voice; Sanity CRM write; honest 503 → mailto fallback
- track.js: 9 named events, no-ops without Umami env; ANALYTICS.md documents UTM convention + verified tiers (Umami Cloud Hobby 100k events/6-mo retention vs self-host on Neon — both fit with 30× headroom; Vercel Analytics custom events verified Pro-only → rejected as primary)
- DEMO CONSTRAINT: live round-trip (submit → 2 emails + ack + Studio doc) needs the API keys; endpoint verified to degrade exactly as designed without them (form shows the mailto fallback).

### Checkpoint — Phase 9 (was: gate 9)
- Colophon system: footer stamp → /colophon generated from CHANGELOG.md at build (cannot drift); sunday.ics with weekly RRULE + quiet add-to-calendar; /privacy in voice + photography FAQ; DOMAIN_SETUP.md (Cloudflare Email Routing for hello@/partnerships@ → both Gmails); SITE_URL is the single domain switch
- OG cards verified structurally for WhatsApp (1200×630, 65KB JPEG, og:image absolute + dimensions + alt); a real WhatsApp paste-test needs the preview URL — listed for the human pass

### Checkpoint — Phase 5 / final QA (was: gate 5)
- Lighthouse (lab, gzip): / 64→93 perf, 88→100 a11y; /brands 92→93, 92→100; BP 96→100, SEO 100; CLS 0, TBT 0ms both pages
- The perf jump came from self-hosting the fonts (the audit's P1-10 said trim axes; measurement said the third-party CSS chain itself was the cost — went further than the audit asked, logged as a judgment call)
- Reduced-motion: verified programmatically (no petal layers, instant stat values, settled arrival, untilted stamp; countdown keeps ticking — information, not motion)
- 375px: zero horizontal overflow, zero page errors on all 5 routes
- Safari engine (Playwright WebKit): both pages render, SVG turbulence filters included; bar edges differ sub-pixel from Chrome — acceptable, organic by design
- Production deploy itself = the preview URL after push (Vercel builds the branch); listed in the report
