#!/usr/bin/env node
/**
 * Seed the dataset with the site's current hardcoded content so the
 * Studio never opens empty. Idempotent: uses fixed _ids and
 * createIfNotExists — running twice changes nothing, and it will
 * never overwrite documents an editor has touched.
 *
 * Run:  npm run seed   (from /studio, .env filled in)
 */
import { createClient } from '@sanity/client';
import 'dotenv/config';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!PROJECT_ID || !TOKEN) {
  console.error('✗ Set SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN in studio/.env first (copy .env.example).');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token: TOKEN,
  apiVersion: '2026-01-01',
  useCdn: false,
});

const docs = [
  {
    _id: 'siteSettings', _type: 'siteSettings',
    heroTagline: 'We read together. Every Sunday, eight to ten, under a tree somewhere in Pune.',
    heroStress: "We're also <em>not</em> that kind of bookie.",
    countdownEyebrow: 'next gathering',
    countdownWhereLine: 'the spot drops Saturday, 4:05 PM — WhatsApp & Instagram',
    igHandle: '@pune_bookies',
    igUrl: 'https://instagram.com/pune_bookies',
    contacts: [
      { _key: 'tanvi', name: 'Tanvi', email: 'tanvi.lele3944@gmail.com' },
      { _key: 'shrey', name: 'Shrey', email: 'shreyasjadhav531@gmail.com' },
    ],
    foundingYear: 2024,
  },

  // stories
  {
    _id: 'story-first-sunday-alone', _type: 'story', order: 10, visible: true,
    title: 'The first Sunday I came alone.',
    body: "I almost didn't go. I'd told a friend I would and she bailed and I thought, well that's that, I'll go next week. I went anyway. I was the third person there. By 8:30 there were eighty of us. I read forty pages of a book I'd been carrying around for three months. I didn't talk to anyone. I came back the next Sunday.",
    byline: '— Sneha, regular since April',
  },
  {
    _id: 'story-the-geese', _type: 'story', order: 20, visible: true,
    title: 'The morning the geese came.',
    body: "We were at a venue we hadn't used before. Around 9:15, three geese walked across the lawn, in a perfect line, past about a hundred and twenty of us reading. Nobody made a sound. The geese kept walking. Somebody took a photo. We talk about that morning more than we talk about most Sundays. Nothing happened. That was the whole event.",
    byline: '— Aman, regular',
  },
  {
    _id: 'story-keep-finding', _type: 'story', order: 30, visible: true,
    title: 'What I keep finding here.',
    body: "The first month I started this I thought it was about the books. By the third month I was certain it was about the people. By the sixth I'd stopped trying to figure out what it was about and started just showing up. I think that's the actual thing — a place to show up that doesn't ask you for anything in exchange.",
    byline: '— Tanvi, on starting this',
  },

  // faq
  ...[
    ['When and where does it happen?', 'Sundays, 8–10 AM. The location moves every week. We share the spot on Saturday at 4:05 PM, via WhatsApp.'],
    ['Is it free?', 'Yes. Always.'],
    ['Do I need to RSVP?', 'No. Show up. Joining the WhatsApp just gets you the Saturday location ping.'],
    ['What do I bring?', "A book. That's the only requirement. Some people bring water, coffee, a mat. We don't."],
    ['Can I come alone? Will I have to talk to anyone?', 'Yes, you can come alone. Most people do. We read in silence for two hours. No one has to introduce themselves, share a passage, or perform anything.'],
    ['What if it rains?', "Then we don't. The WhatsApp tells you by Saturday night."],
    ['How do I get on the WhatsApp?', 'DM us on Instagram, @pune_bookies. One of us will add you.'],
    ["Will I end up in the photos?", "Only if you want to. The group photo at 9:50 is opt-in by walking into it; step aside and nobody minds. If a photo of you is up somewhere and you'd rather it weren't, DM us and it comes down."],
    ['Are there other cities?', 'Bombay, Bengaluru, Jaipur.'],
  ].map(([question, answer], i) => ({
    _id: `faq-${i + 1}`, _type: 'faqItem', question, answer, order: (i + 1) * 10, visible: true,
  })),

  // team
  { _id: 'team-tanvi', _type: 'teamMember', name: 'Tanvi', role: 'founder', type: 'founder', order: 10, visible: true, bio: 'Started Pune Bookies in early 2024. Reads more than she sleeps.' },
  { _id: 'team-shrey', _type: 'teamMember', name: 'Shrey', role: 'partnerships, operations & community', type: 'operations', order: 20, visible: true, bio: "The person you'll most likely be writing to. Keeps the Sundays running and the conversations honest." },
  { _id: 'team-samruddhi', _type: 'teamMember', name: 'Samruddhi', role: 'content', type: 'content', order: 30, visible: true, bio: 'Photos, videos, reels — the reason 43,900 people watch our Sundays from somewhere else.' },
  { _id: 'team-everyone', _type: 'teamMember', name: '+ everyone who shows up', role: 'the actual community', type: 'core', order: 40, visible: true, bio: 'Two hundred and fifty people deciding to read together every Sunday is what Pune Bookies actually is.' },

  // stats ([PLACEHOLDER] values — fill from Instagram insights)
  ...[
    ['READERS_PER_SUNDAY', '250', 'readers on a typical Sunday'],
    ['IG_FOLLOWERS', '43,900', 'Instagram followers'],
    ['SUNDAYS_HELD', '120+', 'Sundays since early 2024'],
    ['ENGAGEMENT_RATE', '4.8%', 'average engagement rate'],
    ['AVG_REEL_VIEWS', '38,000', 'average reel views'],
    ['WHATSAPP_MEMBERS', '2,100', 'WhatsApp members'],
  ].map(([key, value, label], i) => ({
    _id: `stat-${key.toLowerCase()}`, _type: 'siteStat', value, label, order: (i + 1) * 10, visible: true,
  })),

  // partners + case studies ([PLACEHOLDER] copy, clearly marked)
  { _id: 'partner-penguin', _type: 'brandPartner', name: 'Penguin', type: 'publishing', order: 10, visible: true },
  { _id: 'partner-audible', _type: 'brandPartner', name: 'Audible', type: 'audio', order: 20, visible: true },
  { _id: 'partner-socials', _type: 'brandPartner', name: 'Socials', type: 'lifestyle', order: 30, visible: true },
  {
    _id: 'collab-penguin', _type: 'collaboration', order: 10, featured: true,
    title: 'Penguin, on the grass', brand: { _type: 'reference', _ref: 'partner-penguin' },
    shortDescription: '[PLACEHOLDER] outcome — what Penguin counted',
    fullStory: "[PLACEHOLDER] Penguin brought a small table of new releases and left the rest of the Sunday alone. Readers went home with next month's book already decided.",
  },
  {
    _id: 'collab-audible', _type: 'collaboration', order: 20, featured: true,
    title: 'Audible, in one ear', brand: { _type: 'reference', _ref: 'partner-audible' },
    shortDescription: '[PLACEHOLDER] outcome — trial signups in the week after',
    fullStory: "[PLACEHOLDER] An audiobook corner for people who think they don't have time to read.",
  },
  {
    _id: 'collab-socials', _type: 'collaboration', order: 30, featured: true,
    title: 'Socials, co-branded Sundays', brand: { _type: 'reference', _ref: 'partner-socials' },
    shortDescription: '[PLACEHOLDER] outcome — attendance across the run',
    fullStory: '[PLACEHOLDER] A run of co-branded Sundays with Socials.',
  },

  // press + cities
  { _id: 'press-toi', _type: 'pressMention', outlet: 'Times of India', visible: true },
  { _id: 'press-ctp', _type: 'pressMention', outlet: 'Campus Times Pune', visible: true },
  { _id: 'city-bombay', _type: 'city', name: 'Bombay Bookies', status: 'active', order: 10 },
  { _id: 'city-bengaluru', _type: 'city', name: 'Bengaluru Bookies', status: 'active', order: 20 },
  { _id: 'city-jaipur', _type: 'city', name: 'Jaipur Bookies', status: 'active', order: 30 },
];

let created = 0, skipped = 0;
const tx = client.transaction();
docs.forEach((d) => tx.createIfNotExists(d));
const result = await tx.commit();
console.log(`✓ Seed complete — ${result.results.length} documents ensured (existing ones untouched).`);
