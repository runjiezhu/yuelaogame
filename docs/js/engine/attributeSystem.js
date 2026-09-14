// attributeSystem.js - 属性系统
// 管理 5 大属性 + NPC 好感度 + 技能检定

// 5 大属性的合法键
const VALID_ATTRIBUTES = new Set([
  "family",
  "career",
  "independence",
  "romance",
  "resilience",
]);

// 有效的 NPC id（与 gameState.js 的 DEFAULT_NPCS 保持一致）
const VALID_NPCS = new Set([
  "npc_mom",
  "npc_dad",
  "npc_grandma",
  "npc_bestie",
  "npc_ex",
  "npc_blind_date",
]);

// 数值约束工具
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 修改属性值（上限 100，下限 0）
 * @param {Object} stats - 当前玩家状态
 * @param {string} name - 属性名
 * @param {number} delta - 变化量（可正可负）
 * @returns {Object} 新状态
 */
export function modifyAttribute(stats, name, delta) {
  if (!VALID_ATTRIBUTES.has(name)) {
    console.warn(`[attributeSystem] 未知属性: ${name}`);
    return stats;
  }
  const current = stats[name] ?? 50;
  const next = clamp(current + delta, 0, 100);
  return { ...stats, [name]: next };
}

/**
 * 修改 NPC 好感度（上限 100，下限 0）
 * @param {Object} stats - 当前玩家状态
 * @param {string} npcId - NPC id
 * @param {number} delta - 变化量
 * @returns {Object} 新状态
 */
export function modifyAffection(stats, npcId, delta) {
  if (!VALID_NPCS.has(npcId)) {
    console.warn(`[attributeSystem] 未知 NPC: ${npcId}`);
    return stats;
  }
  const current = stats.npcs?.[npcId] ?? 50;
  const next = clamp(current + delta, 0, 100);
  return {
    ...stats,
    npcs: { ...(stats.npcs ?? {}), [npcId]: next },
  };
}

/**
 * 技能检定
 * 成功率 = clamp((属性值 - difficulty + 50) / 100, 0.1, 0.9)
 * 平衡难度：difficulty=40 时成功率约 50%
 * 触发随机数 ≤ 成功率则成功
 *
 * @param {number} attributeValue - 当前属性值（0-100）
 * @param {number} difficulty - 难度值（建议 0-100）
 * @returns {{success: boolean, roll: number, successRate: number}}
 */
export function checkSkill(attributeValue, difficulty = 40) {
  const raw = (attributeValue - difficulty + 50) / 100;
  const successRate = clamp(raw, 0.1, 0.9);
  const roll = Math.random(); // [0, 1)
  const success = roll <= successRate;
  return { success, roll, successRate };
}

/**
 * 获取属性值
 * @param {Object} stats
 * @param {string} name
 * @returns {number}
 */
export function getAttribute(stats, name) {
  if (VALID_ATTRIBUTES.has(name)) {
    return stats[name] ?? 50;
  }
  if (name.startsWith("npc_") && name.endsWith("_affection")) {
    const npcId = name.replace("_affection", "");
    return stats.npcs?.[npcId] ?? 50;
  }
  if (VALID_NPCS.has(name)) {
    return stats.npcs?.[name] ?? 50;
  }
  return 0;
}

/**
 * 批量修改多个属性
 * @param {Object} stats
 * @param {Object} changes - { family: +5, career: -3, npc_mom: +2 }
 * @returns {Object} 新状态
 */
export function applyAttributeChanges(stats, changes) {
  if (!changes || typeof changes !== "object") return stats;
  let next = { ...stats };
  for (const [key, delta] of Object.entries(changes)) {
    if (VALID_ATTRIBUTES.has(key)) {
      next = modifyAttribute(next, key, delta);
    } else if (VALID_NPCS.has(key)) {
      next = modifyAffection(next, key, delta);
    } else {
      console.warn(`[attributeSystem] 跳过未知字段: ${key}`);
    }
  }
  return next;
}

/**
 * 获取 5 大属性快照（用于 UI 显示）
 * @param {Object} stats
 * @returns {Array<{key, label, value, color, pct}>}
 */
export function getAttributesSnapshot(stats) {
  return [
    { key: "family",       label: "家庭", value: stats.family        ?? 50, pct: stats.family        ?? 50 },
    { key: "career",       label: "事业", value: stats.career        ?? 50, pct: stats.career        ?? 50 },
    { key: "independence", label: "独立", value: stats.independence  ?? 50, pct: stats.independence  ?? 50 },
    { key: "romance",      label: "浪漫", value: stats.romance       ?? 50, pct: stats.romance       ?? 50 },
    { key: "resilience",   label: "抗压", value: stats.resilience    ?? 50, pct: stats.resilience    ?? 50 },
  ];
}

export { VALID_ATTRIBUTES, VALID_NPCS };