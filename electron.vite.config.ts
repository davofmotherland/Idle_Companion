import { defineConfig } from 'electron-vite';
import path from 'path';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: path.resolve(__dirname, 'dist/renderer'),
      rollupOptions: {
        external: ['@mediapipe/selfie_segmentation']
      }
    }
  }
});
