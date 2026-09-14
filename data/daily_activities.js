// daily_activities.js - 时间段活动定义
// 玩家在每天的上午/下午/晚上选择做什么

export const DAILY_ACTIVITIES = {
  // === 主线类活动 ===
  "mainline": {
    label: "📜 推进主线",
    desc: "触发关键剧情事件",
    energyCost: 20,
    available: (stats) => (stats.currentMainQuestIndex ?? 0) < 20,
    effect: { type: "advance_main" }
  },

  // === 社交类活动 ===
  "visit_mom": {
    label: "👩 陪妈妈聊天",
    desc: "帮她做家务或听她唠叨",
    energyCost: 15,
    available: (stats) => (stats.day ?? 1) >= 2,
    effect: { type: "affection", target: "npc_mom_affection", delta: 15 },
    attrEffect: { independence: 2 }
  },
  "visit_dad": {
    label: "👨 陪爸爸喝酒",
    desc: "爷俩喝两杯，说说心里话",
    energyCost: 20,
    available: (stats) => (stats.day ?? 1) >= 2,
    effect: { type: "affection", target: "npc_dad_affection", delta: 15 },
    attrEffect: { family: 5, romance: 3 }
  },
  "visit_grandma": {
    label: "👵 陪奶奶看电视",
    desc: "坐在奶奶身边，一起看春晚重播",
    energyCost: 10,
    available: (stats) => (stats.day ?? 1) >= 2,
    effect: { type: "affection", target: "npc_grandma_affection", delta: 20 },
    attrEffect: { family: 8 }
  },
  "visit_bestie": {
    label: "🤝 约闺蜜/兄弟出来",
    desc: "喝茶聊天，互相吐槽",
    energyCost: 20,
    available: (stats) => (stats.npcs?.npc_bestie ?? 0) >= 50,
    effect: { type: "affection", target: "npc_bestie_affection", delta: 20 },
    attrEffect: { resilience: 5 }
  },
  "visit_ex": {
    label: "💔 主动联系前任",
    desc: "发条消息，或者打个电话",
    energyCost: 15,
    available: (stats) => (stats.npcs?.npc_ex ?? 0) >= 30,
    effect: { type: "affection", target: "npc_ex_affection", delta: 10 },
    attrEffect: { romance: 10 }
  },

  // === 自我提升类 ===
  "read_book": {
    label: "📚 读一本书",
    desc: "难得的安静时光，充实自己",
    energyCost: 15,
    available: () => true,
    effect: { type: "attr", target: "career", delta: 8 },
    attrEffect: { independence: 3 }
  },
  "exercise": {
    label: "🏃 早起跑步",
    desc: "在老家田间小路跑一跑步",
    energyCost: 20,
    available: () => true,
    effect: { type: "attr", target: "resilience", delta: 8 },
    attrEffect: { independence: 5 }
  },
  "meditate": {
    label: "🧘 静心冥想",
    desc: "在老家的院子里发呆放空",
    energyCost: 5,
    available: () => true,
    effect: { type: "attr", target: "resilience", delta: 5 },
    attrEffect: { resilience: 5 }
  },
  "play_games": {
    label: "🎮 刷手机/打游戏",
    desc: "难得的摸鱼时光",
    energyCost: 5,
    available: () => true,
    effect: { type: "attr", target: "career", delta: -3 },
    attrEffect: {}
  },

  // === 消费类 ===
  "shopping": {
    label: "🛒 去镇上逛街",
    desc: "买点年货或给家人买礼物",
    energyCost: 25,
    redPacketCost: 200,
    available: () => true,
    // redPacketCost 已在 applyActivityEffect 中处理，无需重复 effect
    attrEffect: { family: 10 }
  },
  "treat_family": {
    label: "🍽️ 请家人吃饭",
    desc: "带全家人去镇上的餐馆搓一顿",
    energyCost: 20,
    redPacketCost: 500,
    available: (stats) => (stats.redPacket ?? 0) >= 500,
    // redPacketCost 已在 applyActivityEffect 中处理，无需重复 effect
    attrEffect: { family: 20, npc_mom: 15, npc_dad: 15 }
  },
  "buy_gift": {
    label: "🎁 给妈妈买首饰",
    desc: "用一个月的工资买条金项链",
    energyCost: 10,
    redPacketCost: 3000,
    available: (stats) => (stats.redPacket ?? 0) >= 3000,
    // redPacketCost 已在 applyActivityEffect 中处理，无需重复 effect
    attrEffect: { family: 25, npc_mom: 30 }
  },

  // === 休息类 ===
  "nap": {
    label: "😴 午睡休息",
    desc: "好好补个觉",
    energyCost: -30,
    available: (stats) => (stats.energy ?? 100) < 100,
    // 负数 energyCost 已在 applyActivityEffect 中处理恢复精力，无需重复 effect
  },
  "stay_up": {
    label: "🌙 熬夜刷剧",
    desc: "享受难得的自由时光",
    energyCost: 20,
    available: () => true,
    // energyCost 已在 applyActivityEffect 中处理精力消耗，无需重复 effect
    attrEffect: { career: -5 }
  },

  // === 特殊类 ===
  "side_quest": {
    label: "🔍 查看支线任务",
    desc: "看看有什么可以做的",
    energyCost: 0,
    available: () => true,
    effect: { type: "open_side_quests" }
  },
  "check_outcome": {
    label: "🔮 结局预览",
    desc: "看看以目前的属性，最可能的结局是什么",
    energyCost: 0,
    available: () => true,
    effect: { type: "open_outcome_preview" }
  }
};

