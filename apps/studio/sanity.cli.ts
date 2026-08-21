import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'i1f2viuj',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
  typegen: {
    path: './queries/**/*.{ts,tsx}',
    schema: './schema.json',
    generates: './sanity.types.ts'
  }
})
