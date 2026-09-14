// gameState.js - 本地存档管理（localStorage）
// v2: 新增 npcs 好感度、mainQuestProgress 主线进度
// v3: 新增 time/energy/5 大属性/resources 玩家养成属性

import { createDefaultPlayerStats } from "../../data/player_stats.js";

const SAVE_KEY = "yuelao_save_v3";  // 升版本，旧档会被忽略

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
  // v3 玩家养成属性（来自 data/player_stats.js）
  const ps = createDefaultPlayerStats();

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
      // NPC 好感度（0-100）—— 存放在 npcs 对象里
      npcs: { ...DEFAULT_NPCS },

      // 主线进度
      mainQuestProgress:       0,   // 已完成第几章主线（0 = 还没开始）
      currentMainQuestIndex:   0,   // 当前要触发的主线 index（0-9）
      completedMainQuestIds:  [],   // 已完成的主线 id 列表

      // ===== v3 新增：玩家养成属性（顶层字段）=====
      // 时间系统
      day:              ps.day,
      timeSlot:         ps.timeSlot,
      timeSlotsTotal:   ps.timeSlotsTotal,
      maxTimeSlots:     ps.maxTimeSlots,
      // 5 大属性
      family:           ps.family,
      career:           ps.career,
      independence:     ps.independence,
      romance:          ps.romance,
      resilience:       ps.resilience,
      // 资源
      energy:           ps.energy,
      maxEnergy:        ps.maxEnergy,
      redPacket:        ps.redPacket,
      socialDebt:       ps.socialDebt,

      // ===== v5 新增：危机事件系统字段 =====
      // 嵌套属性镜像（crisis 系统使用 stats.attributes.*）
      attributes: {
        career:       ps.career,
        family:       ps.family,
        independence: ps.independence,
        resilience:   ps.resilience,
        romance:      ps.romance,
        energy:       ps.energy,
      },
      // 剧情标记位
      flags: {},
      // 已触发的危机事件 id 列表
      triggeredCrisisIds: [],
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
    // 补全缺失字段（兼容旧版本）
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

      // v3 迁移：用 PLAYER_STATS 默认值补全任何缺失的玩家养成字段
      const psDefaults = createDefaultPlayerStats();
      for (const [key, val] of Object.entries(psDefaults)) {
        if (state.currentStats[key] === undefined) {
          state.currentStats[key] = val;
        }
      }
      // v5 迁移：补全危机事件系统字段
      if (!state.currentStats.attributes) {
        state.currentStats.attributes = {
          career:       state.currentStats.career       ?? psDefaults.career,
          family:       state.currentStats.family       ?? psDefaults.family,
          independence: state.currentStats.independence ?? psDefaults.independence,
          resilience:   state.currentStats.resilience   ?? psDefaults.resilience,
          romance:      state.currentStats.romance      ?? psDefaults.romance,
          energy:       state.currentStats.energy       ?? psDefaults.energy,
        };
      }
      if (!state.currentStats.flags) state.currentStats.flags = {};
      if (!state.currentStats.triggeredCrisisIds) state.currentStats.triggeredCrisisIds = [];
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