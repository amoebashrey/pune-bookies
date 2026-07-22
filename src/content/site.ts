/**
 * The content layer.
 *
 * Everything in this file is copy that will eventually come from the
 * CMS (Phase 8 wires these exact shapes to Sanity, with this file as
 * the hardcoded fallback so the site can never build empty).
 * Components import from here; none of them hardcode prose.
 */

export const settings = {
  siteName: 'Pune Bookies',
  foundingYear: 2024,
  igHandle: '@pune_bookies',
  igUrl: 'https://instagram.com/pune_bookies',
  // contact — the live addresses (we do not own punebookies.com yet)
  contacts: [
    { name: 'Tanvi', user: 'tanvi.lele3944', domain: 'gmail.com' },
    { name: 'Shrey', user: 'shreyasjadhav531', domain: 'gmail.com' },
  ],
  heroTagline: "Building Pune's most vibrant community of readers.",
  heroStress: "We're also <em>not</em> that kind of bookie.",
  heroStats: [
    { value: '200', label: 'readers, most Sundays' },
    { value: '43k+', label: 'following the journey', ig: true },
    { value: '3', label: 'cities and growing' },
  ],
  footerTagline: 'Reading together since 2024 · Pune, India',
  whatsappNote: 'WhatsApp — the link lives in the Instagram bio',
};

// Homepage date stamp. Sanity's noticeBar singleton overrides this at
// build; this fallback keeps the stamp from ever rendering empty.
// Location is deliberately absent — it lives in the WhatsApp groups only.
export const noticeBar = {
  nextSundayDate: '2026-06-14',
  time: '8 AM',
  overrideText: '',
};

export const stories = [
  {
    title: 'The first Sunday I came alone.',
    body: "I almost didn't go. I'd told a friend I would and she bailed and I thought, well that's that, I'll go next week. I went anyway. I was the third person there. By 8:30 there were eighty of us. I read forty pages of a book I'd been carrying around for three months. I didn't talk to anyone. I came back the next Sunday.",
    byline: '— Sneha, regular since April',
    mark: `<svg class="story-mark" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="m1-rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#m1-rough)"><ellipse cx="30" cy="35" rx="22" ry="14" fill="#d97863" opacity="0.5"/><ellipse cx="30" cy="30" rx="18" ry="14" fill="#c8553d" opacity="0.45"/><path d="M 18 30 L 42 30 M 24 36 L 36 36" stroke="#1f1611" stroke-width="1.2" opacity="0.6"/></g></svg>`,
  },
  {
    title: 'The morning the geese came.',
    body: "We were at a venue we hadn't used before. Around 9:15, three geese walked across the lawn, in a perfect line, past about a hundred and twenty of us reading. Nobody made a sound. The geese kept walking. Somebody took a photo. We talk about that morning more than we talk about most Sundays. Nothing happened. That was the whole event.",
    byline: '— Aman, regular',
    mark: `<svg class="story-mark" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="m2-rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#m2-rough)"><ellipse cx="30" cy="35" rx="20" ry="12" fill="#9bb07e" opacity="0.5"/><ellipse cx="22" cy="32" rx="6" ry="8" fill="#f4ecd8" opacity="0.95"/><ellipse cx="32" cy="30" rx="6" ry="8" fill="#f4ecd8" opacity="0.95"/><ellipse cx="42" cy="32" rx="6" ry="8" fill="#f4ecd8" opacity="0.95"/><path d="M 20 26 L 21 23 L 22 26 M 30 24 L 31 21 L 32 24 M 40 26 L 41 23 L 42 26" stroke="#c8553d" stroke-width="1" fill="none" opacity="0.8"/></g></svg>`,
  },
  {
    title: 'What I keep finding here.',
    body: "The first month I started this I thought it was about the books. By the third month I was certain it was about the people. By the sixth I'd stopped trying to figure out what it was about and started just showing up. I think that's the actual thing — a place to show up that doesn't ask you for anything in exchange.",
    byline: '— Tanvi, on starting this',
    mark: `<svg class="story-mark" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="m3-rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#m3-rough)"><rect x="14" y="20" width="32" height="22" fill="#f4ecd8" opacity="0.95"/><rect x="14" y="20" width="32" height="22" fill="none" stroke="#1f1611" stroke-width="1" opacity="0.6"/><line x1="30" y1="20" x2="30" y2="42" stroke="#1f1611" stroke-width="0.8" opacity="0.4"/><line x1="18" y1="26" x2="26" y2="26" stroke="#1f1611" stroke-width="0.6" opacity="0.4"/><line x1="18" y1="30" x2="26" y2="30" stroke="#1f1611" stroke-width="0.6" opacity="0.4"/><line x1="18" y1="34" x2="26" y2="34" stroke="#1f1611" stroke-width="0.6" opacity="0.4"/><line x1="34" y1="26" x2="42" y2="26" stroke="#1f1611" stroke-width="0.6" opacity="0.4"/><line x1="34" y1="30" x2="42" y2="30" stroke="#1f1611" stroke-width="0.6" opacity="0.4"/><ellipse cx="30" cy="48" rx="14" ry="3" fill="#d97863" opacity="0.4"/></g></svg>`,
  },
];

