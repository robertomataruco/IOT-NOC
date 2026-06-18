import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\rmataruco\\.gemini\\antigravity\\brain\\c66f15ed-ca3e-4577-a110-89c434d61ecc';
const projectDir = 'c:\\Users\\rmataruco\\OneDrive\\Projeto NOVO ZABBIX\\zabbix-dashboard';

try {
  // Copiar o novo logo widescreen para a public/temp-logo-source.png
  const widescreenLogoSource = path.join(brainDir, 'media__1781282019857.png');
  const targetNew = path.join(projectDir, 'public', 'logo-ricas-new.png');
  const targetOld = path.join(projectDir, 'public', 'logo-ricas.png');
  const targetSource = path.join(projectDir, 'public', 'temp-logo-source.png');

  if (fs.existsSync(widescreenLogoSource)) {
    console.log(`\nSelected widescreen logo file: ${widescreenLogoSource}`);
    
    // Copy to temp source
    fs.copyFileSync(widescreenLogoSource, targetSource);
    console.log(`Successfully copied source logo to: ${targetSource}`);
    
    // Copy to new target
    fs.copyFileSync(widescreenLogoSource, targetNew);
    console.log(`Successfully copied logo to: ${targetNew}`);

    // Copy to old target
    fs.copyFileSync(widescreenLogoSource, targetOld);
    console.log(`Successfully copied logo to: ${targetOld}`);
  } else {
    console.error(`Error: Widescreen logo file not found at: ${widescreenLogoSource}`);
  }

  console.log('\nAll logos processed successfully!');
} catch (err) {
  console.error('Error during execution:', err);
}
