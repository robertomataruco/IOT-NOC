const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'admin', 'survey', 'SurveyClient.tsx');
const code = fs.readFileSync(filePath, 'utf8');

const lines = code.split('\n');
console.log(`Checking brackets up to line 1037...`);

let stack = [];
let insideComment = false;
let insideSlashStarComment = false;
let insideString = null;

for (let i = 0; i < 1037; i++) {
  const line = lines[i];
  let j = 0;
  while (j < line.length) {
    const char = line[j];
    
    // String check
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
      break; // rest of the line is a comment
    }
    if (char === '/' && line[j + 1] === '*') {
      insideSlashStarComment = true;
      j += 2;
      continue;
    }
    
    // Quotes check
    if (char === '"' || char === "'" || char === '`') {
      insideString = char;
      j++;
      continue;
    }
    
    // Brackets check
    if (char === '{' || char === '(' || char === '[') {
      stack.push({ char, line: i + 1, col: j + 1 });
    } else if (char === '}' || char === ')' || char === ']') {
      const last = stack.pop();
      if (!last) {
        console.warn(`Unmatched closing '${char}' at line ${i + 1}:${j + 1}`);
      } else {
        const matches = { '}': '{', ')': '(', ']': '[' };
        if (last.char !== matches[char]) {
          console.warn(`Mismatched closing '${char}' at line ${i + 1}:${j + 1} (opened with '${last.char}' at line ${last.line}:${last.col})`);
        }
      }
    }
    j++;
  }
}

console.log('--- Unclosed Brackets at end of line 1037 ---');
stack.forEach(item => {
  console.log(`Unclosed '${item.char}' opened at line ${item.line}:${item.col}`);
});
