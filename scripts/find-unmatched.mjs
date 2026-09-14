// Scan events.js for unclosed strings inside `consequence:` values
import fs from 'node:fs';
const path = 'C:/Users/zhuru/yuelaogame/data/events.js';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');
const issues = [];
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  const m = L.match(/^(\s*)consequence:\s*"(.*?)(\R)?$/);
  if (m) {
    // Check if the value's closing " is missing
    const value = m[2];
    // value is everything between opening " and end of line
    // If line ends with " then OK, else broken
    if (!value.endsWith('"')) {
      issues.push({ line: i + 1, content: L.trim() });
    }
  }
}
console.log(`Found ${issues.length} unmatched consequence lines:`);
for (const it of issues) {
  console.log(`  line ${it.line}: ${it.content.slice(0, 80)}...`);
}
