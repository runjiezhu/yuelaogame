// data/timeline.js
// 春节主线时间轴 - 扩展版
// 从腊月二十九到正月初八，共7天，每天3个时间段 = 21个时间段
// 其中 7 个为主线章节（isMain: true），10 个为过渡章节，1 个为结局演出
// 总计：20个主线quest + 10个过渡quest = 30个时间段

export const TIMELINE = [
  // ============================================
  // 腊月二十九（Day 1）- 回家篇
  // ============================================
  { 
    day: 1, 
    slot: 0, 
    label: "腊月二十九 · 上午", 
    desc: "抢票回家", 
    id: "time_d1m",
    date: "腊月二十九",
    isMain: true,
    theme: "抢票"
  },
  { 
    day: 1, 
    slot: 1, 
    label: "腊月二十九 · 下午", 
    desc: "踏上归途", 
    id: "time_d1a",
    date: "腊月二十九",
    isTransition: true
  },
  { 
    day: 1, 
    slot: 2, 
    label: "腊月二十九 · 晚上", 
    desc: "到家第一晚", 
    id: "time_d1e",
    date: "腊月二十九",
    isTransition: true
  },

  // ============================================
  // 除夕（Day 2）- 团圆篇
  // ============================================
  { 
    day: 2, 
    slot: 0, 
    label: "除夕 · 上午", 
    desc: "帮妈妈备年夜饭", 
    id: "time_d2m",
    date: "除夕",
    isTransition: true,
    skillCheck: { attr: "cooking", difficulty: 40, label: "帮妈妈做年夜饭" }
  },
  { 
    day: 2, 
    slot: 1, 
    label: "除夕 · 下午", 
    desc: "贴春联、放鞭炮", 
    id: "time_d2a",
    date: "除夕",
    isTransition: true,
    skillCheck: { attr: "agility", difficulty: 35, label: "爬高贴春联" }
  },
  { 
    day: 2, 
    slot: 2, 
    label: "除夕 · 晚上", 
    desc: "年夜饭 + 春晚", 
    id: "time_d2e",
    date: "除夕",
    isMain: true,
    theme: "年夜饭",
    questId: "quest_cn_02"
  },

  // ============================================
  // 初一（Day 3）- 拜年篇
  // ============================================
  { 
    day: 3, 
    slot: 0, 
    label: "初一 · 上午", 
    desc: "给长辈拜年", 
    id: "time_d3m",
    date: "初一",
    isTransition: true,
    skillCheck: { attr: "social", difficulty: 30, label: "给红包说吉祥话" }
  },
  { 
    day: 3, 
    slot: 1, 
    label: "初一 · 下午", 
    desc: "亲戚连环问", 
    id: "time_d3a",
    date: "初一",
    isMain: true,
    theme: "走亲戚",
    questId: "quest_cn_03"
  },
  { 
    day: 3, 
    slot: 2, 
    label: "初一 · 晚上", 
    desc: "守岁 + 麻将局", 
    id: "time_d3e",
    date: "初一",
    isTransition: true,
    skillCheck: { attr: "luck", difficulty: 45, label: "打麻将手气" }
  },

  // ============================================
  // 初二（Day 4）- 重逢篇
  // ============================================
  { 
    day: 4, 
    slot: 0, 
    label: "初二 · 上午", 
    desc: "回娘家（妈妈家）", 
    id: "time_d4m",
    date: "初二",
    isTransition: true,
    branch: "family"
  },
  { 
    day: 4, 
    slot: 1, 
    label: "初二 · 下午", 
    desc: "老同学聚会", 
    id: "time_d4a",
    date: "初二",
    isMain: true,
    theme: "同学会",
    questId: "quest_cn_04",
    branch: "reunion"
  },
  { 
    day: 4, 
    slot: 2, 
    label: "初二 · 晚上", 
    desc: "和前任深夜长谈", 
    id: "time_d4e",
    date: "初二",
    isTransition: true,
    skillCheck: { attr: "romance", difficulty: 50, label: "挽回前任的心" },
    branch: "ex_romance",
    isKeyNode: true
  },

  // ============================================
  // 初三（Day 5）- 分化篇（两条线在此分化）
  // ============================================
  { 
    day: 5, 
    slot: 0, 
    label: "初三 · 上午", 
    desc: "妈妈安排相亲", 
    id: "time_d5m",
    date: "初三",
    isMain: true,
    theme: "相亲安排",
    questId: "quest_cn_05a",
    branch: "blind_date"
  },
  { 
    day: 5, 
    slot: 1, 
    label: "初三 · 下午", 
    desc: "闺蜜/兄弟来访", 
    id: "time_d5a",
    date: "初三",
    isMain: true,
    theme: "闺蜜来访",
    questId: "quest_cn_05",
    branch: "bestie"
  },
  { 
    day: 5, 
    slot: 2, 
    label: "初三 · 晚上", 
    desc: "相亲前夜", 
    id: "time_d5e",
    date: "初三",
    isTransition: true,
    branch: "blind_date",
    requires: "time_d5m"
  },

  // ============================================
  // 初四（Day 6）- 相亲/复合篇
  // ============================================
  { 
    day: 6, 
    slot: 0, 
    label: "初四 · 上午", 
    desc: "第一次相亲", 
    id: "time_d6m",
    date: "初四",
    isMain: true,
    theme: "第一次相亲",
    questId: "quest_cn_06",
    branch: "blind_date"
  },
  { 
    day: 6, 
    slot: 1, 
    label: "初四 · 下午", 
    desc: "前任退婚抉择", 
    id: "time_d6a",
    date: "初四",
    isTransition: true,
    branch: "ex_romance",
    isKeyNode: true
  },
  { 
    day: 6, 
    slot: 2, 
    label: "初四 · 晚上", 
    desc: "相亲对象微信聊天", 
    id: "time_d6e",
    date: "初四",
    isTransition: true,
    branch: "blind_date"
  },

  // ============================================
  // 初五（Day 7）- 升温篇
  // ============================================
  { 
    day: 7, 
    slot: 0, 
    label: "初五 · 上午", 
    desc: "陪相亲对象逛商场", 
    id: "time_d7m",
    date: "初五",
    isTransition: true,
    skillCheck: { attr: "wealth", difficulty: 40, label: "金钱选择" },
    branch: "blind_date"
  },
  { 
    day: 7, 
    slot: 1, 
    label: "初五 · 下午", 
    desc: "和相亲对象再见面", 
    id: "time_d7a",
    date: "初五",
    isMain: true,
    theme: "再见面",
    questId: "quest_cn_07",
    branch: "blind_date"
  },
  { 
    day: 7, 
    slot: 2, 
    label: "初五 · 晚上", 
    desc: "家族饭局", 
    id: "time_d7e",
    date: "初五",
    isTransition: true,
    branch: "family"
  },

  // ============================================
  // 初六（Day 8）- 抉择篇
  // ============================================
  { 
    day: 8, 
    slot: 0, 
    label: "初六 · 上午", 
    desc: "家庭会议", 
    id: "time_d8m",
    date: "初六",
    isTransition: true,
    skillCheck: { attr: "independence", difficulty: 55, label: "说服父母尊重你的选择" },
    branch: "family",
    isKeyNode: true
  },
  { 
    day: 8, 
    slot: 1, 
    label: "初六 · 下午", 
    desc: "爸妈深夜谈心", 
    id: "time_d8a",
    date: "初六",
    isMain: true,
    theme: "深夜谈心",
    questId: "quest_cn_08"
  },
  { 
    day: 8, 
    slot: 2, 
    label: "初六 · 晚上", 
    desc: "最后的夜晚", 
    id: "time_d8e",
    date: "初六",
    isTransition: true,
    branch: "all"
  },

  // ============================================
  // 初七（Day 9）- 离别篇
  // ============================================
  { 
    day: 9, 
    slot: 0, 
    label: "初七 · 上午", 
    desc: "离别前的准备", 
    id: "time_d9m",
    date: "初七",
    isTransition: true,
    branch: "all"
  },
  { 
    day: 9, 
    slot: 1, 
    label: "初七 · 下午", 
    desc: "火车站送别", 
    id: "time_d9a",
    date: "初七",
    isMain: true,
    theme: "送别",
    questId: "quest_cn_09"
  },
  { 
    day: 9, 
    slot: 2, 
    label: "初七 · 晚上", 
    desc: "返程火车上", 
    id: "time_d9e",
    date: "初七",
    isTransition: true,
    branch: "all"
  },

  // ============================================
  // 初八（Day 10）- 结局篇
  // ============================================
  { 
    day: 10, 
    slot: 0, 
    label: "初八 · 上午", 
    desc: "回到大城市", 
    id: "time_d10m",
    date: "初八",
    isTransition: true,
    branch: "all"
  },
  { 
    day: 10, 
    slot: 1, 
    label: "初八 · 下午", 
    desc: "结局演出", 
    id: "time_d10a",
    date: "初八",
    isEnding: true,
    questId: "quest_cn_10"
  },
  { 
    day: 10, 
    slot: 2, 
    label: "初八 · 晚上", 
    desc: "新的开始", 
    id: "time_d10e",
    date: "初八",
    isEnding: true,
    isFinal: true
  }
];