export const faqs = [
  { q: 'When and where does it happen?', a: 'Sundays, 8–10 AM. The location moves every week. We share the spot on Saturday at 4:05 PM, via WhatsApp.' },
  { q: 'Is it free?', a: 'Yes. Always.' },
  { q: 'Do I need to RSVP?', a: 'No. Show up. Joining the WhatsApp just gets you the Saturday location ping.' },
  { q: 'What do I bring?', a: "A book. That's the only requirement. Some people bring water, coffee, a mat. We don't." },
  { q: 'Can I come alone? Will I have to talk to anyone?', a: 'Yes, you can come alone. Most people do. We read in silence for two hours. No one has to introduce themselves, share a passage, or perform anything.' },
  { q: 'What if it rains?', a: "Then we don't. The WhatsApp tells you by Saturday night." },
  { q: 'How do I get on the WhatsApp?', a: 'DM us on Instagram, @pune_bookies. One of us will add you.' },
  { q: 'Will I end up in the photos?', a: "Only if you want to. The group photo at 9:50 is opt-in by walking into it; step aside and nobody minds. If a photo of you is up somewhere and you'd rather it weren't, DM us and it comes down." },
  { q: 'Are there other cities?', a: 'Bombay, Bengaluru.' },
];

export const cities = [
  {
    name: 'Bombay Bookies', place: 'Mumbai', soon: false,
    mark: `<g filter="url(#chapter-rough)"><ellipse cx="40" cy="40" rx="28" ry="22" fill="#6c8a9c" opacity="0.4"/><ellipse cx="40" cy="38" rx="22" ry="18" fill="#7a96a8" opacity="0.5"/><path d="M 25 50 Q 40 35 55 50" stroke="#1f1611" stroke-width="1.2" fill="none" opacity="0.55"/><circle cx="40" cy="32" r="3" fill="#c8553d" opacity="0.6"/></g>`,
  },
  {
    name: 'Bengaluru Bookies', place: 'Bengaluru', soon: false,
    mark: `<g filter="url(#chapter-rough)"><ellipse cx="40" cy="42" rx="26" ry="22" fill="#9bb07e" opacity="0.45"/><ellipse cx="35" cy="35" rx="18" ry="20" fill="#738c5a" opacity="0.5"/><path d="M 22 50 Q 40 36 58 50" stroke="#1f1611" stroke-width="1.2" fill="none" opacity="0.5"/><circle cx="42" cy="30" r="3" fill="#c8553d" opacity="0.55"/></g>`,
  },
  {
    name: 'Your city?', place: 'Maybe', soon: true,
    mark: `<g filter="url(#chapter-rough)"><ellipse cx="40" cy="40" rx="26" ry="20" fill="#7a6a55" opacity="0.25"/><circle cx="40" cy="40" r="14" fill="none" stroke="#7a6a55" stroke-width="1" opacity="0.5" stroke-dasharray="2 3"/><text x="40" y="44" text-anchor="middle" font-family="Fraunces" font-style="italic" font-size="14" fill="#7a6a55" opacity="0.7">soon</text></g>`,
  },
];

export const press = [
  { outlet: 'Times of India' },
  { outlet: 'Campus Times Pune' },
];

// /brands evidence — markup fallback values; brands.js BRANDS_STATS
// overrides at runtime and runs the count-up.
export const brandStats = [
  { key: 'READERS_PER_SUNDAY', value: '200', unit: '', label: 'readers on a typical Sunday' },
  { key: 'IG_FOLLOWERS', value: '43,900', unit: '', label: 'Instagram followers' },
  { key: 'SUNDAYS_HELD', value: '120', unit: '+', label: 'Sundays since early 2024' },
  { key: 'ENGAGEMENT_RATE', value: '4.8', unit: '%', label: 'average engagement rate' },
  { key: 'AVG_REEL_VIEWS', value: '38,000', unit: '', label: 'average reel views' },
  { key: 'WHATSAPP_MEMBERS', value: '2,100', unit: '', label: 'WhatsApp members' },
];

export const brandCases = [
  {
    title: 'Penguin, on the grass',
    meta: '[PLACEHOLDER] date · ~200 readers',
    body: "[PLACEHOLDER] Penguin brought a small table of new releases and left the rest of the Sunday alone. Readers went home with next month's book already decided. Outcome line to fill: what Penguin counted, and what it counted for.",
  },
  {
    title: 'Audible, in one ear',
    meta: '[PLACEHOLDER] date · ~200 readers',
    body: "[PLACEHOLDER] An audiobook corner for people who think they don't have time to read. Outcome line to fill: trial signups in the week after, discovered-on-Sunday titles.",
  },
  {
    title: 'Socials, co-branded Sundays',
    meta: '[PLACEHOLDER] dates · multiple Sundays',
    body: '[PLACEHOLDER] A run of co-branded Sundays with Socials. Outcome line to fill: attendance across the run, what the collaboration looked like on the ground.',
  },
];

export const people = [
  { name: 'Tanvi', role: 'founder', bio: 'Started Pune Bookies in early 2024. Reads more than she sleeps.' },
  { name: 'Shrey', role: 'partnerships, operations & community', bio: "The person you'll most likely be writing to. Keeps the Sundays running and the conversations honest." },
  { name: 'Samruddhi', role: 'content', bio: 'Photos, videos, reels — the reason 43,900 people watch our Sundays from somewhere else.' },
  { name: '+ everyone who shows up', role: 'the actual community', bio: 'Two hundred people deciding to read together every Sunday is what Pune Bookies actually is.' },
];

export const openList = [
  'Book brands, publishers, audiobook platforms — anything that gets a reader closer to more books.',
  'Venue partnerships — farms, large cafés, yoga studios, bookshops, anywhere a couple of hundred quiet readers can spread out for a few hours on a Sunday morning.',
  'Refreshment partners — coffee, tea, books, bookmarks, tote bags, small things that make a Sunday a bit warmer.',
  'Themed Sundays — a reading curated around a new book, a topic, a launch, a writer in town.',
  'Cross-chapter campaigns — if something works in Pune, we can usually extend it through the wider Bookies network, Bombay and Bengaluru included.',
];
