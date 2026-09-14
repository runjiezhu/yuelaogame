// player_stats.js - 玩家状态默认初始值
// 时间系统：day 1=腊月二十九，day 8=正月初七
// 时间段：0=上午，1=下午，2=晚上

export const PLAYER_STATS = {
  // === 时间系统 ===
  day: 1,           // 当前天数（1=腊月二十九，8=初七）
  timeSlot: 0,       // 当前时间段（0=上午，1=下午，2=晚上）
  timeSlotsTotal: 0, // 已消耗总时间段
  maxTimeSlots: 24,  // 最多24个时间段（8天×3）

  // === 5大属性（0-100）===
  family: 50,       // 家庭关系
  career: 50,       // 事业心
  independence: 50, // 独立性
  romance: 50,       // 浪漫值
  resilience: 50,   // 抗压力

  // === 资源 ===
  energy: 100,       // 精力值（0-100）
  maxEnergy: 100,
  redPacket: 2000,   // 红包钱（元）
  socialDebt: 0,     // 人情债（0-10）

  // === NPC好感度（独立存储，与 gameState.js 的 npcs 并存）===
  npc_mom_affection: 50,
  npc_dad_affection: 50,
  npc_grandma_affection: 60,
  npc_bestie_affection: 70,
  npc_ex_affection: 20,
  npc_blind_date_affection: 30,
};

// 克隆初始状态的工厂函数（用于新游戏）
export function createDefaultPlayerStats() {
  return JSON.parse(JSON.stringify(PLAYER_STATS));
}

// 时间段标签
export const TIME_SLOT_LABELS = ["上午", "下午", "晚上"];

// 农历日期标签（day 1-8）
export const LUNAR_DATE_LABELS = [
  "腊月二十九",   // 1
  "除夕",        // 2
  "正月初一",    // 3
  "正月初二",    // 4
  "正月初三",    // 5
  "正月初四",    // 6
  "正月初五",    // 7
  "正月初六",    // 8
];

// 获取当前农历日期标签
export function getLunarDateLabel(day) {
  return LUNAR_DATE_LABELS[day - 1] ?? `第${day}天`;
}

// 5大属性列表（用于遍历显示）
export const ATTRIBUTE_KEYS = [
  { key: "family",      label: "家庭", color: "#5cb85c" },
  { key: "career",      label: "事业", color: "#c9a84c" },
  { key: "independence",label: "独立", color: "#8B5CF6" },
  { key: "romance",     label: "浪漫", color: "#e91e8c" },
  { key: "resilience",  label: "抗压", color: "#2196F3" },
];
