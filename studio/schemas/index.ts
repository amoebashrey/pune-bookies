import { defineType, defineField } from 'sanity';
import { LIMITS, charLimit, imageWithAlt } from './lib';

/* ────────────────────────────────────────────────────────────────
   sunday — one document per Sunday gathering
   ──────────────────────────────────────────────────────────────── */
const sunday = defineType({
  name: 'sunday',
  title: 'Sunday',
  type: 'document',
  fields: [
    defineField({
      name: 'date', title: 'Date', type: 'date',
      description: 'The Sunday this happened. Required.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city', title: 'City', type: 'string',
      description: 'Which chapter held this Sunday.',
      options: { list: ['Pune', 'Bombay', 'Bangalore', 'Jaipur'], layout: 'radio' },
      initialValue: 'Pune',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locationName', title: 'Where was it?', type: 'string',
      description: 'The spot, the way you\'d say it to a reader. E.g. "Empress Botanical Garden, near the bamboo".',
      validation: charLimit(LIMITS.LOCATION_NAME),
    }),
    defineField({
      name: 'attendance', title: 'How many people came?', type: 'number',
      description: 'Rough count is fine. Whole number.',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'driveFolder', title: 'Google Drive folder link', type: 'url',
      description: 'Paste the Google Drive folder link for this Sunday\'s photos here. The sync step will pull them in — you don\'t need to upload anything by hand.',
    }),
    defineField({
      name: 'syncedImages', title: 'Photos (synced from Drive)', type: 'array',
      of: [imageWithAlt('image', 'Photo', 'Filled in by the sync — add the description after it runs.')],
      description: 'Filled automatically when the Drive sync runs. Don\'t add photos here by hand — paste the Drive folder link above instead.',
      readOnly: ({ document }) => Boolean(document?.driveFolder),
    }),
    defineField({
      name: 'notes', title: 'Notes', type: 'text', rows: 3,
      description: 'Anything worth remembering — the geese, the rain, the page-guess winner.',
    }),
    defineField({
      name: 'featured', title: 'Show on the homepage?', type: 'boolean',
      description: 'Turn on to let this Sunday\'s photos appear in the homepage gallery (newest featured Sunday wins).',
      initialValue: false,
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { date: 'date', city: 'city', loc: 'locationName', n: 'attendance' },
    prepare: ({ date, city, loc, n }) => ({
      title: `${date ?? 'undated'} — ${loc ?? 'location TBC'}`,
      subtitle: `${city ?? ''}${n ? ` · ${n} readers` : ''}`,
    }),
  },
});

/* ────────────────────────────────────────────────────────────────
   brandPartner
   ──────────────────────────────────────────────────────────────── */
const brandPartner = defineType({
  name: 'brandPartner',
  title: 'Brand partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Brand name', type: 'string', validation: (Rule) => Rule.required() }),
    imageWithAlt('logo', 'Logo', 'A clean version of the brand\'s logo. PNG with transparency works best.'),
    defineField({ name: 'website', title: 'Website', type: 'url', description: 'The brand\'s site (optional).' }),
    defineField({
      name: 'type', title: 'What kind of brand?', type: 'string',
      options: { list: ['publishing', 'audio', 'food & drink', 'stationery', 'lifestyle', 'other'] },
      description: 'Used to group partners on the site.',
    }),
    defineField({ name: 'firstWorkedWith', title: 'First worked together', type: 'date', description: 'Roughly when the first Sunday together happened.' }),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true, description: 'Turn off to hide this partner without deleting anything.' }),
    defineField({ name: 'order', title: 'Order', type: 'number', description: 'Lower numbers appear first. Leave gaps (10, 20, 30…) so inserting later is easy.', initialValue: 10 }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'type', media: 'logo' } },
});

/* ────────────────────────────────────────────────────────────────
   collaboration — a case study on /brands
   ──────────────────────────────────────────────────────────────── */
const collaboration = defineType({
  name: 'collaboration',
  title: 'Collaboration (case study)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'The way it appears on the brands page. E.g. "Penguin, on the grass".', validation: charLimit(LIMITS.CASE_TITLE) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, description: 'Click "Generate" — used for links. You never need to type this.' }),
    defineField({ name: 'brand', title: 'Brand', type: 'reference', to: [{ type: 'brandPartner' }], description: 'Which partner this was with.' }),
    defineField({ name: 'shortDescription', title: 'One-line outcome', type: 'string', description: 'The line a brand manager quotes: "readers discovered X", "N signups for Y".', validation: charLimit(LIMITS.CASE_OUTCOME) }),
    defineField({ name: 'fullStory', title: 'The fuller story', type: 'text', rows: 5, description: 'What actually happened on the grass, in our voice.', validation: charLimit(LIMITS.CASE_BODY) }),
    defineField({ name: 'date', title: 'When', type: 'date' }),
    defineField({ name: 'attendance', title: 'Readers that Sunday', type: 'number', validation: (Rule) => Rule.min(0).integer() }),
    defineField({
      name: 'photos', title: 'Photos', type: 'array',
      of: [imageWithAlt('image', 'Photo', 'A photo from that Sunday.')],
    }),
    defineField({ name: 'featured', title: 'Show on /brands?', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10, description: 'Lower numbers appear first.' }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription', media: 'photos.0' },
  },
});

