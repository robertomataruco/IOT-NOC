const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'admin', 'survey', 'SurveyClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Cleaning file encoding anomalies...");

// Map of common double-encoded UTF-8 sequences to clean ASCII/UTF-8
const replacements = [
  { corrupted: /ﾃｩ/g, clean: 'é' },
  { corrupted: /ﾃｧﾃ｣/g, clean: 'çã' },
  { corrupted: /ﾃｧ/g, clean: 'ç' },
  { corrupted: /ﾃｵ/g, clean: 'õ' },
  { corrupted: /ﾃｵ/g, clean: 'õ' },
  { corrupted: /ﾃ｡/g, clean: 'á' },
  { corrupted: /ﾃ｢/g, clean: 'â' },
  { corrupted: /ﾃｭ/g, clean: 'í' },
  { corrupted: /ﾃｳ/g, clean: 'ó' },
  { corrupted: /ﾃｺ/g, clean: 'ú' },
  { corrupted: /ﾃｪ/g, clean: 'ê' },
  { corrupted: /ﾂｺ/g, clean: 'º' },
  { corrupted: /ﾂｲ/g, clean: '²' },
  { corrupted: /ﾂｳ/g, clean: '³' },
  { corrupted: /ﾂｷ/g, clean: '·' },
  { corrupted: /笨茨ｸ/g, clean: '✈️' },
  { corrupted: /庁/g, clean: '⚡' },
  { corrupted: /盗/g, clean: '📐' },
  { corrupted: /唐/g, clean: '📁' },
  { corrupted: /倹/g, clean: '🗺️' },
  { corrupted: /踏/g, clean: '📥' },
  { corrupted: /唐/g, clean: '📂' },
  { corrupted: /邃ｹ/g, clean: '📏' }
];

let cleanedCount = 0;
replacements.forEach(rep => {
  const matches = content.match(rep.corrupted);
  if (matches) {
    cleanedCount += matches.length;
    content = content.replace(rep.corrupted, rep.clean);
  }
});

// Also replace any lingering weird characters with standard ones
content = content.replace(/confirm\("Carregar uma planta de Site Survey iBwave prﾃｩ-configurada como demonstraﾃｧﾃ｣o\? Isso irﾃ｡ substituir seu design atual\."\)/g, 
  'confirm("Carregar uma planta de Site Survey iBwave pre-configurada como demonstracao? Isso ira substituir seu design atual.")');

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Finished cleaning! Applied ${cleanedCount} encoding replacements.`);
