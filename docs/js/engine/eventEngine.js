// 事件引擎：从 EVENTS 池中按当前 stats 筛事件，返回下一个可用事件
// v2: 主线优先 + NPC 好感度 + 春节主线
import { EVENTS, getMainQuestEvents, getRandomEvents } from "../../data/events.js";
import { ENDINGS } from "../../data/endings.js";
import { INSIGHTS } from "../../data/insights.js";
import { shouldTriggerEnding, ageToBand } from "./statSystem.js";

// 性别归一化
const GENDER_MAP = { F: "女", M: "男", 男: "男", 女: "女" };
function normGender(g) { return GENDER_MAP[g] || g; }

// 城市层级归一化
const CITY_TIER_ALIAS = { "二线": "新一线" };
function normCityTier(t) { return CITY_TIER_ALIAS[t] || t; }

const AGE_BAND_ORDER = ["≤22", "23-27", "28-30", "31-34", "35-39", "≥40"];

function randomPick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== 主线 quest 筛选 =====
function pickMainQuestEvent(stats, usedEventIds) {
  const idx = stats.currentMainQuestIndex ?? 0;
  const mainEvents = [...getMainQuestEvents()];
  mainEvents.sort((a, b) => (a.chapterIndex ?? 0) - (b.chapterIndex ?? 0));
  
  // 如果当前 index 超出主线总数，主线已全部完成
  if (idx >= mainEvents.length) return null;
  
  const event = mainEvents[idx];
  
  // 如果当前主线事件已被触发过，跳过（不应该发生，但做防御）
  if (usedEventIds.includes(event.id)) return null;
  
  return event;
}

// ===== 随机事件筛选 =====
// 严格匹配：gender + ageBand + cityTier 都必须匹配
function buildCandidates(stats, usedEventIds) {
  const playerAgeBand = ageToBand(stats.age);
  const normalizedGender = normGender(stats.gender);
  const normalizedCityTier = normCityTier(stats.cityTier);

  return getRandomEvents().filter((e) => {
    if (usedEventIds.includes(e.id)) return false;
    const trig = e.trigger || {};
    
    // 性别必须匹配
    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      if (!trigGenders.includes(normalizedGender)) return false;
    } else { 
      return false; 
    }
    
    // 年龄段必须匹配
    if (trig.ageBands?.length > 0) {
      if (!trig.ageBands.includes(playerAgeBand)) return false;
    } else { 
      return false; 
    }
    
    // 城市必须匹配
    if (trig.cityTiers?.length > 0) {
      const trigCityTiers = trig.cityTiers.map(normCityTier);
      if (!trigCityTiers.includes(normalizedCityTier)) return false;
    }
    
    return true;
  });
}

