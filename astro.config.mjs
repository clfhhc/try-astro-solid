import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import { resolve } from 'node:path';

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  outDir: './docs',
  site: 'https://clfhhc.github.io',
  base: process.env.NODE_ENV === 'production' ? '/try-astro-solid' : '',
  vite: {
    optimizeDeps: {
      exclude: ['fs', 'path', 'module', 'node:fs'],
    },
    resolve: {
      alias: {
        '@': resolve(process.cwd(), './src'),
      },
    },
  },
});
