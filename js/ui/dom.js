// dom.js - DOM 操作工具 + 全局 UI 基础函数

// 简写 document.querySelector
export function $(sel) {
  return document.querySelector(sel);
}

export function $$(sel) {
  return [...document.querySelectorAll(sel)];
}

// 显示指定视图，隐藏其他
export function showView(viewId) {
  $$(".view").forEach(v => v.classList.remove("view--active"));
  const el = document.getElementById(`view-${viewId}`);
  if (el) el.classList.add("view--active");
}

// Toast 提示（2 秒自动消失）
let _toastTimer = null;
export function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.removeAttribute("hidden");
  el.classList.add("toast--visible");
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.classList.remove("toast--visible");
    el.setAttribute("hidden", "");
  }, 2000);
}

// Loading 遮罩
export function showLoading(text = "加载中...") {
  const el = document.getElementById("loading");
  if (!el) return;
  const txt = el.querySelector(".loading-text");
  if (txt) txt.textContent = text;
  el.removeAttribute("hidden");
  el.classList.add("loading--visible");
}

export function hideLoading() {
  const el = document.getElementById("loading");
  if (!el) return;
  el.classList.remove("loading--visible");
  el.setAttribute("hidden", "");
}

// ===== v2 新增：主线进度条 =====
export function showQuestTracker() {
  const el = document.getElementById("quest-tracker");
  if (el) el.removeAttribute("hidden");
}
export function hideQuestTracker() {
  const el = document.getElementById("quest-tracker");
  if (el) el.setAttribute("hidden", "");
}

// ===== v2 新增：主角档案侧边栏 =====
export function showProfileSidebar() {
  const el = document.getElementById("profile-sidebar");
  if (el) el.removeAttribute("hidden");
}
export function hideProfileSidebar() {
  const el = document.getElementById("profile-sidebar");
  if (el) el.setAttribute("hidden", "");
}

// ===== v3 新增：支线任务面板 =====
export function showSideQuestPanel() {
  const el = document.getElementById("side-quests-panel");
  if (el) {
    el.removeAttribute("hidden");
    el.classList.remove("hidden");
  }
}
export function hideSideQuestPanel() {
  const el = document.getElementById("side-quests-panel");
  if (el) {
    el.setAttribute("hidden", "");
    el.classList.add("hidden");
  }
}

// ===== v4 新增：HUD 顶栏 =====
export function showHUD() {
  const el = document.getElementById("hud-bar");
  if (el) el.classList.add("is-active");
}
export function hideHUD() {
  const el = document.getElementById("hud-bar");
  if (el) el.classList.remove("is-active");
}
