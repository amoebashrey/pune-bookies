# Measurement — what we count and how
*We don't track people. We count visits. No cookies, no consent banner needed, nothing personal stored.*

## The stack (and the verified free-tier math, June 2026)

**Decision: Umami, with two equally-good homes — pick one when creating accounts.**

| Option | Verified limits (official docs, June 2026) | Trade-off |
|---|---|---|
| **A. Umami Cloud, Hobby (recommended start)** | 100k events/mo, 3 websites, 6-month retention, free forever ([umami.is/pricing](https://umami.is/pricing)) | Zero maintenance. Retention capped at 6 months (was 1 year — they cut it in late 2024). |
| **B. Umami self-hosted on Vercel + Neon** | Umami is MIT/open source, no gating. Neon free: 0.5GB storage, 100 CU-hrs compute/project/mo, autosuspend after 5 min ([neon.com/pricing](https://neon.com/pricing)) | Indefinite retention, fully ours. Costs a separate Vercel project + Postgres to babysit; Neon cold-starts (~0.5s) on first event after idle — fine for analytics. At our volume (~ a few thousand events/mo vs 100k allowance) both fit with 30× headroom. |

**Why not Vercel Web Analytics:** verified — on the Hobby plan **custom events are Pro-only** (pageviews only, 50k events/mo, collection pauses over limit; [docs](https://vercel.com/docs/analytics/limits-and-pricing)). Our whole point is the event list below, so Vercel Analytics is out as the primary. The mission's "self-host Umami" remains fully viable on the verified Neon limits; Cloud Hobby is the lower-maintenance start with the same event API and an easy later migration (both run the same script tag).

### Wiring (either option)
1. Create the Umami website entry → copy the **script URL** and **website ID**.
2. In Vercel (site project) → Environment Variables:
   - `PUBLIC_UMAMI_SRC` = the script URL (e.g. `https://cloud.umami.is/script.js` or our self-hosted `https://stats.<domain>/script.js`)
   - `PUBLIC_UMAMI_WEBSITE_ID` = the website ID
3. Add the Umami origin to the CSP in `vercel.json` → `script-src` and `connect-src` (it currently allows only `'self'`).
4. Redeploy. Without these vars the site ships **zero analytics code paths active** — `track.js` no-ops.

### Self-host recipe (option B, ~1 evening)
1. Neon: create project `umami` → copy the Postgres connection string.
2. Vercel: New Project → import `umami-software/umami` from GitHub → env `DATABASE_URL` = the Neon string, `APP_SECRET` = any long random string → deploy.
3. Log in (default `admin`/`umami`, change immediately) → add website `pune-bookies.vercel.app` → take script URL + ID → step 2 above.

## The events
One module (`public/track.js`), named constants, never blocks the page:

| Event | Fires |
|---|---|
| `bookmark_click` | the ribbon, any page |
| `brands_view` | /brands pageload |
| `brands_scroll_75` | once, at 75% depth on /brands |
| `talk_to_us_view` | once, when the talk section is 30% visible |
| `inquiry_submitted` | successful form submit |
| `mailto_click` | any obfuscated email link |
| `ig_outbound` | any Instagram link |
| `media_kit_click` | the PDF link |
| `calendar_add` | the .ics link under the countdown |

The success metric from the mission brief reads as: `brands_view → talk_to_us_view → inquiry_submitted` as a funnel, with `bookmark_click` as the entry source.

## UTM convention — for links WE place elsewhere
Add these to links in the Instagram bio, WhatsApp pins, and partner emails. Lowercase, snake_case campaigns, never invent new sources.

```
?utm_source=instagram&utm_medium=bio&utm_campaign=evergreen
?utm_source=instagram&utm_medium=story&utm_campaign=<what>_<mon-yyyy>   e.g. brands_jun-2026
?utm_source=whatsapp&utm_medium=group&utm_campaign=location_ping
?utm_source=whatsapp&utm_medium=dm&utm_campaign=<what>_<mon-yyyy>
?utm_source=email&utm_medium=outreach&utm_campaign=<brand>_<mon-yyyy>   e.g. penguin_jul-2026
```

Rules:
- `utm_source` ∈ {instagram, whatsapp, email, press} — nothing else, ever.
- `utm_medium` says where within the source (bio / story / group / dm / outreach / article).
- `utm_campaign` says why, with a month stamp when it's not evergreen.
- The /brands link in outreach mail: `https://pune-bookies.vercel.app/brands?utm_source=email&utm_medium=outreach&utm_campaign=<brand>_<mon-yyyy>`

## The inquiry email provider (Phase 7 finding that matters)
Verified: **Resend free** = 3,000/mo, 100/day, 1 domain — but **without a verified domain it can only send to the account owner's own address** (sandbox). We don't own punebookies.com yet, so on day one Resend cannot email the inquirer's auto-ack or the second team inbox.
**Brevo free** = 300 emails/day and supports a verified **single sender** (a gmail works) — no domain needed.

So the endpoint supports both, preferring Resend when configured:
- **Now (no domain):** set `BREVO_API_KEY` (+ verify one sender address in Brevo). Everything works today.
- **After the domain exists:** set `RESEND_API_KEY` + `INQUIRY_FROM="Pune Bookies <sundays@punebookies.com>"` and Resend takes over.

Env reference (`.env.example` at the repo root mirrors this):
`RESEND_API_KEY` · `BREVO_API_KEY` · `INQUIRY_TO` · `INQUIRY_FROM` · `SANITY_PROJECT_ID` · `SANITY_DATASET` · `SANITY_WRITE_TOKEN` (server-only) · `PUBLIC_UMAMI_SRC` · `PUBLIC_UMAMI_WEBSITE_ID` · `SHOW_SUNDAY_PHOTOS` · `SITE_URL`
