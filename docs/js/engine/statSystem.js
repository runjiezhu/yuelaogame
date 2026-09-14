// statSystem.js - 7 维属性计算 + 游戏规则
// v3: 新增 crisis_events 系统扩展属性 + 技能检定
// v4: 新增 applyActivityEffect 时间段活动效果
export const TIER_INDEX = {
  assetTier:   ["普通",    "A6",      "A7",      "A8",       "A9"],
  eduTier:     ["专科及以下", "普通本科", "211",    "985硕",     "海外",   "博士"],
  cityTier:    ["县城/农村", "三四五线", "新一线", "二线",    "一线",    "海外"],
  looksTier:   ["偏下",    "普通",    "班级领先", "院花院草",  "明星级"],
  incomeTier:  ["无/<10万", "10-30万", "30-50万", "50-100万", "100万+"],
};

export const TIERS = {
  assetTier:   ["普通",    "A6",      "A7",      "A8",       "A9"],
  eduTier:     ["专科及以下", "普通本科", "211",    "985硕",     "海外",   "博士"],
  cityTier:    ["县城/农村", "三四五线", "新一线", "二线",    "一线",    "海外"],
  looksTier:   ["偏下",    "普通",    "班级领先", "院花院草",  "明星级"],
  incomeTier:  ["无/<10万", "10-30万", "30-50万", "50-100万", "100万+"],
  ageBand:     ["≤22",     "23-27",   "28-30",   "31-34",    "35-39",  "≥40"],
};

// 归一化：archetype 用 F/M，events 用 男/女
const GENDER_MAP = { F: "女", M: "男", 男: "男", 女: "女" };
export function normGender(g) {
  return GENDER_MAP[g] || g;
}

// 年龄 → 年龄段
export function ageToBand(age) {
  if (age <= 22) return "≤22";
  if (age <= 27) return "23-27";
  if (age <= 30) return "28-30";
  if (age <= 34) return "31-34";
  if (age <= 39) return "35-39";
  return "≥40";
}

// 年龄段 → 阶段标签
const PHASE_LABELS = {
  "≤22":  "初入社会",
  "23-27": "黄金期",
  "28-30": "而立之年",
  "31-34": "成熟期",
  "35-39": "大龄期",
  "≥40":   "不惑期",
};

export function getPhase(age) {
  return PHASE_LABELS[ageToBand(age)] || "未知";
}

// 档位 → 数值（用于算总分）
export function tierToScore(key, tier) {
  const idx = TIERS[key]?.indexOf(tier);
  return idx ?? 0;
}

// 计算综合实力分（加权平均，0-100）
export function calcTotalScore(stats) {
  const w = { assetTier: 3, eduTier: 2, cityTier: 1.5, looksTier: 3, incomeTier: 2, social: 2 };
  let sum = 0, totalW = 0;
  for (const [key, weight] of Object.entries(w)) {
    if (key === "social") {
      sum += (stats.social ?? 50) * weight;
    } else {
      const max = (TIERS[key]?.length ?? 1) - 1;
      const score = max > 0 ? tierToScore(key, stats[key]) / max * 100 : 0;
      sum += score * weight;
    }
    totalW += weight;
  }
  return Math.round(sum / totalW);
}

// 获取属性面板数据（前端展示用）
export function getStatPanels(stats) {
  const band = ageToBand(stats.age);
  return [
    { label: "年龄", value: `${stats.age}岁（${band}）` },
    { label: "城市", value: stats.cityTier },
    { label: "家底", value: stats.assetTier },
    { label: "学历", value: stats.eduTier },
    { label: "颜值", value: stats.looksTier },
    { label: "收入", value: stats.incomeTier },
    { label: "自信", value: `${stats.confidence ?? 50}/100` },
    { label: "社交", value: `${stats.social ?? 50}/100` },
  ];
}

