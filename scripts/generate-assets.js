const fs = require('fs');
const path = require('path');

// Minimal valid 1x1 PNG (blue pixel) - base64 encoded
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Slightly larger 48x48 blue square PNG for icons
const iconPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAOklEQVR42u3OMQEAAAgDoGn/0FbwpgkcNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GoBPAABrxABzgAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, '..', 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write placeholder images
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconPNG);
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), iconPNG);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconPNG);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), minimalPNG);

console.log('✅ Asset placeholders generated successfully!');
