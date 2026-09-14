// Smart fix: find consequence lines on their own (indent + `consequence: "..."`)
// whose final char is punctuation (not `"` or `,` followed by `"`)
import fs from 'node:fs';
const path = 'C:/Users/zhuru/yuelaogame/data/events.js';
let text = fs.readFileSync(path, 'utf8');
let lines = text.split('\n');

const suspicious = [];
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  // A consequence line starts with whitespace + `consequence: "`
  if (/^\s*consequence:\s*"/.test(L)) {
    const after = L.replace(/^\s*consequence:\s*"/, '');
    // Trim trailing whitespace
    const trimmed = after.replace(/\s+$/, '');
    // If doesn't end in `"` (with optional comma after), flag it
    if (!/["",]$/.test(trimmed)) {
      suspicious.push({ idx: i, line: L });
    }
  }
}
console.log(`Suspicious: ${suspicious.length}`);
suspicious.slice(0, 12).forEach(s => console.log(`  line ${s.idx + 1}: ${s.line.trim().slice(0, 80)}`));