// 格式化属性变化描述
export function formatEffectChange(effects) {
  if (!effects) return "";
  const parts = [];
  for (const [key, delta] of Object.entries(effects)) {
    if (key === "age") parts.push(`年龄 ${delta > 0 ? "+" : ""}${delta}`);
    else if (key === "confidence") parts.push(`自信 ${delta > 0 ? "+" : ""}${delta}`);
    else if (key === "social") parts.push(`社交 ${delta > 0 ? "+" : ""}${delta}`);
    else if (key === "incomeTier") parts.push("收入 ↑");
    else if (key === "assetTier") parts.push("家底 ↑");
    else if (key === "looksTier") parts.push("颜值 ↑");
  }
  return parts.join(" | ");
}

// ===== v2 新增 =====

// 应用选项效果（基础版，只改属性）
// v3: 支持 crisis_events 系统扩展的属性（career/family/independence/resilience/romance/energy）与资源（redPacket/socialDebt）
export function applyStatEffects(stats, effects) {
  const next = { ...stats };
  if (!effects) return next;

  // 多维度属性（0-100 区间，0/100 截断）
  const ATTR_KEYS = ["career", "family", "independence", "resilience", "romance", "energy"];

  for (const [key, delta] of Object.entries(effects)) {
    if (key === "age") {
      next.age = (next.age ?? 25) + delta;
    } else if (key === "confidence") {
      next.confidence = Math.max(0, Math.min(100, (next.confidence ?? 50) + delta));
    } else if (key === "social") {
      next.social = Math.max(0, Math.min(100, (next.social ?? 50) + delta));
    } else if (ATTR_KEYS.includes(key)) {
      // v3: 多维度属性写入 stats.attributes 子对象
      if (!next.attributes) next.attributes = {};
      const cur = next.attributes[key] ?? 50;
      next.attributes[key] = Math.max(0, Math.min(100, cur + delta));
      // 同时也写入顶层（向后兼容 player_stats.js）
      next[key] = next.attributes[key];
    } else if (key === "redPacket") {
      // v3: 红包现金余额（可负）
      next.redPacket = (next.redPacket ?? 0) + delta;
    } else if (key === "socialDebt") {
      // v3: 人情债计数
      next.socialDebt = (next.socialDebt ?? 0) + delta;
    } else if (key === "day") {
      next.day = (next.day ?? 1) + delta;
    } else if (key === "timeSlot") {
      next.timeSlot = (next.timeSlot ?? 0) + delta;
    } else if (key === "incomeTier") {
      const tiers = TIERS.incomeTier;
      const idx = tiers.indexOf(next.incomeTier);
      if (idx >= 0 && idx < tiers.length - 1) next.incomeTier = tiers[idx + 1];
    } else if (key === "assetTier") {
      const tiers = TIERS.assetTier;
      const idx = tiers.indexOf(next.assetTier);
      if (idx >= 0 && idx < tiers.length - 1) next.assetTier = tiers[idx + 1];
    } else if (key === "looksTier") {
      const tiers = TIERS.looksTier;
      const idx = tiers.indexOf(next.looksTier);
      if (idx >= 0 && idx < tiers.length - 1) next.looksTier = tiers[idx + 1];
    } else if (key === "flag") {
      // v3: 标记位（e.g. { type: "flag", key: "exposed_mama_boy", value: true }）
      // 由 applyEffects 单独处理；此处忽略
    }
    // 未知字段静默忽略，保持向后兼容
  }
  return next;
}

