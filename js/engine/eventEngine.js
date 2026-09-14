// 事件引擎：从 EVENTS 池中按当前 stats 筛事件，返回下一个可用事件
import { EVENTS } from "../../data/events.js";
import { ENDINGS } from "../../data/endings.js";
import { INSIGHTS } from "../../data/insights.js";
import { shouldTriggerEnding, ageToBand } from "./statSystem.js";

// 性别归一化：archetype 用 F/M，event/ending 用 男/女，两边互通
const GENDER_MAP = { F: "女", M: "男", 男: "男", 女: "女" };
function normGender(g) {
  return GENDER_MAP[g] || g;
}

// 城市层级归一化（双向映射）
const CITY_TIER_ALIAS = {
  // event 数据中的写法 → 归一化目标
  "二线": "新一线",
};
function normCityTier(t) {
  return CITY_TIER_ALIAS[t] || t;
}

// 年龄段优先级排序（用于找最接近的年龄段）
const AGE_BAND_ORDER = ["≤22", "23-27", "28-30", "31-34", "35-39", "≥40"];
function ageBandDistance(band) {
  return AGE_BAND_ORDER.indexOf(band);
}

// 从候选池中随机选一条
function randomPick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// 筛出所有未触发 + 性别匹配 + 年龄段接近（±3档）的事件
// 宽松匹配：确保游戏始终能继续，不卡死
function buildCandidates(stats, usedEventIds) {
  const playerAgeBand = ageToBand(stats.age);
  const normalizedGender = normGender(stats.gender);
  const normalizedCityTier = normCityTier(stats.cityTier);
  const playerBandIdx = AGE_BAND_ORDER.indexOf(playerAgeBand);

  return EVENTS.filter((e) => {
    if (usedEventIds.includes(e.id)) return false;

    const trig = e.trigger || {};

    // 性别：必须匹配
    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      if (!trigGenders.includes(normalizedGender)) return false;
    } else {
      return false; // 没有性别限制的事件不算
    }

    // 年龄段：严格匹配
    if (trig.ageBands?.length > 0) {
      if (!trig.ageBands.includes(playerAgeBand)) return false;
    } else {
      return false;
    }

    // 城市：可选，若有则匹配
    if (trig.cityTiers?.length > 0) {
      const trigCityTiers = trig.cityTiers.map(normCityTier);
      if (!trigCityTiers.includes(normalizedCityTier)) return false;
    }

    return true;
  });
}

// 筛出宽松匹配（城市不要求，年龄段±3档）
function buildCandidatesLenient(stats, usedEventIds) {
  const playerAgeBand = ageToBand(stats.age);
  const normalizedGender = normGender(stats.gender);
  const playerBandIdx = AGE_BAND_ORDER.indexOf(playerAgeBand);

  return EVENTS.filter((e) => {
    if (usedEventIds.includes(e.id)) return false;

    const trig = e.trigger || {};

    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      if (!trigGenders.includes(normalizedGender)) return false;
    } else {
      return false;
    }

    // 年龄段±3档
    if (trig.ageBands?.length > 0) {
      const trigBandIdxs = trig.ageBands.map(b => AGE_BAND_ORDER.indexOf(b));
      const nearMatch = trigBandIdxs.some(idx => idx >= 0 && Math.abs(idx - playerBandIdx) <= 3);
      if (!nearMatch) return false;
    } else {
      return false;
    }

    return true;
  });
}

// 兜底：只要求性别匹配的事件（城市/年龄段都不限）
function buildCandidatesFallback(stats, usedEventIds) {
  const normalizedGender = normGender(stats.gender);
  return EVENTS.filter((e) => {
    if (usedEventIds.includes(e.id)) return false;
    const trig = e.trigger || {};
    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      return trigGenders.includes(normalizedGender);
    }
    return false;
  });
}

// 主选事件函数：三层 fallback 确保游戏永不死
function pickNextEvent(stats, usedEventIds) {
  // 第一层：严格匹配（性别+年龄段+城市）
  const strict = buildCandidates(stats, usedEventIds);
  if (strict.length > 0) return randomPick(strict);

  // 第二层：宽松匹配（性别+年龄段±3档，城市不限）
  const lenient = buildCandidatesLenient(stats, usedEventIds);
  if (lenient.length > 0) return randomPick(lenient);

  // 第三层：兜底（只要求性别匹配）
  const fallback = buildCandidatesFallback(stats, usedEventIds);
  if (fallback.length > 0) return randomPick(fallback);

  // 真没有任何可触发的事件了
  console.warn(`[eventEngine] 没有找到任何匹配事件: gender=${normGender(stats.gender)}, ageBand=${ageToBand(stats.age)}, city=${normCityTier(stats.cityTier)}`);
  return null;
}

