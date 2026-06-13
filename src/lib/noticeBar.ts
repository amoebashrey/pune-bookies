/**
 * Notice-strip copy logic.
 *
 * The strip's line depends on "today" relative to the next Sunday and on
 * the current IST clock (the 7–10 AM window). Because the site is
 * statically built, the truthful value is the visitor's load time — so
 * NoticeBar.astro renders a build-time baseline (correct without JS) and
 * a tiny inline script recomputes this same logic in the browser.
 *
 * All date maths run in IST: we shift "now" by +5:30 and read its UTC
 * fields, so getUTC* returns the IST wall-clock (same trick as the old
 * countdown). Keep this in sync with the inline port in NoticeBar.astro.
 */
export interface NoticeBarData {
  nextSundayDate: string;   // 'YYYY-MM-DD'
  time?: string;
  location?: string;
  overrideText?: string;
}

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** A Date whose UTC fields read as the current IST wall-clock. */
export function istNow(): Date {
  return new Date(Date.now() + IST_OFFSET_MS);
}

/** The visible notice-strip line for the given data and an IST 'now'. */
export function noticeText(d: NoticeBarData, now: Date = istNow()): string {
  const override = (d.overrideText ?? '').trim();
  if (override) return override;

  const time = (d.time ?? '').trim() || '8 AM';
  const location = (d.location ?? '').trim() || 'Mt. Carmel';

  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((d.nextSundayDate ?? '').trim());
  if (!m) return `next reading · ${time} · ${location}`;   // defensive: no/invalid date
  const y = Number(m[1]), mo = Number(m[2]), da = Number(m[3]);

  const next = Date.UTC(y, mo - 1, da);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const DAY = 86400000;
  const hour = now.getUTCHours();

  if (today === next) {
    if (hour >= 7 && hour < 10) return `reading happening now until 10 am · ${location} · come find us`;
    return `reading today · ${time} · ${location}`;
  }
  if (today + DAY === next) return `reading tomorrow · ${time} · ${location}`;
  if (today < next) {
    const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
    return `next reading · sunday, ${fmt.format(new Date(next))} · ${time} · ${location}`;
  }
  return `we're off this sunday — back the following week`;
}
