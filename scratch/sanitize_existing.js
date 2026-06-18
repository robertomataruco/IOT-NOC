const fs = require("fs").promises;
const path = require("path");

const uploadsDir = path.join(__dirname, "../public/uploads");

async function main() {
  console.log("Reading directory:", uploadsDir);
  const files = await fs.readdir(uploadsDir);
  const svgFiles = files.filter(f => f.endsWith(".svg"));
  
  console.log(`Found ${svgFiles.length} SVG files to sanitize.`);
  
  for (const file of svgFiles) {
    const filePath = path.join(uploadsDir, file);
    try {
      let content = await fs.readFile(filePath, "utf-8");
      
      const originalLength = content.length;
      
      // Apply XML compliance cleaning
      content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ");
      content = content.replace(/\t/g, " ");
      content = content.replace(/ {2,}/g, " ");
      
      // Make sure width/height are sanitized too
      const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/);
      let targetWidth = 2400;
      let targetHeight = 1600;
      
      if (viewBoxMatch && viewBoxMatch[1]) {
        const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
        if (parts.length === 4) {
          const vbWidth = parts[2];
          const vbHeight = parts[3];
          if (vbWidth > 0 && vbHeight > 0) {
            const aspectRatio = vbWidth / vbHeight;
            targetHeight = Math.round(targetWidth / aspectRatio);
          }
        }
      }
      
      content = content.replace(/width=["']\d+(\.\d+)?[a-zA-Z]*["']/, `width="${targetWidth}"`);
      content = content.replace(/height=["']\d+(\.\d+)?[a-zA-Z]*["']/, `height="${targetHeight}"`);
      
      const cleanedLength = content.length;
      
      if (originalLength !== cleanedLength || content.includes('width="2400"')) {
        await fs.writeFile(filePath, content, "utf-8");
        console.log(`✅ Sanitized ${file}: Original size: ${originalLength}, Cleaned size: ${cleanedLength}`);
      } else {
        console.log(`ℹ️ ${file} is already clean.`);
      }
    } catch (e) {
      console.error(`❌ Failed to sanitize ${file}:`, e.message);
    }
  }
  console.log("All existing files sanitized successfully!");
}

main().catch(console.error);
