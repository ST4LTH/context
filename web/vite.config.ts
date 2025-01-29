import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
});