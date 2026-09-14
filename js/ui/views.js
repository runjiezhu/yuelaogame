// views.js - 各视图的渲染函数
import { $, $$, showView, toast } from "./dom.js";
import { getStatPanels, getPhase, formatEffectChange } from "../engine/statSystem.js";
import { normGender } from "../engine/statSystem.js";

// ===== 标题页 =====
export function renderTitle({ onNewGame, onContinue, hasSave }) {
  const btnNew = $("#btn-new-game");
  const btnCon = $("#btn-continue");
  if (btnNew) btnNew.onclick = onNewGame;
  if (btnCon) {
    if (hasSave) {
      btnCon.removeAttribute("hidden");
      btnCon.onclick = onContinue;
    } else {
      btnCon.setAttribute("hidden", "");
    }
  }
}

// ===== 角色卡视图 =====
export function renderCard(profile, { onReroll, onConfirm }) {
  const container = document.getElementById("card-content");
  if (!container) return;

  const gender = normGender(profile.stats.gender);
  const tagHtml = (profile.tags ?? []).map(t => `<span class="card-tag">${t}</span>`).join("");

  container.innerHTML = `
    <div class="card-emoji">${profile.emoji ?? ""}</div>
    <div class="card-name">${profile.name ?? "未知角色"}</div>
    <div class="card-gender">${gender === "女" ? "女" : "男"}性</div>
    <div class="card-tags">${tagHtml}</div>
    <div class="card-backstory">${profile.backstory ?? ""}</div>
    <div class="card-issue">
      <div class="card-issue-label">核心困境</div>
      <div class="card-issue-text">${profile.coreIssue ?? ""}</div>
    </div>
    <div class="card-stats-grid">
      <div class="card-stat-item"><span class="cs-label">年龄</span><span class="cs-value">${profile.stats.age ?? 25}岁</span></div>
      <div class="card-stat-item"><span class="cs-label">城市</span><span class="cs-value">${profile.stats.cityTier ?? ""}</span></div>
      <div class="card-stat-item"><span class="cs-label">家底</span><span class="cs-value">${profile.stats.assetTier ?? ""}</span></div>
      <div class="card-stat-item"><span class="cs-label">学历</span><span class="cs-value">${profile.stats.eduTier ?? ""}</span></div>
      <div class="card-stat-item"><span class="cs-label">颜值</span><span class="cs-value">${profile.stats.looksTier ?? ""}</span></div>
      <div class="card-stat-item"><span class="cs-label">收入</span><span class="cs-value">${profile.stats.incomeTier ?? ""}</span></div>
    </div>
  `;

  const btnReroll = $("#btn-reroll");
  const btnConfirm = $("#btn-confirm");
  if (btnReroll) btnReroll.onclick = onReroll;
  if (btnConfirm) btnConfirm.onclick = onConfirm;
}

// ===== 属性面板视图 =====
export function renderStats(stats, phase) {
  const phaseEl = document.getElementById("phase-label");
  const ageEl   = document.getElementById("age-label");
  const panels  = document.getElementById("stat-panels");

  if (phaseEl) phaseEl.textContent = phase;
  if (ageEl)   ageEl.textContent   = `${stats.age ?? 25}岁`;

  if (panels) {
    const items = getStatPanels(stats);
    panels.innerHTML = items.map(item => `
      <div class="stat-item">
        <span class="stat-label">${item.label}</span>
        <span class="stat-value">${item.value}</span>
      </div>
    `).join("");
  }
}

// ===== 章节剧情视图 =====
export function renderChapter(event, { onChoice }) {
  const titleEl = document.getElementById("chapter-title");
  const bodyEl  = document.getElementById("chapter-body");
  const choicesEl = document.getElementById("chapter-choices");

  if (titleEl) titleEl.textContent = event.title ?? "第？章";
  if (bodyEl)  bodyEl.innerHTML   = (event.body ?? "").replace(/\n/g, "<br>");

  if (choicesEl && event.choices?.length) {
    choicesEl.innerHTML = event.choices.map((c, i) => `
      <div class="choice-item" data-choice="${i}">
        <div class="choice-number">${i + 1}</div>
        <div class="choice-content">
          <div class="choice-text">${c.text ?? ""}</div>
          <div class="choice-tone">${getToneLabel(c.tone)}</div>
        </div>
      </div>
    `).join("");

    choicesEl.querySelectorAll(".choice-item").forEach((el) => {
      el.style.cursor = "pointer";
      el.onclick = () => {
        const idx = parseInt(el.dataset.choice, 10);
        if (!isNaN(idx) && event.choices[idx]) {
          // 高亮选中
          choicesEl.querySelectorAll(".choice-item").forEach(x => x.classList.remove("choice--selected"));
          el.classList.add("choice--selected");
          onChoice(event.choices[idx]);
        }
      };
    });
  }
}

function getToneLabel(tone) {
  const map = { conservative: "保守观望", aggressive: "主动出击", idealist: "理想主义" };
  return map[tone] ?? "";
}

// ===== 选项结果视图（追加到章节下方）=====
export function renderChoiceResult(choice) {
  const container = document.getElementById("chapter-choices");
  if (!container) return;

  const change = formatEffectChange(choice.effects);
  const resultHtml = `
    <div class="choice-result">
      <div class="cr-label">你选择了：${choice.text}</div>
      ${choice.feedback ? `<div class="cr-feedback">${choice.feedback}</div>` : ""}
      ${choice.goldenQuote ? `<div class="cr-quote">💬 ${choice.goldenQuote}</div>` : ""}
      ${change ? `<div class="cr-changes">属性变化：${change}</div>` : ""}
      <div class="cr-next">
        <button class="btn btn--primary cr-next-btn" onclick="document.dispatchEvent(new CustomEvent('yuelao:next-chapter'))">
          进入下一章
        </button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", resultHtml);
  container.querySelectorAll(".choice-item").forEach(el => el.style.pointerEvents = "none");
}

// ===== 结局视图 =====
export function renderEnding(ending, stats) {
  const nameEl   = document.getElementById("ending-name");
  const bodyEl   = document.getElementById("ending-body");
  const insightEl = document.getElementById("ending-insight");

  if (nameEl)    nameEl.textContent    = ending.name ?? "结局";
  if (bodyEl)    bodyEl.innerHTML      = (ending.body ?? "").replace(/\n/g, "<br>");
  if (insightEl) insightEl.textContent = ending.insight ? `洞察：${ending.insight}` : "";
}
