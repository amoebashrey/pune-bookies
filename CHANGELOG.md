# Changelog

All notable changes to the Pune Bookies site. Format follows [Keep a Changelog](https://keepachangelog.com/); written for humans — Tanvi should understand every line.

## Editions
*Semver lives in git; editions live on the site. MAJOR = the edition; every release under a MAJOR carries its tree name. Trees we'd actually read under, in order:*

| Edition | Tree | Versions | What it was |
|---|---|---|---|
| First | **Gulmohar** | v1.x | The site as first shipped — hero, manifesto, Sundays, the bookmark |
| Second | **Banyan** | v2.x | The /brands overhaul, the craft pass, Astro, the CMS era begins |
| (next) | Peepal | v3.x | reserved |
| (then) | Neem, Jamun, Kadamba, Amaltas, Tamarind, Champa, Ashoka | — | reserved, in order |

> The colophon page (/colophon) is generated from this file at build time. The `> colophon:` line under each release is the sentence that appears there — keep it human.

---

## [Unreleased]

### Added
- A notice strip across the top of every page, with Sanity-backed dynamic copy: it reads "reading today / tomorrow / next Sunday" from the next-Sunday date, the time and the location, and can be overridden with a one-off line.
- A "Write" link in the navbar (homepage and /brands), pointing straight at the inquiry form.
- A "What we're open to" section on /brands — the kinds of partnerships that usually fit.
- A longer silk-fabric partner ribbon with a gentle wind-breath.

### Changed
- The hero ribbon is now a 40×280 silk variant — sheen, fold lines, a faint weave, a swallowtail end.
- Homepage timeline bullets tightened for accuracy, with a "10:00 AM · We wrap up" step.
- "Who shows up" now says families come too — parents, children, grandparents.
- The "Curation" nav link is now "For Brands".
- The inquiry form reads plainer: "Get in touch", a one-line lead, a "Message" field, an optional brand field, and a plain "Send".
- The /brands intro and partnership framing rewritten around how we actually work with brands.

### Removed
- The countdown stamp under the hero (the notice strip does its job now).
- The "Where we read" specific locations from the homepage (they live in WhatsApp).
- The "Where the money goes" section on /brands.
- The defensive "Things we won't do" framing, replaced by "How we work with brands".

## [2.0.0] Banyan — June 2026

> colophon: We rebuilt the partnerships page around real evidence, fixed every wrong fact we could find, learned to make bookmarks properly, and gave the site a notebook so the team can edit it without calling a developer.

### Added
- A real "Partner with us" page: the numbers brands ask for, the Sundays we've done with Penguin, Audible and Socials, who we're a fit for, and a quiet form that reaches Tanvi and Shrey directly (with an honest auto-reply).
- A media kit PDF — the same notes, printable.
- Share cards: links pasted into WhatsApp now show a watercolour tree instead of a bare grey link. Plus a proper browser-tab icon.
- A countdown line that tells readers where the location drops (Saturday, 4:05 PM), and an "add to calendar" link for the Sunday itself.
- A content studio (Sanity): Sundays, photos via Google Drive sync, stories, FAQ, team, stats, press — all editable by the team, with a built-in guide. Partner inquiries land there too, sorted by status, like a tiny CRM.
- Counting, the polite kind: anonymous visit counts and a handful of events (no cookies, no tracking people). A privacy page that says exactly that.
- A 404 page with a squirrel who took the missing page.

### Changed
- The whole site now reads honestly: 250 readers on a Sunday and 43,900 Instagram followers are two different numbers, presented as two different numbers.
- The brands page leads with warmth and evidence; the "things we won't do" list still stands, just no longer as the opening line.
- The site moved to Astro under the hood — same pixels, saner bones, one shared stylesheet instead of two copies.
- Small-text colours darkened slightly so everything passes accessibility contrast; keyboard users get visible gulmohar focus marks.
- Petals: the brands page now keeps its petals for one quiet moment at the numbers section instead of drifting everywhere.

### Fixed
- The brands page said "since 2025" — it's 2024, and it says so everywhere now.
- Founder credit: Tanvi started Pune Bookies. The brands page used to say otherwise.
- The contact address on the brands page pointed at an email that doesn't exist (hello@punebookies.com). It now reaches Tanvi and Shrey's real inboxes.
- /brands used to 404 unless you typed /brands.html. Clean URLs everywhere now.
- The countdown claimed "happening now, under a tree" from midnight every Sunday. It now says that only between 8 and 10 AM.
- On phones, the partner ribbon sat on top of the menu button and stole its taps. They now live apart, both big enough for thumbs.
- Samruddhi was missing from the team section. She isn't anymore.

### Removed
- ~950 lines of duplicated styles, two dead footer links, a stray emoji in the hero, and the dev server with eight security advisories.

---

## [1.0.0] Gulmohar — June 2026

> colophon: The first edition — a watercolour tree, a manifesto, the Sunday timeline, three stories, and a gulmohar bookmark hanging off the right edge of every page.

### Added
- The site: hero with the hand-painted tree and sloth, manifesto, how-Sunday-works timeline, photo grid, three reader stories, FAQ, sister chapters, footer.
- The motion layer: arrival bloom (once per session), drifting petals, the library date-stamp countdown, smooth scrolling, paper grain, the click-bleed.
- The partner bookmark ribbon, and a first honest-notes page for brands.
