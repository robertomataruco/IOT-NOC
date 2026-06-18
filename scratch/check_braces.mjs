import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\rmataruco\\OneDrive\\Projeto NOVO ZABBIX\\zabbix-dashboard\\src\\app\\admin\survey\\SurveyClient.tsx', 'utf8');

let braceDepth = 0;
let parenDepth = 0;
let bracketDepth = 0;

let inString = null; // '"', "'", or '`'
let escape = false;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  
  if (escape) {
    escape = false;
    continue;
  }
  
  if (char === '\\') {
    escape = true;
    continue;
  }
  
  if (inString) {
    if (char === inString) {
      inString = null;
    }
    continue;
  }
  
  if (char === '"' || char === "'" || char === '`') {
    inString = char;
    continue;
  }
  
  if (char === '{') braceDepth++;
  if (char === '}') braceDepth--;
  
  if (char === '(') parenDepth++;
  if (char === ')') parenDepth--;
  
  if (char === '[') bracketDepth++;
  if (char === ']') bracketDepth--;

  if (braceDepth < 0) {
    console.log(`Brace mismatch at character ${i}, line ${content.substring(0, i).split('\n').length}`);
    process.exit(1);
  }
  if (parenDepth < 0) {
    console.log(`Parenthesis mismatch at character ${i}, line ${content.substring(0, i).split('\n').length}`);
    process.exit(1);
  }
  if (bracketDepth < 0) {
    console.log(`Bracket mismatch at character ${i}, line ${content.substring(0, i).split('\n').length}`);
    process.exit(1);
  }
}

console.log('Final counts:');
console.log('Braces:', braceDepth);
console.log('Parentheses:', parenDepth);
console.log('Brackets:', bracketDepth);
