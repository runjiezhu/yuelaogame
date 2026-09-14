// js/engine/outcomeEngine.js
// 结局引擎：从 5 大属性 + 3 大 NPC 好感度 + flags 综合决定 15 种结局
//
// 数据来源（player_stats.js + statSystem.js 已建立）：
//   - 5 大属性：stats.attributes.{family,career,independence,romance,resilience}（顶层也有同名字段）
//   - NPC 好感度：stats.npcs.{npc_mom,npc_dad,npc_grandma,npc_bestie,npc_ex,npc_blind_date}
//   - 资源：stats.redPacket / stats.socialDebt / stats.energy
//   - flags：stats.flags.{reconciled_ex, completed_grandma_wish, ...}
//
// 兼容策略：
//   - computeStats() 统一从 currentStats 抽取 5 大属性 + 3 大 NPC + flags
//   - 若新结构字段缺失，按旧规则（npcs / confidence / social）派生
//   - determineOutcome() 按 mixed → family → romance → career 优先级匹配

import {
  OUTCOMES,
  OUTCOME_CATEGORIES,
  DEFAULT_OUTCOME,
} from "../../data/outcomes.js";

// ===== 数值工具 =====
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ===== 5 大属性读取（统一入口） =====
// 同时支持 stats.attributes.X 与 stats.X（顶层）两种结构
function readAttribute(currentStats, key) {
  if (!currentStats) return 50;
  // 优先读 stats.attributes
  if (currentStats.attributes && typeof currentStats.attributes[key] === "number") {
    return clamp(currentStats.attributes[key], 0, 100);
  }
  // 顶层（player_stats.js）
  if (typeof currentStats[key] === "number") {
    return clamp(currentStats[key], 0, 100);
  }
  return 50;
}

// ===== NPC 好感度读取 =====
function readNpcAffection(currentStats, npcId) {
  if (!currentStats) return 50;
  // 新结构：stats.affection.npc_xxx_affection
  if (currentStats.affection && typeof currentStats.affection[`${npcId}_affection`] === "number") {
    return clamp(currentStats.affection[`${npcId}_affection`], 0, 100);
  }
  // 顶层：stats.npc_xxx_affection（player_stats.js）
  if (typeof currentStats[`${npcId}_affection`] === "number") {
    return clamp(currentStats[`${npcId}_affection`], 0, 100);
  }
  // 旧结构：stats.npcs.npc_xxx
  if (currentStats.npcs && typeof currentStats.npcs[npcId] === "number") {
    return clamp(currentStats.npcs[npcId], 0, 100);
  }
  // 默认值（来自 player_stats.js DEFAULT_NPCS）
  const DEFAULTS = { npc_mom: 50, npc_dad: 50, npc_grandma: 60, npc_bestie: 70, npc_ex: 20, npc_blind_date: 30 };
  return DEFAULTS[npcId] ?? 50;
}

// ===== flags 读取（包含 redPacket 顶层访问）=====
function readFlags(currentStats) {
  if (!currentStats) {
    return {
      reconciled_ex: false,
      completed_grandma_wish: false,
      completed_blind_date: false,
      promoted: false,
      quit_job: false,
      flash_engaged: false,
      hometown_return: false,
      redPacket: 0,
    };
  }
  const flagSource = currentStats.flags || {};
  return {
    reconciled_ex:          Boolean(flagSource.reconciled_ex ?? currentStats.reconciled_ex),
    completed_grandma_wish: Boolean(flagSource.completed_grandma_wish ?? currentStats.completedGrandmaWish),
    completed_blind_date:   Boolean(flagSource.completed_blind_date),
    promoted:               Boolean(flagSource.promoted),
    quit_job:               Boolean(flagSource.quit_job),
    flash_engaged:          Boolean(flagSource.flash_engaged),
    hometown_return:        Boolean(flagSource.hometown_return),
    redPacket:              Number(currentStats.redPacket ?? flagSource.redPacket ?? 0),
    // 透传所有自定义 flag（含 _forcedOutcomes 等）
    ...flagSource,
  };
}

// ===== 派生属性（兜底逻辑：若新属性未初始化，按旧规则计算） =====
const CITY_BONUS = {
  "海外": 20, "一线": 15, "新一线": 10, "二线": 5, "三四五线": 0, "县城/农村": -5,
};
const ASSET_BONUS = {
  "A9": 25, "A8": 20, "A7": 15, "A6": 10, "普通": 5,
};
const INCOME_BONUS = {
  "100万+": 25, "50-100万": 20, "30-50万": 15, "10-30万": 10, "无/<10万": 3,
};

/**
 * 把 currentStats 投影成 outcomes.js 期望的 stats 结构
 * @param {Object} currentStats
 * @returns {Object} { attributes, affection, flags, redPacket, raw }
 *
 * 字段访问约定：
 *   stats.attributes.{family,career,independence,romance,resilience}
 *   stats.affection.{npc_mom_affection,npc_ex_affection,npc_blind_date_affection}
 *   stats.flags.{reconciled_ex,completed_grandma_wish,...}
 *   stats.redPacket          // 顶层可直接访问
 */
