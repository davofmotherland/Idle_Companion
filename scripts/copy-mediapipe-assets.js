/**
 * Post-build script: Copy MediaPipe WASM and model files to the renderer dist directory.
 * These files must be served as static assets (not bundled by Vite's JS bundler).
 *
 * Note: Vite automatically copies files from public/ to the dist root during build.
 * This script provides a fallback copy in assets/mediapipe/ as well,
 * to ensure the files are available regardless of serving configuration.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src/renderer/public/mediapipe');
const DIST_ASSETS_DIR = path.join(ROOT, 'dist/renderer/assets/mediapipe');

// Ensure dist directory exists
fs.mkdirSync(DIST_ASSETS_DIR, { recursive: true });

// Copy all files from public/mediapipe to dist/renderer/assets/mediapipe
// (Vite already copies to dist/renderer/mediapipe from public/)
const files = fs.readdirSync(SRC_DIR);
for (const file of files) {
  const src = path.join(SRC_DIR, file);
  const dest = path.join(DIST_ASSETS_DIR, file);
  fs.copyFileSync(src, dest);
  console.log(`  Copied: ${file}`);
}

console.log(`\nMediaPipe assets copied to ${DIST_ASSETS_DIR} (${files.length} files)`);
