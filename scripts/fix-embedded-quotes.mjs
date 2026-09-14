// Programmatic lexer: fix unescaped ASCII " inside string literals
// Approach: parse each line, track when we're inside a string (between "..." starts), 
// and replace any stray " that closes + immediately re-opens back to Chinese 「」
// Actually the simplest fix is: convert inner ASCII " to \" escape or 「」 Chinese
// Let's just find unescaped " inside strings and escape them.
import fs from 'node:fs';

function fixFile(path) {
  let text = fs.readFileSync(path, 'utf8');
  const lines = text.split('\n');
  let fixed = 0;
  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    // Look for patterns like: `xxx: "abc"def"ghi",` where def is unescaped
    // Heuristic: tokens like `KEY: "value_with_"issue"_in_it",`
    // Use a regex to find a value that contains literal " chars mid-string
    // Replace embedded ASCII " with Chinese 「」 in pairs
    const m = L.match(/^(\s*[a-zA-Z_]+\s*:\s*)"(.+)"(,?\s*)$/);
    if (m) {
      const [, prefix, body, suffix] = m;
      if (body.includes('"')) {
        // Embedded ASCII " should be converted — but we need to count parity
        // If odd number of internal " found, repair by alternating 「」
        const count = (body.match(/"/g) || []).length;
        if (count > 0) {
          // Replace each " with alternating 「 and 」 based on count
          let result = '';
          let idx = 0;
          for (const c of body) {
            if (c === '"') {
              result += (idx % 2 === 0) ? '「' : '」';
              idx++;
            } else {
              result += c;
            }
          }
          lines[i] = `${prefix}"${result}"${suffix}`;
          fixed++;
        }
      }
    }
  }
  fs.writeFileSync(path, lines.join('\n'), 'utf8');
  return fixed;
}

for (const p of [
  'C:/Users/zhuru/yuelaogame/data/npcs.js',
  'C:/Users/zhuru/yuelaogame/data/quests.js',
  'C:/Users/zhuru/yuelaogame/data/events.js',
  'C:/Users/zhuru/yuelaogame/data/endings.js',
  'C:/Users/zhuru/yuelaogame/data/archetypes.js',
  'C:/Users/zhuru/yuelaogame/data/insights.js',
]) {
  const n = fixFile(p);
  if (n) console.log(`${p}: ${n} lines fixed`);
}
