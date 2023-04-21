import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import schemas from '@shared/cms';

// TODO: Use environment variables here, even though they aren't secret
export default defineConfig({
  projectId: '2ayk9qf1',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemas
  },
  title: 'Debate Land',
});
