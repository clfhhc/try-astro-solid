import astroConfig from './astro.config.mjs';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  const viteConfig = astroConfig.vite;
  return viteConfig;
});
