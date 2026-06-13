# Pune Bookies — Full Site Audit
*Phase 0 deliverable · 12 June 2026 · audited against the brand register (Fraunces/Lora, Paper/Ink/Gulmohar, watercolour, dry voice, restraint-as-luxury)*

**Repo state audited:** commit `62db162`, deployed at pune-bookies.vercel.app.
**Method:** every file read line-by-line; both pages rendered headless (Chrome) at 1440px and 375px; live deployment probed for headers/URLs; element positions measured programmatically; full git history scanned for secrets; npm audit run.

**One plan correction up front (standing rule: don't silently comply).** The mission brief says the /brands structure "exists (hero / manifesto / partner logos / case studies / numbers / what-we-care-about / team / talk-to-us)." It half-exists. What's actually on the page: hero / manifesto / press row / things-we-won't-do / where-the-money-goes / people / talk-to-us. There are **no partner logos, no case studies, no "By the numbers"** — and Penguin/Audible/Socials are mentioned nowhere on the site. Phase 2 is therefore partly a *build*, not just a polish pass. Priced into the plan below.

---

## A. Design craft audit — component by component

### A1. Navbar (homepage)
**What exists:** Recently redesigned (commit `62db162`) and it's the best component on the site. Fixed bar, transparent until 80px scroll, then paper at 94% + 8px blur. Wordmark left ("Pune" ink roman + "Bookies" gulmohar italic, Fraunces opsz 24, 19px). Three small-caps Lora links right (11px, 0.18em tracking, ink at 62%), gulmohar underline draws in 220ms on hover. Mobile: a text "menu" trigger (no hamburger ✓) opens a sliding stack.
**Verdict:** intentional, on-register (read.cv / Marginalian energy).
**Fixes:**
- Nav has only `#manifesto / #sundays / #stories` — **no link to /brands**, the primary conversion surface. The 14px bookmark ribbon is the *only* pathway sitewide. A brand manager skimming the homepage may never find the page. Add a quiet fourth link ("For brands") and a footer link.
- Link color `rgba(31,22,17,0.62)` ≈ 4.3:1 at 11px — under AA. Raise to 0.70 (≈ 4.9:1). Hover rule: `:hover` keeps color identical and only drops opacity to 0.95 — imperceptible; let the underline carry it (fine) but remove the no-op opacity.
- **Measured bug (375px):** the mobile bookmark tab (left 343–375, top 0–32, z-100) overlaps the "menu" toggle (left 323–355, top 22–36, z-50) by ~12px — the bookmark eats taps meant for the menu. Toggle's hit area is 32×14px (target should be ≥44×44).

### A2. Navbar (/brands) — divergent, older design
brands.html still has the *pre-redesign* header: different markup (`Pune <em>Bookies</em>`), different CSS (`mix-blend-mode: multiply`, 0.85rem links, no scrolled state — animations.js toggles `.scrolled` but brands.html has no CSS for it, so the header stays transparent and overlaps content when scrolling). Under 720px the nav is `display:none` with **no menu at all** — mobile visitors on the money page have no navigation except the wordmark.
**Fix:** port the homepage header verbatim (markup + CSS + toggle), links pointing back to homepage anchors. P1.

### A3. Hero (homepage)
**What exists:** inline-SVG watercolour tree (layered radial-gradient ellipses through an feTurbulence/feDisplacementMap filter), sloth with book, falling petal specks; "Pune" roman / "Bookies" gulmohar italic WONK 1 at clamp(4.5rem, 13vw, 9.5rem); Fraunces tagline; three-stat meta row; floating "↓ keep going" cue. Arrival bloom (canopy washes → trunk → wordmark inks on with wet-blur clip reveal → tagline → meta) runs once per session, gated pre-paint, 6s failsafe, reduced-motion safe.
**Verdict:** genuinely crafted. The arrival gate engineering (sessionStorage + failsafe + reveal-conflict neutralisation) is right.
**Fixes:**
- `🌳` system emoji inside a Fraunces italic line — the one non-watercolour pixel in the hero. Replace with a 0.9em inline SVG tree glyph in sage, or cut it.
- Stat reads "**43,900 / readers and counting**" — that's the Instagram follower count. A journalist will quote "43,900 readers" and a brand manager will catch the inflation — it reads as fudging to exactly the audience we're trying to impress. Make it honest and *stronger*: "250 readers, most Sundays" / "43,900 following along" / "4 cities".
- Wordmark optical centering: "Bookies" italic with WONK overhangs right; add `margin-left: -0.04em` on `.bookies` so the italic mass centers optically under "Pune".

### A4. Countdown / library date stamp
**What exists:** JS-built stamp under the hero — small-caps eyebrow "next gathering", Fraunces italic date with a petal flourish, live countdown line, all on a 220×120 gulmohar wash at 10% opacity, rotated 0.5°. Reduced-motion drops the tilt, keeps the tick. `aria-live="off"` ✓.
**Verdict:** lovely concept, two real bugs.
**Fixes:**
- **Logic bug:** on Sunday between 00:00–08:00 IST it says "happening now, under a tree." (`hour < ROLL_HOUR` only). Every Sunday pre-dawn — exactly when readers check before leaving home — the site lies. Condition must be `hour >= GATHER_HOUR && hour < ROLL_HOUR`; before 8 AM show the countdown to 8:00.
- **Layout shift:** the stamp is `insertAdjacentElement`'d after first paint, pushing everything below ~310px down. Put a fixed-height placeholder container in the HTML and let JS fill it — zero CLS risk instead of "probably below the fold."
- The reader's second question ("where?") isn't answered here. One small line under the countdown: "location drops Saturday, 4:05 PM, on WhatsApp" (it currently lives only mid-timeline). Phase 3 item.

### A5. Manifesto
**What exists:** centered eyebrow, 3.6rem display head with gulmohar em, 620px prose column, gulmohar Fraunces drop cap, pull quote framed by two 30px hairlines.
**Verdict:** on-register; closest thing to the Marginalian reference on the site.
**Fixes (craft-density):**
- Drop cap has no `filter: url(#dropcap-edge)` here (brands.html has one) — add the same watercolour-edge filter for consistency.
- No hanging punctuation anywhere; the pull-quote and pull rules are the spot for `hanging-punctuation: first` (Safari) + a `text-indent: -0.45ch` fallback on quoted lines. (Mission lists this for /brands; apply to both manifestos.)
- `.pull` max-width 24ch breaks "We don't charge for the cathedral." awkwardly at some widths; `text-wrap: balance` on `.pull` and all display h2s is a one-line craft win.

### A6. How Sunday works (timeline)
**What exists:** 7 rows, Fraunces gulmohar times right-aligned at 1.5rem, 14px dots (alternating filled) on a 1px gulmohar-faint gradient line, copy in Lora. Warm-paper gradient band behind.
**Verdict:** real data beautifully set — this is the craft-density the register asks for. Best section on the site.
**Fixes:** mobile (≤640px) the 4rem time column wraps "Sat, 4:05 PM" to three lines; widen to 5rem and drop to 1rem. The "Sat, 4:05 PM" row breaks the otherwise-morning sequence — consider a small "the day before" eyebrow on that row instead of cramming it into the time slot (P2, judgment call).

### A7. Atmosphere / photos
**What exists:** 12-col editorial grid, 6 Unsplash placeholders (staggered margins, 4/5–5/4 ratios, hover lift + caption), honest note: "our team has shot a year of Sundays. these are placeholders."
**Verdict:** grid architecture good; the placeholders are dark indoor bookshop/library shots — tonally opposite to sunlit-park-morning. They're admitted placeholders, so no copy fix; the *pipeline* for real photos is Phase 4.
**Fixes now:** `loading="lazy" decoding="async"` + explicit `width`/`height`; meaningful alt text; captions are hover-only (invisible to touch + screen readers) — mirror them into `alt`/`figcaption`. When real photos land: self-hosted AVIF/WebP with PNG fallback + the watercolour-paper frame treatment (Phase 4c).

### A8. Stories
**What exists:** three first-person notes, each with a small watercolour SVG mark (turbulence-roughened), Fraunces italic WONK titles, gulmohar bylines.
**Verdict:** the dry voice at its best ("Nothing happened. That was the whole event."). Keep every word.
**Fixes:** bylines `#c8553d` at 0.85rem ≈ 3.7:1 — under AA for small text. Darken small gulmohar text to `#a84634` (≈4.6:1) or set bylines in ink-soft with a gulmohar em-dash. Semantics: these are quotes — `<figure>/<blockquote>/<figcaption>` (P2).

### A9. FAQ
**What exists:** redesigned reading column (620px) — Fraunces italic questions, Lora answers, hand-drawn ink rule (SVG path, pathLength 1) draws under each question on first view, 400ms, once, reduced-motion shows it drawn.
**Verdict:** exactly the "meaning, not noise" philosophy. Answers are reader-priority gold ("Is it free?" / "Yes. Always.").
**Fixes:** the eight `faq-rule` SVGs are identical copy-paste — one `<defs>` path + `<use>` (hygiene). Old accordion-era border CSS still ships and gets overridden (dead weight, see A12).

### A10. Sister chapters + Come on Sunday + closing
**What exists:** four watercolour chapter marks (Bombay / Bengaluru / Jaipur / "Your city? Maybe"), three numbered steps with giant gulmohar italic numerals, closing line "And if it's not for you, that's fine too."
**Verdict:** on-voice. The dashed-circle "soon" mark is a nice quiet joke.
**Fixes:** chapters 2–4 reference chapter 1's SVG filter `url(#c1-rough)` across SVG boundaries — works inline today but breaks the moment anyone extracts an SVG; give each its own def or hoist one shared def (P2). Step 2 says the location goes out "every Saturday at 4:05 PM. Nothing else." — charming, keep.

### A11. Footer + bookmark
**What exists:** 3-col footer (contact / find us / network), hairline rules at 12% and 8%, footer wordmark. Gulmohar bookmark ribbon folded over the right edge, watercolour-edged (feTurbulence), rotated small-caps label, slides down 20px on hover, `is-active` deep-red state on /brands ✓.
**Verdict:** the bookmark is the single best brand idea on the site.
**Fixes:**
- **/brands bookmark lost its watercolour edge** — the `<rect>` in brands.html is missing `filter="url(#bookmark-edge)"` (index.html has it; the filter def sits unused in brands.html). Hard-edged rectangle on exactly the page where craft is being judged. One-attribute fix.
- **Dead links:** "WhatsApp groups" → `href="#"` with `target="_blank"` (opens a blank-ish tab); Bombay/Bengaluru/Jaipur → `href="#"`. For a press visitor, clicking three dead links = "abandoned site." Point at real destinations (the chapters' Instagram handles) or remove the column until they exist.
- No "For brands" link in the footer either (see A1).
- Footer headings are `<h5>` with no h4 ancestry on brands (heading-order lint); make them styled `<p>`/`<h2 class="visually-styled">` or fix levels (P2).

### A12. CSS architecture (affects every component)
~950 lines of CSS are duplicated wholesale between the two pages — brands.html carries the homepage's timeline, photo-grid, stories, network, come-steps, FAQ styles *unused*, plus three separate `<style>` blocks per page, a disabled `body::before` grain block kept as a comment relic, and two competing `::selection` rules (the static gulmohar-solid one is dead — animations.js injects the 22% one later). Before Phase 2 builds on /brands, extract a shared `styles.css` (single source of truth) + per-page blocks. Lower risk for every subsequent change; it's also a perf win (one cacheable file).

---

## B. Brand consistency audit

| # | Where | What's wrong | Should be |
|---|---|---|---|
| B1 | brands.html:1303 footer | "Reading together since **2025**" | **2024** (index.html footer correctly says 2024) |
| B2 | brands.html:1246 Shrey bio | "Started Pune Bookies in early **2025**" | **2024** |
| B3 | brands.html:1267, 1282, 1289 | Contact is `hello@punebookies.com` (×3) — per spec the real emails are Tanvi's and Shrey's gmails. **Partner enquiries from the conversion page currently go to an address that may not exist.** | `tanvi.lele3944@gmail.com` / `shreyasjadhav531@gmail.com` (index.html footer has these correctly) |
| B4 | brands.html people section | Team is Tanvi, Shrey + "everyone who shows up". **Samruddhi is missing** (spec: Tanvi, Shrey, Samruddhi) | Add Samruddhi — need her role/bio from you |
| B5 | brands.html:1195 | "happening every Sunday for almost two years" — started early 2024, it's June 2026: that's *over* two years and drifts staler daily | "every Sunday since early 2024" (self-updating phrasing) |
| B6 | index.html hero-meta | "43,900 readers and counting" — IG followers presented as readers (see A3) | honest split: 250 on a Sunday / 43,900 on Instagram |
| B7 | brands vs index narrative | brands says *Shrey* "started Pune Bookies"; homepage story byline is "*Tanvi, on starting this*" | pick one founding narrative (or "started by" both) — need your call |
| B8 | sitewide | "Bombay" (colonial-era) + "Bengaluru" (official) used side by side; brief says "Bangalore" | internally consistent, reads as deliberate; recommend keeping as-is, just confirming |
| B9 | spelling check | Tanvi ✓ Shrey ✓ (shreyasjadhav531 ✓) Samruddhi — absent (B4) | — |
| B10 | type/palette sweep | No sans-serif anywhere ✓; sage/terracotta/dusty-blue/gold confined to illustration ✓; gulmohar is the only UI accent ✓. Two deviations: the `🌳` emoji (A3) and the hard-edged press boxes (see Phase 2 notes) | — |
| B11 | voice on /brands | Page leads with refusals ("Things we won't do") before any warmth or evidence. The register says *warm toward brands* — we like working with them. Current order: hero → manifesto → press → refusals → money → people → contact. No evidence layer at all (no Penguin/Audible/Socials, no numbers, no outcomes) | Phase 2 restructure: warmth + evidence first, principles after |

## C. Security / hygiene audit

- **Secrets:** scanned every committed blob across all history (`git grep` over `rev-list --all`) — **clean**. No keys, tokens, or credentials ever committed. Only 7 files have ever been committed.
- **Headers (live-probed):** Vercel gives HSTS ✓. Missing: `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`. No `vercel.json` exists. A full CSP is awkward (inline styles/scripts by design + Google Fonts) but a pragmatic policy is doable; at minimum ship the four above. **P0 bundle with the URL fix below.**
- **`/brands` is a 404 on the live site** (no `cleanUrls`). Only `/brands.html` resolves. The mission, future printed/spoken references ("punebookies… slash brands"), and any partner deck will use `/brands`. Add `vercel.json` with `cleanUrls: true` + permanent redirect from `.html` paths. Also: no custom 404 page.
- **Mailto harvesting:** both gmails sit as plaintext `mailto:` in the HTML — prime scraper food. Obfuscate (entity-encode + JS-assembled at click) while keeping click-to-mail UX. Honest caveat: any obfuscation is best-effort; the real mitigation is spam filtering.
- **Dependencies:** `npm audit` → 8 vulnerabilities (4 moderate, 4 high), **all inside the `live-server` dev-dependency chain** (braces, chokidar-era, uuid/http-auth). Nothing ships to production (site is static; lenis is vendored). Fix: replace `live-server` with `vite` or `serve` (also nicer DX), or accept as dev-only.
- **No forms, no user input, no third-party JS** (lenis vendored ✓) — attack surface is essentially zero. `target="_blank"` links all carry `rel="noopener"` ✓.
- **Repo hygiene:** `illustrations/` (14MB of PNGs, all in `_unused/`) is untracked — good; don't commit originals, only optimized derivatives when used. `.DS_Store` properly ignored.

## D. Performance audit

Measured (headless Chrome, file://, so network latency excluded):

| Asset class | index.html | brands.html |
|---|---|---|
| Fonts (Google) | **352 KB** / 5 files | **440 KB** / 5 files |
| Images (Unsplash) | **489 KB** / 6 files | 0 |
| HTML | 56 KB | 35 KB |
| JS (lenis + animations) | 37 KB | 37 KB |
| **Total** | **~934 KB** | **~512 KB** |

- **Fonts are the #1 cost.** The Fraunces request pulls the full variable range (wght 300–900 + SOFT + WONK, roman *and* italic → 118–146 KB each). The site uses weight 400 exclusively. Trimming the axis request to `wght@400..600` should cut roughly 40% of font bytes. Keep full `opsz 9..144` (the design genuinely uses it — correct optical sizing at every size is in the register). Add `<link rel="preload">` for the two main woff2 files; `font-display: swap` already in place ✓; consider a `size-adjust` fallback `@font-face` so the swap doesn't visibly reflow the 9.5rem wordmark.
- **The feared "huge watercolour PNGs" don't exist in production** — the audit brief's assumption is happily wrong: every illustration is inline SVG (tiny, infinitely sharp, on-register). The 14MB PNG folder is untracked/unused. When any PNG does get used: AVIF/WebP + PNG fallback, ~100–200 KB budget each.
- **Unsplash placeholders:** 489 KB external dependency, no `loading="lazy"`, no `width/height` attrs (CSS `aspect-ratio` saves CLS, but be explicit). They'll be replaced by the Phase 4 pipeline; add lazy-loading now anyway.
- **Layout shift sources:** (1) countdown stamp injected post-paint (A4) — the one real CLS risk; (2) font swap reflow on the giant wordmark (mitigated by arrival bloom + size-adjust). Everything else is space-reserved.
- **Animation jank: clean.** Reveals, petals, bloom — all transform/opacity (petals even use `translate3d` + visibility-pause + dt-clamp; genuinely well-built). The only paint-heavy moments are the wordmark's one-time blur/clip-path ink-on (600ms, once per session — acceptable) and `backdrop-filter` on the scrolled header (small area, fine).
- **Smooth-scroll double-stack:** CSS `scroll-behavior: smooth` + Lenis — correctly reconciled (`.lenis-smooth` sets it to auto) ✓.
- **Lighthouse estimate (mobile, live network):** Performance ~80–87 (fonts + Unsplash), Accessibility ~88 (contrast hits below), Best Practices ~96, SEO ~75 (section F). Desktop: 95+ / 90 / 96 / 75. Post-fix targets: 95 / 100 / 100 / 100 on /brands.

## E. Accessibility audit

- **Contrast (computed against #F4ECD8 paper):**
  - `--ink` 13.9:1 ✓, `--ink-soft` 8.6:1 ✓
  - `--ink-faint` #7A6A55 ≈ **4.4:1 — fails AA** at the small sizes it's used (eyebrows 0.88rem, `.tiny` 0.78rem, hero-meta, photo-note, chapter subtitles, footer-bottom). Darken to ~`#6B5C47` (≈5.0:1); visually near-identical.
  - `--gulmohar` #C8553D ≈ **3.7:1 — fails AA for small text**: story bylines 0.85rem, footer h5 0.95rem, person roles 0.82rem, wont-list numerals. Fine for the big display italics (large-text 3:1 ✓). For small-size gulmohar, use a text-tuned `--gulmohar-text: #A84634` (≈4.6:1).
  - Nav links ink@62% ≈ 4.3:1 at 11px — raise to 70%.
  - Bookmark label: ink on gulmohar ≈ 4.1:1 at 9px — bump to 10px / use `--paper` text (paper-on-gulmohar ≈ 3.4:1 at small-caps is worse; better: darken ribbon under text or accept since `aria-label` duplicates it; recommend 10px + ink).
- **Focus states: none defined.** Default UA ring only, and the bookmark's ring is half off-screen (`top: -20px`). Add a global `:focus-visible { outline: 2px solid var(--gulmohar); outline-offset: 3px; }` + an inset variant for the bookmark.
- **Keyboard:** all interactive elements are real `<a>`/`<button>` ✓; Lenis preserves native keyboard scrolling ✓; but the Lenis anchor-click handler scrolls without moving focus — add `target.focus({preventScroll:true})` + `tabindex="-1"` on section targets so keyboard/SR users land where the page scrolled.
- **Tap targets (measured):** mobile "menu" toggle is 32×14px and the bookmark overlaps its right 12px (A1). Both need ≥44×44 hit areas and a non-overlapping layout (e.g. bookmark `right: 64px` on mobile, or below the header line).
- **Reduced motion: genuinely comprehensive** — arrival, petals, Lenis, click-bleed, FAQ draw, reveals, scroll-cue, stamp tilt, bookmark slide all gated ✓. (Rare to see; preserve this standard in Phase 2.)
- **Semantics:** one `<h1>` per page ✓, landmarks ✓, `aria-expanded`/`aria-controls` on the toggle ✓, `aria-current="page"` on the active bookmark ✓, `aria-live="off"` on the ticking countdown ✓ (correct — avoids per-second SR announcements). Gaps: photo alts are stubs ("Reading", "Books in grass") and hover-only captions are invisible to SR/touch — use `figure/figcaption`; person names on /brands are `<h4>` under `<h2>` (skips h3); timeline would read better as an `<ol>`; `lang="en"` could be `en-IN` (P2).

## F. SEO / meta audit

Present: unique titles + meta descriptions on both pages ✓, single h1s ✓, semantic landmarks ✓.

Missing — all of it (this is the thinnest area of the site):
- **No Open Graph / Twitter card tags at all.** Stated fact: most links get shared in WhatsApp → today a share renders as a bare grey link with no image, no description. A watercolour OG card (1200×630, tree + wordmark on paper, ~80 KB jpg) is arguably the highest-leverage single asset in this whole audit. Per-page `og:title/description/url/image` + `twitter:card=summary_large_image`.
- **No favicon of any kind** (404s live). Browser tabs show the default globe — visible in every screenshot a brand manager forwards. Ship `favicon.svg` (watercolour petal/tree mark), `favicon.ico`, `apple-touch-icon.png` (180×180), `theme-color: #F4ECD8`.
- **No robots.txt, no sitemap.xml** (both 404 live). Trivial to add; do it with the vercel.json work.
- **No canonical URLs** — matters once `/brands` and `/brands.html` both resolve (C item).
- **No JSON-LD.** Add `Organization` (name, url, logo, sameAs: Instagram, foundingDate: 2024) + a recurring `Event` ("Sunday reading — Pune Bookies", `eventSchedule` weekly Sunday 08:00–10:00 IST, `isAccessibleForFree: true`, location "Pune — announced Saturdays"). Google can surface the weekly event; press gets structured facts.

---

## Prioritized fix list

### P0 — ship-blockers (wrong facts, broken paths, naked shares)
| # | Fix | Files |
|---|---|---|
| P0-1 | Founding year: "since 2025" → 2024; "started in early 2025" → 2024 | brands.html |
| P0-2 | Contact email: replace `hello@punebookies.com` ×3 with Tanvi/Shrey gmails (match index footer) | brands.html |
| P0-3 | `vercel.json`: `cleanUrls: true`, redirect `/brands.html → /brands` (308), security headers (nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy), custom 404 page | new files |
| P0-4 | OG/Twitter meta + watercolour OG image + favicon set + theme-color (WhatsApp share presentation) | both pages + assets |
| P0-5 | Route to /brands: "For brands" nav link + footer link on homepage; fix mobile bookmark/menu overlap + tap-target sizes | index.html, brands.html |
| P0-6 | Countdown: "happening now" only 08:00–10:00 IST Sunday (currently fires from midnight) | animations.js |

### P1 — quality (correct, consistent, accessible, fast)
| # | Fix |
|---|---|
| P1-1 | Extract shared `styles.css`; delete ~950 duplicated/dead lines (incl. disabled grain block, dead `::selection`, unused homepage CSS in brands.html) — do this *before* Phase 2 builds on it |
| P1-2 | Port redesigned homepage navbar to /brands (incl. mobile menu, scrolled state) |
| P1-3 | Restore watercolour edge on /brands bookmark (`filter` attr on the rect) |
| P1-4 | Contrast pass: ink-faint → #6B5C47; small-size gulmohar text → #A84634; nav links 62%→70% |
| P1-5 | `:focus-visible` styles sitewide + bookmark focus treatment + anchor-focus management |
| P1-6 | Hero stat honesty: followers vs readers split (B6) |
| P1-7 | "almost two years" → "every Sunday since early 2024" (B5); founding-narrative call (B7 — needs your answer) |
| P1-8 | Add Samruddhi to people section (needs role/bio from you) |
| P1-9 | Dead links: WhatsApp `#`, network `#` ×3 — real hrefs or remove until real |
| P1-10 | Fonts: trim wght axis to 400..600, preload the two main woff2, size-adjust fallback |
| P1-11 | Countdown CLS: reserve the stamp's space in static HTML |
| P1-12 | Images: lazy-loading, dimensions, real alt text, figcaption |
| P1-13 | Mailto obfuscation (entity + JS-assembled) |
| P1-14 | brands hero: remove hard `<br>`s, `text-wrap: balance` (kills the "been" orphan); same on display h2s and pull quotes |
| P1-15 | JSON-LD (Organization + weekly Event), robots.txt, sitemap.xml, canonicals |
| P1-16 | Timeline mobile time-column wrap fix (5rem col, 1rem size) |
| P1-17 | Replace `live-server` with `vite`/`serve` (kills all 8 dev-only npm vulns) |

### P2 — nice
🌳 emoji → inline SVG glyph · per-SVG filter defs (no cross-SVG refs) · FAQ rule via `<use>` · stories as figure/blockquote · timeline as `<ol>` · person h4→h3 · `lang="en-IN"` · click-bleed: skip when clicking links/buttons · manifesto drop-cap watercolour filter on homepage · hanging punctuation on pull quotes · "the day before" eyebrow on the Saturday timeline row · footer h5 heading-order cleanup

### Deferred by design (not bugs)
- Petal drift runs site-wide including /brands — Phase 2's "one signature moment" rule will *reduce* motion on /brands (drift off, petals only at the numbers section). Flagging so the change is deliberate.
- Unsplash placeholder photos stay until the Phase 4 Drive pipeline delivers real ones.
- /brands evidence layer (numbers, case studies, Penguin/Audible/Socials, "who we're a fit for") = Phase 2 scope, see plan correction at top.

### Questions for you (blocking none of P0, shaping P1/P2)
1. **Founding narrative** (B7): who "started" it — Shrey, Tanvi, or both?
2. **Samruddhi**: role + one-line bio?
3. **`punebookies.com`**: do you own the domain / does `hello@` exist anywhere? (Determines whether P0-2 is a replacement or an alias note.)
4. **Network links**: do Bombay/Bengaluru/Jaipur have Instagram handles to link, or remove the column for now?

---

# STATUS ADDENDUM — post-Banyan build (12 June 2026, branch overhaul/banyan)

## P0 — all six fixed
P0-1 years ✓ (a436f8f) · P0-2 emails ✓ (a436f8f) · P0-3 clean URLs + headers ✓ (6323ea2, revised for Astro in baf0145) · P0-4 OG/favicon/JSON-LD ✓ (a94917a) · P0-5 brands route + mobile overlap ✓ (a94917a, measured) · P0-6 countdown window ✓ (965406e)

## P1 — 16 of 17 fixed
P1-1 shared stylesheet ✓ · P1-2 navbar port ✓ · P1-3 bookmark filter ✓ · P1-4 contrast ✓ (and beyond: a11y 100) · P1-5 focus states ✓ · P1-6 stats honesty ✓ · P1-7 since-2024 phrasing ✓, founder credit resolved (Tanvi — owner's answer) · P1-8 Samruddhi ✓ · P1-9 dead links ✓ (cities unlinked per owner: no handles supplied) · P1-10 fonts ✓ (exceeded: self-hosted, render-blocking chain removed) · P1-11 countdown CLS ✓ (CLS 0 measured) · P1-12 image hygiene ✓ · P1-13 mailto obfuscation ✓ · P1-14 brands hero rag ✓ · P1-15 JSON-LD/robots/sitemap/canonicals ✓ · P1-16 timeline mobile column ✓ · P1-17 live-server removed ✓ (replaced by astro dev)

## P2 — done
emoji→SVG glyph · click-bleed skips controls · figure/blockquote stories · ol timeline · heading levels (now fully sequential, a11y 100) · lang en-IN · drop-cap filter on homepage · hanging punctuation + text-wrap balance · per-page shared defs hoisted

## Consciously deferred
- FAQ rule SVGs stay per-item (rejected <use>+inherited-dash: pixel-safety over DRY)
- Cross-SVG filter refs remain (shared defs in same document — works everywhere tested incl. WebKit)
- path-to-regexp advisory inside @astrojs/vercel (build-time only; "fix" is an adapter downgrade)
- Real partnership numbers/dates/photos: placeholders clearly marked, awaiting owner data (NEEDS SHREY)
- WhatsApp paste-test of OG cards: needs the preview URL in a real WhatsApp chat (2-minute human check)