/* ────────────────────────────────────────────────────────────────
   teamMember
   ──────────────────────────────────────────────────────────────── */
const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role (as shown on the site)', type: 'string', description: 'E.g. "founder", "partnerships, operations & community", "content".', validation: (Rule) => Rule.required() }),
    defineField({ name: 'bio', title: 'One-or-two-line bio', type: 'text', rows: 2, description: 'Dry and human. See the live page for the register.', validation: charLimit(LIMITS.PERSON_BIO) }),
    defineField({
      name: 'type', title: 'Group', type: 'string',
      options: { list: ['founder', 'core', 'content', 'operations'], layout: 'radio' },
      description: 'For sorting; founders appear first.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10 }),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role' } },
});

/* ────────────────────────────────────────────────────────────────
   siteStat — one number on the /brands evidence wall
   ──────────────────────────────────────────────────────────────── */
const siteStat = defineType({
  name: 'siteStat',
  title: 'Site stat',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'The small line under the number, e.g. "average reel views".', validation: charLimit(LIMITS.STAT_LABEL) }),
    defineField({ name: 'value', title: 'Value', type: 'string', description: 'The number as it should read, e.g. "43,900" or "4.8%". Keep it short.', validation: charLimit(LIMITS.STAT_VALUE) }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10 }),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

/* ────────────────────────────────────────────────────────────────
   story — a reader note on the homepage
   ──────────────────────────────────────────────────────────────── */
const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'E.g. "The morning the geese came."', validation: charLimit(LIMITS.STORY_TITLE) }),
    defineField({ name: 'body', title: 'The story', type: 'text', rows: 6, description: 'First person, plain, no exclamation marks. The geese story is the register.', validation: charLimit(LIMITS.STORY_BODY) }),
    defineField({ name: 'byline', title: 'Byline', type: 'string', description: 'E.g. "— Sneha, regular since April". Include the dash.' }),
    imageWithAlt('photo', 'Photo (optional)', 'Optional photo to accompany the story.'),
    defineField({ name: 'date', title: 'Date', type: 'date', description: 'When this Sunday happened (roughly is fine).' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10, description: 'The homepage shows the first three visible stories.' }),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'byline', media: 'photo' } },
});

/* ────────────────────────────────────────────────────────────────
   faqItem
   ──────────────────────────────────────────────────────────────── */
const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', description: 'Asked the way a reader would ask it.', validation: charLimit(LIMITS.FAQ_QUESTION) }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, description: 'Short and honest beats complete. "Yes. Always." is a full answer.', validation: charLimit(LIMITS.FAQ_ANSWER) }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10 }),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'By order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});

/* ────────────────────────────────────────────────────────────────
   pressMention
   ──────────────────────────────────────────────────────────────── */
const pressMention = defineType({
  name: 'pressMention',
  title: 'Press mention',
  type: 'document',
  fields: [
    defineField({ name: 'outlet', title: 'Outlet', type: 'string', description: 'E.g. "Times of India".', validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: 'Piece title', type: 'string', validation: charLimit(LIMITS.PRESS_TITLE) }),
    defineField({ name: 'url', title: 'Link to the piece', type: 'url' }),
    defineField({ name: 'date', title: 'Published on', type: 'date' }),
    imageWithAlt('logo', 'Outlet logo (optional)', 'Only if we have a clean one; the site renders the name in type otherwise.'),
    defineField({ name: 'visible', title: 'Show on the site?', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'outlet', subtitle: 'title' } },
});

/* ────────────────────────────────────────────────────────────────
   city — sister chapters
   ──────────────────────────────────────────────────────────────── */
const city = defineType({
  name: 'city',
  title: 'City (sister chapter)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Chapter name', type: 'string', description: 'E.g. "Bombay Bookies".', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['active', 'coming'], layout: 'radio' }, initialValue: 'active',
      description: '"coming" renders the chapter faded with a dashed circle.',
    }),
    defineField({ name: 'igHandle', title: 'Instagram handle', type: 'string', description: 'With the @, e.g. "@bombay_bookies". Leave empty to show the name without a link.' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 10 }),
  ],
  preview: { select: { title: 'name', subtitle: 'status' } },
});

/* ────────────────────────────────────────────────────────────────
   siteSettings — SINGLETON. One source for every hardcoded constant.
   ──────────────────────────────────────────────────────────────── */
