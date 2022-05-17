import { defineConfig } from 'astro/config';
import solid from "@astrojs/solid-js";

console.log(process.env.NODE_ENV);

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  outDir: './docs',
  site: 'https://clfhhc.github.io',
  base: process.env.NODE_ENV === 'production' ? '/try-astro-solid' : '',
});