// 应用完整选项效果（引擎层用这个）
// choice = { effects, affinityChange, _event: { isMainQuest, id, unlockedNext } }
// v3: 新增 flag 操作支持（如 { type: "flag", key: "...", value: true }）
export function applyEffects(stats, choice) {
  // 1. 分离 flag 效果与普通效果
  const normalEffects = {};
  const flagEffects = [];
  if (choice.effects && Array.isArray(choice.effects)) {
    // crisis_events 风格：effects 是数组，每个元素是 { type, target, delta }
    for (const eff of choice.effects) {
      if (eff.type === "flag") {
        flagEffects.push(eff);
      } else if (eff.type === "attr") {
        // 把 {type:"attr", target:"career", delta:15} 转成 {career:15}
        normalEffects[eff.target] = (normalEffects[eff.target] ?? 0) + eff.delta;
      } else if (eff.type === "affection") {
        // {type:"affection", target:"npc_mom_affection", delta:-25} → 暂存，2 步处理
        if (!choice.affinityChange) choice.affinityChange = {};
        // 兼容 target 可能是 "npc_xxx" 或 "npc_xxx_affection"
        const npcId = eff.target.replace(/_affection$/, "");
        choice.affinityChange[npcId] = (choice.affinityChange[npcId] ?? 0) + eff.delta;
      } else if (eff.type === "energy" || eff.type === "redPacket" || eff.type === "socialDebt") {
        normalEffects[eff.type] = (normalEffects[eff.type] ?? 0) + eff.delta;
      }
    }
  } else if (choice.effects && typeof choice.effects === "object") {
    // 旧 events.js 风格：effects 是扁平对象
    Object.assign(normalEffects, choice.effects);
  }

  // 2. 应用基础属性变化
  let next = applyStatEffects(stats, normalEffects);

  // 3. 应用 NPC 好感度变化
  if (choice.affinityChange && next.npcs) {
    for (const [npcId, delta] of Object.entries(choice.affinityChange)) {
      const cur = next.npcs[npcId] ?? 50;
      next.npcs[npcId] = Math.max(0, Math.min(100, cur + delta));
    }
  }

  // 4. 主线进度推进（如果是主线 quest）
  if (choice._event?.isMainQuest) {
    const currentIdx = next.currentMainQuestIndex ?? 0;
    next.mainQuestProgress = (next.mainQuestProgress ?? 0) + 1;
    next.completedMainQuestIds = [
      ...(next.completedMainQuestIds ?? []),
      choice._event.id,
    ];
    // 推进到下一章（最多到第 9 章）
    if (currentIdx < 9) {
      next.currentMainQuestIndex = currentIdx + 1;
    }
  }

  // 5. 应用 flag 标记
  if (flagEffects.length > 0) {
    if (!next.flags) next.flags = {};
    for (const f of flagEffects) {
      next.flags[f.key] = f.value;
    }
  }

  return next;
}

// ===== v3 新增：多维度属性访问辅助函数 =====
// 从 stats 中读取一个多维度属性值，未定义时返回 0
// 优先读取嵌套 stats.attributes，缺失时回退到平级 stats[key]
export function getAttribute(stats, attrName) {
  if (!stats) return 0;
  if (stats.attributes && stats.attributes[attrName] !== undefined) {
    return stats.attributes[attrName];
  }
  if (stats[attrName] !== undefined) return stats[attrName];
  return 0;
}

// 从 stats 中读取 NPC 好感度（npc_xxx 或 npc_xxx_affection）
export function getNpcAffinity(stats, npcId) {
  if (!stats) return 0;
  if (stats.npcs && stats.npcs[npcId] !== undefined) {
    return stats.npcs[npcId];
  }
  // player_stats.js 用 npc_xxx_affection 形式
  const flatKey = `${npcId}_affection`;
  if (stats[flatKey] !== undefined) return stats[flatKey];
  return 0;
}

// 获取当前游戏天数
export function getDay(stats) {
  return stats?.day ?? 1;
}

// 获取红包余额
export function getRedPacket(stats) {
  return stats?.redPacket ?? 0;
}

// 读取 flag
export function hasFlag(stats, key) {
  return Boolean(stats?.flags?.[key]);
}

