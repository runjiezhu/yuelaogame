// gameState.js - 本地存档管理（localStorage）
// v2: 新增 npcs 好感度、mainQuestProgress 主线进度

const SAVE_KEY = "yuelao_save_v2";  // 升版本，旧档会被忽略

// 6 个 NPC 的初始好感度（来自 npcs.js 的 initialAffinity）
const DEFAULT_NPCS = {
  npc_mom:        50,
  npc_dad:        50,
  npc_grandma:    60,
  npc_bestie:     70,
  npc_ex:         20,   // 前任初始低一点
  npc_blind_date: 30,   // 相亲对象初始低一点
};

// 10 章春节主线的标题（用于 UI 显示）
export const QUEST_TITLES = [
  "腊月二十九 · 抢票回家",          // index 0
  "除夕 · 家庭年夜饭",              // index 1
  "初一 · 走亲戚连环问",            // index 2
  "初二 · 老同学聚会重逢前任",       // index 3
  "初三 · 闺蜜小敏来访",            // index 4
  "初四 · 妈妈的相亲安排",          // index 5
  "初五 · 第一次相亲（林晓）",      // index 6
  "初六 · 和林晓再见面",            // index 7
  "初七 · 爸妈深夜谈心",            // index 8
  "初八 · 离开家乡",                // index 9
];

export function createNewGameState(profile) {
  return {
    profile,
    currentStats: {
      // 原有属性
      gender:     profile.stats.gender,
      age:        profile.stats.age ?? 25,
      cityTier:   profile.stats.cityTier ?? "新一线",
      assetTier:  profile.stats.assetTier ?? "普通",
      eduTier:    profile.stats.eduTier ?? "普通本科",
      looksTier:  profile.stats.looksTier ?? "普通",
      incomeTier: profile.stats.incomeTier ?? "10-30万",
      confidence: profile.stats.confidence ?? 50,
      social:     profile.stats.social ?? 50,
      triggeredEventIds: [],

      // ===== v2 新增 =====
      // NPC 好感度（0-100）
      npcs: { ...DEFAULT_NPCS },

      // 主线进度
      mainQuestProgress:       0,   // 已完成第几章主线（0 = 还没开始）
      currentMainQuestIndex:   0,   // 当前要触发的主线 index（0-9）
      completedMainQuestIds:  [],   // 已完成的主线 id 列表
    },
    chaptersPlayed: 0,
    currentView: "stats",
    pendingEvent: null,
  };
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("[yuelao] 存档失败", e);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // v1 → v2 迁移：补全缺失字段
    if (state.currentStats) {
      if (!state.currentStats.npcs) {
        state.currentStats.npcs = { ...DEFAULT_NPCS };
      }
      if (state.currentStats.mainQuestProgress === undefined) {
        state.currentStats.mainQuestProgress = 0;
      }
      if (state.currentStats.currentMainQuestIndex === undefined) {
        state.currentStats.currentMainQuestIndex = 0;
      }
      if (!state.currentStats.completedMainQuestIds) {
        state.currentStats.completedMainQuestIds = [];
      }
    }
    return state;
  } catch (e) {
    return null;
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
}

// 工具：获取当前主线标题
export function getCurrentQuestTitle(stats) {
  const idx = stats.currentMainQuestIndex ?? 0;
  return QUEST_TITLES[idx] ?? "春节主线";
}