// 宽松匹配：gender 必须匹配，ageBand 允许前后 3 个档位
function buildCandidatesLenient(stats, usedEventIds) {
  const playerAgeBand = ageToBand(stats.age);
  const normalizedGender = normGender(stats.gender);
  const playerBandIdx = AGE_BAND_ORDER.indexOf(playerAgeBand);

  return getRandomEvents().filter((e) => {
    if (usedEventIds.includes(e.id)) return false;
    const trig = e.trigger || {};
    
    // 性别必须匹配
    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      if (!trigGenders.includes(normalizedGender)) return false;
    } else { 
      return false; 
    }
    
    // 年龄段宽松匹配（前后 3 个档位）
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

function buildCandidatesFallback(stats, usedEventIds) {
  const normalizedGender = normGender(stats.gender);
  return getRandomEvents().filter((e) => {
    if (usedEventIds.includes(e.id)) return false;
    const trig = e.trigger || {};
    if (trig.gender?.length > 0) {
      const trigGenders = trig.gender.map(normGender);
      return trigGenders.includes(normalizedGender);
    }
    return false;
  });
}

function pickRandomEvent(stats, usedEventIds) {
  const strict = buildCandidates(stats, usedEventIds);
  const strictNPC = strict.filter(e => e.npcInvolved && e.npcInvolved.length > 0);
  if (strictNPC.length > 0) return randomPick(strictNPC);
  if (strict.length > 0) return randomPick(strict);

  const lenient = buildCandidatesLenient(stats, usedEventIds);
  const lenientNPC = lenient.filter(e => e.npcInvolved && e.npcInvolved.length > 0);
  if (lenientNPC.length > 0) return randomPick(lenientNPC);
  if (lenient.length > 0) return randomPick(lenient);

  const fallback = buildCandidatesFallback(stats, usedEventIds);
  const fallbackNPC = fallback.filter(e => e.npcInvolved && e.npcInvolved.length > 0);
  if (fallbackNPC.length > 0) return randomPick(fallbackNPC);
  if (fallback.length > 0) return randomPick(fallback);

  console.warn(`[eventEngine] 没有找到任何匹配事件: gender=${normGender(stats.gender)}, ageBand=${ageToBand(stats.age)}`);
  return null;
}

// ===== 匹配结局 =====
function matchEnding(stats) {
  // === 特殊结局（优先级最高）===
  // 1. 主线全部完成
  if ((stats.mainQuestProgress ?? 0) >= 10) {
    const ending = ENDINGS.find(e => e.id === "ending_year_warrior");
    if (ending) return ending;
  }

  // 2. NPC 好感度触发（单项）
  if (stats.npcs?.npc_blind_date >= 70) {
    const ending = ENDINGS.find(e => e.id === "ending_blind_date_success");
    if (ending) return ending;
  }

  // 3. NPC 好感度触发（多项：爸妈）
  if (stats.npcs?.npc_mom >= 60 && stats.npcs?.npc_dad >= 55) {
    const ending = ENDINGS.find(e => e.id === "ending_family_heal");
    if (ending) return ending;
  }

  // 4. NPC 好感度触发（单项：前任）
  if (stats.npcs?.npc_ex >= 65) {
    const ending = ENDINGS.find(e => e.id === "ending_ex_reunion");
    if (ending) return ending;
  }

  // === 按评分匹配普通结局 ===
  let best = null, bestScore = -Infinity;
  for (const ending of ENDINGS) {
    const cond = ending.condition || {};

    // 跳过所有特殊类型（由上面处理）
    if (cond._type || !cond._scoreConfig && Object.keys(cond).length === 0) {
      // 空 condition = default fallback，给予低分
      if (Object.keys(cond).length === 0) {
        bestScore = -100;
        best = ending;
      }
      continue;
    }

    let score = 0;

    if (cond.assetTier && !cond.assetTier.includes(stats.assetTier)) { score = -1; continue; }
    if (cond.cityTier && !cond.cityTier.includes(stats.cityTier)) { score = -1; continue; }
    if (cond.gender && !cond.gender.map(normGender).includes(normGender(stats.gender))) { score = -1; continue; }
    if (cond.ageRange) {
      const [lo, hi] = cond.ageRange;
      if (stats.age < lo || stats.age > hi) { score = -1; continue; }
    }

    // minConfidence / maxConfidence：既是过滤条件，也贡献分数
    if (cond.minConfidence != null) {
      if (stats.confidence < cond.minConfidence) { score = -1; continue; }
      score += (stats.confidence - cond.minConfidence) * 2; // 加权
    }
    if (cond.maxConfidence != null) {
      if (stats.confidence > cond.maxConfidence) { score = -1; continue; }
      score += (cond.maxConfidence - stats.confidence);
    }

    // social 范围：既是过滤条件，也贡献分数
    if (cond.social) {
      if (cond.social.min != null && stats.social < cond.social.min) { score = -1; continue; }
      if (cond.social.max != null && stats.social > cond.social.max) { score = -1; continue; }
      const lo = cond.social.min ?? 0, hi = cond.social.max ?? 100;
      const center = (lo + hi) / 2;
      score += 15 - Math.abs(stats.social - center) / 7;
    }

    if (score > bestScore) { bestScore = score; best = ending; }
  }

  return best || ENDINGS.find(e => e.id === "ending_default_match") || ENDINGS[ENDINGS.length - 1];
}

// ===== 洞察 =====
function pickInsight(bias = null) {
  let pool = INSIGHTS;
  if (bias) pool = pool.filter(i => i.bias === bias);
  if (pool.length === 0) pool = INSIGHTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ===== 包装选项 =====
export function enrichChoices(event) {
  return (event.choices || []).map((choice, idx) => ({
    ...choice,
    id: `${event.id}_c${idx}`,
    result: generateChoiceResult(choice, event),
    insight: pickInsight(choice.tone === "aggressive" ? "中性" : (choice.tone === "idealist" ? "红旗" : "绿旗")),
    feedback: choice.feedback || generateFeedback(choice),
    goldenQuote: choice.goldenQuote || generateGoldenQuote(choice, event),
  }));
}

function generateFeedback(choice) {
  const tone = choice.tone || "neutral";
  const map = {
    conservative: "稳扎稳打，适合当前阶段。",
    aggressive: "主动出击，风险与机遇并存。",
    idealist: "坚持理想，但可能错过眼前的机会。",
    realistic: "面对现实，做出理性的选择。",
    neutral: "你的选择是合理的。",
  };
  return map[tone] || "这是一个选择。";
}

function generateGoldenQuote(choice, event) {
  const insight = pickInsight(choice.tone === "aggressive" ? "中性" : (choice.tone === "idealist" ? "红旗" : "绿旗"));
  return `💬 洞察：${insight.text.slice(0, 80)}...`;
}

function generateChoiceResult(choice, event) {
  const tone = choice.tone || "neutral";
  const map = {
    conservative: "你选择了稳妥的方案。短期内没有惊喜，但也没有意外。",
    aggressive: "你决定改变——不管结果如何，至少不是原地踏步。",
    idealist: "你坚持自己的标准。世界也许会因此让步，也许不会。",
    realistic: "你承认了现实。心里有点疼，但你知道自己必须这么做。",
  };
  return map[tone] || "你做出了选择。";
}

// ===== 主入口 =====
export function nextStep(stats, chaptersPlayed, usedEventIds) {
  const endingCheck = shouldTriggerEnding(stats, chaptersPlayed);
  if (endingCheck.trigger) {
    return { type: "ending", ending: matchEnding(stats) };
  }

  const mainEvent = pickMainQuestEvent(stats, usedEventIds);
  if (mainEvent) {
    return { type: "event", event: { ...mainEvent, choices: enrichChoices(mainEvent) } };
  }

  const randomEvent = pickRandomEvent(stats, usedEventIds);
  if (randomEvent) {
    return { type: "event", event: { ...randomEvent, choices: enrichChoices(randomEvent) } };
  }

  return { type: "ending", ending: matchEnding(stats) };
}
