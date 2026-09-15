// views.js - 各视图的渲染函数
// v2: 新增 NPC 好感度侧边栏、主线进度条、NPC 出场 Banner
// v3: 新增 renderCrisis 危机事件视图（红色高亮、技能检定提示）
// v4: 新增 HUD 顶栏（时间/精力/红包/人情债）+ 5 大属性条 + 时间段活动选择

import { $, $$, showView, toast } from "./dom.js";
import { getStatPanels, getPhase, formatEffectChange, formatAllEffects, getAttribute } from "../engine/statSystem.js";
import { normGender } from "../engine/statSystem.js";
import {
  DAILY_ACTIVITIES,
  ACTIVITY_GROUPS,
  isActivityAvailable,
  getDisabledReason,
} from "../../data/daily_activities.js";
import {
  getCurrentTimeLabel,
  getTimeSlotProgress,
  getTimeProgress,
  getEnergyInfo,
  isLastDay,
} from "../engine/timeSystem.js";
import { getAttributesSnapshot } from "../engine/attributeSystem.js";

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

// ===========================================================
// v4 新增：HUD 顶栏（时间/精力/红包/人情债）
// ===========================================================

/**
 * 渲染 HUD 顶栏
 * 格式：
 *   [时间] 腊月二十九 · 上午  [████████░░] 1/24
 *   [精力] ████████░░ 80/100
 *   [红包] ¥2000  [人情债] ⬤○○○○○○○○○○ 1/10
 */
export function renderHUD(stats) {
  const hudBar = document.getElementById("hud-bar");
  if (!hudBar) return;

  hudBar.classList.add("is-active");

  // 1. 时间信息
  const timeLabel = getCurrentTimeLabel(stats);
  const { current: slotCur, total: slotTotal } = getTimeSlotProgress(stats);
  const timePct = getTimeProgress(stats);
  const isEnd = isLastDay(stats);

  // 2. 精力信息
  const energy = getEnergyInfo(stats);

  // 3. 资源
  const redPacket = stats.redPacket ?? 0;
  const socialDebt = Math.max(0, Math.min(10, stats.socialDebt ?? 0));

  // 人情债可视化（实心/空心圆点）
  const debtDots = Array.from({ length: 10 }).map((_, i) =>
    i < socialDebt
      ? `<span class="debt-dot debt-dot--filled">⬤</span>`
      : `<span class="debt-dot">○</span>`
  ).join("");

  hudBar.innerHTML = `
    <div class="hud-row hud-row--time">
      <span class="hud-label" title="游戏剩余时间 - 8天春节假期后游戏结束">[时间]</span>
      <span class="hud-time">${timeLabel}${isEnd ? " <span class='hud-final'>(最终)</span>" : ""}</span>
      <div class="hud-progress">
        <div class="hud-progress-fill" style="width:${timePct}%"></div>
      </div>
      <span class="hud-progress-text">${slotCur}/${slotTotal}</span>
    </div>
    <div class="hud-row hud-row--energy">
      <span class="hud-label" title="精力值 - 每个活动消耗精力，归零后无法行动，每天重置">[精力]</span>
      <div class="hud-energy stat-energy" style="--energy-pct:${energy.pct}%">
        <div class="stat-energy-fill hud-energy-fill" style="width:${energy.pct}%"></div>
      </div>
      <span class="hud-energy-text">${energy.current}/${energy.max}</span>
      <span class="hud-energy-level">${energy.level}</span>
    </div>
    <div class="hud-row hud-row--resources">
      <span class="hud-label" title="红包金额 - 用于购买礼物和消费活动">[红包]</span>
      <span class="stat-redpacket">¥${redPacket.toLocaleString()}</span>
      <span class="hud-divider"></span>
      <span class="hud-label" title="人情债 - 欠人情会影响结局，越少越好">[人情债]</span>
      <span class="hud-debt">${debtDots}</span>
      <span class="hud-debt-text">${socialDebt}/10</span>
    </div>
  `;
}

/**
 * 渲染结局预览 HUD 小提示（右下角浮动按钮 + 顶部标签）
 * @param {Array} previews - getOutcomePreview 返回的数组
 */
export function renderOutcomeHudPreview(previews) {
  if (!previews || previews.length === 0) return;

  // 创建或更新 HUD 顶部小标签（嵌入 HUD）
  let badge = document.getElementById("hud-outcome-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "hud-outcome-badge";
    badge.className = "hud-outcome-badge";
    badge.title = "点击查看最可能的 3 个结局";
    badge.onclick = () => {
      const stats = window.__yuelao?.game?.state?.currentStats;
      if (stats && typeof window.__yuelao_renderOutcomePreview === "function") {
        window.__yuelao_renderOutcomePreview(stats);
      }
    };
    const hudBar = document.getElementById("hud-bar");
    if (hudBar) hudBar.appendChild(badge);
  }

  // 显示最可能触发 + 概率最高的 1 个结局
  const top = previews[0];
  if (!top) return;

  const triggeredTag = top.triggered
    ? `<span class="hud-outcome-tag hud-outcome-tag--triggered">已触发</span>`
    : `<span class="hud-outcome-tag">${top.probability ?? 50}%</span>`;

  badge.innerHTML = `
    <span class="hud-outcome-label">🔮 最可能结局</span>
    <span class="hud-outcome-emoji">${top.emoji ?? "🎬"}</span>
    <span class="hud-outcome-title">${top.title ?? top.name ?? "?"}</span>
    ${triggeredTag}
  `;
}

/**
 * 渲染 5 大属性（条形图 / 雷达图）
 * 格式：
 *   家庭 ████████░░ 65
 *   事业 █████░░░░░ 45
 *   独立 ███████░░░ 55
 *   浪漫 ██████░░░░ 50
 *   抗压 █████░░░░░ 45
 */
