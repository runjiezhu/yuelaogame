// 零依赖静态服务器：服务当前目录，端口 8765
// 用法：node scripts/serve.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const PORT = 8765;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

function safeJoin(root, urlPath) {
  // 去掉 query string
  const clean = urlPath.split("?")[0].split("#")[0];
  let decoded;
  try { decoded = decodeURIComponent(clean); } catch { decoded = clean; }
  // 默认入口
  if (decoded === "/" || decoded === "") decoded = "/index.html";
  const target = normalize(join(root, decoded));
  if (!target.startsWith(root)) return null; // 防路径穿越
  return target;
}

const server = createServer(async (req, res) => {
  try {
    const filePath = safeJoin(ROOT, req.url || "/");
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 " + (err?.message || "Server Error"));
  }
});

server.listen(PORT, () => {
  console.log(`月老养成 已启动: http://localhost:${PORT}/`);
  console.log("按 Ctrl+C 停止服务");
});

// 优雅退出
process.on("SIGINT", () => {
  console.log("\n正在关闭...");
  server.close(() => process.exit(0));
});
