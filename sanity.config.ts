import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './lib/sanity/schemas';
import { summitChroniclesStructure } from './lib/sanity/structure';

export default defineConfig({
  name: 'summit-chronicles',
  title: 'Summit Chronicles Authoring',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'summit-chronicles',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [
    structureTool({ structure: summitChroniclesStructure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {},
  },
});
