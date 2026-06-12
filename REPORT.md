# Banyan — the full-run report
*v2.0.0 "Banyan" · branch `overhaul/banyan` · 12 June 2026 · Phases 0–9 run end-to-end under the auto-run directive*

**TL;DR:** every audit P0 and 16/17 P1s fixed, /brands rebuilt as the evidence surface, the site re-housed in Astro with proven pixel parity, a complete Sanity CMS + Drive-sync + inquiry pipeline built and stubbed cleanly behind the credentials only you can create, and Lighthouse went from 64/88/96/100 to **93/100/100/100** on the homepage and 92/92/96/100 to **93/100/100/100** on /brands. Nothing is on production: the branch is pushed for a Vercel **preview**; merging stays your one command.

---

## 1. What was built, phase by phase (vs AUDIT.md)

**Phase 1 — audit fixes.** All six P0s: wrong years/founder/emails on /brands; `/brands` 404 (clean URLs + security headers + CSP via vercel.json); OG cards + favicon set + JSON-LD (the WhatsApp-share fix); "For brands" nav/footer links + the measured mobile bookmark/menu overlap (now 4px apart, both ≥44px); the countdown that claimed "happening now" from midnight. P1s: ~950 duplicated CSS lines extracted to one stylesheet; navbar ported to /brands (which gains a mobile menu it never had); bookmark watercolour edge restored; contrast tokens; focus states; honest hero stats; mailto obfuscation; image hygiene; semantic upgrades. Full ledger: **AUDIT.md → Status addendum** (P0 6/6, P1 16/17 — the 17th, live-server removal, landed via the Astro migration — P2s done, deferrals listed with reasons).

**Phase 2 — /brands.** Restructured warm-first: hero → manifesto (now says we *like* working with brands) → quiet press row (boxes gone) → **By the numbers** (count-up Fraunces numerals on watercolour underlines, hand-built organic SVG audience bars, named constants `BRANDS_STATS` in brands.js, a visible dry-voice footnote marking placeholders) → **Sundays with brands** (Penguin / Audible / Socials cards, `[PLACEHOLDER]` copy + photo slots) → who we're a fit for → things we won't do → money → people (Tanvi *founder*, Shrey *partnerships/ops/community*, Samruddhi *content*) → talk-to-us with the inquiry form + media-kit PDF. Motion: ambient drift off; **three petals parallax across the numbers section** as the only scroll motion; heading rules draw once in 220ms; quiet CTA after 60% (dismissible, hides while typing).

**Phase 3 — readers.** When/where/free answerable in seconds: location line under the countdown, IG pathway above the fold, photography FAQ. 375px verified by measurement on every route.

**Phase 6 — Astro.** Zero-visual-change re-housing: BaseLayout + 24 components, all CMS-bound copy in `src/content/site.ts`. **Pixel-diff proof:** /brands 0 pixels differ at 1440 *and* 375; homepage 0.007%/0.024% — verified to be only the ticking countdown and randomly-placed petals.

**Phases 4+8 — CMS.** `/studio`: 11 schemas, every field described in plain language, char limits tied to design constants (warn 90%/block 100%), required alt text, min image dims, settings singleton, inquiry CRM grouped by status, in-Studio guide ("How to log a Sunday — 5 steps"). Drive→Sanity sync (read-only service account, idempotent, human error messages), seed script, nightly export Action (artifacts, not commits — inquiries are personal data), STUDIO_SETUP.md written for a non-developer. Site fetches stories/FAQ/settings/stats/cases/people/press at build **with hardcoded fallback** — an empty section cannot ship. Homepage Sunday-photo gallery built behind `SHOW_SUNDAY_PHOTOS`.

**Phase 7 — measurement + pipeline.** `/api/inquiry`: honeypot + 3s min-time + IP rate limit (no captcha), then in parallel: team email, brand-voice auto-ack ("Got it. We read everything…"), Sanity CRM document. `track.js`: 9 named events, no-ops without Umami. ANALYTICS.md: UTM convention + the verified free-tier table.

**Phase 9 — credibility.** Colophon stamp in the footer ("second edition · banyan · june 2026") → `/colophon` *generated from CHANGELOG.md at build*; `/sunday.ics` (weekly RRULE, Asia/Kolkata) with a quiet add-to-calendar; `/privacy` in voice; DOMAIN_SETUP.md; SITE_URL as the single domain switch; squirrel 404; sitemap/robots.

**Phase 5 — QA.** Below.

## 2. The numbers

| Lighthouse | perf | a11y | best-practices | SEO |
|---|---|---|---|---|
| / before (live) | 64 | 88 | 96 | 100 |
| / after (lab, gzip) | **93** | **100** | **100** | **100** |
| /brands before | 92 | 92 | 96 | 100 |
| /brands after | **93** | **100** | **100** | **100** |

