const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'admin', 'survey', 'SurveyClient.tsx');
const code = fs.readFileSync(filePath, 'utf8');

const lines = code.split('\n');
console.log(`Checking JSX tags for SurveyClient.tsx... Total lines: ${lines.length}`);

// We will use a regular expression to find JSX tags:
// 1. Opening/Self-closing tags: <([a-zA-Z0-9_.-]+)([^>]*?)>
// 2. Closing tags: <\/([a-zA-Z0-9_.-]+)>

let stack = [];
let insideComment = false;
let insideSlashStarComment = false;
let insideString = null;

// Simple scanner
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip imports or text lines that are obviously not JSX
  if (line.trim().startsWith('import') || line.trim().startsWith('//')) {
    continue;
  }
  
  let j = 0;
  while (j < line.length) {
    const char = line[j];
    
    // String literal skip
    if (insideString) {
      if (char === insideString && line[j - 1] !== '\\') {
        insideString = null;
      }
      j++;
      continue;
    }
    
    // Slash star comment check
    if (insideSlashStarComment) {
      if (char === '*' && line[j + 1] === '/') {
        insideSlashStarComment = false;
        j += 2;
      } else {
        j++;
      }
      continue;
    }
    
    // Comment check
    if (char === '/' && line[j + 1] === '/') {
      break; 
    }
    if (char === '/' && line[j + 1] === '*') {
      insideSlashStarComment = true;
      j += 2;
      continue;
    }
    
    // String quotes
    if (char === '"' || char === "'" || char === '`') {
      insideString = char;
      j++;
      continue;
    }
    
    // Check for JSX tags
    if (char === '<') {
      // Check if it's a closing tag
      if (line[j + 1] === '/') {
        // Find closing tag name
        let endNameIdx = line.indexOf('>', j);
        if (endNameIdx !== -1) {
          const tagName = line.substring(j + 2, endNameIdx).trim();
          const last = stack.pop();
          if (!last) {
            console.log(`Unmatched closing tag </${tagName}> at line ${i + 1}:${j + 1}`);
          } else if (last.name !== tagName) {
            console.log(`Mismatched closing tag </${tagName}> at line ${i + 1}:${j + 1} (opened with <${last.name}> at line ${last.line}:${last.col})`);
          }
          j = endNameIdx + 1;
          continue;
        }
      }
      
      // Check if it's a comment inside JSX
      if (line[j + 1] === '!' && line[j + 2] === '-' && line[j + 3] === '-') {
        j += 4;
        continue;
      }
      
      // Check if it's an opening tag
      let nextChar = line[j + 1];
      if ((nextChar >= 'a' && nextChar <= 'z') || (nextChar >= 'A' && nextChar <= 'Z') || nextChar === '>') {
        // Read tag name (handle fragment <> as well)
        let tagName = "";
        let endNameIdx = j + 1;
        if (nextChar === '>') {
          tagName = "Fragment";
          endNameIdx = j + 1;
        } else {
          while (endNameIdx < line.length && (line[endNameIdx].match(/[a-zA-Z0-9_.-]/))) {
            tagName += line[endNameIdx];
            endNameIdx++;
          }
        }
        
        // Find end of tag
        let endTagIdx = line.indexOf('>', j);
        if (endTagIdx !== -1) {
          // Check if self-closing
          const isSelfClosing = line[endTagIdx - 1] === '/' || tagName === 'img' || tagName === 'input' || tagName === 'hr' || tagName === 'br';
          if (!isSelfClosing) {
            stack.push({ name: tagName, line: i + 1, col: j + 1 });
          }
          j = endTagIdx + 1;
          continue;
        }
      }
    }
    j++;
  }
}

console.log('\n--- Unclosed JSX/HTML Tags ---');
if (stack.length === 0) {
  console.log('All JSX tags are perfectly matched!');
} else {
  stack.forEach(tag => {
    console.log(`Unclosed <${tag.name}> opened at line ${tag.line}:${tag.col}`);
  });
}