// ===== v3 新增：技能检定 =====
// 检查玩家属性是否通过难度检定，返回 boolean
// 难度值 0-100，玩家的属性值 >= difficulty 时成功
export function skillCheck(stats, attrName, difficulty) {
  const attrValue = getAttribute(stats, attrName);
  return attrValue >= difficulty;
}

// ===== v3 新增：格式化所有属性变化（包括 attributes 和资源）=====
export function formatAllEffects(effects) {
  if (!effects) return "";
  const parts = [];
  const NPC_NAME_MAP = {
    npc_mom: "妈妈", npc_dad: "爸爸", npc_grandma: "奶奶",
    npc_bestie: "闺蜜", npc_ex: "前任", npc_blind_date: "相亲对象",
  };
  const ATTR_NAME_MAP = {
    career: "事业心", family: "家庭", independence: "独立",
    resilience: "韧性", romance: "浪漫", energy: "精力",
  };
  for (const eff of (Array.isArray(effects) ? effects : [])) {
    if (eff.type === "attr") {
      const label = ATTR_NAME_MAP[eff.target] ?? eff.target;
      parts.push(`${label} ${eff.delta > 0 ? "+" : ""}${eff.delta}`);
    } else if (eff.type === "affection") {
      const npcId = eff.target.replace(/_affection$/, "");
      const label = NPC_NAME_MAP[npcId] ?? npcId;
      parts.push(`${label}好感 ${eff.delta > 0 ? "+" : ""}${eff.delta}`);
    } else if (eff.type === "energy") {
      parts.push(`精力 ${eff.delta > 0 ? "+" : ""}${eff.delta}`);
    } else if (eff.type === "redPacket") {
      parts.push(`红包 ${eff.delta > 0 ? "+" : ""}${eff.delta}`);
    } else if (eff.type === "socialDebt") {
      parts.push(`人情 ${eff.delta > 0 ? "+" : ""}${eff.delta}`);
    } else if (eff.type === "flag") {
      parts.push(`标记 ${eff.key}=${eff.value}`);
    }
  }
  // 兼容扁平对象格式
  if (!Array.isArray(effects) && typeof effects === "object") {
    for (const [key, delta] of Object.entries(effects)) {
      const label = ATTR_NAME_MAP[key] ?? key;
      parts.push(`${label} ${delta > 0 ? "+" : ""}${delta}`);
    }
  }
  return parts.join(" · ");
}

