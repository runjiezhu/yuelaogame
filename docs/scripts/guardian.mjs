// 守护 node serve.mjs，自动检测并重启
import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SERVE = path.join(ROOT, 'scripts', 'serve.mjs');
const PORT = Number(process.env.PORT || 8765);

let child = null;
let stopping = false;

function start() {
  if (stopping) return;
  console.log(`[guardian] starting ${SERVE}`);
  child = spawn(process.execPath, [SERVE], {
    cwd: ROOT,
    stdio: 'inherit',
    windowsHide: true,
  });
  child.on('exit', (code, signal) => {
    console.log(`[guardian] serve.mjs exited code=${code} signal=${signal}`);
    child = null;
    if (!stopping) {
      // 退避重启：1s 后拉起
      setTimeout(start, 1000);
    }
  });
}

function ping() {
  return new Promise((resolve) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path: '/', method: 'HEAD', timeout: 2000 }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

async function monitor() {
  // 每 5s 探活；不通则杀掉子进程，让 exit 处理器重启
  while (!stopping) {
    await new Promise((r) => setTimeout(r, 5000));
    if (!child) continue;
    const code = await ping();
    if (!code) {
      console.log('[guardian] ping failed, killing child to trigger restart');
      try { child.kill('SIGTERM'); } catch {}
    }
  }
}

process.on('SIGINT', () => { stopping = true; if (child) child.kill(); process.exit(0); });
process.on('SIGTERM', () => { stopping = true; if (child) child.kill(); process.exit(0); });

start();
monitor();
