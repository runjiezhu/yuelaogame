// views.js - 各视图的渲染函数
// v2: 新增 NPC 好感度侧边栏、主线进度条、NPC 出场 Banner

import { $, $$, showView, toast } from "./dom.js";
import { getStatPanels, getPhase, formatEffectChange } from "../engine/statSystem.js";
import { normGender } from "../engine/statSystem.js";

// ===== NPC 元数据（硬编码，与 npcs.js 保持同步）=====
export const NPC_META = {
  npc_mom:        { name: "妈妈",      emoji: "👩", role: "妈妈" },
  npc_dad:        { name: "爸爸",      emoji: "👨", role: "爸爸" },
  npc_grandma:    { name: "奶奶",      emoji: "👵", role: "奶奶" },
  npc_bestie:     { name: "闺蜜小敏",   emoji: "👭", role: "闺蜜" },
  npc_ex:         { name: "前任一凡",   emoji: "💔", role: "前任" },
  npc_blind_date: { name: "相亲林晓",   emoji: "💐", role: "相亲对象" },
};

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

// ===== 主角档案侧边栏（游戏全程显示）=====
export function renderProfileSidebar(profile, stats) {
  const sidebar = document.getElementById("profile-sidebar");
  if (!sidebar) return;

  sidebar.removeAttribute("hidden");

  // 头部
  const emojiEl = document.getElementById("ps-emoji");
  const nameEl  = document.getElementById("ps-name");
  const tagEl   = document.getElementById("ps-tag");
  if (emojiEl) emojiEl.textContent = profile.emoji ?? "👤";
  if (nameEl)  nameEl.textContent  = profile.name ?? "主角";
  if (tagEl) {
    const age = stats.age ?? 25;
    const city = stats.cityTier ?? "";
    const gender = normGender(stats.gender);
    tagEl.textContent = `${age}岁 · ${city} · ${gender === "女" ? "♀" : "♂"}`;
  }

  // NPC 好感度
  renderNpcList(stats.npcs ?? {});

  // 属性简表
  renderStatCompact(stats);
}

function renderNpcList(npcs) {
  const container = document.getElementById("npc-list");
  if (!container) return;

  container.innerHTML = Object.entries(npcs).map(([id, affinity]) => {
    const meta = NPC_META[id] ?? { name: id, emoji: "👤", role: "" };
    const pct = Math.max(0, Math.min(100, affinity));
    const color = pct >= 70 ? "#5cb85c" : pct >= 40 ? "#c9a84c" : "#C1440E";
    return `
      <div class="npc-row" data-npc="${id}">
        <div class="npc-emoji">${meta.emoji}</div>
        <div class="npc-info">
          <div class="npc-name">${meta.name} <span class="npc-role">${meta.role}</span></div>
          <div class="npc-bar"><div class="npc-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        </div>
        <div class="npc-affinity">${affinity}</div>
      </div>
    `;
  }).join("");
}

function renderStatCompact(stats) {
  const container = document.getElementById("stat-compact");
  if (!container) return;

  const confidence = stats.confidence ?? 50;
  const social = stats.social ?? 50;

  container.innerHTML = `
    <div class="stat-compact-row">
      <span class="sc-label">自信</span>
      <div class="sc-bar"><div class="sc-bar-fill" style="width:${confidence}%"></div></div>
      <span class="sc-value">${confidence}</span>
    </div>
    <div class="stat-compact-row">
      <span class="sc-label">社交</span>
      <div class="sc-bar"><div class="sc-bar-fill" style="width:${social}%"></div></div>
      <span class="sc-value">${social}</span>
    </div>
    <div class="stat-compact-row">
      <span class="sc-label">家底</span>
      <span class="sc-value-text">${stats.assetTier ?? ""}</span>
    </div>
    <div class="stat-compact-row">
      <span class="sc-label">学历</span>
      <span class="sc-value-text">${stats.eduTier ?? ""}</span>
    </div>
    <div class="stat-compact-row">
      <span class="sc-label">颜值</span>
      <span class="sc-value-text">${stats.looksTier ?? ""}</span>
    </div>
    <div class="stat-compact-row">
      <span class="sc-label">收入</span>
      <span class="sc-value-text">${stats.incomeTier ?? ""}</span>
    </div>
  `;
}

// ===== 主线进度条 =====
export function renderQuestTracker(progress, currentQuestTitle, totalQuests = 10) {
  const tracker = document.getElementById("quest-tracker");
  if (!tracker) return;

  tracker.removeAttribute("hidden");

  const pct = totalQuests > 0 ? Math.round((progress / totalQuests) * 100) : 0;
  const currentEl = document.getElementById("qt-current");
  const fillEl    = document.getElementById("qt-bar-fill");
  const titleEl   = document.getElementById("qt-title");

  if (currentEl) currentEl.textContent = Math.min(progress + 1, totalQuests);
  if (fillEl)    fillEl.style.width    = `${pct}%`;
  if (titleEl)   titleEl.textContent   = currentQuestTitle ?? "春节主线";
}