export function renderAttributes(stats) {
  const container = document.getElementById("attr-bars");
  if (!container) return;

  const attrs = getAttributesSnapshot(stats);
  container.innerHTML = attrs.map(a => {
    const pct = Math.max(0, Math.min(100, a.value));
    const fillCount = Math.round(pct / 10); // 0-10 个方块
    const blocks = "█".repeat(fillCount) + "░".repeat(10 - fillCount);
    return `
      <div class="attr-bar" data-attr="${a.key}">
        <span class="attr-label">${a.label}</span>
        <div class="attr-bar-track">
          <div class="attr-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${a.color},${a.color}cc)"></div>
        </div>
        <span class="attr-value">${Math.round(pct)}</span>
      </div>
    `;
  }).join("");
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

  // 场景插画（使用 scene 或 illustration 字段）
  let sceneIllustration = "";
  const sceneFile = event.scene || event.illustration;
  if (sceneFile) {
    const scenePath = sceneFile.includes('.svg') ? sceneFile : `${sceneFile}.svg`;
    sceneIllustration = `<div class="chapter-scene"><img src="assets/scenes/${scenePath}" alt="${event.title}"></div>`;
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
    choicesEl.innerHTML = event.choices.map((c, i) => renderChoice(c, i)).join("");

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

// ===== 单个选项的渲染（支持检定型/普通/金钱型）=====
export function renderChoice(c, i) {
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

  // 消耗标签：精力
  let costBadges = "";
  if (c.energyCost) {
    costBadges += `<span class="choice-energy-cost">⚡ -${c.energyCost}</span>`;
  }
  // 消耗标签：金钱（红包）
  if (c.redPacketCost) {
    costBadges += `<span class="choice-money-cost">🧧 -${c.redPacketCost}</span>`;
  }

  // 检定型选项：带 🎲 图标 + 高亮边框
  const isSkillCheck = !!c.skillCheck;
  const classes = `choice-item ${isSkillCheck ? "choice-skill" : ""}`;
  const diceIcon = isSkillCheck ? '<span class="choice-dice">🎲</span>' : '';

  return `
    <div class="${classes}" data-choice="${i}">
      <div class="choice-number">${i + 1}</div>
      <div class="choice-content">
        <div class="choice-text">${diceIcon}${c.text ?? ""}</div>
        <div class="choice-meta-row">
          ${c.skillCheck ? `<span class="choice-skill-tag">检定 · ${skillCheckAttrLabel(c.skillCheck.attribute)}</span>` : ''}
          <span class="choice-tone">${getToneLabel(c.tone)}</span>
          ${costBadges}
        </div>
        ${affinityHint}
      </div>
    </div>
  `;
}

// ===== 技能检定：属性 key → 中文标签 =====
function skillCheckAttrLabel(attr) {
  const labels = {
    confidence: "自信",
    social: "社交",
    independence: "独立性",
    courage: "勇气",
    wisdom: "智慧",
    eloquence: "口才",
    composure: "镇定",
  };
  return labels[attr] ?? attr;
}

// ===== 技能检定成功率计算 =====
// successRate = clamp((attrValue - difficulty + 50) / 100, 0.1, 0.9)
export function calcSkillCheckSuccessRate(attrValue, difficulty = 30) {
  const raw = (attrValue - difficulty + 50) / 100;
  return Math.max(0.1, Math.min(0.9, raw));
}

// ===== 技能检定 UI =====
/**
 * 渲染技能检定模态弹窗
 * @param {object} choice - 带 skillCheck 字段的选项
 * @param {object} stats - 当前玩家属性
 * @param {function} onResolved - 检定完成回调（参数：{success, choice, feedback}）
 */
export function renderSkillCheck(choice, stats, onResolved) {
  const sc = choice.skillCheck || {};
  const attr = sc.attribute || "confidence";
  const difficulty = sc.difficulty ?? 30;
  const attrValue = stats[attr] ?? stats.confidence ?? 50;
  const attrLabel = skillCheckAttrLabel(attr);

  const successRate = calcSkillCheckSuccessRate(attrValue, difficulty);
  const ratePct = Math.round(successRate * 100);

  // 成功率颜色：红 → 黄 → 绿
  const rateColor = ratePct < 35 ? "#C1440E" : ratePct < 65 ? "#c9a84c" : "#5cb85c";

  // 难度线位置（属性条上的相对位置）
  const diffPos = Math.max(0, Math.min(100, ((attrValue - difficulty + 100) / 100) * 50 + 25));

  // 创建模态框
  const modal = document.createElement("div");
  modal.className = "skill-check-modal";
  modal.innerHTML = `
    <div class="skill-check-backdrop"></div>
    <div class="skill-check-content">
      <div class="skill-check-header">
        <div class="skill-check-label">🎲 技能检定</div>
        <h3 class="skill-check-name">${sc.name ?? choice.text ?? "未知检定"}</h3>
      </div>

      <div class="skill-check-meter-wrap">
        <svg class="skill-check-meter" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="meter-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#C1440E"/>
              <stop offset="50%" stop-color="#c9a84c"/>
              <stop offset="100%" stop-color="#5cb85c"/>
            </linearGradient>
          </defs>
          <!-- 背景弧 -->
          <path d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none" stroke="#2a2a2a" stroke-width="14" stroke-linecap="round"/>
          <!-- 填充弧 -->
          <path class="skill-check-meter-fill"
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none" stroke="url(#meter-grad)" stroke-width="14" stroke-linecap="round"
                stroke-dasharray="251.2"
                stroke-dashoffset="${251.2 * (1 - successRate)}"/>
          <!-- 难度线标记 -->
          <line class="skill-check-diff-line" x1="100" y1="20" x2="100" y2="100"
                stroke="#F4ECD8" stroke-width="2" stroke-dasharray="4,3"
                transform="rotate(${(difficulty / 100) * 180 - 90} 100 100)"/>
        </svg>
        <div class="skill-check-rate" style="color:${rateColor}">${ratePct}%</div>
        <div class="skill-check-rate-label">成功率</div>
      </div>

      <div class="skill-check-info">
        <div class="sc-info-row">
          <span class="sc-info-label">需要属性</span>
          <span class="sc-info-value">${attrLabel}</span>
        </div>
        <div class="sc-info-row">
          <span class="sc-info-label">当前属性</span>
          <span class="sc-info-value">${attrValue}/100</span>
        </div>
        <div class="sc-info-row">
          <span class="sc-info-label">难度</span>
          <span class="sc-info-value">${difficulty}</span>
        </div>
      </div>

      <div class="skill-check-effects">
        <div class="effect-success">
          <span class="effect-icon">✓</span>
          <div class="effect-content">
            <div class="effect-label">若成功</div>
            <div class="effect-desc">${sc.successFeedback ?? "你会赢得这次挑战"}</div>
          </div>
        </div>
        <div class="effect-fail">
          <span class="effect-icon">✗</span>
          <div class="effect-content">
            <div class="effect-label">若失败</div>
            <div class="effect-desc">${sc.failFeedback ?? "情况会有些尴尬"}</div>
          </div>
        </div>
      </div>

      <div class="skill-check-buttons">
        <button class="btn btn--primary skill-check-accept">🎲 接受挑战</button>
        <button class="btn btn--ghost skill-check-decline">放弃</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  // 触发动画
  requestAnimationFrame(() => modal.classList.add("skill-check-modal--visible"));

  // 接受挑战
  modal.querySelector(".skill-check-accept").onclick = () => {
    // 检测强制成功道具
    const forceSuccess = (window.__yuelao?.game?.itemSystem?.consumeForceSuccess?.()) === true;
    const roll = Math.random();
    const success = forceSuccess || roll < successRate;
    showSkillCheckResult(modal, success, choice, sc, onResolved);
  };

  // 放弃
  modal.querySelector(".skill-check-decline").onclick = () => {
    closeModal(modal);
    if (onResolved) onResolved({ declined: true });
  };
}

// 显示检定结果（带动画）
function showSkillCheckResult(modal, success, choice, sc, onResolved) {
  const content = modal.querySelector(".skill-check-content");
  // 给 content 加 blur 效果
  content.classList.add("skill-check-content--rolled");

  const resultClass = success ? "skill-check-success" : "skill-check-fail";
  const resultIcon = success ? "✨" : "💨";
  const resultTitle = success ? "检定成功！" : "检定失败…";
  const feedback = success
    ? (sc.successFeedback ?? "你顺利完成了挑战。")
    : (sc.failFeedback ?? "挑战失败了。");

  const effects = success ? sc.successEffects : sc.failEffects;

  // 创建结果浮层并附加到 modal 而不是 content（避免被 blur 影响）
  const resultHtml = document.createElement("div");
  resultHtml.className = `skill-check-result ${resultClass}`;
  resultHtml.innerHTML = `
    <div class="result-icon">${resultIcon}</div>
    <div class="result-title">${resultTitle}</div>
    <div class="result-feedback">${feedback}</div>
    <button class="btn btn--primary result-confirm">继续</button>
  `;
  modal.appendChild(resultHtml);

  // 触发 CSS 动画
  setTimeout(() => {
    resultHtml.classList.add("result-show");
  }, 30);

  // 继续按钮
  resultHtml.querySelector(".result-confirm").onclick = () => {
    closeModal(modal);
    if (onResolved) {
      onResolved({
        success,
        choice,
        feedback,
        effects: effects || {},
        declined: false,
      });
    }
  };
}

function closeModal(modal) {
  modal.classList.remove("skill-check-modal--visible");
  setTimeout(() => modal.remove(), 250);
}

// ===== 道具背包 UI =====
/**
 * 在右下角创建背包按钮和面板
 * @param {ItemSystem} itemSystem
 * @param {function} onUse - 使用道具回调
 */
export function renderInventory(itemSystem, onUse) {
  if (!itemSystem) return;

  // 清理旧元素
  const oldBtn = document.getElementById("inventory-btn");
  if (oldBtn) oldBtn.remove();
  const oldPanel = document.getElementById("inventory-panel");
  if (oldPanel) oldPanel.remove();

  // 按钮
  const btn = document.createElement("button");
  btn.id = "inventory-btn";
  btn.className = "inventory-btn";
  btn.innerHTML = `🎒 <span class="inventory-count">${itemSystem.items.length}</span>`;
  document.body.appendChild(btn);

  btn.onclick = () => {
    const panel = document.getElementById("inventory-panel");
    if (panel) {
      panel.classList.toggle("inventory-panel--visible");
      if (panel.classList.contains("inventory-panel--visible")) {
        renderInventoryItems(itemSystem, onUse);
      }
    } else {
      openInventoryPanel(itemSystem, onUse);
    }
  };
}

function openInventoryPanel(itemSystem, onUse) {
  const panel = document.createElement("div");
  panel.id = "inventory-panel";
  panel.className = "inventory-panel inventory-panel--visible";
  document.body.appendChild(panel);
  renderInventoryItems(itemSystem, onUse);

  // 点击外部关闭
  setTimeout(() => {
    document.addEventListener("click", function closeHandler(e) {
      if (!panel.contains(e.target) && e.target.id !== "inventory-btn" && !e.target.closest("#inventory-btn")) {
        panel.classList.remove("inventory-panel--visible");
        setTimeout(() => panel.remove(), 200);
        document.removeEventListener("click", closeHandler);
      }
    });
  }, 50);
}

function renderInventoryItems(itemSystem, onUse) {
  const panel = document.getElementById("inventory-panel");
  if (!panel) return;

  const items = itemSystem.getItems();

  if (items.length === 0) {
    panel.innerHTML = `
      <div class="inventory-header">
        <h4 class="inventory-title">🎒 背包</h4>
        <button class="inventory-close">×</button>
      </div>
      <div class="inventory-empty">
        <div class="empty-emoji">🎒</div>
        <div class="empty-text">背包是空的</div>
        <div class="empty-hint">继续探索，收集道具吧</div>
      </div>
    `;
  } else {
    const itemsHtml = items.map((item) => `
      <div class="item-card" data-uid="${item.uid}">
        <div class="item-emoji">${item.emoji ?? "📦"}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-type-tag item-type-${item.type}">${itemTypeLabel(item.type)}</div>
        </div>
        <div class="item-action">
          ${item.consumeOnUse
            ? `<button class="item-use-btn" data-uid="${item.uid}">使用</button>`
            : `<span class="item-passive-mark">已装备</span>`}
        </div>
      </div>
    `).join("");

    panel.innerHTML = `
      <div class="inventory-header">
        <h4 class="inventory-title">🎒 背包（${items.length}）</h4>
        <button class="inventory-close">×</button>
      </div>
      <div class="inventory-list">${itemsHtml}</div>
    `;
  }

  // 关闭按钮
  const closeBtn = panel.querySelector(".inventory-close");
  if (closeBtn) {
    closeBtn.onclick = () => {
      panel.classList.remove("inventory-panel--visible");
      setTimeout(() => panel.remove(), 200);
    };
  }

  // 使用按钮
  panel.querySelectorAll(".item-use-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const uid = parseFloat(btn.dataset.uid);
      const result = itemSystem.useItem(uid);
      if (result.success) {
        // 更新UI
        renderInventoryItems(itemSystem, onUse);
        // 更新按钮上的数字
        const mainBtn = document.getElementById("inventory-btn");
        if (mainBtn) {
          const countEl = mainBtn.querySelector(".inventory-count");
          if (countEl) countEl.textContent = itemSystem.items.length;
        }
        if (onUse) onUse(result);
      }
    };
  });
}

function itemTypeLabel(type) {
  const labels = {
    consumable: "消耗品",
    passive: "被动",
    key_item: "钥匙道具",
    companion: "伙伴",
  };
  return labels[type] ?? type;
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

// ===== v3 新增：危机事件视图 =====
// 显示危机事件正文 + 选项 + 技能检定提示
// 参数：
//   crisis     - 危机对象（含 choices、body、emoji 等）
//   stats      - 当前 stats，用于显示技能检定属性值
//   onChoice   - 选项点击回调 (choiceIndex) => void
export function renderCrisis(crisis, stats, { onChoice }) {
  const titleEl   = document.getElementById("chapter-title");
  const bodyEl    = document.getElementById("chapter-body");
  const choicesEl = document.getElementById("chapter-choices");

  // 标题前缀：警报图标
  if (titleEl) {
    titleEl.innerHTML = `<span class="crisis-badge">⚠ 危机事件</span> ${crisis.emoji ?? "❗"} ${crisis.title ?? "危机"}`;
    titleEl.classList.add("crisis-title");
  }

  // 正文
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="crisis-container">
        <div class="crisis-icon">${crisis.emoji ?? "❗"}</div>
        <div class="crisis-body">${(crisis.body ?? "").replace(/\n/g, "<br>")}</div>
      </div>
    `;
  }

  // 选项
  if (choicesEl && crisis.choices?.length) {
    choicesEl.innerHTML = crisis.choices.map((c, i) => {
      // 技能检定提示
      let skillHint = "";
      if (c.skillCheck) {
        const attrVal = getAttribute(stats ?? {}, c.skillCheck.attr);
        const passable = attrVal >= c.skillCheck.difficulty;
        const attrLabel = {
          career: "事业心", family: "家庭", independence: "独立",
          resilience: "韧性", romance: "浪漫", energy: "精力",
        }[c.skillCheck.attr] ?? c.skillCheck.attr;
        const diffColor = passable ? "#5cb85c" : "#C1440E";
        skillHint = `
          <div class="crisis-skill-check" style="color:${diffColor}">
            🎲 技能检定：${c.skillCheck.label ?? attrLabel}
            <span class="skill-bar-mini">${attrVal}</span>
            <span style="color:#888">/ ${c.skillCheck.difficulty}</span>
            ${passable ? '<span class="skill-pass">[可通过]</span>' : '<span class="skill-fail">[有风险]</span>'}
          </div>
        `;
      }
      // 精力消耗提示
      let costHint = "";
      if (c.energyCost && c.energyCost > 0) {
        costHint = `<div class="crisis-cost">⚡ 消耗精力 ${c.energyCost}</div>`;
      }
      return `
        <div class="choice-item crisis-choice-item" data-choice="${i}">
          <div class="choice-number">${i + 1}</div>
          <div class="choice-content">
            <div class="choice-text">${c.text ?? ""}</div>
            ${skillHint}
            ${costHint}
          </div>
        </div>
      `;
    }).join("");

    // 绑定点击
    choicesEl.querySelectorAll(".crisis-choice-item").forEach((el) => {
      el.style.cursor = "pointer";
      el.onclick = () => {
        const idx = parseInt(el.dataset.choice, 10);
        if (!isNaN(idx) && crisis.choices[idx]) {
          choicesEl.querySelectorAll(".crisis-choice-item").forEach(x => x.classList.remove("choice--selected"));
          el.classList.add("choice--selected");
          if (onChoice) onChoice(idx);
        }
      };
    });
  }
}

// ===== v3 新增：危机结果视图 =====
// 显示玩家选择 + 技能检定结果 + 反馈 + 下一步按钮
export function renderCrisisResult(crisis, choiceIndex, success, feedback, effectsApplied) {
  const container = document.getElementById("chapter-choices");
  if (!container) return;
  const choice = crisis.choices[choiceIndex];
  if (!choice) return;

  // 技能检定结果显示
  let skillResultHtml = "";
  if (choice.skillCheck) {
    const passable = success;
    const resultText = passable ? "✅ 检定通过" : "❌ 检定失败";
    const resultColor = passable ? "#5cb85c" : "#C1440E";
    skillResultHtml = `
      <div class="crisis-skill-result" style="color:${resultColor}">
        🎲 ${choice.skillCheck.label ?? "技能检定"}：${resultText}
      </div>
    `;
  }

  // effects 摘要
  let effectSummary = "";
  if (effectsApplied && effectsApplied.length > 0) {
    effectSummary = `<div class="cr-changes">属性变化：${formatAllEffects(effectsApplied)}</div>`;
  }

  const resultHtml = `
    <div class="choice-result crisis-result">
      <div class="cr-label">你选择了：${choice.text}</div>
      ${skillResultHtml}
      <div class="cr-feedback">${feedback ?? ""}</div>
      ${effectSummary}
      <div class="cr-next">
        <button class="btn btn--primary cr-next-btn" onclick="document.dispatchEvent(new CustomEvent('yuelao:next-chapter'))">
          进入下一章
        </button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", resultHtml);
  container.querySelectorAll(".crisis-choice-item").forEach(el => el.style.pointerEvents = "none");
}

// ===== 结局视图 =====
// v7 新增：支持 15 种结局系统（新结构）+ 兼容旧 ending 结构
// 新结构字段：emoji / title / description / body / bgColor / category / id
// 旧结构字段：name / body / insight
export function renderEnding(ending, stats) {
  if (!ending) {
    console.warn("[views] renderEnding: ending is null");
    return;
  }

  const container = document.getElementById("view-ending");
  const emojiEl  = document.getElementById("ending-emoji");
  const nameEl   = document.getElementById("ending-name");
  const descEl   = document.getElementById("ending-description");
  const bodyEl   = document.getElementById("ending-body");
  const insightEl = document.getElementById("ending-insight");
  const statsEl  = document.getElementById("ending-stats");
  const categoryEl = document.getElementById("ending-category");

  // 标题：兼容旧 name / 新 title
  const title = ending.title ?? ending.name ?? "结局";
  // emoji：新结构有，旧结构给一个默认
  const emoji = ending.emoji ?? "🎬";
  // 描述：新结构 description，旧结构用 insight 替代
  const description = ending.description ?? (ending.insight ? `💡 ${ending.insight}` : "");
  // 正文
  const body = ending.body ?? "";
  // 类别：新结构 category（family/romance/career/mixed）
  const category = ending.category ?? null;
  // 背景色
  const bgColor = ending.bgColor ?? "#0f0f0f";

  // 设置背景色（渐变）
  if (container) {
    container.style.background = `
      radial-gradient(ellipse 60% 40% at 50% 30%, ${bgColor}33 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 50% 90%, ${bgColor}22 0%, transparent 70%),
      var(--bg)
    `;
  }

  if (emojiEl) emojiEl.textContent = emoji;
  if (nameEl) {
    nameEl.textContent = title;
    nameEl.style.background = `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`;
    nameEl.style.webkitBackgroundClip = "text";
    nameEl.style.webkitTextFillColor = "transparent";
    nameEl.style.backgroundClip = "text";
  }
  if (descEl) {
    if (description) {
      descEl.textContent = description;
      descEl.removeAttribute("hidden");
    } else {
      descEl.setAttribute("hidden", "");
    }
  }
  if (bodyEl) {
    // 把正文按 \n\n 分成 3 段（上车前 / 火车上 / 回到大城市后）
    const bodyHtml = renderEndingBody(body);
    bodyEl.innerHTML = bodyHtml;
  }
  if (insightEl) {
    // 旧结构用 insight
    if (ending.insight && !description) {
      insightEl.textContent = `💡 ${ending.insight}`;
      insightEl.removeAttribute("hidden");
    } else {
      insightEl.setAttribute("hidden", "");
    }
  }
  if (categoryEl) {
    if (category) {
      categoryEl.textContent = getCategoryLabel(category);
      categoryEl.style.backgroundColor = getCategoryColor(category);
      categoryEl.removeAttribute("hidden");
    } else {
      categoryEl.setAttribute("hidden", "");
    }
  }
  if (statsEl) {
    if (stats) {
      statsEl.innerHTML = renderEndingStats(stats);
      statsEl.removeAttribute("hidden");
    } else {
      statsEl.setAttribute("hidden", "");
    }
  }
}

// 结局正文分段（按 \n\n 分段，最多 3 段）
function renderEndingBody(body) {
  if (!body) return "";
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0);
  // 若只有 1 段，直接显示
  if (paragraphs.length === 0) return "";
  if (paragraphs.length === 1) {
    return `<div class="ending-paragraph">${paragraphs[0].replace(/\n/g, "<br>")}</div>`;
  }
  // 标签：3 段以内按章节标签
  const labels = ["【上车前】", "【火车上】", "【回到大城市后】"];
  return paragraphs.slice(0, 3).map((p, i) => {
    const label = labels[i] ?? "";
    return `
      <div class="ending-paragraph">
        <div class="ending-paragraph-label">${label}</div>
        <div class="ending-paragraph-text">${p.replace(/\n/g, "<br>")}</div>
      </div>
    `;
  }).join("");
}

// 结局统计面板（属性 + 好感度 + 关键选择）
// 支持两种 stats 结构：
//   1) outcomeEngine 投影的 stats：{ attributes, affection, flags, redPacket }
//   2) 原始 currentStats：{ family, career, npc_mom_affection, flags, ... }
function renderEndingStats(stats) {
  if (!stats) return "";

  // 兼容 _stats（投影后的结构）或原始 stats
  const _stats = stats._stats ?? stats;
  const attrs = _stats.attributes ?? stats;
  const aff = _stats.affection ?? stats;
  const flags = _stats.flags ?? stats.flags ?? {};

  // 5 大属性
  const attrList = [
    { key: "family",       label: "家庭", color: "#5cb85c" },
    { key: "career",       label: "事业", color: "#c9a84c" },
    { key: "independence", label: "独立", color: "#8B5CF6" },
    { key: "romance",      label: "浪漫", color: "#e91e8c" },
    { key: "resilience",   label: "抗压", color: "#2196F3" },
  ];
  const attrItems = attrList.map((a) => {
    let val = attrs[a.key];
    if (typeof val !== "number") val = stats[a.key];
    if (typeof val !== "number") val = 50;
    val = Math.round(clamp(val, 0, 100));
    return `
      <div class="ending-stat-row">
        <span class="ending-stat-label" style="color:${a.color}">${a.label}</span>
        <div class="ending-stat-bar">
          <div class="ending-stat-bar-fill" style="width:${val}%;background:${a.color}"></div>
        </div>
        <span class="ending-stat-value">${val}</span>
      </div>
    `;
  }).join("");

  // NPC 好感度（3 个关键 NPC）
  const npcList = [
    { id: "npc_mom",         label: "妈妈", emoji: "👩" },
    { id: "npc_ex",          label: "前任", emoji: "💔" },
    { id: "npc_blind_date",  label: "相亲", emoji: "💐" },
  ];
  const npcItems = npcList.map((n) => {
    // 优先从 affection 投影中读
    let v = aff[`${n.id}_affection`];
    if (typeof v !== "number") v = stats[`${n.id}_affection`];
    // 兼容旧 npcs 结构
    if (typeof v !== "number") v = stats.npcs?.[n.id];
    if (typeof v !== "number") v = 50;
    v = Math.round(clamp(v, 0, 100));
    return `
      <div class="ending-npc-row">
        <span class="ending-npc-emoji">${n.emoji}</span>
        <span class="ending-npc-name">${n.label}</span>
        <span class="ending-npc-value">${v}</span>
      </div>
    `;
  }).join("");

  // 关键选择 flags
  const flagsList = [];
  if (flags.reconciled_ex) flagsList.push("✅ 与前任重归于好");
  if (flags.completed_grandma_wish) flagsList.push("✅ 完成奶奶心愿");
  if (flags.completed_blind_date) flagsList.push("✅ 相亲进展顺利");
  if (flags.promoted) flagsList.push("✅ 事业晋升");
  if (flags.quit_job) flagsList.push("✅ 裸辞追梦");
  if (flags.flash_engaged) flagsList.push("✅ 闪婚订婚");
  if (flags.hometown_return) flagsList.push("✅ 回乡发展");
  if (flags._forcedOutcomes && Array.isArray(flags._forcedOutcomes)) {
    flagsList.push(`🎯 已解锁结局：${flags._forcedOutcomes.join("、")}`);
  }
  const flagsHtml = flagsList.length > 0
    ? `<div class="ending-flags">${flagsList.map((f) => `<div class="ending-flag">${f}</div>`).join("")}</div>`
    : "";

  // 资源
  const redPacket = Math.round(Number(_stats.redPacket ?? stats.redPacket ?? flags.redPacket ?? 0));

  return `
    <div class="ending-stats-section">
      <div class="ending-stats-title">📊 最终属性</div>
      ${attrItems}
    </div>
    <div class="ending-stats-section">
      <div class="ending-stats-title">💕 关键好感</div>
      ${npcItems}
    </div>
    <div class="ending-stats-section">
      <div class="ending-stats-title">💰 资源</div>
      <div class="ending-resource-row">
        <span class="ending-resource-label">🧧 红包余额</span>
        <span class="ending-resource-value">¥${redPacket.toLocaleString()}</span>
      </div>
    </div>
    ${flagsHtml ? `<div class="ending-stats-section"><div class="ending-stats-title">🏷️ 关键选择</div>${flagsHtml}</div>` : ""}
  `;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function getCategoryLabel(category) {
  const map = { family: "家庭线", romance: "爱情线", career: "事业线", mixed: "混合线" };
  return map[category] ?? "";
}

function getCategoryColor(category) {
  const map = { family: "#FF6B6B", romance: "#E91E63", career: "#4CAF50", mixed: "#FFD700" };
  return map[category] ?? "#888";
}

// ============================================================
// ===== v4 新增：时间段活动选择界面 =====
// ============================================================

// 时间段显示用 emoji
const TIME_SLOT_EMOJI = { 0: "🌅", 1: "🌇", 2: "🌙" };
const TIME_SLOT_LABELS = ["上午", "下午", "晚上"];

// 5 大属性显示标签
const ATTR_LABELS = {
  family: "家庭",
  career: "事业",
  independence: "独立",
  romance: "浪漫",
  resilience: "抗压",
};

// NPC 名称标签（与 NPC_META 保持一致）
const NPC_LABELS = {
  npc_mom: "妈妈",
  npc_dad: "爸爸",
  npc_grandma: "奶奶",
  npc_bestie: "闺蜜",
  npc_ex: "前任",
  npc_blind_date: "相亲对象",
};

/**
 * 渲染时间段活动选择界面
 * @param {object} stats - 当前玩家属性
 * @param {function} onActivityClick - 活动点击回调 (activityId) => void
 */
export function renderTimeSlotSelect(stats, onActivityClick) {
  // 更新顶部日期/时间段
  const dayEl = document.getElementById("ts-day");
  const timeEl = document.getElementById("ts-time");
  const energyValEl = document.getElementById("ts-energy-value");
  const energyFillEl = document.getElementById("ts-energy-fill");
  const moneyEl = document.getElementById("ts-money");

  const day = stats.day ?? 1;
  const timeSlot = stats.timeSlot ?? 0;
  const energy = stats.energy ?? 0;
  const maxEnergy = stats.maxEnergy ?? 100;
  const money = stats.redPacket ?? 0;

  if (dayEl) dayEl.textContent = String(day);
  if (timeEl) timeEl.textContent = `${TIME_SLOT_EMOJI[timeSlot] ?? "⏰"} ${TIME_SLOT_LABELS[timeSlot] ?? "?"}`;
  if (energyValEl) energyValEl.textContent = `${energy}/${maxEnergy}`;
  if (energyFillEl) {
    energyFillEl.style.width = `${Math.max(0, Math.min(100, (energy / maxEnergy) * 100))}%`;
    if (energy < 30) energyFillEl.classList.add("ts-energy-low");
    else energyFillEl.classList.remove("ts-energy-low");
  }
  if (moneyEl) moneyEl.textContent = `¥${money}`;

  // 渲染活动分组
  const container = document.getElementById("ts-activities");
  if (!container) return;

  container.innerHTML = ACTIVITY_GROUPS.map((group) => {
    const cards = group.activities
      .filter((id) => DAILY_ACTIVITIES[id])
      .map((id) => renderActivityCard(id, DAILY_ACTIVITIES[id], stats, onActivityClick))
      .join("");
    return `
      <div class="activity-group">
        <div class="activity-group-title">${group.title}</div>
        <div class="activity-group-list">${cards}</div>
      </div>
    `;
  }).join("");

  // 绑定点击事件
  container.querySelectorAll(".activity-card[data-activity]").forEach((el) => {
    const activityId = el.dataset.activity;
    el.addEventListener("click", () => {
      if (el.classList.contains("activity-card--disabled")) return;
      // 视觉反馈
      container.querySelectorAll(".activity-card").forEach(c => c.classList.remove("activity-card--selected"));
      el.classList.add("activity-card--selected");
      if (onActivityClick) onActivityClick(activityId);
    });
  });
}

function renderActivityCard(id, activity, stats, _onClick) {
  const available = isActivityAvailable(activity, stats);
  const disabledReason = available ? null : getDisabledReason(activity, stats);

  // 精力消耗标签（energyCost > 0 消耗，energyCost < 0 恢复）
  const energyCost = activity.energyCost ?? 0;
  let energyCostHtml = "";
  if (energyCost > 0) {
    energyCostHtml = `<span class="activity-cost activity-cost--energy">⚡ -${energyCost}</span>`;
  } else if (energyCost < 0) {
    energyCostHtml = `<span class="activity-cost activity-cost--energy activity-cost--restore">⚡ +${-energyCost}</span>`;
  }

  // 金钱消耗标签
  let moneyCostHtml = "";
  if (activity.redPacketCost) {
    moneyCostHtml = `<span class="activity-cost activity-cost--money">🧧 -¥${activity.redPacketCost}</span>`;
  }

  // 无消耗（特殊类活动）
  if (energyCost === 0 && !activity.redPacketCost) {
    energyCostHtml = `<span class="activity-cost activity-cost--free">免费</span>`;
  }

  return `
    <div class="activity-card ${available ? "" : "activity-card--disabled"}" data-activity="${id}">
      <div class="activity-card-label">${activity.label}</div>
      <div class="activity-card-desc">${activity.desc}</div>
      <div class="activity-card-costs">
        ${energyCostHtml}
        ${moneyCostHtml}
      </div>
      ${disabledReason ? `<div class="activity-disabled-reason">${disabledReason}</div>` : ""}
    </div>
  `;
}

/**
 * 渲染活动结果浮层
 * @param {object} activity - 已执行的活动
 * @param {object} result - applyActivityEffect 返回值 {stats, changes, item}
 * @param {string} nextLabel - 下一段时间的标签（如 "下午"），如已是最后一段则提示"过夜"
 */
export function renderActivityResult(activity, result, nextLabel) {
  const overlay = document.getElementById("activity-result");
  if (!overlay) return;

  const changes = result.changes || [];
  const changesHtml = changes.map((c) => {
    const isPositive = c.delta > 0;
    const sign = c.delta > 0 ? "+" : "";
    const cls = isPositive ? "stat-change--positive" : "stat-change--negative";
    return `
      <div class="ar-change-row">
        <span class="ar-change-name">${c.label}</span>
        <span class="stat-change ${cls}">${sign}${c.delta}</span>
      </div>
    `;
  }).join("");

  // 下一段时间提示
  const nextHint = nextLabel
    ? `1.5 秒后自动进入「${nextLabel}」`
    : `1.5 秒后过夜，进入下一天`;

  overlay.innerHTML = `
    <div class="activity-result-content">
      <div class="ar-emoji">${extractEmoji(activity.label)}</div>
      <div class="ar-title">${activity.label.replace(/^[^\w\u4e00-\u9fa5]+/, "")}</div>
      <div class="ar-desc">${activity.desc}</div>
      ${changesHtml ? `<div class="ar-changes">${changesHtml}</div>` : ""}
      <button class="btn btn--primary ar-continue-btn">继续</button>
      <div class="ar-next-hint">${nextHint}</div>
    </div>
  `;
  overlay.classList.remove("hidden");
  overlay.removeAttribute("hidden");

  // 点击"继续"按钮手动关闭（事件由 main.js 绑定）
}

function extractEmoji(label) {
  if (!label) return "✨";
  const match = label.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
  return match ? match[1] : "✨";
}

/**
 * 关闭活动结果浮层
 */
export function closeActivityResult() {
  const overlay = document.getElementById("activity-result");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.setAttribute("hidden", "");
  }
}

/**
 * 渲染结局预览浮层
 * v7 新增：支持 3 个最可能结局的预览卡片
 * @param {Array|Object} previewsOrStats - getOutcomePreview 返回的数组 或 旧版 stats 对象
 * @param {function} _calcLikelyEnding - （已废弃）旧版计算函数，保留兼容性
 */
export function renderOutcomePreview(previewsOrStats, _calcLikelyEnding) {
  const overlay = document.getElementById("outcome-preview");
  if (!overlay) return;

  // 兼容两种调用方式：
  // 1) renderOutcomePreview(previewsArray) — 新接口
  // 2) renderOutcomePreview(stats, calcLikelyEnding) — 旧接口
  let previews = [];
  if (Array.isArray(previewsOrStats)) {
    previews = previewsOrStats;
  } else if (previewsOrStats && typeof previewsOrStats === "object") {
    // 旧接口：尝试用 calcLikelyEnding 算出 1 个结局
    try {
      if (typeof _calcLikelyEnding === "function") {
        const ending = _calcLikelyEnding(previewsOrStats);
        if (ending) previews = [{ ...ending, probability: 80, triggered: true }];
      }
    } catch (e) {
      console.warn("[views] renderOutcomePreview 旧接口失败", e);
    }
  }

  if (previews.length === 0) {
    overlay.innerHTML = `
      <div class="activity-result-content">
        <div class="ar-emoji">🔮</div>
        <div class="ar-title">结局预览</div>
        <div class="op-body">数据不足，继续游戏解锁更多线索吧。</div>
        <button class="btn btn--primary op-close-btn">关闭</button>
      </div>
    `;
    overlay.classList.remove("hidden");
    overlay.removeAttribute("hidden");
    bindOutcomePreviewClose(overlay);
    return;
  }

  const previewCards = previews.map((p, i) => {
    const triggered = p.triggered ? "outcome-preview-card--triggered" : "";
    const tagText = p.triggered ? "已触发" : `${p.probability ?? 50}%`;
    const tagClass = p.triggered ? "outcome-tag--triggered" : "outcome-tag--normal";
    const categoryColor = {
      family: "#FF6B6B", romance: "#E91E63", career: "#4CAF50", mixed: "#FFD700",
    }[p.category] ?? "#888";

    return `
      <div class="outcome-preview-card ${triggered}" data-outcome-id="${p.id}">
        <div class="opc-header">
          <span class="opc-emoji">${p.emoji ?? "🎬"}</span>
          <span class="opc-title">${p.title ?? p.name ?? "?"}</span>
          <span class="outcome-tag ${tagClass}" style="background:${categoryColor}">${tagText}</span>
        </div>
        <div class="opc-desc">${p.description ?? ""}</div>
      </div>
    `;
  }).join("");

  overlay.innerHTML = `
    <div class="activity-result-content outcome-preview-content">
      <div class="ar-emoji">🔮</div>
      <div class="ar-title">最可能的 3 个结局</div>
      <div class="outcome-preview-list">${previewCards}</div>
      <button class="btn btn--primary op-close-btn">关闭</button>
    </div>
  `;
  overlay.classList.remove("hidden");
  overlay.removeAttribute("hidden");
  bindOutcomePreviewClose(overlay);
}

function bindOutcomePreviewClose(overlay) {
  const closeBtn = overlay.querySelector(".op-close-btn");
  if (closeBtn) {
    closeBtn.onclick = () => closeOutcomePreview();
  }
}

export function closeOutcomePreview() {
  const overlay = document.getElementById("outcome-preview");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.setAttribute("hidden", "");
  }
}

/**
 * 渲染支线任务面板（占位实现）
 * @param {object} _stats - 当前玩家属性（保留扩展接口）
 * @param {object} sideQuestEngine - 支线任务引擎（含 getAvailable 等方法，可选）
 */
export function renderSideQuestsPanel(_stats, sideQuestEngine) {
  const overlay = document.getElementById("side-quests-panel");
  if (!overlay) return;

  let items = [];
  try {
    if (sideQuestEngine && typeof sideQuestEngine.getAvailable === "function") {
      items = sideQuestEngine.getAvailable(_stats) || [];
    }
  } catch (e) {
    items = [];
  }

  const itemsHtml = items.length > 0
    ? items.map(q => `
        <div class="sqp-item">
          <div class="sqp-item-title">${q.emoji ?? "🎯"} ${q.title ?? q.id}</div>
          <div class="sqp-item-desc">${q.desc ?? ""}</div>
        </div>
      `).join("")
    : `<div class="sqp-empty">当前没有可接取的支线任务。<br>继续推进主线解锁更多内容。</div>`;

  overlay.innerHTML = `
    <div class="activity-result-content">
      <div class="sqp-title">🔍 支线任务</div>
      ${itemsHtml}
      <button class="btn btn--primary sqp-close-btn" style="margin-top:16px;">关闭</button>
    </div>
  `;
  overlay.classList.remove("hidden");
  overlay.removeAttribute("hidden");
}

export function closeSideQuestsPanel() {
  const overlay = document.getElementById("side-quests-panel");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.setAttribute("hidden", "");
  }
}

// 时间段标签工具（供 main.js 使用）
export function getTimeSlotLabel(timeSlot) {
  return TIME_SLOT_LABELS[timeSlot] ?? "?";
}

export function getTimeSlotEmoji(timeSlot) {
  return TIME_SLOT_EMOJI[timeSlot] ?? "⏰";
}

// ===================================================
// v3 新增：支线任务面板渲染
// ===================================================

/**
 * 渲染支线任务面板（#side-quests-panel）
 * - 显示当前活跃的支线任务
 * - 显示玩家已拥有的道具
 * - 点击支线项可展开/收起详情
 */
export function renderSideQuestPanel(engine, { onSelect } = {}) {
  const panel = document.getElementById("side-quests-panel");
  if (!panel) return;

  if (!engine) {
    panel.innerHTML = "";
    return;
  }

  const active = engine.getActiveQuests();
  const items = engine.getItems();
  const completed = engine.completedQuests.size;
  const failed = engine.failedQuests.size;

  const html = `
    <div class="sqp-header">
      <span class="sqp-title">🚩 支线任务</span>
      <button class="sqp-close" data-sq-close>✕</button>
    </div>
    <div class="sqp-stats">
      <span class="sqp-stat">活跃 ${active.length}</span>
      <span class="sqp-stat done">完成 ${completed}</span>
      <span class="sqp-stat fail">失败 ${failed}</span>
      <span class="sqp-stat">道具 ${items.length}</span>
    </div>
    <div class="sqp-list">
      ${active.length === 0
        ? `<div class="sqp-empty">暂无活跃支线任务<br><small>在主线剧情中遇到特定 NPC 会触发</small></div>`
        : active.map(({ quest, currentStep, state }) => `
          <div class="side-quest-item" data-sq-id="${quest.id}">
            <div class="sqi-head">
              <span class="sqi-emoji">${quest.emoji}</span>
              <div class="sqi-info">
                <div class="sqi-title">${quest.title}</div>
                <div class="sqi-step">▸ ${currentStep?.title ?? ""}</div>
              </div>
            </div>
            <div class="sqi-body">${currentStep?.body ?? ""}</div>
            ${currentStep?.choices?.length > 0 ? `
              <div class="sqi-choices">
                ${currentStep.choices.map((c, i) => `
                  <button class="sqi-choice" data-sq-choice="${i}" data-sq-id="${quest.id}">
                    ${c.text}
                  </button>
                `).join("")}
              </div>
            ` : ""}
          </div>
        `).join("")
      }
    </div>
    ${items.length > 0 ? `
      <div class="sqp-items">
        <div class="sqp-section-label">🎒 道具</div>
        <div class="item-badges">
          ${items.map(item => `
            <div class="item-badge" title="${item.desc ?? ""}">
              <span class="ib-name">${item.name}</span>
              <span class="ib-desc">${item.desc ?? ""}</span>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;

  panel.innerHTML = html;

  // 绑定关闭按钮
  const closeBtn = panel.querySelector("[data-sq-close]");
  if (closeBtn) closeBtn.onclick = () => {
    panel.classList.add("hidden");
  };

  // 绑定选项
  panel.querySelectorAll("[data-sq-choice]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const sqId = btn.dataset.sqId;
      const choiceIdx = parseInt(btn.dataset.sqChoice, 10);
      const step = engine.getCurrentStep(sqId);
      if (!step || !step.choices[choiceIdx]) return;
      const choice = step.choices[choiceIdx];
      // 标记这是支线选项
      choice._sideQuestId = sqId;
      if (onSelect) onSelect(choice);
    };
  });
}

