// Find consequence strings missing trailing " and add them
import fs from 'node:fs';
const path = 'C:/Users/zhuru/yuelaogame/data/events.js';
let text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');

// Heuristic: lines starting with whitespace then `consequence: "` should end with `",`
// (or `"` followed by `,` then optional whitespace then EOL)
// If they end with sentence punctuation + `"` then OK.
// But Chinese punctuation like 。」「 should not be confused.
const re = /^(\s*)consequence:\s+"(.*)"\s*,?\s*$/;
const badRe = /^(\s*)consequence:\s+"(.*?)\s*$/;  // closing quote missing

let fixed = 0;
let patterns = { ok: 0, fixed: 0, skipped: 0 };
const out = [];
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (L.includes('consequence:')) {
    // Match ends with closing quote (possibly followed by , or whitespace, then EOL)
    if (re.test(L)) {
      patterns.ok++;
      out.push(L);
      continue;
    }
    // If there's no trailing ", try to fix by appending ",
    const m = L.match(/^(\s*)consequence:\s+"(.*?)\s*,?\s*$/);
    if (m && !L.includes('"')) {
      // No closing quote at all — append "
      const [, indent, body] = m;
      const hasComma = body.trimEnd().endsWith(',');
      const bodyClean = body.trimEnd().replace(/,\s*$/, '');
      const newLine = `${indent}consequence: "${bodyClean}"${hasComma ? ',' : ''}`;
      out.push(newLine);
      patterns.fixed++;
      fixed++;
      continue;
    }
    // Has opening " but no closing — append one (if not present in body)
    const lastQuote = L.lastIndexOf('"');
    const firstQuote = L.indexOf('consequence: "') + 'consequence: "'.length;
    if (lastQuote < firstQuote) {
      // never closed
      const cleaned = L.replace(/,\s*$/, '');
      out.push(cleaned + '",');
      patterns.fixed++;
      fixed++;
      continue;
    }
  }
  out.push(L);
}
console.log('patterns:', patterns);
fs.writeFileSync(path, out.join('\n'), 'utf8');
console.log(`wrote ${path}`);
