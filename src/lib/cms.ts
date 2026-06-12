/**
 * Build-time CMS bridge.
 *
 * Every getter tries Sanity and falls back to src/content/site.ts —
 * the site can NEVER build an empty section. No Sanity env vars set
 * (the current state) simply means "always fallback", silently.
 *
 * Env (build-time only, none of it reaches the client):
 *   SANITY_PROJECT_ID, SANITY_DATASET (default 'production')
 *   SHOW_SUNDAY_PHOTOS=true  — feature flag for the homepage gallery
 */
import {
  settings as fallbackSettings,
  stories as fallbackStories,
  faqs as fallbackFaqs,
  press as fallbackPress,
  brandStats as fallbackStats,
  brandCases as fallbackCases,
  people as fallbackPeople,
} from '../content/site';

const PROJECT_ID = import.meta.env.SANITY_PROJECT_ID;
const DATASET = import.meta.env.SANITY_DATASET || 'production';
const API_VERSION = '2026-01-01';

async function groq<T>(query: string): Promise<T | null> {
  if (!PROJECT_ID) return null;   // no CMS configured → fallback, quietly
  try {
    const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    const json = await res.json();
    return (json.result ?? null) as T | null;
  } catch (err) {
    // loud in the build log, invisible to visitors — fallback content ships
    console.warn(`[cms] falling back to hardcoded content: ${(err as Error).message}`);
    return null;
  }
}

const usable = <T>(rows: T[] | null) => (rows && rows.length ? rows : null);

export async function getStories() {
  const rows = await groq<{ title: string; body: string; byline: string }[]>(
    `*[_type=="story" && visible==true] | order(order asc) [0...3]{title, body, byline}`
  );
  // CMS stories don't carry the watercolour marks — pair them with the
  // existing three marks by position (marks are design, not content)
  return usable(rows)
    ? rows!.map((r, i) => ({ ...r, mark: fallbackStories[i % fallbackStories.length].mark }))
    : fallbackStories;
}

export async function getFaqs() {
  const rows = await groq<{ q: string; a: string }[]>(
    `*[_type=="faqItem" && visible==true] | order(order asc) {"q": question, "a": answer}`
  );
  return usable(rows) ?? fallbackFaqs;
}

export async function getSettings() {
  const row = await groq<any>(
    `*[_type=="siteSettings"][0]{heroTagline, heroStress, igHandle, igUrl, contacts, countdownWhereLine}`
  );
  if (!row) return fallbackSettings;
  return {
    ...fallbackSettings,
    heroTagline: row.heroTagline ?? fallbackSettings.heroTagline,
    heroStress: row.heroStress ?? fallbackSettings.heroStress,
    igHandle: row.igHandle ?? fallbackSettings.igHandle,
    igUrl: row.igUrl ?? fallbackSettings.igUrl,
    contacts: row.contacts?.length
      ? row.contacts.map((c: any) => {
          const [user, domain] = String(c.email).split('@');
          return { name: c.name, user, domain };
        })
      : fallbackSettings.contacts,
  };
}

export async function getStats() {
  const rows = await groq<{ value: string; label: string }[]>(
    `*[_type=="siteStat" && visible==true] | order(order asc) {value, label}`
  );
  return usable(rows)
    ? rows!.map((r) => {
        // split a trailing % or + into the styled .unit span
        const m = String(r.value).match(/^(.*?)([%+])$/);
        return { key: '', value: m ? m[1] : r.value, unit: m ? m[2] : '', label: r.label };
      })
    : fallbackStats;
}

export async function getCases() {
  const rows = await groq<{ title: string; meta: string; body: string }[]>(
    `*[_type=="collaboration" && featured==true] | order(order asc) {
      title,
      "meta": coalesce(string(date), "[PLACEHOLDER] date") + " · " + coalesce("~" + string(attendance) + " readers", "attendance TBC"),
      "body": coalesce(fullStory, shortDescription, "")
    }`
  );
  return usable(rows) ?? fallbackCases;
}

export async function getPeople() {
  const rows = await groq<{ name: string; role: string; bio: string }[]>(
    `*[_type=="teamMember" && visible==true] | order(order asc) {name, role, bio}`
  );
  return usable(rows) ?? fallbackPeople;
}

export async function getPress() {
  const rows = await groq<{ outlet: string }[]>(
    `*[_type=="pressMention" && visible==true] | order(date desc) {outlet}`
  );
  return usable(rows) ?? fallbackPress;
}

/** Homepage gallery — only when the flag is on AND real photos exist. */
export async function getSundayPhotos() {
  if (import.meta.env.SHOW_SUNDAY_PHOTOS !== 'true') return null;
  const rows = await groq<{ url: string; alt: string; cap: string }[]>(
    `*[_type=="sunday" && featured==true && count(syncedImages) > 0] | order(date desc) [0]
      .syncedImages[0...4]{
        "url": asset->url + "?w=900&q=80&auto=format",
        "alt": coalesce(alt, "A Sunday with Pune Bookies"),
        "cap": ""
      }`
  );
  return usable(rows);
}