/**
 * 在HUD区域显示当前活跃支线任务的小图标（红旗）
 * 该函数只是把活跃任务的数量更新到一个简单指示器
 */
export function renderSideQuestProgress(engine) {
  // 找到或创建侧边栏/HUD中的支线指示
  let indicator = document.getElementById("sq-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "sq-indicator";
    indicator.className = "sq-indicator";
    indicator.innerHTML = `<span class="sqi-flag">🚩</span><span class="sqi-count">0</span>`;
    indicator.title = "点击查看支线任务";
    indicator.onclick = () => {
      // 找到全局 game 引用
      const game = window.__yuelao?.game;
      if (game?.sideQuestEngine) {
        renderSideQuestPanel(game.sideQuestEngine, {
          onSelect: (choice) => {
            if (typeof window.__yuelao_handleChoice === "function") {
              window.__yuelao_handleChoice(choice);
            }
          }
        });
        const panel = document.getElementById("side-quests-panel");
        if (panel) panel.classList.remove("hidden");
      }
    };
    document.body.appendChild(indicator);
  }

  const active = engine ? engine.getActiveQuests().length : 0;
  const completed = engine ? engine.completedQuests.size : 0;
  const countEl = indicator.querySelector(".sqi-count");
  if (countEl) countEl.textContent = active;

  if (active > 0) {
    indicator.classList.add("sq-indicator--active");
  } else {
    indicator.classList.remove("sq-indicator--active");
  }

  if (completed > 0) {
    indicator.classList.add("sq-indicator--has-completed");
  } else {
    indicator.classList.remove("sq-indicator--has-completed");
  }
}
