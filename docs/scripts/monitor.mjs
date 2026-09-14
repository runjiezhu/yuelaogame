// monitor.mjs - 背景监控脚本
// 用法: node scripts/monitor.mjs
// 功能: 检测空文件、运行 e2e 测试、更新状态文件
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const STATUS_FILE = join(ROOT, ".cursor", "agent", "status.md");
const E2E_FILE = join(ROOT, "scripts", "e2e_test.mjs");

// 必须非空的引擎文件
const CRITICAL_FILES = [
  "js/engine/statSystem.js",
  "js/engine/eventEngine.js",
  "js/engine/gameState.js",
  "js/engine/randomProfile.js",
  "js/ui/dom.js",
  "js/ui/views.js",
  "css/style.css",
  "scripts/e2e_test.mjs",
  "scripts/serve.mjs",
];

function getFileSize(path) {
  try {
    const buf = readFileSync(path);
    return buf.length;
  } catch {
    return -1;
  }
}

function checkEmptyFiles() {
  const issues = [];
  for (const rel of CRITICAL_FILES) {
    const full = join(ROOT, rel);
    const size = getFileSize(full);
    if (size < 10) {
      issues.push(`⚠️ 空文件: ${rel} (${size} bytes)`);
    }
  }
  return issues;
}

function runE2E() {
  console.log("  运行 e2e_test.mjs...");
  try {
    const out = execSync(`node "${E2E_FILE}"`, {
      cwd: ROOT,
      timeout: 30000,
      encoding: "utf-8",
    });
    // 检查是否包含"测试完成"
    if (out.includes("测试完成")) {
      return { ok: true, output: out };
    } else {
      return { ok: false, output: out };
    }
  } catch (e) {
    return { ok: false, output: e.stdout || e.message };
  }
}

function updateStatus(result) {
  const now = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const statusLines = [
    `## 最后更新`,
    `${now} (UTC+8)`,
    ``,
    `## 构建状态`,
    ``,
    `| 检查项 | 状态 | 备注 |`,
    `|--------|------|------|`,
    `| e2e 测试 | ${result.ok ? "✅ 通过" : "❌ 失败"} | ${now} |`,
  ];
  try {
    writeFileSync(STATUS_FILE, statusLines.join("\n") + "\n", "utf-8");
  } catch (e) {
    console.error("无法更新 status.md:", e.message);
  }
}

function main() {
  console.log("===== 月老养成 · 背景监控 =====");
  console.log(`时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`);
  console.log("");

  // 1. 空文件检查
  console.log("[1] 检查关键文件是否为空...");
  const issues = checkEmptyFiles();
  if (issues.length > 0) {
    issues.forEach(i => console.log(" ", i));
  } else {
    console.log("    ✅ 所有关键文件非空");
  }
  console.log("");

  // 2. e2e 测试
  console.log("[2] 运行 e2e 测试...");
  const result = runE2E();
  if (result.ok) {
    console.log("    ✅ e2e 测试通过");
  } else {
    console.log("    ❌ e2e 测试失败");
    console.log("    输出:", result.output.slice(0, 300));
  }
  console.log("");

  // 3. 更新状态
  console.log("[3] 更新状态文件...");
  updateStatus(result);

  console.log("===== 监控完成 =====");
  console.log("");
  if (issues.length === 0 && result.ok) {
    console.log("✅ 项目状态良好，无需干预。");
  } else {
    console.log("⚠️ 发现问题，请查看上方输出。");
  }
}

main();
