import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build script for Chrome extension
console.log('Building Chrome extension...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
fs.copyFileSync(manifestPath, manifestDest);

// Copy background.js
const backgroundPath = path.join(__dirname, '../public/background.js');
const backgroundDest = path.join(distDir, 'background.js');
fs.copyFileSync(backgroundPath, backgroundDest);

// Copy content.js
const contentPath = path.join(__dirname, '../public/content.js');
const contentDest = path.join(distDir, 'content.js');
fs.copyFileSync(contentPath, contentDest);

console.log('Chrome extension build complete!');
console.log('Files created in dist/ directory');
console.log('To load the extension:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the dist/ directory'); 