const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'The one place for site-wide lines. Editing here changes both pages. Changes appear on the site ~2 minutes after you press Publish.',
  fields: [
    defineField({ name: 'heroTagline', title: 'Homepage tagline', type: 'string', description: 'The line under the big wordmark.' }),
    defineField({ name: 'heroStress', title: 'Tagline second line', type: 'string', description: 'The italic joke line. HTML <em> allowed.' }),
    defineField({ name: 'countdownEyebrow', title: 'Countdown label', type: 'string', initialValue: 'next gathering', description: 'The small-caps line above the date stamp.' }),
    defineField({ name: 'countdownWhereLine', title: 'Countdown location line', type: 'string', initialValue: 'the spot drops Saturday, 4:05 PM — WhatsApp & Instagram' }),
    defineField({ name: 'igHandle', title: 'Instagram handle', type: 'string', initialValue: '@pune_bookies' }),
    defineField({ name: 'igUrl', title: 'Instagram URL', type: 'url', initialValue: 'https://instagram.com/pune_bookies' }),
    defineField({
      name: 'contacts', title: 'Contact emails', type: 'array',
      description: 'Who appears in "Get in touch" — name plus address. These also receive inquiry-form emails.',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'email', title: 'Email', type: 'string', validation: (Rule: any) => Rule.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/).error('That doesn\'t look like an email address.') },
        ],
        preview: { select: { title: 'name', subtitle: 'email' } },
      }],
    }),
    defineField({ name: 'foundingYear', title: 'Founding year', type: 'number', initialValue: 2024, readOnly: true, description: '2024. Locked — history doesn\'t move.' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings', subtitle: 'one document, used everywhere' }) },
});

/* ────────────────────────────────────────────────────────────────
   noticeBar — SINGLETON. Drives the sticky strip above the navbar.
   The site renders a hardcoded fallback when this isn't set, so the
   strip is never empty. The strip text is computed at request time
   from these fields (see src/lib/noticeBar.ts).
   ──────────────────────────────────────────────────────────────── */
const noticeBar = defineType({
  name: 'noticeBar',
  title: 'Notice strip',
  type: 'document',
  description: 'The thin strip at the very top of every page. Set the next Sunday and the site writes the line for you. Changes appear ~2 minutes after you press Publish.',
  fields: [
    defineField({
      name: 'nextSundayDate', title: 'Next Sunday date', type: 'date',
      description: 'The date of the next gathering, e.g. 2026-06-14. Required.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time', title: 'Start time', type: 'string', initialValue: '8 AM',
      description: 'When it starts. Default "8 AM".',
    }),
    defineField({
      name: 'location', title: 'Location', type: 'string', initialValue: 'Mt. Carmel',
      description: 'Where it is. Default "Mt. Carmel".',
    }),
    defineField({
      name: 'overrideText', title: 'Override line (optional)', type: 'text', rows: 2,
      description: 'If set, this exact line is shown verbatim, ignoring the date logic. Use for one-offs ("we\'re off this Sunday").',
    }),
  ],
  preview: { prepare: () => ({ title: 'Notice strip', subtitle: 'the line at the top of every page' }) },
});

/* ────────────────────────────────────────────────────────────────
   partnerInquiry — the partnerships CRM (written by the form)
   ──────────────────────────────────────────────────────────────── */
const partnerInquiry = defineType({
  name: 'partnerInquiry',
  title: 'Partner inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'brand', title: 'Brand / organisation', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'What they\'re imagining', type: 'text', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Received', type: 'datetime', readOnly: true }),
    defineField({
      name: 'source', title: 'How it reached us', type: 'string',
      options: { list: ['form', 'email', 'instagram', 'other'] }, initialValue: 'form',
      description: 'Inquiries you log by hand (from email or DMs) go here too — set the source accordingly.',
    }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['new', 'replied', 'in conversation', 'done', 'not a fit'], layout: 'radio' },
      initialValue: 'new',
      description: 'Move this as the conversation moves. "new" means nobody has replied yet.',
    }),
    defineField({ name: 'internalNotes', title: 'Internal notes', type: 'text', rows: 4, description: 'Never shown anywhere — for the team\'s memory.' }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: {
    select: { name: 'name', brand: 'brand', status: 'status', at: 'createdAt' },
    prepare: ({ name, brand, status, at }) => ({
      title: `${brand ?? '?'} — ${name ?? ''}`,
      subtitle: `${status ?? 'new'} · ${at ? new Date(at).toLocaleDateString('en-IN') : ''}`,
    }),
  },
});

export const schemaTypes = [
  sunday, collaboration, brandPartner, teamMember, siteStat,
  story, faqItem, pressMention, city, siteSettings, noticeBar, partnerInquiry,
];
