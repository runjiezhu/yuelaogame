const fs = require('fs');
const path = process.argv[2];
const targetLine = parseInt(process.argv[3], 10);
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');
const L = lines[targetLine - 1];
console.log('line length =', L.length);
console.log('last 8 codepoints:');
for (let i = Math.max(0, L.length - 8); i < L.length; i++) {
  const cp = L.codePointAt(i);
  const ch = JSON.stringify(L[i]);
  console.log(`  [${i}] U+${cp.toString(16).toUpperCase().padStart(4,'0')}  ${ch}`);
}
console.log('full line:');
console.log(JSON.stringify(L));
