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
