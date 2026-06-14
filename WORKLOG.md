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

### Push + preview
- Branch pushed → Vercel preview builds from overhaul/banyan; production untouched; v2.0.0 tag created locally, NOT pushed (tags should point at what ships — push at merge)
- Hit a real credential boundary: OAuth token lacks `workflow` scope → backup Action parked at studio/sanity-backup.workflow.yml with restore instructions in its header + REPORT NEEDS-SHREY §7. (Did not fake around it.)

---

## 2026-06-13 — Session 2: Banyan revisions (branch `polish/banyan-revisions`)
- Merged PR #1 (overhaul/banyan → main) first — the v2.0.0 Banyan release was overdue per the handoff; waited for the Vercel main deploy to go green, then branched `polish/banyan-revisions` off the freshly-merged main. Discarded the prior session's uncommitted `notice`/CountdownStamp spike (superseded by the changes below).
- Reconciled the spec against the actual build before touching anything: the brief assumed a 2-bullet timeline, a "Who shows up" / "Where we read" section, and a "Curation"/"Join the Circle" navbar — none matched main. Surfaced the four mismatches and agreed on interpretations before editing.
- **Notice strip** (replaces the countdown stamp): new `noticeBar` Sanity singleton (nextSundayDate / time / location / overrideText) + hardcoded fallback in `src/content/site.ts` so it never renders empty. Copy logic in `src/lib/noticeBar.ts` (today/tomorrow/next-Sunday/off-this-week + the 7–10 AM "happening now" window), rendered by `NoticeBar.astro` with a build-time baseline and an inline IST recompute at request time. Sticky, above the navbar; navbar offset by its height (48/44px). Verified live read: pulled 2026-06-14 from Sanity → "reading tomorrow · 8 AM · Mt. Carmel".
- **Silk ribbon**: rebuilt `Bookmark.astro` as a 40×280 SVG silk variant — cylindrical sheen gradient (highlight #C75240 / shadow #9A3022), three fold lines, ~6% woven turbulence, top-edge darkening, swallowtail V-notch, cream "PARTNER WITH US" reading top-to-bottom in the middle third, 6s ease-in-out wind-breath (paused on hover, paused-by-default on mobile, off under reduced-motion). Hover descends 8px + deepens shadow. Links to /brands#get-in-touch. Widened navbar right-padding (72px) so the wider ribbon clears the nav links and mobile menu.
- **Countdown stamp removed**: dropped `CountdownStamp.astro` and its homepage import; let the hero breathe (no replacement element).
- **Navbar**: "For brands" → "For Brands"; added a "Write" → /brands#get-in-touch link to both the homepage and /brands navs (same-page anchor on /brands). Wordmark and CTA untouched (there was no "Join the Circle" CTA to touch).
- **Inquiry form**: heading → "Get in touch"; lead → "Tell us what you have in mind. We read everything and reply to most of it."; textarea label → "Message"; brand field made optional (label + client + relaxed the server-side requirement in `api/inquiry.ts`); submit → plain "Send" (no arrow); failure line kept; form section id → `get-in-touch` (updated the obf-mail and QuietCta anchors to match).
- **Homepage copy**: hero untouched (confirmed verbatim); timeline 8:00 AM body rewritten + 9:00/9:45/10:00 consolidated into one "10:00 AM · We wrap up"; added a "Who shows up" section (families); stripped the two named-park locations from photo captions; "wider network" paragraph reworded (dropped "and not much else"); "Coming to a Sunday" left as-is (already Instagram/WhatsApp only).
- **/brands copy**: intro rewritten ("For brands", Audible/Penguin/Third Wave/Crossword/Socials, free-and-stays-free); "Things we won't do" replaced by "How we work with brands" (4 paragraphs); added "What we're open to"; removed "Where the money goes"; case-study placeholders and the stats row left untouched.
- Hardcoded fallback intact and tested: built with and without `SANITY_*` env — the notice strip and every CMS getter fall back cleanly, the site never builds empty.
- `npm run build` green after every step; PR opened against main.

---

## 2026-06-13 — Session 3: Banyan revisions round 2 (branch `polish/banyan-revisions-2`)
Polish-on-polish, branched off `polish/banyan-revisions`. Eleven changes; build green after each.
- **Notice strip out, countdown stamp back.** The sticky red strip fought the brand — removed it everywhere (`NoticeBar.astro` deleted, dropped from `BaseLayout`, `.notice-bar` CSS and the navbar 48/44px top-offset reverted; kept the 72px right-padding since the ribbon stays). Restored `CountdownStamp.astro` under `<Hero />`, but now fed by Sanity: it carries `noticeBar` (date / time / override) on data-attributes and `animations.js` reads them. Deleted the now-orphaned `src/lib/noticeBar.ts`.
- **`noticeBar` schema simplified.** Removed the `location` field (we never show the spot on the site) from the schema, the `site.ts` fallback, and the `getNoticeBar` GROQ/type. Document description rewritten to describe the hero stamp.
- **Countdown render logic (`animations.js`).** `WHERE_LINE` is now the hardcoded `"Location shared in our WhatsApp groups"` (never from Sanity). If `overrideText` is set the stamp shows only that line (no countdown, no where-line); otherwise it shows date + countdown + the where-line, with the gather hour parsed from the `time` field (default 8 AM) and an optional fixed date from `nextSundayDate`.
- **Ribbon: matte, not satin.** Dropped the bright sheen stop; gradient is now a subtle dim (#A8392A → #B73E2D → #9A3022). Fold lines dimmed (0.03 / 0.04 / 0.02), top-darkening reduced (0.25). Kept the weave, swallowtail, 40×280 size, 6s wind-breath, cream label.
- **Homepage manifesto** rewritten to two plain paragraphs; "cathedral", "we don't run ads", and "stubborn about the small things" all gone.
- **/brands intro** restored to the reading-community framing (three paragraphs, eyebrow "a few honest notes"); removed the previous round's "free and stays free / doesn't pay to attend, ever" framing.
- **Removed "Who we're a fit for"** (`BrandsFit.astro` + `fitList`) as redundant with "What we're open to"; collapsed the doubled hairline rule.
- **Numbers eyebrow** ("the part you'll forward to your manager") removed; made `SectionHead`'s eyebrow optional so the heading stands alone.
- **Form lead** trimmed to one sentence ("Tell us what you have in mind."). **Arrogance sweep**: deleted "That's how we keep it honest." from the closing "How we work with brands" paragraph.
- CHANGELOG `[Unreleased]` **reconciled** rather than appended — the strip was added in round 1 and removed in round 2, so it never shipped and isn't logged; the section now reads as the net result of both rounds.
- Lighthouse (desktop, lab) re-run: perf 100/99, a11y 100, BP 100, SEO 100 — gates held. PR opened against main.

---

## 2026-06-14 — Session 4: Hero painting + watercolour onboarding (branch `feat/hero-onboarding`)
Branched off `polish/banyan-revisions-2` (stacks on PRs #2/#3). Four assets dropped in `public/illustrations/` (the repo serves static assets from `public/`), each given a WebP via sharp (193/1062/831/1000 KB PNG → 44/154/116/112 KB WebP, alpha preserved); PNGs kept as `<picture>` fallback.
- **Hero illustration replaced.** Swapped the hand-drawn CSS/SVG tree + squirrel for `onboard-3-hero` (seated readers under the gulmohar) via `<picture>` (WebP + PNG, `fetchpriority=high`, width/height for zero CLS). Removed the now-dead SVG markup and the `html[data-arrival=running] .hero-illustration ellipse,g` reveal rule.
- **Wordmark overflow fixed.** Made the hero composition vh-aware: wordmark `clamp(3.5rem, min(11.5vw,13.5vh), 8rem)`, painting width capped by `72vh` (16:9 → height stays bounded), and vh-aware padding / tagline / meta / ig gaps. Verified the full hero (painting + complete "Pune Bookies" + tagline) fits with no scroll at 1440×900, 1280×800 and 375×667 (screenshots). Tree kept (now the painting).
- **Onboarding sequence** (`Onboarding.astro`, homepage only, once per session). Three frames bloom in (opacity + scale 1.03→1 + blur 6px→0 over ~1.1s, ~1s hold each, ~6s total) with the site's gulmohar petals drifting down, then the overlay fades (~0.7s) to reveal the hero. Frame 3 == the hero painting at the same position/scale (overlay padding-top matches the hero), so the handoff is seamless. Pre-paint gate (`data-onboard` in index's head slot, fresh `pb_onboard_v1` flag) decides play vs skip before first paint; on play it also sets `data-arrival=done` to disable the old hero bloom so the hero sits settled beneath. Quiet `skip` (also Escape); `prefers-reduced-motion` → no overlay, hero instant; overlay `aria-hidden`, skip `tabindex=-1` (no focus trap); frames 1–2 preloaded (frame 3 shared with the hero LCP image, which measured 0.9s).
- **Stacking fix:** the overlay was first placed in the default slot (inside `main`, `z-index:2`) so the navbar/ribbon punched through it — moved to BaseLayout's `after-main` slot (body-level) so `z-index:9999` actually wins.
- **A11y:** restoring the hero (via `data-arrival=done`) exposed a pre-existing low-contrast `.scroll-cue` (faint ink pulsing to 0.5 opacity) that the old gate had hidden during audits — darkened it to 0.72 ink and dropped the opacity pulse; same 0.72 ink for the skip control. Lighthouse `/`: perf 99 (LCP 0.9s), a11y 100, BP 100, SEO 100.
- Note: `tree-empty.png` (+WebP) added as a spare per the brief; not yet used (mobile painting reads fine at full size). Build green throughout; PR "Hero painting + watercolour onboarding" opened against main.

---

## 2026-06-14 — Session 5: preloader replaces broken onboarding + hero fixes (branch `feat/hero-onboarding`, continues PR #4)
The session-4 three-frame onboarding rendered all layers at once (a collage). Replaced it and fixed two hero bugs.
- **Removed the broken onboarding**: deleted `Onboarding.astro`, its CSS, its `data-onboard` gate, and the `onboard-1`/`onboard-2` preloads. `onboard-3-hero` stays the permanent hero; `tree-empty` stays as an unused spare.
- **Hero bug A (stacked wordmark)**: "Pune" / "Bookies" were `display:block` (two lines). Made them inline → one line, black "Pune" + italic gulmohar "Bookies" (matching the navbar), sized `clamp(3rem, 9vw, 6.5rem)` with `white-space:nowrap`; ≤480px it gets a smaller `clamp(2.25rem,11vw,3.25rem)` and may wrap.
- **Hero bug B (overlap)**: the IG line collided with the absolute scroll-cue. Switched the hero from `place-items:center` to a **top-aligned flex column** (painting → wordmark → subcopy → stats → IG → cue), gave `.hero-inner width:100%`, capped the painting at `min(560px, 84vw, 70vh)` (≈39vh; 84vw leaves room for the 1.5rem side padding), and rebuilt the vh-aware gaps + a bottom padding that clears the cue. No overlaps, nothing absolutely-positioned over content.
- **Preloader** (`Preloader.astro`, homepage only, EVERY load): a cream overlay built on the single hero painting, mirroring the hero's classes/position (top-aligned) so the painting + wordmark line up exactly with the hero beneath — seamless handoff. The painting starts soft (`scale(1.03)`, `blur(6px)`, `saturate(.6)`, faded) and dries to sharp over ~900ms; the wordmark fades up ~350ms after; then the overlay dissolves. Duration tied to load: `Promise.race` of (image `complete` + `document.fonts.ready`) vs a ~1.4s cap, with a ~750ms minimum so warm refreshes stay light. Petals reuse the gulmohar motif (a few keep drifting on the live hero via the existing petal layer). Pre-paint `data-preload` gate (no sessionStorage); `prefers-reduced-motion` → `skip` (no overlay, hero instant). Overlay `aria-hidden`, skip `tabindex=-1` + Escape, body-level (`after-main` slot) so `z-index:9999` clears the navbar/ribbon, hero image preloaded.
- **Verification headache worth noting**: headless Chrome clamps `--window-size` to a 500px minimum, so "375px" screenshots rendered a 500px layout into a 375px canvas and *looked* clipped. Measured the true 375px layout via a same-origin 375px iframe: `scrollWidth 375`, wordmark/ tagline/painting all right-edges < 375, wordmark one line — no overflow. The earlier "overflow" was a tooling artifact; `84vw` + `width:100%` are nonetheless correct for real 375.
- Lighthouse `/` (desktop, lab): perf ≥90, a11y 100, BP 100, SEO 100 (gates held). Build green after each change; pushed to update PR #4.
