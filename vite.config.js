import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  build: {rollupOptions: {input: {
    home:fileURLToPath(new URL('./index.html',import.meta.url)),
    migration:fileURLToPath(new URL('./migration/index.html',import.meta.url)),
  }}},
});
