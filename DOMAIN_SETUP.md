# When punebookies.com happens
*Everything that needs to change, in order, written for whoever does it (45 minutes, once).*

The site is built so the domain switch is **one environment variable** plus the steps below. All canonical URLs, OG tags and JSON-LD derive from `SITE_URL`.

## 1. Buy the domain (10 min)
1. Use any registrar — Cloudflare Registrar (at-cost pricing, and we want Cloudflare anyway for step 3) or Namecheap/GoDaddy.
2. Buy **punebookies.com**. Consider punebookies.in at the same time — cheap insurance.

## 2. Attach it to Vercel (10 min)
1. Vercel → the website project → **Settings → Domains** → Add → `punebookies.com` (and `www.punebookies.com`, redirecting www → apex).
2. Vercel shows you one or two DNS records (an A record and/or CNAME). Add them wherever the domain's DNS lives (Cloudflare dashboard if Cloudflare; the registrar's DNS panel otherwise).
3. Wait for the green tick (minutes to an hour).
4. Vercel → Settings → **Environment Variables** → set `SITE_URL=https://punebookies.com` → Redeploy. Canonicals, OG URLs and the sitemap references now all point at the new domain.

## 3. hello@ and partnerships@ → the team's Gmails, free (15 min)
Cloudflare **Email Routing** forwards unlimited addresses at no cost. (If DNS isn't on Cloudflare yet: add the site to a free Cloudflare account and point the domain's nameservers at it first — the registrar email tells you how.)

1. Cloudflare dashboard → the domain → **Email → Email Routing** → Enable. It adds the MX/TXT records itself.
2. Create addresses:
   - `hello@punebookies.com` → forward to **both** tanvi.lele3944@gmail.com and shreyasjadhav531@gmail.com (create the route twice or use a destination list)
   - `partnerships@punebookies.com` → same two
3. Cloudflare emails each Gmail a verification link — click them.
4. Send a test to both addresses. Done: incoming mail works.
5. *(Optional, for replies to come FROM hello@)*: Gmail → Settings → Accounts → "Send mail as" → add hello@punebookies.com via Gmail's SMTP. Not required; replying from the personal Gmail is fine and arguably more in-voice.

## 4. The inquiry form graduates to Resend (10 min)
With a real domain, Resend's free tier (3,000/mo — verified June 2026) can send to anyone:
1. resend.com → Domains → Add `punebookies.com` → add the 3 DNS records it shows (SPF/DKIM) → verify.
2. Vercel env: `RESEND_API_KEY=<key>` and `INQUIRY_FROM=Pune Bookies <sundays@punebookies.com>` → redeploy.
3. Remove `BREVO_API_KEY` if it was set. The endpoint prefers Resend automatically.

## 5. The copy swap
Once mail works, the site may *say* hello@punebookies.com:
1. `src/content/site.ts` → `contacts`: change emails to `hello@punebookies.com` (or keep per-person Gmails — owner's call; the audit's only rule was *never show a dead address*).
2. Studio → Site settings → contacts: same change there (CMS overrides the file).
3. `INQUIRY_TO` env var: can stay on the Gmails (forwarding makes it equivalent).

## 6. Afterwards
- Old vercel.app URLs keep working (Vercel serves both; canonicals point at the new domain, so search engines migrate on their own).
- Update the Instagram bio link (with UTMs — see ANALYTICS.md).
- `public/sunday.ics` and `public/robots.txt`/`sitemap.xml` carry the literal old origin — search-replace to the new domain in the same PR as the env change (the only two files where the origin is written by hand).
