import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import { resolve } from 'node:path';

const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT, 10) || 3000;

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  outDir: './docs',
  site: isProd ? 'https://clfhhc.github.io' : `http://localhost:${PORT}`,
  base: isProd ? '/try-astro-solid' : '',
  server: {
    port: PORT,
  },
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