// 匹配结局（按 condition 评分，最高分胜出；带 fallback 默认结局）
function matchEnding(stats) {
  const ageBand = ageToBand(stats.age);
  let best = null;
  let bestScore = -Infinity;

  for (const ending of ENDINGS) {
    const cond = ending.condition || {};
    let score = 0;
    let required = 0;

    // 必备条件不满足直接 0 分
    if (cond.assetTier && !cond.assetTier.includes(stats.assetTier)) {
      score = -1;
      continue;
    }
    if (cond.cityTier && !cond.cityTier.includes(stats.cityTier)) {
      score = -1;
      continue;
    }
    if (cond.gender && !cond.gender.map(normGender).includes(normGender(stats.gender))) {
      score = -1;
      continue;
    }
    if (cond.ageRange) {
      const [lo, hi] = cond.ageRange;
      if (stats.age < lo || stats.age > hi) {
        score = -1;
        continue;
      }
    }

    // 软条件累加
    if (cond.minConfidence != null) {
      if (stats.confidence < cond.minConfidence) {
        score = -1;
        continue;
      }
      score += (stats.confidence - cond.minConfidence);
    }
    if (cond.maxConfidence != null) {
      if (stats.confidence > cond.maxConfidence) {
        score = -1;
        continue;
      }
      score += (cond.maxConfidence - stats.confidence);
    }
    if (cond.social) {
      if (cond.social.min != null && stats.social < cond.social.min) {
        score = -1;
        continue;
      }
      if (cond.social.max != null && stats.social > cond.social.max) {
        score = -1;
        continue;
      }
      // 落在区间中点越近越好
      const lo = cond.social.min ?? 0;
      const hi = cond.social.max ?? 100;
      const center = (lo + hi) / 2;
      score += 10 - Math.abs(stats.social - center) / 10;
    }

    if (score > bestScore) {
      bestScore = score;
      best = ending;
    }
  }
  return best || ENDINGS[ENDINGS.length - 1]; // fallback 默认结局
}

// 随机抽一条洞察作为选项反馈
function pickInsight(bias = null) {
  let pool = INSIGHTS;
  if (bias) pool = pool.filter((i) => i.bias === bias);
  if (pool.length === 0) pool = INSIGHTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// 包装选项：在原选项基础上补 result 文本 + 引用洞察
export function enrichChoices(event) {
  return (event.choices || []).map((choice, idx) => ({
    ...choice,
    id: `${event.id}_c${idx}`,
    // 选项的 result 文案：基于 tone 决定风格
    result: generateChoiceResult(choice, event),
    // 反馈用的洞察
    insight: pickInsight(choice.tone === "aggressive" ? "中性" : (choice.tone === "idealist" ? "红旗" : "绿旗")),
    // 确保有 feedback 和 goldenQuote
    feedback: choice.feedback || generateFeedback(choice),
    goldenQuote: choice.goldenQuote || generateGoldenQuote(choice, event),
  }));
}

// 根据 tone 生成 feedback
function generateFeedback(choice) {
  const tone = choice.tone || "neutral";
  const feedbackMap = {
    conservative: "稳扎稳打，适合当前阶段。",
    aggressive: "主动出击，风险与机遇并存。",
    idealist: "坚持理想，但可能错过眼前的机会。",
    realistic: "面对现实，做出理性的选择。",
    neutral: "你的选择是合理的。",
  };
  return feedbackMap[tone] || "这是一个选择。";
}

// 根据选项生成金句
function generateGoldenQuote(choice, event) {
  const insight = pickInsight(choice.tone === "aggressive" ? "中性" : (choice.tone === "idealist" ? "红旗" : "绿旗"));
  // 截取洞察的前50个字作为金句
  const shortInsight = insight.text.slice(0, 80);
  return `💬 洞察：${shortInsight}...`;
}

// 根据 tone 生成 result 文案
function generateChoiceResult(choice, event) {
  const tone = choice.tone || "neutral";
  const txt = {
    conservative: "你选择了稳妥的方案。短期内没有惊喜，但也没有意外。",
    aggressive: "你决定改变——不管结果如何，至少不是原地踏步。",
    idealist: "你坚持自己的标准。世界也许会因此让步，也许不会。",
    realistic: "你承认了现实。心里有点疼，但你知道自己必须这么做。",
  }[tone] || "你做出了选择。";
  return txt;
}

// 主入口：返回下一步要显示的事件 or 结局
export function nextStep(stats, chaptersPlayed, usedEventIds) {
  if (shouldTriggerEnding(stats, chaptersPlayed).trigger) {
    return { type: "ending", ending: matchEnding(stats) };
  }
  const event = pickNextEvent(stats, usedEventIds);
  if (!event) {
    return { type: "ending", ending: matchEnding(stats) };
  }
  return {
    type: "event",
    event: { ...event, choices: enrichChoices(event) },
  };
}