// ===== v4 新增：应用时间段活动效果 =====
// activity = { energyCost, redPacketCost, effect: {type, target, delta}, attrEffect }
// 返回值：{ stats, changes }  其中 changes 用于 UI 显示
//
// effect.type 取值：
//   "affection"        target: "npc_mom_affection" → 修改 stats.npcs.npc_mom
//   "attr"             target: "career"           → 修改 stats.career (同时写 attributes)
//   "redPacket"        delta: 整数                 → 修改 stats.redPacket
//   "energy"           delta: 整数                 → 修改 stats.energy
//   "advance_main"     推进 mainQuestIndex
//   "open_side_quests" 标记打开支线任务 UI
//   "open_outcome_preview" 标记打开结局预览 UI
export function applyActivityEffect(stats, activity) {
  // 浅拷贝 stats，但深拷贝 npcs（避免共享引用导致外部 stats 被意外修改）
  const next = { ...stats };
  if (stats.npcs && typeof stats.npcs === "object") {
    next.npcs = { ...stats.npcs };
  }
  if (stats.attributes && typeof stats.attributes === "object") {
    next.attributes = { ...stats.attributes };
  }
  const changes = [];
  // 追踪本活动已应用的资源类型，避免 effect 与 energyCost/redPacketCost 重复计数
  const appliedResources = new Set();

  // 1. 处理精力消耗/恢复
  const energyCost = activity.energyCost ?? 0;
  if (energyCost !== 0) {
    const prev = next.energy ?? 0;
    let newEnergy = prev - energyCost;
    newEnergy = Math.max(0, Math.min(next.maxEnergy ?? 100, newEnergy));
    next.energy = newEnergy;
    // 负数 energyCost 表示恢复精力，显示为正向 delta
    const displayDelta = energyCost < 0 ? -energyCost : -energyCost;
    changes.push({ type: "energy", label: "⚡ 精力", delta: displayDelta });
    appliedResources.add("energy");
  }

  // 2. 处理金钱消耗（redPacketCost）
  if (activity.redPacketCost) {
    const prev = next.redPacket ?? 0;
    next.redPacket = Math.max(0, prev - activity.redPacketCost);
    changes.push({ type: "redPacket", label: "🧧 红包", delta: -activity.redPacketCost });
    appliedResources.add("redPacket");
  }

  // 3. 处理 effect（按 type 分发）
  const eff = activity.effect || {};
  switch (eff.type) {
    case "affection": {
      const npcKey = (eff.target || "").replace(/_affection$/, "");
      if (npcKey && next.npcs) {
        const prev = next.npcs[npcKey] ?? 50;
        const newVal = Math.max(0, Math.min(100, prev + (eff.delta || 0)));
        next.npcs[npcKey] = newVal;
        const meta = {
          npc_mom:        { name: "妈妈" },
          npc_dad:        { name: "爸爸" },
          npc_grandma:    { name: "奶奶" },
          npc_bestie:     { name: "闺蜜" },
          npc_ex:         { name: "前任" },
          npc_blind_date: { name: "相亲对象" },
        }[npcKey] || { name: npcKey };
        changes.push({ type: "npc", label: `💕 ${meta.name}好感`, delta: eff.delta, key: npcKey });
      }
      break;
    }
    case "attr": {
      const key = eff.target;
      const prev = next[key] ?? 50;
      const newVal = Math.max(0, Math.min(100, prev + (eff.delta || 0)));
      next[key] = newVal;
      // 同步更新 attributes 子对象
      if (!next.attributes) next.attributes = {};
      next.attributes[key] = newVal;
      const labels = { career: "事业", family: "家庭", independence: "独立", romance: "浪漫", resilience: "抗压" };
      changes.push({ type: "attr", label: labels[key] || key, delta: eff.delta, key });
      break;
    }
    case "redPacket": {
      // 若 redPacketCost 已经处理过金钱变化，这里跳过避免重复
      if (appliedResources.has("redPacket")) break;
      const prev = next.redPacket ?? 0;
      next.redPacket = Math.max(0, prev + (eff.delta || 0));
      if (eff.delta !== 0) {
        changes.push({ type: "redPacket", label: "🧧 红包", delta: eff.delta });
      }
      break;
    }
    case "energy": {
      // 若 energyCost 已经处理过精力变化，这里跳过避免重复
      if (appliedResources.has("energy")) break;
      const prev = next.energy ?? 0;
      const newEnergy = Math.max(0, Math.min(next.maxEnergy ?? 100, prev + (eff.delta || 0)));
      next.energy = newEnergy;
      if (eff.delta !== 0) {
        changes.push({ type: "energy", label: "⚡ 精力", delta: eff.delta });
      }
      break;
    }
    case "advance_main": {
      next.mainQuestProgress = (next.mainQuestProgress ?? 0) + 1;
      if ((next.currentMainQuestIndex ?? 0) < 9) {
        next.currentMainQuestIndex = (next.currentMainQuestIndex ?? 0) + 1;
      }
      changes.push({ type: "mainline", label: "🧧 主线进度", delta: 1 });
      break;
    }
    case "open_side_quests": {
      changes.push({ type: "ui", label: "🔍 查看支线任务", ui: "side_quests" });
      break;
    }
    case "open_outcome_preview": {
      changes.push({ type: "ui", label: "🔮 结局预览", ui: "outcome_preview" });
      break;
    }
    default:
      break;
  }

  // 4. 处理 attrEffect（5 大属性微调 + NPC 好感度额外加成）
  if (activity.attrEffect && typeof activity.attrEffect === "object") {
    const labels = { career: "事业", family: "家庭", independence: "独立", romance: "浪漫", resilience: "抗压" };
    const npcLabels = { npc_mom: "妈妈", npc_dad: "爸爸", npc_grandma: "奶奶", npc_bestie: "闺蜜", npc_ex: "前任", npc_blind_date: "相亲对象" };
    for (const [rawKey, delta] of Object.entries(activity.attrEffect)) {
      if (delta === 0 || delta == null) continue;
      // 归一化 NPC key（兼容 "npc_mom_affection" / "npc_mom" 两种写法）
      const key = rawKey.replace(/_affection$/, "");
      if (npcLabels[key]) {
        if (next.npcs) {
          const prev = next.npcs[key] ?? 50;
          next.npcs[key] = Math.max(0, Math.min(100, prev + delta));
          changes.push({ type: "npc", label: `💕 ${npcLabels[key]}好感`, delta: delta });
        }
      } else {
        const prev = next[key] ?? 50;
        const newVal = Math.max(0, Math.min(100, prev + delta));
        next[key] = newVal;
        if (!next.attributes) next.attributes = {};
        next.attributes[key] = newVal;
        changes.push({ type: "attr", label: labels[key] || key, delta: delta, key });
      }
    }
  }

  return { stats: next, changes };
}