CLS **0** and TBT **0ms** on both. The perf jump came from **self-hosting the fonts** (the render-blocking Google Fonts chain measured 3.6–4.4s; same font binaries, now same-origin + preloaded). Production (brotli + CDN) should meet or beat the lab number. QA also verified: reduced-motion (no petals, instant stats, settled arrival, untilted stamp — countdown still ticks, that's information not motion), zero overflow/zero errors at 375px on all five routes, and a real WebKit render of both pages (SVG turbulence filters intact; bar edges differ sub-pixel from Chrome — organic by design).

## 3. Judgment calls made solo (full list in WORKLOG.md)
1. **Self-hosted fonts beyond the audit's "trim axes"** — measurement showed the third-party chain itself was the cost.
2. **Backups to Action artifacts, not repo commits** — inquiries are personal data; git history is forever.
3. **Brevo path added beside Resend** — verified: Resend can't email third parties without a domain we don't own yet.
4. **Bots get a cheerful 200** (honeypot/min-time) rather than an error to learn from.
5. **Cities mentioned, nothing linked** — your bracket for IG handles was empty.
6. **Visible placeholder footnote on /brands numbers** — a brand manager on the preview must not mistake scaffolding for claims.
7. **Kept per-item FAQ rule SVGs** over a DRY `<use>` trick — pixel-safety wins.
8. **Footer moved outside `<main>`** during migration (landmark correctness; no visual delta).
9. **Accepted** the build-time-only path-to-regexp advisory in the Vercel adapter (the "fix" is a major downgrade).
10. **`npm --cache /tmp`** to route around root-owned files in `~/.npm` rather than asking for sudo.

## 4. Deviations from the brief
- **Phase 2 was partly a build, not a polish** — the audit's plan correction held: numbers/case-studies/logos sections didn't exist.
- **OG cards generated by hand-built SVG→Chrome render**, not "our Gemini pipeline" (no such pipeline here). They're good; swap files in `/og/` if yours are better.
- **Sanity scheduled publishing: not on the free plan** (verified) → manual Saturday ritual documented in the Studio guide; optional `publishAt`+daily-cron pattern noted in ANALYTICS.md margins.
- **Umami presented as Cloud-Hobby *or* self-host** (both verified to fit, 30× headroom); mission said self-host — the recipe is written, but the choice is account-creation time, which is yours.
- **Round-trip demos** (gates 4/7) couldn't physically run without accounts — built to the credential boundary, stubbed behind env vars, documented exactly.

## 5. Verified free tiers (June 2026, official docs — details in ANALYTICS.md)
Sanity free: 20 seats / 10k docs / 100GB / 1M API + 5M CDN req — covers us; **scheduled publishing Growth-only**. Resend free: 3k/mo, 100/day — covers us; **domain required to mail third parties**. Brevo free: 300/day, single-sender OK — covers us today. Neon free: 0.5GB / 100 CU-hrs — runs Umami fine. Umami: self-host MIT free; Cloud Hobby 100k events/mo, **6-month retention**. Vercel Hobby: 1M invocations, 100 crons (once-daily max); **Web Analytics custom events Pro-only** → Umami it is.

## 6. Preview + screenshots
- Branch `overhaul/banyan` is pushed → Vercel builds a **preview URL** (visible in the Vercel dashboard / the GitHub PR check). Production untouched.
- Visual evidence on disk: `/tmp/pb-parity/` (before/after + pixel-diff maps), `/tmp/pb-shots/` (every section, both widths, WebKit, mobile QA). Key frames: brands numbers section (watercolour underlines + organic bars), colophon page, OG card, the 0-px diff maps.

## 7. NEEDS SHREY — the human list (in order)
1. **Look at the preview URL** (Vercel dashboard → pune-bookies → the overhaul/banyan deployment). Walk both pages on your phone.
2. **WhatsApp test (2 min):** paste the preview URL into any chat — the watercolour card should appear. (Cards are structurally correct; this is the only check that needs real WhatsApp.)
3. **Real numbers (15 min):** Instagram → Insights, fill `BRANDS_STATS` in `public/brands.js` + the same values in Studio→Stats later; delete the visible footnote in `src/components/brands/BrandsNumbers.astro`. Same for case-study dates/attendance/outcomes (`src/content/site.ts` → `brandCases`) and the media-kit PDF blanks.
4. **Sanity (1 hr, once):** follow `studio/STUDIO_SETUP.md` top to bottom (account → studio → service account → tokens → seed → invite Tanvi & Samruddhi → deploy hook). Then in Vercel env: `SANITY_PROJECT_ID`, `SANITY_WRITE_TOKEN`.
5. **Email (15 min):** create a free **Brevo** account, verify one sender address, set `BREVO_API_KEY` in Vercel env. (Resend graduates us later — see DOMAIN_SETUP.md §4.)
6. **Analytics (15 min):** pick Umami Cloud Hobby (fast) or self-host (ANALYTICS.md recipe); set the two `PUBLIC_UMAMI_*` env vars + add its origin to the CSP in vercel.json.
7. **GitHub secrets (5 min):** `SANITY_PROJECT_ID` + read-only `SANITY_AUTH_TOKEN` for the nightly backup Action.
8. **Domain, whenever:** DOMAIN_SETUP.md, top to bottom.
9. **Ship:** merge the PR (or `git checkout main && git merge overhaul/banyan && git push`). Then push the tag: `git push origin v2.0.0` and create the GitHub Release with the CHANGELOG v2.0.0 section as its notes.

## 8. Release state
- `package.json` 2.0.0 · CHANGELOG.md (Keep-a-Changelog, edition map, human language) · colophon live and generated · WORKLOG.md backfilled + every former gate logged · annotated tag **v2.0.0 created locally, deliberately not pushed** (the tag should point at what ships; push it at merge time).
