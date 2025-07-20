import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './', // optional, but useful if src folder used
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
    port: 5173, // or whatever port you like
    open: true, // auto-opens browser
    strictPort: true,
  },
});


