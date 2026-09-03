import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// The Keystatic admin UI (/keystatic) needs a server-rendered route plus a React renderer,
// which would pull this otherwise fully static site into a hybrid build. Content is edited
// on keystatic.cloud (the "cloud" storage kind) day to day, so the local admin UI is an
// opt-in convenience only — run with `npm run keystatic` — and never part of `npm run build`
// or plain `npm run dev`.
const withKeystatic = process.env.KEYSTATIC_ADMIN === '1';

export default defineConfig({
  site: 'https://galexbh.dev',
  output: 'static',
  compressHTML: true,
  integrations: withKeystatic ? [react(), keystatic()] : [],
});