export function computeStats(currentStats) {
  if (!currentStats) {
    return {
      attributes: { family: 50, career: 50, independence: 50, romance: 50, resilience: 50 },
      affection:  { npc_mom_affection: 50, npc_ex_affection: 50, npc_blind_date_affection: 50 },
      flags:      { reconciled_ex: false, completed_grandma_wish: false, redPacket: 0 },
      redPacket:  0,
      raw:        currentStats,
    };
  }

  // ===== 5 大属性 =====
  // 先读真实值，若字段缺失再按旧规则派生
  const confidence = clamp(currentStats.confidence ?? 50, 0, 100);
  const social     = clamp(currentStats.social ?? 50, 0, 100);

  const mom    = readNpcAffection(currentStats, "npc_mom");
  const dad    = readNpcAffection(currentStats, "npc_dad");
  const grand  = readNpcAffection(currentStats, "npc_grandma");
  const ex     = readNpcAffection(currentStats, "npc_ex");
  const bd     = readNpcAffection(currentStats, "npc_blind_date");

  const hasNewAttrs = currentStats.attributes && (
    typeof currentStats.attributes.family === "number"
    || typeof currentStats.attributes.career === "number"
  );

  let attributes;
  if (hasNewAttrs) {
    // 优先使用新结构（顶层有 family/career 等）
    attributes = {
      family:       readAttribute(currentStats, "family"),
      career:       readAttribute(currentStats, "career"),
      independence: readAttribute(currentStats, "independence"),
      romance:      readAttribute(currentStats, "romance"),
      resilience:   readAttribute(currentStats, "resilience"),
    };
  } else {
    // 旧结构派生
    const family = clamp(mom * 0.4 + dad * 0.3 + grand * 0.3, 0, 100);
    const assetScore = ASSET_BONUS[currentStats.assetTier] ?? 5;
    const incomeScore = INCOME_BONUS[currentStats.incomeTier] ?? 5;
    const career = clamp(social * 0.6 + assetScore * 1.5 + incomeScore * 1.0, 0, 100);
    const cityBonus = CITY_BONUS[currentStats.cityTier] ?? 0;
    const independence = clamp(confidence * 0.85 + cityBonus, 0, 100);
    const romance = clamp(Math.max(ex, bd) * 0.9 + Math.min(ex, bd) * 0.1, 0, 100);
    const socialPenalty = social < 30 ? -10 : social > 80 ? -5 : 0;
    const resilience = clamp(confidence * 0.7 + 30 + socialPenalty, 0, 100);
    attributes = { family, career, independence, romance, resilience };
  }

  // ===== 3 大 NPC 好感度（结局判定用） =====
  const affection = {
    npc_mom_affection:        mom,
    npc_ex_affection:         ex,
    npc_blind_date_affection: bd,
  };

  // ===== flags =====
  const flags = readFlags(currentStats);

  // ===== 顶层 redPacket（结局条件可直接 stats.redPacket 访问）=====
  const redPacket = Number(currentStats.redPacket ?? flags.redPacket ?? 0);

  return { attributes, affection, flags, redPacket, raw: currentStats };
}

/**
 * 按优先级匹配结局：mixed → family → romance → career
 * @param {Object} currentStats
 * @returns {Object} outcome 对象（含 _stats 字段）
 */
export function determineOutcome(currentStats) {
  const stats = computeStats(currentStats);

  for (const category of OUTCOME_CATEGORIES) {
    for (const outcome of Object.values(OUTCOMES)) {
      if (outcome.category === category) {
        try {
          if (outcome.condition(stats)) {
            return { ...outcome, _stats: stats };
          }
        } catch (e) {
          console.warn(`[outcomeEngine] 结局条件出错: ${outcome.id}`, e);
        }
      }
    }
  }

  // 默认结局：单身贵族
  return { ...DEFAULT_OUTCOME, _stats: stats };
}

/**
 * 返回当前 stats 下最可能触发的 N 个结局（用于 HUD 预览）
 * @param {Object} currentStats
 * @param {number} limit
 * @returns {Array} outcomes 数组（含 triggered / probability 字段）
 */
export function getOutcomePreview(currentStats, limit = 3) {
  const stats = computeStats(currentStats);

  const previews = Object.values(OUTCOMES).map((outcome) => {
    let triggered = false;
    try {
      triggered = outcome.condition(stats);
    } catch (e) {
      triggered = false;
    }
    return {
      ...outcome,
      probability: estimateProbability(stats, outcome),
      triggered,
    };
  });

  return previews
    .sort((a, b) => {
      if (a.triggered !== b.triggered) return b.triggered ? 1 : -1;
      return b.probability - a.probability;
    })
    .slice(0, limit);
}

/**
 * 粗略估计结局概率（5-95%）
 */
function estimateProbability(stats, outcome) {
  let score = 50;
  const attrs = stats.attributes;
  const npcs = stats.affection;

  if (outcome.category === "mixed") {
    const top3 = Object.values(attrs).sort((a, b) => b - a).slice(0, 3);
    const avg = top3.reduce((s, v) => s + v, 0) / 3;
    score += (avg - 50) * 0.6;
  } else if (outcome.category === "family") {
    score += (attrs.family - 50) * 0.7;
    if (outcome.id === "outcome_family_dependent") {
      score += (50 - attrs.family) * 0.5;
    }
  } else if (outcome.category === "romance") {
    score += (attrs.romance - 50) * 0.7;
    const maxNpc = Math.max(npcs.npc_ex_affection, npcs.npc_blind_date_affection);
    score += (maxNpc - 50) * 0.3;
  } else if (outcome.category === "career") {
    score += (attrs.career - 50) * 0.7;
    score += (attrs.independence - 50) * 0.2;
    if (outcome.id === "outcome_career_lie_flat") {
      score += (50 - attrs.resilience) * 0.6;
    }
    if (outcome.id === "outcome_career_quit_dream") {
      score += (attrs.independence - 50) * 0.4;
    }
  }

  return Math.max(5, Math.min(95, Math.round(score)));
}

/**
 * 兼容旧接口
 */
export function resolveEnding(currentStats, chaptersPlayed = 0) {
  return determineOutcome(currentStats);
}
