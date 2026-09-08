import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    port: 5242,
    open: true,
  },
});
