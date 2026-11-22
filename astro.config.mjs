// @ts-check
import { defineConfig } from 'astro/config';
import carbon from './integrations/carbon.mjs';

export default defineConfig({
  site: 'https://cardini.dev',
  integrations: [carbon()],
  // One small stylesheet: inline it so the page renders in a single request.
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
  // Scope component styles with classes rather than data attributes: smaller HTML.
  scopedStyleStrategy: 'class',
  devToolbar: { enabled: false },
});
