import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import { resolve } from 'node:path';

const isProd = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  outDir: './docs',
  site: isProd ? 'https://clfhhc.github.io' : 'http://localhost:3000',
  base: isProd ? '/try-astro-solid' : '',
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