// 时间轴统计
export const TIMELINE_STATS = {
  totalDays: 10,
  totalSlots: 31,
  mainQuests: 10,
  transitionQuests: 10,
  endingSlots: 2,
  branches: ["reunion", "blind_date", "ex_romance", "bestie", "family", "all"],
  skillChecks: 7
};

// 获取指定日期的所有时间段
export function getTimeSlotsByDay(day) {
  return TIMELINE.filter(t => t.day === day);
}

// 获取指定时间段
export function getTimeSlot(id) {
  return TIMELINE.find(t => t.id === id);
}

// 获取下一个时间段
export function getNextTimeSlot(currentId) {
  const currentIndex = TIMELINE.findIndex(t => t.id === currentId);
  if (currentIndex === -1 || currentIndex >= TIMELINE.length - 1) return null;
  return TIMELINE[currentIndex + 1];
}

// 获取主线时间段
export function getMainTimeSlots() {
  return TIMELINE.filter(t => t.isMain);
}

// 获取关键决策节点
export function getKeyNodes() {
  return TIMELINE.filter(t => t.isKeyNode);
}

// 判断是否进入特定分支
export function checkBranchCondition(branch, stats) {
  if (branch === "all") return true;
  if (branch === "reunion") return stats.exEncountered;
  if (branch === "blind_date") return stats.blindDateStarted;
  if (branch === "ex_romance") return stats.exRomanceStarted;
  if (branch === "bestie") return stats.bestieVisited;
  if (branch === "family") return true;
  return true;
}
