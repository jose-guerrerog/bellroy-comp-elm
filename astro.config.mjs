import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bellroy-demo.netlify.app',
  output: 'static',
  server: {
    port: 3000
  }
});