// 活动分组（用于 UI 渲染）
export const ACTIVITY_GROUPS = [
  {
    id: "mainline",
    title: "🧧 主线",
    activities: ["mainline"]
  },
  {
    id: "social",
    title: "👨‍👩‍👧 社交",
    activities: ["visit_mom", "visit_dad", "visit_grandma", "visit_bestie", "visit_ex"]
  },
  {
    id: "self",
    title: "🌱 自我提升",
    activities: ["read_book", "exercise", "meditate", "play_games"]
  },
  {
    id: "consumer",
    title: "💰 消费",
    activities: ["shopping", "treat_family", "buy_gift"]
  },
  {
    id: "rest",
    title: "😌 休息",
    activities: ["nap", "stay_up"]
  },
  {
    id: "special",
    title: "✨ 特殊",
    activities: ["side_quest", "check_outcome"]
  }
];

// 时间段配置
export const TIME_SLOTS = [
  { id: "morning",   label: "上午", emoji: "🌅" },
  { id: "afternoon", label: "下午", emoji: "🌇" },
  { id: "evening",   label: "晚上", emoji: "🌙" },
];

// 判断活动是否可执行（考虑精力、金钱、可用条件）
export function isActivityAvailable(activity, stats) {
  // 先调用活动自身的 available 条件
  if (activity.available && !activity.available(stats)) return false;

  // 精力检查（消耗为正则需足够，消耗为负数总是可用）
  const energyCost = activity.energyCost ?? 0;
  if (energyCost > 0 && (stats.energy ?? 0) < energyCost) return false;

  // 金钱检查
  if (activity.redPacketCost && (stats.redPacket ?? 0) < activity.redPacketCost) return false;

  return true;
}

// 计算活动的禁用原因（用于 UI 提示）
export function getDisabledReason(activity, stats) {
  const energyCost = activity.energyCost ?? 0;
  if (energyCost > 0 && (stats.energy ?? 0) < energyCost) {
    return `精力不足 (${stats.energy ?? 0}/${energyCost})`;
  }
  if (activity.redPacketCost && (stats.redPacket ?? 0) < activity.redPacketCost) {
    return `红包不够 (¥${stats.redPacket ?? 0}/¥${activity.redPacketCost})`;
  }
  if (activity.available && !activity.available(stats)) {
    return "未解锁";
  }
  return null;
}