import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'edutoolshub',
  // Keep local package versions; avoids v3/v4 mismatch prompts and schema surprises.
  autoUpdates: false,
})
