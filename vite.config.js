import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
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
    port: 5241, // <-- SET TO THE DEFAULT ADOBE PORT
    open: true,
    strictPort: true,
  },
});


