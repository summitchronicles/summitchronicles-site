import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './lib/sanity/schemas'

export default defineConfig({
  name: 'summit-chronicles',
  title: 'Summit Chronicles CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'summit-chronicles',
  dataset: 'production',
  basePath: '/studio',
  
  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {}
  }
})