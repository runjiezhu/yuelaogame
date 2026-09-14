// 文件变更监听：把 src (index.html, css/, js/, data/, assets/) 镜像到 docs/
import { watch, copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS = join(ROOT, 'docs');

const WATCH_DIRS = [
  join(ROOT, 'js'),
  join(ROOT, 'data'),
  join(ROOT, 'css'),
  join(ROOT, 'assets'),
];
const WATCH_FILES = [join(ROOT, 'index.html')];

async function mirrorFile(src) {
  const rel = relative(ROOT, src).replace(/\\/g, '/');
  const dst = join(DOCS, rel);
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
  console.log(`[sync] ${rel}`);
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function start() {
  console.log(`[sync-watcher] ROOT=${ROOT}`);
  console.log(`[sync-watcher] DOCS=${DOCS}`);
  for (const d of WATCH_DIRS) {
    if (!(await exists(d))) continue;
    try {
      const w = watch(d, { recursive: true });
      for await (const ev of w) {
        if (!ev.filename) continue;
        const src = join(d, ev.filename);
        if (!(await exists(src))) continue;
        try { await mirrorFile(src); } catch (e) { console.error('[sync] error', e.message); }
      }
    } catch (e) { console.error('[sync] watch fail', d, e.message); }
  }
  for (const f of WATCH_FILES) {
    if (!(await exists(f))) continue;
    try {
      const w = watch(f);
      for await (const _ of w) { await mirrorFile(f); }
    } catch (e) { console.error('[sync] watch fail', f, e.message); }
  }
}

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

start().catch((e) => { console.error(e); process.exit(1); });
