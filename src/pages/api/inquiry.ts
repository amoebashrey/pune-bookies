/**
 * POST /api/inquiry — the partner inquiry pipeline.
 *
 * Spam guards (no captcha, ever): honeypot field, minimum-time trap,
 * per-IP rate limit. Then, in parallel:
 *   1. email the inquiry to the team (Resend, or Brevo as fallback)
 *   2. auto-acknowledge the inquirer in brand voice
 *   3. create a partnerInquiry document in Sanity (the CRM)
 *
 * Degrades honestly: with no providers configured it returns 503 and
 * the form shows the mailto fallback. Bots get a cheerful 200 and
 * nothing happens — arguing with bots is a waste of everyone's time.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

// ---- named constants ----------------------------------------
const SPAM = {
  MIN_ELAPSED_MS: 3000,        // humans don't fill four fields in 3s
  RATE_LIMIT_WINDOW_MS: 10 * 60 * 1000,
  RATE_LIMIT_MAX: 5,           // per IP per window (per warm instance)
};
const FIELD_MAX = { name: 120, brand: 160, email: 200, message: 4000 };

const TEAM_TO = (import.meta.env.INQUIRY_TO || 'tanvi.lele3944@gmail.com,shreyasjadhav531@gmail.com')
  .split(',').map((s: string) => s.trim()).filter(Boolean);
// NOTE: Resend requires a verified domain to send to third parties.
// Until punebookies.com exists, Brevo (verified single sender) is the
// realistic provider — see ANALYTICS.md → "email provider decision".
const FROM = import.meta.env.INQUIRY_FROM || 'Pune Bookies <onboarding@resend.dev>';

const ACK_SUBJECT = 'Got it — Pune Bookies';
const ACK_BODY = `Got it. We read everything — we'll write back within a few days.

— Tanvi & Shrey, Pune Bookies
pune-bookies.vercel.app/brands`;

// best-effort per-instance rate limit (serverless instances are
// ephemeral; this stops bursts, not campaigns — the honeypot and
// min-time trap do the heavier lifting)
const hits = new Map<string, { n: number; t: number }>();
const limited = (ip: string) => {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > SPAM.RATE_LIMIT_WINDOW_MS) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > SPAM.RATE_LIMIT_MAX;
};

// ---- providers ----------------------------------------------
async function sendResend(to: string[], subject: string, text: string, replyTo?: string) {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}

async function sendBrevo(to: string[], subject: string, text: string, replyTo?: string) {
  const key = import.meta.env.BREVO_API_KEY;
  if (!key) return false;
  const m = FROM.match(/^(.*)<(.+)>$/);
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: m ? { name: m[1].trim(), email: m[2].trim() } : { email: FROM },
      to: to.map((email) => ({ email })),
      subject,
      textContent: text,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  return true;
}

/** try Resend first, Brevo second; false = nothing configured */
async function sendMail(to: string[], subject: string, text: string, replyTo?: string) {
  if (import.meta.env.RESEND_API_KEY) return sendResend(to, subject, text, replyTo);
  if (import.meta.env.BREVO_API_KEY) return sendBrevo(to, subject, text, replyTo);
  return false;
}

async function createInquiryDoc(d: { name: string; brand: string; email: string; message: string }) {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const token = import.meta.env.SANITY_WRITE_TOKEN;     // server-only, never PUBLIC_
  if (!projectId || !token) return false;
  const dataset = import.meta.env.SANITY_DATASET || 'production';
  const res = await fetch(`https://${projectId}.api.sanity.io/v2026-01-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mutations: [{
        create: {
          _type: 'partnerInquiry',
          ...d,
          createdAt: new Date().toISOString(),
          source: 'form',
          status: 'new',
        },
      }],
    }),
  });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  return true;
}

// ---- the route ----------------------------------------------
export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: any;
  try { body = await request.json(); } catch { return new Response('bad json', { status: 400 }); }

  const name = String(body.name ?? '').trim().slice(0, FIELD_MAX.name);
  const brand = String(body.brand ?? '').trim().slice(0, FIELD_MAX.brand);
  const email = String(body.email ?? '').trim().slice(0, FIELD_MAX.email);
  const message = String(body.message ?? '').trim().slice(0, FIELD_MAX.message);

  if (!name || !brand || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return new Response('missing or invalid fields', { status: 422 });
  }

  // spam guards — bots get a happy 200 and an empty afternoon
  if (String(body.website ?? '') !== '') return new Response(null, { status: 200 });
  if (Number(body.elapsedMs ?? 0) < SPAM.MIN_ELAPSED_MS) return new Response(null, { status: 200 });
  if (limited(clientAddress ?? 'unknown')) return new Response('slow down', { status: 429 });

  const teamText =
    `New partner inquiry via the website\n\n` +
    `Name:  ${name}\nBrand: ${brand}\nEmail: ${email}\n\n${message}\n\n` +
    `— reply directly to this email, it reply-tos the inquirer.`;

  const results = await Promise.allSettled([
    sendMail(TEAM_TO, `Partner inquiry — ${brand}`, teamText, email),
    sendMail([email], ACK_SUBJECT, ACK_BODY),
    createInquiryDoc({ name, brand, email, message }),
  ]);

  const outcomes = results.map((r) => (r.status === 'fulfilled' ? r.value : `ERR: ${r.reason}`));
  const anySucceeded = outcomes.some((o) => o === true);
  const anyConfigured = outcomes.some((o) => o !== false);

  // log failures loudly for the function logs, never to the visitor
  outcomes.forEach((o, i) => {
    if (typeof o === 'string') console.error(`[inquiry] step ${['team-mail', 'ack-mail', 'sanity'][i]} failed: ${o}`);
  });

  if (!anyConfigured) {
    console.error('[inquiry] no provider configured — set RESEND_API_KEY/BREVO_API_KEY and/or SANITY_* env vars');
    return new Response('not configured', { status: 503 });
  }
  return new Response(null, { status: anySucceeded ? 200 : 502 });
};