// ===== 章节剧情视图（增强 NPC 显示）=====
export function renderChapter(event, { onChoice }) {
  const titleEl   = document.getElementById("chapter-title");
  const bodyEl    = document.getElementById("chapter-body");
  const choicesEl = document.getElementById("chapter-choices");

  // 背景渐变色
  const novelView = document.getElementById("view-novel");
  if (novelView && event.bgColor) {
    novelView.style.background = `linear-gradient(180deg, ${event.bgColor} 0%, #0f0f0f 40%)`;
  }

  // 标题前缀
  const titlePrefix = event.isMainQuest ? "🧧 " : "";
  if (titleEl) titleEl.textContent = titlePrefix + (event.title ?? "第？章");

  // 场景插画
  let sceneIllustration = "";
  if (event.illustration) {
    sceneIllustration = `<img src="assets/scenes/${event.illustration}" class="scene-img" alt="${event.title}">`;
  }

  // NPC 出场 Banner（带头像圆圈）
  let npcBanner = "";
  if (event.npcInvolved && event.npcInvolved.length > 0) {
    const npcAvatars = event.npcInvolved.map(id => {
      const meta = NPC_META[id] ?? { name: id, emoji: "👤" };
      return `<div class="npc-avatar">${meta.emoji}</div>`;
    }).join("");
    
    const npcChips = event.npcInvolved.map(id => {
      const meta = NPC_META[id] ?? { name: id, emoji: "👤" };
      return `<span class="npc-chip">${meta.emoji} ${meta.name}</span>`;
    }).join("");
    
    npcBanner = `
      <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 20px;">
        ${npcAvatars}
      </div>
      <div class="npc-banner">出场：${npcChips}</div>
    `;
  }

  // 替换 body 中的模板变量 {{npc_xxx.name}}
  let bodyText = event.body ?? "";
  const npcPool = window.__currentNpcPool || [];
  npcPool.forEach(npc => {
    // 提取 npc id 的最后一部分（去掉 npc_ 前缀和可能的 _female/_male 后缀）
    const npcKey = npc.id.replace(/^npc_/, '').replace(/_(female|male)$/, '');
    const regex = new RegExp(`\\{\\{npc_${npcKey}\\.name\\}\\}`, 'g');
    bodyText = bodyText.replace(regex, npc.name);
  });

  if (bodyEl) {
    bodyEl.innerHTML = sceneIllustration + npcBanner + bodyText.replace(/\n/g, "<br>");
  }

  if (choicesEl && event.choices?.length) {
    choicesEl.innerHTML = event.choices.map((c, i) => {
      // affinity 变化提示
      let affinityHint = "";
      if (c.affinityChange) {
        const hints = Object.entries(c.affinityChange).map(([id, delta]) => {
          const name = NPC_META[id]?.name ?? id;
          const sign = delta > 0 ? "+" : "";
          const color = delta > 0 ? "#5cb85c" : "#C1440E";
          return `<span class="aff-hint" style="color:${color}">${name}${sign}${delta}</span>`;
        }).join(" · ");
        affinityHint = `<div class="aff-hints">${hints}</div>`;
      }

      return `
        <div class="choice-item" data-choice="${i}">
          <div class="choice-number">${i + 1}</div>
          <div class="choice-content">
            <div class="choice-text">${c.text ?? ""}</div>
            <div class="choice-tone">${getToneLabel(c.tone)}</div>
            ${affinityHint}
          </div>
        </div>
      `;
    }).join("");

    choicesEl.querySelectorAll(".choice-item").forEach((el) => {
      el.style.cursor = "pointer";
      el.onclick = () => {
        const idx = parseInt(el.dataset.choice, 10);
        if (!isNaN(idx) && event.choices[idx]) {
          choicesEl.querySelectorAll(".choice-item").forEach(x => x.classList.remove("choice--selected"));
          el.classList.add("choice--selected");
          onChoice(event.choices[idx]);
        }
      };
    });
  }
}

function getToneLabel(tone) {
  const map = {
    conservative: "保守观望",
    aggressive: "主动出击",
    idealist: "理想主义",
    realistic: "现实主义",
  };
  return map[tone] ?? "";
}

// ===== 选项结果视图 =====
export function renderChoiceResult(choice) {
  const container = document.getElementById("chapter-choices");
  if (!container) return;

  const change = formatEffectChange(choice.effects);
  const resultHtml = `
    <div class="choice-result">
      <div class="cr-label">你选择了：${choice.text}</div>
      ${choice.feedback ? `<div class="cr-feedback">${choice.feedback}</div>` : ""}
      ${choice.goldenQuote ? `<div class="cr-quote">${choice.goldenQuote}</div>` : ""}
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
  const nameEl    = document.getElementById("ending-name");
  const bodyEl    = document.getElementById("ending-body");
  const insightEl = document.getElementById("ending-insight");

  if (nameEl)    nameEl.textContent    = ending.name ?? "结局";
  if (bodyEl)    bodyEl.innerHTML      = (ending.body ?? "").replace(/\n/g, "<br>");
  if (insightEl) insightEl.textContent = ending.insight ? `💡 ${ending.insight}` : "";
}
