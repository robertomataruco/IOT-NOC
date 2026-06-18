import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\rmataruco\\.gemini\\antigravity\\brain\\397a69e2-7342-4413-976a-ee1767af9985';

function getPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Check PNG signature
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a valid PNG file');
  }
  // Width is at offset 16 (4 bytes)
  const width = buffer.readUInt32BE(16);
  // Height is at offset 20 (4 bytes)
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

try {
  const files = ['media__1780326403354.png', 'media__1780326475995.png'];
  for (const file of files) {
    const fullPath = path.join(brainDir, file);
    if (fs.existsSync(fullPath)) {
      const { width, height } = getPngDimensions(fullPath);
      console.log(`File: ${file}, Width: ${width}, Height: ${height}, Size: ${bufferSize(fullPath)} bytes`);
    } else {
      console.log(`File does not exist: ${file}`);
    }
  }
} catch (err) {
  console.error('Error reading PNGs:', err);
}

function bufferSize(filePath) {
  return fs.statSync(filePath).size;
}
