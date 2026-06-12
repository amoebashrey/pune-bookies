import { defineField } from 'sanity';

/**
 * Character limits tied to the site's design. Each value is the point
 * where the layout starts to break (tested at 1440px and 375px).
 * Editors get a warning at 90% and a hard stop at the limit.
 */
export const LIMITS = {
  STORY_TITLE: 60,     // Fraunces italic 1.45rem, 3 lines max in the card
  STORY_BODY: 600,     // the three-column story grid stays balanced
  FAQ_QUESTION: 90,    // one to two lines at 1.3rem
  FAQ_ANSWER: 400,
  STAT_LABEL: 40,      // small-caps line under the big numeral
  STAT_VALUE: 12,      // the numeral itself ("43,900", "4.8%")
  PERSON_BIO: 180,     // person card, ~4 lines
  CASE_TITLE: 40,
  CASE_OUTCOME: 90,    // the one-line outcome
  CASE_BODY: 420,
  PRESS_TITLE: 120,
  LOCATION_NAME: 80,
} as const;

/** warning at 90%, error at the limit — wired to the design constants above */
export const charLimit = (max: number) => (Rule: any) =>
  Rule.required()
    .max(max).error(`Keep this under ${max} characters — longer breaks the page layout.`)
    .custom((v: string) =>
      v && v.length > max * 0.9
        ? { message: `Getting long (${v.length}/${max}) — the design starts to strain here.`, level: 'warning' }
        : true
    );

/** an image that cannot be published without honest alt text */
export const imageWithAlt = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Describe this photo (alt text)',
        type: 'string',
        description:
          'One sentence describing what is in the photo, for readers who use a screen reader and for when the image fails to load. E.g. "Readers on the grass at Empress Garden, morning light". Required — the site won\'t show the image without it.',
        validation: (Rule: any) => Rule.required().error('Every photo needs a description — see the note above.'),
      },
    ],
    validation: (Rule: any) =>
      Rule.custom(async (value: any, context: any) => {
        if (!value?.asset?._ref) return true;
        const client = context.getClient({ apiVersion: '2026-01-01' });
        const dims = await client.fetch('*[_id == $id][0].metadata.dimensions', { id: value.asset._ref });
        if (dims && (dims.width < 800 || dims.height < 600)) {
          return `This image is ${dims.width}×${dims.height}px — too small to print crisply on the site. Please use at least 800×600.`;
        }
        return true;
      }),
  });
