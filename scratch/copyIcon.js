const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\rmataruco\\.gemini\\antigravity\\brain\\95ec79df-c7e7-47e2-9371-eb8125f0eca7\\ricas_pwa_icon_1779376018605.png";
const dest512 = path.join(__dirname, '..', 'public', 'icon-512x512.png');
const dest192 = path.join(__dirname, '..', 'public', 'icon-192x192.png');

try {
  fs.copyFileSync(src, dest512);
  fs.copyFileSync(src, dest192);
  console.log("✅ Icons copied successfully to public folder!");
} catch (e) {
  console.error("❌ Error copying icons:", e.message);
}
