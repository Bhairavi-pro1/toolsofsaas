'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

const config = defineConfig({
  name: 'toolsofsaas',
  title: 'ToolsOfSaaS CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});

export default config;
