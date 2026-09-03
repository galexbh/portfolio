import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Keystatic's admin UI (/keystatic) needs a server-rendered route plus a React renderer,
// which pulls this otherwise static site onto the Workers runtime for that one route.
// Every other route stays statically prerendered.
export default defineConfig({
  site: 'https://galexbh.dev',
  output: 'static',
  compressHTML: true,
  adapter: cloudflare({ prerenderEnvironment: 'node' }),
  integrations: [react(), keystatic()],
});
