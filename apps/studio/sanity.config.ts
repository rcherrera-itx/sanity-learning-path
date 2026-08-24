import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { presentationTool } from 'sanity/presentation';
import { resolve } from './src/presentation/resolve';

export default defineConfig({
  name: 'default',
  title: 'Sanity Commerce Studio',

  projectId: 'i1f2viuj',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      resolve,
      previewUrl: {
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable'
        }
      }
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
