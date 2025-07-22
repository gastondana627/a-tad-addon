import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // This is the new line that fixes the asset paths for the live site.
  // It tells Vite to use relative paths for all images, CSS, and JS files.
  base: './', 

  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    https: {
      key: './key.pem',
      cert: './cert.pem',
    },
    port: 5241,
    open: true,
    strictPort: true,
  },
});

