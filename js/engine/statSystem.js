// statSystem.js - 7 维属性计算 + 游戏规则
// 档位索引：数字越大越"高端"
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

// 应用选项效果
export function applyEffects(stats, effects) {
  const next = { ...stats };
  if (!effects) return next;

  for (const [key, delta] of Object.entries(effects)) {
    if (key === "age") {
      next.age = (next.age ?? 25) + delta;
    } else if (key === "confidence") {
      next.confidence = Math.max(0, Math.min(100, (next.confidence ?? 50) + delta));
    } else if (key === "social") {
      next.social = Math.max(0, Math.min(100, (next.social ?? 50) + delta));
    } else if (key === "incomeTier") {
      // 向上提升一档
      const tiers = TIERS.incomeTier;
      const idx = tiers.indexOf(next.incomeTier);
      if (idx < tiers.length - 1) next.incomeTier = tiers[idx + 1];
    } else if (key === "assetTier") {
      const tiers = TIERS.assetTier;
      const idx = tiers.indexOf(next.assetTier);
      if (idx < tiers.length - 1) next.assetTier = tiers[idx + 1];
    } else if (key === "looksTier") {
      const tiers = TIERS.looksTier;
      const idx = tiers.indexOf(next.looksTier);
      if (idx < tiers.length - 1) next.looksTier = tiers[idx + 1];
    }
  }
  return next;
}

// 是否触发结局（根据条件）
// 调优目标：平均每局 5-7 章自然结束
export function shouldTriggerEnding(stats, chaptersPlayed) {
  const age = stats.age ?? 25;
  const confidence = stats.confidence ?? 50;
  const social = stats.social ?? 50;
  const totalScore = calcTotalScore(stats);

  // 完美结局：黄金期、自信高、社交好、综合分高
  // 条件：年龄<=30、自信心>=75、社交>=70、综合分>=75
  if (age <= 30 && confidence >= 75 && social >= 70 && totalScore >= 75) {
    return { trigger: true, id: "ending_perfect", reason: "黄金期完美收官" };
  }

  // 差不多就得了：章节>=5、年龄>=30（放宽条件，更容易触发）
  // 适用于：年龄渐长、自信下降的玩家
  if (chaptersPlayed >= 5 && age >= 30) {
    return { trigger: true, id: "ending_compromise", reason: "差不多就得了" };
  }

  // 高不成低不就：自信低、社交低、年龄大
  // 条件：自信心<=30、社交<=40、年龄>=32
  if (confidence <= 30 && social <= 40 && age >= 32) {
    return { trigger: true, id: "ending_stuck", reason: "高不成低不就" };
  }

  // 故事自然结束：章节>=7 强制结束
  // 确保每局不会无限进行
  if (chaptersPlayed >= 7) {
    return { trigger: true, id: "ending_quit", reason: "故事讲完了" };
  }

  // 放下面子：社交高、自信心一般、年龄>=28
  // 适用于：社交能力强但自信心不足的玩家
  if (social >= 70 && confidence <= 60 && age >= 28) {
    return { trigger: true, id: "ending_down_to_earth", reason: "放下面子的踏实" };
  }

  // 大龄剩女线（女性专属）：年龄>=35、自信>=60
  if (normGender(stats.gender) === "女" && age >= 35 && confidence >= 60) {
    return { trigger: true, id: "ending_career_first", reason: "事业优先的强者" };
  }

  // 未触发
  return { trigger: false };
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