// 是否触发结局（扩展版，包含主线结局）
export function shouldTriggerEnding(stats, chaptersPlayed) {
  const age = stats.age ?? 25;
  const confidence = stats.confidence ?? 50;
  const social = stats.social ?? 50;
  const totalScore = calcTotalScore(stats);

  // 优先级 1：主线全部完成 → 触发年度战役结局
  if ((stats.mainQuestProgress ?? 0) >= 10) {
    return { trigger: true, id: "ending_year_warrior", reason: "春节主线全部完成" };
  }

  // 优先级 2：NPC 好感度触发结局（优先级高）
  if (stats.npcs?.npc_blind_date >= 70) {
    return { trigger: true, id: "ending_blind_date_success", reason: "与相亲对象林晓修成正果" };
  }
  if (stats.npcs?.npc_mom >= 60 && stats.npcs?.npc_dad >= 50) {
    return { trigger: true, id: "ending_family_heal", reason: "与父母达成和解" };
  }
  if (stats.npcs?.npc_ex >= 65) {
    return { trigger: true, id: "ending_ex_reunion", reason: "与前任达成和解" };
  }

  // 优先级 3：经典属性结局
  if (age <= 30 && confidence >= 75 && social >= 70 && totalScore >= 75) {
    return { trigger: true, id: "ending_perfect_match", reason: "黄金期完美收官" };
  }

  if (chaptersPlayed >= 5 && age >= 30) {
    return { trigger: true, id: "ending_default_match", reason: "差不多就得了" };
  }

  if (confidence <= 30 && social <= 40 && age >= 32) {
    return { trigger: true, id: "ending_marriage_market_loop", reason: "高不成低不就" };
  }

  if (chaptersPlayed >= 8) {
    return { trigger: true, id: "ending_default_match", reason: "故事讲完了" };
  }

  if (social >= 70 && confidence <= 60 && age >= 28) {
    return { trigger: true, id: "ending_down_to_earth", reason: "放下面子的踏实" };
  }

  if (normGender(stats.gender) === "女" && age >= 35 && confidence >= 60) {
    return { trigger: true, id: "ending_career_first", reason: "事业优先的强者" };
  }

  // 低社交 + 一线/海外城市
  if (social <= 35 && ["一线", "新一线", "海外"].includes(stats.cityTier)) {
    return { trigger: true, id: "ending_evade_master", reason: "逃离大师" };
  }

  // 未触发
  return { trigger: false };
}