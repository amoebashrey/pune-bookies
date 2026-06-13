import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'MISSING_PROJECT_ID';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'pune-bookies',
  title: 'Pune Bookies',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),   // GROQ playground — harmless for editors, handy for devs
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // the settings singleton should never be duplicated or deleted
    actions: (prev, ctx) =>
      ctx.schemaType === 'siteSettings'
        ? prev.filter((a) => !['delete', 'duplicate'].includes(a.action ?? ''))
        : prev,
  },
});
